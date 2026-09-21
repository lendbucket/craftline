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
 * ADDED WITH ARTICLES 3 AND 4, same standard, same method:
 *
 *   the outlet count in an area development
 *   agreement is a substantive term that
 *   triggers the 7 day review period               Guide, Unilateral Material
 *   no disclosure document is owed to a
 *   franchisee exercising a right to open new
 *   outlets, or keeping an outlet post term,
 *   unless the new relationship is materially
 *   different                                      Guide, Existing Franchisee
 *   renewal means a new agreement on then
 *   current terms in some systems and a simple
 *   extension in others, and Item 17 must say
 *   which                                          Guide, Item 17 Renewals
 *   Item 17 must warn that renewal terms may
 *   differ materially from the original            Guide, Item 17 Renewals
 *   Item 17 rows b and c cover renewal             16 CFR 436.5(q)
 *
 * The 7 day rule was the one worth the effort in the first pair. It is in the
 * regulation, it is the single most useful thing a prospect can know about the
 * days before a signature, and almost nothing ranking for these terms mentions
 * it.
 *
 * The renewal find is its counterpart in the second pair. A reader who knows
 * that renewal and extension are two different deals wearing one word, and
 * that the franchisor is required to say which one it is selling, can read
 * Item 17 properly. Very little ranking for these terms draws the distinction
 * at all.
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
      "Franchise agreement: what each part of the contract does, the 14 day and seven day waiting periods, and where the disclosure stops and the obligation starts.",
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
        text: "Agreements vary in length and in temperament. Knowing what each part is for is what makes a long document navigable rather than intimidating.",
      },
      {
        kind: "list",
        items: [
          "The grant. What you are licensed to do, under which marks, and for how long. This is short and it is the foundation of everything below it.",
          "Term and renewal. How long the agreement runs, and on what conditions it can be renewed. Whether renewal is automatic or conditional is settled here.",
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
        text: "The order varies between systems. Which of those parts takes the most room is worth measuring on any particular agreement, because the distribution is the shape of that deal before a single clause is read.",
      },

      { kind: "heading", text: "The seven day rule, in the same section of the regulation" },
      {
        kind: "paragraph",
        text: [
          "The 14 day period is one of two in that section of the regulation. The second governs the final week before a signature. If the franchisor ",
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
        text: [
          "There is a carve out, and it is the part to understand. The Rule ",
          {
            text: "expressly exempts changes initiated at the prospective franchisee's request",
            href: "https://www.ftc.gov/system/files/documents/plain-language/bus70-franchise-rule-compliance-guide.pdf",
            external: true,
          },
          ". Something negotiated at your request can be papered and signed without a fresh wait; something the franchisor changed on its own cannot. If a revised agreement appears late and nobody can say which of those it was, that is the question to ask before signing.",
        ],
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
    lead: "A franchise agreement describes a relationship working and then describes it failing. The second half is where the asymmetries between the two sides are written down.",
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
        text: "An agreement that reaches the end of its term and is not renewed has ended without anybody having breached anything. There is no dispute in it and nothing to litigate, which is why it gets less attention than the endings that produce both.",
      },
      {
        kind: "paragraph",
        text: [
          "Renewal conditions are disclosed rather than customary. ",
          {
            text: "Item 17",
            href: "https://www.law.cornell.edu/cfr/text/16/436.5",
            external: true,
          },
          " carries a row for renewal or extension of the term and another for the requirements to renew or extend, which is where a system sets out what it wants: good standing, which form of agreement gets signed, bringing premises or equipment up to current standards, and a renewal fee. Signing the then current form rather than the original is the condition that changes the deal, because renewing can mean accepting terms that did not exist when the first agreement was signed.",
        ],
      },

      { kind: "heading", text: "Default, cure, and the breaches with no cure" },
      {
        kind: "paragraph",
        text: "Franchisor termination runs through the agreement's default provision, which sorts defaults into two kinds.",
      },
      {
        kind: "list",
        items: [
          "Curable defaults, which come with a notice and a period to fix the problem. Late royalty payment, failure to report, and falling below an operating standard are the kind that carries one.",
          "Defaults with no cure period, where the agreement ends on notice. Abandonment, insolvency, loss of a licence the business needs to operate, conviction for certain offences, and repeated defaults of the same kind are the kind that carries none.",
        ],
      },
      {
        kind: "paragraph",
        text: "The length of a cure period and the list of things that cannot be cured are both negotiated terms rather than industry constants. They are written in the agreement, they differ between systems, and comparing them across two systems tells you more about each franchisor than a page of marketing does.",
      },

      { kind: "heading", text: "Getting out is harder than getting in" },
      {
        kind: "paragraph",
        text: "Where a franchisee's termination rights are narrower than the franchisor's, an exit runs through a sale rather than through termination. The transfer provisions then decide whether an exit is realistic, which makes them the ones to read first.",
      },
      {
        kind: "paragraph",
        text: "What those provisions require is disclosed in the same Item 17 table, which carries a row for the franchisor's approval of a transfer by the franchisee and another for the conditions of that approval: the buyer qualifying, a transfer fee, a release, and which form of agreement gets signed. All of it affects what the business is worth to somebody else.",
      },

      { kind: "heading", text: "What survives the ending" },
      {
        kind: "paragraph",
        text: "Ending the agreement does not end every obligation in it. What continues is written down, and the clauses to look for are de-identification, meaning removal of signage, marks, and anything that would let a customer think the business is still part of the brand; the return of manuals and confidential material; and a covenant restricting competing activity for a period within a defined area. Where that last one exists, whether it is enforceable and how far is a question of state law and of how the clause was drafted.",
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
        text: [
          "For a particular system, there are real numbers and they are disclosed. ",
          {
            text: "Item 20 of the disclosure document",
            href: "https://www.law.cornell.edu/cfr/text/16/436.5",
            external: true,
          },
          " carries the outlet tables for the last three fiscal years, including terminations, non-renewals, transfers, and outlets that ceased operations for other reasons. Those are the figures worth reading, and they are about the system in front of you rather than about franchising in the abstract.",
        ],
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

  {
    slug: "what-an-area-development-agreement-is",
    title: "Area development agreement: what it commits you to",
    eyebrow: "The agreement",
    description:
      "Area development agreement: why the schedule is the operative clause, what a missed deadline puts at risk, and where the seven day rule reaches this document.",
    lead: "A franchise agreement grants one business. An area development agreement grants the right to open several, and attaches a date to each one.",
    published: "2026-09-21",
    body: [
      {
        kind: "paragraph",
        text: "An area development agreement is a contract to open a set number of franchised outlets inside a defined area, on dates fixed in advance. It is sometimes called a multi unit development agreement. Whatever it is called, the substance is a quantity, a geography, and a calendar.",
      },
      {
        kind: "paragraph",
        text: [
          "It is not the document that governs any of those outlets. ",
          {
            text: "What is actually in a franchise agreement",
            href: "/insights/what-is-in-a-franchise-agreement",
          },
          " covers the contract that does. This one decides how many there will be and by when.",
        ],
      },

      { kind: "heading", text: "The schedule is the operative clause" },
      {
        kind: "paragraph",
        text: "Most of an area development agreement is unremarkable. The part doing the work is the development schedule, a table setting a date beside a cumulative number of open outlets. Everything else in the document exists either to support that table or to say what happens when it is not met.",
      },
      {
        kind: "paragraph",
        text: "So read it as a set of deadlines rather than as a grant of rights. The rights are real and they are conditional on the dates, and the dates do not move because a market turned out harder than expected. A schedule built on the assumption that every site is found, permitted and opened on the first attempt is a schedule that has never met a building department.",
      },

      { kind: "heading", text: "One development agreement, several franchise agreements" },
      {
        kind: "paragraph",
        text: "The development agreement by itself does not let you operate anything. The outlet is governed by a franchise agreement of its own, signed at or near the time that outlet opens, on the form the franchisor is using at that date.",
      },
      {
        kind: "paragraph",
        text: "That has a consequence worth sitting with. The terms governing your fourth outlet may not be the terms governing your first, because the form can change in between. Whether the development agreement fixes the form at signing or leaves each later unit to whatever form exists then is a term you can read, and comparing it across two systems is informative about both.",
      },
      {
        kind: "paragraph",
        text: "The fee structure divides along the same line. Where there is a development fee for the area and the schedule, there is also an initial franchise fee for each outlet, and whether one is credited against the other is written down. How the two interact differs between systems.",
      },

      { kind: "heading", text: "What a missed deadline does" },
      {
        kind: "paragraph",
        text: "A missed deadline puts the forward half of the deal at risk rather than the built half, because outlets already open are governed by their own agreements and continue operating on them. The document will say which of the following applies.",
      },
      {
        kind: "list",
        items: [
          "Loss of exclusivity in the area, so the franchisor may develop it or award it to somebody else, while the open outlets carry on.",
          "Loss of the right to open the remaining outlets, ending the development agreement without touching the franchise agreements already signed.",
          "A cure right, where the agreement grants one, such as a payment or a shortened extension. Some agreements grant it once and some do not have one at all.",
          "Acceleration, where development fees for the unopened outlets become payable whether or not those outlets are ever built.",
        ],
      },

      { kind: "heading", text: "Where the seven day rule reaches this document" },
      {
        kind: "paragraph",
        text: [
          "Under the federal Franchise Rule a prospective franchisee must receive the disclosure document at least ",
          {
            text: "14 calendar days",
            href: "https://www.law.cornell.edu/cfr/text/16/436.2",
            external: true,
          },
          " before signing a binding agreement or paying anything. A second and shorter period applies after that. Where the franchisor unilaterally makes a material change to an agreement that was already disclosed, the prospect must be given 7 calendar days with the revised version, and the Federal Trade Commission's own compliance guide names this document in its example of what counts: ",
          {
            text: "the actual number of stores to be opened pursuant to an area development agreement",
            href: "https://www.ftc.gov/system/files/documents/plain-language/bus70-franchise-rule-compliance-guide.pdf",
            external: true,
          },
          " is a substantive term whose addition triggers the seven day review period.",
        ],
      },

      { kind: "heading", text: "What this does not establish" },
      {
        kind: "paragraph",
        text: [
          "This describes how area development agreements are generally built. It is not legal advice, every term in one is negotiated and differs between systems, and state law may change the answer. Craftline has issued no Franchise Disclosure Document, operates no development programme, and is not offering anything in any area. ",
          {
            text: "What Craftline does and does not claim to do",
            href: "/about",
          },
          " is set out plainly on the about page, limits included.",
        ],
      },
    ],
  },

  {
    slug: "how-franchise-renewal-works",
    title: "Franchise renewal: what happens at the end of a term",
    eyebrow: "The agreement",
    description:
      "Franchise renewal often means signing the current agreement, not continuing the old one. What Item 17 must tell you, and when a new disclosure document is owed.",
    lead: "A franchise term ends on a date written into the contract. What happens next is decided by a clause signed years before the date it governs arrives.",
    published: "2026-09-21",
    body: [
      {
        kind: "paragraph",
        text: "Franchise agreements run for a fixed term, and the end of that term is automatic in neither direction. The agreement says how long the term is, whether there is a right to continue, what has to be true to exercise it, and what continuing actually means.",
      },
      {
        kind: "paragraph",
        text: [
          {
            text: "How a franchise agreement ends",
            href: "/insights/how-a-franchise-agreement-ends",
          },
          " covers termination and expiry. This is the other branch: what a renewal right is, and what it is not.",
        ],
      },

      { kind: "heading", text: "Renewal and extension are not the same thing" },
      {
        kind: "paragraph",
        text: [
          "The Federal Trade Commission says outright that the word is used differently from one system to another. Its compliance guide describes two arrangements that both get called renewal: in many systems a right of renewal means the franchisee, on expiry of the original term, ",
          {
            text: "has the right to enter into a new agreement according to the then-current terms and conditions",
            href: "https://www.ftc.gov/system/files/documents/plain-language/bus70-franchise-rule-compliance-guide.pdf",
            external: true,
          },
          ", while in others the franchisee has a simple right to extend the existing agreement on the same terms for a further period. Those are materially different deals wearing one word.",
        ],
      },

      { kind: "heading", text: "Item 17 has to tell you which one it is" },
      {
        kind: "paragraph",
        text: [
          "This is not left to the franchisor to volunteer. ",
          {
            text: "Item 17 of the disclosure document",
            href: "https://www.law.cornell.edu/cfr/text/16/436.5",
            external: true,
          },
          " is a table of the relationship's key provisions, and two of its rows are about the end of the term: renewal or extension of the term, and the requirements for the franchisee to renew or extend.",
        ],
      },
      {
        kind: "paragraph",
        text: "The Rule requires the franchisor to explain in the summary column what renewal means in its own system, and the Commission is explicit about why. The requirement exists to stop prospective franchisees being confused or misled about a term that is applied differently from one system to another.",
      },

      { kind: "heading", text: "The warning a franchisor is required to give" },
      {
        kind: "paragraph",
        text: "Where the franchisor's policy is that franchisees may be asked to sign the current form of agreement, Item 17 must also carry a statement alerting them that the terms and conditions of the renewal contract may differ materially from those of their initial contract.",
      },
      {
        kind: "paragraph",
        text: "The wording is left to the franchisor as long as it conveys that idea, so the sentence will not look the same in two documents and it is worth finding rather than skimming past. It is the franchisor telling you, under a legal obligation, that the deal being agreed today has a defined shelf life.",
      },
      {
        kind: "paragraph",
        text: "What can change is not small. Royalty rate, advertising contribution, territory definition, technology requirements, remodel obligations and dispute resolution all sit in the form of agreement, so every one of them is capable of differing between the form signed at the start and the form offered at renewal.",
      },

      { kind: "heading", text: "When a renewal owes you a new disclosure document" },
      {
        kind: "paragraph",
        text: [
          "A renewal does not automatically arrive with a fresh disclosure document. The compliance guide is specific: a franchisor is not required to provide one to a franchisee who keeps its existing outlet after the term, either by extending the present agreement or by entering a new one, ",
          {
            text: "unless the new relationship is under terms and conditions materially different from the present agreement",
            href: "https://www.ftc.gov/system/files/documents/plain-language/bus70-franchise-rule-compliance-guide.pdf",
            external: true,
          },
          ".",
        ],
      },
      {
        kind: "list",
        items: [
          "Where the renewal continues the same deal, expect no new disclosure document, and do not read its absence as a signal about anything else.",
          "Where the renewal is on a materially different agreement, the disclosure obligation attaches, and with it the 14 calendar days before you can be asked to sign or pay.",
        ],
      },

      { kind: "heading", text: "What renewal can cost" },
      {
        kind: "paragraph",
        text: "Renewal is not free by default, and the conditions live in the agreement rather than in general practice. A renewal fee is one line. A requirement to remodel or re-equip to the current standard is another, and where it applies it can be the larger number while nothing labels it as a fee.",
      },
      {
        kind: "paragraph",
        text: "Other common conditions are being in good standing with no uncured default, signing a release of claims against the franchisor, and holding a lease that runs at least as long as the new term. Each of those is readable years before it is due, which is the only useful time to read it.",
      },

      { kind: "heading", text: "What this does not establish" },
      {
        kind: "paragraph",
        text: [
          "This describes how renewal is generally handled and what the federal rule requires to be disclosed about it. It is not legal advice, the terms differ between systems, and state relationship statutes may add requirements this cannot cover. Craftline has issued no Franchise Disclosure Document and is not offering anything. ",
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
