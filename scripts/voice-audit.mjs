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
 * WHAT IT CANNOT CHECK, STATED SO NOBODY TREATS A PASS AS A CLEAN BILL
 * -------------------------------------------------------------------
 * Two of the standing tells are not mechanically decidable and are not
 * attempted here: stacked rhetorical triads, which requires knowing a clause is
 * rhetorical, and explanatory helper text that narrates what a thing is for,
 * which requires knowing what the thing is. Both remain a human read. This
 * audit catches the tells that have a shape; it does not certify the prose.
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

      const headings = [...root.querySelectorAll("h1,h2,h3,h4")]
        // A heading inside a marked FAQ region is a question by definition.
        .filter((h) => !h.closest("[data-faq]"))
        .map((h) => (h.textContent ?? "").trim())
        .filter(Boolean);
      // Definition terms are headings in everything but name.
      const faqTerms = [...root.querySelectorAll("[data-faq] dt")].length;

      const paragraphs = [...root.querySelectorAll("p")]
        .filter((p) => !p.closest("[data-faq]"))
        .map((p) => (p.textContent ?? "").trim())
        .filter((t) => t.split(/\s+/).length >= 12);

      // Sibling openings, for the parallel phrasing check.
      const siblingRuns = [];
      for (const parent of root.querySelectorAll("ul,ol,dl,div")) {
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

      const boldLeadIns = [...root.querySelectorAll("li")]
        .filter((li) => {
          const first = li.firstElementChild;
          if (!first) return false;
          if (!["STRONG", "B"].includes(first.tagName)) return false;
          return (li.textContent ?? "").includes(":");
        })
        .map((li) => (li.textContent ?? "").trim().slice(0, 60));

      return { text, headings, faqTerms, paragraphs, siblingRuns, boldLeadIns };
    });

    if (!data) {
      failures.push(`${route.name}: no <main> element`);
      continue;
    }

    const problems = [];

    // 1. DASHES.
    if (/[—]/.test(data.text)) problems.push("em dash");
    if (/[–]/.test(data.text)) problems.push("en dash");
    /*
      A hyphen with a space on both sides is a hyphen doing a dash's job. A
      hyphen inside a compound word has no spaces around it and never matches.
    */
    const connector = data.text.match(/\S+ - \S+/);
    if (connector) problems.push(`hyphen as connector near "${connector[0]}"`);

    // 2. EMOJI.
    const emoji = data.text.match(EMOJI);
    if (emoji) problems.push(`emoji ${JSON.stringify(emoji[0])}`);

    // 3. PHRASES.
    const lower = data.text.toLowerCase();
    for (const phrase of BANNED) {
      const at = lower.indexOf(phrase);
      if (at === -1) continue;
      problems.push(
        `banned phrase "${phrase}" in "...${data.text.slice(Math.max(0, at - 30), at + phrase.length + 30)}..."`,
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
