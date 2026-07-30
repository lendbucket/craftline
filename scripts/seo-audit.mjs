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

  console.log("\n================ RESULT ================");
  if (under.length === 0) {
    console.log(`ALL GREEN. ${rows.length} route(s) score SEO 100.`);
    process.exitCode = 0;
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
