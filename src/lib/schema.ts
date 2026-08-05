import {
  BRANDS,
  CATEGORY_POSITIONING,
  COMPANY,
  CONTACT_EMAIL,
  SITE_URL,
} from "@/config/company";

/**
 * STRUCTURED DATA
 * ===============
 *
 * The Organization and WebSite graphs are emitted once from the root layout so
 * every page carries them. Page level nodes (breadcrumbs, articles) are emitted
 * by the pages themselves and reference the shared nodes by id rather than
 * restating them.
 *
 * What is deliberately NOT here, and must not be added later without a real
 * source behind it:
 *   - `aggregateRating` and `review` of any kind. Craftline has no reviews, and
 *     review markup without reviews is a manual action waiting to happen. This
 *     is the "no reviews from day one" position: the absence is the pattern,
 *     so there is never a moment where someone adds rating markup "temporarily".
 *     It applies to the brands too. Wattsmith's own site is the authority on
 *     its reputation, and Craftline does not mirror or aggregate it.
 *   - `foundingDate`, `numberOfEmployees`, `employee`, `founder`. The founder's
 *     name is never rendered on this property, and schema is rendered output.
 *   - Anything resembling revenue, unit counts, or performance. Structured data
 *     is public and machine read, so a financial performance representation
 *     hidden in JSON-LD is still a financial performance representation.
 *   - `areaServed` on Craftline itself, and any geographic franchise
 *     availability. Territory is an offer term and the FDD is not issued. The
 *     brand node below carries the operating brand's own service area, which is
 *     a fact about an operating business, not a statement about where a
 *     franchise can be bought.
 */

/**
 * Stable node ids. Using fragment ids on the canonical origin lets the graphs
 * reference each other instead of duplicating the organization object.
 */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * The Craftline logo, as an absolute URL. Google will not resolve a relative
 * one, and an Organization without a logo forfeits the knowledge panel image
 * for no reason.
 *
 * This points at the delivered lockup rather than the square app icon. The two
 * are different assets for different jobs: the icon is the mark cut down to a
 * tile that survives at 32 pixels, while Organization.logo is what appears
 * beside the company name in a knowledge panel, where the full lockup is the
 * recognisable thing and reads correctly at a wide aspect. It sits on white,
 * which is what Google asks for and what the artwork requires anyway.
 */
export const ORGANIZATION_LOGO = `${SITE_URL}/brand/craftline-logo.png`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: COMPANY.name,
    alternateName: COMPANY.shortName,
    url: `${SITE_URL}/`,
    logo: ORGANIZATION_LOGO,
    description: COMPANY.descriptor,
    /**
     * The categories this company belongs to, stated as subject matter rather
     * than as a keyword list. Every entry is a national category. Nothing here
     * names a state, a city, or a market, because a category becomes an offer
     * the moment it acquires a location.
     */
    knowsAbout: [...CATEGORY_POSITIONING],
    /**
     * Two relationships to the operating brands, and they say different things.
     *
     * `subOrganization` is the corporate fact: Wattsmith sits inside the
     * Craftline group. `brand` is the marketing fact: Wattsmith is a brand this
     * organization owns and operates. Search engines read them differently, and
     * asserting only the first leaves the brand relationship unstated.
     *
     * The brand node carries the logo, because that is the node a knowledge
     * panel for the brand would be built from. Beyond name, url, and logo,
     * Craftline asserts nothing about Wattsmith's attributes here: that site is
     * the authority on its own entity, and duplicating its claims would create
     * two sources of truth that can drift.
     */
    subOrganization: BRANDS.map((brand) => ({
      "@type": "Organization",
      name: brand.name,
      url: brand.url,
    })),
    brand: BRANDS.map((brand) => ({
      "@type": "Brand",
      name: brand.name,
      url: brand.url,
      logo: `${SITE_URL}${brand.logo}`,
    })),
    // Only emitted once a real mailbox exists. See CONTACT_EMAIL.
    ...(CONTACT_EMAIL
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "corporate",
            email: CONTACT_EMAIL,
            url: `${SITE_URL}/contact`,
          },
        }
      : {}),
  };
}

/**
 * WebSite carries the site name Google uses for the SERP site name treatment.
 * It is present from the first deploy on purpose: the site name is learned over
 * time from crawls, so adding this later means waiting again for it to settle.
 *
 * No SearchAction. There is no site search, and declaring a sitelinks search
 * box that does not exist is a false claim about the site.
 */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: COMPANY.name,
    alternateName: COMPANY.shortName,
    url: `${SITE_URL}/`,
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: "en-US",
  };
}

/**
 * BreadcrumbList for a nested page.
 *
 * Home is prepended here rather than passed in by every caller, so no page can
 * publish a trail that starts halfway down the site. Positions are one based,
 * which the spec requires and which is the usual place this gets written wrong.
 *
 * Pass the trail excluding home, in order, ending with the current page. The
 * current page is included as its own final item: Google expects the trail to
 * terminate at the page carrying it, not to stop at its parent.
 */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  const items = [{ name: "Home", path: "/" }, ...trail];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === "/" ? "/" : item.path}`,
    })),
  };
}

/**
 * Article schema for an insights post.
 *
 * `author` and `publisher` are both the organization. That is not a dodge to
 * avoid naming a person: the founder's name is never rendered on this property,
 * and an author field is rendered output. Corporate authorship is also the
 * truthful description of what these posts are.
 *
 * No `dateModified` unless a post is actually revised, and no fabricated
 * revision history. `datePublished` is the real publication date from the post
 * data, not the build timestamp, so it does not move on every deploy.
 *
 * Deliberately absent: `wordCount` inflation, `speakable`, and any `about` node
 * naming a place. These posts are national category writing.
 */
export function articleSchema({
  title,
  description,
  path,
  datePublished,
}: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
}) {
  const url = `${SITE_URL}${path}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished,
    inLanguage: "en-US",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}
