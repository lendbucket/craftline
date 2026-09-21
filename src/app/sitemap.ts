import type { MetadataRoute } from "next";
import { BRANDS, SITE_URL } from "@/config/company";
import { ORDERED_INSIGHTS } from "@/data/insights";

/**
 * Canonical sitemap.
 *
 * Only routes that actually render belong here. A sitemap that lists a page
 * which 404s is worse than a short sitemap, so this list grows in the same
 * commit as the page it names.
 *
 * Brand and insight routes come from the same arrays the pages are generated
 * from, so neither a new brand nor a new post can be published and left out of
 * the sitemap.
 *
 * No `lastModified` on the static routes. It would be the build timestamp,
 * which changes on every deploy whether or not the page changed, and a lastmod
 * that always moves is a signal crawlers learn to ignore. Insight posts are the
 * exception: they carry a real, hand set publication date, so they get a real
 * lastModified that only moves when someone actually changes the post.
 *
 * THAT LAST SENTENCE WAS A CLAIM THIS FILE DID NOT KEEP. lastmod was the
 * publication date, so it moved when a post was published and never again,
 * whatever was done to the post afterwards. Eleven posts had their body,
 * title, description or lead rewritten on 21 September. Nine of them had gone
 * up the same day, so their dates were right by accident. Two had not, and
 * those two were advertising a text that no longer existed.
 *
 * So lastmod is `updated` when a post carries one and `published` otherwise.
 * `updated` is set by hand, only for a material change, and the rules for
 * what counts are on the field itself in src/data/insights.ts.
 *
 * There are no state pages and no city pages in this list, and none may be
 * added. This site targets national categories only.
 *
 * The founder's name appears in no URL on this property, by design.
 */
const STATIC_ROUTES = [
  "/",
  "/about",
  "/brands",
  ...BRANDS.map((brand) => `/brands/${brand.slug}`),
  "/franchising",
  "/insights",
  "/contact",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${SITE_URL}${route}`,
      changeFrequency: "monthly" as const,
      priority: route === "/" ? 1 : 0.7,
    })),
    ...ORDERED_INSIGHTS.map((insight) => ({
      url: `${SITE_URL}/insights/${insight.slug}`,
      lastModified: new Date(`${insight.updated ?? insight.published}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
