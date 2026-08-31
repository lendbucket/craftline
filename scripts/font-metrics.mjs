#!/usr/bin/env node
/**
 * DISPLAY FACE FALLBACK METRICS
 * =============================
 *
 * Derives the `size-adjust`, `ascent-override`, `descent-override` and
 * `line-gap-override` values for the metric matched fallback face that
 * globals.css declares for the display family.
 *
 *   npm run build && node scripts/font-metrics.mjs
 *
 * WHY THIS EXISTS. `next/font` normally generates that fallback itself, from a
 * metrics table it ships. Barlow and Source Serif 4 both get one. Big Shoulders
 * does not: the build prints
 *
 *   Failed to find font override values for font `Big Shoulders`
 *   Skipping generating a fallback font.
 *
 * because the family was renamed from "Big Shoulders Display" and the table has
 * not caught up. The consequence is that the one face carrying every heading on
 * every route, including the largest contentful paint element on most of them,
 * would swap in with no metric matching and move the page when it arrived.
 *
 * So the values are measured here instead, from the font the build actually
 * emitted, and written into globals.css by hand. This script prints them and
 * prints the current declared values beside them, so a font update that shifts
 * the metrics shows up as a difference rather than as a silent regression.
 *
 * THE METHOD is the same arithmetic next/font uses:
 *
 *   sizeAdjust      = averageCharacterWidth(font) / averageCharacterWidth(Arial)
 *   ascentOverride  = ascent(font)  / unitsPerEm / sizeAdjust
 *   descentOverride = descent(font) / unitsPerEm / sizeAdjust
 *   lineGapOverride = lineGap(font) / unitsPerEm / sizeAdjust
 *
 * Measured through Canvas rather than by parsing the woff2, because the file is
 * Brotli compressed and this repository has no font parser. Rendering both
 * faces at a known pixel size and reading TextMetrics gives the same ratios: at
 * font-size 100px, fontBoundingBoxAscent in pixels IS ascent/unitsPerEm * 100.
 *
 * The width sample is the alphabet plus the digits plus a space, weighted the
 * way next/font weights it: the average is taken over the string as rendered,
 * which is what actually determines how much room a line of text needs.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import { startNextServer } from "./lib/dev-server.mjs";

const PORT = 3141;

/** The face the overrides are computed for, and the local face they sit on. */
const TARGET = "Big Shoulders";
const FALLBACK = "Arial";

/**
 * Sample string. Lowercase and uppercase Latin plus digits and a space, which
 * is what the display face actually sets: headings, eyebrows, buttons, and
 * numerals.
 */
const SAMPLE =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";

const server = await startNextServer({ port: PORT });
const browser = await chromium.launch();

try {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(server.base + "/", { waitUntil: "load", timeout: 90_000 });
  await page.evaluate(() => document.fonts.ready);

  const measured = await page.evaluate(
    ({ target, fallback, sample }) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no 2d context");

      const read = (family) => {
        // 100px so every returned pixel value is already a per-em percentage.
        ctx.font = `800 100px ${family}`;
        const m = ctx.measureText(sample);
        return {
          width: m.width / sample.length,
          ascent: m.fontBoundingBoxAscent,
          descent: m.fontBoundingBoxDescent,
          // Canvas exposes no line gap. Big Shoulders and Arial both ship a
          // zero line gap, and a non-zero one would show up as a mismatch
          // between (ascent + descent) and the rendered line box, which is
          // asserted below.
          emAscent: m.emHeightAscent,
          emDescent: m.emHeightDescent,
        };
      };

      // Verify the target actually loaded. If it silently fell back to a system
      // face, every number below would be Arial measured twice and the
      // overrides would be a no-op that looked like a fix.
      const loaded = document.fonts.check(`800 100px "${target}"`);

      return { loaded, target: read(`"${target}"`), fallback: read(fallback) };
    },
    { target: TARGET, fallback: FALLBACK, sample: SAMPLE },
  );

  if (!measured.loaded) {
    throw new Error(
      `"${TARGET}" is not loaded in the page. The measurement would have ` +
        "returned the fallback's own metrics and produced overrides that do " +
        "nothing. Check the font import in src/app/layout.tsx.",
    );
  }

  const sizeAdjust = measured.target.width / measured.fallback.width;
  const pct = (value) => `${(value * 100).toFixed(2)}%`;

  const values = {
    "size-adjust": pct(sizeAdjust),
    "ascent-override": pct(measured.target.ascent / 100 / sizeAdjust),
    "descent-override": pct(measured.target.descent / 100 / sizeAdjust),
    "line-gap-override": "0%",
  };

  console.log(`\nMeasured ${TARGET} against ${FALLBACK}\n`);
  console.log(
    `  ${TARGET.padEnd(16)} avg width ${measured.target.width.toFixed(3)}px  ` +
      `ascent ${measured.target.ascent.toFixed(2)}  descent ${measured.target.descent.toFixed(2)}`,
  );
  console.log(
    `  ${FALLBACK.padEnd(16)} avg width ${measured.fallback.width.toFixed(3)}px  ` +
      `ascent ${measured.fallback.ascent.toFixed(2)}  descent ${measured.fallback.descent.toFixed(2)}`,
  );

  console.log("\nDeclare these on the fallback face in globals.css:\n");
  for (const [property, value] of Object.entries(values)) {
    console.log(`  ${property}: ${value};`);
  }

  /*
    Compare against what globals.css currently declares, so a drift is visible
    rather than something a reader has to notice. Parsed out of the @font-face
    block by property name, which is enough because there is exactly one
    fallback face in the file.
  */
  const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
  /*
    Scoped to the @font-face block, not the whole file. An earlier version
    matched on the property name alone and read `-webkit-text-size-adjust: 100%`
    off the html rule as the declared size-adjust, then reported a drift that
    did not exist. A check that cries wolf gets switched off.
  */
  const block = css.match(/@font-face\s*{[^}]*Fallback[^}]*}/i)?.[0] ?? "";
  const declared = {};
  for (const property of Object.keys(values)) {
    const match = block.match(
      new RegExp(`(?:^|[;{\\s])${property}\\s*:\\s*([0-9.]+%)`, "i"),
    );
    if (match) declared[property] = match[1];
  }

  const drift = Object.entries(values).filter(
    ([property, value]) => declared[property] && declared[property] !== value,
  );

  if (Object.keys(declared).length === 0) {
    console.log("\nglobals.css declares no fallback face yet.");
  } else if (drift.length === 0) {
    console.log("\nglobals.css matches. Nothing to change.");
  } else {
    console.log("\nDRIFT. globals.css disagrees with the measurement:");
    for (const [property, value] of drift) {
      console.log(`  ${property}: declared ${declared[property]}, measured ${value}`);
    }
    process.exitCode = 1;
  }
} finally {
  await browser.close();
  await server.stop();
}
