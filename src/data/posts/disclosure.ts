import type { Insight } from "@/data/insights";

/**
 * THE DISCLOSURE CLUSTER
 * ======================
 *
 * Four posts about the document that governs a franchise decision.
 *
 * SOURCING NOTE, AND IT IS BINDING ON THIS FILE ABOVE ALL OTHERS
 * -------------------------------------------------------------
 * This is where a reader most expects numbers, and it is where the numbers in
 * this category are least trustworthy. Two rules:
 *
 *   1. A figure appears only with a primary source a reader can open. In this
 *      file that means the FTC's Franchise Rule and its published guidance, or
 *      the Small Business Administration. The fourteen calendar day rule below
 *      is the only figure printed anywhere in this cluster, and it is stated in
 *      the Franchise Rule itself.
 *
 *   2. FRANCHISE SUCCESS AND FAILURE RATES ARE NAMED AS UNVERIFIABLE, NOT
 *      REPEATED. The "ninety five percent of franchises succeed" claim and its
 *      mirror image circulate constantly and neither traces to a primary
 *      source. The SBA has never published a franchise specific survival rate,
 *      and the figure most often miscited to it is a general small business
 *      survival statistic that says nothing about franchising. Saying that
 *      plainly is more useful to a prospect than either number, and it is the
 *      only defensible thing to publish.
 *
 * No Craftline fee, royalty, territory, or selection criterion appears in this
 * file. Every sentence describes the framework, which is the test stated in
 * src/data/franchising.ts.
 */
export const DISCLOSURE_POSTS: Insight[] = [
  {
    slug: "what-a-franchise-disclosure-document-is",
    title: "What a Franchise Disclosure Document is, and how to read one",
    eyebrow: "Disclosure",
    description:
      "The document a franchisor must give you before it can sell you a franchise, what is inside it, and how to work through it without a lawyer standing over your shoulder.",
    lead: "It is long, it is not written to persuade you, and it is the single most useful thing you will read while deciding. Most people evaluating a franchise have never seen one.",
    published: "2026-08-04",
    body: [
      {
        kind: "paragraph",
        text: [
          "A Franchise Disclosure Document is a standardised document that a franchisor is required to deliver to you before it can offer you a franchise. The requirement comes from the Federal Trade Commission's Franchise Rule, and the FTC publishes its own ",
          {
            text: "guidance on the disclosure document for prospective franchisees",
            href: "https://www.ftc.gov/business-guidance/resources/consumers-guide-buying-franchise",
            external: true,
          },
          ". Several states add their own registration requirements on top of it.",
        ],
      },
      {
        kind: "paragraph",
        text: "It is not marketing. That is the thing to understand before you open one. A brochure is written to make you want the business. A disclosure document is written because a regulator requires it, in a format the regulator specifies, and it contains the things a franchisor would generally prefer you did not dwell on.",
      },
      { kind: "heading", text: "Why it is standardised" },
      {
        kind: "paragraph",
        text: "Every disclosure document in the country is organised into the same numbered items in the same order. That structure is the entire point. It means you can put two franchise systems side by side and compare the same item in each, rather than comparing two sales presentations that each emphasise whatever flatters them most.",
      },
      {
        kind: "paragraph",
        text: [
          "That comparability is what gives you a position. A franchisor can decline to discuss something in a conversation. It cannot decline to disclose it in the document. If a system's answer to a hard question is evasive in person and clear in item nine, you have learned something about both the system and the person you were talking to. The ",
          {
            text: "vocabulary you need to read those items",
            href: "/franchising#vocabulary",
          },
          " is worth having before you start.",
        ],
      },
      { kind: "heading", text: "The waiting period is yours" },
      {
        kind: "paragraph",
        text: "The Franchise Rule requires that you receive the document at least fourteen calendar days before you sign anything or pay anything. Some states require more. That period exists for your benefit and nobody else's.",
      },
      {
        kind: "paragraph",
        text: "Use it. Read the whole document, call the franchisees listed in it, and take it to a franchise attorney and an accountant who are independent of the franchisor. A franchisor applying pressure inside that window has told you something about how it will behave once you are inside the system.",
      },
      { kind: "heading", text: "What it does not do" },
      {
        kind: "paragraph",
        text: "It does not promise that a business will succeed. A franchisor is not required to make any projection of financial performance, and many do not. Where one is made it must appear in a specific item of the document and be substantiated on request.",
      },
      {
        kind: "paragraph",
        text: [
          "That last point has a consequence people miss. A figure quoted to you anywhere else, in a conversation, an email, or an advertisement, is not a disclosure. It carries none of the substantiation requirement. The correct response to a number that does not appear in the document is to ask why it does not. There is more on ",
          {
            text: "why no honest franchisor quotes a cost before disclosure",
            href: "/insights/what-it-costs-to-buy-a-franchise",
          },
          ".",
        ],
      },
      { kind: "heading", text: "What this does not establish" },
      {
        kind: "paragraph",
        text: [
          "Nothing here is legal advice and nothing here is specific to any one system. Craftline Brands has not issued a Franchise Disclosure Document, so there is nothing to disclose and nothing being offered. What this page describes is the framework every franchisor operates under. The ",
          { text: "next step is the items themselves", href: "/insights/inside-an-fdd-which-items-matter" },
          ", or the ",
          { text: "franchising section", href: "/franchising#fdd" },
          " for the shorter version.",
        ],
      },
    ],
  },

  {
    slug: "inside-an-fdd-which-items-matter",
    title: "Inside an FDD: the items a first-time buyer should read first",
    eyebrow: "Disclosure",
    description:
      "A disclosure document is long and uniformly formatted, which makes everything look equally important. It is not. Here is a reading order.",
    lead: "Nobody reads a disclosure document front to back on the first pass. Read it in the order that surfaces problems fastest.",
    published: "2026-08-03",
    body: [
      {
        kind: "paragraph",
        text: [
          "A Franchise Disclosure Document runs to hundreds of pages and every item is formatted identically, which has the accidental effect of making everything look equally weighted. It is not. Some items are administrative and some will decide whether you sign. If you have not read ",
          { text: "what the document is and why it exists", href: "/insights/what-a-franchise-disclosure-document-is" },
          " yet, start there.",
        ],
      },
      { kind: "heading", text: "Start with the litigation and bankruptcy history" },
      {
        kind: "paragraph",
        text: "These items disclose the franchisor's litigation history and any bankruptcy involving the company or its principals. They are near the front and they are the fastest way to find a reason to stop.",
      },
      {
        kind: "paragraph",
        text: "Litigation is not automatically disqualifying. A large system will have some. What matters is the pattern: who is suing whom, how often, and about what. A franchisor repeatedly in dispute with its own franchisees over the same issue has told you what that issue is going to be for you.",
      },
      { kind: "heading", text: "Then the franchisee list" },
      {
        kind: "paragraph",
        text: "The document contains a list of current franchisees and, separately, of franchisees who have left the system in the past year, with contact details.",
      },
      {
        kind: "paragraph",
        text: "The list of people who left is the most valuable page in the document. Call them. A franchisor cannot coach those conversations and cannot select who is on the list. If those numbers are hard to reach, or the list is unusually short relative to the size of the system, that is itself information.",
      },
      { kind: "heading", text: "Then the obligations, both directions" },
      {
        kind: "paragraph",
        text: [
          "One item sets out what the franchisor must do for you and another sets out what you must do. Read them together and in that order, because the pairing is where the relationship actually lives. ",
          { text: "What a franchisor owes an operator", href: "/insights/what-a-franchisor-owes-an-operator" },
          " goes into this in more detail.",
        ],
      },
      {
        kind: "paragraph",
        text: "Pay attention to the difference between what the franchisor will do and what it may do. Discretionary support is not support. A system that reserves the right to provide training is describing something other than a commitment to provide it.",
      },
      { kind: "heading", text: "Then fees, investment, and territory" },
      {
        kind: "paragraph",
        text: [
          "The initial fee, the ongoing fees, the estimated initial investment, and the territory grant each have their own item. These are the numbers everybody wants first and they are more useful once you know who you would be dealing with. ",
          { text: "How a royalty is calculated", href: "/insights/what-a-franchise-royalty-is" },
          " and ",
          { text: "what territory actually means", href: "/insights/what-franchise-territory-means" },
          " are both worth understanding before you read those items.",
        ],
      },
      { kind: "heading", text: "Finally the financial statements and the agreement" },
      {
        kind: "paragraph",
        text: "Audited financial statements for the franchisor are attached, and so is the franchise agreement itself. The agreement is the document that actually governs. Everything else in the disclosure describes it.",
      },
      {
        kind: "paragraph",
        text: "This is the point at which an accountant and a franchise attorney earn their fee. The financial statements tell you whether the franchisor can fund what it has promised. The agreement tells you what happens when things go wrong, which is the part nobody reads and everybody eventually needs.",
      },
      { kind: "heading", text: "What this does not establish" },
      {
        kind: "paragraph",
        text: [
          "This is a reading order, not legal advice, and no reading order substitutes for professional review. Craftline has not issued a disclosure document. The ",
          { text: "wider process from inquiry to opening", href: "/franchising#process" },
          " sets out where disclosure sits in the sequence.",
        ],
      },
    ],
  },

  {
    slug: "where-franchise-fees-are-disclosed",
    title: "Where every fee in a franchise system is disclosed",
    eyebrow: "Disclosure",
    description:
      "Franchise systems carry more than one fee, and they are disclosed in specific places. This is where to look, and why published averages are not worth much.",
    lead: "Search for franchise fees and you will find a lot of averages. Almost none of them are sourced, and none of them are the number you would pay.",
    published: "2026-08-02",
    body: [
      {
        kind: "paragraph",
        text: "There is more than one fee in a franchise system, and they behave differently. Some are one time, some are continuous, some are conditional on events that may never happen. All of them are disclosed, and all of them are disclosed in a specific place.",
      },
      { kind: "heading", text: "The kinds of fee, and what each one is for" },
      {
        kind: "list",
        items: [
          "An initial franchise fee, paid once on joining, in exchange for the right to operate under the brand and for whatever initial training and setup the system provides.",
          "An ongoing royalty, normally a percentage of sales, in exchange for the continued licence and the continued support behind it.",
          "A marketing or brand fund contribution, usually also a percentage of sales, pooled and spent on advertising at the brand level rather than by you.",
          "Technology or system fees, covering the software stack the brand requires you to run on.",
          "Transfer and renewal fees, conditional, and payable when you sell the business or when the term ends.",
        ],
      },
      {
        kind: "paragraph",
        text: [
          "The royalty is the one that compounds and the one most worth understanding in detail. ",
          { text: "What a royalty actually is and how it is calculated", href: "/insights/what-a-franchise-royalty-is" },
          " covers the mechanics, including why the basis it is calculated on matters more than the percentage.",
        ],
      },
      { kind: "heading", text: "Where each one appears" },
      {
        kind: "paragraph",
        text: "The initial fee has its own item in the disclosure document. Every other recurring and conditional fee has a separate item, presented as a table. The estimated initial investment, which covers everything you would spend to open and operate for an initial period, has a third.",
      },
      {
        kind: "paragraph",
        text: [
          "Those three items together are the complete picture, and no summary anywhere else is a substitute for them. ",
          { text: "The reading order for the rest of the document", href: "/insights/inside-an-fdd-which-items-matter" },
          " puts them deliberately after the litigation history and the franchisee list.",
        ],
      },
      { kind: "heading", text: "Why published averages are close to useless" },
      {
        kind: "paragraph",
        text: "Search for a typical royalty rate and you will find figures quoted confidently across trade sites, usually without a source, and usually copied from each other. Even where a range is real, it is an average across restaurant, retail, service, and home based systems that have almost nothing in common.",
      },
      {
        kind: "paragraph",
        text: "An average also cannot tell you what the fee buys. Two systems charging the same rate can differ completely in what the franchisor is obliged to deliver in return, and that obligation is disclosed in a different item entirely. The rate on its own is not a comparison.",
      },
      {
        kind: "paragraph",
        text: "The useful question is not what the industry charges. It is what this system charges, what it is calculated on, what it obliges the franchisor to provide, and what happens to it over the term. All four are in the document.",
      },
      { kind: "heading", text: "What this does not establish" },
      {
        kind: "paragraph",
        text: [
          "No figure appears on this page and none can. Craftline has not issued a Franchise Disclosure Document, so it has no disclosed fees, and stating any number before disclosure would be exactly the practice this page is warning about. See ",
          { text: "why cost cannot be quoted before disclosure", href: "/insights/what-it-costs-to-buy-a-franchise" },
          ".",
        ],
      },
    ],
  },

  {
    slug: "how-to-check-a-franchisor",
    title: "How to check a franchisor before you sign",
    eyebrow: "Due diligence",
    description:
      "Practical due diligence on a franchise system, including how to handle the success and failure rate claims that circulate in this category.",
    lead: "Most of the work of evaluating a franchise is not reading the sales material. It is checking whether the sales material is true.",
    published: "2026-08-01",
    body: [
      {
        kind: "paragraph",
        text: [
          "Everything below is against a franchisor's short term interest. It is here anyway, for a straightforward reason: a franchise system gains nothing from operators who joined without understanding what they joined. The ",
          { text: "shorter version sits on the franchising page", href: "/franchising#diligence" },
          ".",
        ],
      },
      { kind: "heading", text: "Call the former franchisees" },
      {
        kind: "paragraph",
        text: "The disclosure document lists franchisees who left the system in the past year with contact details. Those calls are the highest value hours you will spend.",
      },
      {
        kind: "paragraph",
        text: "Ask what the franchisor did when the business had a bad quarter. Ask what support looked like in practice rather than on paper. Ask what they would need to see changed before they would join again. People who have left have no incentive to sell you anything and usually a strong incentive to be straight with you.",
      },
      { kind: "heading", text: "The success and failure rate claims, handled honestly" },
      {
        kind: "paragraph",
        text: "You will encounter statistics about how franchises perform against independent businesses. The most common is a claim that some very high percentage of franchises succeed, often attributed to the Small Business Administration. The mirror version, a dramatic failure rate, circulates just as widely.",
      },
      {
        kind: "paragraph",
        text: [
          "Neither is verifiable, and this page will not repeat either. The SBA does not publish a franchise specific survival rate. What it does publish is general small business survival data through the ",
          {
            text: "Office of Advocacy's business survival research",
            href: "https://advocacy.sba.gov/",
            external: true,
          },
          ", which does not separate franchised from independent businesses and therefore cannot support a claim about franchising at all.",
        ],
      },
      {
        kind: "paragraph",
        text: "Treat any franchise performance statistic the same way. Ask for the primary source, open it, and check that it says what the person quoting it says it says. A figure that cannot survive that is not evidence, and a franchisor leaning on one is telling you something about the rest of its claims.",
      },
      { kind: "heading", text: "Read the agreement for the ending, not the beginning" },
      {
        kind: "paragraph",
        text: "The franchise agreement is attached to the disclosure document and it is the document that governs. Most people read it for what they get. Read it for how it ends.",
      },
      {
        kind: "list",
        items: [
          "What the franchisor can require of you, and on what notice.",
          "What counts as a breach, and what cure period you get.",
          "What happens to the business if the agreement terminates.",
          "Whether you can sell, to whom, and on whose approval.",
          "What you are restricted from doing afterwards, and for how long.",
        ],
      },
      { kind: "heading", text: "Take it to people who work for you" },
      {
        kind: "paragraph",
        text: [
          "A franchise attorney and an accountant, both independent of the franchisor, and both engaged by you. This is not a formality. The disclosure document exists to be examined, and the ",
          { text: "waiting period before you can sign anything", href: "/insights/what-a-franchise-disclosure-document-is" },
          " exists so that examination can happen.",
        ],
      },
      { kind: "heading", text: "What this does not establish" },
      {
        kind: "paragraph",
        text: [
          "This is general guidance on evaluating any franchise system and it is not legal or financial advice. It makes no claim about Craftline, which has not issued a disclosure document and has nothing to evaluate yet. ",
          { text: "What Craftline looks for in an operator", href: "/franchising#operators" },
          " is the closest thing to an answer on this site.",
        ],
      },
    ],
  },
];
