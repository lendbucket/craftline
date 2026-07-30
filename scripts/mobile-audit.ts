/**
 * RUNTIME MOBILE AUDIT
 * ====================
 *
 * Drives Chromium through every route at 320, 375, 390, and 430px and asserts:
 *
 *   1. Zero horizontal scroll. documentElement.scrollWidth === clientWidth.
 *      When it fails, the offending element is named, because "the page scrolls
 *      sideways at 320" without a culprit is a twenty minute bisect.
 *   2. Every interactive element clears the 44px touch floor, either by being
 *      44px tall or by carrying the `tap-44` class, which expands an inline
 *      link's hit area without changing its box.
 *   3. Form controls render at 16px or larger, because iOS silently zooms the
 *      viewport on focus below that and never zooms back out.
 *   4. The mobile menu opens, closes on navigation, and closes on Escape.
 *
 * Two deliberate departures from the Wattsmith harness this is modelled on:
 *
 *   - No sticky call bar overlap check. Craftline has no call bar. It is a
 *     corporate property with no phone number to push, so there is no fixed
 *     element that can cover the footer.
 *   - No body-scroll-lock assertion. Wattsmith's menu is an overlay and must
 *     lock. Craftline's is an inline disclosure that pushes the page down, so
 *     locking would only strand a user whose nav grew taller than the viewport.
 *     Asserting a lock here would be asserting a bug.
 *
 *   npm run build && npm run mobile-audit
 *   BASE_URL=http://localhost:3000 npm run mobile-audit
 */
import { chromium, type Browser } from "playwright";
// Plain JS helpers, shared with the .mjs harnesses. `allowJs` lets TypeScript
// infer their types straight from the source, so these need no declarations.
import { startNextServer } from "./lib/dev-server.mjs";
import { auditRoutes, PORTS } from "./lib/routes.mjs";

const WIDTHS = [320, 375, 390, 430];
const HEIGHT = 844;
const TOUCH_FLOOR = 44;

type Route = { name: string; path: string };

type PageResult = {
  error: string | null;
  overflow: string | null;
  smallTargets: string[];
  smallFonts: string[];
};

const routes: Route[] = auditRoutes();

async function measurePage(
  browser: Browser,
  base: string,
  path: string,
  width: number,
): Promise<PageResult> {
  const context = await browser.newContext({ viewport: { width, height: HEIGHT } });
  const page = await context.newPage();
  try {
    const response = await page.goto(base + path, { waitUntil: "load", timeout: 90_000 });
    if (!response || response.status() >= 400) {
      return {
        error: `HTTP ${response ? response.status() : "no response"}`,
        overflow: null,
        smallTargets: [],
        smallFonts: [],
      };
    }

    // Scroll to the bottom so anything lazily laid out is measured. Force
    // instant, because globals.css sets scroll-behavior: smooth and we would
    // otherwise measure mid-animation.
    await page.evaluate(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        left: 0,
        behavior: "instant" as ScrollBehavior,
      });
    });
    await page.waitForTimeout(150);

    return await page.evaluate(
      ({ floor }) => {
        const root = document.documentElement;
        const viewport = root.clientWidth;

        // 1. Horizontal overflow, and who caused it.
        let overflow: string | null = null;
        if (root.scrollWidth > viewport) {
          const culprits: string[] = [];
          for (const element of Array.from(document.querySelectorAll("*"))) {
            const rect = element.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) continue;
            if (rect.right > viewport + 1 || rect.left < -1) {
              const tag = element.tagName.toLowerCase();
              const cls =
                typeof element.className === "string" && element.className
                  ? `.${element.className.trim().split(/\s+/).slice(0, 3).join(".")}`
                  : "";
              culprits.push(`${tag}${cls} (right ${Math.round(rect.right)} > ${viewport})`);
            }
          }
          overflow =
            `scrollWidth ${root.scrollWidth} > clientWidth ${viewport}` +
            (culprits.length ? `; first: ${culprits[0]}` : "");
        }

        // 2. Touch targets. An element passes if its own box clears the floor,
        //    or if it carries tap-44, which expands the hit area via ::after
        //    without changing the box the design put there.
        const smallTargets: string[] = [];
        const interactive = document.querySelectorAll<HTMLElement>(
          'a[href], button, input:not([type="hidden"]), select, textarea, [role="button"]',
        );
        for (const element of Array.from(interactive)) {
          const style = getComputedStyle(element);
          if (style.display === "none" || style.visibility === "hidden") continue;
          const rect = element.getBoundingClientRect();
          if (rect.width === 0 && rect.height === 0) continue;
          if (element.classList.contains("tap-44")) continue;
          // Skip the skip-link, which is intentionally offscreen until focused.
          if (element.classList.contains("sr-only")) continue;
          if (rect.height < floor - 0.5) {
            const label = (element.textContent || element.getAttribute("aria-label") || "").trim();
            smallTargets.push(
              `${element.tagName.toLowerCase()} ${Math.round(rect.height)}px "${label.slice(0, 40)}"`,
            );
          }
        }

        // 3. Form control font size. Below 16px iOS zooms on focus.
        const smallFonts: string[] = [];
        const controls = document.querySelectorAll<HTMLElement>(
          'input:not([type="hidden"]), select, textarea',
        );
        for (const element of Array.from(controls)) {
          const size = parseFloat(getComputedStyle(element).fontSize);
          if (size < 16) {
            smallFonts.push(
              `${element.tagName.toLowerCase()}[${element.getAttribute("name") || "?"}] ${size}px`,
            );
          }
        }

        return { error: null, overflow, smallTargets, smallFonts };
      },
      { floor: TOUCH_FLOOR },
    );
  } catch (error) {
    return {
      error: `error: ${(error as Error).message.split("\n")[0]}`,
      overflow: null,
      smallTargets: [],
      smallFonts: [],
    };
  } finally {
    await context.close();
  }
}

type MenuResult = {
  opened: boolean;
  closedOnNavigate: boolean;
  closedOnEscape: boolean;
  note: string;
};

async function checkMenu(browser: Browser, base: string): Promise<MenuResult> {
  const context = await browser.newContext({ viewport: { width: 375, height: HEIGHT } });
  const page = await context.newPage();
  try {
    await page.goto(`${base}/`, { waitUntil: "load", timeout: 90_000 });

    const openButton = page.locator('button[aria-label="Open menu"]');
    await openButton.waitFor({ state: "visible", timeout: 10_000 });
    // The panel is client rendered, so give hydration a moment to attach the
    // click handler. Clicking a button whose onClick is not yet live fails in a
    // way that looks like a broken menu rather than a fast test.
    await page.waitForTimeout(1500);
    await openButton.click({ timeout: 10_000 });

    const panel = page.locator("#mobile-nav");
    await panel.waitFor({ state: "visible", timeout: 5_000 });
    const opened = true;

    // Escape closes.
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    const closedOnEscape = (await page.locator("#mobile-nav").count()) === 0;

    // Reopen and navigate.
    await openButton.click({ timeout: 10_000 });
    await panel.waitFor({ state: "visible", timeout: 5_000 });
    await panel.locator("a", { hasText: "About" }).first().click({ timeout: 10_000 });
    await page.waitForURL("**/about", { timeout: 15_000 });
    const closedOnNavigate = (await page.locator("#mobile-nav").count()) === 0;

    return { opened, closedOnNavigate, closedOnEscape, note: "" };
  } catch (error) {
    return {
      opened: false,
      closedOnNavigate: false,
      closedOnEscape: false,
      note: `error: ${(error as Error).message.split("\n")[0]}`,
    };
  } finally {
    await context.close();
  }
}

async function main() {
  let server: { base: string; stop: () => Promise<void> } | null = null;
  let browser: Browser | null = null;

  try {
    server = await startNextServer({ port: PORTS.mobile });
    console.log(`Server ready at ${server!.base}\n`);

    browser = await chromium.launch();
    const failures: string[] = [];

    for (const route of routes) {
      for (const width of WIDTHS) {
        const result = await measurePage(browser, server!.base, route.path, width);
        if (result.error) {
          console.log(`  ${route.name.padEnd(14)} @${width}: ${result.error}`);
          failures.push(`${route.name} @${width}: ${result.error}`);
          continue;
        }

        const parts = [
          `hscroll=${result.overflow ? "FAIL" : "ok"}`,
          `touch=${result.smallTargets.length ? `${result.smallTargets.length} FAIL` : "ok"}`,
          `fontsize=${result.smallFonts.length ? `${result.smallFonts.length} FAIL` : "ok"}`,
        ];
        console.log(`  ${route.name.padEnd(14)} @${width}: ${parts.join("  ")}`);

        if (result.overflow) {
          failures.push(`${route.name} @${width}: ${result.overflow}`);
        }
        for (const target of result.smallTargets) {
          failures.push(`${route.name} @${width}: touch target ${target}`);
        }
        for (const font of result.smallFonts) {
          failures.push(`${route.name} @${width}: control font ${font}`);
        }
      }
    }

    console.log("\nChecking mobile menu (open / close on navigate / close on Escape) ...");
    const menu = await checkMenu(browser, server!.base);
    console.log(`  opens:               ${menu.opened ? "pass" : "FAIL"}`);
    console.log(`  closes on Escape:    ${menu.closedOnEscape ? "pass" : "FAIL"}`);
    console.log(`  closes on navigate:  ${menu.closedOnNavigate ? "pass" : "FAIL"}`);
    if (menu.note) console.log(`  note: ${menu.note}`);
    if (!menu.opened || !menu.closedOnEscape || !menu.closedOnNavigate) {
      failures.push(`menu: ${menu.note || "one or more menu checks failed"}`);
    }

    console.log("\n================ RESULT ================");
    if (failures.length === 0) {
      console.log(
        `ALL GREEN. ${routes.length} route(s) x ${WIDTHS.length} width(s): no horizontal ` +
          "scroll, every touch target clears 44px, no control below 16px, menu behaves.",
      );
      process.exitCode = 0;
    } else {
      console.log(`${failures.length} FAILURE(S):`);
      for (const failure of failures) console.log(`  - ${failure}`);
      process.exitCode = 1;
    }
  } catch (error) {
    console.log(`Harness error: ${(error as Error).message}`);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    if (server) await server.stop();
  }
}

main();
