#!/usr/bin/env node
/**
 * BRAND ASSET GENERATOR
 * =====================
 *
 * Renders the Craftline wordmark into the raster assets the site cannot express
 * as markup: the Open Graph card and the app icons.
 *
 *   npm run brand-assets
 *
 * THIS IS NOT A BUILD STEP, AND MUST NOT BECOME ONE. It is run by hand and its
 * output is committed. Two reasons. It fetches the typeface over the network,
 * and a build that can fail because Google Fonts is slow is a worse build. And
 * these are brand assets: they should change when someone decides to change
 * them, in a reviewable commit, not silently on a deploy.
 *
 * WHAT IT DRAWS, AND WHY IT IS NOT AN EMBLEM
 * ------------------------------------------
 * Craftline has no designer identity yet, and src/data/images.ts has said from
 * the start that inventing an emblem now would create a mark the real identity
 * later has to fight. That reasoning still holds, so nothing here is invented.
 * Every asset is built from the wordmark that already ships in
 * src/components/wordmark.tsx: CRAFTLINE in tracked Archivo caps, one bronze
 * rule, BRANDS set lighter. The icon is the same treatment reduced to the
 * letterform and the rule, which is exactly what the app-icon slot specified.
 *
 * When a real identity arrives, rerun this file with the new artwork and the
 * committed assets are replaced. Nothing else in the codebase needs to change,
 * because every consumer reads the paths from src/data/images.ts.
 *
 * COLOURS ARE MIRRORED FROM globals.css, WHICH IS A COMPROMISE
 * ------------------------------------------------------------
 * These are raster files. They cannot read a CSS custom property, so the token
 * values are restated below with the token name beside each one. This is the
 * one place in the codebase where a Craftline hex appears outside globals.css,
 * and it is confined to a generator that produces static files rather than to a
 * component. If a token changes, change it here and rerun.
 */

import { Buffer } from "node:buffer";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
// "next/og.js", not "next/og". The package exports map resolves the bare
// specifier only through the bundler; plain node needs the file.
import { ImageResponse } from "next/og.js";

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, "public", "brand");

/** Mirrored from src/app/globals.css. Token name in the comment. */
const INK = "#191a1c"; // --color-ink
const PAPER = "#f6f3ee"; // --color-paper
const MUTED_DARK = "#a8a29a"; // --color-muted-dark, AA on ink
const BRONZE_BRIGHT = "#c68a3b"; // --color-bronze-bright, 5.86:1 on ink

/**
 * Pulls the Archivo TTFs Google serves.
 *
 * Archivo is what next/font loads for headings, so the generated assets and the
 * rendered pages are the same typeface rather than a lookalike. The CSS
 * endpoint is asked for TTF explicitly by sending a desktop user agent: sent a
 * modern one, Google returns WOFF2, which satori cannot decompress.
 */
async function loadArchivo(weight) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Archivo:wght@${weight}&display=swap`;
  const cssResponse = await fetch(cssUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
  });
  if (!cssResponse.ok) {
    throw new Error(
      `Google Fonts returned ${cssResponse.status} for Archivo ${weight}. ` +
        "This script needs network access. Nothing was written.",
    );
  }
  const css = await cssResponse.text();
  const match = css.match(/src:\s*url\((https:[^)]+\.ttf)\)/);
  if (!match) {
    throw new Error(
      `No TTF source found in the Archivo ${weight} stylesheet. Google may have ` +
        "changed its response format. Nothing was written.",
    );
  }
  const fontResponse = await fetch(match[1]);
  if (!fontResponse.ok) {
    throw new Error(`Archivo ${weight} TTF returned ${fontResponse.status}.`);
  }
  return fontResponse.arrayBuffer();
}

/** satori takes plain element objects, so no JSX and no build step for this file. */
function el(type, props, ...children) {
  return { type, props: { ...props, children: children.flat() } };
}

async function render(node, { width, height, fonts }) {
  const response = new ImageResponse(node, { width, height, fonts });
  return Buffer.from(await response.arrayBuffer());
}

/**
 * The Open Graph card.
 *
 * Per the og-default slot: the wordmark set in type on a charcoal field with
 * generous margin, and deliberately no photograph, no emblem, and no tagline.
 * It is the horizontal wordmark lockup from src/components/wordmark.tsx scaled
 * up and centred, so a shared link and the site header carry the same mark.
 */
function ogCard() {
  return el(
    "div",
    {
      style: {
        display: "flex",
        width: "100%",
        height: "100%",
        background: INK,
        alignItems: "center",
        justifyContent: "center",
        // Generous margin is the whole composition. Nothing fills this space.
        padding: "0 140px",
      },
    },
    el(
      "div",
      { style: { display: "flex", alignItems: "center", gap: 40 } },
      el(
        "div",
        {
          style: {
            display: "flex",
            fontFamily: "Archivo",
            fontWeight: 600,
            fontSize: 104,
            letterSpacing: "0.18em",
            color: PAPER,
            // Tracking adds space after the final letter too. Pulling it back
            // keeps the rule optically centred between the two words.
            marginRight: -18,
          },
        },
        "CRAFTLINE",
      ),
      // The bronze rule. The one accent, and the only non type element here.
      el("div", {
        style: { display: "flex", width: 56, height: 3, background: BRONZE_BRIGHT },
      }),
      el(
        "div",
        {
          style: {
            display: "flex",
            fontFamily: "Archivo",
            fontWeight: 400,
            fontSize: 40,
            letterSpacing: "0.18em",
            color: MUTED_DARK,
            marginRight: -7,
          },
        },
        "BRANDS",
      ),
    ),
  );
}

/**
 * The app icon.
 *
 * The wordmark reduced to what survives at 16 pixels: the C, and the bronze
 * rule as a bar along the foot of the tile. Geometry is expressed as a fraction
 * of the tile so the same description renders correctly at 512 and at 32
 * instead of being downscaled, which would thin the rule away to nothing.
 */
function icon(size) {
  return el(
    "div",
    {
      style: {
        display: "flex",
        width: "100%",
        height: "100%",
        background: INK,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      },
    },
    el(
      "div",
      {
        style: {
          display: "flex",
          fontFamily: "Archivo",
          fontWeight: 600,
          // Set large on purpose. At 16 and 32 pixels a favicon is competing
          // with a row of other tabs, so the letterform has to reach the edges
          // of the tile to be identifiable at a glance. Anything smaller reads
          // as a dark square with something in the middle.
          fontSize: size * 0.8,
          color: PAPER,
          // Lifted off centre so the optical middle accounts for the foot bar.
          marginTop: -size * 0.04,
        },
      },
      "C",
    ),
    el("div", {
      style: {
        display: "flex",
        position: "absolute",
        bottom: 0,
        left: 0,
        width: `${size}px`,
        height: `${Math.max(2, Math.round(size * 0.1))}px`,
        background: BRONZE_BRIGHT,
      },
    }),
  );
}

/**
 * Wraps a PNG in an ICO container.
 *
 * /favicon.ico is still requested unprompted by crawlers, feed readers, and
 * link unfurlers that never look at a <link rel="icon">, and answering it with
 * a 404 on every one of those requests is noise for no reason. Since Vista an
 * ICO entry may hold a PNG verbatim, so this is a 22 byte header in front of
 * bytes sharp already produced rather than a second encoder.
 */
function pngToIco(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 is icon
  header.writeUInt16LE(1, 4); // one image

  const entry = Buffer.alloc(16);
  // 0 means 256 in this field. Nothing here is that large, but be correct.
  entry.writeUInt8(size >= 256 ? 0 : size, 0);
  entry.writeUInt8(size >= 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2); // palette size, 0 for truecolour
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(22, 12); // offset: 6 header + 16 entry

  return Buffer.concat([header, entry, png]);
}

async function main() {
  console.log("brand-assets: fetching Archivo from Google Fonts ...");
  const [regular, semibold] = await Promise.all([
    loadArchivo(400),
    loadArchivo(600),
  ]);
  const fonts = [
    { name: "Archivo", data: regular, weight: 400, style: "normal" },
    { name: "Archivo", data: semibold, weight: 600, style: "normal" },
  ];

  await mkdir(OUT_DIR, { recursive: true });

  const written = [];

  const og = await render(ogCard(), { width: 1200, height: 630, fonts });
  await writeFile(join(OUT_DIR, "craftline-og-default.png"), og);
  written.push(["public/brand/craftline-og-default.png", og.length]);

  // 512 doubles as the Organization schema logo and the home screen icon.
  const icon512 = await render(icon(512), { width: 512, height: 512, fonts });
  await writeFile(join(OUT_DIR, "craftline-icon-512.png"), icon512);
  written.push(["public/brand/craftline-icon-512.png", icon512.length]);

  // Rendered at its own size, not downscaled, so the foot bar stays crisp.
  const icon32 = await render(icon(32), { width: 32, height: 32, fonts });
  await writeFile(join(OUT_DIR, "craftline-icon-32.png"), icon32);
  written.push(["public/brand/craftline-icon-32.png", icon32.length]);

  const ico = pngToIco(icon32, 32);
  await writeFile(join(ROOT, "public", "favicon.ico"), ico);
  written.push(["public/favicon.ico", ico.length]);

  console.log("brand-assets: wrote");
  for (const [path, bytes] of written) {
    console.log(`  ${path}  ${bytes} bytes`);
  }
  console.log(
    "\nbrand-assets: these are committed artefacts. Commit them with the change " +
      "that made you regenerate them.",
  );
}

main().catch((error) => {
  console.error(`brand-assets: ${error.message}`);
  process.exit(1);
});
