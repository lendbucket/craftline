import type { Insight } from "@/data/insights";

/**
 * THE MONEY CLUSTER
 * =================
 *
 * Three posts about what a franchise costs and how the money works.
 *
 * THIS IS THE HIGHEST RISK FILE ON THE PROPERTY. Every post here targets a
 * search intent that wants a number, and this company cannot supply one.
 *
 *   - NO FIGURE OF ANY KIND. No fee, no royalty rate, no capital requirement,
 *     no range, no example, and no "typically" or "usually" followed by a
 *     number. Not for Craftline and not as an industry average. An industry
 *     average would also breach the sourcing rule, because the ones in
 *     circulation are unsourced.
 *
 *   - NO FINANCIAL PERFORMANCE REPRESENTATION, including comparative forms.
 *     "Costs less to run" and "recovers faster" are both representations.
 *
 *   - The cost post in particular is a WHY-DISCLOSURE-ONLY explainer. It
 *     answers the question by explaining why the question cannot be answered
 *     outside a disclosure document, and it stops there. That is the whole
 *     scope and it is not to be widened.
 *
 * Explaining the mechanism is permitted and is the point. A reader should leave
 * knowing how a royalty is structured and where the number lives, which is more
 * durable than a figure would have been.
 */
export const MONEY_POSTS: Insight[] = [
  {
    slug: "what-a-franchise-royalty-is",
    title: "What a franchise royalty is, and how it is calculated",
    eyebrow: "Fees",
    description:
      "The ongoing payment at the centre of every franchise relationship: what it buys, what it is calculated on, and why the basis matters more than the percentage.",
    lead: "The royalty is the fee that compounds. Understanding how it is structured matters more than knowing the rate.",
    published: "2026-07-31",
    body: [
      {
        kind: "paragraph",
        text: "A royalty is an ongoing payment from a franchisee to a franchisor, in exchange for the continued right to operate under the brand and for the support that comes with it. It is normally calculated as a percentage of sales and paid weekly or monthly.",
      },
      {
        kind: "paragraph",
        text: "It is the economic centre of the relationship. The initial fee is paid once. The royalty is paid for as long as the agreement runs, which means it is the thing that has to be worth paying in year six as well as year one.",
      },
      { kind: "heading", text: "The basis matters more than the rate" },
      {
        kind: "paragraph",
        text: "Two systems quoting the same percentage can produce very different obligations, because the percentage is applied to something, and what that something is varies.",
      },
      {
        kind: "list",
        items: [
          "Gross sales is the most common basis. Everything the business invoices, before any deduction.",
          "Net sales, where defined, deducts specific items such as refunds or sales tax. What is deductible is defined in the agreement, not by convention.",
          "A fixed periodic fee, less common in service franchising, which does not move with volume at all.",
          "A minimum royalty, which sets a floor regardless of what the business actually invoices.",
        ],
      },
      {
        kind: "paragraph",
        text: "That last one is the item most often missed. A minimum converts a variable cost into a fixed one during exactly the periods when a business can least carry it. Whether a system has one, and what it is, is disclosed.",
      },
      { kind: "heading", text: "What the royalty is supposed to buy" },
      {
        kind: "paragraph",
        text: [
          "A royalty is not rent on a logo. It is payment for the continued obligations the franchisor carries, and those obligations are disclosed in their own item of the disclosure document. ",
          { text: "What a franchisor owes an operator", href: "/insights/what-a-franchisor-owes-an-operator" },
          " sets out what that ought to include.",
        ],
      },
      {
        kind: "paragraph",
        text: "The test is not whether the rate is low. It is whether what the franchisor is obliged to do in return is worth it, and whether that obligation is written as a requirement rather than as a discretion. A cheap royalty attached to no commitment is not cheap.",
      },
      { kind: "heading", text: "The marketing fund is a separate question" },
      {
        kind: "paragraph",
        text: [
          "Most systems also collect a marketing or brand fund contribution, separately from the royalty and usually also as a percentage of sales. It is pooled and spent at the brand level. Ask what it may be spent on, whether the franchisor contributes to it, and whether it is accounted for. All of that is disclosed alongside ",
          { text: "the rest of the fee structure", href: "/insights/where-franchise-fees-are-disclosed" },
          ".",
        ],
      },
      { kind: "heading", text: "What this does not establish" },
      {
        kind: "paragraph",
        text: [
          "No rate appears here, for any system including this one. Craftline has not issued a Franchise Disclosure Document and therefore has no disclosed royalty. The mechanics above describe how franchising works generally, which is the ",
          { text: "same standard the whole franchising section is written to", href: "/franchising#vocabulary" },
          ".",
        ],
      },
    ],
  },

  {
    slug: "what-it-costs-to-buy-a-franchise",
    title: "What it costs to buy a franchise, and why nobody can tell you first",
    eyebrow: "Fees",
    description:
      "Cost is the first question everyone asks and the one no franchisor can answer before delivering a disclosure document. This explains the rule and why it protects you.",
    lead: "If a franchisor gives you a number before it gives you a disclosure document, the number is not the problem. The sequence is.",
    published: "2026-07-30",
    body: [
      {
        kind: "paragraph",
        text: "Cost is the first thing anybody wants to know. It is also the thing a franchisor cannot properly answer in a first conversation, and the reason is worth understanding, because it tells you how to read every franchisor you talk to.",
      },
      { kind: "heading", text: "The rule, plainly" },
      {
        kind: "paragraph",
        text: [
          "Under the FTC's Franchise Rule, a franchisor must deliver a Franchise Disclosure Document before it can sell you a franchise, and the fees and the estimated initial investment are disclosed inside it in a prescribed format. The FTC sets out the framework in its ",
          {
            text: "guidance for prospective franchise buyers",
            href: "https://www.ftc.gov/business-guidance/resources/consumers-guide-buying-franchise",
            external: true,
          },
          ".",
        ],
      },
      {
        kind: "paragraph",
        text: "The format is the point. Costs disclosed in the document are itemised, defined, and presented the same way by every franchisor in the country, which is what makes two systems comparable. A number given to you over the phone has none of that structure behind it.",
      },
      { kind: "heading", text: "Why this protects you rather than the franchisor" },
      {
        kind: "paragraph",
        text: "A single headline figure is the easiest thing in this category to mislead with, because almost every version of the question is ambiguous. Does it include working capital. Does it include the period before the business is covering its own costs. Does it include the things the brand requires you to buy from a specified supplier.",
      },
      {
        kind: "paragraph",
        text: "The disclosure format forces those apart into separate line items with defined assumptions. That is harder to read than one number and considerably more honest, and it is the only version you can hold a franchisor to.",
      },
      { kind: "heading", text: "What to do with a franchisor who quotes anyway" },
      {
        kind: "paragraph",
        text: "Some will. The useful response is not outrage, it is a question: ask whether that figure appears in their disclosure document, and if so, in which item.",
      },
      {
        kind: "paragraph",
        text: [
          "If it does, you can check it. If it does not, you have learned that this franchisor is comfortable putting numbers in front of prospects that carry no substantiation requirement, which is worth knowing before you are inside the system. ",
          { text: "The rest of the due diligence follows the same logic", href: "/insights/how-to-check-a-franchisor" },
          ".",
        ],
      },
      { kind: "heading", text: "What this does not establish" },
      {
        kind: "paragraph",
        text: [
          "This page states no cost, no range, and no example, for Craftline or for any other system, deliberately. Craftline has not issued a Franchise Disclosure Document, so there is nothing to disclose and nothing being offered. When there is, it will be in the document and in the format the rule requires. ",
          { text: "The process from inquiry to disclosure", href: "/franchising#process" },
          " describes the sequence.",
        ],
      },
    ],
  },

  {
    slug: "buying-a-franchise-with-limited-capital",
    title: "Buying a franchise without much capital, honestly",
    eyebrow: "Fees",
    description:
      "The financing routes that exist, the ones that are oversold, and the questions to ask before treating a low entry cost as an advantage.",
    lead: "There is a lot of content promising a franchise with no money down. Most of it is describing debt.",
    published: "2026-07-29",
    body: [
      {
        kind: "paragraph",
        text: "Search for buying a franchise with no money and the results are confident. They are mostly describing borrowing, which is a legitimate route and a different thing from not needing capital.",
      },
      { kind: "heading", text: "What actually exists" },
      {
        kind: "list",
        items: [
          "Commercial lending, including loans guaranteed under Small Business Administration programmes, which reduce a lender's risk rather than removing your obligation.",
          "Franchisor financing or deferral, where a system finances part of its own initial fee. It exists and it is disclosed.",
          "Equipment and vehicle financing, secured against the asset rather than the business.",
          "Partnership, where somebody else supplies capital and you supply the operating work.",
        ],
      },
      {
        kind: "paragraph",
        text: [
          "Every one of these is debt or dilution. Both are ordinary ways to start a business and neither is free. The SBA publishes ",
          {
            text: "its own guidance on the loan programmes",
            href: "https://www.sba.gov/funding-programs/loans",
            external: true,
          },
          " and is the primary source worth reading before a broker's summary of it.",
        ],
      },
      { kind: "heading", text: "The question nobody asks early enough" },
      {
        kind: "paragraph",
        text: "How long can the business run before it covers its own costs, and can you personally survive that period. That is a working capital question rather than an entry cost question, and it is where undercapitalised businesses fail.",
      },
      {
        kind: "paragraph",
        text: [
          "A low entry cost that leaves nothing behind it is worse than a higher one that does not. The estimated initial investment item in a disclosure document is written to surface exactly this, which is one reason ",
          { text: "the fee items are worth reading properly", href: "/insights/where-franchise-fees-are-disclosed" },
          ".",
        ],
      },
      { kind: "heading", text: "Why a cheap system is not automatically a good one" },
      {
        kind: "paragraph",
        text: "Entry cost is the easiest thing to compare and among the least informative. What a system obliges the franchisor to provide, what the royalty is calculated on, and what happens when the agreement ends will all matter more over a term than the number on the way in.",
      },
      { kind: "heading", text: "What this does not establish" },
      {
        kind: "paragraph",
        text: [
          "No figure, requirement, or threshold appears here, and none is implied. Craftline states no capital requirement anywhere on this site because it has issued no disclosure document, and a stated threshold before disclosure would be a claim about who will be accepted. ",
          { text: "What Craftline looks for is stated in traits instead", href: "/franchising#operators" },
          ".",
        ],
      },
    ],
  },
];
