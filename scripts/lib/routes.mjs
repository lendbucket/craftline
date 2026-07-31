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
const ALL_ROUTES = [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "brands", path: "/brands" },
  { name: "brand detail", path: "/brands/wattsmith-electric" },
  { name: "franchising", path: "/franchising" },
  { name: "insights", path: "/insights" },
  /*
   * All three insight posts, not a sample. They share one template, so one
   * would catch most template level problems, but the posts differ in content
   * shape: only some contain lists, and they vary in length enough to change
   * how the prose column behaves. Auditing all three costs seconds and removes
   * the judgement call about which one is representative. Add the fourth post
   * here in the commit that writes it.
   */
  { name: "insight 1", path: "/insights/why-trade-services-suit-franchise-systems" },
  { name: "insight 2", path: "/insights/what-veteran-operators-bring-to-trade-services" },
  { name: "insight 3", path: "/insights/how-a-franchise-brand-system-works" },
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
