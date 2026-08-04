import type { Metadata } from "next";
import { Container } from "@/components/container";
import { FranchiseForm } from "@/components/form/franchise-form";
import { JsonLd } from "@/components/json-ld";
import { MaterialPlate } from "@/components/material-plate";
import { PageHeader } from "@/components/page-header";
import { Band, Register, Rule, SectionLabel } from "@/components/section";
import { TitleBlock } from "@/components/title-block";
import {
  CAPABILITIES,
  FOUNDING_STATEMENT,
  FRANCHISE_DISCLAIMER,
  FRANCHISE_FAQ,
  INQUIRY_PROCESS,
  OPERATOR_PROFILE,
} from "@/config/company";
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
    "Franchise development at Craftline Brands, a veteran founded home services franchise company building skilled trade brands. What the company looks for in an operator, how the support model works, and answers to the questions a serious operator asks. Information and inquiry only.",
  path: "/franchising",
});

/**
 * Franchising page.
 *
 * THE MOST LEGALLY CONSTRAINED PAGE ON THIS SITE. Read the rules before
 * editing anything here.
 *
 * The FDD is not issued. Until it is, and in registration states until
 * registered, nothing on this page may constitute a franchise offer. In
 * practice that means:
 *
 *   - No financial performance representation of any kind. No revenue, profit,
 *     earnings, ROI, payback, unit economics, averages, ranges, or examples.
 *     Not in copy, not in a caption, not in schema, not in a comment that
 *     renders. This is the rule that ends programs, not just pages.
 *   - No franchise fee, royalty, pricing, or capital requirement stated.
 *   - No "buy", "own today", "apply", "qualify", "approved", or "secure your".
 *     The form is an inquiry, the page is information, and the language has to
 *     match that or the disclaimer is contradicted by the page carrying it.
 *   - The phrase "first territory" appears nowhere on this property.
 *
 * THE FAQ IS THE RISKIEST CONTENT ON THE SITE and it is deliberately here
 * rather than omitted. Cost and earnings are the first two things anyone
 * wants to know, and a page that dodges them reads evasive. Both are asked
 * and both are answered with the reason no honest franchisor answers them
 * before disclosure. Describing the regulatory framework is permitted;
 * describing this company's terms is not. See FRANCHISE_FAQ in config.
 *
 * The disclaimer renders three times on this page by design: in the FAQ
 * preamble, directly above the form where someone is about to type, and in the
 * title block. Duplication is the point. Nobody should have to scroll to find
 * the thing that says this is not an offer.
 */
export default function FranchisingPage() {
  return (
    <>
      <PageHeader
        label="Franchising"
        title="Information and inquiry. Nothing on this page is an offer."
        lead="What the company looks for in an operator, how the support model works, what happens after you make contact, and straight answers to the questions that usually go unanswered until it is too late to ask them."
      />

      {/* ---------------------------------------------------------------
          WHAT WE LOOK FOR
          --------------------------------------------------------------- */}
      <section className="bg-zinc">
        <Container>
          <Band>
            <SectionLabel>What we look for</SectionLabel>
            <h2 className="display-2 mt-8 max-w-3xl text-balance">
              The operator matters more than the market.
            </h2>
            <p className="body-lg text-steel mt-8 max-w-2xl">
              A good market with the wrong operator is a bad outcome that takes
              two years to become obvious. These are traits rather than
              qualifications. There is deliberately no experience requirement
              and no background requirement stated anywhere, because a stated
              threshold is a claim about who will be accepted and no such claim
              can be made before disclosure.
            </p>

            <ul className="mt-14 space-y-9">
              {OPERATOR_PROFILE.map((trait) => (
                <li key={trait} className="reveal max-w-3xl">
                  <Rule className="max-w-[6rem]" />
                  <p className="body-lg text-graphite mt-5">{trait}</p>
                </li>
              ))}
            </ul>

            <p className="text-steel mt-14 max-w-2xl leading-relaxed">
              {FOUNDING_STATEMENT} That makes this a veteran franchise company
              by origin rather than by positioning, and veterans considering
              ownership are encouraged to make contact.
            </p>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          SUPPORT MODEL
          --------------------------------------------------------------- */}
      <section className="bg-chalk">
        <Container>
          <Band>
            <SectionLabel>The support model</SectionLabel>
            <h2 className="display-2 mt-8 max-w-3xl text-balance">
              What an operator inherits.
            </h2>
            {/*
              Qualitative only. Describing what support exists is permitted;
              quantifying what it produces is not. If a sentence here ever
              grows a number, it is almost certainly a financial performance
              representation wearing a different coat.
            */}
            <p className="body-lg text-steel mt-8 max-w-2xl">
              These four parts are what a home services franchise system is made
              of, described in plain terms and without any claim about what they
              produce. Results depend on the operator, the market, and the work.
            </p>

            <div className="mt-16 space-y-12">
              {CAPABILITIES.map((capability, index) => (
                <Register
                  key={capability.title}
                  index={index + 1}
                  label={capability.title}
                >
                  <h3 className="display-3 max-w-2xl">{capability.title}</h3>
                  <p className="text-graphite mt-5 max-w-2xl leading-relaxed">
                    {capability.body}
                  </p>
                </Register>
              ))}
            </div>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          MATERIAL BREAK
          --------------------------------------------------------------- */}
      <section className="bg-graphite text-zinc relative isolate overflow-hidden">
        <MaterialPlate id="franchising-material" intensity="quiet" />
        <Container>
          <div className="relative py-20 sm:py-24">
            <p className="display-3 max-w-3xl text-balance">
              Standards are only real when something measures them and somebody
              is accountable for the reading.
            </p>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          THE PROCESS

          The register is permitted here because this is genuinely
          sequential: step three cannot happen before step two, and the
          last step is conditional on the one before it.
          --------------------------------------------------------------- */}
      <section className="bg-zinc">
        <Container>
          <Band>
            <SectionLabel>The process</SectionLabel>
            <h2 className="display-2 mt-8 max-w-3xl text-balance">
              Inquiry to conversation, described honestly.
            </h2>
            <p className="body-lg text-steel mt-8 max-w-2xl">
              There is no sales pipeline here and no automated sequence to get
              dropped into. What follows is what actually happens, including the
              part where either side decides it is not a fit.
            </p>

            <div className="mt-16 space-y-12">
              {INQUIRY_PROCESS.map((step, index) => (
                <Register
                  key={step.title}
                  index={index + 1}
                  label={`Step ${index + 1}`}
                >
                  <h3 className="display-3 max-w-2xl">{step.title}</h3>
                  <p className="text-graphite mt-5 max-w-2xl leading-relaxed">
                    {step.body}
                  </p>
                </Register>
              ))}
            </div>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          FAQ
          --------------------------------------------------------------- */}
      <section className="bg-chalk">
        <Container>
          <Band>
            <SectionLabel>Questions</SectionLabel>
            <h2 className="display-2 mt-8 max-w-3xl text-balance">
              The questions a serious operator asks.
            </h2>
            <p className="body-lg text-steel mt-8 max-w-2xl">
              Including the two that cannot be answered yet, and why. A page
              that quietly skips cost and earnings is telling you something; so
              is a page that answers them before handing you a disclosure
              document.
            </p>

            {/*
              A ruled schedule, not an accordion. Every answer is short enough
              to read, and hiding legally sensitive answers behind a click is
              the wrong instinct on this page of all pages.

              No FAQPage schema. Google restricted that rich result to
              government and health sites, so emitting it here would add markup
              that produces nothing, and structured data on a page this
              constrained is extra surface for a claim to hide in.
            */}
            <dl className="border-rule mt-14 border-t">
              {FRANCHISE_FAQ.map((entry) => (
                <div
                  key={entry.q}
                  className="border-rule reveal grid gap-4 border-b py-8 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-12"
                >
                  <dt className="display-3 text-graphite">{entry.q}</dt>
                  <dd className="text-graphite max-w-2xl leading-relaxed">
                    {entry.a}
                  </dd>
                </div>
              ))}
            </dl>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          INQUIRY
          --------------------------------------------------------------- */}
      <section className="bg-zinc">
        <Container>
          <Band>
            <SectionLabel>Inquiry</SectionLabel>
            <h2 className="display-2 mt-8 max-w-3xl text-balance">
              Start a conversation.
            </h2>
            <p className="body-lg text-steel mt-8 max-w-2xl">
              This is an inquiry, not an application. It asks for nothing
              sensitive, commits you to nothing, and is read by a person.
            </p>

            {/*
              IN-BODY DISCLAIMER. Verbatim from FRANCHISE_DISCLAIMER, placed
              directly above the form rather than only in the title block. Do
              not reword it, do not summarise it, and do not move it below the
              submit button.
            */}
            {/*
              The ONE piece of red on this site that is not a control. Red means
              act or do not miss this, and an unissued FDD disclaimer sitting
              directly above an inquiry form is the second of those. It stays
              distinguishable from a form error because failures are amber and
              always carry a mono FAULT tag.
            */}
            <div className="border-signal bg-chalk mt-12 max-w-xl border-l-2 p-7">
              <h3 className="label-sm text-signal">Important legal notice</h3>
              <p className="text-steel mt-4 text-[0.9375rem] leading-relaxed">
                {FRANCHISE_DISCLAIMER}
              </p>
            </div>

            <div className="mt-12">
              <FranchiseForm />
            </div>
          </Band>
        </Container>
      </section>

      <TitleBlock sheet="Franchising" />

      <JsonLd
        data={breadcrumbSchema([{ name: "Franchising", path: "/franchising" }])}
      />
    </>
  );
}
