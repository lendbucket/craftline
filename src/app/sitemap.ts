import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/company";

/**
 * Canonical sitemap.
 *
 * Only routes that actually render belong here. A sitemap that lists a page
 * which 404s is worse than a short sitemap, so this list grows in the same
 * commit as the page it names. The remaining routes (about, brands, franchising,
 * contact, privacy, terms) are added as each one lands.
 *
 * No `lastModified`. It would be the build timestamp, which changes on every
 * deploy whether or not the page changed, and a lastmod that always moves is a
 * signal crawlers learn to ignore. Real dates go in when there is real content
 * history to date.
 *
 * The founder's name appears in no URL on this property, by design.
 */
const ROUTES = ["/"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
