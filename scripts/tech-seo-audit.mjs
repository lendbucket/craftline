#!/usr/bin/env node
/**
 * TECHNICAL SEO CRAWL
 * ===================
 *
 *   npm run build && node scripts/tech-seo-audit.mjs
 *
 * Reports the current state before anyone proposes work on it. This is a
 * measurement, not a scorer: it prints what is there and flags only the things
 * that are outside a stated band, so a clean site produces a short report
 * rather than an invented workstream.
 *
 * WHAT IT CHECKS
 *   Title and description length against the bands search results actually
 *   truncate at, and where the page's target term sits in the title.
 *   Duplicate titles and descriptions across routes.
 *   Canonical presence, absolute form, and self reference.
 *   Schema presence and required fields per @type.
 *   Breadcrumb coverage on every route that is not the home page.
 *   Sitemap truth: every prerendered route present, nothing listed that 404s.
 *   Internal link graph, inbound counts, and orphans.
 */
import { chromium } from "playwright";
import { startNextServer } from "./lib/dev-server.mjs";
import { auditRoutes } from "./lib/routes.mjs";

const PORT = 3220;

/*
  BANDS. Google truncates on pixel width rather than characters, so these are
  the character ranges that map to the usual desktop cut. Outside them is a
  flag, not a failure: a short title on a legal page is correct.
*/
const TITLE = { min: 30, max: 60 };
const DESC = { min: 110, max: 160 };

const server = await startNextServer({ port: PORT });
const browser = await chromium.launch();
const pages = {};

try {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  const routes = auditRoutes();

  for (const route of routes) {
    await page.goto(server.base + route.path, {
      waitUntil: "load",
      timeout: 90_000,
    });
    pages[route.path] = await page.evaluate(() => {
      const norm = (s) => (s ?? "").replace(/\s+/g, " ").trim();
      const meta = (n) =>
        norm(
          document
            .querySelector(`meta[name="${n}"],meta[property="${n}"]`)
            ?.getAttribute("content"),
        );
      const schemas = [];
      for (const s of document.querySelectorAll(
        'script[type="application/ld+json"]',
      )) {
        try {
          schemas.push(JSON.parse(s.textContent ?? "{}"));
        } catch {
          schemas.push({ "@type": "UNPARSEABLE" });
        }
      }
      const links = [...document.querySelectorAll("a[href]")].map((a) => ({
        href: a.getAttribute("href"),
        text: norm(a.textContent),
        rel: a.getAttribute("rel") ?? "",
      }));
      return {
        title: norm(document.title),
        description: meta("description"),
        ogTitle: meta("og:title"),
        ogDesc: meta("og:description"),
        canonical:
          document.querySelector('link[rel="canonical"]')?.getAttribute("href") ??
          null,
        robots: meta("robots") || null,
        h1: [...document.querySelectorAll("h1")].map((h) => norm(h.textContent)),
        headingOutline: [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map(
          (h) => Number(h.tagName[1]),
        ),
        schemas,
        links,
      };
    });
  }

  /* Sitemap truth */
  await page.goto(server.base + "/sitemap.xml", { waitUntil: "load" });
  const sitemap = await page.evaluate(() =>
    [...document.querySelectorAll("loc")].map((l) =>
      (l.textContent ?? "").replace(/^https?:\/\/[^/]+/, ""),
    ),
  );

  const paths = routes.map((r) => r.path);
  const flags = [];

  /* ---------- table ---------- */
  const pad = (s, n) => String(s).padEnd(n);
  console.log("\n=== TITLES AND DESCRIPTIONS ===\n");
  console.log(
    `  ${pad("ROUTE", 46)} ${pad("TITLE", 6)} ${pad("DESC", 5)} ${pad("TERM@", 6)} CANON  SCHEMA`,
  );
  console.log(`  ${"-".repeat(96)}`);
  for (const p of paths) {
    const d = pages[p];
    const types = d.schemas
      .map((s) => s["@type"])
      .filter(Boolean)
      .join(",");
    /* Where the route's own subject appears in the title. */
    const subject = d.h1[0] ?? "";
    const firstWord = subject.split(" ").slice(0, 2).join(" ").toLowerCase();
    const at = firstWord
      ? d.title.toLowerCase().indexOf(firstWord.slice(0, 12))
      : -1;
    const canonOk =
      d.canonical &&
      d.canonical.startsWith("http") &&
      d.canonical.replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "") ===
        p.replace(/\/$/, "");
    console.log(
      `  ${pad(p.slice(0, 46), 46)} ${pad(d.title.length, 6)} ${pad(d.description.length, 5)} ${pad(at < 0 ? "-" : at, 6)} ${pad(canonOk ? "ok" : "BAD", 6)} ${types}`,
    );
    if (d.title.length > TITLE.max)
      flags.push(`title ${d.title.length} chars, over ${TITLE.max}: ${p}`);
    if (d.title.length < TITLE.min)
      flags.push(`title ${d.title.length} chars, under ${TITLE.min}: ${p}`);
    if (d.description.length > DESC.max)
      flags.push(`description ${d.description.length} chars, over ${DESC.max}: ${p}`);
    if (d.description.length < DESC.min)
      flags.push(`description ${d.description.length} chars, under ${DESC.min}: ${p}`);
    if (!canonOk) flags.push(`canonical not self referential or not absolute: ${p}`);
    if (d.h1.length !== 1) flags.push(`${d.h1.length} h1 elements: ${p}`);
  }

  /* ---------- duplicates ---------- */
  const dupes = (key) => {
    const m = new Map();
    for (const p of paths) {
      const v = pages[p][key];
      m.set(v, [...(m.get(v) ?? []), p]);
    }
    return [...m.entries()].filter(([, ps]) => ps.length > 1);
  };
  console.log("\n=== DUPLICATES ===");
  for (const key of ["title", "description", "ogTitle", "ogDesc"]) {
    const d = dupes(key);
    console.log(`  ${pad(key, 14)} ${d.length} duplicate group(s)`);
    for (const [v, ps] of d)
      console.log(`      "${v.slice(0, 60)}" on ${ps.join(", ")}`);
    if (d.length) flags.push(`${d.length} duplicate ${key} group(s)`);
  }

  /* ---------- schema ---------- */
  console.log("\n=== SCHEMA ===");
  const typeCount = new Map();
  for (const p of paths) {
    for (const s of pages[p].schemas) {
      const t = s["@type"] ?? "?";
      typeCount.set(t, (typeCount.get(t) ?? 0) + 1);
      if (t === "Article") {
        for (const f of ["headline", "datePublished", "author", "publisher"])
          if (!s[f]) flags.push(`Article schema missing ${f}: ${p}`);
      }
      if (t === "BreadcrumbList" && !Array.isArray(s.itemListElement))
        flags.push(`BreadcrumbList without itemListElement: ${p}`);
      if (t === "UNPARSEABLE") flags.push(`unparseable JSON-LD: ${p}`);
    }
  }
  for (const [t, n] of [...typeCount].sort())
    console.log(`  ${pad(t, 18)} ${n}`);
  const noCrumb = paths.filter(
    (p) =>
      p !== "/" && !pages[p].schemas.some((s) => s["@type"] === "BreadcrumbList"),
  );
  console.log(
    `  breadcrumb coverage: ${paths.length - 1 - noCrumb.length} of ${paths.length - 1} non-home routes`,
  );
  if (noCrumb.length)
    flags.push(`no BreadcrumbList on: ${noCrumb.join(", ")}`);
  const faq = [...typeCount].filter(([t]) => /FAQ/i.test(t));
  console.log(`  FAQPage schema:      ${faq.length ? faq : "none"}`);

  /* ---------- sitemap truth ---------- */
  console.log("\n=== SITEMAP ===");
  const missing = paths.filter((p) => !sitemap.includes(p));
  const extra = sitemap.filter((p) => !paths.includes(p));
  console.log(`  entries ${sitemap.length}, prerendered routes ${paths.length}`);
  console.log(`  in routes but not sitemap: ${missing.length} ${missing.join(" ")}`);
  console.log(`  in sitemap but not routes: ${extra.length} ${extra.join(" ")}`);
  if (missing.length) flags.push(`sitemap missing ${missing.join(", ")}`);
  if (extra.length) flags.push(`sitemap lists non-routes ${extra.join(", ")}`);

  /* ---------- internal links, inbound and orphans ---------- */
  console.log("\n=== INTERNAL LINK HEALTH ===");
  const inbound = new Map(paths.map((p) => [p, new Set()]));
  let broken = [];
  let externalCount = 0;
  for (const p of paths) {
    for (const l of pages[p].links) {
      const href = l.href ?? "";
      if (/^https?:\/\//.test(href)) {
        externalCount++;
        if (!/craftlinebrands\.com/.test(href) && !l.rel.includes("noopener"))
          flags.push(`outbound link without rel=noopener on ${p}: ${href}`);
        continue;
      }
      if (href.startsWith("#") || href.startsWith("mailto:")) continue;
      const target = href.split("#")[0].replace(/\/$/, "") || "/";
      if (!paths.includes(target)) {
        broken.push(`${p} -> ${href}`);
        continue;
      }
      if (target !== p) inbound.get(target).add(p);
    }
  }
  console.log(`  broken internal links: ${broken.length}`);
  for (const b of broken) console.log(`      ${b}`);
  if (broken.length) flags.push(`${broken.length} broken internal link(s)`);
  console.log(`  outbound links: ${externalCount}`);
  console.log(`\n  ${pad("ROUTE", 46)} INBOUND  FROM`);
  const orphans = [];
  for (const p of paths) {
    const from = [...inbound.get(p)];
    if (p !== "/" && from.length === 0) orphans.push(p);
    console.log(
      `  ${pad(p.slice(0, 46), 46)} ${pad(from.length, 8)} ${from.slice(0, 3).join(" ")}${from.length > 3 ? ` +${from.length - 3}` : ""}`,
    );
  }
  console.log(`\n  orphans (no inbound internal link): ${orphans.length} ${orphans.join(" ")}`);
  if (orphans.length) flags.push(`orphaned: ${orphans.join(", ")}`);

  /* ---------- verdict ---------- */
  console.log("\n================ FLAGS ================");
  if (!flags.length) console.log("  none. Nothing outside band, nothing broken.");
  else for (const f of flags) console.log(`  ${f}`);
  console.log(`\n  ${flags.length} flag(s) across ${paths.length} routes.`);

  await context.close();
} finally {
  await browser.close();
  await server.stop();
}
