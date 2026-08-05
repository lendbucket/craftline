import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Cta } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { CtaBand, CtaPrompt } from "@/components/cta-band";
import { Band, Card, SectionHeading } from "@/components/section";
import {
  BRANDS,
  CAPABILITIES,
  COMPANY,
  FOUNDING_STATEMENT,
  LEGAL_ENTITIES,
} from "@/config/company";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Craftline Brands is a franchise development company that owns the marks, the operating playbooks, and the technology behind the skilled trade service brands it builds. Veteran founded, held through two Wyoming entities.",
  path: "/about",
});

/**
 * About.
 *
 * WHAT THIS PAGE IS FOR: a franchise prospect, an attorney, or a lender
 * working out who they would actually be dealing with. That means the
 * corporate structure in plain language, what the company does and does not
 * do, and how it thinks about the work. It is not a story page and there is no
 * origin narrative, because most of what one would contain is not established.
 *
 * THE FOUNDER'S NAME NEVER RENDERS, here or anywhere: not in copy, metadata,
 * schema, image alt text, or the sitemap. FOUNDING_STATEMENT is the only
 * permitted reference and it carries no name by design.
 *
 * NO TEAM SECTION, no headcount, no offices, no history timeline, no
 * testimonials, no press. None of those are established, and a corporate about
 * page that invents them is the exact failure this property exists to avoid.
 *
 * Every fact traces to src/config/company.ts.
 */

/**
 * What each part of the model does NOT do.
 *
 * This is the most useful content on the page and the least common. A
 * capability list that only claims strengths reads as marketing; the limits
 * are what a serious operator is actually trying to work out, and stating them
 * is cheap for a company that means them.
 *
 * Keyed by capability title so it cannot silently drift out of step with
 * CAPABILITIES. A new capability added to config without an entry here renders
 * nothing rather than the wrong text.
 */
const LIMITS: Record<string, string> = {
  "Brand systems":
    "It does not make the work good. A mark on a van is a promise about a standard, and it is worth exactly as much as the method behind it. A brand licensed widely without that method behind it degrades the thing it is renting out, and every operator's bad job lands on every other operator.",
  "Operating playbooks":
    "It is not a substitute for judgement, and it is not fixed. A playbook written once and never revised becomes fiction, and everyone working under it learns to ignore it. There has to be a route for an operator to say this step does not work in my market, and a means of testing that and changing the document.",
  Technology:
    "It does not manage anybody. Instrumentation makes a standard observable, which is the only reason a written standard is enforceable at all, but measurement drifts toward whatever is easy to count. A system that watches only the convenient numbers will optimise for those and miss the work quality it actually cares about.",
  "Territory expansion":
    "It is not a line drawn on a map from an office. Service areas are shaped by drive times, traffic, and where technicians actually live, and a boundary that ignores those hands an operator an area they cannot serve well. Sequencing markets is a judgement about readiness, not a land grab.",
};

export default function AboutPage() {
  const [wattsmith] = BRANDS;

  return (
    <>
      <PageHeader
        label="About"
        title="Craftline sits behind the brand, not in front of the customer."
        lead={`${COMPANY.name} owns the marks, the operating playbooks, the technology, and the territory plan. The operator runs the business in their own market. The standard is set once and held everywhere the brand appears.`}
        ctaHref="/franchising#inquiry"
        ctaLabel="Franchise inquiry"
        secondaryHref="/franchising"
        secondaryLabel="How franchising works"
      />

      {/* ---------------------------------------------------------------
          WHAT THE COMPANY IS
          --------------------------------------------------------------- */}
      <section className="bg-white">
        <Container>
          <Band>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
              <div>
                <SectionHeading eyebrow="The company" title="What Craftline is." />
                <div className="prose-body mt-6 space-y-5">
                  <p>
                    Craftline Brands is a holding company. It does not perform
                    electrical work, it does not take service calls, and it has
                    no customers in the ordinary sense. What it owns is the
                    intangible half of a trade services business: the
                    trademarks, the documented way of operating, the software
                    stack, and the plan for where a brand goes next.
                  </p>
                  <p>
                    That separation is the point of the structure. An operating
                    business is consumed by the day: the calls, the scheduling,
                    the hiring, the collections. Work on the system itself loses
                    to work in the business every single time, which is why most
                    independent trade companies never build one. Putting the
                    system in a separate company, with its own responsibility
                    for it, is how the system gets built at all.
                  </p>
                  <p>
                    {FOUNDING_STATEMENT} The brand operating under it is veteran
                    owned as well, which makes this veteran founded by origin
                    rather than by positioning.
                  </p>
                </div>
              </div>

              <Card className="h-fit">
                <h3 className="h3">Corporate structure</h3>
                <p className="text-steel mt-3 text-[0.9375rem] leading-relaxed">
                  Two entities, both registered in{" "}
                  {LEGAL_ENTITIES[0].jurisdiction}. A prospective operator is
                  entitled to know which one holds what, and it is verifiable.
                </p>
                <dl className="mt-6 space-y-5">
                  {LEGAL_ENTITIES.map((entity) => (
                    <div key={entity.name}>
                      <dt className="text-graphite font-semibold">
                        {entity.name}
                      </dt>
                      <dd className="text-steel mt-1 leading-relaxed">
                        {entity.role}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Card>
            </div>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          THE MODEL, WITH ITS LIMITS
          --------------------------------------------------------------- */}
      <section className="bg-mist">
        <Container>
          <Band>
            <SectionHeading
              eyebrow="The model"
              title="Four parts, and what each one does not do."
              lead="A capability list that only claims strengths is marketing. The limits below are what a serious operator is actually trying to work out, and stating them costs nothing for a company that means them."
            />

            <CtaPrompt
              className="mt-10 max-w-2xl"
              title="Want to know how this would work for an operator?"
              lead="The franchising section explains the structure in full, and an inquiry reaches a person who can answer the rest."
            />

            <div className="mt-12 space-y-5">
              {CAPABILITIES.map((capability) => (
                <Card key={capability.title}>
                  <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
                    <div>
                      <h3 className="h3">{capability.title}</h3>
                      <p className="mt-3 leading-relaxed text-graphite">
                        {capability.body}
                      </p>
                    </div>
                    {LIMITS[capability.title] ? (
                      <div className="border-line border-l-2 pl-5">
                        <p className="text-graphite text-[0.9375rem] font-semibold">
                          What it does not do
                        </p>
                        <p className="text-steel mt-2 leading-relaxed">
                          {LIMITS[capability.title]}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </Card>
              ))}
            </div>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          THE BRAND TODAY
          --------------------------------------------------------------- */}
      <section className="bg-white">
        <Container>
          <Band>
            <SectionHeading
              eyebrow="The brand today"
              title="One operating brand, built first on purpose."
              lead={`${wattsmith.summary} It is the brand the systems above were built on and tested against, which is the only order that produces a playbook worth handing to somebody.`}
            />
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Cta href={`/brands/${wattsmith.slug}`}>
                About {wattsmith.name}
              </Cta>
              <Cta href="/franchising" variant="secondary">
                How franchising works
              </Cta>
            </div>
          </Band>
        </Container>
      </section>

      <CtaBand
        title="Questions about the company?"
        lead="Ask them before there is anything to decide. An inquiry is read by a person and commits you to nothing."
        secondaryHref="/brands"
        secondaryLabel="The brands Craftline operates"
      />

      <JsonLd data={breadcrumbSchema([{ name: "About", path: "/about" }])} />
    </>
  );
}
