import type { Insight } from "@/data/insights";
import { BRANDS } from "@/config/company";

const [wattsmith] = BRANDS;

/**
 * PROCESS, PEOPLE, AND THE BRAND STORY
 * ====================================
 *
 * THE WATTSMITH POST IS THE HIGHEST RISK PIECE OF PROSE ON THIS PROPERTY.
 *
 * It is the only post that talks about Craftline's own plans, which is exactly
 * where a forward looking statement turns into a representation. The rules it
 * is written under, and they are not negotiable:
 *
 *   - EVERY FORWARD STATEMENT IS FRAMED AS A PLAN AND MARKED AS ONE. "The
 *     intention is", "the plan is", "no date is committed to". Never "will",
 *     never "is going to", never a milestone presented as scheduled.
 *   - NO PROJECTION STATED AS FACT. Not about markets, not about timing, not
 *     about how many of anything there will be.
 *   - NO EARNINGS IMPLICATION, including by implication. A sentence about a
 *     brand growing is a performance representation if a reader can infer a
 *     financial outcome from it. Growth is discussed as operational intent
 *     only.
 *   - NO OFFER, and the disclaimer rides on it exactly as it does on every
 *     other page, through the site footer.
 *   - Every fact about the brand traces to src/config/company.ts and is read
 *     from it here rather than retyped, so the post cannot drift from the
 *     source of truth.
 *
 * The cross domain links to the operating brand's own site are deliberate and
 * limited to sentences where that site is genuinely the authority.
 */
export const OPERATING_POSTS: Insight[] = [
  {
    slug: "how-to-buy-a-franchise-the-sequence",
    title: "How to buy a franchise: the actual sequence",
    eyebrow: "The process",
    description:
      "The real order of events from first enquiry to signing, what happens at each stage, and where the decision points genuinely are.",
    lead: "The process is more structured than most people expect, and the structure exists mostly for your benefit.",
    published: "2026-07-24",
    body: [
      {
        kind: "paragraph",
        text: "Buying a franchise follows a sequence that is broadly the same across systems, partly by convention and partly because a federal rule dictates the shape of the middle of it. Knowing the order makes it much easier to tell an ordinary process from a rushed one.",
      },
      { kind: "heading", text: "One: an enquiry, which commits you to nothing", step: 1 },
      {
        kind: "paragraph",
        text: [
          "You make contact and give a franchisor enough information to have a useful first conversation. This is not an application, it does not reserve anything, and it should not require financial documents or a signature. ",
          { text: "The process on this site works the same way", href: "/franchising#process" },
          ".",
        ],
      },
      { kind: "heading", text: "Two: conversations in both directions", step: 2 },
      {
        kind: "paragraph",
        text: "You ask about the brand, the method, and the support. The franchisor asks how you intend to run a business. Either side can decide it is not a fit, and that is a normal outcome rather than a failure.",
      },
      {
        kind: "paragraph",
        text: "A franchisor that only sells during this stage, and never asks you anything searching, is not evaluating you. That is worth noticing, because a system indifferent to who joins it is telling you what the operator standard is going to be.",
      },
      { kind: "heading", text: "Three: disclosure, and a waiting period", step: 3 },
      {
        kind: "paragraph",
        text: [
          "You receive the Franchise Disclosure Document. Under the FTC's Franchise Rule you must have it at least fourteen calendar days before you sign anything or pay anything, and some states require longer. ",
          { text: "What the document is and how to read it", href: "/insights/what-a-franchise-disclosure-document-is" },
          " is the thing to have understood before this arrives, not after.",
        ],
      },
      {
        kind: "paragraph",
        text: [
          "This is the real decision point, and the work in it is yours: read the whole document, ",
          { text: "call the franchisees who left", href: "/insights/how-to-check-a-franchisor" },
          ", and take it to a franchise attorney and an accountant who work for you.",
        ],
      },
      { kind: "heading", text: "Four: negotiation, within limits", step: 4 },
      {
        kind: "paragraph",
        text: "Franchise agreements are less negotiable than commercial contracts generally, because a system that varies its terms per franchisee becomes impossible to administer and creates disclosure problems of its own. Some terms move and many do not.",
      },
      {
        kind: "paragraph",
        text: "Where there is room, it is usually around territory definition and timing rather than around fees. Your attorney will know which is which in the jurisdiction.",
      },
      { kind: "heading", text: "Five: signing, funding, and opening", step: 5 },
      {
        kind: "paragraph",
        text: [
          "Then training, setup, and the operational work of opening. Financing is normally arranged in parallel with the disclosure period rather than after it, and ",
          { text: "the routes that exist are worth understanding early", href: "/insights/buying-a-franchise-with-limited-capital" },
          ".",
        ],
      },
      { kind: "heading", text: "What this does not establish" },
      {
        kind: "paragraph",
        text: [
          "This describes how the process works generally. Craftline has not issued a Franchise Disclosure Document and no date is being committed to for one, so stages three onward do not exist here yet. An enquiry today is a conversation and nothing more. ",
          { text: "The franchising section says the same thing at length", href: "/franchising" },
          ".",
        ],
      },
    ],
  },

  {
    slug: "franchising-for-veterans",
    title: "Franchising for veterans: what helps, and what is just marketing",
    eyebrow: "Operators",
    description:
      "Veteran franchise programmes, incentives, and claims, separated into the ones that are real and the ones that are positioning.",
    lead: "A lot of franchise brands describe themselves as veteran friendly. The phrase carries no definition, so it is worth knowing what to look behind it for.",
    published: "2026-07-23",
    body: [
      {
        kind: "paragraph",
        text: "Search for veteran franchise opportunities and most of what returns is award lists and badges. Veteran friendly is not a defined term, nobody certifies it, and a brand can use it because it means to.",
      },
      {
        kind: "paragraph",
        text: "That does not make the underlying idea empty. There are real reasons franchising and military background fit together, and there are real programmes. They are just not the same thing as the badge.",
      },
      { kind: "heading", text: "What genuinely transfers" },
      {
        kind: "paragraph",
        text: [
          "The honest version of the argument is about how people work rather than about incentives. Operating to a documented standard, holding a standard when nobody is watching, and running a checklist under pressure are ordinary military competencies and unusual civilian ones. ",
          { text: "What veteran operators bring to trade service businesses", href: "/insights/what-veteran-operators-bring-to-trade-services" },
          " makes that case in full.",
        ],
      },
      { kind: "heading", text: "What to look behind a veteran programme for" },
      {
        kind: "list",
        items: [
          "Is there a disclosed fee reduction, and does it appear in the disclosure document rather than only in a brochure.",
          "Does the franchisor participate in any formal programme, and can that be verified independently of the franchisor.",
          "Is there anything operational behind it, such as training that accounts for the transition, or is the whole programme a discount.",
          "Are there veterans currently operating in the system, and will the franchisor put you in touch with them.",
        ],
      },
      {
        kind: "paragraph",
        text: [
          "The first one matters most. A fee concession that is real is disclosed, because fee concessions are disclosed. If it is offered in conversation and absent from the document, ",
          { text: "the same question applies as to any other number quoted outside disclosure", href: "/insights/what-it-costs-to-buy-a-franchise" },
          ".",
        ],
      },
      { kind: "heading", text: "Where to check independently" },
      {
        kind: "paragraph",
        text: [
          "The Small Business Administration publishes its own material on ",
          {
            text: "programmes and lending for veteran owned businesses",
            href: "https://www.sba.gov/business-guide/grow-your-business/veteran-owned-businesses",
            external: true,
          },
          ", and reading the primary source before a franchisor's summary of it is the same habit that applies everywhere else in this process.",
        ],
      },
      { kind: "heading", text: "A caution about the statistics" },
      {
        kind: "paragraph",
        text: [
          "This category attracts confident numbers about veteran business performance and franchise success rates. Most of them cannot be traced to a primary source. The handling is the same as everywhere else on this site: ",
          { text: "ask for the source and open it", href: "/insights/how-to-check-a-franchisor" },
          ", and treat a figure that fails that as though it had not been given to you.",
        ],
      },
      { kind: "heading", text: "What this does not establish" },
      {
        kind: "paragraph",
        text: [
          "Craftline Brands was founded by a service disabled veteran entrepreneur and the brand operating under it is veteran owned. That is a fact about origin and it is not a claim about outcomes for anybody else. No Franchise Disclosure Document has been issued, so there is no veteran programme, no fee concession, and nothing on offer. ",
          { text: "The company page states what is established and nothing further", href: "/about" },
          ".",
        ],
      },
    ],
  },

  {
    slug: "what-a-franchisor-owes-an-operator",
    title: "What a franchisor owes an operator, and what it does not",
    eyebrow: "The agreement",
    description:
      "The obligations that run from franchisor to franchisee, how to tell a commitment from a discretion, and the things a franchise cannot do for you.",
    lead: "The obligations in a franchise run in both directions. The ones running toward you are the ones worth reading twice.",
    published: "2026-07-22",
    body: [
      {
        kind: "paragraph",
        text: "Franchise sales material talks a great deal about support. The disclosure document talks about obligations. Those are different words and the gap between them is where most disappointment in this industry lives.",
      },
      { kind: "heading", text: "Commitment against discretion" },
      {
        kind: "paragraph",
        text: "Read the obligations item for its verbs. A franchisor that shall provide something has committed. A franchisor that may provide it has reserved a choice.",
      },
      {
        kind: "paragraph",
        text: "Discretionary support is not worthless, but it is the first thing withdrawn when a franchisor comes under pressure, which is usually when a network of operators needs it most. A system whose entire support model is discretionary has described an intention rather than an obligation.",
      },
      { kind: "heading", text: "What is usually genuinely committed" },
      {
        kind: "list",
        items: [
          "Initial training, with a defined scope and location.",
          "The licence to use the marks, for the term and within the territory.",
          "An operations manual, and access to updates to it.",
          "The specified technology stack, where the system requires you to run on one.",
          "Administration of the marketing fund, where one is collected.",
        ],
      },
      {
        kind: "paragraph",
        text: [
          "All of it is disclosed and all of it is worth comparing between systems, which is one of the reasons ",
          { text: "the disclosure format is standardised at all", href: "/insights/what-a-franchise-disclosure-document-is" },
          ".",
        ],
      },
      { kind: "heading", text: "What a franchise cannot do for you" },
      {
        kind: "paragraph",
        text: "A brand system is not a substitute for the work. It does not make the work good: a mark on a van is a promise about a standard and it is worth exactly as much as the method behind it.",
      },
      {
        kind: "paragraph",
        text: [
          "It also does not manage anybody, it does not hold a trade licence on your behalf, and it does not replace judgement on the ground. ",
          { text: "The limits of each part of a brand system", href: "/about" },
          " are set out on the about page, including what each part explicitly does not do.",
        ],
      },
      { kind: "heading", text: "The obligations running the other way" },
      {
        kind: "paragraph",
        text: [
          "Your obligations are disclosed in their own item, and they are the enforceable half of ",
          { text: "brand standards", href: "/insights/what-to-look-for-in-a-home-services-franchise" },
          ". Read the two items together. A system asking a great deal of an operator while committing to very little in return is legible from the document long before it is legible from experience.",
        ],
      },
      { kind: "heading", text: "What this does not establish" },
      {
        kind: "paragraph",
        text: [
          "This describes obligations in franchise agreements generally and is not legal advice. Craftline has issued no Franchise Disclosure Document and therefore has no disclosed obligations to anyone. ",
          { text: "What it says it would provide", href: "/franchising#support" },
          " is described qualitatively and carries no commitment until there is a document that makes one.",
        ],
      },
    ],
  },

  {
    slug: "building-wattsmith-electric",
    title: `Building ${wattsmith.name}: the first brand`,
    eyebrow: "The company",
    description: `How Craftline Brands built and operated ${wattsmith.name} before developing a franchise programme around it, and why that order was deliberate.`,
    lead: "A franchise programme assembled before anyone has operated the brand is a set of assumptions. This is the other order.",
    published: "2026-07-21",
    body: [
      {
        kind: "paragraph",
        text: [
          `${wattsmith.name} is `,
          { text: "the operating brand Craftline holds", href: "/brands/wattsmith-electric" },
          `. It is ${wattsmith.summary.charAt(0).toLowerCase()}${wattsmith.summary.slice(1, -1)}, and it publishes its own site at `,
          {
            text: wattsmith.url.replace("https://", ""),
            href: wattsmith.url,
            external: true,
          },
          ", which is the authority on the work it does and the customers it serves.",
        ],
      },
      {
        kind: "paragraph",
        text: "This post is about the other half: why a franchise development company built and ran an operating business first, and what that produced.",
      },
      { kind: "heading", text: "The order was the decision" },
      {
        kind: "paragraph",
        text: "Most franchise programmes are written, then sold, then operated. Craftline was set up the other way round. The brand was built and run as a real electrical contracting business, and the systems were written from what that business actually needed.",
      },
      {
        kind: "paragraph",
        text: [
          "The reason is structural rather than sentimental. An operating business is consumed by the day: the calls, the scheduling, the hiring, the collections. Work on the system loses to work in the business every single time, which is why most independent trade companies never build one. ",
          { text: "Putting the system in a separate company", href: "/about" },
          " is how the system gets built at all.",
        ],
      },
      {
        kind: "paragraph",
        text: [
          "It also means the playbook has been tested against something. A documented pricing method that has never priced a real job, or a dispatch process that has never dispatched a van, is a hypothesis. ",
          { text: "Why trade services suit franchise structures", href: "/insights/why-trade-services-suit-franchise-systems" },
          " makes the general case; this brand is where it was checked.",
        ],
      },
      { kind: "heading", text: "Veteran founded, and what that does and does not mean" },
      {
        kind: "paragraph",
        text: "Craftline Brands was founded by a service disabled veteran entrepreneur, and the operating brand is veteran owned as well. That makes the company veteran founded by origin rather than by positioning.",
      },
      {
        kind: "paragraph",
        text: [
          "It is a fact about where the company came from. It is not a claim about outcomes, and it is not a programme: there is no veteran concession here, because there is nothing to concede against yet. ",
          { text: "What to look behind a veteran franchise claim for", href: "/insights/franchising-for-veterans" },
          " applies to this company exactly as it applies to any other.",
        ],
      },
      { kind: "heading", text: "What is being built now, stated as a plan" },
      {
        kind: "paragraph",
        text: "The current work is the franchise programme itself: documenting the operating method, building out the technology configuration, and preparing the disclosure work that has to precede anything being offered to anyone.",
      },
      {
        kind: "paragraph",
        text: "The intention is to develop that programme around the operating brand rather than in parallel with it. No Franchise Disclosure Document has been issued. No date is being committed to for one, no market is being named, and nothing here should be read as a schedule.",
      },
      {
        kind: "paragraph",
        text: [
          "Those are plans. They are stated as plans deliberately, because a forward looking statement dressed as a fact is the thing this industry does badly and the thing a disclosure regime exists to prevent. ",
          { text: "What happens when there is something to disclose", href: "/franchising#process" },
          " is set out in the process section.",
        ],
      },
      { kind: "heading", text: "What this does not establish" },
      {
        kind: "paragraph",
        text: [
          "Nothing here is an offer, a projection, or a statement about what any business earns or would earn. No revenue, growth, unit count, or performance figure appears in this post, for the operating brand or for the company, and none will before disclosure. If you want the electrical work, ",
          {
            text: `go to ${wattsmith.url.replace("https://", "")}`,
            href: wattsmith.url,
            external: true,
          },
          ". If you want to understand the franchise side, ",
          { text: "the franchising section is the place to start", href: "/franchising" },
          ".",
        ],
      },
    ],
  },
];
