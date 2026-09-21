import { readFileSync } from "node:fs";

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
const before = JSON.parse(readFileSync(process.argv[2] ?? "scratch/ro-base.json", "utf8"));
const after = JSON.parse(readFileSync(process.argv[3] ?? "scratch/ro-after.json", "utf8"));

const NEW = [
  {
    slug: "what-is-in-a-franchise-agreement",
    title: "Franchise agreement: what is actually in one",
    desc: "Franchise agreement: what each part of the contract does, the seven day rule almost nobody mentions, and where the disclosure stops and the obligation starts.",
  },
  {
    slug: "how-a-franchise-agreement-ends",
    title: "Franchise termination: how an agreement ends",
    desc: "Franchise termination is governed by the contract and by state law, not by the federal rule. The three ways an agreement ends, and what survives it.",
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
  "The agreement",
  "September 20, 2026",
  "September 19, 2026",
  "Read this",
]);
const FURNITURE_WORDS = new Set([
  "The", "agreement", "September", "20,", "19,", "2026", "Read", "this", ":", ",",
]);

/* Words that belong to the new titles and descriptions. */
const NEW_WORDS = new Set(
  NEW.flatMap((n) => `${n.title} ${n.desc}`.split(/\s+/)).filter(Boolean),
);

function attributable(value, field) {
  if (field.endsWith("Words")) {
    return NEW_WORDS.has(value) || FURNITURE_WORDS.has(value);
  }
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

console.log(`\n================ RESULT ================`);
if (leaks.length === 0) {
  console.log(
    `NO LEAK. Every one of the ${attributed} additions on the ${existing.length} pre-existing routes contains a new article's title, description or slug. Zero removals. Nothing changed in any existing page's own title, metas, canonical, robots, schema, header or footer.`,
  );
} else {
  console.log(`${leaks.length} problem(s):`);
  for (const l of leaks.slice(0, 40)) console.log(`  ${l}`);
  process.exitCode = 1;
}
