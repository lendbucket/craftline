import type { Insight } from "@/data/insights";

/**
 * THE SCALE CLUSTER
 * =================
 *
 * Three routes past a single new unit: granting sub-franchises, running
 * several units, and buying one that already trades. They are grouped because
 * prospects reach them from the same place, having decided that one new unit
 * is not the shape they want, and because the differences between them are
 * contractual rather than aspirational.
 *
 * EVERY LEGAL CLAIM IN THIS FILE WAS VERIFIED AGAINST A PRIMARY SOURCE BEFORE
 * IT WAS WRITTEN, and the citation is in the rendered text rather than in a
 * comment, so a reader can check it rather than take it.
 *
 *   subfranchisors are responsible for
 *   preparing disclosure documents, and
 *   "franchisor" expressly includes them       Guide, Who Is Responsible for
 *                                              Preparing Disclosure Documents
 *   a subfranchisor engages in both pre-sale
 *   activities and post-sale performance; a
 *   broker with no post-sale obligation is
 *   not one, whatever it is called             same
 *   franchisor and subfranchisor bear joint
 *   responsibility for the disclosures, and
 *   Items 1 to 4 generally call for both       same
 *   a transferee buying from the franchisee,
 *   without significant contact with the
 *   franchisor, is not a prospective
 *   franchisee and is owed no disclosures,
 *   even where the franchisor may approve
 *   or refuse the sale                         Guide, What Happens When an
 *                                              Existing Franchisee Sells
 *   unless the franchisor plays a more
 *   significant role, the stated example
 *   being financial performance information
 *   given to the transferee                    same
 *   the large franchisee exemption turns on
 *   five years in business and a net worth
 *   threshold readjusted every four years      16 CFR 436.8(a)(5)(ii);
 *                                              FTC, 11 July 2024
 *
 * THE TRANSFER FIND IS THE ONE WORTH THE EFFORT HERE. Buying an existing
 * franchise is widely described as the lower risk route, and almost nothing
 * written about it mentions that the buyer may have no right to a disclosure
 * document at all, or names the specific act by the franchisor that creates
 * one. Both are in the guide, in consecutive sentences.
 *
 * WHAT IS DELIBERATELY GENERALISED RATHER THAN ASSERTED. No figure is given
 * for the large franchisee net worth threshold, for the reason recorded
 * against the definition cluster: llms-audit forbids a money figure reaching
 * the machine readable files, and the rule was left alone rather than narrowed
 * around one article. The threshold is cited to the Commission, which
 * publishes the current number and will publish the next one.
 *
 * The rules in src/data/insights.ts apply in full: no unsourced statistics, no
 * financial performance representations, no offer, no geography.
 */

export const SCALE_POSTS: Insight[] = [
  {
    slug: "what-a-master-franchise-is",
    title: "Master franchise: what you actually become",
    eyebrow: "Scale",
    description:
      "Master franchise: the right to sub-franchise an area makes you a franchisor under the federal rule, with disclosure obligations of your own.",
    lead: "A master franchise is usually sold as a territory. What it grants is the right to sell franchises, and that changes what you are rather than how much you have.",
    published: "2026-09-21",
    body: [
      {
        kind: "paragraph",
        text: "A master franchise agreement gives one party the right to develop a defined area by recruiting and supporting franchisees inside it, rather than by operating every unit itself. The master franchisee takes a share of the fees and royalties from those units and carries a share of the obligations owed to them.",
      },
      {
        kind: "paragraph",
        text: [
          {
            text: "What an area development agreement is",
            href: "/insights/what-an-area-development-agreement-is",
          },
          " covers the arrangement where you open the units yourself. This is the other one, where somebody else opens them and you stand between them and the brand.",
        ],
      },

      { kind: "heading", text: "The Rule calls you a franchisor" },
      {
        kind: "paragraph",
        text: [
          "The Federal Trade Commission's compliance guide states that ",
          {
            text: "subfranchisors are also responsible for preparing disclosure documents",
            href: "https://www.ftc.gov/system/files/documents/plain-language/bus70-franchise-rule-compliance-guide.pdf",
            external: true,
          },
          ", and that the term franchisor expressly includes them.",
        ],
      },
      {
        kind: "paragraph",
        text: "It defines a subfranchisor as somebody who functions as a franchisor by engaging in both pre-sale activities and post-sale performance, and it draws the line clearly: a third party broker with no post-sale obligations is not a subfranchisor even where a contract calls them one. What decides it is whether you keep serving the units after they open.",
      },

      { kind: "heading", text: "Joint responsibility, not divided responsibility" },
      {
        kind: "paragraph",
        text: "The guide says the franchisor and any subfranchisor bear a joint responsibility to ensure the required disclosures are made and are accurate. Not one or the other, and not whichever of them drafted the document.",
      },
      {
        kind: "paragraph",
        text: "The work itself divides by item. Items 1 to 4, covering the franchise system, prior business experience, litigation and bankruptcy, generally call for both parties to supply information, because somebody signing with a master franchisee needs the history of the party in front of them as well as the history of the brand behind it.",
      },

      { kind: "heading", text: "What you are buying, stated as obligations" },
      {
        kind: "paragraph",
        text: "Read a master franchise offer as a list of things you will now be required to do, rather than as an area you now hold.",
      },
      {
        kind: "list",
        items: [
          "Recruit franchisees. This is a regulated sales function with disclosure timing attached, not a marketing function with a target attached.",
          "Prepare or contribute to a disclosure document, and be accurate in it, jointly with the franchisor and exposed alongside them.",
          "Deliver the training, opening support and ongoing service the units were promised, because that post-sale performance is precisely what makes you a subfranchisor rather than a broker.",
          "Carry the relationship when a unit struggles, which is where the economics of the model are actually settled.",
        ],
      },
      {
        kind: "paragraph",
        text: "None of that is an argument against the model. It is the work the model consists of, and somebody evaluating one is really evaluating their appetite for that work rather than the size of the area on the map.",
      },

      { kind: "heading", text: "The questions worth asking before the map" },
      {
        kind: "paragraph",
        text: "Whether the master agreement binds you to a development schedule as well as to a recruitment role. How fees divide between you and the franchisor, on each unit sale and on continuing royalties. What happens to your sub-franchisees if your own master agreement ends, and who carries the obligations to them from that point. That last one sits in the master agreement rather than in the agreements those sub-franchisees signed, so it is readable from the start by whoever thinks to look there.",
      },

      { kind: "heading", text: "Where the honest uncertainty sits" },
      {
        kind: "paragraph",
        text: "Master franchising puts two different businesses in one pair of hands. One is operating, which most buyers understand and can assess from experience. The other is franchise sales and support, which is a regulated activity carrying its own skills, its own costs and its own liabilities, and which is not the activity the operating experience was gained in.",
      },
      {
        kind: "paragraph",
        text: [
          "Anybody weighing one should read the federal definition of a franchise closely, because the arrangement they will be granting to their own sub-franchisees is itself a franchise. ",
          {
            text: "Franchise vs license, and what separates them",
            href: "/insights/franchise-vs-license",
          },
          " sets out the test that decides it.",
        ],
      },

      { kind: "heading", text: "What this does not establish" },
      {
        kind: "paragraph",
        text: [
          "This describes how master franchise arrangements are generally structured and what the federal rule requires of a subfranchisor. It is not legal advice, the terms differ between systems, and state law may add requirements this cannot cover. Craftline has issued no Franchise Disclosure Document, has no master or area programme, and is not offering anything. ",
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
    slug: "buying-an-existing-franchise",
    title: "Buying an existing franchise: what changes",
    eyebrow: "The process",
    description:
      "Buying an existing franchise often comes with no disclosure document, and one specific act by the franchisor changes that. What to read in its place.",
    lead: "Buying a unit that already trades removes most of the unknowns in a new franchise and adds one that catches people out. You may not be entitled to a disclosure document.",
    published: "2026-09-21",
    body: [
      {
        kind: "paragraph",
        text: "Buying an existing franchise means buying the business from the franchisee who owns it, with the franchisor's consent, and then operating it under the brand. It is usually called a transfer, and it is a different transaction from buying a new franchise even though it arrives at the same place.",
      },
      {
        kind: "paragraph",
        text: [
          {
            text: "How to buy a franchise, the sequence",
            href: "/insights/how-to-buy-a-franchise-the-sequence",
          },
          " covers a new unit. The differences below are worth knowing before an offer rather than after one.",
        ],
      },

      { kind: "heading", text: "You may not be entitled to a disclosure document" },
      {
        kind: "paragraph",
        text: [
          "The Federal Trade Commission's compliance guide is direct about this. A transferee, meaning somebody who buys an existing franchise directly from the franchisee who owns it ",
          {
            text: "without any significant contact with the franchisor",
            href: "https://www.ftc.gov/system/files/documents/plain-language/bus70-franchise-rule-compliance-guide.pdf",
            external: true,
          },
          ", is not a prospective franchisee under the Rule.",
        ],
      },
      {
        kind: "paragraph",
        text: "It then goes further. Even where the franchisor has and exercises the right to approve or refuse the sale, the transferee is still not entitled to disclosures, unless the franchisor plays some more significant role in it.",
      },
      {
        kind: "paragraph",
        text: "So the 14 calendar day waiting period, the twenty three items and the receipt can all be absent from a transaction that otherwise looks exactly like buying a franchise, and nothing has gone wrong.",
      },

      { kind: "heading", text: "The one thing that changes it" },
      {
        kind: "paragraph",
        text: [
          "The guide gives the example that flips it. Where the franchisor ",
          {
            text: "provides financial performance information to the prospective transferee",
            href: "https://www.ftc.gov/system/files/documents/plain-language/bus70-franchise-rule-compliance-guide.pdf",
            external: true,
          },
          ", the franchisor is required to provide that transferee with its disclosure document.",
        ],
      },
      {
        kind: "paragraph",
        text: "That is worth holding on to in both directions. If a franchisor offers you figures during a transfer, a disclosure document is owed to you and you should have it. If no figures are offered and no document appears, that is the Rule working as written rather than somebody cutting a corner.",
      },

      { kind: "heading", text: "What you can read instead" },
      {
        kind: "paragraph",
        text: "The absence of a document does not leave you with nothing, and what replaces it is stronger. An operating unit has records, which a new unit never does: tax returns, the royalty reports filed with the franchisor, supplier accounts, payroll, and the lease with its remaining term. Ask for the royalty reports specifically, because they were prepared for a recipient with an interest in their accuracy.",
      },

      { kind: "heading", text: "The agreement you sign is not the one being sold" },
      {
        kind: "paragraph",
        text: [
          "What a transfer requires is disclosed rather than customary, and there is a fixed place to read it. ",
          {
            text: "Item 17 of the disclosure document",
            href: "https://www.law.cornell.edu/cfr/text/16/436.5",
            external: true,
          },
          " carries a row for the franchisor's approval of a transfer by the franchisee and another for the conditions of that approval, which is where a particular system sets out what it wants: the buyer qualifying, a transfer fee, a release, and which form of agreement gets signed. ",
          {
            text: "What is actually in a franchise agreement",
            href: "/insights/what-is-in-a-franchise-agreement",
          },
          " covers what that document contains.",
        ],
      },
      {
        kind: "paragraph",
        text: "So the remaining term, the royalty rate, the territory definition and the renewal conditions may all differ from what the seller has been operating under. The business being valued is not quite the business that will be owned, and that difference belongs in the price rather than in a surprise after closing.",
      },

      { kind: "heading", text: "What this does not establish" },
      {
        kind: "paragraph",
        text: [
          "This describes how transfers are generally handled and what the federal rule says about disclosure in one. It is not legal advice, the terms differ between systems, and state law may add requirements this cannot cover. Craftline has issued no Franchise Disclosure Document, has no operating units for sale, and is not offering anything. ",
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
    slug: "what-a-multi-unit-franchise-is",
    title: "Multi unit franchise: the three ways it happens",
    eyebrow: "Scale",
    description:
      "Multi unit franchise ownership arrives by three different contracts with three different obligations, and one of them changes what the rule requires of you.",
    lead: "Owning several units of one brand is a single outcome reached by three routes, and the route decides what you are committed to long before the units exist.",
    published: "2026-09-21",
    body: [
      {
        kind: "paragraph",
        text: "Multi unit ownership is a structure before it is an ambition, and the structure is what matters, because three quite different contracts produce the same photograph of four locations.",
      },
      {
        kind: "paragraph",
        text: "Each route carries different obligations, different failure modes, and a different answer to the question of what happens when a market turns out slower than the plan assumed.",
      },

      { kind: "heading", text: "Route one, a development agreement signed up front" },
      {
        kind: "paragraph",
        text: [
          "The operator commits in advance to open a set number of outlets inside an area, on dates fixed at signing. The rights granted are real and they are conditional on the schedule. ",
          {
            text: "What an area development agreement is",
            href: "/insights/what-an-area-development-agreement-is",
          },
          " covers what a missed deadline puts at risk and what it leaves alone.",
        ],
      },
      {
        kind: "paragraph",
        text: "This route carries the most forward obligation of the three, and all of it is committed at signing, which is before any operating experience in that market exists to inform it.",
      },

      { kind: "heading", text: "Route two, one unit at a time" },
      {
        kind: "paragraph",
        text: "The operator signs a single franchise agreement, runs it, and signs another once the first is working. No forward commitment exists, so nothing is forfeited if the second never happens. The price of that flexibility is that the franchisor is under no obligation to hold anything open. Whether a right of first refusal over adjacent areas exists at all is a term of the agreement, so it is readable rather than assumable.",
      },

      { kind: "heading", text: "Route three, selling franchises rather than operating them" },
      {
        kind: "paragraph",
        text: [
          "A master or subfranchise arrangement puts the operator in the position of recruiting and supporting other franchisees. ",
          {
            text: "What a master franchise is",
            href: "/insights/what-a-master-franchise-is",
          },
          " covers why the federal rule treats that person as a franchisor with disclosure obligations of their own.",
        ],
      },
      {
        kind: "paragraph",
        text: "It is the only one of the three that changes what you are rather than how many units you hold, and it belongs in a different conversation from the first two.",
      },

      { kind: "heading", text: "What multiplies, and what does not" },
      {
        kind: "paragraph",
        text: "Not every part of the business scales at the same rate, and which parts do is decided by the structure rather than by effort.",
      },
      {
        kind: "list",
        items: [
          "Management does not multiply cleanly. A second unit needs supervision the first did not, because one owner cannot be in two places, and where that supervision is a hire it is a cost carried before the second unit earns anything.",
          "Systems do multiply well. A playbook written to be run more than once carries to a second unit without being written again, which is the structural argument for operating inside a franchise rather than independently.",
          "Risk concentrates rather than spreads. Several units of one brand in one region share a brand, a labour market and a local economy, so where any of those moves the units move together and the second is not a hedge against the first.",
          "Where each agreement carries a personal guarantee, the guarantees accumulate, and the total appears on none of them.",
        ],
      },
      {
        kind: "paragraph",
        text: "None of that argues against multiple units. It argues for the second one being a decision taken deliberately rather than a default arrived at.",
      },

      { kind: "heading", text: "Where the federal rule treats a large operator differently" },
      {
        kind: "paragraph",
        text: [
          "The Rule exempts some sales to large franchisees, and a multi unit entity is the usual candidate. It applies where the buying entity has been in business for at least five years and meets a net worth threshold the Commission ",
          {
            text: "readjusts for inflation every four years",
            href: "https://www.ftc.gov/news-events/news/press-releases/2024/07/ftc-publishes-inflation-adjusted-monetary-thresholds-three-exemptions-franchise-rule",
            external: true,
          },
          ".",
        ],
      },
      {
        kind: "paragraph",
        text: "The consequence is worth understanding before it applies to you rather than after. An exempt sale is one where the disclosure document is not required, so crossing that threshold can mean the next deal arrives with less information than the first one did.",
      },

      { kind: "heading", text: "What this does not establish" },
      {
        kind: "paragraph",
        text: [
          "This describes how multi unit arrangements are generally structured and one place the federal rule treats a large buyer differently. It is not legal advice, the terms differ between systems, and state law may add requirements this cannot cover. Craftline has issued no Franchise Disclosure Document, has no development programme, and is not offering anything. ",
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
