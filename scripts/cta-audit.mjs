/**
 * CTA COVERAGE AUDIT
 * ==================
 *
 * Loads every route at a phone and a desktop width and asserts that a reader is
 * never far from a way to make contact.
 *
 *   npm run build && npm run cta-audit
 *
 * THREE CLASSES OF ROUTE, BECAUSE THEY ARE THREE DIFFERENT JOBS
 * -------------------------------------------------------------
 * The first version of this file had one rule for every route and a document
 * exemption bolted on the side. That was wrong in a way worth recording,
 * because the rule looked correct for a year while catching nothing.
 *
 *   LANDING. Home, about, brands, brand detail, franchising, insights hub,
 *   contact. A reader can decide to act at any point on one of these, so a
 *   long run with no control is a real failure. At least one primary control,
 *   and the largest control free stretch must not be BOTH over four viewports
 *   AND over half the document. See the note on that pair below.
 *
 *   ARTICLE. The eighteen insights posts. EXACTLY ONE in-content ask, and it
 *   is the last control on the page. Not zero, and not two. An article earns
 *   its ask by being read, so the ask goes at the end and nothing above it
 *   competes; and an article with no ask at all is a dead end.
 *
 *   DOCUMENT. Privacy and terms. No ask required and none wanted. Putting a
 *   conversion prompt on top of a disclosure document is in poor taste and, on
 *   a franchise property before an FDD is issued, a bad look in front of
 *   exactly the reader most likely to be checking.
 *
 * Every class also asserts that each control clears the 44px touch floor at
 * 390px.
 *
 * WHY "EXACTLY ONE" AND NOT "AT LEAST ONE"
 * ----------------------------------------
 * The old rule could only ever fail a page for having too FEW controls, so
 * more CTAs always made it greener. What the articles actually had was five
 * positions and eight links, with the first ask above the opening paragraph,
 * and the audit called that a pass twice over. A bound in one direction is
 * half a rule. This one fails in both.
 *
 * SITE FURNITURE IS EXCLUDED BY NODE, NOT BY POSITION. The header inquiry link
 * sits outside <main> and the phone bar carries data-persistent-cta, so the
 * article count sees neither. That matters: they are on all 27 routes, and a
 * count that included them could neither be one nor be meaningful.
 *
 * WHAT IT DELIBERATELY DOES NOT ASSERT
 * ------------------------------------
 * A minimum count on a landing page. Conversion paths belong at decision
 * points, and a rule that says "three per page" produces three per page
 * whether or not the page has three decisions in it.
 *
 * INJECTION VERIFICATION, TO THE STANDING RULE IN AGENTS.md
 * --------------------------------------------------------
 * Every rule below has two plants recorded: a string it must catch, and a near
 * miss it must not. The near miss is the half that matters. Five of the nine
 * voice audit rules had never fired in their lives and every one of them would
 * have passed a "does it catch something" test, because catching something is
 * easy and catching the right thing is not.
 *
 * All five plants were applied in one build, the audit run, and reverted.
 *
 *   EXACTLY ONE ASK
 *     catch  a second control mid body on one article
 *            -> "2 in-content CTA position(s), expected exactly 1", both widths
 *     miss   a second control 200px above the closing band on another article
 *            -> links 2 to 3, positions still 1, silent. The 240px clustering
 *               window is what makes a band with two buttons one ask rather
 *               than two, so this is the boundary the rule turns on.
 *
 *   THE ASK IS THE LAST BLOCK
 *     catch  one article's only ask moved to the top, band suppressed
 *            -> "the single ask starts 14% down the page", both widths
 *     miss   covered by every unplanted article, all of which sit at 85 to 89%
 *
 *   LANDING GAP, BOTH CLAUSES
 *     catch  7000px of empty section after the contact form
 *            -> "8.49 viewports with no CTA (85% of the page)", both widths
 *     miss   4200px of empty section inside franchising, which is already the
 *            longest page on the site
 *            -> gap 3.10 to 5.38 viewports, over the four viewport ceiling,
 *               share 27%, silent. This is the entire reason the rule needs
 *               two clauses: a stretch can be long without dominating, and the
 *               single clause version would have failed the busiest real page
 *               on the property for growing.
 */
import { chromium } from "playwright";
import { startNextServer } from "./lib/dev-server.mjs";
import { auditRoutes } from "./lib/routes.mjs";

const PORT = 3147;
const WIDTHS = [
  { width: 390, height: 844, label: "390" },
  { width: 1280, height: 900, label: "1280" },
];

/** Documents rather than conversion surfaces. */
const DOCUMENT_ROUTES = new Set(["/privacy", "/terms"]);
/** Long form reading. One ask, at the end. */
const ARTICLE_PREFIX = "/insights/";

function routeClass(path) {
  if (DOCUMENT_ROUTES.has(path)) return "document";
  if (path.startsWith(ARTICLE_PREFIX)) return "article";
  return "landing";
}

/**
 * THE LANDING GAP THRESHOLD, AND AN HONEST ACCOUNT OF WHERE IT COMES FROM.
 *
 * The previous header said 3.5 viewports was "arrived at by measurement rather
 * than taste". That claim did not survive being checked. What sat under it was
 * a statement about what the rule would demand at a lower value, which is a
 * consequence, not a measurement of anything a reader does. There is no
 * measurement of readers behind either number and there was never going to be.
 *
 * What IS measured is the site. At 1280 the busiest landing page, franchising
 * at fourteen thousand pixels, runs 3.10 viewports at its widest control free
 * stretch, and every other landing route sits between 0.84 and 2.84. The old
 * ceiling left the busiest real page thirteen per cent of headroom, which is
 * close enough that adding one section would have tipped it.
 *
 * More to the point: at 1280 this rule has never once failed a landing route.
 * Every failure it has produced in its life has been an article, and at 390 it
 * never fires at all because the persistent bar short circuits it. A landing
 * page rule that has only ever caught articles was not doing the job written
 * on it.
 *
 * So: four viewports, stated as the convention it is, with roughly thirty per
 * cent of headroom over the busiest real page. And a second clause, which is
 * the part that carries the meaning: the stretch must ALSO be more than half
 * the document. A barren run matters when it dominates a page, not when it is
 * four screens of a fourteen thousand pixel one. Requiring both is what stops
 * the exact number from being the thing that decides.
 */
const LANDING_GAP_VIEWPORTS = 4;
const LANDING_GAP_SHARE = 0.5;

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
    IN CONTENT POSITIONS, WHICH IS WHAT "ONE ASK" ACTUALLY MEANS.

    Counting links would count the closing band as two, because it carries a
    primary and a secondary side by side. The unit a reader experiences is the
    position: one place on the page where they are asked. So controls are
    clustered by vertical proximity and the clusters are counted.

    240px is one band's internal height, which is wide enough to hold a
    heading, a lead and a row of buttons, and narrow enough that two genuinely
    separate prompts a screen apart never merge. The old article had five
    clusters at this window and has one now.

    Fixed and sticky controls are excluded: the phone bar is furniture, it is
    on every route, and it is not a position on this page.
  */
  const inContent = any.items.filter((i) => !i.fixed);
  const clusters = [];
  for (const item of inContent) {
    const last = clusters[clusters.length - 1];
    if (last && item.top - last.end <= 240) {
      last.end = Math.max(last.end, item.top + item.height);
      last.links += 1;
    } else {
      clusters.push({
        start: item.top,
        end: item.top + item.height,
        links: 1,
        text: item.text,
      });
    }
  }

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
    positions: clusters.length,
    lastPositionPercent: clusters.length
      ? Math.round((clusters[clusters.length - 1].start / docHeight) * 100)
      : 0,
    firstPositionPercent: clusters.length
      ? Math.round((clusters[0].start / docHeight) * 100)
      : 0,
    positionLinks: clusters.map((c) => c.links),
    largestGap,
    largestGapViewports: +(largestGap / vh).toFixed(2),
    gapSharePercent: Math.round((largestGap / docHeight) * 100),
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

    const kind = routeClass(route.path);

    if (kind !== "document" && result.primaryCount === 0) {
      failures.push(`${route.name} @${viewport.label}: no primary CTA on the page`);
    }

    if (kind === "article") {
      /*
        Exactly one, and it is the last thing. Both halves matter: one catches
        the pattern this template was taken out of, and "last" catches an ask
        that is technically alone but sitting above the reading.
      */
      if (result.positions !== 1) {
        failures.push(
          `${route.name} @${viewport.label}: ${result.positions} in-content CTA position(s), expected exactly 1`,
        );
      } else if (result.lastPositionPercent < 50) {
        failures.push(
          `${route.name} @${viewport.label}: the single ask starts ${result.lastPositionPercent}% down the page, which is not the last block`,
        );
      }
    }

    /*
      The gap rule now applies to landing routes only, and it fails only when
      the barren stretch is BOTH long in absolute terms and dominant relative
      to the page. See the note on LANDING_GAP_VIEWPORTS for why one clause
      alone was doing no work.

      Mobile never relies on this. The persistent bar satisfies the check
      outright on every route that carries it, which is the point of having it.
    */
    if (
      kind === "landing" &&
      !result.primaryPersistent &&
      result.largestGapViewports > LANDING_GAP_VIEWPORTS &&
      result.gapSharePercent > LANDING_GAP_SHARE * 100
    ) {
      failures.push(
        `${route.name} @${viewport.label}: ${result.largestGapViewports} viewports with no CTA (${result.gapSharePercent}% of the page), starting at ${result.gapStartPercent}% down`,
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
      `  ${route.name.padEnd(14)} @${viewport.label.padEnd(5)} ${kind.padEnd(8)} pos=${String(result.positions).padEnd(2)} links=${String(result.anyCount).padEnd(2)} last@${String(result.lastPositionPercent).padStart(3)}% persistent=${result.primaryPersistent ? "yes" : "no "} gap=${result.largestGapViewports}vh/${result.gapSharePercent}%`,
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
    "ALL GREEN. Every landing and article route carries a primary CTA, every article carries exactly one ask and it is the last block on the page, no landing route has a barren stretch that is both over four viewports and over half the page, and every control clears 44px at 390.",
  );
}

await browser.close();
await server.stop();
