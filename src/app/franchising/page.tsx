import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { FranchiseForm } from "@/components/form/franchise-form";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { Band, Card, SectionHeading } from "@/components/section";
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
 * THE MOST LEGALLY CONSTRAINED PAGE ON THIS SITE, and now also the longest,
 * because it is the education section. Read the rules before editing anything.
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
 */
export default function FranchisingPage() {
  return (
    <>
      <PageHeader
        label="Franchising"
        title="How franchising works, and what Craftline is building."
        lead="This section is written for someone evaluating a franchise for the first time. It explains the structure, the vocabulary, and the document that governs the decision, before it says anything about this company."
      />

      {/* ---------------------------------------------------------------
          WHAT A FRANCHISE IS
          --------------------------------------------------------------- */}
      <section className="bg-white">
        <Container>
          <Band>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
              <div>
                <SectionHeading
                  eyebrow="The basics"
                  title="What a franchise actually is."
                />
                <div className="prose-body mt-6 space-y-5">
                  <p>
                    A franchise is a licence. One company owns a brand and a
                    documented way of operating, and it licenses another party
                    the right to run a business using both. The person who takes
                    that licence owns their business and carries its risk. What
                    they are buying is not the business itself but the brand,
                    the method, and the support behind them.
                  </p>
                  <p>
                    That arrangement is why franchising exists in trade services
                    at all. The technical work is well understood and a
                    competent contractor can already do it. What sinks these
                    businesses is rarely the trade. It is scheduling, pricing,
                    hiring, collections, marketing, and the administrative load
                    that arrives with the second van. A franchise system is an
                    attempt to solve those problems once, centrally, and then
                    hand the solution to each operator.
                  </p>
                  <p>
                    It is not a passive investment and it is not a job. It sits
                    between the two, and the obligations run in both directions.
                    The operator agrees to run the business to a standard. The
                    franchisor agrees to maintain the brand and provide the
                    support it promised. Either side can fail to hold up its
                    end, which is exactly what the disclosure document and the
                    franchise agreement exist to make legible before anyone
                    signs.
                  </p>
                </div>
              </div>

              <Card className="h-fit">
                <h3 className="h3">In this section</h3>
                <ul className="mt-4 space-y-2">
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
                    <li key={href}>
                      <Link href={href} className="link tap-44 text-[0.9375rem]">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          THE VOCABULARY
          --------------------------------------------------------------- */}
      <section id="vocabulary" className="bg-mist scroll-mt-8">
        <Container>
          <Band>
            <SectionHeading
              eyebrow="The vocabulary"
              title="The words you are expected to already know."
              lead="Every term below describes how franchising works generally. Where a term normally carries a number, the number belongs in a disclosure document rather than on a website, so this explains the mechanism instead."
            />

            <dl className="mt-12 grid gap-5 sm:grid-cols-2">
              {FRANCHISE_GLOSSARY.map((entry) => (
                <Card key={entry.term}>
                  <dt className="h3">{entry.term}</dt>
                  <dd className="text-steel mt-3 leading-relaxed">
                    {entry.body}
                  </dd>
                </Card>
              ))}
            </dl>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          THE FDD
          --------------------------------------------------------------- */}
      <section id="fdd" className="bg-white scroll-mt-8">
        <Container>
          <Band>
            <SectionHeading
              eyebrow="Disclosure"
              title="What a Franchise Disclosure Document is, and why it exists."
              lead="This is the single most important document in the decision, and most people evaluating a franchise have never seen one. Craftline has not issued one, so there is nothing to offer yet. Understanding it now is what makes the eventual reading useful."
            />

            <div className="border-line divide-line mt-12 divide-y rounded-lg border">
              {FDD_EXPLAINER.map((entry) => (
                <div key={entry.heading} className="p-6 sm:p-7">
                  <h3 className="h3">{entry.heading}</h3>
                  <p className="text-steel mt-3 max-w-3xl leading-relaxed">
                    {entry.body}
                  </p>
                </div>
              ))}
            </div>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          DUE DILIGENCE
          --------------------------------------------------------------- */}
      <section id="diligence" className="bg-mist scroll-mt-8">
        <Container>
          <Band>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
              <SectionHeading
                eyebrow="Due diligence"
                title="How to check any franchise system, including this one."
                lead="This advice is against a franchisor's short term interest and it is here anyway. A system does not benefit from operators who joined without understanding what they joined."
              />
              <ul className="space-y-4">
                {DUE_DILIGENCE.map((item) => (
                  <li
                    key={item}
                    className="border-line rounded-lg border bg-white p-5 leading-relaxed text-graphite"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          WHAT CRAFTLINE PROVIDES
          --------------------------------------------------------------- */}
      <section id="support" className="bg-white scroll-mt-8">
        <Container>
          <Band>
            <SectionHeading
              eyebrow="What Craftline provides"
              title="What an operator would inherit."
              lead="Described qualitatively and deliberately so. Saying what support exists is permitted. Quantifying what it produces would be a financial performance representation, so no sentence here carries a number."
            />

            <ul className="mt-12 grid gap-5 sm:grid-cols-2">
              {CAPABILITIES.map((capability) => (
                <Card as="li" key={capability.title}>
                  <h3 className="h3">{capability.title}</h3>
                  <p className="text-steel mt-3 leading-relaxed">
                    {capability.body}
                  </p>
                </Card>
              ))}
            </ul>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          WHAT CRAFTLINE LOOKS FOR
          --------------------------------------------------------------- */}
      <section id="operators" className="bg-mist scroll-mt-8">
        <Container>
          <Band>
            <SectionHeading
              eyebrow="Who this is for"
              title="What Craftline looks for in an operator."
              lead="Traits rather than qualifications. There is no experience requirement and no background requirement stated anywhere on this site, because a stated threshold is a claim about who will be accepted and no such claim can be made before disclosure."
            />

            <ul className="mt-12 grid gap-5 sm:grid-cols-3">
              {OPERATOR_PROFILE.map((trait) => (
                <Card as="li" key={trait}>
                  <p className="leading-relaxed text-graphite">{trait}</p>
                </Card>
              ))}
            </ul>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          THE PROCESS
          --------------------------------------------------------------- */}
      <section id="process" className="bg-white scroll-mt-8">
        <Container>
          <Band>
            <SectionHeading
              eyebrow="The process"
              title="From an inquiry to an opening."
              lead="Four steps, and the fourth one has not happened yet. No Franchise Disclosure Document has been issued and no date is being committed to."
            />

            <ol className="mt-12 grid gap-5 sm:grid-cols-2">
              {INQUIRY_PROCESS.map((step, index) => (
                <Card as="li" key={step.title}>
                  <p className="text-datum text-[0.9375rem] font-semibold">
                    Step {index + 1}
                  </p>
                  <h3 className="h3 mt-2">{step.title}</h3>
                  <p className="text-steel mt-3 leading-relaxed">{step.body}</p>
                </Card>
              ))}
            </ol>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          FAQ
          --------------------------------------------------------------- */}
      <section id="faq" className="bg-mist scroll-mt-8">
        <Container>
          <Band>
            <SectionHeading
              eyebrow="Questions"
              title="The questions a serious operator asks."
              lead="Including the two that cannot be answered yet, and why."
            />

            <dl className="border-line divide-line mt-12 divide-y rounded-lg border bg-white">
              {FRANCHISE_FAQ.map((entry) => (
                <div key={entry.q} className="p-6 sm:p-7">
                  <dt className="h3">{entry.q}</dt>
                  <dd className="text-steel mt-3 max-w-3xl leading-relaxed">
                    {entry.a}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="text-steel mt-10 leading-relaxed">
              More on how these businesses work:{" "}
              {ORDERED_INSIGHTS.map((insight, index) => (
                <span key={insight.slug}>
                  {index > 0 ? ", " : ""}
                  <Link
                    href={`/insights/${insight.slug}`}
                    className="link tap-44"
                  >
                    {insight.title}
                  </Link>
                </span>
              ))}
              .
            </p>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          INQUIRY
          --------------------------------------------------------------- */}
      <section id="inquiry" className="bg-white scroll-mt-8">
        <Container>
          <Band>
            <SectionHeading
              eyebrow="Make an inquiry"
              title="Start a conversation."
              lead="This is an inquiry, not an application. It asks for nothing sensitive, commits you to nothing, and is read by a person."
            />

            {/*
              IN-BODY DISCLAIMER. Verbatim from FRANCHISE_DISCLAIMER, placed
              directly above the form rather than only in the footer. Do not
              reword it, do not summarise it, and do not move it below the
              submit button.

              Styled as plain bordered legal text rather than as a coloured
              callout. A red box around it would read as marketing emphasis
              rather than as the standing legal statement it is.
            */}
            <div className="border-line mt-10 max-w-2xl rounded-lg border bg-mist p-6">
              <h3 className="text-graphite text-[0.9375rem] font-semibold">
                Important legal notice
              </h3>
              <p className="text-steel mt-3 text-[0.9375rem] leading-relaxed">
                {FRANCHISE_DISCLAIMER}
              </p>
            </div>

            <div className="mt-10">
              <FranchiseForm />
            </div>
          </Band>
        </Container>
      </section>

      <JsonLd
        data={breadcrumbSchema([{ name: "Franchising", path: "/franchising" }])}
      />
    </>
  );
}
