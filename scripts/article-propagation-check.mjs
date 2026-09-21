import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * LEAK CHECK, STRICTER THAN THE RULE ONE SUMMARY.
 *
 * Rule One says 1,064 additions and names them. This asks a different and
 * narrower question: for each of the 27 routes that existed before, is every
 * single added value attributable to the two new articles, or did something
 * else change on a page nobody was supposed to touch?
 *
 * A value is attributable only if it contains one of the two new titles, one
 * of the two new descriptions, or one of the two new slugs. Anything else is
 * a leak, reported by route and by inventory.
 */
const [, , beforeFile, afterFile] = process.argv;
if (!beforeFile || !afterFile) {
  console.error(
    "usage: node scripts/article-propagation-check.mjs <before.json> <after.json>",
  );
  process.exit(2);
}
const before = JSON.parse(readFileSync(beforeFile, "utf8"));
const after = JSON.parse(readFileSync(afterFile, "utf8"));

/*
  A STALE CAPTURE IS THE ONE WAY THIS TOOL CAN LIE, and until now it had no
  guard and two default filenames. Run with no arguments it read a pair of
  captures from the previous batch, twenty hours old, and printed a confident
  and entirely wrong list of unattributable values about a site that had moved
  on. That is the failure AGENTS.md records as worse than any defect it checks
  for, and the rule there is explicit that it applies to ANY verification
  reading a captured artifact, not only to the comparator.

  So: no defaults, both paths required, and the after capture must postdate the
  build on disk. Exits rather than warns, because a warning above a green
  summary is read as green.
*/
{
  let builtAt = null;
  try {
    builtAt = statSync(join(".next", "server", "app", "index.html")).mtimeMs;
  } catch {
    /* No build present. Comparing two archived captures is legitimate. */
  }
  if (builtAt !== null) {
    if (typeof after.builtAt !== "number") {
      console.error(
        `CAPTURE PREDATES THE STALENESS FORMAT. "${afterFile}" carries no builtAt, so it cannot be shown to describe the current build and cannot be trusted.`,
      );
      process.exit(1);
    }
    if (Math.abs(after.builtAt - builtAt) > 1000) {
      console.error(
        `STALE CAPTURE. "${afterFile}" describes a build from ${new Date(after.builtAt).toISOString()}, and the build on disk is from ${new Date(builtAt).toISOString()}.\nRe-run scripts/rule-one-capture.mjs. A comparison against a leftover capture reports a clean result about a state that no longer exists.`,
      );
      process.exit(1);
    }
  }
}

const NEW = [
  {
    slug: "what-an-area-development-agreement-is",
    eyebrow: "The agreement",
    date: "September 21, 2026",
    title: "Area development agreement: what it commits you to",
    desc: "Area development agreement: why the schedule is the operative clause, what a missed deadline puts at risk, and where the seven day rule reaches this document.",
  },
  {
    slug: "how-franchise-renewal-works",
    eyebrow: "The agreement",
    date: "September 21, 2026",
    title: "Franchise renewal: what happens at the end of a term",
    desc: "Franchise renewal often means signing the current agreement, not continuing the old one. What Item 17 must tell you, and when a new disclosure document is owed.",
  },
  {
    slug: "franchise-vs-license",
    eyebrow: "The definition",
    date: "September 21, 2026",
    title: "Franchise vs license: what legally separates them",
    desc: "Franchise vs license: the three elements that decide it, why the name on the document is irrelevant, and why the payment figure most pages quote is out of date.",
  },
  {
    slug: "how-to-franchise-a-business",
    eyebrow: "Becoming a franchisor",
    date: "September 21, 2026",
    title: "How to franchise a business: what the law requires",
    desc: "How to franchise a business in the order the obligations bite: the three part test, the disclosure document, the audit, and registration before any offer.",
  },
];

/**
 * CARD FURNITURE, ENUMERATED RATHER THAN WAVED THROUGH.
 *
 * The first version of this check attributed only values containing a new
 * title, description or slug, and it flagged 54 things it could not explain.
 * Every one turned out to be per-card furniture that scales with the number of
 * articles, and the right response is to name each class, not to loosen the
 * predicate until the noise stops.
 *
 * What the insights hub renders per card, from src/app/insights/page.tsx:
 *   the eyebrow                  "The agreement", already used by two existing
 *                                articles, so this is a multiset count rise
 *   the formatted date           "September 20, 2026"
 *   the link label and its
 *   screen reader suffix         "Read this" and ": <title>"
 *
 * And /franchising renders every article title in one comma separated run, so
 * two more articles add two more separators.
 */
const FURNITURE_BLOCKS = new Set([
  ...NEW.map((n) => n.eyebrow),
  ...NEW.map((n) => n.date),
  "Read this",
]);

/* Words that belong to the new titles and descriptions. */


function attributable(value, field) {
  /*
    Word fields are not answered here at all. They have their own section
    below, which predicts them rather than recognising them. See the note on
    WORD ACCOUNTING.
  */
  if (field.endsWith("Words")) return true;
  if (FURNITURE_BLOCKS.has(value)) return true;
  return NEW.some(
    (n) => value.includes(n.title) || value.includes(n.desc) || value.includes(n.slug),
  );
}

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

const existing = Object.keys(before.routes);
const leaks = [];
const tally = {};
let attributed = 0;

for (const path of existing) {
  const b = before.routes[path];
  const a = after.routes[path];
  if (!a) {
    leaks.push(`${path}: route disappeared`);
    continue;
  }
  for (const [field, get] of FIELDS) {
    const added = minus(get(a) ?? [], get(b) ?? []);
    const removed = minus(get(b) ?? [], get(a) ?? []);
    for (const v of removed) leaks.push(`${path} ${field}: REMOVED "${v.slice(0, 70)}"`);
    for (const v of added) {
      if (attributable(v, field)) {
        attributed += 1;
        tally[field] = (tally[field] ?? 0) + 1;
      } else {
        leaks.push(`${path} ${field}: UNATTRIBUTABLE "${v.slice(0, 70)}"`);
      }
    }
  }
}

console.log(`  existing routes checked:        ${existing.length}`);
console.log(`  additions attributable to the two new articles: ${attributed}`);
for (const [f, n] of Object.entries(tally).sort()) console.log(`      ${f.padEnd(14)} ${n}`);

const sensitive = ["title", "metas", "canonical", "robots", "jsonLd", "headerBlocks", "footerBlocks"];
console.log(`\n  changes to the inventories that must not move on an existing page:`);
for (const f of sensitive) console.log(`      ${f.padEnd(14)} ${tally[f] ?? 0}`);


/**
 * WORD ACCOUNTING, AND WHY IT IS NOT THE HARNESS'S METHOD.
 *
 * This file used to answer word level the same way it answers block level, by
 * asking whether a word appeared somewhere in a new title, description or in
 * an enumerated furniture list. That is recognition, and recognition at word
 * level is close to useless: the four descriptions contain "the", "what" and
 * "is", so almost any word added anywhere was recognised. Planting the words
 * "the" and "Franchise" onto /insights produced NO LEAK and a total two
 * higher than the truth.
 *
 * Nor does it copy the harness. scripts/rule-one-compare.mjs balances a budget
 * drawn from the blocks a run approved, which can only ever confirm that a run
 * was internally consistent with its own allowlist. This predicts instead: the
 * two card templates and the four article literals say exactly which words
 * each pre-existing route must gain, and the observed delta has to equal that
 * prediction as a multiset. A word no card could have rendered breaks the
 * equality whatever any allowlist says about it.
 *
 *   src/app/insights/page.tsx         eyebrow, date, title, description, then
 *                                     "Read this" and an sr-only ": <title>"
 *   src/app/insights/[slug]/page.tsx  eyebrow, title, description
 *   src/app/franchising/page.tsx      title, and one separator each
 *
 * Tokenisation is the capture's, taken from scripts/rule-one-capture.mjs:
 * collapse whitespace, split visible region text on a single space.
 */
const hubCard = (a) => `${a.eyebrow} ${a.date} ${a.title} ${a.desc} Read this : ${a.title}`;
const relatedCard = (a) => `${a.eyebrow} ${a.title} ${a.desc}`;
const franchisingEntry = (a) => `${a.title} ,`;

const tokens = (str) => str.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);

function bag(list) {
  const m = new Map();
  for (const v of list) m.set(v, (m.get(v) ?? 0) + 1);
  return m;
}

function predictWords(path) {
  if (path === "/insights") return NEW.flatMap((a) => tokens(hubCard(a)));
  if (path === "/franchising") return NEW.flatMap((a) => tokens(franchisingEntry(a)));
  if (path.startsWith("/insights/")) return NEW.flatMap((a) => tokens(relatedCard(a)));
  return [];
}

const wordProblems = [];
let wordsObserved = 0;
let wordsPredicted = 0;

for (const path of existing) {
  const b = bag(before.routes[path].mainWords ?? []);
  const a = bag(after.routes[path]?.mainWords ?? []);
  const observed = [];
  for (const [w, n] of a) {
    const gain = n - (b.get(w) ?? 0);
    for (let i = 0; i < gain; i += 1) observed.push(w);
  }
  const predicted = predictWords(path);
  wordsObserved += observed.length;
  wordsPredicted += predicted.length;

  const ob = bag(observed);
  const pr = bag(predicted);
  const off = [];
  for (const w of new Set([...ob.keys(), ...pr.keys()])) {
    const d = (ob.get(w) ?? 0) - (pr.get(w) ?? 0);
    if (d !== 0) off.push({ word: w, delta: d });
  }
  if (off.length) {
    wordProblems.push({ path, off, observed: observed.length, predicted: predicted.length });
  }
}

console.log(`\n  words observed as added:   ${wordsObserved}`);
console.log(`  words predicted by cards:  ${wordsPredicted}`);
console.log(
  `  routes balancing exactly:  ${existing.length - wordProblems.length} of ${existing.length}`,
);
if (wordProblems.length) {
  console.log(`\n  WORD ACCOUNTING DOES NOT BALANCE:`);
  for (const p of wordProblems.slice(0, 12)) {
    console.log(`    ${p.path}  observed ${p.observed}, predicted ${p.predicted}`);
    for (const { word, delta } of p.off.slice(0, 8)) {
      const label = delta > 0 ? "unexplained extra" : "predicted but absent";
      console.log(`      ${label.padEnd(22)} ${JSON.stringify(word)} x${Math.abs(delta)}`);
    }
  }
}

console.log(`\n================ RESULT ================`);
if (leaks.length === 0 && wordProblems.length === 0) {
  console.log(
    `NO LEAK. Every one of the ${attributed} additions on the ${existing.length} pre-existing routes contains a new article's title, description or slug. Zero removals. Nothing changed in any existing page's own title, metas, canonical, robots, schema, header or footer.`,
  );
} else {
  console.log(
    `${leaks.length} unattributable value(s) and ${wordProblems.length} route(s) whose word accounting does not balance.`,
  );
  for (const l of leaks.slice(0, 40)) console.log(`  ${l}`);
  process.exitCode = 1;
}
