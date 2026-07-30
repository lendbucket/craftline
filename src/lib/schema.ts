import { BRANDS, COMPANY, CONTACT_EMAIL, SITE_URL } from "@/config/company";

/**
 * STRUCTURED DATA
 * ===============
 *
 * Two graphs, emitted once from the root layout so every page carries them.
 *
 * What is deliberately NOT here, and must not be added later without a real
 * source behind it:
 *   - `aggregateRating` and `review` of any kind. Craftline has no reviews, and
 *     review markup without reviews is a manual action waiting to happen. This
 *     is the "no reviews from day one" position: the absence is the pattern,
 *     so there is never a moment where someone adds rating markup "temporarily".
 *   - `foundingDate`, `numberOfEmployees`, `employee`, `founder`. The founder's
 *     name is never rendered on this property, and schema is rendered output.
 *   - Anything resembling revenue, unit counts, or performance. Structured data
 *     is public and machine read, so a financial performance representation
 *     hidden in JSON-LD is still a financial performance representation.
 */

/**
 * Stable node ids. Using fragment ids on the canonical origin lets the two
 * graphs reference each other instead of duplicating the organization object.
 */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: COMPANY.name,
    url: `${SITE_URL}/`,
    description: COMPANY.descriptor,
    /**
     * Wattsmith Electric is referenced as a subOrganization by URL. Craftline
     * asserts the relationship and nothing about Wattsmith's own attributes:
     * that site is the authority on its own entity, and duplicating its claims
     * here would create two sources of truth that can drift.
     */
    subOrganization: BRANDS.map((brand) => ({
      "@type": "Organization",
      name: brand.name,
      url: brand.url,
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
