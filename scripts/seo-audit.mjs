/**
 * LIGHTHOUSE SEO AUDIT
 * ====================
 *
 * Runs the Lighthouse SEO category against every route and asserts a score of
 * 100 on all of them. SEO category only, so the whole site is covered in one
 * pass rather than the several minutes a full Lighthouse run per page costs.
 *
 * Mobile form factor, because that is the crawl Google actually indexes with.
 *
 *   npm run build && npm run seo-audit
 *   BASE_URL=http://localhost:3000 npm run seo-audit   # drive a running server
 *
 * Craftline specific note: this site targets brand and navigational queries
 * only. There are no city pages and no service pages, and none should ever
 * appear in the route list. A passing SEO score is table stakes here, not the
 * objective; the objective is that a crawler can state what the company is and
 * which entity holds what.
 *
 * IT ALSO GUARDS THE INLINED STYLESHEET, WHICH IS NOT AN SEO CONCERN AND IS
 * HERE ANYWAY. next.config.ts sets experimental.inlineCss, which is worth a
 * measured 330ms of first paint. Next ignores an unknown experimental key
 * rather than failing the build, so if that flag is ever renamed or graduated
 * the site quietly reverts to a render blocking link tag and gets slower with
 * nothing to say so. This asserts the absence of that link on every route, so
 * the revert fails a check instead of shipping. It lives in this file because
 * this is the audit that already loads every route in a real browser.
 *
 * INJECTION VERIFIED, both halves:
 *   catch  experimental.inlineCss set to false, which is the one failure mode
 *          the build does not warn about
 *          -> 27 route(s) serve a render blocking stylesheet link   CAUGHT
 *   miss   the flag on, which emits a <style> block in the head, plus the
 *          Google Fonts preconnect hints on the report pages
 *          -> silent on all 27 routes                               SILENT
 *
 * The near miss is why the check filters on href rather than on the tag: a
 * style element is not a link, and an external stylesheet is not render
 * blocking in the way this guards against.
 */
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";
import { chromium } from "playwright";
import { startNextServer } from "./lib/dev-server.mjs";
import { auditRoutes, PORTS } from "./lib/routes.mjs";

const routes = auditRoutes();

let server = null;
let chrome = null;

try {
  server = await startNextServer({ port: PORTS.seo });
  console.log(`Server ready at ${server.base}\n`);

  chrome = await chromeLauncher.launch({
    // Reuse Playwright's Chromium so the repo has exactly one browser download
    // to manage rather than two that can drift apart in version.
    chromePath: chromium.executablePath(),
    chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
  });

  /*
    One browser pass for the stylesheet check, before Lighthouse runs. It reads
    the served markup rather than the built file, because the question is what
    a client receives.

    Only same origin links count. The check must stay silent on the style block
    the flag emits, and on any external stylesheet a future page might legally
    carry, so it filters on href rather than on the tag alone.
  */
  const blockingCss = [];
  {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    for (const route of routes) {
      await page.goto(server.base + route.path, { waitUntil: "load", timeout: 90_000 });
      const found = await page.evaluate(() =>
        [...document.querySelectorAll('link[rel="stylesheet"]')]
          .map((l) => l.getAttribute("href") ?? "")
          .filter((href) => !href.startsWith("http")),
      );
      if (found.length) {
        blockingCss.push(
          route.name + ": a render blocking stylesheet link is present (" + found.join(", ") + ")",
        );
      }
    }
    await browser.close();
  }

  const rows = [];
  for (const route of routes) {
    try {
      const result = await lighthouse(
        `${server.base}${route.path}`,
        {
          port: chrome.port,
          output: "json",
          logLevel: "error",
          onlyCategories: ["seo"],
        },
        {
          extends: "lighthouse:default",
          settings: {
            formFactor: "mobile",
            screenEmulation: {
              mobile: true,
              width: 390,
              height: 844,
              deviceScaleFactor: 2,
              disabled: false,
            },
          },
        },
      );

      const category = result.lhr.categories.seo;
      const score = Math.round(category.score * 100);

      // Collect the failing audits that actually carry weight in the score, so
      // a red line says what to fix instead of just how red it is.
      const failed = Object.values(result.lhr.audits)
        .filter(
          (audit) =>
            audit.score !== null &&
            audit.score < 1 &&
            category.auditRefs.some(
              (ref) => ref.id === audit.id && ref.weight > 0,
            ),
        )
        .map((audit) => audit.id);

      rows.push({ ...route, score, failed });
    } catch (error) {
      rows.push({
        ...route,
        score: 0,
        failed: [`error: ${String(error.message).split("\n")[0]}`],
      });
    }
  }

  console.log("================ LIGHTHOUSE SEO (mobile) ================");
  for (const row of rows) {
    const detail = row.failed.length ? `   <- ${row.failed.join(", ")}` : "";
    console.log(
      `  ${row.name.padEnd(14)} ${row.path.padEnd(28)} ${String(row.score).padStart(3)}${detail}`,
    );
  }

  const under = rows.filter((row) => row.score < 100);

  if (blockingCss.length) {
    console.log("\n================ RENDER BLOCKING CSS ================");
    for (const line of blockingCss) console.log(`  ${line}`);
    console.log(
      "  experimental.inlineCss in next.config.ts is not taking effect. See the note in that file.",
    );
  }

  console.log("\n================ RESULT ================");
  if (under.length === 0 && blockingCss.length === 0) {
    console.log(
      `ALL GREEN. ${rows.length} route(s) score SEO 100, and none serves a render blocking stylesheet link.`,
    );
    process.exitCode = 0;
  } else if (under.length === 0) {
    console.log(
      `${blockingCss.length} route(s) serve a render blocking stylesheet link. SEO scores are all 100.`,
    );
    process.exitCode = 1;
  } else {
    console.log(`${under.length}/${rows.length} route(s) below SEO 100:`);
    for (const row of under) {
      console.log(`  - ${row.path}: ${row.score} (${row.failed.join(", ") || "see report"})`);
    }
    process.exitCode = 1;
  }
} catch (error) {
  console.error(`Harness error: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (chrome) {
    try {
      await chrome.kill();
    } catch {
      // Already gone.
    }
  }
  if (server) await server.stop();
}
