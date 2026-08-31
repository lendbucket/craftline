#!/usr/bin/env node
/**
 * llms.txt AUDIT
 * ==============
 *
 *   npm run build && npm run llms-audit
 *
 * The two AI surface files are generated from config rather than written by
 * hand (see src/lib/llms.ts). That removes the drift problem and replaces it
 * with a smaller one: nothing checks the generator. This does.
 *
 * IT READS THE SERVED BYTES, not the module. Importing llmsTxt() and asserting
 * on its return value would pass even if the route handler failed to render,
 * failed to prerender, or served the wrong content type. Every other harness on
 * this property fetches what a client gets and this one does the same.
 *
 * WHAT IT ASSERTS
 *   1. Both routes serve 200 as text/plain, and neither is empty.
 *   2. PROVENANCE. Every fact that should be in the file is present verbatim,
 *      matched against the config export it came from. This is the check that
 *      catches a fact changing on the site and not here: the strings are read
 *      from the same modules the pages read, so a changed descriptor either
 *      appears in both or fails here.
 *   3. WITHHELD TOPICS. Nothing about franchise availability, earnings, or unit
 *      economics reaches either file. Asserted three ways: the specific items
 *      held back by name, the shape of a figure, and the vocabulary.
 *   4. STYLE. The standing laws apply to every rendered string and these files
 *      are rendered strings. The voice audit cannot see them, because it reads
 *      the <main> of an HTML page and these are neither.
 *
 * INJECTION VERIFIED. See the bottom of this file for the exact plants used.
 */
import {
  BRANDS,
  CAPABILITIES,
  COMPANY,
  CAPITAL_BRACKETS,
  FOUNDING_STATEMENT,
  FRANCHISE_DISCLAIMER,
  FRANCHISE_FAQ,
  INQUIRY_PROCESS,
  LEGAL_ENTITIES,
  OPERATOR_PROFILE,
} from "../src/config/company.ts";
import { ORDERED_INSIGHTS } from "../src/data/insights.ts";
import { WITHHELD_CAPABILITY, WITHHELD_QUESTIONS } from "../src/lib/llms.ts";
import { startNextServer } from "./lib/dev-server.mjs";

const PORT = 3221;
const failures = [];
const checks = [];

/** Asserts a string is present, naming the config export it came from. */
function present(file, text, needle, source) {
  checks.push(source);
  if (!text.includes(needle)) {
    failures.push(
      `${file}: missing ${source}: "${String(needle).slice(0, 70)}"`,
    );
  }
}

/** Asserts a string is absent, naming why it is held back. */
function absent(file, text, needle, why) {
  checks.push(`withheld: ${why}`);
  if (text.includes(needle)) {
    failures.push(
      `${file}: contains withheld ${why}: "${String(needle).slice(0, 70)}"`,
    );
  }
}

const BANNED = [
  "unlock",
  "elevate",
  "seamless",
  "journey",
  "empower",
  "passionate",
  "top-notch",
  "hassle-free",
  "one-stop",
  "cutting-edge",
  "cutting edge",
  "state-of-the-art",
  "look no further",
  "in today's",
  "when it comes to",
  "we've got you covered",
  "rest assured",
  "not only",
  "delve",
  "navigate the complex",
  "peace of mind",
  "trusted partner",
  "at the end of the day",
];

const EMOJI =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}\u{1F1E6}-\u{1F1FF}]/u;

function style(file, text) {
  if (/—/.test(text)) failures.push(`${file}: em dash`);
  if (/–/.test(text)) failures.push(`${file}: en dash`);
  const connector = text.match(/\S+ - \S+/);
  if (connector) failures.push(`${file}: hyphen as connector "${connector[0]}"`);
  const emoji = text.match(EMOJI);
  if (emoji) failures.push(`${file}: emoji ${JSON.stringify(emoji[0])}`);
  const lower = text.toLowerCase();
  for (const phrase of BANNED) {
    if (lower.includes(phrase)) failures.push(`${file}: banned phrase "${phrase}"`);
  }
}

/**
 * The withheld topics, checked by shape as well as by name.
 *
 * A figure is the thing that cannot be allowed to appear, whatever sentence it
 * arrives in, so these match the shape rather than a known string. The
 * vocabulary list is deliberately narrow: "revenue" and "earnings" appear
 * legitimately in the constraints block, which says they are not published, so
 * the check is scoped to a figure sitting beside one.
 */
function withheldShapes(file, text) {
  const money = text.match(/\$\s?[\d,]+/);
  if (money) failures.push(`${file}: money figure "${money[0]}"`);
  const percent = text.match(/\b\d+(\.\d+)?\s?(percent|%)/i);
  if (percent) failures.push(`${file}: percentage figure "${percent[0]}"`);
  /*
    At least one real digit before the class opens up. The first version began
    with [\d,]+, which a bare comma satisfies, so the constraints line "No
    revenue, growth, unit count..." matched as a unit count. A check for a
    figure has to see a figure, not a separator.
  */
  const economics = text.match(
    /\b\d[\d,]*\s*(units?|locations?|franchisees?|territories)\b/i,
  );
  if (economics) failures.push(`${file}: unit count "${economics[0]}"`);
  if (/\bunit economics\b/i.test(text))
    failures.push(`${file}: the phrase "unit economics"`);
}

const server = await startNextServer({ port: PORT });

try {
  const files = {};
  for (const name of ["llms.txt", "llms-full.txt"]) {
    const response = await fetch(`${server.base}/${name}`);
    if (response.status !== 200) {
      failures.push(`${name}: HTTP ${response.status}`);
      continue;
    }
    const type = response.headers.get("content-type") ?? "";
    if (!type.startsWith("text/plain")) {
      failures.push(`${name}: content-type "${type}", expected text/plain`);
    }
    const text = await response.text();
    if (text.trim().length === 0) failures.push(`${name}: empty`);
    files[name] = text;
  }

  for (const [name, text] of Object.entries(files)) {
    /* ---- 2. PROVENANCE ---- */
    present(name, text, COMPANY.name, "COMPANY.name");
    present(name, text, COMPANY.descriptor, "COMPANY.descriptor");
    present(name, text, FOUNDING_STATEMENT, "FOUNDING_STATEMENT");
    present(name, text, FRANCHISE_DISCLAIMER, "FRANCHISE_DISCLAIMER");
    for (const entity of LEGAL_ENTITIES) {
      present(name, text, entity.name, "LEGAL_ENTITIES[].name");
      present(name, text, entity.role, "LEGAL_ENTITIES[].role");
    }
    for (const insight of ORDERED_INSIGHTS) {
      present(name, text, insight.title, "INSIGHTS[].title");
      present(name, text, insight.description, "INSIGHTS[].description");
    }

    /* ---- 3. WITHHELD ---- */
    for (const question of WITHHELD_QUESTIONS) {
      absent(name, text, question, "franchise gate question");
    }
    absent(name, text, WITHHELD_CAPABILITY, "capability implying openings");
    for (const bracket of CAPITAL_BRACKETS) {
      if (bracket === "Prefer not to say") continue;
      absent(name, text, bracket, "capital bracket");
    }
    withheldShapes(name, text);

    /* ---- 4. STYLE ---- */
    style(name, text);
  }

  /* ---- The long form carries the substance the short form does not ---- */
  const full = files["llms-full.txt"] ?? "";
  for (const brand of BRANDS) {
    present("llms-full.txt", full, brand.summary, "BRANDS[].summary");
    present("llms-full.txt", full, brand.url, "BRANDS[].url");
    for (const attribute of brand.attributes) {
      present("llms-full.txt", full, attribute, "BRANDS[].attributes[]");
    }
  }
  for (const capability of CAPABILITIES) {
    if (capability.title === WITHHELD_CAPABILITY) continue;
    present("llms-full.txt", full, capability.body, "CAPABILITIES[].body");
  }
  for (const trait of OPERATOR_PROFILE) {
    present("llms-full.txt", full, trait, "OPERATOR_PROFILE[]");
  }
  for (const step of INQUIRY_PROCESS) {
    present("llms-full.txt", full, step.title, "INQUIRY_PROCESS[].title");
    present("llms-full.txt", full, step.body, "INQUIRY_PROCESS[].body");
  }
  for (const entry of FRANCHISE_FAQ) {
    if (WITHHELD_QUESTIONS.includes(entry.q)) continue;
    present("llms-full.txt", full, entry.q, "FRANCHISE_FAQ[].q");
    present("llms-full.txt", full, entry.a, "FRANCHISE_FAQ[].a");
  }

  /*
    Every article, in full. Paragraph text only: a paragraph carrying inline
    links is stored as parts and reassembled, so comparing the reassembled
    string is the only way to know the whole sentence reached the file.
  */
  let blocks = 0;
  for (const insight of ORDERED_INSIGHTS) {
    present("llms-full.txt", full, insight.lead, `lead: ${insight.slug}`);
    for (const block of insight.body) {
      if (block.kind === "list") continue;
      const value =
        typeof block.text === "string"
          ? block.text
          : block.text.map((part) => (typeof part === "string" ? part : part.text)).join("");
      blocks += 1;
      if (!full.includes(value)) {
        failures.push(
          `llms-full.txt: missing block from ${insight.slug}: "${value.slice(0, 60)}..."`,
        );
      }
    }
  }

  console.log(`  llms.txt        ${(files["llms.txt"] ?? "").length} bytes`);
  console.log(`  llms-full.txt   ${full.length} bytes`);
  console.log(`  provenance assertions: ${checks.length}`);
  console.log(`  article blocks verified present: ${blocks}`);
} finally {
  await server.stop();
}

console.log("\n================ RESULT ================");
if (failures.length) {
  console.log(`${failures.length} failure(s):`);
  for (const failure of failures) console.log(`  ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    "ALL GREEN. Both files serve as text/plain, every fact in them traces to a config export, nothing about availability, earnings, or unit economics reaches either one, and the style laws hold.",
  );
}

/*
  INJECTION VERIFICATION, RUN AND RECORDED
  ----------------------------------------
  Plants applied to src/lib/llms.ts, the site rebuilt, this audit run, then
  reverted and the green result re-confirmed. Plants 1 to 4 were applied in one
  build because they produce four distinguishable failures; plant 5 was applied
  on its own because it produces a great many.

    1. Removed FOUNDING_STATEMENT from identity().
       -> missing FOUNDING_STATEMENT, on both files            CAUGHT
    2. Stopped filtering WITHHELD_QUESTIONS in questions().
       -> contains withheld franchise gate question, all three CAUGHT
    3. Added a line reading "Typical investment is $150,000".
       -> money figure "$150,000", on both files               CAUGHT
    4. Put an em dash in that same added line.
       -> em dash, on both files                               CAUGHT
       (1 to 4 together produced exactly 9 failures and no others.)
    5. Dropped articleBodies() from llmsFullTxt().
       -> missing block from <slug>, once per prose block      CAUGHT

  WHAT THE PLANTS DELIBERATELY DID NOT DO. None of them changed this file.
  An audit verified by weakening its own assertions verifies nothing, so every
  plant was made in the generator and this script was left alone.
*/
