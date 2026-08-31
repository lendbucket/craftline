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
    city: "San Antonio",
    state: "Texas",
    /** External site. Craftline links out; it does not duplicate that content. */
    url: "https://wattsmithelectric.com",
    summary:
      "A licensed, insured, veteran owned electrical contractor serving residential and light commercial customers in San Antonio, Texas.",
    /**
     * Each of these is a fact Wattsmith can evidence on demand. Nothing here
     * is a superlative and nothing here is a performance claim.
     */
    attributes: [
      "Licensed and insured",
      "Veteran owned",
      "Residential and light commercial service",
      "Operating in San Antonio, Texas",
    ],

    /**
     * BRAND SYSTEM.
     *
     * The delivered identity, sourced from the Wattsmith repository's design
     * masters rather than sampled by eye from a screenshot. These two colours
     * are the brand system as it is presented publicly on this site.
     *
     * `onRatio` is measured against the paired surface and is why the lockup
     * component recolours per background: navy on a navy field is invisible,
     * so the reversed artwork substitutes `reversedInk` for it. The gold is
     * constant on every surface because it clears AA on both.
     */
    palette: [
      {
        name: "Wattsmith Navy",
        hex: "#1A2634",
        role: "The primary brand colour. Carries the mark, the wordmark, and every dark surface the brand owns.",
      },
      {
        name: "Wattsmith Gold",
        hex: "#F7B11D",
        role: "The single accent. Reserved for the lightning bolt and the ELECTRIC banner, never used as a background for body text.",
      },
    ],
    /**
     * NOT part of the public palette above, and deliberately not presented as
     * a brand colour. It is the reversed ink the delivered artwork uses so the
     * navy elements stay visible when the lockup sits on a navy field. It lives
     * here rather than in the component because the artwork rule is a fact
     * about the asset set, not a Craftline design choice.
     */
    reversedInk: "#F4EFE8",

    /**
     * The delivered lockup, copied from the Wattsmith repository's
     * public/brand directory. Tracked in src/data/images.ts like every other
     * asset on this site.
     */
    logo: "/brand/wattsmith-electric-lockup.svg",

    /**
     * SERVICE CATEGORIES, DESCRIPTIVE ONLY.
     *
     * Sourced from the operating brand's own service data. They are listed
     * here so a reader can see what kind of business the brand actually is,
     * and they are rendered as a plain category list.
     *
     * READ THIS BEFORE EDITING. Craftline does not compete with
     * wattsmithelectric.com for service keywords and never targets city plus
     * service queries. That is why these are the non geographic category
     * names and not the operating brand's page titles: "Panel upgrades and
     * replacements", never "Panel Upgrade San Antonio". Do not attach a city
     * to any of these, do not give any of them a page on this site, and do not
     * link them to the operating brand's service pages.
     */
    services: [
      "Electrical repair and troubleshooting",
      "Panel upgrades and replacements",
      "EV charger installation",
      "Whole home rewiring",
      "Lighting installation",
      "Generator installation and hookups",
      "Whole home surge protection",
      "GFCI and outlet installation",
      "Smoke and carbon monoxide detector installation",
      "Electrical inspections and code compliance",
      "Commercial electrical and tenant improvements",
      "New construction wiring",
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
 * FRANCHISE FAQ.
 *
 * The questions a serious operator actually asks, answered inside the legal
 * gates rather than around them.
 *
 * THE HARD PART OF THIS SECTION IS THE QUESTIONS THAT CANNOT BE ANSWERED.
 * Cost and earnings are the first two things anyone wants to know, and both
 * are off limits until the FDD is issued. The temptation is to omit those
 * questions so the page reads smoothly. That is worse than useless: it leaves
 * the reader thinking the site is evasive, and it wastes the chance to explain
 * why no honest franchisor answers them early. So both are asked and both are
 * answered with the reason, not with a deflection.
 *
 * Rules for editing this array:
 *   - No fee, price, royalty, or capital figure. Not a range, not an example.
 *   - No revenue, profit, earnings, margin, or payback, including comparative
 *     forms like "stronger returns" or "faster payback".
 *   - No statement that a franchise is available, anywhere, to anyone.
 *   - No qualification threshold, because a stated threshold is a claim about
 *     who will be accepted and no such claim can be made before disclosure.
 *   - Describing the regulatory framework is permitted and is the point. An
 *     FDD exists, it has a standard format, and a waiting period applies
 *     before anything is signed. Those are facts about the law rather than
 *     representations about this company.
 */
export const FRANCHISE_FAQ = [
  {
    q: "Is Craftline offering franchises right now?",
    a: "No. The Franchise Disclosure Document has not been issued, so there is nothing to offer and nothing to accept. This site is information and inquiry only. If you send an inquiry, you are starting a conversation, not applying for anything and not reserving anything.",
  },
  {
    q: "What does it cost?",
    a: "Nothing on this site states a fee, and nothing can until the FDD is issued. That is not evasion, it is the rule. Franchise fees, royalties, and required investment belong in the disclosure document, in a standard format regulators specify, so that you can compare one system against another on the same terms. Anyone who quotes you a number for a franchise before handing you a disclosure document is telling you something about how they operate.",
  },
  {
    q: "What can I expect to earn?",
    a: "No answer, and you should be wary of anyone who gives you one. A franchisor may only make a financial performance representation inside the disclosure document, where it has to be substantiated and where the basis for it has to be stated. Outside that document the honest answer is silence. What the business earns depends on the operator, the market, and the execution, and that would be true no matter what anyone put in a brochure.",
  },
  {
    q: "What would I actually be running?",
    a: "A trade service business in one market, under a brand you did not have to build, using a documented method you did not have to invent. Generically, a franchise system is four things: the brand and the marks, the operating playbook, the technology stack, and a defined territory. The insights section explains how those four depend on each other in more detail.",
  },
  {
    q: "Do I need to be an electrician?",
    a: "Electrical work is licensed, and the licensing rules are set by each jurisdiction rather than by a brand. What every jurisdiction has in common is that the work must be performed and supervised by properly licensed people. Whether that has to be the owner, or whether an owner can employ the licence holder, depends on where the business operates. It is a question for the regulator in that jurisdiction, and it is one worth answering early because it shapes what the business needs on day one.",
  },
  {
    q: "Do I have to be a veteran?",
    a: "No. Craftline was founded by a service disabled veteran entrepreneur and the operating brand is veteran owned, so veterans considering ownership are encouraged to make contact. That is an invitation, not a requirement, and no part of this is limited to people who served.",
  },
  {
    q: "Is a territory open in my market?",
    a: "That question cannot be answered here. Territory is a term of a franchise agreement, and terms only exist once there is a disclosure document behind them. This site publishes no map, no list of open markets, and no availability language, because any of those would be an offer in everything but name.",
  },
  {
    q: "Why is there only one brand?",
    a: "Because the order matters. Wattsmith Electric was built and put into operation first, and the systems Craftline holds were built against a business that actually runs rather than designed in the abstract and handed to someone else to test. A playbook written by people who have not done the work is the most expensive kind of document there is.",
  },
  {
    q: "What happens if I send an inquiry?",
    a: "A person reads it and gets back to you. The process below describes what follows. There is no automated sequence, no drip campaign, and no sales pipeline you get dropped into, and the form asks for nothing sensitive.",
  },
] as const;

/**
 * THE PROCESS, INQUIRY TO CONVERSATION.
 *
 * Genuinely sequential, which is the only reason it is permitted to render
 * with the numbered Register device. Step three cannot happen before step two.
 * See the warning on Register in src/components/section.tsx.
 *
 * The last step is deliberately conditional and deliberately vague on timing.
 * The FDD is not issued, no date is committed to anywhere on this site, and
 * writing "then you receive the FDD" as though it were scheduled would be a
 * promise this company is not in a position to make.
 */
export const INQUIRY_PROCESS = [
  {
    title: "You send an inquiry",
    body: "The form asks who you are, where you are interested, roughly when, and anything you want to add. It asks for no financial documents, no social security number, and no signature, and submitting it commits you to nothing.",
  },
  {
    title: "A person reads it and replies",
    body: "Not an automated sequence. You get a reply from someone who can answer questions, and if what you are looking for is not what Craftline is building, you get told that plainly rather than pursued.",
  },
  {
    title: "A conversation, both directions",
    body: "You ask what you need to ask about the brand, the method, and the support. Craftline asks what it needs to ask about how you intend to run a business. Either side can decide it is not a fit, and that is a normal outcome rather than a failure.",
  },
  {
    title: "Disclosure, if and when there is something to disclose",
    body: "No Franchise Disclosure Document has been issued and no date is being committed to. If one is issued and you are still interested, you receive it, you get a waiting period set by federal rule to read it and take advice before anything is signed, and only then does anything become an offer.",
  },
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
 * Effective date shown on the privacy policy and the terms.
 *
 * A hardcoded string rather than a build time date. Rendering `new Date()`
 * would restamp both documents on every deploy, which tells a reader the terms
 * changed when they did not, and destroys the one signal the date exists to
 * give. Update this by hand, in the same commit as the wording change.
 */
export const POLICY_LAST_UPDATED = "30 July 2026";

/**
 * NATIONAL CATEGORY POSITIONING.
 *
 * The four categories this site is written to be understood as. They are
 * descriptions of what Craftline is, which is the only reason they are
 * permitted to appear in copy and metadata at all.
 *
 * NATIONAL ONLY, AND THAT IS A HARD BOUNDARY. There are no state pages, no
 * city pages, and no language anywhere about which markets are open, which are
 * taken, or where a franchise is available. Territory availability is an offer
 * term, and the FDD is not issued. Attaching a place name to any string below
 * turns a category description into a geographic offer, so do not do it.
 *
 * These are also not a keyword dump. Each one is used once, in a sentence that
 * would still be worth writing if search engines did not exist.
 */
export const CATEGORY_POSITIONING = [
  "home services franchise",
  "electrician franchise",
  "skilled trades franchise",
  "veteran franchise",
] as const;

/*
  NAV and LEGAL_NAV moved to src/config/nav.ts. The reason is in that file:
  the header is a client component, it imported NAV from here, and that pulled
  this module across the client boundary on all 27 routes. Nothing else left.
*/
