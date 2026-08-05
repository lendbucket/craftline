/**
 * The routes every audit harness drives.
 *
 * Wattsmith hardcodes a TEMPLATES list inside each audit script, which works
 * there because the site has enough pages that "one of each template" is a real
 * sampling decision. Craftline is small enough to audit exhaustively, so the
 * list lives here once and all three harnesses import it. Three copies of a
 * route list is three chances for a page to quietly stop being audited.
 *
 * Every route here must actually render. A harness that 404s reports a failure,
 * which is the correct behaviour: adding a page to this list before building it
 * turns the audit red until the page exists.
 *
 * Filter to a subset while debugging one page:
 *   AUDIT_ONLY=franchising npm run contrast-audit
 */
import { readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Every insight post, read from what the build actually prerendered.
 *
 * This used to be three hardcoded paths with a comment instructing whoever
 * added a fourth post to remember this file. The section is now eighteen posts
 * and that instruction would have been forgotten on the first one, which is the
 * exact failure the header above warns about: a page that quietly stops being
 * audited.
 *
 * Reading the build output rather than the TypeScript source is deliberate.
 * Every audit already requires `npm run build` before it runs, so the directory
 * is guaranteed to exist, and a slug that failed to generate is absent here for
 * the same reason it is absent from production. Parsing the source instead
 * would list routes that do not exist.
 *
 * It throws rather than returning an empty list. Silently auditing zero posts
 * and printing ALL GREEN is worse than failing.
 */
function insightRoutes() {
  const dir = join(process.cwd(), ".next", "server", "app", "insights");
  let slugs;
  try {
    slugs = readdirSync(dir)
      .filter((file) => file.endsWith(".html"))
      .map((file) => file.replace(/\.html$/, ""))
      .sort();
  } catch {
    throw new Error(
      "No prerendered insight pages found. Run `npm run build` before an audit.",
    );
  }
  if (slugs.length === 0) {
    throw new Error("Prerendered insights directory is empty. Build failed?");
  }
  return slugs.map((slug) => ({
    name: `post: ${slug.slice(0, 28)}`,
    path: `/insights/${slug}`,
  }));
}

const ALL_ROUTES = [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "brands", path: "/brands" },
  { name: "brand detail", path: "/brands/wattsmith-electric" },
  { name: "franchising", path: "/franchising" },
  { name: "insights", path: "/insights" },
  ...insightRoutes(),
  { name: "contact", path: "/contact" },
  { name: "privacy", path: "/privacy" },
  { name: "terms", path: "/terms" },
];

export function auditRoutes() {
  const only = process.env.AUDIT_ONLY;
  if (!only) return ALL_ROUTES;
  const filtered = ALL_ROUTES.filter(
    (route) => route.path.includes(only) || route.name.includes(only),
  );
  if (filtered.length === 0) {
    throw new Error(`AUDIT_ONLY="${only}" matched no route.`);
  }
  return filtered;
}

/**
 * Ports are offset from the Wattsmith harnesses (3123 to 3125) so that running
 * an audit in one repo cannot collide with, or worse silently attach to, a
 * server left behind by the other.
 */
export const PORTS = {
  mobile: 3133,
  contrast: 3134,
  seo: 3135,
};
