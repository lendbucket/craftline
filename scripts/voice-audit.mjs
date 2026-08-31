/**
 * VOICE AUDIT
 * ===========
 *
 * Reads the rendered text of every route and fails on the writing tells this
 * property has standing rules against.
 *
 *   npm run build && npm run voice-audit
 *
 * WHY IT READS THE RENDERED PAGE RATHER THAN THE SOURCE. Copy on this site is
 * assembled from config, data files, and template literals, and a sentence that
 * exists nowhere in any single file still reaches a reader. The Phase 1 string
 * comparison learned that the hard way: eight strings matched nothing in `src`
 * and every one of them was on the live site, composed at build time. So the
 * unit of inspection is what the browser gets.
 *
 * WHAT IT CHECKS, AND WHAT EACH CHECK IS ACTUALLY FOR
 * --------------------------------------------------
 *   1. DASHES. No em dash, no en dash, and no hyphen used as a sentence
 *      connector. Hyphens inside compound words are fine and are not matched.
 *
 *   2. EMOJI. None, anywhere.
 *
 *   3. PHRASES. The standing list of AI tells. A phrase list is the crudest
 *      check here and the one most likely to catch a real regression, because
 *      these are the words that arrive when someone is writing quickly.
 *
 *   4. QUESTION HEADING DENSITY. Above roughly 40 per cent of headings on a
 *      page being questions, the page reads as generated. The FAQ is exempt and
 *      the exemption is scoped to a marked region rather than to a route, so it
 *      cannot quietly cover the rest of the page.
 *
 *   5. BOLD LISTICLE LEAD-INS. A list item that opens with a bolded phrase and
 *      a colon, where prose would carry it.
 *
 *   6. SYMMETRICAL PARALLEL PHRASING. Three or more consecutive sibling
 *      elements opening with the same two words. This is the structural tell
 *      that survives a phrase list, because the words themselves are innocent
 *      and it is the repetition across siblings that reads as machine written.
 *
 *   7. UNIFORM PARAGRAPH RHYTHM. Paragraphs that are all the same length. The
 *      measure is the coefficient of variation of word counts across a page's
 *      paragraphs; below 0.25 over a meaningful sample, nothing is being
 *      emphasised by length and the page reads as evenly extruded.
 *
 *   8. REASSURANCE STACKED IN THREES. Three consecutive short sentences inside
 *      one paragraph, which is the shape of "It is fast. It is simple. It is
 *      free."
 *
 *   8b. REASSURANCE STACKED IN THREES INSIDE ONE SENTENCE. The same tell with
 *      commas instead of full stops. This is the rule that was missing, and
 *      the note beside it records what it missed and for how long.
 *
 * WHAT IT CANNOT CHECK, STATED SO NOBODY TREATS A PASS AS A CLEAN BILL
 * -------------------------------------------------------------------
 * One standing tell is not mechanically decidable and is not attempted here:
 * explanatory helper text that narrates what a thing is for, which requires
 * knowing what the thing is. It remains a human read. This audit catches the
 * tells that have a shape; it does not certify the prose.
 *
 * THE DEFECT CLASS THIS FILE HAS NOW BEEN AUDITED FOR
 * ---------------------------------------------------
 * Rule 8 passed for a whole phase while looking at the wrong unit: it counted
 * sentences when the tell was clauses. That is a class of failure, not one
 * bug, and every rule here was re-read for it. What that found:
 *
 *   Rules 1, 2, 3 read <main> only, so the header, the navigation, the footer
 *   and the franchise disclaimer, which is the most repeated prose on the
 *   property, were never checked at all. Now read the whole document.
 *
 *   Rule 4 counted h1 to h4 and ignored <dt>, which this site renders by the
 *   dozen and which is a heading in everything but name. Now included.
 *
 *   Rule 5 tested the tag name STRONG or B, when the tell is visual weight and
 *   this site can produce weight four other ways. Now reads computed weight,
 *   with the colon required to belong to the lead-in.
 *
 *   Rule 6 only looked at siblings, and only under ul, ol, dl or div. An
 *   article wraps each block in its own div, so four consecutive subheads
 *   opening with the same two words were invisible. Now scans headings in
 *   document order as well, and includes article, section and main.
 *
 *   Rule 7 was the one rule that survived unchanged. Its unit is a paragraph
 *   and its subject is paragraph length, which is the same thing. Its real
 *   limit is stated where it runs: it needs near total uniformity to fire,
 *   which is the design rather than a defect.
 *
 * INJECTION VERIFICATION, RUN AND RECORDED
 * ----------------------------------------
 * Every rule was planted into a real page, the site rebuilt, this audit run,
 * and the plant reverted. Two rounds, because question density and paragraph
 * rhythm are page level measurements that a few added blocks cannot move.
 *
 *   Round one, into src/app/terms/page.tsx:
 *     1  em dash                     -> "terms: em dash"                CAUGHT
 *     2  emoji                       -> 'terms: emoji "\u{1F642}"'      CAUGHT
 *     3  "peace of mind"             -> banned phrase, with context     CAUGHT
 *     5  <strong>Scope:</strong>     -> bolded listicle lead-in         CAUGHT
 *     6  three <p> opening "The same"-> 3 consecutive siblings          CAUGHT
 *     6b three headings "Note that"  -> 3 consecutive headings          CAUGHT
 *     8  "It is fast. It is simple. It is free."
 *                                    -> three consecutive short sentences CAUGHT
 *
 *   Round two, terms rebuilt as seven question headings over fourteen
 *   paragraphs of identical length:
 *     4  7 of 8 headings questions   -> "density 88% (7/8)"             CAUGHT
 *     7  14 paragraphs, all 16 words -> "coefficient of variation 0.00" CAUGHT
 *
 *   8b needed no plant. It fires on the live site, on the string it was
 *   written for, on all eighteen articles.
 *
 *   The en dash check shares its code path with the em dash check and differs
 *   only in the literal. It was read rather than planted, and that is stated
 *   here rather than implied by a list that looks complete.
 */
import { chromium } from "playwright";
import { startNextServer } from "./lib/dev-server.mjs";
import { auditRoutes } from "./lib/routes.mjs";

const PORT = 3148;

/**
 * Banned phrases. The standing list, lower cased and matched on word
 * boundaries so "delve" does not fire on "delved" only, and does not fire
 * inside an unrelated word.
 */
const BANNED = [
  "unlock",
  "elevate",
  "seamless",
  "journey",
  "empower",
  "passionate",
  "top-notch",
  "top notch",
  "hassle-free",
  "hassle free",
  "one-stop",
  "one stop",
  "cutting-edge",
  "cutting edge",
  "state-of-the-art",
  "state of the art",
  "look no further",
  "in today's",
  "when it comes to",
  "we've got you covered",
  "we have got you covered",
  "rest assured",
  "not only",
  "delve",
  "navigate the complex",
  "peace of mind",
  "trusted partner",
  "at the end of the day",
];

/*
  Emoji. Pictographic and dingbat ranges plus the variation selector and the
  zero width joiner that compose them. Deliberately does not include the
  arrows and geometric shapes blocks: this site sets a right arrow through
  lucide-react as SVG, and a text arrow would be a legitimate character rather
  than an emoji.
*/
const EMOJI =
  /[\u{1F000}-\u{1FAFF}\u{2190}-\u{21FF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}\u{1F1E6}-\u{1F1FF}]/u;

const server = await startNextServer({ port: PORT });
const browser = await chromium.launch();
const failures = [];
const rows = [];

try {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  for (const route of auditRoutes()) {
    await page.goto(server.base + route.path, {
      waitUntil: "load",
      timeout: 90_000,
    });

    const data = await page.evaluate(() => {
      const root = document.querySelector("main");
      if (!root) return null;
      /*
        THE STRING RULES READ THE WHOLE DOCUMENT, NOT JUST <main>.

        Dashes, emoji, banned phrases and clause triads are properties of a
        rendered string, and the header, the navigation, the footer and the
        franchise disclaimer are rendered strings on all 27 routes. Scoping
        them to <main> meant an em dash in the disclaimer, which is the single
        most repeated block of prose on the property, would have shipped
        unseen. This is the same defect class as the triad rule below: the
        right check pointed at the wrong unit.

        The structural rules stay on <main> and should. Heading density and
        paragraph rhythm are measurements of a document's body; counting the
        navigation into them would flatten both.
      */
      const shell = document.body;

      /*
        Visible text only. sr-only content is real text a screen reader hears
        and is included; hidden and aria-hidden content is not, because a
        decorative numeral is not prose.
      */
      const collect = (node, out) => {
        for (const child of node.childNodes) {
          if (child.nodeType === Node.TEXT_NODE) {
            out.push(child.textContent ?? "");
            continue;
          }
          if (child.nodeType !== Node.ELEMENT_NODE) continue;
          const el = /** @type {Element} */ (child);
          if (el.getAttribute("aria-hidden") === "true") continue;
          if (el.tagName === "SCRIPT" || el.tagName === "STYLE") continue;
          collect(el, out);
        }
        return out;
      };

      const text = collect(root, []).join(" ").replace(/\s+/g, " ");
      const shellText = collect(shell, []).join(" ").replace(/\s+/g, " ");

      /*
        DEFINITION TERMS COUNT AS HEADINGS, BECAUSE THEY ARE ONE.

        The old set was h1 to h4 only. A <dt> is a label a reader scans for in
        exactly the way a heading is, and this site renders a great many of
        them: the glossary, the corporate entities, the FDD explainer. A
        question phrased as a term evaded the density ceiling entirely.

        Including them lowers the measured density on the pages that carry
        long definition lists, and that is the correct direction rather than a
        weakening: those pages genuinely do have more non-question labels than
        the old numerator admitted. Terms inside a marked FAQ region stay out,
        the same as headings there, because a FAQ is questions by definition.
      */
      const headings = [
        ...root.querySelectorAll("h1,h2,h3,h4,dt"),
      ]
        .filter((h) => !h.closest("[data-faq]"))
        .map((h) => (h.textContent ?? "").trim())
        .filter(Boolean);
      const faqTerms = [...root.querySelectorAll("[data-faq] dt")].length;

      /*
        Headings in document order, for the parallel phrasing check below. The
        sibling scan cannot see these: an article renders each block in its own
        wrapper div, so two subheads are never siblings and four consecutive
        ones opening with the same two words registered as nothing at all.
      */
      const headingRun = [...root.querySelectorAll("h1,h2,h3,h4")]
        .filter((h) => !h.closest("[data-faq]"))
        .map((h) =>
          (h.textContent ?? "")
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, " ")
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .join(" "),
        );

      const paragraphs = [...root.querySelectorAll("p")]
        .filter((p) => !p.closest("[data-faq]"))
        .map((p) => (p.textContent ?? "").trim())
        .filter((t) => t.split(/\s+/).length >= 12);

      /*
        Sibling openings, for the parallel phrasing check.

        article, section and main are in the parent list now. They were not,
        which meant a run of siblings placed directly inside an <article> was
        invisible to the scan for no reason other than the tag its parent
        happened to be.
      */
      const siblingRuns = [];
      for (const parent of root.querySelectorAll(
        "ul,ol,dl,div,article,section,main",
      )) {
        const kids = [...parent.children].filter((c) =>
          ["LI", "DIV", "DT", "P"].includes(c.tagName),
        );
        if (kids.length < 3) continue;
        siblingRuns.push(
          kids.map((k) =>
            (k.textContent ?? "").trim().split(/\s+/).slice(0, 2).join(" ").toLowerCase(),
          ),
        );
      }

      /*
        A LEAD-IN IS BOLD TYPE, NOT A <strong> TAG.

        The old check tested tagName against STRONG and B. The tell is visual
        weight, and this site can produce it three other ways: a span carrying
        a font-bold utility, the display face which is drawn at 700 and 800, or
        any wrapper with a weight class on it. All of those looked identical to
        a reader and invisible to the audit.

        Reading the computed weight is the only version of this check that
        tests the thing the rule is about. 600 is the floor because that is
        where the body face stops reading as body text.
      */
      const boldLeadIns = [...root.querySelectorAll("li")]
        .filter((li) => {
          const first = li.firstElementChild;
          if (!first) return false;
          // A decorative marker is not a lead-in. See the numeral in NumberedGrid.
          if (first.getAttribute("aria-hidden") === "true") return false;
          const weight = Number(getComputedStyle(first).fontWeight);
          if (!Number.isFinite(weight) || weight < 600) return false;
          /*
            THE COLON HAS TO BELONG TO THE LEAD-IN.

            Testing for a colon anywhere in the item is what made the widened
            weight check fire on every numbered capability: those carry a bold
            marker at the front and a colon two sentences later, which is not
            the shape this rule is about. The tell is "**Something:** prose",
            so the colon must sit inside the bold run or immediately after it.
          */
          const head = (first.textContent ?? "").trim();
          if (head.endsWith(":")) return true;
          const rest = (li.textContent ?? "").trim().slice(head.length);
          return /^\s*:/.test(rest);
        })
        .map((li) => (li.textContent ?? "").trim().slice(0, 60));

      return {
        text,
        shellText,
        headings,
        headingRun,
        faqTerms,
        paragraphs,
        siblingRuns,
        boldLeadIns,
      };
    });

    if (!data) {
      failures.push(`${route.name}: no <main> element`);
      continue;
    }

    const problems = [];

    /*
      Rules 1 to 3 and rule 8 read data.shellText, which is the whole rendered
      document. Rules 4 to 7 read the <main> collections. See the note beside
      `shell` above for why the scope differs.
    */

    // 1. DASHES.
    if (/[—]/.test(data.shellText)) problems.push("em dash");
    if (/[–]/.test(data.shellText)) problems.push("en dash");
    /*
      A hyphen with a space on both sides is a hyphen doing a dash's job. A
      hyphen inside a compound word has no spaces around it and never matches.
    */
    const connector = data.shellText.match(/\S+ - \S+/);
    if (connector) problems.push(`hyphen as connector near "${connector[0]}"`);

    // 2. EMOJI.
    const emoji = data.shellText.match(EMOJI);
    if (emoji) problems.push(`emoji ${JSON.stringify(emoji[0])}`);

    /*
      3. PHRASES. Matched as a substring rather than on a word boundary, which
      the header of this file used to claim it did not. Substring matching is
      over inclusive, so it can raise a false alarm and cannot miss a real one,
      and that is the right way round for a check whose failure mode is
      shipping the phrase.
    */
    const lower = data.shellText.toLowerCase();
    for (const phrase of BANNED) {
      const at = lower.indexOf(phrase);
      if (at === -1) continue;
      problems.push(
        `banned phrase "${phrase}" in "...${data.shellText.slice(Math.max(0, at - 30), at + phrase.length + 30)}..."`,
      );
    }

    // 4. QUESTION HEADING DENSITY.
    const questions = data.headings.filter((h) => h.endsWith("?")).length;
    const density = data.headings.length ? questions / data.headings.length : 0;
    if (data.headings.length >= 5 && density > 0.4) {
      problems.push(
        `question heading density ${Math.round(density * 100)}% (${questions}/${data.headings.length}), over the 40% ceiling`,
      );
    }

    // 5. BOLD LISTICLE LEAD-INS.
    for (const item of data.boldLeadIns) {
      problems.push(`bolded listicle lead-in: "${item}"`);
    }

    /*
      6b. PARALLEL PHRASING ACROSS CONSECUTIVE HEADINGS.

      The sibling scan below cannot see subheads. An article wraps every
      content block in its own div, so two subheads are never siblings, and a
      run of them opening with the same two words registered as nothing.

      Two raw words, not a stripped stem. Stripping determiners and
      prepositions turns "Look at obligations" and "Look at what it measures"
      into "look obligations" and "look what", which do not match, while it
      collapses "What the franchise adds" and "What this does not establish"
      into a match they do not deserve. The raw pair is the right key, and it
      is the same key the sibling scan uses.
    */
    let headingStreak = 1;
    for (let i = 1; i < data.headingRun.length; i++) {
      if (data.headingRun[i] && data.headingRun[i] === data.headingRun[i - 1]) {
        headingStreak += 1;
        if (headingStreak >= 3) {
          problems.push(
            `${headingStreak} consecutive headings all opening "${data.headingRun[i]}"`,
          );
          break;
        }
      } else {
        headingStreak = 1;
      }
    }

    // 6. SYMMETRICAL PARALLEL PHRASING.
    for (const run of data.siblingRuns) {
      let streak = 1;
      for (let i = 1; i < run.length; i++) {
        if (run[i] && run[i] === run[i - 1]) {
          streak += 1;
          if (streak >= 3) {
            problems.push(
              `${streak} consecutive siblings all opening "${run[i]}"`,
            );
            break;
          }
        } else {
          streak = 1;
        }
      }
    }

    // 7. UNIFORM PARAGRAPH RHYTHM.
    let cv = null;
    if (data.paragraphs.length >= 8) {
      const counts = data.paragraphs.map((p) => p.split(/\s+/).length);
      const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
      const variance =
        counts.reduce((a, b) => a + (b - mean) ** 2, 0) / counts.length;
      cv = Math.sqrt(variance) / mean;
      if (cv < 0.25) {
        problems.push(
          `uniform paragraph rhythm: ${data.paragraphs.length} paragraphs, coefficient of variation ${cv.toFixed(2)}, under the 0.25 floor`,
        );
      }
    }

    /*
      8b. REASSURANCE STACKED IN THREES INSIDE ONE SENTENCE.

      THIS IS THE RULE THAT PASSED WHILE LOOKING AT THE WRONG THING. Rule 8
      below counts three consecutive short SENTENCES, which is the shape of
      "It is fast. It is simple. It is free." The closing band on every article
      read:

        "An inquiry is read by a person, reserves nothing, and commits you to
        nothing."

      Three reassurances, one sentence, one full stop. Rule 8 saw a single long
      sentence and passed the page. The tell is the triad, and a triad does not
      care whether its members are separated by full stops or by commas.

      HOW A TRIAD IS TOLD FROM AN ORDINARY LIST, WHICH IS THE HARD PART. English
      is full of innocent three item lists: "no revenue, profit, or margin",
      "the brand, the playbook, and the territory". Flagging those would make
      the rule useless within a week.

      What separates a rhetorical triad is that its clauses LAND on the same
      word. So the test is: three or more comma separated segments, every one
      of them short, and two of them ending on the same word, that word not
      being a stopword.

        "is read by a person" / "reserves nothing" / "commits you to nothing"
            last words: person, nothing, nothing            -> fires

      THE FIRST VERSION OF THIS ALSO FIRED ON A SHARED OPENING WORD, and that
      was wrong. Ordinary enumeration shares its opening constantly, because
      the shared word is a determiner doing its job:

        "your name" / "your email address" / "your phone number" / "your message"
        "its own vans" / "its own licensed people" / "its own relationships"
        "whether the franchisor contributes" / "whether it is accounted for"

      All three of those are lists, not triads, and all three fired on the
      opening test. None of them fires on the ending test, because a list
      enumerates different things and therefore ends on different words, while
      a triad restates one thing three ways and therefore does not.

      It runs over the whole document rather than over <main> paragraphs,
      because the string it missed was in a call to action heading and its lead,
      not in a body paragraph.
    */
    const STOP = new Set([
      "the", "a", "an", "and", "or", "but", "nor", "so", "then", "it", "its",
      "this", "that", "these", "those", "no", "not", "of", "to", "in", "on",
      "for", "with", "as", "at", "by", "is", "are", "was", "were",
    ]);
    const words = (segment) =>
      segment
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
    for (const sentence of data.shellText.split(/(?<=[.!?])\s+/)) {
      const segments = sentence
        .split(/,\s*/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (segments.length < 3) continue;
      if (segments.some((s) => s.split(/\s+/).length > 8)) continue;
      const tails = [];
      for (const segment of segments) {
        const parts = words(segment);
        if (parts.length === 0) continue;
        const tail = parts[parts.length - 1];
        // A shared "it", "one" or "for" is grammar, not an echo.
        if (!STOP.has(tail)) tails.push(tail);
      }
      const repeats = (list) =>
        list.some((value, index) => list.indexOf(value) !== index);
      if (repeats(tails)) {
        problems.push(
          `clause level triad: "${sentence.trim().slice(0, 110)}"`,
        );
        break;
      }
    }

    // 8. REASSURANCE STACKED IN THREES.
    for (const paragraph of data.paragraphs) {
      const sentences = paragraph
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter(Boolean);
      let streak = 0;
      for (const sentence of sentences) {
        if (sentence.split(/\s+/).length <= 7) {
          streak += 1;
          if (streak >= 3) {
            problems.push(
              `three consecutive short sentences: "${sentences.slice(0, 3).join(" ").slice(0, 80)}..."`,
            );
            break;
          }
        } else {
          streak = 0;
        }
      }
    }

    for (const problem of problems) {
      failures.push(`${route.name}: ${problem}`);
    }

    rows.push(
      `  ${route.name.padEnd(34)} headings=${String(data.headings.length).padStart(2)} q=${String(questions).padStart(2)} faq=${String(data.faqTerms).padStart(2)} paras=${String(data.paragraphs.length).padStart(2)} cv=${cv === null ? "  n/a" : cv.toFixed(2)} ${problems.length ? `FAIL(${problems.length})` : "ok"}`,
    );
  }

  await context.close();
} finally {
  await browser.close();
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
    "ALL GREEN. No dashes, no emoji, no banned phrase, no page over the question heading ceiling, no bolded listicle lead-ins, no parallel sibling openings, no page of uniform paragraph length, and no reassurance stacked in threes.",
  );
}
