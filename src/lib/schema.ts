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
 * THE ENTITY URL, AND WHY IT HAS NO TRAILING SLASH.
 *
 * It used to be `${SITE_URL}/`, while the home page canonical resolves to
 * `https://craftlinebrands.com` with no slash. Two strings for one entity is
 * exactly the ambiguity an extractor has to guess its way through, and a
 * knowledge graph that has guessed twice has two nodes. The canonical is the
 * authority on this site's own address, so schema follows it rather than the
 * other way round.
 *
 * The node ids above keep their slash. A fragment id is an identifier rather
 * than an address, it is never fetched, and changing an id that other nodes
 * reference by @id would break the references for no gain.
 *
 * NO sameAs, AND THAT IS A MEASURED ABSENCE RATHER THAN AN OVERSIGHT.
 * sameAs is for external pages that unambiguously identify this same entity:
 * a company LinkedIn page, a Crunchbase entry, a Wikidata item. Craftline has
 * none of those yet. The operating brand's site is not a candidate, because it
 * identifies a different entity and already appears correctly on the brand
 * node below. Pointing sameAs at a page that is not this company is a false
 * identity claim, and it is worse than the empty field it replaces. When a
 * real profile exists, it goes here.
 */
export const ENTITY_URL = SITE_URL;

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
    url: ENTITY_URL,
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
    url: ENTITY_URL,
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
      /*
        Home resolves to the bare origin, matching both the home canonical and
        Organization.url. It used to append a slash here and nowhere else,
        which put a third spelling of the same address into the graph.
      */
      item: `${SITE_URL}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

/**
 * FAQPage, for a page that already renders real questions and answers.
 *
 * THE RULE THIS IS BUILT UNDER: schema describes what is on the page, and it
 * never carries content the page does not. The nine pairs on the franchising
 * page come from FRANCHISE_FAQ, the visible list is rendered from the same
 * array, and this builder takes the same array. There is no second copy of the
 * text to drift, and no path by which a question can exist in the markup and
 * not on the page.
 *
 * THE ARTICLES GET NONE OF THIS, DELIBERATELY. Not one of the eighteen posts
 * contains a genuine content question: every question mark in the section
 * belongs to a call to action heading, and the body subheads are all
 * declarative. Writing questions into eighteen articles so that eighteen
 * FAQPage blocks could exist would be manufacturing content to fill markup,
 * which is the failure this note exists to prevent. Zero is the correct
 * number and it stays zero until a post genuinely asks something.
 *
 * ONE THING TO UNDERSTAND ABOUT MARKING UP THIS PARTICULAR FAQ. Three of the
 * nine answers are the franchise legal gate doing its job: what it costs, what
 * an operator can expect to earn, and whether a territory is open. Marking
 * them up makes them eligible to be lifted and shown by a machine that does
 * not carry the page's disclaimer with them. Each of those three is written to
 * survive that, because each leads with the refusal and qualifies afterwards
 * rather than the reverse. Any answer added later has to meet the same test
 * before it goes in here, and an answer that only makes sense beside the
 * disclaimer does not belong in structured data at all.
 */
export function faqSchema(
  entries: readonly { q: string; a: string }[],
  path: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}${path}#faq`,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.q,
      acceptedAnswer: { "@type": "Answer", text: entry.a },
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
