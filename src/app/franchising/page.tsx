import type { Metadata } from "next";
import { Container } from "@/components/container";
import { FranchiseForm } from "@/components/form/franchise-form";
import { Eyebrow, PageHeader } from "@/components/page-header";
import {
  CAPABILITIES,
  FOUNDING_STATEMENT,
  FRANCHISE_DISCLAIMER,
  OPERATOR_PROFILE,
} from "@/config/company";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Franchising",
  description:
    "Information about Craftline Brands franchise development: what the company looks for in an operator and how the support model works. Information and inquiry only.",
  path: "/franchising",
});

/**
 * Franchising page.
 *
 * THE MOST LEGALLY CONSTRAINED PAGE ON THIS SITE. Read the rules before editing
 * anything here.
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
 * The disclaimer renders twice on this page by design: once here in the body,
 * directly above the form where a prospective operator is actually reading, and
 * once in the global footer. Duplication is the point. Someone who fills in a
 * form should not have to scroll past it to find the thing that says this is
 * not an offer.
 */
export default function FranchisingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Franchising"
        title="Franchise development at Craftline Brands."
        lead="This page is information and inquiry only. It describes what the company looks for in an operator and how the support model works."
      />

      {/* WHAT WE LOOK FOR */}
      <section className="bg-paper">
        <Container>
          <div className="py-20 sm:py-24">
            <Eyebrow>What we look for</Eyebrow>
            <h2 className="display-lg mt-5 max-w-2xl">
              The operator matters more than the market.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
              A good market with the wrong operator is a bad outcome that takes
              two years to become obvious. These are the things that actually
              predict whether this works.
            </p>

            <ul className="mt-12 max-w-2xl space-y-6">
              {OPERATOR_PROFILE.map((trait) => (
                <li
                  key={trait}
                  className="border-l-2 border-bronze pl-6 text-base leading-relaxed text-ink"
                >
                  {trait}
                </li>
              ))}
            </ul>

            <p className="mt-10 max-w-2xl text-base leading-relaxed text-muted">
              {FOUNDING_STATEMENT} Veterans considering ownership are encouraged
              to make contact.
            </p>
          </div>
        </Container>
      </section>

      {/* SUPPORT MODEL */}
      <section className="bg-paper-dark">
        <Container wide>
          <div className="py-20 sm:py-24">
            <Eyebrow>The support model</Eyebrow>
            <h2 className="display-lg mt-5 max-w-2xl">
              What an operator inherits.
            </h2>
            {/*
              Qualitative only. Describing what support exists is permitted;
              quantifying what it produces is not. If a sentence here ever grows
              a number, it is almost certainly a financial performance
              representation wearing a different coat.
            */}
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
              Described in plain terms, without claims about what any of it
              produces. Results depend on the operator, the market, and the
              work.
            </p>

            <ul className="mt-14 grid gap-px overflow-hidden rounded-lg bg-ink/10 sm:grid-cols-2">
              {CAPABILITIES.map((capability) => (
                <li key={capability.title} className="bg-paper-dark p-7 sm:p-8">
                  <h3 className="display-md">{capability.title}</h3>
                  <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">
                    {capability.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* INQUIRY */}
      <section className="bg-paper">
        <Container>
          <div className="py-20 sm:py-24">
            <Eyebrow>Inquiry</Eyebrow>
            <h2 className="display-lg mt-5 max-w-2xl">
              Start a conversation.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
              This is an inquiry, not an application. It asks for nothing
              sensitive, commits you to nothing, and is read by a person.
            </p>

            {/*
              IN-BODY DISCLAIMER. Verbatim from FRANCHISE_DISCLAIMER, placed
              directly above the form rather than only in the footer. Do not
              reword it, do not summarise it, and do not move it below the
              submit button.
            */}
            <div className="mt-10 max-w-xl border-l-2 border-bronze bg-paper-dark p-6">
              <h3 className="tracked-caps text-[0.65rem] text-bronze">
                Important legal notice
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-ink-600">
                {FRANCHISE_DISCLAIMER}
              </p>
            </div>

            <div className="mt-12">
              <FranchiseForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
