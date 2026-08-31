import { DISCLOSURE_POSTS } from "@/data/posts/disclosure";
import { MONEY_POSTS } from "@/data/posts/money";
import { CATEGORY_POSTS } from "@/data/posts/category";
import { OPERATING_POSTS } from "@/data/posts/operating";

/**
 * INSIGHTS
 * ========
 *
 * The written section: category writing about how trade service businesses and
 * franchise systems work.
 *
 * Post CONTENT lives in src/data/posts/, grouped into clusters. This file holds
 * the types, the aggregation, and the rules. The split exists because the rules
 * below are what a reviewer needs to read first, and they were becoming a
 * preamble to two thousand lines of prose.
 *
 * THE RULES THESE WERE WRITTEN UNDER, WHICH ARE NOT STYLE PREFERENCES
 * -------------------------------------------------------------------
 * 1. NO UNSOURCED STATISTICS, AND THE BAR IS A LINKABLE PRIMARY SOURCE.
 *    The temptation in this genre is to open with a number that sounds
 *    authoritative, and a number nobody can source is a fabrication whether or
 *    not it happens to be close.
 *
 *    A number may appear only if it traces to a primary source a reader can
 *    open: the SBA, the FTC, a federal register notice, or published academic
 *    work. Trade press repeating a figure is not a source, it is a citation of
 *    a citation.
 *
 *    Where a figure is widely repeated and CANNOT be traced, the post names it
 *    as unverifiable and explains why, rather than repeating it. That is more
 *    useful than the number would have been, and it is the required handling
 *    for franchise failure and success rate claims, which are the most abused
 *    figures in this category. See the sourcing note in
 *    src/data/posts/disclosure.ts.
 *
 *    Most arguments here need no number at all: they hold because of how the
 *    work is shaped, and can be checked by anyone who has run a service call.
 *
 * 2. NO FINANCIAL PERFORMANCE REPRESENTATIONS. No revenue, profit, earnings,
 *    margin, payback, or unit economics, in any form, including comparative
 *    forms like "performs better" or "more resilient". The FDD is not issued.
 *    A financial performance representation buried in an article is still a
 *    financial performance representation, and an article is exactly where one
 *    tends to hide, because prose feels less regulated than a page of copy. It
 *    is not.
 *
 * 3. NO OFFER. These describe how franchise systems work generically. They do
 *    not describe Craftline's terms, fees, territory availability, or selection
 *    criteria, and they never invite anyone to buy anything. Every post carries
 *    the disclaimer verbatim, same as every other page.
 *
 * 4. NO GEOGRAPHY. No state pages, no city pages, and no language about where a
 *    franchise is or is not available. Territory is discussed only as a generic
 *    concept in franchise systems.
 *
 * 5. EACH POST ARGUES ITS OWN CASE AND STATES ITS OWN LIMITS. Every one ends by
 *    saying plainly what it does not establish. That is not hedging. A piece
 *    that only lists advantages reads as sales material, and the audience for
 *    this section is people who have run a business and can tell the
 *    difference.
 *
 * Voice: direct operator. Short sentences. No marketing cliche, no em dashes,
 * no en dashes, no hyphens used to join clauses.
 */

/**
 * A run of text, optionally a link.
 *
 * Inline links exist because dense internal linking with DESCRIPTIVE anchors is
 * the point: an anchor reading "learn more" tells a reader and a crawler
 * nothing, and a block that can only hold plain text forces every link to the
 * end of a section where nobody follows it.
 *
 * `external` marks a link off this domain. The renderer adds rel and target for
 * those and nothing else, so an internal link is never treated as outbound.
 */
export type Inline = string | { text: string; href: string; external?: boolean };

export type Block =
  | { kind: "paragraph"; text: string | Inline[] }
  | {
      kind: "heading";
      text: string;
      /**
       * POSITION IN A GENUINE SEQUENCE, AND THE ONLY THING THAT EARNS A
       * NUMERAL IN THIS SECTION.
       *
       * Numerals are reserved for content where the order is load bearing.
       * That is the rule the Steps component is built under and it holds here:
       * numbering a set of four things that are not four steps tells a reader
       * something untrue about them.
       *
       * Exactly one article qualifies today. Its headings already carry their
       * ordinal in the prose, which is what makes the rendered numeral safe to
       * hide from assistive technology: it repeats a word the heading already
       * says, so a reader who cannot see it loses nothing. That is the exact
       * inverse of the failure Rule One caught in Phase 2A, where a decorative
       * numeral was the only thing carrying the sequence.
       *
       * If you are about to set this on a list of features, capabilities, or
       * reasons, it is not a sequence and this field is not for it.
       */
      step?: number;
    }
  | { kind: "list"; items: (string | Inline[])[] };

/**
 * THE CLOSING SECTION EVERY ARTICLE IN THIS SECTION IS SUPPOSED TO HAVE.
 *
 * Rule 5 above requires each post to state plainly what it does not establish.
 * Fifteen of the eighteen carry this exact heading, and the article template
 * lifts it out of the reading column into its own band, because it is the one
 * passage a careful reader and a generative engine both go looking for.
 *
 * Matched as an exact string rather than flagged per post. There is one
 * spelling of it and it is here; a post that spells it differently simply
 * keeps it inline, which is a degradation rather than a break.
 */
export const LIMITS_HEADING = "What this does not establish";

export interface Insight {
  slug: string;
  /** Rendered as the h1 and the metadata title. */
  title: string;
  /** Small caps label above the title. A category, not a date. */
  eyebrow: string;
  /** Meta description and hub card summary. One sentence, no clickbait. */
  description: string;
  /** The standfirst under the h1. */
  lead: string;
  /**
   * ISO date. Real publication date, hardcoded rather than computed, for the
   * same reason POLICY_LAST_UPDATED is: a date that moves on every deploy tells
   * a reader the piece changed when it did not.
   */
  published: string;
  body: Block[];
}

const FOUNDING_POSTS: Insight[] = [
  {
    slug: "why-trade-services-suit-franchise-systems",
    title: "What makes skilled trade service businesses suited to franchise systems",
    eyebrow: "Trade economics",
    description:
      "Skilled trade service work is local, not discretionary, and already governed by external standards. Those three properties are what make it fit a franchise system, and they explain what a system can and cannot fix.",
    lead: "Some businesses fit a franchise system and some do not. The trades fit for reasons that have nothing to do with fashion and everything to do with how the work is shaped.",
    published: "2026-07-30",
    body: [
      {
        kind: "paragraph",
        text: "Franchising gets discussed as though it were a strategy you can apply to any business. It is not. It is a structure, and structures fit some shapes and not others. The question worth asking about any category is whether the work itself has the properties a franchise system needs. Skilled trade service work has most of them, and it is worth being specific about which ones, because the same analysis shows exactly where a system stops helping.",
      },
      { kind: "heading", text: "The work has to happen where the customer is" },
      {
        kind: "paragraph",
        text: "An electrician cannot fix a dead circuit from another city. Somebody has to stand in the room with a meter. That sounds obvious and it is the single most important fact about the category.",
      },
      {
        kind: "paragraph",
        text: "It means the natural unit of the business is one crew serving one metro area. You cannot consolidate the work into a call centre or a warehouse and serve everyone from there, the way retail and software consolidated. Every market needs its own vans, its own licensed people, and its own relationships with suppliers and inspectors. That is a lot of independent local units doing recognisably the same job, which is the shape a franchise system exists to serve. Where a business can be centralised, it usually should be, and franchising is the wrong tool. Where it cannot, the choice is between a company that opens branches and a system that licenses operators.",
      },
      { kind: "heading", text: "Demand is a problem, not a preference" },
      {
        kind: "paragraph",
        text: "Nobody shops for an electrician the way they shop for a sofa. The panel is buzzing, or half the house went dark, or the inspector flagged the wiring and the sale does not close until it is fixed. The customer did not decide to want this.",
      },
      {
        kind: "paragraph",
        text: "That changes what the business has to be good at. It does not have to create demand, which is the expensive part of most consumer businesses. It has to be findable at the moment the problem appears, answer the phone, and show up when it said it would. Those are operational problems with known solutions, and known solutions are what a playbook is made of. A system that documents how calls are answered and how arrival windows are held is addressing the actual constraint, not decorating around it.",
      },
      { kind: "heading", text: "The standards already exist and somebody else wrote them" },
      {
        kind: "paragraph",
        text: "This is the property most people miss. Electrical work is governed by a code, permits are pulled, and inspectors sign off. The trade did not have to invent a definition of correct. It is written down, it is enforced by someone with no stake in the job, and every competent operator in the country is already working to it.",
      },
      {
        kind: "paragraph",
        text: "Compare that to categories where a franchisor has to invent the standard, publish it, and then police it alone. Those systems spend enormous effort on quality control because there is no external referee. In the trades a large part of the standard is external and mandatory. A playbook does not have to define what good wiring is. It has to define how the business consistently produces work that passes, how it prices that work before starting, and how it trains people to that level. That is a much narrower and much more solvable problem.",
      },
      { kind: "heading", text: "The customer cannot check the work" },
      {
        kind: "paragraph",
        text: "You can taste a bad meal. You cannot see inside your own wall. Once the drywall is closed, a homeowner has no way to tell careful work from work that will be somebody's problem in nine years, and most people will never find out either way.",
      },
      {
        kind: "paragraph",
        text: "That is why trust does disproportionate work in this category, and it is why a brand is worth something here beyond recognition. A brand in the trades is a claim that the standard is held even where the customer cannot verify it. That claim is only worth anything if something behind it actually enforces the standard, which is the job of the playbook and the training, not of the logo. A brand with nothing behind it is a liability in this category rather than an asset, because the failures eventually surface and they surface under one name instead of many.",
      },
      { kind: "heading", text: "Most trade businesses are built by technicians, not operators" },
      {
        kind: "paragraph",
        text: "The usual path into owning a trade business is being good at the trade. Someone spends years becoming genuinely skilled, gets tired of making money for somebody else, and goes out on their own. What they have mastered is the work. What they now have to do is scheduling, pricing, collections, insurance, hiring, training, marketing, and tax. None of that was in the apprenticeship.",
      },
      {
        kind: "paragraph",
        text: "This is the gap a system is actually filling. Not the trade knowledge, which the operator often already has in more depth than the franchisor does, but everything wrapped around it. Stated plainly: the value on offer is a documented answer to the business questions, so the operator's own skill goes into the work and into leading a crew instead of into reinventing a pricing model.",
      },
      { kind: "heading", text: "Where the fit stops" },
      {
        kind: "paragraph",
        text: "None of the above says a franchise system makes a trade business easy, and it would be dishonest to leave the argument there.",
      },
      {
        kind: "list",
        items: [
          "Licensing is personal and jurisdictional. A brand cannot hold a licence on an operator's behalf, and no system removes the requirement to have properly licensed people doing the work.",
          "The labour problem is real and a playbook does not solve it. Finding and keeping good technicians is the hardest part of running a trade business, and a documented training path helps with it without making it go away.",
          "A system cannot supply the willingness to do the job. Someone has to answer the phone at seven in the morning and stand behind the work when it goes wrong.",
          "Any business where the owner personally is the product does not franchise well, and some trade practices are built exactly that way.",
        ],
      },
      {
        kind: "paragraph",
        text: "So the honest version of the argument is narrow. Trade service work is local, not discretionary, externally standardised, and usually run by people whose training was technical rather than commercial. Those four facts are why the category and the structure fit each other. What that fit produces for any particular business depends on the operator, the market, and the execution, and this article makes no claim about any of it.",
      },
    ],
  },

  {
    slug: "what-veteran-operators-bring-to-trade-services",
    title: "What veteran operators bring to trade service businesses",
    eyebrow: "Operators",
    description:
      "Military experience maps onto trade service operations in specific, describable ways: procedure, training pipelines, maintenance discipline, and accountability to a standard. It also has real limits worth naming.",
    lead: "The overlap between military service and running a trade business is usually described in slogans. It is more useful to be specific about which habits transfer and which do not.",
    published: "2026-07-30",
    body: [
      {
        kind: "paragraph",
        text: "Veteran ownership in the trades gets talked about in a register that does nobody any favours. It tends toward the sentimental, and sentiment is not a business argument. There is a real argument to make, but it has to be made in terms of specific transferable habits, and it has to admit what does not transfer.",
      },
      { kind: "heading", text: "Working from a written procedure is normal" },
      {
        kind: "paragraph",
        text: "The military runs on documented procedure. Checklists, standard operating procedures, briefs, and after action review are not paperwork imposed on the real work. They are how the real work is done, and anyone who served has internalised that.",
      },
      {
        kind: "paragraph",
        text: "That matters more than it sounds in a franchise context. The most common friction between a franchisor and an operator is an operator who believes the playbook is a suggestion and their own judgement is better. Sometimes their judgement is better, and a good system has a route for that. But the default posture of following a documented method, and raising a change through the proper channel rather than quietly doing it differently, is a learned habit and not a common one. Someone who has spent years working that way does not experience a playbook as a constraint on their competence.",
      },
      { kind: "heading", text: "Taking untrained people and making them competent" },
      {
        kind: "paragraph",
        text: "The military's core institutional skill is taking people with no relevant experience and making them reliably competent at something technical, to a defined standard, on a schedule. It does this continuously and at scale.",
      },
      {
        kind: "paragraph",
        text: "That is very close to the hardest problem in a trade service business. Skilled technicians are scarce, and the ones who exist are already employed. Any trade business that intends to grow has to be able to bring in apprentices and develop them, which means someone has to be willing to train, to supervise closely, to correct without discouraging, and to hold a line on standards while somebody is still learning. Plenty of excellent technicians are poor at this and dislike doing it. People who came up through a training culture usually understand what developing somebody actually involves, and they are more likely to treat it as part of the job rather than as an interruption to it.",
      },
      { kind: "heading", text: "Maintenance and accountability for equipment" },
      {
        kind: "paragraph",
        text: "A trade business is a fleet business wearing a different name. Vans, tools, meters, ladders, stock on the shelf. It goes wrong in ordinary ways: a van that was not serviced, a meter that was not calibrated, a truck that arrives without the part because nobody restocked it.",
      },
      {
        kind: "paragraph",
        text: "Preventive maintenance, tool accountability, and inventory discipline are ordinary military expectations, done on a schedule and inspected. That habit transfers directly. It shows up as trucks that are stocked, equipment that works, and fewer second trips, which is one of the quiet differences between a trade business that runs and one that lurches.",
      },
      { kind: "heading", text: "Standards held when nobody is checking" },
      {
        kind: "paragraph",
        text: "Return to the fact that the customer cannot inspect the work. Most of what a technician does inside a wall will never be reviewed by anyone. The standard held there is whatever the person holds when unobserved.",
      },
      {
        kind: "paragraph",
        text: "Service culture is built around exactly that idea, and it is one of the few environments most people encounter where the expectation is explicit and constant. It is not a guarantee of character, and there are plenty of careless veterans and meticulous people who never served. But the habit of doing the thing properly because that is the standard, rather than because someone is watching, is directly relevant to a category built on unverifiable work.",
      },
      { kind: "heading", text: "Some technical grounding, depending on the job" },
      {
        kind: "paragraph",
        text: "A fair number of military occupations are trades. Electricians, generator and power production specialists, aircraft and vehicle maintainers, construction engineers, and others spend their service doing technical work under supervision and to a code. That grounding is real, though it is uneven and it is specific to the person. It is worth stating plainly that service alone is not technical training. The occupation is what matters, and civilian licensing has its own requirements regardless.",
      },
      { kind: "heading", text: "What does not transfer" },
      {
        kind: "paragraph",
        text: "The argument is worth less if the limits are not stated, so here they are.",
      },
      {
        kind: "list",
        items: [
          "Discipline is not a licence. Every jurisdiction has its own requirements for who may perform and supervise electrical work, and none of them accept military service in place of that.",
          "Habits are not capital. A business needs to be funded regardless of who is running it, and nothing about service changes that.",
          "Selling is usually the unfamiliar part. Explaining a price to a homeowner standing in their own kitchen, and holding that price, is a skill most service occupations never asked for.",
          "Comfort with hierarchy can cut the wrong way. An operator who waits to be told is as much a problem as one who ignores the playbook. Running a unit means making decisions with nobody above you to confirm them.",
          "Service does not make somebody a good operator. It is a set of habits with real overlap, and the person still has to be right for the work.",
        ],
      },
      {
        kind: "paragraph",
        text: "The useful version of this argument is narrow and specific. Procedure, training, maintenance discipline, and accountability to a standard are habits that map cleanly onto trade service operations, and they are habits military service builds deliberately. That is a genuine overlap and it is worth naming without inflating it into a promise about outcomes, which this article does not make.",
      },
    ],
  },

  {
    slug: "how-a-franchise-brand-system-works",
    title: "How a franchise brand system works",
    eyebrow: "Franchise systems",
    description:
      "A generic explanation of the four parts of a franchise brand system, brand, playbook, technology, and territory, what each one is for, and how they depend on each other.",
    lead: "Franchise systems are usually explained either in legal language or in sales language. Here is the plain mechanical version: four parts, what each is actually for, and where each one fails.",
    published: "2026-07-30",
    body: [
      {
        kind: "paragraph",
        text: "This describes how franchise brand systems work in general. It is not a description of any particular company's programme, it contains no terms, and nothing in it is an offer. It is written because most explanations of franchising are either a legal document or a pitch, and someone deciding whether the structure interests them at all deserves a plain account of the machinery.",
      },
      {
        kind: "paragraph",
        text: "A franchise brand system has four working parts. They are usually listed as features. They are better understood as one thing split four ways: a promise, the method that keeps it, the instruments that measure it, and the boundary it applies within.",
      },
      { kind: "heading", text: "The brand is a promise, and legally it is a licence" },
      {
        kind: "paragraph",
        text: "Practically, a brand is a customer's expectation. Someone who has dealt with a business once expects the second experience to resemble the first, and someone who has only heard the name expects it to resemble what they heard. Consistency is not a nice quality of a brand. It is the entire substance of one.",
      },
      {
        kind: "paragraph",
        text: "Legally, a brand is a set of trademarks owned by an entity. In a franchise system the franchisor licenses the right to operate under those marks to an operator, under conditions. The operator does not buy the brand and does not own it. This is worth understanding early, because it explains the whole structure: every standard and every requirement downstream exists because the licensor stays responsible for what the mark means after other people start using it.",
      },
      {
        kind: "paragraph",
        text: "It also explains the failure mode. A system that licenses its name widely without enforcing the standard behind it degrades the asset it is renting out. Every operator's bad job lands on every other operator. That is why standards enforcement, which reads as bureaucracy from the outside, is the thing protecting the operators who are doing it right.",
      },
      { kind: "heading", text: "The playbook is the method, written down" },
      {
        kind: "paragraph",
        text: "The playbook is the documented answer to how the business is run. In a service business it typically covers how a call is answered and booked, how a job is scoped and quoted, how pricing is arrived at, what a technician is trained to do and how that is verified, how the work is checked, how the customer is followed up, and how the back office runs.",
      },
      {
        kind: "paragraph",
        text: "Its real function is that it converts decisions into procedure. An independent operator makes each of these decisions from scratch, usually while busy, usually more than once because the first answer did not survive contact. A playbook is somebody else having already made those decisions, made them wrong, fixed them, and written down the version that worked. The value is the mistakes already paid for.",
      },
      {
        kind: "paragraph",
        text: "Where it fails: a playbook written once and never revised becomes fiction, and everyone operating under it learns to ignore it. A living system has a route for an operator to say this step does not work in my market, and a means of testing that and changing the document. A playbook nobody may question is a playbook nobody follows.",
      },
      { kind: "heading", text: "The technology is how the standard becomes visible" },
      {
        kind: "paragraph",
        text: "Every service business runs on some stack: scheduling and dispatch, a customer record, quoting, invoicing, and reporting. In a franchise system these are selected and configured at the brand level rather than chosen by each operator.",
      },
      {
        kind: "paragraph",
        text: "There are two reasons, and only one of them is convenience. The convenience reason is that an operator inherits a working configuration instead of spending months evaluating software while trying to run a business, and probably choosing badly because nobody is good at that on their first attempt.",
      },
      {
        kind: "paragraph",
        text: "The substantive reason is that the playbook is unenforceable without instrumentation. A standard about arrival windows is a slogan unless something records when the technician actually arrived. Shared systems are what turn written standards into things that can be observed, discussed, and corrected. That is also the honest reason franchisors want them: it is how the standard behind the mark is verified rather than assumed.",
      },
      {
        kind: "paragraph",
        text: "Where it fails: measurement drifts toward whatever is easy to count. A system that watches only the numbers that are convenient will optimise for those and miss the work quality it actually cares about.",
      },
      { kind: "heading", text: "Territory is the boundary the other three apply within" },
      {
        kind: "paragraph",
        text: "Territory defines the geographic area an operator runs in. Systems define and grant it in different ways, and the specifics vary enormously between them.",
      },
      {
        kind: "paragraph",
        text: "Generically it does three jobs. It stops operators under the same brand competing against each other for the same customer, which is a fight that damages the mark and both parties. It makes marketing coherent, because spend aimed at an area has one business behind it and a caller reaches somebody responsible for that area. And it makes expansion a plan rather than a scramble, because markets are opened in a considered order instead of wherever someone happened to appear.",
      },
      {
        kind: "paragraph",
        text: "Where it fails: territory drawn from a map rather than from how the work is actually performed. Service areas are shaped by drive times, traffic, and where technicians live, and a boundary that ignores those gives an operator an area they cannot actually serve well.",
      },
      { kind: "heading", text: "The four only work together" },
      {
        kind: "paragraph",
        text: "Taken separately each part is unremarkable. A logo, some documentation, a software subscription, and a line on a map. The structure only means anything as a loop.",
      },
      {
        kind: "list",
        items: [
          "The brand is the promise made to a customer who cannot verify the work themselves.",
          "The playbook is the method that produces work good enough for that promise to survive.",
          "The technology is how anyone can tell whether the method is actually being followed.",
          "The territory is the area within which one operator is accountable for all of it.",
        ],
      },
      {
        kind: "paragraph",
        text: "Remove any one and the rest degrade. A brand without a playbook is a name on a truck. A playbook without instrumentation is a document nobody reads. Instrumentation without a territory measures a business with no clear owner. And a territory without a brand is just a service area.",
      },
      { kind: "heading", text: "What a system is not" },
      {
        kind: "paragraph",
        text: "A franchise system is a structure, and structures do not run businesses. Somebody still has to hire well, keep the trucks moving, hold the standard when a job goes badly, and be present. A system can make a competent operator more effective and can make a poor one fail more legibly. It cannot substitute for one.",
      },
      {
        kind: "paragraph",
        text: "This article describes mechanics only. It does not describe any particular system's terms, and it says nothing about what operating under one produces, because that depends entirely on the operator, the market, and the execution.",
      },
    ],
  },
];

/**
 * Every post, from the founding three plus the four content clusters.
 *
 * Order in this array is not display order. ORDERED_INSIGHTS sorts by date, so
 * a post added to the wrong cluster file still lists correctly.
 */
export const INSIGHTS: Insight[] = [
  ...FOUNDING_POSTS,
  ...DISCLOSURE_POSTS,
  ...MONEY_POSTS,
  ...CATEGORY_POSTS,
  ...OPERATING_POSTS,
];

/**
 * Slugs must be unique: two posts sharing one would make the second
 * unreachable, and generateStaticParams would silently emit a duplicate route.
 * Cheap to check at module load, and it fails the build rather than shipping.
 */
{
  const seen = new Set<string>();
  for (const insight of INSIGHTS) {
    if (seen.has(insight.slug)) {
      throw new Error(`Duplicate insight slug: ${insight.slug}`);
    }
    seen.add(insight.slug);
  }
}

export const INSIGHTS_BY_SLUG = new Map(
  INSIGHTS.map((insight) => [insight.slug, insight]),
);

export function getInsight(slug: string): Insight | undefined {
  return INSIGHTS_BY_SLUG.get(slug);
}

/**
 * Newest first. Sorted rather than relying on array order so a post added in
 * the wrong place in the file still lists correctly.
 */
export const ORDERED_INSIGHTS = [...INSIGHTS].sort((a, b) =>
  b.published.localeCompare(a.published),
);

/**
 * Formats a publication date for display.
 *
 * Explicit UTC and an explicit locale. Left to the runtime default, this
 * renders one string on the build machine and potentially another in a
 * different timezone, which produces a hydration mismatch and, worse, a date
 * that is silently off by one for some readers.
 */
export function formatPublished(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
