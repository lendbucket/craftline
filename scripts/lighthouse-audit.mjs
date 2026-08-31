/**
 * LIGHTHOUSE AUDIT
 * ================
 *
 * Runs Lighthouse against one route per template and reports the four category
 * scores plus the three metrics this build is actually accountable for.
 *
 *   npm run build && npm run lighthouse
 *
 * WHY IT EXISTS NOW. Phase 2A replaced the type system, and the display face
 * arrived without the metric matched fallback next/font normally generates:
 *
 *   Failed to find font override values for font `Big Shoulders`
 *
 * The fallback is declared by hand in globals.css instead, from measurements
 * taken by `npm run font-metrics`. That is a claim about cumulative layout
 * shift, and a claim about layout shift that nobody has measured is a guess.
 * This is what turns it into a number.
 *
 * MOBILE EMULATION AND THROTTLING ARE ON. Lighthouse's default mobile preset
 * simulates a slow connection, which is the condition under which a font swap
 * actually moves a page. Running desktop unthrottled would report a CLS of zero
 * on a site with no fallback at all and prove nothing.
 *
 * ONE ROUTE PER TEMPLATE. The eighteen articles share a template, so auditing
 * all of them would spend twenty minutes confirming the same number. The list
 * below is one of each, and it is an explicit list rather than a sample of the
 * audit routes because that is the point: every template gets measured, not the
 * ones that happen to be fast.
 *
 * THRESHOLDS are asserted rather than printed, because a report nobody fails is
 * a report nobody reads. See the note on LIMITS for why the LCP ceiling is not
 * the field boundary.
 */
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";
import { startNextServer } from "./lib/dev-server.mjs";

const PORT = 3149;

/**
 * One route per template.
 *
 * THE 404 IS NOT IN THIS LIST AND CANNOT BE. Lighthouse refuses to score a
 * response that is not 200; asking it to audit /this-does-not-exist returns
 * zeroes across all four categories, which reads as a catastrophic failure of a
 * page that is in fact fine. The 404 template is covered by the contrast,
 * mobile and voice audits through the route list, and by the screenshot pass.
 * Ten templates here, and the eleventh is checked elsewhere rather than
 * checked badly here.
 */
const TEMPLATES = [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "brands", path: "/brands" },
  { name: "brand detail", path: "/brands/wattsmith-electric" },
  { name: "franchising", path: "/franchising" },
  { name: "insights hub", path: "/insights" },
  { name: "article", path: "/insights/how-a-franchise-brand-system-works" },
  { name: "contact", path: "/contact" },
  { name: "privacy", path: "/privacy" },
  { name: "terms", path: "/terms" },
];

/**
 * THRESHOLDS, AND WHY THE LCP ONE IS NOT 2.5 SECONDS.
 *
 * CLS is the one with a specific reason to be here. 0.1 is the Core Web Vitals
 * "good" boundary. It measures 0.000 on every template, and what earns that is
 * the display face preload rather than the hand built fallback: with the
 * preload removed the same build measures 0.047 on the home page, because the
 * headline loses a line when the real face arrives. See the note in
 * src/app/layout.tsx for the full measurement.
 *
 * LCP IS SET AT 3.5s, WHICH IS NOT THE FIELD BOUNDARY, AND THE GAP IS
 * DELIBERATE RATHER THAN CONVENIENT. Lighthouse mobile does not measure LCP
 * under throttling; it observes an unthrottled load and simulates a slow one.
 * That simulated figure runs well above what the same build produces under
 * throttling actually applied. Measured with Chrome DevTools network and CPU
 * throttling at the same profile, the home page LCP element paints at 856ms
 * where Lighthouse reports 2.41s. Asserting the 2.5s field boundary against a
 * lab simulation compares two different quantities.
 *
 * So this is a REGRESSION CEILING, not a quality bar. What it is set against:
 *
 *   main before Phase 2A     home 2.28s   franchising 2.33s
 *   Phase 2A as shipped      home 2.41s   franchising 2.70s   article 3.22s
 *
 * The redesign costs between 0.1 and 0.4 seconds of simulated LCP, and the cost
 * is font payload: three type roles where there were two, and a body face
 * Google serves as static weights rather than as one variable file. That is
 * recorded as an open item in the Phase 2A report rather than hidden behind a
 * threshold. 3.5s leaves headroom over the slowest template and still fails on
 * a real regression.
 *
 * IF YOU RAISE THIS NUMBER, say here what you measured and why. A ceiling moved
 * to make a run pass is not a ceiling.
 */
const LIMITS = {
  cls: 0.1,
  lcpSeconds: 3.5,
  performance: 0.9,
  accessibility: 1,
  "best-practices": 0.9,
  seo: 1,
};

const server = await startNextServer({ port: PORT });
const chrome = await launch({
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
});

const rows = [];
const failures = [];

try {
  for (const template of TEMPLATES) {
    const result = await lighthouse(
      server.base + template.path,
      { port: chrome.port, output: "json", logLevel: "error" },
      undefined,
    );
    if (!result) throw new Error(`lighthouse returned nothing for ${template.path}`);
    const lhr = result.lhr;

    const score = (id) => lhr.categories[id]?.score ?? 0;
    const cls = lhr.audits["cumulative-layout-shift"]?.numericValue ?? 0;
    const lcp = (lhr.audits["largest-contentful-paint"]?.numericValue ?? 0) / 1000;

    rows.push(
      `  ${template.name.padEnd(14)} perf ${(score("performance") * 100).toFixed(0).padStart(3)}  ` +
        `a11y ${(score("accessibility") * 100).toFixed(0).padStart(3)}  ` +
        `bp ${(score("best-practices") * 100).toFixed(0).padStart(3)}  ` +
        `seo ${(score("seo") * 100).toFixed(0).padStart(3)}  ` +
        `CLS ${cls.toFixed(3)}  LCP ${lcp.toFixed(2)}s`,
    );

    if (cls > LIMITS.cls) {
      failures.push(
        `${template.name}: CLS ${cls.toFixed(3)}, over the ${LIMITS.cls} boundary`,
      );
    }
    if (lcp > LIMITS.lcpSeconds) {
      failures.push(
        `${template.name}: LCP ${lcp.toFixed(2)}s, over the ${LIMITS.lcpSeconds}s boundary`,
      );
    }
    for (const category of ["performance", "accessibility", "best-practices", "seo"]) {
      if (score(category) < LIMITS[category]) {
        failures.push(
          `${template.name}: ${category} ${(score(category) * 100).toFixed(0)}, under the ${(LIMITS[category] * 100).toFixed(0)} floor`,
        );
      }
    }
  }
} finally {
  /*
    chrome-launcher deletes its temporary profile directory inside kill(), and
    on Windows Chrome has usually not released the handle yet, so the rmSync
    throws EPERM. That threw out of this finally block and destroyed a complete
    set of results on the first run. The browser is still terminated; only the
    cleanup fails, and the directory is under the system temp path where it is
    collected anyway. A failure to tidy up must never be able to eat the report.
  */
  try {
    await chrome.kill();
  } catch (error) {
    console.warn(
      `  (chrome cleanup: ${error instanceof Error ? error.message.split("\n")[0] : String(error)})`,
    );
  }
  await server.stop();
}

console.log(rows.join("\n"));
console.log("\n================ RESULT ================");
if (failures.length) {
  console.log(`${failures.length} failure(s):`);
  for (const failure of failures) console.log(`  ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `ALL GREEN. ${TEMPLATES.length} template(s): CLS under ${LIMITS.cls}, LCP under ${LIMITS.lcpSeconds}s, accessibility and SEO at 100.`,
  );
}
