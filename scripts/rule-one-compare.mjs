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
import { readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { FRANCHISE_FAQ } from "../src/config/company.ts";

const [, , beforeFile, afterFile] = process.argv;
const before = JSON.parse(readFileSync(beforeFile, "utf8"));
const after = JSON.parse(readFileSync(afterFile, "utf8"));

/*
  A STALE CAPTURE IS THE ONE WAY THIS TOOL CAN LIE, so it is checked first.

  It happened: a build failed after compiling, the capture threw, and this ran
  against a leftover file and printed CLEAN. Nothing in the numbers looked
  wrong, because the numbers were true about a state that no longer existed.

  The after capture must describe the build that is on disk now. Compared on
  the build's own mtime rather than on a hash, because the question is only
  whether the capture is older than what it claims to describe.
*/
{
  let builtNow = null;
  try {
    builtNow = statSync(
      join(process.cwd(), ".next", "server", "app", "index.html"),
    ).mtimeMs;
  } catch {
    /* No build present. Comparing two archived captures is legitimate. */
  }
  if (builtNow !== null && after.builtAt !== undefined) {
    if (Math.abs(after.builtAt - builtNow) > 1000) {
      console.error(
        `
STALE CAPTURE. "${afterFile}" describes a build from ${new Date(after.builtAt).toISOString()}, and the build on disk is from ${new Date(builtNow).toISOString()}.
Re-run scripts/rule-one-capture.mjs. A comparison against a leftover capture reports CLEAN about a state that no longer exists.
`,
      );
      process.exit(1);
    }
  } else if (builtNow !== null && after.builtAt === undefined) {
    console.error(
      `
STALE CAPTURE FORMAT. "${afterFile}" was written before captures recorded their build, so it cannot be checked against the build on disk. Re-run the capture.
`,
    );
    process.exit(1);
  }
}

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
      [
        "Limits",
        "eyebrow on the closing limits band, Workstream A: bring the articles to the depth of the designed pages",
      ],
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

/**
 * APPROVED RULES, FOR CHANGES THAT ARE MECHANICAL RATHER THAN EDITORIAL.
 *
 * A literal list cannot express "the same nineteen character suffix came off
 * eighteen titles". Written out it is thirty six entries that a reader has to
 * compare by eye to be sure the only thing that changed was the suffix, which
 * is exactly the review a machine should be doing.
 *
 * THESE ARE NOT A LOOSENING, AND EACH ONE IS WRITTEN TO BE UNABLE TO PASS
 * ANYTHING ELSE. The suffix rule does not approve "a title that got shorter":
 * it approves a removed title only when the identical string minus the exact
 * brand suffix is present in the after capture, and approves an added title
 * only when the identical string plus that suffix was in the before capture.
 * A title whose words changed fails both halves and is reported.
 *
 * Every rule names the instruction that authorised it, in the operator's own
 * terms, the same as a literal entry.
 *
 * INJECTION VERIFICATION, TO THE STANDING RULE IN AGENTS.md
 * --------------------------------------------------------
 * ANCHORING. Every literal entry is matched with Map.get, which is whole string
 * equality, so those are anchored by construction. Every rule was re-read for
 * prefix matching after one was found doing it, and two were:
 *
 *   The breadcrumb entry left its name alternation open, so
 *   "name=Home services franchise: what the category actually is" matched on
 *   the word "Home" and an article retitle was being approved as a breadcrumb.
 *   Anchored at both ends now.
 *
 *   The FAQPage entry matched "name=" and "text=" as prefixes, which approved
 *   any question and any answer.
 *
 *     catch  a tenth question planted into FRANCHISE_FAQ
 *            -> before the fix: the page level additions were caught but the
 *               schema line was approved, because the allowlist reads the same
 *               array it is approving. A mirror, not an allowlist.
 *            -> after pinning the count at nine: jsonLd 0 approved to 43
 *               unapproved, 60 unapproved additions in total. CAUGHT.
 *     miss   the nine decided entries, unchanged
 *            -> jsonLd 220 approved, 0 unapproved, run CLEAN. SILENT.
 *
 * The suffix rule and the retitle rule are substitution checks: a removed value
 * is approved only when the exact transformed string is present on the other
 * side. Both were exercised by the run they were written for, 36 and 146
 * deltas respectively, and neither approved anything else.
 *
 *   THE STRING SWAP LIST
 *     catch  a sixth heading rewritten with no SWAPS entry
 *            -> 7 unexplained removals, 7 unapproved additions, the heading
 *               named on both sides                                  CAUGHT
 *     miss   the five listed swaps, one band lead and four headings
 *            -> 2172 approved deltas, run CLEAN                      SILENT
 *
 *   THE STALE CAPTURE GUARD
 *     catch  the site rebuilt without re-capturing
 *            -> "STALE CAPTURE ... describes a build from ..."       CAUGHT
 *     catch  a capture written before captures recorded their build
 *            -> "STALE CAPTURE FORMAT ..."                           CAUGHT
 *     miss   a capture taken from the build currently on disk
 *            -> runs normally                                        SILENT
 */
const BRAND_SUFFIX = " | Craftline Brands";

/*
  The nine decided question and answer strings, read from the same export the
  franchising page renders and the FAQPage schema is built from. Used to anchor
  the FAQ approval below on values rather than on field names.
*/
const FAQ_VALUES = new Set();
for (const entry of FRANCHISE_FAQ) {
  FAQ_VALUES.add(`name=${entry.q}`);
  FAQ_VALUES.add(`acceptedAnswer.text=${entry.a}`);
}

/*
  AND THE COUNT IS PINNED, BECAUSE THE SET ABOVE IS CIRCULAR ON ITS OWN.

  Reading the approved values from config means the allowlist can never
  disagree with config. Planting a tenth question proved it: the rendered page
  additions were caught, correctly, but the FAQPage schema line for the planted
  question was approved, because by then it was in the array being read.

  Nine is the number that was decided. If the array grows, this switches off
  and every FAQ schema line is reported until somebody writes down why there
  are ten. That is the difference between an allowlist and a mirror.
*/
const FAQ_APPROVED_COUNT = 9;
const FAQ_UNCHANGED = FRANCHISE_FAQ.length === FAQ_APPROVED_COUNT;
/**
 * THE FOUR CALL TO ACTION POSITIONS REMOVED FROM EVERY ARTICLE.
 *
 * Approved instruction: "One position, two links, last block before the
 * footer." An article carried five positions and eight links; the closing band
 * is the only one left, and the strings below are what came off all eighteen.
 *
 * Listed as the exact rendered strings, so this cannot approve a fifth string
 * that merely resembles them. Headings, anchors and words are derived from the
 * same list rather than restated: a heading is the string with its level
 * prefix, an anchor is the string with its href, and a word is a word of one
 * of them.
 */
const REMOVED_CTA_STRINGS = [
  "Franchise inquiry",
  "How franchising works",
  "All insights",
  "Evaluating a franchise?",
  "Questions this raised?",
  "Craftline is developing its programme and no Franchise Disclosure Document has been issued. An inquiry starts a conversation and nothing else.",
  "An inquiry is read by a person and commits you to nothing. No Franchise Disclosure Document has been issued, so there is nothing to apply for yet.",
];
const CTA_BLOCKS = new Set(REMOVED_CTA_STRINGS);
const CTA_WORDS = new Set(
  REMOVED_CTA_STRINGS.flatMap((s) => s.split(/\s+/)).filter(Boolean),
);

/**
 * THE FOUR DESCRIPTIONS THAT CHANGED.
 *
 * Approved instruction: "Fix the short home description and the three long
 * descriptions." Home was 84 characters, which is under the point a snippet
 * stops being cut off; franchising, insights and about all ran past 160.
 *
 * Both sides written out. A description is a claim about the page and there
 * are only four of them, so a literal pair is the right treatment: nothing
 * derived, nothing matched by prefix.
 */
const OLD_DESCRIPTIONS = new Set([
  "A franchise development company building and operating skilled trade service brands.",
  "Craftline Brands is a franchise development company that owns the marks, the operating playbooks, and the technology behind the skilled trade service brands it builds. Veteran founded, held through two Wyoming entities.",
  "Guides on franchising and skilled trade service businesses: what a Franchise Disclosure Document is, how royalties and territory work, what a home services franchise involves, and how to check a franchisor before you sign.",
  "How franchising works, explained plainly: what a franchisor and a franchisee each do, what royalties and brand standards mean, what a Franchise Disclosure Document is and why it exists, and what Craftline Brands looks for in an operator. Information and inquiry only.",
]);
const NEW_DESCRIPTIONS = new Set([
  "A franchise development company building and operating skilled trade service brands. Veteran founded, and held through two Wyoming entities.",
  "Craftline Brands owns the marks, the operating playbooks, and the technology behind the skilled trade service brands it builds. Veteran founded.",
  "Guides on franchising and skilled trade businesses: what a Franchise Disclosure Document is, how royalties and territory work, and how to check a franchisor.",
  "How franchising works: what a franchisor and a franchisee each do, what royalties and territory mean, and why disclosure comes before any offer. Inquiry only.",
]);
const META_KEY = /^(description|og:description|twitter:description)=/;

/**
 * APPROVED STRING SWAPS: a rendered string replaced by a named replacement.
 *
 * Each pair is written out on both sides, so this cannot approve a removal
 * whose replacement never arrived, or an addition that replaced nothing. The
 * heading, block and word forms are derived from the pair rather than restated,
 * the same way the retitle rule works.
 *
 * WHY THE PAIRS ARE NOT DERIVED FROM SOURCE. They could be read out of the data
 * files, and that is exactly the mistake the FAQ entry made: an allowlist that
 * reads the same source it is approving is a mirror. These are literals, and a
 * fifth heading rewritten tomorrow fails this run until somebody writes it down.
 */
const SWAPS = [
  {
    from: "Ask it. An inquiry is read by a person, reserves nothing, and commits you to nothing.",
    to: "No Franchise Disclosure Document has been issued, so there is nothing to apply for.",
    why: 'band lead approved as proposed: it states the fact instead of reassuring three times',
  },
  {
    from: "Look at obligations, not features",
    to: "What a franchisor is obliged to do, not what it offers",
    why: 'directed: "Rewrite the three consecutive headings opening Look at"',
  },
  {
    from: "Look at what the system does about people",
    to: "Qualified people are the binding constraint",
    why: 'directed: "Rewrite the three consecutive headings opening Look at"',
  },
  {
    from: "Look at how the playbook changes",
    to: "A playbook that never changes becomes fiction",
    why: 'directed: "Rewrite the three consecutive headings opening Look at"',
  },
  {
    from: "Look at what it measures",
    to: "What the system measures, and what that misses",
    why: 'directed: "Rewrite the three consecutive headings opening Look at"',
  },
];

/* Words on each side, so the word level rows do not need their own entries. */
const swapWords = (side) => {
  const set = new Set();
  for (const s of SWAPS) for (const w of s[side].split(/\s+/)) if (w) set.add(w);
  return set;
};
const SWAP_FROM_WORDS = swapWords("from");
const SWAP_TO_WORDS = swapWords("to");

function swapFor(field, kind, value) {
  const side = kind === "removed" ? "from" : "to";
  for (const s of SWAPS) {
    const target = s[side];
    if (value === target) return s.why;
    if (value === `H2:${target}` || value === `H3:${target}`) return s.why;
  }
  if (field === "mainWords") {
    const words = kind === "removed" ? SWAP_FROM_WORDS : SWAP_TO_WORDS;
    if (words.has(value)) {
      return "word of an approved string swap";
    }
  }
  return null;
}

const titlesBefore = new Set(
  Object.values(before.routes).map((r) => r.title),
);
const titlesAfter = new Set(Object.values(after.routes).map((r) => r.title));

/**
 * ONE ARTICLE WAS RETITLED, AND A TITLE APPEARS IN NINE INVENTORIES.
 *
 * "What a home services franchise actually is" became "Home services franchise:
 * what the category actually is" so the phrase leads. That one edit shows up as
 * a removal and an addition in the title, the Open Graph and Twitter metas, the
 * h1, the h2 on the index, seventeen card anchors, the Article headline, a
 * breadcrumb name, and the main text of every route that lists the section.
 *
 * THE RULE IS A SUBSTITUTION CHECK, NOT A CONTAINS CHECK. A removed value is
 * approved only when the identical string with the old title swapped for the
 * new one is present in the after capture, and the reverse for an addition.
 * A card whose description also changed, or an anchor whose href moved, fails
 * both halves and is reported, because the substituted string would not be
 * found.
 */
const RETITLE_FROM = "What a home services franchise actually is";
const RETITLE_TO = "Home services franchise: what the category actually is";
const RETITLE_WHY =
  'Ahrefs retitle, directed: "Retitle the existing article for home services franchise"';

/* Every value of a field across a whole capture, built once, on first use. */
const valueIndex = { before: null, after: null };
function valuesOf(side, field) {
  if (!valueIndex[side]) {
    const source = side === "before" ? before : after;
    const index = {};
    for (const [name, get] of FIELDS) {
      const all = new Set();
      for (const route of Object.values(source.routes)) {
        for (const value of get(route) ?? []) all.add(value);
      }
      index[name] = all;
    }
    valueIndex[side] = index;
  }
  return valueIndex[side][field] ?? new Set();
}

const APPROVED_RULES = [
  {
    kind: "removed",
    field: "*",
    why: RETITLE_WHY,
    test: (v, field) =>
      v.includes(RETITLE_FROM) &&
      valuesOf("after", field).has(v.split(RETITLE_FROM).join(RETITLE_TO)),
  },
  {
    kind: "added",
    field: "*",
    why: RETITLE_WHY,
    test: (v, field) =>
      v.includes(RETITLE_TO) &&
      valuesOf("before", field).has(v.split(RETITLE_TO).join(RETITLE_FROM)),
  },
  /*
    The retitled article is also the one article whose title lost the brand
    suffix in the same pass, so neither the substitution rule above nor the
    suffix rule below can see it on its own: the removed string differs from
    every added string by two changes at once. Both halves are listed here as
    literals, which is the right treatment for a value that two approved
    decisions landed on together.
  */
  /* ---- the four call to action positions that came off every article ---- */
  {
    kind: "removed",
    field: "*",
    why: 'CTA pattern, directed: "One position, two links, last block before the footer"',
    test: (v, field) => {
      if (field === "mainWords") return CTA_WORDS.has(v);
      if (CTA_BLOCKS.has(v)) return true;
      /* "H3:Evaluating a franchise?" and "All insights -> /insights". */
      const heading = v.replace(/^H[1-6]:/, "");
      if (heading !== v && CTA_BLOCKS.has(heading)) return true;
      const anchor = v.split(" -> ")[0];
      return v.includes(" -> ") && CTA_BLOCKS.has(anchor);
    },
  },

  /* ---- the four descriptions ---- */
  {
    kind: "removed",
    field: "metas",
    why: 'description lengths, directed: "Fix the short home description and the three long descriptions"',
    test: (v) => META_KEY.test(v) && OLD_DESCRIPTIONS.has(v.replace(META_KEY, "")),
  },
  {
    kind: "added",
    field: "metas",
    why: 'description lengths, directed: "Fix the short home description and the three long descriptions"',
    test: (v) => META_KEY.test(v) && NEW_DESCRIPTIONS.has(v.replace(META_KEY, "")),
  },

  {
    kind: "removed",
    field: "title",
    why: `${RETITLE_WHY}, and the suffix drop, on the same string`,
    test: (v) => v === `${RETITLE_FROM}${BRAND_SUFFIX}`,
  },
  {
    kind: "added",
    field: "title",
    why: `${RETITLE_WHY}, and the suffix drop, on the same string`,
    test: (v) => v === RETITLE_TO,
  },
  /*
    WORD LEVEL, DERIVED FROM THE RETITLE AND NOTHING ELSE.

    A word is approved only if it is a word of the old headline (on the removed
    side) or of the new one (on the added side). Nothing else passes.

    THE LIMIT, STATED RATHER THAN GLOSSED. These are multisets, so if some
    unrelated change removed a further instance of a common word like "the",
    this rule would approve that instance too. What stops that mattering is
    that the block inventory is the stricter check and it is already clean:
    mainBlocks reports zero unapproved, so no new or missing sentence exists
    for a stray word to belong to. Word level is the backstop here, not the
    authority.
  */
  {
    kind: "removed",
    field: "mainWords",
    why: `${RETITLE_WHY} (word of the previous headline)`,
    test: (v) => RETITLE_FROM.split(" ").includes(v),
  },
  {
    kind: "added",
    field: "mainWords",
    why: `${RETITLE_WHY} (word of the new headline)`,
    test: (v) => RETITLE_TO.split(" ").includes(v),
  },
  {
    kind: "removed",
    field: "title",
    why: 'title suffix: "Drop | Craftline Brands from article titles"',
    test: (v) =>
      v.endsWith(BRAND_SUFFIX) &&
      titlesAfter.has(v.slice(0, -BRAND_SUFFIX.length)),
  },
  {
    kind: "added",
    field: "title",
    why: 'title suffix: "Drop | Craftline Brands from article titles"',
    test: (v) => titlesBefore.has(v + BRAND_SUFFIX),
  },
  {
    kind: "removed",
    field: "jsonLd",
    why: 'schema hygiene: "Fix the trailing slash so schema url matches canonical exactly"',
    test: (v) =>
      v === "url=https://craftlinebrands.com/" ||
      v === "itemListElement[0].item=https://craftlinebrands.com/",
  },
  {
    kind: "added",
    field: "jsonLd",
    why: 'schema hygiene: "Fix the trailing slash so schema url matches canonical exactly"',
    test: (v) =>
      v === "url=https://craftlinebrands.com" ||
      v === "itemListElement[0].item=https://craftlinebrands.com",
  },
  {
    kind: "added",
    field: "jsonLd",
    why: 'FAQPage on /franchising, from FRANCHISE_FAQ, already rendered on the page',
    /*
      ANCHORED ON THE ACTUAL FAQ VALUES, NOT ON THE FIELD NAME.

      The first version matched name= and text= as prefixes, which approved any
      question and any answer. A tenth entry added to FRANCHISE_FAQ would have
      walked straight past Rule One, which is exactly the check that exists to
      stop content appearing without a decision behind it. The values are read
      from the same config export the page and the schema both read, so this
      approves the nine that were decided and nothing else.
    */
    test: (v) =>
      FAQ_UNCHANGED &&
      (v === "@type=FAQPage" ||
        /^mainEntity\[\d+\]\.@type=Question$/.test(v) ||
        /^mainEntity\[\d+\]\.acceptedAnswer\.@type=Answer$/.test(v) ||
        FAQ_VALUES.has(v.replace(/^mainEntity\[\d+\]\./, "")) ||
        v === "@id=https://craftlinebrands.com/franchising#faq" ||
        v === "isPartOf.@id=https://craftlinebrands.com/#website"),
  },
  {
    kind: "added",
    field: "jsonLd",
    why: 'breadcrumb schema on /privacy and /terms, directed',
    test: (v) =>
      /*
        Anchored at both ends. The first version left the name alternation
        open, so "name=Home services franchise: what the category actually is"
        matched on the word "Home" and an article retitle was quietly approved
        as a breadcrumb. An allowlist that approves by prefix is not one.
      */
      /^itemListElement\[\d+\]\.(name=(Home|Privacy policy|Terms of use)$|item=https:\/\/craftlinebrands\.com(\/privacy|\/terms)?$|@type=ListItem$|position=\d+$)/.test(
        v,
      ) ||
      v === "@type=BreadcrumbList" ||
      /*
        The context line of a node this rule already approved. On its own this
        string is generic enough to cover a context added by any new schema
        type, so it is scoped to the count: three nodes were added on two
        routes, and a fourth would show up as an unapproved @type beside it.
      */
      v === "@context=https://schema.org",
  },
];

function ruleFor(field, kind, value) {
  for (const rule of APPROVED_RULES) {
    if (rule.field !== "*" && rule.field !== field) continue;
    if (rule.kind !== kind) continue;
    if (rule.test(value, field)) return rule.why;
  }
  return null;
}

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
  const byRule = ruleFor(field, kind, value);
  if (byRule) return byRule;
  const bySwap = swapFor(field, kind, value);
  if (bySwap) return bySwap;
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
