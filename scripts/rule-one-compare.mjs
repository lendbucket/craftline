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
 * THIS LIST IS SELF CERTIFYING AND THAT HOLE IS NOT CLOSED
 * -------------------------------------------------------
 * A session can add a page it was not asked for AND add the approval entry for
 * it IN THE SAME COMMIT, and this tool prints CLEAN. The verdict becomes
 * indistinguishable from a run where nothing needed approving.
 *
 * It is not specific to any one entry. It applies to the literal lists above,
 * to every rule below, to the string swaps and to the FAQ count pin. Every one
 * of them can be extended by the same session whose change it excuses.
 *
 * Route additions are NOT approvable and there is no list for them. A
 * mechanism to approve a new route by name was built in September 2026 to let
 * a founder page through, the page was ruled against, and the mechanism went
 * with the branch. Any route delta fails the run again, in both directions,
 * which is the original and stricter behaviour. If a future phase needs to add
 * a route, the honest options are to let the gate go red and explain it in the
 * report, or to build the mechanism again deliberately and read this note
 * first.
 *
 * NOTHING IN THIS REPOSITORY CAN FIX IT, and the reasoning is worth keeping so
 * nobody spends a day rediscovering it. Any control written here is a file in
 * the same repository as the thing it controls, editable in the same commit:
 *
 *   - A check that diffs this allowlist against the baseline commit can be
 *     deleted, and the acknowledgement flag it would introduce can be passed.
 *   - A verdict string can be changed back.
 *   - A recorded plant is a comment.
 *   - A signed approval token still needs in-repo code to verify it.
 *   - An allowlist fetched from outside still needs an in-repo fetch to stub.
 *
 * The checker and the checked are in one trust domain. A verification cannot
 * authorise itself, and moving the authorisation into the same repository does
 * not move it outside.
 *
 * WHAT ACTUALLY CONTROLS IT lives on GitHub and not here: branch protection on
 * main requiring a pull request and the owner's review, plus CODEOWNERS on
 * scripts/ so a harness change cannot merge without the owner looking at it
 * specifically. Both are repository settings, neither is reachable from a
 * commit, and the owner set them up. CODEOWNERS is the one place the recursion
 * works in our favour: editing it is itself a CODEOWNERS change requiring the
 * same review.
 *
 * WHAT THE IN-REPO WORK HERE IS FOR, stated so nobody mistakes it for a fix.
 * The verdict line now prints how many allowlist entries a run leaned on and
 * says outright that the list is self certifying. That is LEGIBILITY. It is
 * good against carelessness, which is what has actually failed on this project
 * every time: the stale capture, five voice rules pointed at the wrong unit, a
 * CTA rule bounded in one direction. It is worth nothing against intent.
 *
 * A third fix was proposed and declined by the owner: having this script diff
 * its own allowlist against the baseline commit and refuse to print CLEAN
 * silently. It was declined on the grounds that it introduces a new bypass, an
 * acknowledgement flag, in the act of closing one, and buys little over the
 * two cheap changes once neither stops a determined session anyway.
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
 *   THE PLANT THAT DOES NOT PASS, RECORDED BECAUSE IT DOES NOT
 *     plant  a session adds content it was never asked for, and adds the
 *            allowlist entry for it in the same commit
 *     result SILENT. The run prints CLEAN and the verdict is
 *            indistinguishable from a run where nothing needed approving.
 *     status NOT FIXED, AND NOT FIXABLE HERE. See the self certification note
 *            in the header of this file.
 *
 *     It is written down as a failing plant rather than left out, because the
 *     passing plants below read as complete coverage and they are not. That
 *     assumption is what produced this gap: every plant in this file verifies
 *     ENFORCEMENT and none of them says anything about AUTHORISATION, and the
 *     near miss recorded for each one, "the approved value, present", is
 *     precisely the shape a bad approval wears.
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

/**
 * WHAT THE TWO APPROVED ARTICLES PUT ONTO PAGES THAT ALREADY EXISTED.
 *
 * Adding an article to this section is not a local act. Its title and
 * description render on the insights hub, in the further reading grid on every
 * other article, and in the comma separated run of every title on the
 * franchising page. Two articles moved 1,494 values across 27 existing routes
 * and not one of them touched an existing page's own title, metas, canonical,
 * robots, schema, header or footer. That was verified separately before these
 * entries were written.
 *
 * THE VALUES ARE LITERALS, NOT READ OUT OF THE ARTICLE DATA. Deriving a
 * content approval from the content file is the mirror pattern: the FAQPage
 * entry did exactly that, read the whole array it was approving, and therefore
 * approved a planted tenth question. Writing the strings out means a third
 * article cannot be approved by this entry however the data changes, and it
 * means a reviewer can see what was approved without opening another file.
 */
const APPROVED_ARTICLES = [
  {
    slug: "what-is-in-a-franchise-agreement",
    title: "Franchise agreement: what is actually in one",
    description:
      "Franchise agreement: what each part of the contract does, the seven day rule almost nobody mentions, and where the disclosure stops and the obligation starts.",
    eyebrow: "The agreement",
    date: "September 20, 2026",
  },
  {
    slug: "how-a-franchise-agreement-ends",
    title: "Franchise termination: how an agreement ends",
    description:
      "Franchise termination is governed by the contract and by state law, not by the federal rule. The three ways an agreement ends, and what survives it.",
    eyebrow: "The agreement",
    date: "September 19, 2026",
  },
];

const ARTICLE_STRINGS = new Set();
const ARTICLE_WORDS = new Set();
for (const a of APPROVED_ARTICLES) {
  ARTICLE_STRINGS.add(a.title);
  ARTICLE_STRINGS.add(a.description);
  ARTICLE_STRINGS.add(`/insights/${a.slug}`);
  for (const w of `${a.title} ${a.description}`.split(/\s+/)) if (w) ARTICLE_WORDS.add(w);
}

/*
  Per card furniture that scales with the article count rather than with these
  two articles specifically: the eyebrow, the formatted publication date, and
  the hub's "Read this" label with its screen reader suffix. The franchising
  page lists every title in one comma separated run, so two more articles add
  two more separators. Each class is named rather than matched loosely.
*/
const ARTICLE_FURNITURE = new Set([
  ...APPROVED_ARTICLES.map((a) => a.eyebrow),
  ...APPROVED_ARTICLES.map((a) => a.date),
  "Read this",
]);
const FURNITURE_WORDS = new Set([
  ...APPROVED_ARTICLES.flatMap((a) => `${a.eyebrow} ${a.date}`.split(/\s+/)),
  "Read",
  "this",
  ":",
  ",",
]);

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


/**
 * THE FOUR APPROVED PARAGRAPH SPLITS, RESTRUCTURE OF THE THREE UNIFORM ARTICLES.
 *
 * Authorising decision, quoted: "Restructure the three, do not exempt them. An
 * exemption list is a moved threshold with a record attached... Change block
 * boundaries only. Merge where two paragraphs are one thought, split where one
 * paragraph carries two. No new sentences and no removed words, so the word
 * inventory stays identical across all three and Rule One sees only block
 * movement."
 *
 * These are literals taken from the two captures, not derived from the article
 * data. Deriving an allowlist from the thing it is checking is the mirror
 * pattern that let a planted tenth FAQ question through, and it is not repeated
 * here.
 *
 * WHAT THE RULE ACTUALLY ASSERTS, which is more than membership of a list. An
 * added block is approved only if it is one half of a recorded pair, its
 * sibling half is also on the page, the two halves rejoin with a single space
 * into exactly the original string, and that original is in the before
 * inventory and gone from the after one. A block that merely resembles an
 * approved half fails all four. The word level says the same thing from the
 * other direction: mainWords is zero in both directions, so no word was added
 * or lost anywhere on the property.
 *
 * INJECTION VERIFIED, both plants, per the standing rule.
 *
 * MUST CATCH. One word inserted into an approved half in the after capture:
 * "franchising is the wrong tool" -> "franchising is usually the wrong tool",
 * with "usually" added to mainWords, which is what a session slipping a word in
 * under cover of a boundary move would look like.
 *
 *   mainBlocks     0         2       0       6
 *   mainWords      0         1       0       0
 *   NOT CLEAN. unexplained removed=0 unapproved added=3
 *
 * Three, not one: the doctored half fails, its sibling fails with it because
 * the pair no longer rejoins into the original, and the word fails on its own
 * at word level. The rule does not degrade to approving the half that was left
 * alone.
 *
 * MUST NOT CATCH. The four genuine splits as deployed:
 *
 *   CLEAN. Zero unexplained removals, zero unapproved additions, no route or
 *   sitemap delta. 8 approved delta(s) under 1 allowlist entry.
 */
const APPROVED_SPLITS = [
  {
    path: "/insights/franchising-for-veterans",
    original:
      "This category attracts confident numbers about veteran business performance and franchise success rates. Most of them cannot be traced to a primary source. The handling is the same as everywhere else on this site:",
    halves: [
      "This category attracts confident numbers about veteran business performance and franchise success rates. Most of them cannot be traced to a primary source.",
      "The handling is the same as everywhere else on this site:",
    ],
  },
  {
    path: "/insights/what-veteran-operators-bring-to-trade-services",
    original:
      "That is very close to the hardest problem in a trade service business. Skilled technicians are scarce, and the ones who exist are already employed. Any trade business that intends to grow has to be able to bring in apprentices and develop them, which means someone has to be willing to train, to supervise closely, to correct without discouraging, and to hold a line on standards while somebody is still learning. Plenty of excellent technicians are poor at this and dislike doing it. People who came up through a training culture usually understand what developing somebody actually involves, and they are more likely to treat it as part of the job rather than as an interruption to it.",
    halves: [
      "That is very close to the hardest problem in a trade service business. Skilled technicians are scarce, and the ones who exist are already employed. Any trade business that intends to grow has to be able to bring in apprentices and develop them, which means someone has to be willing to train, to supervise closely, to correct without discouraging, and to hold a line on standards while somebody is still learning.",
      "Plenty of excellent technicians are poor at this and dislike doing it. People who came up through a training culture usually understand what developing somebody actually involves, and they are more likely to treat it as part of the job rather than as an interruption to it.",
    ],
  },
  {
    path: "/insights/why-trade-services-suit-franchise-systems",
    original:
      "It means the natural unit of the business is one crew serving one metro area. You cannot consolidate the work into a call centre or a warehouse and serve everyone from there, the way retail and software consolidated. Every market needs its own vans, its own licensed people, and its own relationships with suppliers and inspectors. That is a lot of independent local units doing recognisably the same job, which is the shape a franchise system exists to serve. Where a business can be centralised, it usually should be, and franchising is the wrong tool. Where it cannot, the choice is between a company that opens branches and a system that licenses operators.",
    halves: [
      "It means the natural unit of the business is one crew serving one metro area. You cannot consolidate the work into a call centre or a warehouse and serve everyone from there, the way retail and software consolidated. Every market needs its own vans, its own licensed people, and its own relationships with suppliers and inspectors. That is a lot of independent local units doing recognisably the same job, which is the shape a franchise system exists to serve.",
      "Where a business can be centralised, it usually should be, and franchising is the wrong tool. Where it cannot, the choice is between a company that opens branches and a system that licenses operators.",
    ],
  },
  {
    path: "/insights/why-trade-services-suit-franchise-systems",
    original:
      "Compare that to categories where a franchisor has to invent the standard, publish it, and then police it alone. Those systems spend enormous effort on quality control because there is no external referee. In the trades a large part of the standard is external and mandatory. A playbook does not have to define what good wiring is. It has to define how the business consistently produces work that passes, how it prices that work before starting, and how it trains people to that level. That is a much narrower and much more solvable problem.",
    halves: [
      "Compare that to categories where a franchisor has to invent the standard, publish it, and then police it alone. Those systems spend enormous effort on quality control because there is no external referee.",
      "In the trades a large part of the standard is external and mandatory. A playbook does not have to define what good wiring is. It has to define how the business consistently produces work that passes, how it prices that work before starting, and how it trains people to that level. That is a much narrower and much more solvable problem.",
    ],
  },
];

const SPLIT_HALVES = new Map();
for (const r of APPROVED_SPLITS) {
  if (r.halves.join(" ") !== r.original) {
    throw new Error(`approved split does not rejoin: ${r.path}`);
  }
  for (const h of r.halves) SPLIT_HALVES.set(h, r);
}
const SPLIT_WHY =
  'restructure of the three uniform articles, directed: "Restructure the three, do not exempt them... Change block boundaries only"';

/**
 * ROUTE SCOPES. EVERY ENTRY SAYS WHICH ROUTES ITS DECISION COVERED.
 * ================================================================
 *
 * Directed: "Scope the allowlist... Scope every entry to the routes its
 * authorising decision covered."
 *
 * Before this, approval was a function of a value and nothing else, so an
 * entry authorising a change on one page approved the identical string
 * anywhere on the property. A value is now approved only if EVERY route it was
 * added on falls inside the scope of the entry claiming it. Every, not any: a
 * string landing on one approved route and one unapproved route fails, which
 * is the case the loose version was silently passing.
 *
 * THE ARTICLE SCOPE IS A STRUCTURAL CLAIM, CHECKED AGAINST THE TEMPLATES
 * RATHER THAN AGAINST THE DIFF. Exactly three route templates read the
 * insights data: src/app/insights/page.tsx, src/app/insights/[slug]/page.tsx
 * and src/app/franchising/page.tsx, plus src/app/sitemap.ts, which emits no
 * text. Nothing else imports INSIGHTS or ORDERED_INSIGHTS. So an article can
 * only reach /insights, /insights/<slug> and /franchising, and seven routes
 * are structurally out of its reach: /, /about, /brands,
 * /brands/wattsmith-electric, /contact, /privacy and /terms.
 *
 * Deriving the scope from which routes happened to change would have been the
 * mirror pattern, reading the answer off the thing being checked. This claim
 * is about what the code can render, which is checkable without any run.
 *
 * WHAT SCOPING DOES NOT FIX, said here rather than left to be discovered. The
 * absorption that prompted it, where the articles 1 and 2 entry approved 1,612
 * of the next batch's additions, is not a route problem. Both batches
 * propagate onto the same three surfaces, so route scoping leaves that number
 * exactly where it was. The absorption was a word level problem and it is
 * fixed separately below, by replacing the static word list with a budget
 * drawn from the blocks a run actually approved.
 *
 * INJECTION VERIFIED, both halves, per the standing rule.
 *
 * The plant is article 1's title, which is an already approved value, pushed
 * into the after capture on one route at a time. The capture is edited rather
 * than the site, because the thing under test is the comparison.
 *
 *   catch  "Franchise agreement: what is actually in one" on /privacy, a route
 *          no article can structurally reach
 *          -> ADDED      Franchise agreement: what is actually in one
 *          listed as an unapproved addition                          CAUGHT
 *
 *   miss   the same string on /insights, which is inside the scope the
 *          decision covered
 *          -> ok added   Franchise agreement: what is actually in one
 *             (articles 1 and 2, directed: "Approve the two new routes and
 *             their propagation")                                    SILENT
 *
 * Before this change both runs printed the second line. The value was
 * approved and the route was never consulted.
 */
const SITE_WIDE = () => true;
const ARTICLE_SURFACES = (path) =>
  path === "/insights" ||
  path === "/franchising" ||
  path.startsWith("/insights/");

/** Every route a value landed on has to be inside the scope, or it fails. */
function inScope(scope, routes) {
  if (!scope) return false;
  if (!routes || routes.size === 0) return true;
  for (const path of routes) if (!scope(path)) return false;
  return true;
}

const APPROVED_RULES = [
  /* ---- the four approved paragraph splits, block movement only ---- */
  {
    kind: "added",
    field: "mainBlocks",
    scope: ARTICLE_SURFACES,
    why: SPLIT_WHY,
    test: (v) => {
      const r = SPLIT_HALVES.get(v);
      if (!r) return false;
      const after = valuesOf("after", "mainBlocks");
      const before = valuesOf("before", "mainBlocks");
      return (
        r.halves.every((h) => after.has(h)) &&
        before.has(r.original) &&
        !after.has(r.original)
      );
    },
  },

  {
    kind: "removed",
    field: "*",
    scope: SITE_WIDE,
    why: RETITLE_WHY,
    test: (v, field) =>
      v.includes(RETITLE_FROM) &&
      valuesOf("after", field).has(v.split(RETITLE_FROM).join(RETITLE_TO)),
  },
  {
    kind: "added",
    field: "*",
    scope: SITE_WIDE,
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
  /* ---- the two approved articles, propagating onto existing pages ---- */
  {
    kind: "added",
    field: "*",
    scope: ARTICLE_SURFACES,
    why: 'articles 1 and 2, directed: "Approve the two new routes and their propagation"',
    test: (v, field) => {
      if (field === "mainWords") {
        return ARTICLE_WORDS.has(v) || FURNITURE_WORDS.has(v);
      }
      if (ARTICLE_FURNITURE.has(v)) return true;
      /* "H2:<title>" on the hub, and "<title> -> /insights/<slug>" anchors. */
      const bare = v.replace(/^H[1-6]:/, "").split(" -> ")[0];
      if (ARTICLE_STRINGS.has(bare)) return true;
      /* Card blocks concatenate eyebrow, date, title and description. */
      return [...ARTICLE_STRINGS].some((s) => s.length > 30 && v.includes(s));
    },
  },

  /* ---- the four call to action positions that came off every article ---- */
  {
    kind: "removed",
    field: "*",
    scope: SITE_WIDE,
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
    scope: SITE_WIDE,
    why: 'description lengths, directed: "Fix the short home description and the three long descriptions"',
    test: (v) => META_KEY.test(v) && OLD_DESCRIPTIONS.has(v.replace(META_KEY, "")),
  },
  {
    kind: "added",
    field: "metas",
    scope: SITE_WIDE,
    why: 'description lengths, directed: "Fix the short home description and the three long descriptions"',
    test: (v) => META_KEY.test(v) && NEW_DESCRIPTIONS.has(v.replace(META_KEY, "")),
  },

  {
    kind: "removed",
    field: "title",
    scope: SITE_WIDE,
    why: `${RETITLE_WHY}, and the suffix drop, on the same string`,
    test: (v) => v === `${RETITLE_FROM}${BRAND_SUFFIX}`,
  },
  {
    kind: "added",
    field: "title",
    scope: SITE_WIDE,
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
    scope: SITE_WIDE,
    why: `${RETITLE_WHY} (word of the previous headline)`,
    test: (v) => RETITLE_FROM.split(" ").includes(v),
  },
  {
    kind: "added",
    field: "mainWords",
    scope: SITE_WIDE,
    why: `${RETITLE_WHY} (word of the new headline)`,
    test: (v) => RETITLE_TO.split(" ").includes(v),
  },
  {
    kind: "removed",
    field: "title",
    scope: SITE_WIDE,
    why: 'title suffix: "Drop | Craftline Brands from article titles"',
    test: (v) =>
      v.endsWith(BRAND_SUFFIX) &&
      titlesAfter.has(v.slice(0, -BRAND_SUFFIX.length)),
  },
  {
    kind: "added",
    field: "title",
    scope: SITE_WIDE,
    why: 'title suffix: "Drop | Craftline Brands from article titles"',
    test: (v) => titlesBefore.has(v + BRAND_SUFFIX),
  },
  {
    kind: "removed",
    field: "jsonLd",
    scope: SITE_WIDE,
    why: 'schema hygiene: "Fix the trailing slash so schema url matches canonical exactly"',
    test: (v) =>
      v === "url=https://craftlinebrands.com/" ||
      v === "itemListElement[0].item=https://craftlinebrands.com/",
  },
  {
    kind: "added",
    field: "jsonLd",
    scope: SITE_WIDE,
    why: 'schema hygiene: "Fix the trailing slash so schema url matches canonical exactly"',
    test: (v) =>
      v === "url=https://craftlinebrands.com" ||
      v === "itemListElement[0].item=https://craftlinebrands.com",
  },
  {
    /*
      THIS ENTRY IS A LIVE EXAMPLE OF THE HOLE DOCUMENTED IN THE HEADER.

      The same session that added legalName to the Organization node added this
      line to excuse it. The run then prints CLEAN. Nothing here verified that
      the owner asked for it; the only thing that did is the owner reading the
      diff. Left with this note attached rather than written silently, because
      the note is the whole of what in-repo work can contribute.
    */
    kind: "added",
    field: "jsonLd",
    scope: SITE_WIDE,
    why: 'entity work, directed: "legalName from existing config", LEGAL_ENTITIES[1], the franchisor entity',
    test: (v) => v === "legalName=Craftline Brands Franchising LLC",
  },
  {
    kind: "added",
    field: "jsonLd",
    scope: SITE_WIDE,
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
    scope: SITE_WIDE,
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

function ruleFor(field, kind, value, routes) {
  for (const rule of APPROVED_RULES) {
    if (rule.field !== "*" && rule.field !== field) continue;
    if (rule.kind !== kind) continue;
    if (!rule.test(value, field)) continue;
    if (!inScope(rule.scope, routes)) continue;
    return rule.why;
  }
  return null;
}

const flat = (o) =>
  Object.fromEntries(
    Object.entries(o).map(([f, list]) => [f, new Map(list)]),
  );
const APPROVED_REMOVED = flat(APPROVED.removed);
const APPROVED_ADDED = flat(APPROVED.added);

/**
 * WORD LEVEL IS A BUDGET DRAWN FROM THE BLOCKS A RUN APPROVED, NOT A LIST.
 *
 * THE DEFECT THIS REPLACES, and it is the one the owner found rather than one
 * the harness found. The old version built a Set of every word appearing in
 * any approved value and then approved any word level addition matching it.
 * The approved titles contain "the", "a", "what" and "is", so the entry for
 * articles 1 and 2 approved those words in unlimited quantity, on any route,
 * for ever. Running articles 3 to 6 against it, 1,612 of 3,602 additions came
 * back pre-approved under a decision that had nothing to do with them, and the
 * verdict line reported them as approved deltas.
 *
 * Route scoping does not touch this. Both batches propagate onto the same
 * three surfaces, so every one of those 1,612 was inside the scope.
 *
 * WHAT REPLACES IT. The block inventories are the authority and the word
 * inventories exist to catch what block boundaries can hide. So the words a
 * run may approve are exactly the words inside the blocks that run approved,
 * counted with multiplicity. A block approved on twenty routes appears twenty
 * times in the site wide multiset, so it funds twenty copies of each of its
 * words and not one more. A word arriving from anywhere else has no funding
 * and fails.
 *
 * This is self limiting in the way the list was not: an entry cannot fund a
 * batch it never approved, because the budget is built during the run from
 * that run's approved blocks. Block fields are processed before their word
 * fields, which FIELDS already guarantees and which is asserted below.
 */
const WORD_BUDGET = new Map();
function fundWord(wordField, word) {
  const key = `${wordField}|${word}`;
  WORD_BUDGET.set(key, (WORD_BUDGET.get(key) ?? 0) + 1);
}
function spendWord(wordField, word) {
  const key = `${wordField}|${word}`;
  const n = WORD_BUDGET.get(key) ?? 0;
  if (n <= 0) return false;
  WORD_BUDGET.set(key, n - 1);
  return true;
}

const WORD_FIELDS = new Set(["mainWords", "headerWords", "footerWords"]);
function approvalFor(field, kind, value, routes) {
  /*
    The literal table and the string swaps are both site wide by decision. Each
    one is a single edit to a shared component, a heading level, or a title
    that propagates by design, so there is no narrower set of routes to name.
    Written as an explicit SITE_WIDE check rather than by leaving the scope out,
    so an entry with no scope reads as a decision and not as an oversight.
  */
  const table = kind === "removed" ? APPROVED_REMOVED : APPROVED_ADDED;
  const hit = table[field]?.get(value);
  if (hit && inScope(SITE_WIDE, routes)) return hit;
  const byRule = ruleFor(field, kind, value, routes);
  if (byRule) return byRule;
  const bySwap = swapFor(field, kind, value);
  if (bySwap) return bySwap;
  if (kind === "added" && WORD_FIELDS.has(field) && spendWord(field, value)) {
    return "word of a block approved in this run";
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
/**
 * NEW ROUTES, APPROVED BY NAME. ROUTE LOSSES, NEVER APPROVABLE.
 *
 * THIS MECHANISM EXISTED ONCE AND WAS DELETED, AND THAT HISTORY IS THE POINT.
 * It was first built in September 2026 to let a founder page through, in the
 * same commit as the page. The page was ruled against, the branch was deleted,
 * and the mechanism went with it. The note left behind said that a future
 * phase needing a route had two honest options: let the gate go red and
 * explain it in the report, or rebuild this deliberately having read the note.
 *
 * The first option was taken for the two agreement articles. This is the
 * second, and the difference from the first time is the whole of what the
 * self certification finding was about:
 *
 *   - It is authorised by a specific instruction, quoted in each entry.
 *   - It is in a commit that contains NO content, only approvals, so the
 *     approval and the thing approved cannot be read as one act.
 *   - It was written after the owner read the drafts, not before.
 *
 * None of that is enforced by anything here. It is still self certifying and
 * the header says so. What changed is the sequence, and the sequence is the
 * only part a person reviewing this can check.
 *
 * THE ASYMMETRY IS DELIBERATE. An added route is approvable because somebody
 * decided to add it. A LOST route is never approvable: a page that stops
 * existing takes its content, its inbound links and its rankings with it.
 * Sitemap deltas are checked against the same list, so a route cannot be
 * approved into existence and quietly left out of the sitemap.
 *
 * INJECTION VERIFIED, both halves:
 *   catch  an unapproved route planted into the after capture
 *          -> "routes gained 1 /insights/planted", NOT CLEAN        CAUGHT
 *   catch  an APPROVED route deleted, proving approval does not work in the
 *          losing direction
 *          -> "routes lost 1 ...", NOT CLEAN                        CAUGHT
 *   miss   the two approved routes present as intended
 *          -> CLEAN, 1,494 approved deltas                          SILENT
 *
 * A THIRD CHECK THAT IS NOT A PLANT, and is worth more than either. The
 * propagation was verified a second time by a separately written script that
 * asked a narrower question: for each of the 27 pre-existing routes, is every
 * added value attributable to one of the two new articles? It answered 1,494
 * attributable, zero unattributable, zero removals, and zero changes to any
 * existing page's own title, metas, canonical, robots, schema, header or
 * footer. That number matches the approved count here exactly. Two checks
 * written independently agreeing on a figure is a stronger statement than
 * either making it alone.
 */
const APPROVED_NEW_ROUTES = new Map([
  [
    "/insights/what-is-in-a-franchise-agreement",
    'articles 1 and 2, directed: "Voice approved on both drafts. Approve the two new routes and their propagation."',
  ],
  [
    "/insights/how-a-franchise-agreement-ends",
    'articles 1 and 2, directed: "Voice approved on both drafts. Approve the two new routes and their propagation."',
  ],
]);

const routesLost = [...routesBefore].filter((r) => !routesAfter.has(r));
const routesGainedAll = [...routesAfter].filter((r) => !routesBefore.has(r));
const routesGained = routesGainedAll.filter((r) => !APPROVED_NEW_ROUTES.has(r));
const routesGainedApproved = routesGainedAll.filter((r) => APPROVED_NEW_ROUTES.has(r));
const sitemapLost = minus(before.sitemap, after.sitemap);
const sitemapGainedAll = minus(after.sitemap, before.sitemap);
const sitemapGained = sitemapGainedAll.filter((r) => !APPROVED_NEW_ROUTES.has(r));

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
  /*
    WHICH ROUTES EACH VALUE LANDED ON, so an entry can be held to its scope.

    The diff above is a site wide multiset, which is what makes it immune to a
    string moving between pages. Scoping needs the other view as well, so this
    inverts the per route lists into value -> set of routes. A value appearing
    on three routes carries all three, and inScope requires every one of them
    to be inside the claiming entry's scope.
  */
  const routesOf = { added: new Map(), removed: new Map() };
  const note = (map, value, path) => {
    let set = map.get(value);
    if (!set) map.set(value, (set = new Set()));
    set.add(path);
  };
  for (const { path, gone, came } of perRoute) {
    for (const v of came) note(routesOf.added, v, path);
    for (const v of gone) note(routesOf.removed, v, path);
  }

  /* Split each bucket into approved and unapproved. */
  const part = (values, kind) => {
    const ok = [];
    const bad = [];
    for (const v of values) {
      const why = approvalFor(field, kind, v, routesOf[kind].get(v));
      if (why) ok.push({ v, why });
      else bad.push(v);
    }
    return { ok, bad };
  };
  const rem = part(siteGone, "removed");
  const add = part(siteCame, "added");

  /*
    FUND THE WORD BUDGET FROM THE BLOCKS THIS RUN APPROVED.

    One instance of an approved block funds one copy of each of its words, so a
    block approved on twenty routes funds twenty. Block fields are processed
    before their word fields; the assertion below makes that ordering a
    checked fact rather than a property of how FIELDS happens to be written.
  */
  if (BLOCK_FIELDS.has(field)) {
    const wordField = WORDS_FOR_BLOCKS[field];
    if (report[wordField]) {
      throw new Error(
        `${wordField} was partitioned before ${field} funded it; FIELDS order is wrong`,
      );
    }
    for (const { v } of add.ok) {
      for (const w of String(v).split(/\s+/)) if (w) fundWord(wordField, w);
    }
  }
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
for (const route of routesGainedApproved) {
  console.log(`  ok  new route   ${route}`);
}
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

/*
  HOW MANY ALLOWLIST ENTRIES THIS RUN LEANED ON.

  Counted so the verdict can say it. See the note on self certification in the
  header: this number is legibility, not control, and the reason it is in the
  verdict line rather than further up is that the verdict line is the one that
  gets quoted into a report.
*/
const entriesUsed = new Set();
for (const [field] of FIELDS) {
  for (const kind of ["removedApproved", "addedApproved"]) {
    for (const item of report[field][kind] ?? []) {
      entriesUsed.add(`${field}:${item.why}`);
    }
  }
}
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
      ? `CLEAN. Zero unexplained removals, zero unapproved additions, no route or sitemap delta. ${approvedTotal} approved delta(s) under ${entriesUsed.size} allowlist entr${entriesUsed.size === 1 ? "y" : "ies"}, each against a written decision. THE ALLOWLIST IS SELF CERTIFYING: read the entries above, not this line.`
      : `CLEAN on removals and additions. ${movedTotal} move(s) listed above need signing off.`,
  );
} else {
  console.log(
    `NOT CLEAN. unexplained removed=${removedTotal} unapproved added=${addedTotal} routesLost=${routesLost.length} routesGained=${routesGained.length}`,
  );
  process.exitCode = 1;
}
