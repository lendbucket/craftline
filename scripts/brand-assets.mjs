#!/usr/bin/env node
/**
 * BRAND ASSET GENERATOR
 * =====================
 *
 * Produces the raster assets the site cannot express as markup, from the
 * delivered Craftline artwork: the Open Graph card, the app icon set, the
 * apple touch icon, and favicon.ico.
 *
 *   npm run brand-assets
 *
 * THIS IS NOT A BUILD STEP, AND MUST NOT BECOME ONE. It is run by hand and its
 * output is committed. These are brand assets: they should change when someone
 * decides to change them, in a reviewable commit, rather than silently on a
 * deploy.
 *
 * WHAT CHANGED WHEN THE REAL MARK ARRIVED
 * ---------------------------------------
 * Every asset used to be drawn here from type, because Craftline had no
 * delivered identity and inventing an emblem would have created a mark the real
 * identity later had to fight. That is over. The two files below are the
 * delivered artwork and everything is now composed from them. Nothing is drawn,
 * nothing is recoloured, and no typeface is fetched, which also means this
 * script no longer touches the network and cannot fail because a font CDN is
 * slow or unreachable.
 *
 * NO ALPHA, AND THAT IS INTENDED. The delivered PNGs are RGB with no
 * transparency, because the mark is only approved on white. Every surface that
 * carries it is white by rule, and every canvas composed here is filled white
 * before the artwork is placed, so the output matches the approval condition
 * rather than working around it.
 *
 * NOTHING IS EVER UPSCALED. Each target asserts that it fits inside the source
 * before rendering, and the script fails loudly rather than producing a soft
 * enlargement of somebody's logo. See assertNoUpscale.
 */

import { Buffer } from "node:buffer";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
// "next/og.js", not "next/og". The package exports map resolves the bare
// specifier only through the bundler; plain node needs the file.
import { ImageResponse } from "next/og.js";

const ROOT = process.cwd();
const BRAND_DIR = join(ROOT, "public", "brand");
const PUBLIC_DIR = join(ROOT, "public");

/** The delivered artwork. Sources of truth; never written to by this script. */
const LOGO = join(BRAND_DIR, "craftline-logo.png");
const ICON = join(BRAND_DIR, "craftline-icon.png");

/** Reads a PNG's intrinsic size straight out of the IHDR chunk. */
function pngSize(buffer) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!buffer.subarray(0, 8).equals(signature)) {
    throw new Error("Not a PNG");
  }
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

const dataUri = (buffer) => `data:image/png;base64,${buffer.toString("base64")}`;

/**
 * Fits a source box inside a target box without ever growing it.
 *
 * Returns the rendered size. Throws if the fit would require scaling up, which
 * is the whole point: a favicon set quietly upscaled from a small source looks
 * fine in a code review and terrible in a browser tab.
 */
function assertNoUpscale(label, source, boxWidth, boxHeight) {
  const scale = Math.min(boxWidth / source.width, boxHeight / source.height);
  if (scale > 1) {
    throw new Error(
      `${label}: target ${Math.round(boxWidth)}x${Math.round(boxHeight)} exceeds ` +
        `source ${source.width}x${source.height}. Refusing to upscale the ` +
        `delivered artwork. Supply a larger source or reduce the target.`,
    );
  }
  return {
    width: Math.round(source.width * scale),
    height: Math.round(source.height * scale),
  };
}

async function render(element, width, height, outPath) {
  const response = new ImageResponse(element, { width, height });
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(outPath, buffer);
  return buffer;
}

/**
 * Wraps a PNG in a single entry ICO container.
 *
 * Every browser still in use reads PNG data inside an ICO, so there is no need
 * to encode a BMP. The 16 byte directory entry stores each dimension in one
 * byte, where 0 means 256; the size used here is well under that.
 */
function icoFromPng(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(1, 4); // one image

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size === 256 ? 0 : size, 0); // width
  entry.writeUInt8(size === 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2); // palette size, 0 for non palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8); // data size
  entry.writeUInt32LE(header.length + entry.length, 12); // data offset

  return Buffer.concat([header, entry, png]);
}

/**
 * A square icon tile.
 *
 * The delivered icon is not square, so it is centred on a white square rather
 * than cropped. Cropping a mark to fit a tile is a decision for whoever drew
 * it, not for a build script.
 */
function iconTile(src, size, fitted) {
  return {
    type: "div",
    props: {
      style: {
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
      },
      children: {
        type: "img",
        props: { src, width: fitted.width, height: fitted.height },
      },
    },
  };
}

async function main() {
  await mkdir(BRAND_DIR, { recursive: true });

  const [logoBuf, iconBuf] = await Promise.all([readFile(LOGO), readFile(ICON)]);
  const logoSize = pngSize(logoBuf);
  const iconSize = pngSize(iconBuf);
  const logoUri = dataUri(logoBuf);
  const iconUri = dataUri(iconBuf);

  console.log(`source logo  ${logoSize.width}x${logoSize.height}`);
  console.log(`source icon  ${iconSize.width}x${iconSize.height}`);
  console.log("");

  /*
    OPEN GRAPH CARD, 1200x630.

    The mark on white with generous margin, and nothing else. No tagline and no
    strapline: this card is the fallback for every page on the site, so any
    words on it would be wrong on most of them. The mark is held to 58% of the
    card width, which stays legible in a feed thumbnail without filling the
    frame edge to edge.
  */
  const ogInner = assertNoUpscale("og-default", logoSize, 1200 * 0.58, 630 * 0.6);
  await render(
    {
      type: "div",
      props: {
        style: {
          width: 1200,
          height: 630,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
        },
        children: {
          type: "img",
          props: { src: logoUri, width: ogInner.width, height: ogInner.height },
        },
      },
    },
    1200,
    630,
    join(BRAND_DIR, "craftline-og-default.png"),
  );
  console.log(
    `  craftline-og-default.png    1200x630    mark at ${ogInner.width}x${ogInner.height}`,
  );

  /*
    ICON SET. 512 for home screens and app switchers, 180 for the apple touch
    icon, 32 for the browser tab, and favicon.ico for the many clients that
    request it without reading a single link tag.

    The margin is deliberately small. These are viewed at sizes where the mark
    has very few pixels to work with, and padding is the first thing to give up.
  */
  const MARGIN = 0.94;
  const icons = [
    { size: 512, file: "craftline-icon-512.png" },
    { size: 180, file: "craftline-icon-180.png" },
    { size: 32, file: "craftline-icon-32.png" },
  ];

  let png32 = null;
  for (const { size, file } of icons) {
    const fitted = assertNoUpscale(file, iconSize, size * MARGIN, size * MARGIN);
    const buffer = await render(
      iconTile(iconUri, size, fitted),
      size,
      size,
      join(BRAND_DIR, file),
    );
    if (size === 32) png32 = buffer;
    console.log(
      `  ${file.padEnd(27)} ${`${size}x${size}`.padEnd(11)} mark at ${fitted.width}x${fitted.height}`,
    );
  }

  await writeFile(join(PUBLIC_DIR, "favicon.ico"), icoFromPng(png32, 32));
  console.log(
    "  favicon.ico                 32x32       PNG inside an ICO container",
  );

  console.log("\nbrand-assets: done. Commit the output.");
}

main().catch((error) => {
  console.error(`\nbrand-assets FAILED: ${error.message}`);
  process.exit(1);
});
