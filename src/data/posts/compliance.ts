import type { Insight } from "@/data/insights";

/**
 * THE COMPLIANCE CLUSTER
 * ======================
 *
 * Two articles about the rules a franchisor operates under rather than the
 * documents a prospect reads. They are together because both are places where
 * the honest position and the compliant position are the same position, and
 * saying so is the whole value of each piece.
 *
 * EVERY LEGAL CLAIM IN THIS FILE WAS VERIFIED AGAINST A PRIMARY SOURCE BEFORE
 * IT WAS WRITTEN, and the citation is in the rendered text rather than in a
 * comment, so a reader can check it rather than take it.
 *
 *   Item 19 is permitted, not required          16 CFR 436.5(s)
 *   the universal preamble, and a second
 *   preamble where no representation is made,
 *   both required word-for-word with no
 *   modification in language or punctuation     Guide, Required Item 19
 *                                               Preambles
 *   a franchisor making no Item 19
 *   representation is PROHIBITED from making
 *   one anywhere else, including in any
 *   advertisement or on any website directed
 *   at prospective franchisees, and doing so
 *   is an independent violation of the Rule     same
 *   reasonable basis and written
 *   substantiation at the time the
 *   representation is made                      16 CFR 436.5(s); Guide
 *   registration before the OFFER, California   Cal. Corp. Code 31110
 *   registration before the offer, New York     N.Y. Gen. Bus. Law 683(1)
 *   registration before the offer, Washington   RCW 19.100.020
 *   Texas has no franchise registration, and
 *   still requires a one time exemption notice
 *   filed before offering or selling            Texas Secretary of State,
 *                                               Form 2700 series FAQ
 *
 * THE ITEM 19 PROHIBITION IS THE FIND OF THE WHOLE BATCH, and it is the one
 * the owner predicted: the honest position is also the strongest one. A
 * franchisor with a blank Item 19 is not merely being cautious by publishing
 * no earnings figures. It is forbidden to publish them, anywhere, and doing so
 * is an independent violation. That turns this property's own no-figures rule
 * from a stylistic preference into a statement of the law, and it lets the
 * article say so without claiming any virtue.
 *
 * THE REGISTRATION ARTICLE COMPETES ON COMPLETENESS AND STILL GIVES NO COUNT.
 * The method is to explain why the counts in circulation differ, quote three
 * statutes in full so a reader sees the actual verb, and then show a state
 * that no registration list would flag and that nevertheless requires a filing
 * before offering. Texas is that state, which is also where this company is.
 * A number would have been easier and would have been unsourceable.
 *
 * WHAT IS DELIBERATELY GENERALISED RATHER THAN ASSERTED. No count of
 * registration, filing or relationship states appears anywhere, and no dollar
 * figure appears for any fee or threshold. Both for reasons already on the
 * record against earlier clusters.
 *
 * The rules in src/data/insights.ts apply in full: no unsourced statistics, no
 * financial performance representations, no offer, no geography.
 */

export const COMPLIANCE_POSTS: Insight[] = [
  {
    slug: "what-item-19-is",
    title: "Item 19: what a franchisor may and may not say",
    eyebrow: "Disclosure",
    description:
      "Item 19 is the only place a franchisor may publish financial performance, and a franchisor with a blank one is forbidden to publish figures anywhere else.",
    lead: "Item 19 is where a disclosure document is allowed to talk about money. It is also the only place, and a franchisor with a blank one may not talk about it anywhere.",
    published: "2026-09-21",
    body: [
      {
        kind: "paragraph",
        text: "Item 19 of a Franchise Disclosure Document is the financial performance representation.",
      },
      {
        kind: "paragraph",
        text: [
          {
            text: "Inside an FDD, which items matter",
            href: "/insights/inside-an-fdd-which-items-matter",
          },
          " covers the document as a whole. This is about the single item that governs what a franchisor may say about money anywhere at all.",
        ],
      },

      { kind: "heading", text: "Permitted, and not required" },
      {
        kind: "paragraph",
        text: [
          {
            text: "The Rule",
            href: "https://www.law.cornell.edu/cfr/text/16/436.5",
            external: true,
          },
          " allows a financial performance representation and does not demand one. A franchisor may publish detailed figures with a reasonable basis behind them, or may publish none at all. Both are compliant, and the difference between them is not a difference in candour.",
        ],
      },

      { kind: "heading", text: "The preamble is fixed wording, not a summary" },
      {
        kind: "paragraph",
        text: [
          "Every Item 19 opens with a prescribed preamble, and the Federal Trade Commission's compliance guide says it ",
          {
            text: "must be included word-for-word as set out, with no modification in language or punctuation",
            href: "https://www.ftc.gov/system/files/documents/plain-language/bus70-franchise-rule-compliance-guide.pdf",
            external: true,
          },
          ".",
        ],
      },
      {
        kind: "paragraph",
        text: "That universal preamble states the rule itself. The Commission permits a franchisor to give information about the actual or potential financial performance of its franchised or franchisor-owned outlets, if there is a reasonable basis for the information and if the information is in the disclosure document.",
      },
      {
        kind: "paragraph",
        text: "A franchisor making no representation must add a second prescribed preamble saying so, also word for word. An empty Item 19 is therefore not an omission or an oversight. It is a specific statement, in wording the franchisor did not choose and cannot soften.",
      },

      { kind: "heading", text: "Reasonable basis, and substantiation in writing" },
      {
        kind: "paragraph",
        text: "Where a franchisor does make a representation, it must have a reasonable basis and written substantiation for it at the time the representation is made. Substantiation is not something you are handed. It is something that must exist and be producible, which is a different and more useful standard.",
      },
      {
        kind: "list",
        items: [
          "Which outlets were measured, and whether they are franchised, franchisor-owned, or from an affiliated system with similar operations.",
          "How many outlets are in the group that achieved the stated level, and how many are in the entire system.",
          "How many outlets in that group actually supplied the data underlying the representation.",
          "What time period is covered, and when the stated level of performance was achieved.",
        ],
      },
      {
        kind: "paragraph",
        text: "Those are not a sceptic's questions added from outside. They are disclosures Item 19 itself requires, which is the Rule conceding that a number without them cannot be interpreted by anybody.",
      },

      { kind: "heading", text: "Silence outside Item 19 is the law rather than modesty" },
      {
        kind: "paragraph",
        text: [
          "A franchisor that makes no Item 19 representation is ",
          {
            text: "prohibited from making any such representations outside the confines of the disclosure document",
            href: "https://www.ftc.gov/system/files/documents/plain-language/bus70-franchise-rule-compliance-guide.pdf",
            external: true,
          },
          ", and the guide says the prohibition reaches any advertisement and any website directed at prospective franchisees.",
        ],
      },
      {
        kind: "paragraph",
        text: "Making such a representation anyway is itself an independent violation of the Rule. So a franchisor with a blank Item 19 publishing earnings figures on its recruitment pages is not being helpfully informal in a grey area. It is in breach, and the breach exists separately from whether the figures are true.",
      },

      { kind: "heading", text: "What that means for a system with no disclosure document" },
      {
        kind: "paragraph",
        text: "A company that has not issued a disclosure document has no Item 19, and therefore no lawful place to publish any financial performance information at all. The correct quantity for it to publish is none.",
      },
      {
        kind: "paragraph",
        text: "That is the position on this site, and it is worth stating as a rule rather than as a preference. No financial performance figure of any kind appears anywhere on this property, because the only lawful place for one to appear does not yet exist.",
      },

      { kind: "heading", text: "How to read an empty Item 19" },
      {
        kind: "paragraph",
        text: "An empty Item 19 says nothing about quality in either direction. A young system may have too few units over too short a period to have a defensible basis for saying anything. An established system may decline for reasons of its own.",
      },
      {
        kind: "paragraph",
        text: [
          "What it does tell you is where to look instead. Item 20 carries the outlet tables for the last three fiscal years, including terminations, non-renewals, transfers, and outlets that ceased operations for other reasons, and those are facts about the system rather than projections about you. ",
          {
            text: "How to check a franchisor before you sign",
            href: "/insights/how-to-check-a-franchisor",
          },
          " covers reading them.",
        ],
      },

      { kind: "heading", text: "What this does not establish" },
      {
        kind: "paragraph",
        text: [
          "This describes what the federal rule requires of Item 19 and what it forbids outside it. It is not legal advice, state law may add requirements, and whether a particular representation has a reasonable basis is a question of evidence rather than of wording. Craftline has issued no Franchise Disclosure Document, has no Item 19, and is not offering anything. ",
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
    slug: "franchise-registration-states",
    title: "Franchise registration states: how to check one",
    eyebrow: "Registration",
    description:
      "Franchise registration states: why the counts disagree, what the statutes actually make unlawful, and the state that needs a filing while appearing on no list.",
    lead: "There is no federal list of registration states. The number you are given depends entirely on what the person giving it decided to count.",
    published: "2026-09-21",
    body: [
      {
        kind: "paragraph",
        text: "The federal Franchise Rule governs disclosure. It says nothing about registration. Registration is a creature of state law, and the states built their franchise statutes separately, at different times, with different scope and different vocabulary.",
      },
      {
        kind: "paragraph",
        text: "So the question is underspecified rather than difficult. An answer to it depends on what the person answering decided to count.",
      },

      { kind: "heading", text: "Three different things get called registration" },
      {
        kind: "paragraph",
        text: "Separating them is most of the work, and doing it makes the varying counts explicable rather than suspicious.",
      },
      {
        kind: "list",
        items: [
          "Registration. A state examines a franchise offering and issues an effective registration before the franchisor may offer or sell there.",
          "Filing or notice. A state requires a document, or a notice claiming an exemption, to be filed before offering, without examining or approving the offering itself.",
          "Relationship law. A state regulates what happens after the sale. Where it has one, it restricts termination, non-renewal or transfer, and says nothing about registration at all.",
        ],
      },

      { kind: "heading", text: "Why this page gives no number" },
      {
        kind: "paragraph",
        text: "The three overlap, and a state may run any combination of them: a registration regime, a relationship statute, both, or only a notice requirement. A count therefore depends on which of the three the counter decided to include.",
      },
      {
        kind: "paragraph",
        text: "No primary source consulted for this page publishes a single figure. The Federal Trade Commission does not, because registration is not federal, and NASAA, which coordinates the registration guidelines the states work from, publishes no count either. Whatever number is in circulation goes stale as soon as a statute is amended.",
      },
      {
        kind: "paragraph",
        text: "So the honest answer is a method rather than a number: identify the states a particular plan actually touches, and read each one's own statute. What follows is what that reading produces, and it is more useful than a count would have been.",
      },

      { kind: "heading", text: "The verb that matters is offer" },
      {
        kind: "paragraph",
        text: [
          "California's provision is one sentence: ",
          {
            text: "it shall be unlawful for any person to offer or sell any franchise in this state unless the offer of the franchise has been registered under this part or exempted",
            href: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CORP&sectionNum=31110",
            external: true,
          },
          ". New York's makes it ",
          {
            text: "unlawful for any person to offer to sell or sell in this state any franchise unless and until there shall have been registered with the department of law, prior to such offer or sale, an offering prospectus",
            href: "https://www.nysenate.gov/legislation/laws/GBS/683",
            external: true,
          },
          ". Washington's makes it ",
          {
            text: "unlawful for any franchisor or subfranchisor to sell or offer to sell any franchise in this state unless the offer of the franchise has been registered or exempted",
            href: "https://app.leg.wa.gov/rcw/default.aspx?cite=19.100.020",
            external: true,
          },
          ". All three attach to the offer.",
        ],
      },

      { kind: "heading", text: "Which is why a website can be the exposure" },
      {
        kind: "paragraph",
        text: [
          "All three statutes define the word the same way, and soliciting is inside the definition. California's reaches ",
          {
            text: "every attempt to dispose of, or solicitation of an offer to buy, a franchise",
            href: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CORP&sectionNum=31018",
            external: true,
          },
          ", New York's ",
          {
            text: "any attempt to offer to dispose of, or solicitation of an offer to buy",
            href: "https://www.nysenate.gov/legislation/laws/GBS/681",
            external: true,
          },
          ", Washington's ",
          {
            text: "every attempt or offer to dispose of or solicitation of an offer to buy",
            href: "https://app.leg.wa.gov/rcw/default.aspx?cite=19.100.010",
            external: true,
          },
          ". So an enquiry form that accepts a submission, or a conversation begun with somebody in one of those states, is capable of being a solicitation long before anybody signs or pays.",
        ],
      },
      {
        kind: "paragraph",
        text: [
          "Advertising is not inside that definition, and two of the three handle it in a section of its own. California requires that ",
          {
            text: "a true copy of the advertisement be filed with the commissioner at least three business days before first publication",
            href: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CORP&sectionNum=31156",
            external: true,
          },
          ", and Washington ",
          {
            text: "at least seven days before publication",
            href: "https://app.leg.wa.gov/rcw/default.aspx?cite=19.100.100",
            external: true,
          },
          ". Both apply to advertisements offering a franchise subject to registration, so they bite once registration does.",
        ],
      },
      {
        kind: "paragraph",
        text: "Between them those two things are the reason a franchisor in formation keeps its public pages informational and says plainly that nothing is being offered. It is not a disclaimer habit. It is the statutes, which put solicitation inside the definition of an offer, and in two of these three put advertising on a filing clock of its own.",
      },

      { kind: "heading", text: "A state with no registration can still require a filing" },
      {
        kind: "paragraph",
        text: [
          "Texas has no franchise registration statute. It does have a Business Opportunity Act, and a franchise complying with the federal rule falls outside it, but the exclusion is not automatic. The Texas Secretary of State states that ",
          {
            text: "prior to offering for sale or selling, the seller must file an exemption notice",
            href: "https://www.sos.state.tx.us/statdoc/faqs2700.shtml",
            external: true,
          },
          ", and that the notice ",
          {
            text: "does not have a term or expiration date; it is a one time filing",
            href: "https://www.sos.state.tx.us/statdoc/faqs2700.shtml",
            external: true,
          },
          ".",
        ],
      },
      {
        kind: "paragraph",
        text: "No list of registration states has a column for that. Texas appears on such a list, when it appears at all, as a state with nothing to do, and a franchisor reading it that way would not have filed the notice the Secretary of State says must be filed before offering or selling.",
      },

      { kind: "heading", text: "How to check a single state properly" },
      {
        kind: "paragraph",
        text: "Start from the state's own statute rather than from anybody's summary. Find the section that makes offering or selling unlawful without registration, filing or exemption. Read that state's own definition of a franchise, because it is the definition the section turns on and it need not match the federal one. Then identify the administering agency, which the statute names. The right reader for the answer is a franchise lawyer admitted in that state.",
      },

      { kind: "heading", text: "What changes, and how often" },
      {
        kind: "paragraph",
        text: "Statutes are amended, forms and fees change, and an exemption available one year can acquire conditions the next. Anything on this page could be out of date by the time it matters to a particular plan, including every statute and agency page quoted on it.",
      },
      {
        kind: "paragraph",
        text: "Every claim here links to the statute or the agency it came from, so checking one is a click rather than a search. That is the only durable form a page like this can take, and it is why no count appears on it.",
      },

      { kind: "heading", text: "What this does not establish" },
      {
        kind: "paragraph",
        text: [
          "This describes how state franchise registration works in general terms and quotes its sources in full. It is not legal advice, it is not a complete survey of any state, and it does not cover relationship statutes, franchise taxes or business licensing. Craftline has issued no Franchise Disclosure Document, is registered in no state as a franchisor, and is not offering anything anywhere. ",
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
