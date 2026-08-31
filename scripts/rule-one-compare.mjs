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
const shared = [...routesBefore].filter((r) => routesAfter.has(r));

for (const [field, get] of FIELDS) {
  const perRoute = [];
  const allBefore = [];
  const allAfter = [];
  for (const path of shared) {
    const b = get(before.routes[path] ?? {}) ?? [];
    const a = get(after.routes[path] ?? {}) ?? [];
    allBefore.push(...b);
    allAfter.push(...a);
    const gone = minus(b, a);
    const came = minus(a, b);
    if (gone.length || came.length) perRoute.push({ path, gone, came });
  }
  const siteGone = minus(allBefore, allAfter);
  const siteCame = minus(allAfter, allBefore);

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
  report[field] = {
    removed: siteGone,
    added: siteCame,
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
for (const [field] of FIELDS) {
  const r = report[field];
  removedTotal += r.removed.length;
  addedTotal += r.added.length;
  movedTotal += r.moved.length;
  rows.push(
    `  ${pad(field, 14)} ${pad(r.removed.length, 9)} ${pad(r.added.length, 7)} ${pad(r.moved.length, 7)}`,
  );
}

console.log(`\nRULE ONE VERIFICATION`);
console.log(`  before  ${before.label}   ${before.routeList.length} routes`);
console.log(`  after   ${after.label}   ${after.routeList.length} routes\n`);
console.log(`  ${pad("INVENTORY", 14)} ${pad("REMOVED", 9)} ${pad("ADDED", 7)} ${pad("MOVED", 7)}`);
console.log(`  ${"-".repeat(40)}`);
console.log(rows.join("\n"));
console.log(`  ${"-".repeat(40)}`);
console.log(
  `  ${pad("TOTAL", 14)} ${pad(removedTotal, 9)} ${pad(addedTotal, 7)} ${pad(movedTotal, 7)}`,
);
console.log(`\n  routes lost    ${routesLost.length}  ${routesLost.join(" ")}`);
console.log(`  routes gained  ${routesGained.length}  ${routesGained.join(" ")}`);
console.log(`  sitemap lost   ${sitemapLost.length}  ${sitemapLost.join(" ")}`);
console.log(`  sitemap gained ${sitemapGained.length}  ${sitemapGained.join(" ")}`);

for (const [field] of FIELDS) {
  const r = report[field];
  if (!r.removed.length && !r.added.length && !r.moved.length) continue;
  console.log(`\n### ${field}`);
  for (const v of r.removed) console.log(`  REMOVED  ${v.slice(0, 150)}`);
  for (const v of r.added) console.log(`  ADDED    ${v.slice(0, 150)}`);
  for (const m of r.moved)
    console.log(`  MOVED    ${m.value.slice(0, 110)}  [${m.from} -> ${m.to.join(", ")}]`);
}

writeFileSync(
  "scratch/rule-one-result.json",
  JSON.stringify(
    { routesLost, routesGained, sitemapLost, sitemapGained, report },
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
      ? "CLEAN. Nothing removed, nothing added, no route or sitemap delta, nothing moved."
      : `CLEAN on removals and additions. ${movedTotal} move(s) listed above need signing off.`,
  );
} else {
  console.log(
    `NOT CLEAN. removed=${removedTotal} added=${addedTotal} routesLost=${routesLost.length} routesGained=${routesGained.length}`,
  );
  process.exitCode = 1;
}
