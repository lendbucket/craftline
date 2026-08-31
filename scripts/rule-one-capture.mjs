#!/usr/bin/env node
/**
 * RULE ONE VERIFICATION, CAPTURE HALF
 * ===================================
 *
 *   npm run build && node scripts/rule-one-capture.mjs <label> <outfile>
 *
 * Crawls every audited route and writes a complete inventory to JSON. Run once
 * on each side of the comparison, then diff the two files with
 * scripts/rule-one-compare.mjs.
 *
 * THE METHOD IS THE ONE FIXED IN BACKLOG.md BEFORE ANY RESULT EXISTED, and it
 * inherits nothing from the Phase 1 scan: no length floor, no prefix window,
 * every item compared as a complete normalised string. The Phase 1 definition
 * used a 40 character floor and a nine word window and missed three real claims
 * at 14, 15 and 17 characters.
 *
 * TEN INVENTORIES PER ROUTE:
 *
 *   1  title, in full
 *   2  every meta content value: description, Open Graph, Twitter
 *   3  canonical href and the robots directives
 *   4  every heading h1 to h6, carrying its level so a demotion is visible
 *   5  every anchor, as a text and href pair
 *   6  every button and submit control, its text
 *   7  every attribute that reaches a person: alt, aria-label, title, and the
 *      text of each aria-describedby and aria-labelledby target
 *   8  every JSON-LD block, flattened to sorted key and string value pairs
 *   9  the complete visible text of main, header and footer, separately
 *  10  the route set, from the prerendered output and from the sitemap
 *
 * ON ITEM 9. The whole region as one string would differ on any reordering,
 * which is presentation rather than content, so it is captured two ways: as a
 * word multiset, which is immune to order and gives an exact count of words
 * gained or lost, and as the list of leaf text blocks, which is what makes a
 * difference readable by a person. Both are written out.
 */
import { writeFileSync } from "node:fs";
import { chromium } from "playwright";
import { startNextServer } from "./lib/dev-server.mjs";
import { auditRoutes } from "./lib/routes.mjs";

const label = process.argv[2] ?? "unlabelled";
const outFile = process.argv[3] ?? `scratch/rule-one-${label}.json`;
const PORT = 3210;

const server = await startNextServer({ port: PORT });
const browser = await chromium.launch();
const routes = {};

try {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  for (const route of auditRoutes()) {
    await page.goto(server.base + route.path, {
      waitUntil: "load",
      timeout: 90_000,
    });

    routes[route.path] = await page.evaluate(() => {
      const norm = (s) => (s ?? "").replace(/\s+/g, " ").trim();

      /* ---- 9: visible text of a region ---- */
      const visibleText = (root) => {
        if (!root) return "";
        const out = [];
        const walk = (node) => {
          for (const child of node.childNodes) {
            if (child.nodeType === Node.TEXT_NODE) {
              out.push(child.textContent ?? "");
              continue;
            }
            if (child.nodeType !== Node.ELEMENT_NODE) continue;
            const el = child;
            if (el.tagName === "SCRIPT" || el.tagName === "STYLE") continue;
            if (el.getAttribute("aria-hidden") === "true") continue;
            walk(el);
          }
        };
        walk(root);
        return norm(out.join(" "));
      };

      /* Leaf text blocks: the smallest elements that own their own text. */
      const leafBlocks = (root) => {
        if (!root) return [];
        const sel =
          "p,li,dt,dd,h1,h2,h3,h4,h5,h6,a,button,label,legend,figcaption,time,small,td,th,summary,span";
        return [...root.querySelectorAll(sel)]
          .filter((el) => {
            if (el.closest("[aria-hidden='true']")) return false;
            // Keep only elements with no descendant that also matches, so text
            // is counted once at the level that owns it.
            return !el.querySelector(sel);
          })
          .map((el) => norm(el.textContent))
          .filter(Boolean);
      };

      /* ---- 8: JSON-LD flattened to sorted key=value pairs ---- */
      const flatten = (value, path, acc) => {
        if (value === null || value === undefined) return acc;
        if (Array.isArray(value)) {
          value.forEach((v, i) => flatten(v, `${path}[${i}]`, acc));
          return acc;
        }
        if (typeof value === "object") {
          for (const k of Object.keys(value).sort()) {
            flatten(value[k], path ? `${path}.${k}` : k, acc);
          }
          return acc;
        }
        acc.push(`${path}=${String(value)}`);
        return acc;
      };
      const jsonLd = [];
      for (const s of document.querySelectorAll(
        'script[type="application/ld+json"]',
      )) {
        try {
          flatten(JSON.parse(s.textContent ?? "{}"), "", jsonLd);
        } catch {
          jsonLd.push("UNPARSEABLE_JSON_LD");
        }
      }
      jsonLd.sort();

      /* ---- 7: attribute text, including described-by targets ---- */
      const attrText = [];
      for (const el of document.querySelectorAll(
        "[alt],[aria-label],[title],[aria-describedby],[aria-labelledby]",
      )) {
        const alt = el.getAttribute("alt");
        if (alt !== null) attrText.push(`alt=${norm(alt)}`);
        const al = el.getAttribute("aria-label");
        if (al) attrText.push(`aria-label=${norm(al)}`);
        const t = el.getAttribute("title");
        if (t) attrText.push(`title=${norm(t)}`);
        for (const rel of ["aria-describedby", "aria-labelledby"]) {
          const ids = el.getAttribute(rel);
          if (!ids) continue;
          for (const id of ids.split(/\s+/)) {
            const target = document.getElementById(id);
            attrText.push(`${rel}:${id}=${norm(target?.textContent)}`);
          }
        }
      }

      const metaOf = (attr, name) => {
        const el = document.querySelector(`meta[${attr}="${name}"]`);
        return el ? norm(el.getAttribute("content")) : null;
      };
      const metas = [];
      for (const el of document.querySelectorAll("meta[name],meta[property]")) {
        const key = el.getAttribute("name") ?? el.getAttribute("property");
        metas.push(`${key}=${norm(el.getAttribute("content"))}`);
      }
      metas.sort();

      const main = document.querySelector("main");
      const header = document.querySelector("header");
      const footer = document.querySelector("footer");

      return {
        title: norm(document.title),
        metas,
        canonical:
          document.querySelector('link[rel="canonical"]')?.getAttribute("href") ??
          null,
        robots: metaOf("name", "robots"),
        headings: [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")]
          .filter((h) => !h.closest("[aria-hidden='true']"))
          .map((h) => `${h.tagName}:${norm(h.textContent)}`),
        anchors: [...document.querySelectorAll("a")].map(
          (a) => `${norm(a.textContent)} -> ${a.getAttribute("href")}`,
        ),
        buttons: [
          ...document.querySelectorAll(
            "button,input[type=submit],input[type=button]",
          ),
        ].map((b) => norm(b.textContent || b.getAttribute("value"))),
        attrText: attrText.sort(),
        jsonLd,
        mainWords: visibleText(main).split(" ").filter(Boolean),
        headerWords: visibleText(header).split(" ").filter(Boolean),
        footerWords: visibleText(footer).split(" ").filter(Boolean),
        mainBlocks: leafBlocks(main),
        headerBlocks: leafBlocks(header),
        footerBlocks: leafBlocks(footer),
      };
    });
  }

  /* ---- 10: the route set, from the sitemap ---- */
  await page.goto(server.base + "/sitemap.xml", { waitUntil: "load" });
  const sitemap = await page.evaluate(() =>
    [...document.querySelectorAll("loc")].map((l) => l.textContent ?? ""),
  );

  writeFileSync(
    outFile,
    JSON.stringify(
      {
        label,
        routeList: auditRoutes().map((r) => r.path).sort(),
        sitemap: sitemap.map((u) => u.replace(/^https?:\/\/[^/]+/, "")).sort(),
        routes,
      },
      null,
      1,
    ),
  );
  console.log(
    `${label}: captured ${Object.keys(routes).length} routes, ${sitemap.length} sitemap entries -> ${outFile}`,
  );
  await context.close();
} finally {
  await browser.close();
  await server.stop();
}
