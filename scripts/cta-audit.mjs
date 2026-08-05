/**
 * CTA COVERAGE AUDIT
 * ==================
 *
 * Loads every route at a phone and a desktop width and asserts that a reader is
 * never far from a way to make contact.
 *
 *   npm run build && npm run cta-audit
 *
 * WHAT IT ASSERTS, AND WHY EACH ONE
 * ---------------------------------
 *   1. Every route has at least one PRIMARY call to action. Primary means the
 *      solid red control, which on this site means exactly one thing: the place
 *      you act. A page carrying only text links to /franchising has no
 *      conversion path, it has navigation.
 *
 *   2. No stretch of a page runs more than three and a half viewports without a
 *      call to action. A persistent control satisfies this by itself, which is
 *      why the mobile bar exists; without one, the gap between in-flow controls
 *      is what matters, and this reports the largest and where it starts. See
 *      the note on the threshold below for how the number was chosen.
 *
 *   3. Every CTA clears the 44px touch floor at 390px.
 *
 * WHAT IT DELIBERATELY DOES NOT ASSERT
 * ------------------------------------
 * A minimum count. Conversion paths belong at decision points, and a rule that
 * says "three per page" produces three per page whether or not the page has
 * three decisions in it. The gap measurement catches a barren page without
 * inviting anyone to pad a short one.
 *
 * THE LEGAL PAGES ARE EXEMPT FROM RULE 1, ON PURPOSE. Privacy and terms are
 * disclosure documents. Putting a conversion prompt on top of one is in poor
 * taste and, on a franchise property before an FDD is issued, a bad look in
 * front of exactly the reader most likely to be checking.
 */
import { chromium } from "playwright";
import { startNextServer } from "./lib/dev-server.mjs";
import { auditRoutes } from "./lib/routes.mjs";

const PORT = 3147;
const WIDTHS = [
  { width: 390, height: 844, label: "390" },
  { width: 1280, height: 900, label: "1280" },
];

/** Routes that are documents rather than conversion surfaces. */
const NO_CTA_REQUIRED = new Set(["/privacy", "/terms"]);

/**
 * The primary control. Matches the solid button by its background utility
 * rather than by text, so rewording a label cannot silently drop coverage.
 */
const PRIMARY_SEL = 'main [class*="bg-signal-solid"], [data-persistent-cta] [class*="bg-signal-solid"]';
/** Anything that moves a reader toward contact, primary or not. */
const ANY_CTA_SEL = [
  'main [class*="bg-signal-solid"]',
  'main a[href="/contact"]',
  'main a[href*="/franchising#inquiry"]',
  'main [class*="border-control"]',
  'main button[type="submit"]',
  '[data-persistent-cta] a',
].join(",");

function measure(primarySel, anySel) {
  const vh = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;

  const collect = (sel) => {
    const out = [];
    let persistent = false;
    for (const el of document.querySelectorAll(sel)) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;
      const position = getComputedStyle(el).position;
      const fixed =
        position === "fixed" ||
        position === "sticky" ||
        !!el.closest('[class*="fixed"]');
      if (fixed) persistent = true;
      out.push({
        top: rect.top + window.scrollY,
        height: rect.height,
        width: rect.width,
        text: (el.textContent || "").trim().slice(0, 40),
        fixed,
        tapExpanded: el.classList.contains("tap-44"),
      });
    }
    return { items: out.sort((a, b) => a.top - b.top), persistent };
  };

  const primary = collect(primarySel);
  const any = collect(anySel);

  /*
    Largest vertical run with no CTA in it, and WHERE it starts. The position is
    what makes this actionable: a gap figure alone tells you a page is barren
    somewhere, and the offset tells you which section to put a prompt after.
  */
  let largestGap = 0;
  let gapStart = 0;
  let cursor = 0;
  for (const item of any.items) {
    if (item.top - cursor > largestGap) {
      largestGap = item.top - cursor;
      gapStart = cursor;
    }
    cursor = Math.max(cursor, item.top + item.height);
  }
  if (docHeight - cursor > largestGap) {
    largestGap = docHeight - cursor;
    gapStart = cursor;
  }

  /*
    tap-44 expands an element's hit area to 44px through a pseudo element
    without changing its box, so measuring the box alone reports a false
    failure on every inline text link that uses it. Anything carrying the class
    has already met the floor by construction.
  */
  const tooSmall = any.items.filter(
    (i) => !i.fixed && !i.tapExpanded && i.height < 44,
  );

  return {
    docHeight,
    vh,
    primaryCount: primary.items.length,
    primaryPersistent: primary.persistent,
    anyCount: any.items.length,
    largestGapViewports: +(largestGap / vh).toFixed(2),
    gapStartPercent: Math.round((gapStart / docHeight) * 100),
    tooSmall,
  };
}

const server = await startNextServer({ port: PORT });
const base = `http://localhost:${PORT}`;
const browser = await chromium.launch();

const failures = [];
const rows = [];

for (const route of auditRoutes()) {
  for (const viewport of WIDTHS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(`${base}${route.path}`, { waitUntil: "networkidle" });
    /*
      `measure` is defined in this module and the page cannot see it, so its
      source is shipped across and rebuilt inside the browser. Passing the
      function directly would work for a top level arrow, but this one is a
      declaration with a closure-free body and serialising it explicitly is the
      version that cannot break silently if that ever changes.
    */
    const result = await page.evaluate(
      ({ primarySel, anySel, source }) => {
        const fn = new Function(`return (${source})`)();
        return fn(primarySel, anySel);
      },
      { primarySel: PRIMARY_SEL, anySel: ANY_CTA_SEL, source: measure.toString() },
    );

    const exempt = NO_CTA_REQUIRED.has(route.path);

    if (!exempt && result.primaryCount === 0) {
      failures.push(`${route.name} @${viewport.label}: no primary CTA on the page`);
    }
    /*
      3.5 viewports, and the number was arrived at by measurement rather than
      taste. Below about 3 the audit starts demanding a prompt inside a reading
      column every couple of screens, and copy inserted to satisfy a counter is
      exactly the padding this site is trying not to have. 3.5 is roughly one
      full section: long enough to finish an argument without interruption,
      short enough that no page can go barren.

      Mobile never relies on this. The persistent bar satisfies the check
      outright on every route that carries it, which is the point of having it.
    */
    if (!exempt && !result.primaryPersistent && result.largestGapViewports > 3.5) {
      failures.push(
        `${route.name} @${viewport.label}: ${result.largestGapViewports} viewports with no CTA, starting at ${result.gapStartPercent}% down the page`,
      );
    }
    if (viewport.width === 390 && result.tooSmall.length > 0) {
      for (const item of result.tooSmall) {
        failures.push(
          `${route.name} @390: CTA "${item.text}" is ${Math.round(item.height)}px tall, under the 44px floor`,
        );
      }
    }

    rows.push(
      `  ${route.name.padEnd(14)} @${viewport.label.padEnd(5)} primary=${String(result.primaryCount).padEnd(2)} any=${String(result.anyCount).padEnd(2)} persistent=${result.primaryPersistent ? "yes" : "no "} largest gap=${result.largestGapViewports}vh${exempt ? "  (document, exempt)" : ""}`,
    );

    await context.close();
  }
}

console.log(rows.join("\n"));
console.log("\n================ RESULT ================");
if (failures.length) {
  console.log(`${failures.length} failure(s):`);
  for (const f of failures) console.log(`  ${f}`);
  process.exitCode = 1;
} else {
  console.log(
    "ALL GREEN. Every route carries a primary CTA, no barren stretch exceeds three and a half viewports, and every control clears 44px at 390.",
  );
}

await browser.close();
await server.stop();
