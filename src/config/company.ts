/**
 * CRAFTLINE BRANDS: SINGLE SOURCE OF TRUTH
 * ========================================
 *
 * Everything this site is allowed to assert lives in this file. If a fact is
 * not here, it does not go on the site. That rule is load bearing, not a
 * preference: Craftline is a franchisor in formation, and an unsourced claim
 * in marketing copy is a legal exposure, not a typo.
 *
 * What is deliberately absent, and must stay absent until it is real and
 * documented: franchisee counts, revenue, growth figures, unit economics,
 * press mentions, team members, testimonials, reviews, awards, founding year.
 *
 * The founder's name is never rendered anywhere on this property: not in copy,
 * metadata, schema, image alt text, or the sitemap.
 */

/**
 * Trailing slash is stripped so callers can always join with a leading-slash
 * path and never produce a double slash in a canonical URL.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://craftlinebrands.com"
).replace(/\/+$/, "");

/**
 * No Craftline mailbox exists yet. Until one does this stays unset and the
 * site renders no email address at all, rather than shipping an invented or
 * borrowed one. Every consumer of this value must handle null.
 */
export const CONTACT_EMAIL: string | null =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null;

export const COMPANY = {
  name: "Craftline Brands",
  /** Used where the full name would repeat awkwardly inside a sentence. */
  shortName: "Craftline",
  domain: "craftlinebrands.com",
  /**
   * One line, used as the meta description base and the SERP site name
   * anchor. Describes what the company is, claims nothing it cannot support.
   */
  descriptor:
    "A franchise development company building and operating skilled trade service brands.",
} as const;

/**
 * The corporate structure. Both entities are Wyoming LLCs. Stated plainly
 * because a prospective operator reading a franchisor site is entitled to know
 * which entity holds what, and because it is verifiable.
 */
export const LEGAL_ENTITIES = [
  {
    name: "Craftline Brands IP LLC",
    jurisdiction: "Wyoming",
    role: "Holds the trademarks and the brand systems.",
  },
  {
    name: "Craftline Brands Franchising LLC",
    jurisdiction: "Wyoming",
    role: "The franchisor entity.",
  },
] as const;

/**
 * Founding statement. The only permitted reference to the founder, and it
 * carries no name by design.
 */
export const FOUNDING_STATEMENT =
  "Craftline Brands was founded by a service disabled veteran entrepreneur.";

/**
 * Operating brands. One today. The shape is an array so adding the second
 * brand is a data edit rather than a rebuild of the brands pages.
 */
export const BRANDS = [
  {
    slug: "wattsmith-electric",
    name: "Wattsmith Electric",
    /** Trade category, not a service keyword target. */
    category: "Electrical contracting",
    state: "Texas",
    /** External site. Craftline links out; it does not duplicate that content. */
    url: "https://wattsmithelectric.com",
    summary:
      "A licensed, insured, veteran owned electrical contractor serving residential and light commercial customers in Texas.",
    /**
     * Each of these is a fact Wattsmith can evidence on demand. Nothing here
     * is a superlative and nothing here is a performance claim.
     */
    attributes: [
      "Licensed and insured",
      "Veteran owned",
      "Residential and light commercial service",
      "Operating in Texas",
    ],
  },
] as const;

export type Brand = (typeof BRANDS)[number];

/**
 * What the holding company actually does. Qualitative by necessity and by
 * rule: describing the support model is permitted, quantifying its results is
 * not. Read every line here as if a regulator were reading it, because the
 * franchise support description is exactly where a financial performance
 * representation tends to sneak in.
 */
export const CAPABILITIES = [
  {
    title: "Brand systems",
    body: "Craftline owns the marks, the visual system, and the standards that define how a brand presents itself in every market it enters. Operators run under a brand that is already built rather than one they have to invent.",
  },
  {
    title: "Operating playbooks",
    body: "The work of running a trade service business is documented as procedure: how calls are handled, how jobs are scoped and priced, how technicians are trained and held to standard, and how the back office runs.",
  },
  {
    title: "Technology",
    body: "The scheduling, dispatch, customer record, and reporting stack is selected and configured at the brand level, so an operator inherits a working system instead of assembling one.",
  },
  {
    title: "Territory expansion",
    body: "Markets are defined and sequenced by the brand, not claimed at random. Craftline supports the operator through opening and into steady state.",
  },
] as const;

/**
 * What Craftline looks for in an operator.
 *
 * Traits only. There is deliberately no experience requirement, no background
 * requirement, and nothing that reads as a qualification threshold, because a
 * stated threshold pre-FDD is a claim about who will be accepted and this site
 * cannot make one. Each line below follows from the support model above: a
 * documented playbook implies someone willing to follow it, and a sequenced
 * territory plan implies commitment to one market first.
 */
export const OPERATOR_PROFILE = [
  "Operators who intend to run the business themselves rather than hold it passively.",
  "People who want a system to follow rather than one to invent.",
  "Commitment to a single market before any conversation about a second.",
] as const;

/**
 * Inquiry form option sets.
 *
 * These are answer choices, not assertions. Read them anyway with the same
 * suspicion as copy: a bracket floor implies an expectation whether or not a
 * sentence states one.
 *
 * The capital brackets start below fifty thousand and end with a decline
 * option, so the form asks the question without implying a minimum. Nothing
 * anywhere on the site states a capital requirement, because no FDD has been
 * issued and there is therefore nothing to require.
 */
export const CAPITAL_BRACKETS = [
  "Under $50,000",
  "$50,000 to $150,000",
  "$150,000 to $300,000",
  "Over $300,000",
  "Prefer not to say",
] as const;

export const TIMELINE_OPTIONS = [
  "Within 3 months",
  "3 to 6 months",
  "6 to 12 months",
  "More than 12 months",
  "Still gathering information",
] as const;

export const VETERAN_OPTIONS = ["Yes", "No", "Prefer not to say"] as const;

/**
 * FRANCHISE LEGAL DISCLAIMER, VERBATIM AND NON NEGOTIABLE.
 *
 * The FDD is not yet issued. Until it is, and in registration states until
 * registered, nothing on this site may constitute a franchise offer. This
 * string is rendered in the footer region of every franchise related page.
 * Because the site footer is global and the home page carries a franchise
 * call to action, it is rendered site wide.
 *
 * Do not reword it, do not summarise it, and do not split it across elements.
 */
export const FRANCHISE_DISCLAIMER =
  "This website and the information on it do not constitute an offer to sell a franchise. An offer to sell a franchise can be made only after delivery of a Franchise Disclosure Document in compliance with applicable law, and in certain states only after registration or qualification in that state.";

/**
 * Primary navigation. Single source so the header, the footer, and the sitemap
 * cannot drift apart.
 */
export const NAV = [
  { href: "/about", label: "About" },
  { href: "/brands", label: "Brands" },
  { href: "/franchising", label: "Franchising" },
  { href: "/contact", label: "Contact" },
] as const;

export const LEGAL_NAV = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms" },
] as const;
