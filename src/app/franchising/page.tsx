import type { Metadata } from "next";
import Link from "next/link";
import { FranchiseForm } from "@/components/form/franchise-form";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { CtaPrompt } from "@/components/cta-band";
import { NumberedGrid, NumberedStatements } from "@/components/system/grid";
import {
  RuledItem,
  RuledRow,
  RuledRows,
  Steps,
} from "@/components/system/ruled-list";
import { Section } from "@/components/system/section";
import { SectionHead } from "@/components/system/section-head";
import {
  CAPABILITIES,
  FRANCHISE_DISCLAIMER,
  FRANCHISE_FAQ,
  INQUIRY_PROCESS,
  OPERATOR_PROFILE,
} from "@/config/company";
import {
  DUE_DILIGENCE,
  FDD_EXPLAINER,
  FRANCHISE_GLOSSARY,
} from "@/data/franchising";
import { ORDERED_INSIGHTS } from "@/data/insights";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

/**
 * Category language in the description is confined to what the company IS. A
 * franchise development company that builds home services brands is a
 * description; anything about where a franchise is available, what it costs,
 * or what it returns would be an offer term. There is no place name in here
 * and none may be added.
 */
export const metadata: Metadata = pageMetadata({
  title: "Franchising",
  description:
    "How franchising works, explained plainly: what a franchisor and a franchisee each do, what royalties and brand standards mean, what a Franchise Disclosure Document is and why it exists, and what Craftline Brands looks for in an operator. Information and inquiry only.",
  path: "/franchising",
});

/**
 * Franchising.
 *
 * THE MOST LEGALLY CONSTRAINED PAGE ON THIS SITE, and also the longest, because
 * it is the education section. Read the rules before editing anything.
 *
 * The FDD is not issued. Until it is, and in registration states until
 * registered, nothing on this page may constitute a franchise offer:
 *
 *   - No financial performance representation of any kind. No revenue, profit,
 *     earnings, ROI, payback, unit economics, averages, ranges, or examples.
 *     Not in copy, not in a caption, not in schema, not in a comment that
 *     renders. This is the rule that ends programs, not just pages.
 *   - No Craftline fee, royalty rate, capital requirement, or territory grant.
 *   - No "buy", "own today", "apply", "qualify", "approved", or "secure your".
 *     The form is an inquiry, the page is information, and the language has to
 *     match that or the disclaimer is contradicted by the page carrying it.
 *   - The phrase "first territory" appears nowhere on this property.
 *
 * THE EDUCATION SECTIONS ARE SAFE FOR A SPECIFIC REASON, not by luck. They
 * describe how franchising works and what the law requires of any franchisor,
 * which are facts about the framework. They never describe this company's
 * terms. That distinction is enforced by keeping the material in
 * src/data/franchising.ts, whose header states the test: would this sentence
 * be equally publishable on a site belonging to a franchisor that has never
 * heard of Craftline?
 *
 * THE FAQ IS THE RISKIEST CONTENT and it is deliberately here rather than
 * omitted. Cost and earnings are the first two things anyone wants to know,
 * and a page that dodges them reads evasive. Both are asked and both are
 * answered with the reason no honest franchisor answers them before
 * disclosure. See FRANCHISE_FAQ in config.
 *
 * The disclaimer renders twice on this page by design: directly above the form
 * where someone is about to type, and in the site footer. Nobody should have
 * to scroll to find the thing that says this is not an offer.
 *
 * PHASE 2A, AND WHY THIS PAGE CHANGED MOST. It carries ten sections and every
 * one of them opened with the identical eyebrow, heading and grey paragraph,
 * ten times out of ten. Beneath that, thirty items of content rendered as the
 * same rounded card: seven glossary terms, five FDD explanations, five
 * diligence checks, four capabilities, three traits, four steps and nine FAQ
 * entries. The FAQ band alone ran 4415 pixels at 390 with no ordering signal in
 * it. Six different shapes now carry those six different content types, and
 * the section heads alternate between the stacked and asymmetric forms, so a
 * reader can tell where they are in a long document by what it looks like.
 */
export default function FranchisingPage() {
  return (
    <>
      <PageHeader
        label="Franchising"
        title="How franchising works, and what Craftline is building."
        lead="This section is written for someone evaluating a franchise for the first time. It explains the structure, the vocabulary, and the document that governs the decision, before it says anything about this company."
        ctaHref="#inquiry"
        ctaLabel="Make an inquiry"
        secondaryHref="#vocabulary"
        secondaryLabel="Start with the vocabulary"
      />

      {/* ---------------------------------------------------------------
          WHAT A FRANCHISE IS
          Serif prose and the jump list. The list is a plain ruled column
          rather than a boxed card: it is navigation, and navigation on this
          site is ruled rather than boxed.
          --------------------------------------------------------------- */}
      <Section ground="white">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <SectionHead
              eyebrow="The basics"
              tone="signal"
              title="What a franchise actually is."
              compact
            />
            <div className="prose-body mt-8 max-w-[62ch] space-y-5">
              <p>
                A franchise is a licence. One company owns a brand and a
                documented way of operating, and it licenses another party the
                right to run a business using both. The person who takes that
                licence owns their business and carries its risk. What they are
                buying is not the business itself but the brand, the method, and
                the support behind them.
              </p>
              <p>
                That arrangement is why franchising exists in trade services at
                all. The technical work is well understood and a competent
                contractor can already do it. What sinks these businesses is
                rarely the trade. It is scheduling, pricing, hiring, collections,
                marketing, and the administrative load that arrives with the
                second van. A franchise system is an attempt to solve those
                problems once, centrally, and then hand the solution to each
                operator.
              </p>
              <p>
                It is not a passive investment and it is not a job. It sits
                between the two, and the obligations run in both directions. The
                operator agrees to run the business to a standard. The franchisor
                agrees to maintain the brand and provide the support it promised.
                Either side can fail to hold up its end, which is exactly what
                the disclosure document and the franchise agreement exist to make
                legible before anyone signs.
              </p>
            </div>
          </div>

          <nav aria-label="In this section" className="lg:sticky lg:top-8 lg:self-start">
            <h2 className="label-sm">In this section</h2>
            <ul className="border-graphite mt-4 border-t-2">
              {[
                ["#vocabulary", "The vocabulary"],
                ["#fdd", "What an FDD is"],
                ["#diligence", "How to check a system"],
                ["#support", "What Craftline provides"],
                ["#operators", "What Craftline looks for"],
                ["#process", "From inquiry to opening"],
                ["#faq", "Questions"],
                ["#inquiry", "Make an inquiry"],
              ].map(([href, label]) => (
                <li key={href} className="border-line border-b">
                  <Link
                    href={href}
                    className="text-graphite hover:text-datum font-display block py-3.5 text-[1.0625rem] font-bold tracking-[0.04em] uppercase transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          THE VOCABULARY
          Two column ruled rows: the terms align in a column a reader can run
          their eye down, which is the whole job of a glossary.
          --------------------------------------------------------------- */}
      <Section id="vocabulary" ground="mist" edge>
        <SectionHead
          eyebrow="The vocabulary"
          tone="datum"
          title="The words you are expected to already know."
          aside="Every term below describes how franchising works generally. Where a term normally carries a number, the number belongs in a disclosure document rather than on a website, so this explains the mechanism instead."
        />

        <RuledRows className="mt-14">
          {FRANCHISE_GLOSSARY.map((entry) => (
            <RuledRow key={entry.term} term={entry.term}>
              {entry.body}
            </RuledRow>
          ))}
        </RuledRows>

        <CtaPrompt
          className="mt-14 max-w-3xl"
          title="Already know the vocabulary?"
          lead="Then the useful next step is a conversation. An inquiry asks for nothing sensitive and commits you to nothing."
          label="Make an inquiry"
        />
      </Section>

      {/* ---------------------------------------------------------------
          THE FDD
          --------------------------------------------------------------- */}
      <Section id="fdd" ground="white">
        <SectionHead
          eyebrow="Disclosure"
          tone="signal"
          title="What a Franchise Disclosure Document is, and why it exists."
          lead="This is the single most important document in the decision, and most people evaluating a franchise have never seen one. Craftline has not issued one, so there is nothing to offer yet. Understanding it now is what makes the eventual reading useful."
        />

        <RuledRows className="mt-14">
          {FDD_EXPLAINER.map((entry) => (
            <RuledRow key={entry.heading} term={entry.heading}>
              {entry.body}
            </RuledRow>
          ))}
        </RuledRows>

        <CtaPrompt
          className="mt-14 max-w-3xl"
          title="No disclosure document has been issued yet."
          lead="When one is, anyone who has made contact hears about it. An inquiry now is a conversation and nothing more: it reserves nothing and commits you to nothing."
          label="Make an inquiry"
        />
      </Section>

      {/* ---------------------------------------------------------------
          DUE DILIGENCE
          Five complete instructions with no labels and no numerals. They are
          checks to run, not a sequence, and inventing a label for each one
          would be decoration.
          --------------------------------------------------------------- */}
      <Section id="diligence" ground="mist" density="tight" edge>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-20">
          <SectionHead
            eyebrow="Due diligence"
            tone="datum"
            title="How to check any franchise system, including this one."
            lead="This advice is against a franchisor's short term interest and it is here anyway. A system does not benefit from operators who joined without understanding what they joined."
          />
          <ul className="border-graphite border-t-2">
            {DUE_DILIGENCE.map((item) => (
              <RuledItem key={item}>{item}</RuledItem>
            ))}
          </ul>
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          WHAT CRAFTLINE PROVIDES
          --------------------------------------------------------------- */}
      <Section id="support" ground="white">
        <SectionHead
          eyebrow="What Craftline provides"
          tone="signal"
          title="What an operator would inherit."
          aside="Described qualitatively and deliberately so. Saying what support exists is permitted. Quantifying what it produces would be a financial performance representation, so no sentence here carries a number."
        />

        <NumberedGrid items={CAPABILITIES} ground="white" className="mt-16" />

        <CtaPrompt
          className="mt-14 max-w-3xl"
          title="Want this described for your situation?"
          lead="The support model is the same for everyone; what differs is the market and the operator. An inquiry is where that conversation starts."
          label="Make an inquiry"
        />
      </Section>

      {/* ---------------------------------------------------------------
          WHAT CRAFTLINE LOOKS FOR
          --------------------------------------------------------------- */}
      <Section id="operators" ground="mist" density="tight" edge>
        <SectionHead
          eyebrow="Who this is for"
          tone="datum"
          title="What Craftline looks for in an operator."
          aside="Traits rather than qualifications. There is no experience requirement and no background requirement stated anywhere on this site, because a stated threshold is a claim about who will be accepted and no such claim can be made before disclosure."
        />

        <NumberedStatements
          items={OPERATOR_PROFILE}
          ground="mist"
          className="mt-14"
        />
      </Section>

      {/* ---------------------------------------------------------------
          THE PROCESS
          The one numbered list on the site. Step three cannot happen before
          step two, so the numerals are information rather than ornament.
          --------------------------------------------------------------- */}
      <Section id="process" ground="white">
        <SectionHead
          eyebrow="The process"
          tone="signal"
          title="From an inquiry to an opening."
          lead="Four steps, and the fourth one has not happened yet. No Franchise Disclosure Document has been issued and no date is being committed to."
        />

        <Steps steps={INQUIRY_PROCESS} className="mt-14" />

        <CtaPrompt
          className="mt-14 max-w-3xl"
          title="Start at step one."
          lead="The form asks who you are, where you are interested, and roughly when. It asks for no financial documents and no signature."
          label="Franchise inquiry"
        />
      </Section>

      {/* ---------------------------------------------------------------
          FAQ
          Single column ruled blocks. A question is not a term and will not
          sit in a 15rem column, so this is the one place the ruled row runs
          stacked rather than beside.
          --------------------------------------------------------------- */}
      <Section id="faq" ground="mist" edge>
        <SectionHead
          eyebrow="Questions"
          tone="datum"
          title="The questions a serious operator asks."
          aside="Including the two that cannot be answered yet, and why."
        />

        <dl data-faq className="border-graphite mt-14 border-t-2">
          {FRANCHISE_FAQ.map((entry) => (
            <div key={entry.q} className="border-line border-b py-7">
              <dt className="d3-sentence max-w-[54ch]">{entry.q}</dt>
              <dd className="text-steel mt-4 max-w-[72ch] leading-relaxed">
                {entry.a}
              </dd>
            </div>
          ))}
        </dl>

        <CtaPrompt
          className="mt-14 max-w-3xl"
          title="Question not answered here?"
          lead="Ask it directly. You will get a straight answer, including the answer that something cannot be discussed until a disclosure document exists."
          label="Make an inquiry"
        />

        <p className="text-steel mt-12 leading-relaxed">
          More on how these businesses work:{" "}
          {ORDERED_INSIGHTS.map((insight, index) => (
            <span key={insight.slug}>
              {index > 0 ? ", " : ""}
              <Link href={`/insights/${insight.slug}`} className="link tap-44">
                {insight.title}
              </Link>
            </span>
          ))}
          .
        </p>
      </Section>

      {/* ---------------------------------------------------------------
          INQUIRY
          --------------------------------------------------------------- */}
      <Section id="inquiry" ground="white" edge>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20">
          <div>
            <SectionHead
              eyebrow="Make an inquiry"
              tone="signal"
              title="Start a conversation."
              lead="This is an inquiry, not an application. It asks for nothing sensitive, commits you to nothing, and is read by a person."
            />

            {/*
              IN-BODY DISCLAIMER. Verbatim from FRANCHISE_DISCLAIMER, placed
              beside the form rather than only in the footer. Do not reword it,
              do not summarise it, and do not move it below the submit button.

              Styled as plain ruled legal text rather than as a coloured
              callout. A red box around it would read as marketing emphasis
              rather than as the standing legal statement it is, and red on this
              site means "act".
            */}
            <div className="border-graphite mt-12 border-t-2 pt-6">
              <h3 className="label-sm">Important legal notice</h3>
              <p className="text-steel mt-4 max-w-[62ch] text-[0.9375rem] leading-relaxed">
                {FRANCHISE_DISCLAIMER}
              </p>
            </div>
          </div>

          <div>
            <FranchiseForm />
          </div>
        </div>
      </Section>

      <JsonLd
        data={breadcrumbSchema([{ name: "Franchising", path: "/franchising" }])}
      />
    </>
  );
}
