#!/usr/bin/env tsx
/**
 * LICENSING BRIEF
 * ===============
 *
 *   npm run image-brief
 *
 * Prints the shopping list for every image slot that still needs a licensed
 * file: what it is for, where it goes, the orientation and minimum size, the
 * tone direction, and the search terms to use.
 *
 * It is GENERATED FROM src/data/images.ts rather than written alongside it. A
 * hand maintained brief in a separate document drifts from the manifest within
 * about one commit, and then somebody buys the wrong thing. The manifest is the
 * only source; this is a view of it.
 *
 * Written in TypeScript and run through tsx so it imports the real module and
 * gets the real types. If a field is renamed, this fails to compile instead of
 * silently printing undefined.
 */

import { IMAGE_SLOTS, STOCK_IMAGE_SLOTS } from "../src/data/images";

const rule = (char = "=") => char.repeat(78);

const pending = STOCK_IMAGE_SLOTS.filter((slot) => slot.status === "pending");
const licensed = STOCK_IMAGE_SLOTS.filter((slot) => slot.status === "ready");

console.log(rule());
console.log("CRAFTLINE BRANDS: STOCK IMAGE LICENSING BRIEF");
console.log(rule());
console.log();
console.log(
  `${IMAGE_SLOTS.length} slots tracked. ${STOCK_IMAGE_SLOTS.length} need licensed stock, ` +
    `${pending.length} still outstanding.`,
);
console.log();
console.log("THE HONESTY LINE, WHICH APPLIES TO EVERY PURCHASE BELOW:");
console.log();
console.log(
  [
    "  Imagery may never assert a false fact. Reject any candidate containing",
    "  a person who could read as staff, a crew, a franchisee, or a customer,",
    "  and any job site, vehicle, or premises that could read as ours. These",
    "  are material textures. A close photograph of copper asserts nothing",
    "  about who owns it. A photograph of an electrician does.",
  ].join("\n"),
);
console.log();
console.log(
  [
    "  Buy a commercial or extended licence, not editorial. Editorial licences",
    "  forbid commercial use and a franchise development site is commercial.",
    "  Record the library, the licence type, and the asset id in the slot's",
    "  `license` field in src/data/images.ts when the file lands.",
  ].join("\n"),
);
console.log();

if (pending.length === 0) {
  console.log("Nothing outstanding. Every stock slot is licensed and in place.");
} else {
  for (const [index, slot] of pending.entries()) {
    console.log(rule("-"));
    console.log(`${index + 1}. ${slot.id}`);
    console.log(rule("-"));
    console.log();
    console.log(`  WHERE      ${slot.location}`);
    console.log(`  ASPECT     ${slot.aspect}`);
    console.log(`  ORIENTATION ${slot.orientation}`);
    console.log();
    console.log("  WHAT TO LOOK FOR");
    console.log(wrap(slot.intent, 4));
    console.log();
    console.log("  TONE, AND WHAT TO REJECT");
    console.log(wrap(slot.tone, 4));
    console.log();
    console.log("  SEARCH TERMS, IN PRIORITY ORDER");
    for (const term of slot.searchTerms) {
      console.log(`    - ${term}`);
    }
    console.log();
    console.log("  WHEN THE FILE ARRIVES");
    console.log(
      wrap(
        `In src/data/images.ts, set status to "ready", src to the path under /public, ` +
          `width and height to the intrinsic pixel size, and license to the library, ` +
          `licence type, and asset id. No page or layout changes are needed: the ` +
          `treatment is already built and MaterialPlate swaps the photograph in.`,
        4,
      ),
    );
    console.log();
  }
}

if (licensed.length > 0) {
  console.log(rule("-"));
  console.log("ALREADY LICENSED");
  console.log(rule("-"));
  for (const slot of licensed) {
    console.log(`  ${slot.id}`);
    console.log(`    ${slot.license}`);
  }
  console.log();
}

console.log(rule());

/** Wraps prose to 74 columns at a given indent, so the brief reads in a terminal. */
function wrap(text: string, indent: number): string {
  const width = 74 - indent;
  const pad = " ".repeat(indent);
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if (line.length + word.length + 1 > width) {
      lines.push(pad + line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(pad + line);
  return lines.join("\n");
}
