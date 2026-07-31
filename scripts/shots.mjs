#!/usr/bin/env node
/**
 * DESIGN REVIEW SCREENSHOTS
 * =========================
 *
 * Drives the built site and captures every audited route at a phone width and
 * a desktop width, so the design can be looked at rather than reasoned about.
 *
 *   npm run build && node scripts/shots.mjs
 *   SHOT_DIR=... node scripts/shots.mjs
 *
 * Full page captures by default. Pass SHOT_FOLD=1 for above the fold only,
 * which is the useful mode when the question is about a hero rather than about
 * a whole page's rhythm.
 *
 * This is a development tool and is not part of the audit suite. It asserts
 * nothing and can never fail a build.
 */
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { startNextServer } from "./lib/dev-server.mjs";
import { auditRoutes } from "./lib/routes.mjs";

const OUT = process.env.SHOT_DIR || join(process.cwd(), "shots");
const FOLD = process.env.SHOT_FOLD === "1";
const WIDTHS = [390, 1280];
const PORT = 3136;

const routes = auditRoutes();
let server = null;
let browser = null;

try {
  await mkdir(OUT, { recursive: true });
  server = await startNextServer({ port: PORT });
  console.log(`Server ready at ${server.base}\n`);

  browser = await chromium.launch();

  for (const route of routes) {
    for (const width of WIDTHS) {
      const context = await browser.newContext({
        viewport: { width, height: width === 390 ? 844 : 900 },
        deviceScaleFactor: 2,
        // The reveal animations are scroll driven. Screenshotting mid animation
        // gives half faded content and a misleading picture, so captures are
        // taken as a reduced motion user sees them: everything at final state.
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      await page.goto(server.base + route.path, {
        waitUntil: "load",
        timeout: 90_000,
      });
      // Let webfonts settle so nothing is captured mid swap.
      await page.evaluate(() => document.fonts.ready);

      const slug = route.name.replace(/\s+/g, "-");
      const file = join(OUT, `${slug}-${width}.png`);
      await page.screenshot({ path: file, fullPage: !FOLD });
      console.log(`  ${slug} @${width}`);
      await context.close();
    }
  }

  console.log(`\nWrote ${routes.length * WIDTHS.length} shots to ${OUT}`);
} catch (error) {
  console.error(`shots: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (server) await server.stop();
}
