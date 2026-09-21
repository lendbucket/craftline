import type { Insight } from "@/data/insights";

/**
 * THE AGREEMENT CLUSTER
 * =====================
 *
 * The contract itself, as distinct from the disclosure document that describes
 * it. The existing eighteen cover what the FDD is, what is inside it, and what
 * a franchisor owes. None of them covers the document a person actually signs.
 *
 * EVERY LEGAL CLAIM IN THIS FILE WAS VERIFIED AGAINST A PRIMARY SOURCE BEFORE
 * IT WAS WRITTEN, and the citation is in the rendered text rather than in a
 * comment, so a reader can check it rather than take it.
 *
 *   14 calendar days before signing or payment      16 CFR 436.2(a)
 *   7 calendar days on a unilateral material change 16 CFR 436.2(b)
 *   the three part definition of a franchise        16 CFR 436.1
 *   Item 19 is permitted and not required           FTC, Consumer's Guide
 *
 * The 7 day rule was the one worth the effort. It is in the regulation, it is
 * the single most useful thing a prospect can know about the days before a
 * signature, and almost nothing ranking for these terms mentions it.
 *
 * WHAT IS DELIBERATELY GENERALISED RATHER THAN ASSERTED. How many states have
 * franchise relationship statutes, and what those statutes require, is not
 * stated as a number anywhere here. The count varies with how registration,
 * filing and relationship laws are counted, no primary source gives one
 * figure, and a number nobody can trace is a fabrication whether or not it is
 * close. The articles say that state law governs and that the answer is a
 * question for a lawyer in that state, which is both true and more useful.
 *
 * The rules in src/data/insights.ts apply in full: no unsourced statistics, no
 * financial performance representations, no offer, no geography.
 */

export const AGREEMENT_POSTS: Insight[] = [
  {
    slug: "what-is-in-a-franchise-agreement",
    title: "Franchise agreement: what is actually in one",
    eyebrow: "The agreement",
    description:
      "Franchise agreement: what each part of the contract does, the seven day rule almost nobody mentions, and where the disclosure stops and the obligation starts.",
    lead: "The disclosure document is what you are shown. The agreement is what you sign. They are two different documents doing two different jobs, and only one of them binds you.",
    published: "2026-09-20",
    body: [
      {
        kind: "paragraph",
        text: "A franchise agreement is the contract between a franchisor and a franchisee. It grants the right to operate under the brand, sets out what each side must do, and defines how the relationship ends. Everything else in franchising is either a description of this document or a consequence of it.",
      },
      {
        kind: "paragraph",
        text: [
          "It arrives attached to the disclosure document, usually as an exhibit. ",
          {
            text: "What a Franchise Disclosure Document is",
            href: "/insights/what-a-franchise-disclosure-document-is",
          },
          " covers the document that describes the deal. This one is about the document that is the deal.",
        ],
      },

      { kind: "heading", text: "The disclosure describes, the agreement binds" },
      {
        kind: "paragraph",
        text: [
          "Under the federal Franchise Rule, a franchisor must give a prospective franchisee the disclosure document at least ",
          {
            text: "14 calendar days",
            href: "https://www.law.cornell.edu/cfr/text/16/436.2",
            external: true,
          },
          " before that person signs a binding agreement or makes any payment. The Federal Trade Commission puts it plainly in its own guide for buyers: ",
          {
            text: "you must receive the document at least 14 days before you are asked to sign any contract or pay any money",
            href: "https://www.ftc.gov/business-guidance/resources/consumers-guide-buying-franchise",
            external: true,
          },
          ".",
        ],
      },
      {
        kind: "paragraph",
        text: "That waiting period exists so the two documents can be read against each other. The disclosure explains in plain language what the agreement does in legal language, and where the two appear to differ, the agreement is the one that governs. Reading only the disclosure is reading a summary of a contract somebody else wrote.",
      },

      { kind: "heading", text: "What the document is made of" },
      {
        kind: "paragraph",
        text: "Agreements vary in length and in temperament, and the parts are broadly consistent across systems. Knowing what each part is for makes a two hundred page document navigable rather than intimidating.",
      },
      {
        kind: "list",
        items: [
          "The grant. What you are licensed to do, under which marks, and for how long. This is short and it is the foundation of everything below it.",
          "Term and renewal. How long the agreement runs, and on what conditions it can be renewed. Renewal is usually conditional rather than automatic.",
          "Territory. What area you get and what the franchisor may still do inside it.",
          "Fees. The initial fee, the royalty, the marketing contribution, and any technology or transfer charges.",
          "Your obligations. Standards, training, reporting, systems you must use, and how the franchisor verifies all of it.",
          "The franchisor's obligations. The shortest section in many agreements, and the one worth reading hardest.",
          "Transfer. Whether you can sell, to whom, on what conditions, and what the franchisor takes when you do.",
          "Default and termination. What counts as a breach, what can be cured, and what ends the agreement outright.",
          "Post term covenants. What you may not do after it is over, and for how long.",
          "Dispute resolution. Arbitration or court, which state's law applies, and where any proceeding happens.",
          "Personal guarantee. Usually a separate signature page, and the one that reaches past the company into the individual.",
        ],
      },
      {
        kind: "paragraph",
        text: "The order varies and the weighting does not. Roughly a third of the document describes what you must do, a short section describes what the franchisor must do, and the remainder describes what happens when the first part is not met. That distribution is the shape of the deal, before a single clause is read.",
      },

      { kind: "heading", text: "The seven day rule, which is rarely mentioned" },
      {
        kind: "paragraph",
        text: [
          "The 14 day period is well known. The second rule in the same section of the regulation is not, and it matters more in the final week before a signature. If the franchisor ",
          {
            text: "unilaterally and materially alters the terms",
            href: "https://www.law.cornell.edu/cfr/text/16/436.2",
            external: true,
          },
          " of the agreement, it must furnish the revised agreement at least seven calendar days before the prospective franchisee signs it.",
        ],
      },
      {
        kind: "paragraph",
        text: "There is a carve out, and it is the part to understand. The seven day period does not apply to changes the prospective franchisee asked for. Something negotiated at your request can be papered and signed without a fresh wait; something the franchisor changed on its own cannot. If a revised agreement appears late and nobody can say which of those it was, that is the question to ask before signing.",
      },

      { kind: "heading", text: "What makes it a franchise at all" },
      {
        kind: "paragraph",
        text: [
          "The regulation does not care what a contract is called. A relationship is a franchise when ",
          {
            text: "three elements",
            href: "https://www.law.cornell.edu/cfr/text/16/436.1",
            external: true,
          },
          " are present together: the right to operate a business identified with the franchisor's trademark, significant control over or assistance with the method of operation, and a required payment. All three, or it is something else. That test is why a document titled a licence can still be a franchise, and why the label on the cover page is the least informative thing about it.",
        ],
      },

      { kind: "heading", text: "Read it for the ending" },
      {
        kind: "paragraph",
        text: [
          "The opening sections describe a relationship working. The closing sections describe it failing, and they are where the real asymmetries are written down. ",
          {
            text: "How to check a franchisor before you sign",
            href: "/insights/how-to-check-a-franchisor",
          },
          " makes the same point as a matter of diligence. ",
          {
            text: "What a franchisor owes an operator",
            href: "/insights/what-a-franchisor-owes-an-operator",
          },
          " is about telling a commitment from a discretion, which is the distinction the obligations sections turn on.",
        ],
      },
      {
        kind: "paragraph",
        text: [
          "Two sections deserve their own reading rather than a skim. ",
          {
            text: "Territory",
            href: "/insights/what-franchise-territory-means",
          },
          " defines the boundary everything else applies within, and ",
          {
            text: "the royalty",
            href: "/insights/what-a-franchise-royalty-is",
          },
          " is the obligation that compounds for as long as the agreement runs.",
        ],
      },

      { kind: "heading", text: "What this does not establish" },
      {
        kind: "paragraph",
        text: [
          "This describes how franchise agreements are structured generally. It is not legal advice, it does not describe any particular agreement, and it is not a substitute for having one read by a lawyer who acts for you. Craftline has issued no Franchise Disclosure Document and is not offering anything. ",
          {
            text: "How franchising works",
            href: "/franchising",
          },
          " sets out the programme without offering one.",
        ],
      },
    ],
  },

  {
    slug: "how-a-franchise-agreement-ends",
    title: "Franchise termination: how an agreement ends",
    eyebrow: "The agreement",
    description:
      "Franchise termination is governed by the contract and by state law, not by the federal rule. The three ways an agreement ends, and what survives it.",
    lead: "Most writing about franchising covers the beginning. The ending is where the agreement was drafted most carefully, and it is the part a prospect reads last if at all.",
    published: "2026-09-19",
    body: [
      {
        kind: "paragraph",
        text: "A franchise agreement can end in three ways: the term runs out, the franchisor terminates it, or the franchisee gets out. Those are not variations on one event. They have different triggers, different consequences, and different odds of happening.",
      },

      {
        kind: "heading",
        text: "The federal rule stops at the signature",
      },
      {
        kind: "paragraph",
        text: [
          "The Franchise Rule is a disclosure rule. It governs what a prospective franchisee must be told before signing, including the ",
          {
            text: "14 calendar day waiting period",
            href: "https://www.law.cornell.edu/cfr/text/16/436.2",
            external: true,
          },
          " between receiving the disclosure document and signing anything. It does not govern the relationship afterwards.",
        ],
      },
      {
        kind: "paragraph",
        text: "So there is no federal answer to whether a termination was fair. What governs is the agreement itself, and then whatever statute the relevant state has about franchise relationships. Some states have one and some do not, what those statutes require varies, and the honest answer to which applies to you is that it depends on where the business operates and is a question for a lawyer admitted there. Anyone who gives you a national answer to that question is guessing.",
      },
      {
        kind: "paragraph",
        text: "Which puts the weight back on the contract, and the contract was drafted by one side. That is not a complaint about franchising; it is true of most commercial agreements offered on standard terms. It is a reason to read the ending sections before signing rather than after, because afterwards they are the only thing there is.",
      },

      { kind: "heading", text: "Expiry is not termination" },
      {
        kind: "paragraph",
        text: "An agreement that reaches the end of its term and is not renewed has ended without anybody having breached anything. This is the most common ending and the least discussed, because there is no dispute in it.",
      },
      {
        kind: "paragraph",
        text: "Renewal is normally conditional. Typical conditions include being in good standing, signing the then current form of agreement rather than the one originally signed, bringing the premises or the equipment up to current standards, and paying a renewal fee. The second of those is the one that surprises people: renewing can mean accepting terms that did not exist when the first agreement was signed.",
      },

      { kind: "heading", text: "Default, cure, and the breaches with no cure" },
      {
        kind: "paragraph",
        text: "Franchisor termination almost always runs through a default provision, and agreements generally sort defaults into two kinds.",
      },
      {
        kind: "list",
        items: [
          "Curable defaults, which come with a notice and a period to fix the problem. Late royalty payment, failure to report, and falling below an operating standard are usually here.",
          "Defaults with no cure period, where the agreement ends on notice. Abandonment, insolvency, loss of a licence the business needs to operate, conviction for certain offences, and repeated defaults of the same kind are the common examples.",
        ],
      },
      {
        kind: "paragraph",
        text: "The length of a cure period and the list of things that cannot be cured are both negotiated terms rather than industry constants. They are written in the agreement, they differ between systems, and comparing them across two systems tells you more about each franchisor than a page of marketing does.",
      },

      { kind: "heading", text: "Getting out is harder than getting in" },
      {
        kind: "paragraph",
        text: "Franchisee termination rights are usually far narrower than the franchisor's, and in many agreements they barely exist. A franchisee who wants out more often sells the business than terminates it, which means the transfer provisions, and not the termination provisions, are the ones that decide whether an exit is realistic.",
      },
      {
        kind: "paragraph",
        text: "Those provisions typically require franchisor consent, give the franchisor a right of first refusal, require the buyer to qualify and to sign the current form of agreement, and charge a transfer fee. None of that is unusual. All of it affects what the business is worth to somebody else.",
      },

      { kind: "heading", text: "What survives the ending" },
      {
        kind: "paragraph",
        text: "Ending the agreement does not end every obligation in it. What continues is written down, and it usually includes de-identification, meaning removal of signage, marks, and anything that would let a customer think the business is still part of the brand. It usually includes returning manuals and confidential material. It usually includes a covenant restricting competing activity for a period within a defined area, and whether that covenant is enforceable, and how far, is a question of state law and of how the clause was drafted.",
      },

      { kind: "heading", text: "Where the real numbers are" },
      {
        kind: "paragraph",
        text: [
          "Industry wide termination and failure rates circulate constantly and are not traceable to a primary source that supports them. ",
          {
            text: "How to check a franchisor before you sign",
            href: "/insights/how-to-check-a-franchisor",
          },
          " deals with those claims directly and explains why repeating an untraceable figure is worse than declining to give one.",
        ],
      },
      {
        kind: "paragraph",
        text: "For a particular system, there are real numbers and they are disclosed. Item 20 of the disclosure document carries outlet tables showing, year by year, how many units were terminated, not renewed, transferred, or ceased operations. Those are the figures worth reading, and they are about the system in front of you rather than about franchising in the abstract.",
      },

      { kind: "heading", text: "What this does not establish" },
      {
        kind: "paragraph",
        text: [
          "This describes how franchise agreements generally handle endings. It is not legal advice, it makes no claim about any particular system including Craftline, and state law may change the answer in ways this cannot cover. Craftline has issued no Franchise Disclosure Document and is not offering anything. ",
          {
            text: "What Craftline does and does not claim to do",
            href: "/about",
          },
          " is set out plainly on the about page, limits included.",
        ],
      },
    ],
  },
];
