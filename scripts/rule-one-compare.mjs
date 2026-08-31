#!/usr/bin/env node
/**
 * RULE ONE VERIFICATION, COMPARE HALF
 * ===================================
 *
 *   node scripts/rule-one-compare.mjs <before.json> <after.json>
 *
 * Exact whole string comparison, no length floor, no prefix window.
 *
 * TWO LEVELS, WHICH IS HOW RELOCATION IS CAUGHT. Per route catches a string
 * leaving a page. A site wide multiset then separates the two cases a per route
 * diff confuses:
 *
 *   gone from route A, present on route B   ->  MOVED
 *   gone from route A, present nowhere      ->  REMOVED
 *
 * A move is not automatically a violation and it is never silent. Each one is
 * enumerated with the route it left and the route it arrived on.
 *
 * Exit code is non zero on any removal, any addition, any route delta, or any
 * canonical or schema difference. Moves alone do not fail the run; they are
 * printed for a person to sign off.
 */
import { readFileSync, writeFileSync } from "node:fs";

const [, , beforeFile, afterFile] = process.argv;
const before = JSON.parse(readFileSync(beforeFile, "utf8"));
const after = JSON.parse(readFileSync(afterFile, "utf8"));

/** Multiset difference: what is in a that is not in b, counting duplicates. */
function minus(a, b) {
  const counts = new Map();
  for (const v of b) counts.set(v, (counts.get(v) ?? 0) + 1);
  const out = [];
  for (const v of a) {
    const n = counts.get(v) ?? 0;
    if (n > 0) counts.set(v, n - 1);
    else out.push(v);
  }
  return out;
}

/**
 * BLOCK LEVEL REMOVALS THAT ARE NOT REMOVALS.
 *
 * The leaf block inventory reads the smallest element that owns its own text.
 * That is what makes a difference legible to a person, and it is also fooled by
 * any change to where the element boundaries fall. Wrapping part of a sentence
 * in a span to colour it splits one block into three, and the original block
 * disappears from the inventory while every word of it is still on the page.
 *
 * The first run reported exactly that. The home page headline
 * "A franchise development company building skilled trade service brands."
 * came back as REMOVED because the tricolour treatment wraps two phrases in
 * spans. Nothing had gone.
 *
 * So a block removal is only a removal if the words are gone too. Word level is
 * the authority here, and it is immune to element boundaries: if a phrase were
 * genuinely deleted, its words would be missing from the word multiset and the
 * mainWords row would fail. Blocks whose every word survives on the same route
 * are reported as SPLIT, listed for a human to glance at, and not counted.
 *
 * This does not weaken the check. It moves the assertion to the inventory that
 * can carry it.
 */
/**
 * THE APPROVED LIST.
 *
 * The pass criteria are zero removed and zero UNAPPROVED added. See BACKLOG.md
 * for why the additions threshold is not zero: a redesign the owner asked to
 * include new elements cannot be graded against a bar that fails on the things
 * he asked for, and a check nobody expects to pass is not a check.
 *
 * SO APPROVAL IS AN ALLOWLIST, NOT A LOOSENING. Every entry names the value and
 * the decision that authorised it. Anything not on this list fails the run,
 * including a value that merely looks similar. If you are adding an entry here
 * because a run went red, stop: the question is whether the owner asked for it,
 * not whether it is defensible.
 *
 * Word level entries are derived rather than listed. A word is approved only if
 * it appears inside an approved block, so a genuinely new sentence cannot pass
 * by being made of familiar words.
 */
const APPROVED = {
  removed: {
    headings: [
      ["H3:Corporate structure", "promoted to H2, mis-levelled before"],
      ["H3:In this section", "promoted to H2, mis-levelled before"],
    ],
    anchors: [
      [
        "Wattsmith ElectricElectrical contractingSan Antonio, TexasAbout Wattsmith Electric -> /brands/wattsmith-electric",
        "the whole card was one anchor, so its accessible name was a run-on; replaced by a discrete link with the same href",
      ],
    ],
  },
  added: {
    headings: [
      ["H2:Corporate structure", "the promotion above"],
      ["H2:In this section", "the promotion above"],
    ],
    anchors: [
      [
        "About Wattsmith Electric -> /brands/wattsmith-electric",
        "the discrete link replacing the run-on card anchor",
      ],
    ],
    attrText: [
      [
        "aria-label=In this section",
        "the franchising jump list became a <nav>, which needs a name",
      ],
    ],
    mainBlocks: [
      ["Skilled trade brand and franchise development", "hero eyebrow, directed"],
      ["skilled trade", "tricolour headline span, directed"],
      ["service brands.", "tricolour headline span, directed"],
      ["State of registration", "hero fact strip label, directed"],
      ["Wyoming", "hero fact strip value, LEGAL_ENTITIES[].jurisdiction"],
      ["Service disabled veteran", "hero fact strip label, from FOUNDING_STATEMENT"],
      ["Veteran founded", "hero fact strip value, directed"],
      ["Operating", "brand block status pill, directed"],
      ["Licensed", "brand block pill, half of the committed 'Licensed and insured'"],
      ["Insured", "brand block pill, half of the committed 'Licensed and insured'"],
      ["Veteran owned", "brand block pill, verbatim from BRANDS[].attributes"],
      ["Trade", "brand block data pair label, directed"],
      ["Market", "brand block data pair label, directed"],
      ["Electrical contracting", "brand block data pair value, BRANDS[].category"],
    ],
  },
};

const flat = (o) =>
  Object.fromEntries(
    Object.entries(o).map(([f, list]) => [f, new Map(list)]),
  );
const APPROVED_REMOVED = flat(APPROVED.removed);
const APPROVED_ADDED = flat(APPROVED.added);

/* Words inside approved blocks, so word level does not have to be listed. */
const APPROVED_WORDS = new Set();
for (const list of Object.values(APPROVED.added)) {
  for (const [value] of list) {
    for (const w of String(value).split(/[\s>=-]+/)) if (w) APPROVED_WORDS.add(w);
  }
}

const WORD_FIELDS = new Set(["mainWords", "headerWords", "footerWords"]);
function approvalFor(field, kind, value) {
  const table = kind === "removed" ? APPROVED_REMOVED : APPROVED_ADDED;
  const hit = table[field]?.get(value);
  if (hit) return hit;
  if (kind === "added" && WORD_FIELDS.has(field) && APPROVED_WORDS.has(value)) {
    return "word of an approved block";
  }
  return null;
}

const BLOCK_FIELDS = new Set(["mainBlocks", "headerBlocks", "footerBlocks"]);
const WORDS_FOR_BLOCKS = {
  mainBlocks: "mainWords",
  headerBlocks: "headerWords",
  footerBlocks: "footerWords",
};

const FIELDS = [
  ["title", (r) => [r.title]],
  ["metas", (r) => r.metas],
  ["canonical", (r) => [String(r.canonical)]],
  ["robots", (r) => [String(r.robots)]],
  ["headings", (r) => r.headings],
  ["anchors", (r) => r.anchors],
  ["buttons", (r) => r.buttons],
  ["attrText", (r) => r.attrText],
  ["jsonLd", (r) => r.jsonLd],
  ["mainBlocks", (r) => r.mainBlocks],
  ["headerBlocks", (r) => r.headerBlocks],
  ["footerBlocks", (r) => r.footerBlocks],
  ["mainWords", (r) => r.mainWords],
  ["headerWords", (r) => r.headerWords],
  ["footerWords", (r) => r.footerWords],
];

/* ---------- route set ---------- */
const routesBefore = new Set(before.routeList);
const routesAfter = new Set(after.routeList);
const routesLost = [...routesBefore].filter((r) => !routesAfter.has(r));
const routesGained = [...routesAfter].filter((r) => !routesBefore.has(r));
const sitemapLost = minus(before.sitemap, after.sitemap);
const sitemapGained = minus(after.sitemap, before.sitemap);

/* ---------- per field, per route, then site wide ---------- */
const report = {};
const splits = {};
const shared = [...routesBefore].filter((r) => routesAfter.has(r));

for (const [field, get] of FIELDS) {
  const perRoute = [];
  const allBefore = [];
  const allAfter = [];
  const split = [];
  for (const path of shared) {
    const b = get(before.routes[path] ?? {}) ?? [];
    const a = get(after.routes[path] ?? {}) ?? [];
    let gone = minus(b, a);
    const came = minus(a, b);

    /* Reclassify block removals whose words all survive on the same route. */
    if (BLOCK_FIELDS.has(field)) {
      const afterWords = after.routes[path]?.[WORDS_FOR_BLOCKS[field]] ?? [];
      const stillThere = new Set(afterWords);
      const real = [];
      for (const g of gone) {
        const words = g.split(" ").filter(Boolean);
        if (words.length && words.every((w) => stillThere.has(w))) {
          split.push({ path, value: g });
        } else {
          real.push(g);
        }
      }
      gone = real;
    }

    allBefore.push(...b);
    allAfter.push(...a);
    if (gone.length || came.length) perRoute.push({ path, gone, came });
  }
  splits[field] = split;
  let siteGone = minus(allBefore, allAfter);
  const siteCame = minus(allAfter, allBefore);
  if (BLOCK_FIELDS.has(field)) {
    const splitValues = new Set(splits[field].map((s) => s.value));
    siteGone = siteGone.filter((g) => !splitValues.has(g));
  }

  /*
    A string that left one route and is site wide still present has moved, not
    been removed. Counted by taking the per route departures that do not appear
    in the site wide removal set.
  */
  const removedSet = new Set(siteGone);
  const addedSet = new Set(siteCame);
  const moved = [];
  for (const { path, gone } of perRoute) {
    for (const g of gone) {
      if (!removedSet.has(g)) {
        const arrivedOn = perRoute
          .filter((p) => p.came.includes(g))
          .map((p) => p.path);
        moved.push({ value: g, from: path, to: arrivedOn });
      }
    }
  }
  /* Split each bucket into approved and unapproved. */
  const part = (values, kind) => {
    const ok = [];
    const bad = [];
    for (const v of values) {
      const why = approvalFor(field, kind, v);
      if (why) ok.push({ v, why });
      else bad.push(v);
    }
    return { ok, bad };
  };
  const rem = part(siteGone, "removed");
  const add = part(siteCame, "added");
  report[field] = {
    removed: rem.bad,
    removedApproved: rem.ok,
    added: add.bad,
    addedApproved: add.ok,
    moved,
    perRoute,
    addedSetSize: addedSet.size,
  };
}

/* ---------- table ---------- */
const pad = (s, n) => String(s).padEnd(n);
const rows = [];
let removedTotal = 0;
let addedTotal = 0;
let movedTotal = 0;
let approvedTotal = 0;
for (const [field] of FIELDS) {
  const r = report[field];
  removedTotal += r.removed.length;
  addedTotal += r.added.length;
  movedTotal += r.moved.length;
  approvedTotal += r.removedApproved.length + r.addedApproved.length;
  rows.push(
    `  ${pad(field, 14)} ${pad(r.removed.length, 9)} ${pad(r.added.length, 7)} ${pad(r.moved.length, 7)} ${pad(r.removedApproved.length + r.addedApproved.length, 9)}`,
  );
}

console.log(`\nRULE ONE VERIFICATION`);
console.log(`  before  ${before.label}   ${before.routeList.length} routes`);
console.log(`  after   ${after.label}   ${after.routeList.length} routes\n`);
console.log(
  `  ${pad("INVENTORY", 14)} ${pad("UNEXPL.", 9)} ${pad("UNAPPR.", 7)} ${pad("MOVED", 7)} ${pad("APPROVED", 9)}`,
);
console.log(`  ${"-".repeat(40)}`);
console.log(rows.join("\n"));
console.log(`  ${"-".repeat(40)}`);
console.log(
  `  ${pad("TOTAL", 14)} ${pad(removedTotal, 9)} ${pad(addedTotal, 7)} ${pad(movedTotal, 7)} ${pad(approvedTotal, 9)}`,
);
console.log(`\n  routes lost    ${routesLost.length}  ${routesLost.join(" ")}`);
console.log(`  routes gained  ${routesGained.length}  ${routesGained.join(" ")}`);
console.log(`  sitemap lost   ${sitemapLost.length}  ${sitemapLost.join(" ")}`);
console.log(`  sitemap gained ${sitemapGained.length}  ${sitemapGained.join(" ")}`);

for (const [field] of FIELDS) {
  const r = report[field];
  if (
    !r.removed.length &&
    !r.added.length &&
    !r.moved.length &&
    !r.removedApproved.length &&
    !r.addedApproved.length
  )
    continue;
  console.log(`\n### ${field}`);
  for (const v of r.removed) console.log(`  REMOVED    ${v.slice(0, 150)}`);
  for (const v of r.added) console.log(`  ADDED      ${v.slice(0, 150)}`);
  for (const { v, why } of r.removedApproved)
    console.log(`  ok removed ${v.slice(0, 92)}   (${why})`);
  for (const { v, why } of r.addedApproved)
    if (why !== "word of an approved block")
      console.log(`  ok added   ${v.slice(0, 92)}   (${why})`);
  for (const m of r.moved)
    console.log(`  MOVED    ${m.value.slice(0, 110)}  [${m.from} -> ${m.to.join(", ")}]`);
}

let splitTotal = 0;
for (const [field] of FIELDS) {
  const s = splits[field] ?? [];
  splitTotal += s.length;
  if (!s.length) continue;
  console.log(`
### ${field}, split rather than removed`);
  for (const v of s)
    console.log(`  SPLIT    ${v.value.slice(0, 130)}  [${v.path}]`);
}
if (splitTotal)
  console.log(
    `
  ${splitTotal} block(s) reclassified as SPLIT: element boundaries moved, every word survives on the same route.`,
  );

writeFileSync(
  "scratch/rule-one-result.json",
  JSON.stringify(
    { routesLost, routesGained, sitemapLost, sitemapGained, report, splits },
    null,
    1,
  ),
);

const clean =
  removedTotal === 0 &&
  addedTotal === 0 &&
  routesLost.length === 0 &&
  routesGained.length === 0 &&
  sitemapLost.length === 0 &&
  sitemapGained.length === 0;

console.log(`\n================ RESULT ================`);
if (clean) {
  console.log(
    movedTotal === 0
      ? `CLEAN. Zero unexplained removals, zero unapproved additions, no route or sitemap delta. ${approvedTotal} approved delta(s), each against a written decision.`
      : `CLEAN on removals and additions. ${movedTotal} move(s) listed above need signing off.`,
  );
} else {
  console.log(
    `NOT CLEAN. unexplained removed=${removedTotal} unapproved added=${addedTotal} routesLost=${routesLost.length} routesGained=${routesGained.length}`,
  );
  process.exitCode = 1;
}
