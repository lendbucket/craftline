/**
 * RUNTIME CONTRAST AND ACCESSIBILITY AUDIT
 * ========================================
 *
 * Loads every route at a mobile (390px) and a desktop (1280px) viewport,
 * injects axe-core, and runs the WCAG 2.1 A/AA ruleset.
 *
 * Contrast is the headline concern on this property and gets its own section
 * with the exact foreground, background, and ratio for every failing node. The
 * reason it matters more here than on a typical site: Craftline's bronze accent
 * is context sensitive. The bright shade passes on charcoal and fails on paper,
 * the deep shade does the reverse, and globals.css re-pins --color-bronze per
 * surface so `text-bronze` resolves correctly on whatever it sits on. That is a
 * clever mechanism, and clever mechanisms are exactly the ones that break
 * silently when someone nests a card in a section they did not expect. This
 * audit is what catches it.
 *
 * Every other axe violation is reported beneath, so this doubles as a general
 * accessibility gate rather than a single-issue check.
 *
 *   npm run build && npm run contrast-audit
 *   BASE_URL=http://localhost:3000 npm run contrast-audit
 *
 * axe-core is already in node_modules. No new dependency.
 */
import { createRequire } from "node:module";
import { chromium } from "playwright";
import { startNextServer } from "./lib/dev-server.mjs";
import { auditRoutes, PORTS } from "./lib/routes.mjs";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");

const WIDTHS = [390, 1280];
const HEIGHT = 900;

const routes = auditRoutes();

async function auditPage(browser, base, path, width) {
  const context = await browser.newContext({ viewport: { width, height: HEIGHT } });
  const page = await context.newPage();
  try {
    const response = await page.goto(base + path, {
      waitUntil: "load",
      timeout: 90_000,
    });
    if (!response || response.status() >= 400) {
      return {
        error: `HTTP ${response ? response.status() : "no response"}`,
        contrast: [],
        other: [],
      };
    }

    await page.addScriptTag({ path: axePath });
    // `axe` is defined by the script tag injected above, inside the page realm.
    const result = await page.evaluate(async () =>
      axe.run(document, {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
        },
        resultTypes: ["violations"],
      }),
    );

    const contrast = [];
    const other = [];
    for (const violation of result.violations) {
      const bucket = violation.id === "color-contrast" ? contrast : other;
      for (const node of violation.nodes) {
        bucket.push({
          id: violation.id,
          impact: node.impact || violation.impact || "",
          target: Array.isArray(node.target) ? node.target.join(" ") : String(node.target),
          summary: node.failureSummary
            ? node.failureSummary.replace(/\s+/g, " ").trim()
            : "",
          data: node.any?.[0]?.data || null,
        });
      }
    }
    return { error: null, contrast, other };
  } catch (error) {
    return {
      error: `error: ${String(error.message).split("\n")[0]}`,
      contrast: [],
      other: [],
    };
  } finally {
    await context.close();
  }
}

function formatContrast(node) {
  const data = node.data;
  if (data && data.fgColor && data.bgColor) {
    const ratio = data.contrastRatio != null ? `${data.contrastRatio}:1` : "?";
    const needs = data.expectedContrastRatio || "?";
    const size = data.fontSize ? ` (${data.fontSize}, ${data.fontWeight})` : "";
    return `${node.target}\n      fg ${data.fgColor} on bg ${data.bgColor}, ratio ${ratio}, needs ${needs}${size}`;
  }
  return `${node.target}: ${node.summary}`;
}

let server = null;
let browser = null;

try {
  server = await startNextServer({ port: PORTS.contrast });
  console.log(`Server ready at ${server.base}\n`);

  browser = await chromium.launch();

  // Dedupe identical (route, target, colours) hits across widths so the summary
  // counts distinct problems rather than viewport repeats.
  const contrastSeen = new Map();
  const otherSeen = new Map();
  let pageErrors = 0;

  for (const route of routes) {
    for (const width of WIDTHS) {
      const result = await auditPage(browser, server.base, route.path, width);
      if (result.error) {
        console.log(`  ${route.name.padEnd(14)} @${width}: ${result.error}`);
        pageErrors++;
        continue;
      }
      console.log(
        `  ${route.name.padEnd(14)} @${width}: contrast=${
          result.contrast.length === 0 ? "ok" : result.contrast.length + " FAIL"
        }  other-a11y=${result.other.length === 0 ? "ok" : result.other.length + " FAIL"}`,
      );
      for (const node of result.contrast) {
        const key = `${route.name}|${node.target}|${node.data?.fgColor}|${node.data?.bgColor}`;
        if (!contrastSeen.has(key)) contrastSeen.set(key, { route: route.name, ...node });
      }
      for (const node of result.other) {
        const key = `${route.name}|${node.id}|${node.target}`;
        if (!otherSeen.has(key)) otherSeen.set(key, { route: route.name, ...node });
      }
    }
  }

  console.log("\n================ COLOR CONTRAST (WCAG AA) ================");
  if (contrastSeen.size === 0) {
    console.log("  PASS: no color-contrast violations on any route.");
  } else {
    console.log(`  ${contrastSeen.size} distinct contrast violation(s):`);
    for (const node of contrastSeen.values()) {
      console.log(`  - [${node.route}] ${formatContrast(node)}`);
    }
  }

  console.log("\n================ OTHER A11Y (WCAG A/AA) ================");
  if (otherSeen.size === 0) {
    console.log("  PASS: no other WCAG A/AA violations on any route.");
  } else {
    console.log(`  ${otherSeen.size} distinct violation(s):`);
    for (const node of otherSeen.values()) {
      console.log(`  - [${node.route}] ${node.id} (${node.impact}): ${node.target}`);
      if (node.summary) console.log(`      ${node.summary}`);
    }
  }

  const total = contrastSeen.size + otherSeen.size;
  console.log("\n================ RESULT ================");
  if (total === 0 && pageErrors === 0) {
    console.log("ALL GREEN. No WCAG A/AA violations across any route.");
    process.exitCode = 0;
  } else {
    console.log(
      `${contrastSeen.size} contrast + ${otherSeen.size} other violation(s)` +
        `${pageErrors ? `, ${pageErrors} page error(s)` : ""}.`,
    );
    process.exitCode = 1;
  }
} catch (error) {
  console.error(`Harness error: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (server) await server.stop();
}
