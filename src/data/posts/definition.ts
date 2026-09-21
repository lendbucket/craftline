import type { Insight } from "@/data/insights";

/**
 * THE DEFINITION CLUSTER
 * ======================
 *
 * The prior clusters all assume the answer to one question: that the thing
 * being described is a franchise. These two articles are about the question
 * itself, from both sides of it. One is read by somebody being offered a
 * licence who wants to know what they are actually being offered. The other is
 * read by somebody who owns a business and is considering granting one.
 *
 * EVERY LEGAL CLAIM IN THIS FILE WAS VERIFIED AGAINST A PRIMARY SOURCE BEFORE
 * IT WAS WRITTEN, and the citation is in the rendered text rather than in a
 * comment, so a reader can check it rather than take it.
 *
 *   the three definitional elements                16 CFR 436.1(h)
 *   "whatever it may be called", and the name
 *   given to the arrangement is irrelevant         16 CFR 436.1(h);
 *                                                  Guide, What Types of
 *   a self described distributorship is covered
 *   only if the three elements are satisfied       Guide, What Types of
 *   the Rule reaches relationships merely
 *   represented as having those characteristics,
 *   true or not                                    Guide, What Types of
 *   the single trademark licence exclusion         Guide, Single Trademark
 *   the required payment, large investment and
 *   large franchisee exemptions were all
 *   readjusted with effect from 12 July 2024,
 *   and the Rule requires readjustment every
 *   four years. Verified: $735, $1,469,600 and
 *   $7,348,000. Cited rather than printed, for
 *   the reason set out below                       FTC press release,
 *                                                  11 July 2024; 16 CFR 436.8
 *   23 items, fixed order, franchisor prepares     16 CFR 436.5; 436.3
 *   Item 19 permitted rather than required         16 CFR 436.5(s)
 *   audited financial statements with a phase in   16 CFR 436.5(u)
 *   registration before an offer, California       Cal. Corp. Code 31110
 *   14 calendar days, 7 calendar days              16 CFR 436.2(a), 436.2(b)
 *
 * THE STALE THRESHOLD IS THE FIND IN THIS PAIR, and it is a find about
 * staleness rather than about obscurity. Almost everything published on the
 * franchise versus licence question quotes the figure set when the Rule was
 * written. The Commission is required to adjust it for inflation every four
 * years and has done so, most recently with effect from 12 July 2024.
 *
 * THE CURRENT FIGURES ARE CITED AND NOT PRINTED, and that was not the first
 * draft. The draft gave all three adjusted amounts in the rendered text, and
 * llms-audit failed on it: that audit forbids any money figure reaching
 * llms.txt or llms-full.txt, by shape, whatever sentence it arrives in.
 *
 * The rule was left alone. A federal exemption threshold is not a performance
 * representation and the rule is a blunt proxy, but the file it guards is
 * machine readable and carries no context with it, so a dollar amount lifted
 * out of it and attributed to Craftline is exactly the failure the rule is
 * there to prevent. Rewriting the sentence to slip past a shape check would
 * have been worse than either keeping the figure or dropping it.
 *
 * Dropping it also happens to age better: the source is permanent and the
 * number is not, and the article says so. This is recorded because it is a
 * live decision the owner may want to reverse, in which case the honest route
 * is narrowing the audit rule with plants, not rephrasing around it.
 *
 * WHAT IS DELIBERATELY GENERALISED RATHER THAN ASSERTED. The number of states
 * with franchise registration, filing or relationship statutes is not stated
 * anywhere here, for the reason already recorded against the first two
 * articles: the count depends on what is being counted, no primary source
 * gives one figure, and an untraceable number is a fabrication whether or not
 * it is close. One state statute is quoted in full instead, as an example a
 * reader can open, with the limits of that example stated in the same
 * paragraph.
 *
 * The rules in src/data/insights.ts apply in full: no unsourced statistics, no
 * financial performance representations, no offer, no geography. The dollar
 * figures below are federal exemption thresholds and nothing else. They are
 * not fees, not pricing, and not a representation about any business.
 */

export const DEFINITION_POSTS: Insight[] = [
  {
    slug: "franchise-or-licence-what-separates-them",
    title: "Franchise or licence: what legally separates them",
    eyebrow: "The definition",
    description:
      "Franchise or licence: the three elements that decide it, why the name on the document is irrelevant, and why the payment figure most pages quote is out of date.",
    lead: "Calling an arrangement a licence does not make it one. The federal test has three elements and it does not read the title page.",
    published: "2026-09-21",
    body: [
      {
        kind: "paragraph",
        text: "The question arrives from two directions. A business owner wants to license a brand without becoming a franchisor. A prospective operator is offered something described as a licence or a dealership and wants to know what is actually on the table. Both are asking the same question, and the federal answer is the same for both.",
      },
      {
        kind: "paragraph",
        text: [
          {
            text: "What a Franchise Disclosure Document is",
            href: "/insights/what-a-franchise-disclosure-document-is",
          },
          " covers what follows if the answer is franchise. This is about how the answer is reached.",
        ],
      },

      { kind: "heading", text: "Three elements, and all three have to be present" },
      {
        kind: "paragraph",
        text: [
          "The Franchise Rule defines a franchise as ",
          {
            text: "any continuing commercial relationship or arrangement, whatever it may be called",
            href: "https://www.law.cornell.edu/cfr/text/16/436.1",
            external: true,
          },
          " in which three things are true. The Federal Trade Commission's compliance guide states them in order.",
        ],
      },
      {
        kind: "list",
        items: [
          "The franchisee obtains the right to operate a business identified or associated with the franchisor's trademark, or to sell goods or services identified with it.",
          "The franchisor will exert, or has the authority to exert, a significant degree of control over the franchisee's method of operation, or will provide significant assistance in it.",
          "The franchisee makes, or commits to make, a required payment as a condition of obtaining or commencing operation.",
        ],
      },

      { kind: "heading", text: "The name on the document is irrelevant" },
      {
        kind: "paragraph",
        text: [
          "The guide puts it without hedging: ",
          {
            text: "the name given to the business arrangement is irrelevant in determining whether it is covered",
            href: "https://www.ftc.gov/system/files/documents/plain-language/bus70-franchise-rule-compliance-guide.pdf",
            external: true,
          },
          ". A contract titled franchise agreement is outside the Rule unless the three elements are met, and a self described distributorship is inside it if they are. The Rule also reaches arrangements merely represented as having those characteristics, whether or not the representation turns out to be true.",
        ],
      },

      { kind: "heading", text: "The payment figure most published answers give is out of date" },
      {
        kind: "paragraph",
        text: "Nearly every page explaining this question quotes a five hundred dollar threshold. That figure was the one set when the Rule was written. It is not the current one, and the reason the number moves is the part worth knowing.",
      },
      {
        kind: "paragraph",
        text: [
          "The Rule exempts arrangements where total required payments, from before operations begin to within six months after, fall below a threshold, and the Commission must adjust that threshold for inflation every four years. It has done so, most recently with effect from 12 July 2024, and the same adjustment moved the large investment and large franchisee exemptions with it. ",
          {
            text: "The Commission publishes the current figures itself",
            href: "https://www.ftc.gov/news-events/news/press-releases/2024/07/ftc-publishes-inflation-adjusted-monetary-thresholds-three-exemptions-franchise-rule",
            external: true,
          },
          ", which makes this one of the few numbers in franchising that can simply be looked up rather than inferred.",
        ],
      },
      {
        kind: "paragraph",
        text: "The practical point is not the arithmetic. A payment structure designed to sit under an old threshold may not sit under the current one, and any article giving the figure without a date is describing an unspecified moment. This page gives the source instead of the number, because the number has a shelf life and the source does not.",
      },

      { kind: "heading", text: "The single trademark licence exclusion" },
      {
        kind: "paragraph",
        text: [
          "There is a real trademark licence that is not a franchise, and the Rule excludes it. The guide describes it as an arrangement in which ",
          {
            text: "a single licensee is granted the right to use the trademark",
            href: "https://www.ftc.gov/system/files/documents/plain-language/bus70-franchise-rule-compliance-guide.pdf",
            external: true,
          },
          ", and gives three examples: a one to one licence to a manufacturer producing goods to the licensor's specifications, collateral product licensing such as a drinks logo used on clothing, and a licence granted to an infringing party to settle trademark litigation.",
        ],
      },
      {
        kind: "paragraph",
        text: "What those have in common is that nobody is running a business under the mark as part of a system. Once there is a network of operators conducting the same business under the same mark against the same required payments, the exclusion is not describing what is happening.",
      },

      { kind: "heading", text: "Control or assistance is the element people argue about" },
      {
        kind: "paragraph",
        text: "The trademark element is usually obvious and the payment element is arithmetic. The one that produces genuine disagreement is the second. A supplier setting quality specifications has not thereby become a franchisor, while a company dictating site approval, opening hours, methods, pricing, training and operating procedures generally has. The guide devotes one section to when control or assistance becomes significant and another to what does not count, and both belong in any conclusion that an arrangement sits outside the Rule.",
      },

      { kind: "heading", text: "Why it matters which one you have" },
      {
        kind: "paragraph",
        text: [
          "If the arrangement is a franchise, the obligations attach whether or not anybody intended them to. A disclosure document has to exist, it has to be given at least ",
          {
            text: "14 calendar days",
            href: "https://www.law.cornell.edu/cfr/text/16/436.2",
            external: true,
          },
          " before signing or payment, and in states with their own franchise statutes registration or filing may be required before an offer can lawfully be made at all.",
        ],
      },
      {
        kind: "paragraph",
        text: "Getting this wrong is not a labelling error. It is offering an unregistered franchise, which is a different category of problem from a badly drafted licence, and it is why the question deserves a lawyer rather than a search result.",
      },

      { kind: "heading", text: "What this does not establish" },
      {
        kind: "paragraph",
        text: [
          "This explains the federal test and where its current figures come from. It is not legal advice, several states define a franchise in their own statutes and some of those definitions are broader than the federal one, and whether a particular arrangement meets the test is a question of facts rather than of wording. Craftline has issued no Franchise Disclosure Document and is not offering anything. ",
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
    slug: "how-to-franchise-a-business",
    title: "How to franchise a business: what the law requires",
    eyebrow: "Becoming a franchisor",
    description:
      "How to franchise a business in the order the obligations bite: the three part test, the disclosure document, the audit, and registration before any offer.",
    lead: "Most of what is written about franchising a business is about selling franchises. The part that comes first is a document, an auditor, and in some states a regulator.",
    published: "2026-09-21",
    body: [
      {
        kind: "paragraph",
        text: "The decision to franchise is usually framed as a growth question. What follows it is not a growth question. It is a compliance sequence with a fixed order, and knowing the order is what stops a plan being built backwards.",
      },
      {
        kind: "paragraph",
        text: "What follows is a description of the obligations the federal Franchise Rule places on a franchisor, in the order they bite. It is not legal advice and it is not a service offering.",
      },

      { kind: "heading", text: "First establish whether you are already a franchisor" },
      {
        kind: "paragraph",
        text: [
          "The three part test applies whether or not anybody intended it to. Where you grant the right to operate under your mark, exert or may exert significant control over how that business is run or provide significant assistance with it, and require a payment, the arrangement is a franchise. ",
          {
            text: "Franchise or licence, and what separates them",
            href: "/insights/franchise-or-licence-what-separates-them",
          },
          " sets out the test and the current payment threshold.",
        ],
      },
      {
        kind: "paragraph",
        text: "This comes first because businesses arrive here by accident. A successful operator licenses the name to somebody in the next city, helps them set it up, takes a monthly fee, and has created a franchise with no disclosure document behind it.",
      },
      {
        kind: "paragraph",
        text: "It matters in the other direction too. If what you have genuinely falls outside the test, none of the rest of this applies to you, and establishing that with counsel is cheaper than either of the ways of being wrong about it.",
      },

      { kind: "heading", text: "The disclosure document is twenty three items and you prepare it" },
      {
        kind: "paragraph",
        text: [
          "The Rule specifies the contents. ",
          {
            text: "Twenty three items",
            href: "https://www.law.cornell.edu/cfr/text/16/436.5",
            external: true,
          },
          " in a fixed order, covering the franchisor and its principals, the fees, the estimated initial investment, what each side must do, territory, trademarks, renewal and termination, outlet counts, financial statements, and the contracts themselves as exhibits. Preparing it is the franchisor's responsibility, not the prospect's and not a regulator's.",
        ],
      },
      {
        kind: "list",
        items: [
          "Item 19, financial performance representations, is permitted rather than required. A franchisor may say nothing about financial performance, and a new system with no defensible basis for saying anything is in the strongest position when it says nothing.",
          "Item 20 carries the outlet tables, which means the document reports its own attrition year by year. There is no version of it that shows only the good years.",
          "Item 21 requires financial statements, audited, with a phase in available to a franchisor that has not previously had to produce them.",
          "Item 23 is the receipt, which is how the disclosure date is evidenced afterwards.",
        ],
      },

      { kind: "heading", text: "Audited statements are the step most plans underestimate" },
      {
        kind: "paragraph",
        text: "An audit is neither a formality nor a quick one. It needs books that can be audited, which for a business run on management accounts can mean a period of remediation before an auditor will begin fieldwork at all.",
      },
      {
        kind: "paragraph",
        text: "The phase in softens the first year rather than removing the requirement. Setting a launch date without an auditor's schedule already in hand is the most ordinary way a franchising timetable slips, and it slips by quarters rather than by weeks.",
      },

      { kind: "heading", text: "Registration states come before any offer" },
      {
        kind: "paragraph",
        text: "The federal rule governs disclosure. Several states run their own franchise statutes on top of it, adding registration or filing requirements, and in those states the obligation attaches to the offer rather than to the sale.",
      },
      {
        kind: "paragraph",
        text: [
          "California is the clearest one to read, because the statute says it in a single sentence: ",
          {
            text: "it shall be unlawful for any person to offer or sell any franchise in this state unless the offer of the franchise has been registered under this part or exempted",
            href: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CORP&sectionNum=31110",
            external: true,
          },
          ". Offering covers advertising and soliciting, which is why a franchise recruitment site can create exposure before anybody has signed anything.",
        ],
      },
      {
        kind: "paragraph",
        text: "How many states have such statutes, and what each requires, is not a number this site will give. The count depends on whether registration, filing and relationship statutes are counted together, published figures disagree with each other, and the answer that matters is which states a particular plan touches. That is a question for a franchise lawyer in each of them.",
      },

      { kind: "heading", text: "The fourteen day rule sets the pace of every sale" },
      {
        kind: "paragraph",
        text: [
          "Once the document exists, the Rule sets the timing. A prospective franchisee must receive it at least ",
          {
            text: "14 calendar days",
            href: "https://www.law.cornell.edu/cfr/text/16/436.2",
            external: true,
          },
          " before signing a binding agreement or making any payment, and where the franchisor then unilaterally makes a material change to an agreement already disclosed, the prospect gets a further 7 calendar days with the revised version. Both periods are the franchisor's to observe and, afterwards, to evidence.",
        ],
      },

      { kind: "heading", text: "What this does not establish" },
      {
        kind: "paragraph",
        text: "This is a description of obligations under the federal Franchise Rule, with one state statute quoted as an example. It is not legal advice and it is not complete. It does not reach state relationship statutes, tax, trademark prosecution, or the commercial question of whether a particular business should franchise at all.",
      },
      {
        kind: "paragraph",
        text: [
          "Craftline Brands is itself a franchisor in formation and has issued no Franchise Disclosure Document. Nothing here is an offer, and Craftline does not provide franchise development services to other companies. ",
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
