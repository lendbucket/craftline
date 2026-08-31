/**
 * NAVIGATION, AND WHY IT IS NOT IN company.ts
 * ===========================================
 *
 * These two arrays used to live beside the facts. Moving them out is a
 * bundling decision rather than an editorial one, and it is worth stating
 * plainly because src/config/company.ts is the single source for everything
 * this site is allowed to assert, and splitting anything out of it deserves a
 * reason.
 *
 * THE REASON. site-header.tsx is a client component: it holds the mobile menu
 * open state and reads the pathname. It imported one constant, NAV, from
 * company.ts, and that pulled company.ts into the client bundle on all 27
 * routes. Tree shaking removed the prose, so the FAQ and the capabilities and
 * the disclaimer never shipped, but what survived was a 10.9 KB chunk carrying
 * the capital brackets, the domain and the navigation, loaded by every route
 * including the ones with no form and no interactive element beyond the menu.
 *
 * A route list is not a fact about the company. It is a fact about the site,
 * it is what the header, the footer, the sitemap and llms.txt all read, and it
 * is the only part of that file a client component has any business seeing.
 *
 * NOTHING ELSE MOVES. If you are about to add a second export here because it
 * is also needed on the client, stop and check whether the component needs to
 * be a client component at all. This file exists to keep one import from
 * dragging the whole config across the boundary, not to become a second config.
 */

/** Primary navigation. Single source so the header, the footer, and the sitemap cannot drift apart. */
export const NAV = [
  { href: "/about", label: "About" },
  { href: "/brands", label: "Brands" },
  { href: "/franchising", label: "Franchising" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
] as const;

export const LEGAL_NAV = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms" },
] as const;
