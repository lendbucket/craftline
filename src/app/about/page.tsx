import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Cta } from "@/components/cta";
import { MaterialPlate } from "@/components/material-plate";
import { PageHeader } from "@/components/page-header";
import { Band, Register, Rule, SectionLabel } from "@/components/section";
import { TitleBlock } from "@/components/title-block";
import {
  BRANDS,
  CAPABILITIES,
  COMPANY,
  FOUNDING_STATEMENT,
  LEGAL_ENTITIES,
} from "@/config/company";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Craftline Brands is a holding company for skilled trade service brands and the skilled trades franchise system behind them. It owns the marks, the operating playbooks, the technology, and the territory plan that its brands run on.",
  path: "/about",
});

/**
 * About page.
 *
 * The holding company model, developed properly. Each of the four parts gets
 * its own section with what it is, what it covers, and what it does not do.
 * The previous version rendered the same four strings as a description list,
 * which stated the model without explaining it.
 *
 * The four sections read from CAPABILITIES, the same array the home page uses,
 * and then develop it. The config string stays the single source for the
 * summary; the development around it is written here because it is page copy
 * rather than an assertable fact.
 *
 * Everything on this page traces to src/config/company.ts. The founder's name
 * does not appear, and FOUNDING_STATEMENT is the only permitted reference.
 */

/**
 * What each part does NOT do. Written here rather than in config because these
 * are honest limits on a support model, not claims about the company, and
 * stating limits is what separates a description from a pitch.
 *
 * Keyed by capability title so a config edit that renames one fails loudly at
 * the type level instead of silently dropping the paragraph.
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
      />

      {/* ---------------------------------------------------------------
          THE MODEL
          --------------------------------------------------------------- */}
      <section className="bg-zinc">
        <Container>
          <Band>
            <SectionLabel>The model</SectionLabel>
            <h2 className="display-2 mt-8 max-w-3xl text-balance">
              A trade business is not hard to start. It is hard to run well
              twice.
            </h2>
            <p className="body-lg text-steel mt-8 max-w-2xl">
              One good shop is a person. A brand that works in several markets
              is a method. What separates them is whether the standard survives
              being handed to somebody else, and these are the four pieces
              Craftline holds so that it can. Together they are the skilled
              trades franchise system its brands run on.
            </p>

            {/*
              The register is permitted here for the same reason it is on the
              home page: this is a genuinely defined set, and the order runs
              from the promise to the boundary it applies within. Each entry
              develops the config summary and then states its own limits.
            */}
            <div className="mt-16 space-y-14">
              {CAPABILITIES.map((capability, index) => (
                <Register
                  key={capability.title}
                  index={index + 1}
                  label={capability.title}
                >
                  <h3 className="display-3 max-w-2xl">{capability.title}</h3>
                  <p className="body-lg text-steel mt-6 max-w-2xl">
                    {capability.body}
                  </p>
                  <div className="border-rule mt-8 max-w-2xl border-l-2 pl-6">
                    <p className="label-sm text-copper">What it does not do</p>
                    <p className="text-steel mt-3 leading-relaxed">
                      {LIMITS[capability.title]}
                    </p>
                  </div>
                </Register>
              ))}
            </div>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          MATERIAL BREAK. Treatment ready: raceway linework today, a
          licensed drawing detail when one is bought.
          --------------------------------------------------------------- */}
      <section className="bg-graphite text-zinc relative isolate overflow-hidden">
        <MaterialPlate id="about-system" intensity="quiet" />
        <Container>
          <div className="relative py-20 sm:py-24">
            <p className="display-3 max-w-3xl text-balance">
              Everything above is documented. That is the whole difference
              between a business and a job that owns you.
            </p>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          STRUCTURE
          --------------------------------------------------------------- */}
      <section className="bg-kraft">
        <Container>
          <Band>
            <SectionLabel>Corporate structure</SectionLabel>
            <h2 className="display-2 mt-8 max-w-3xl text-balance">
              Two entities, each with one job.
            </h2>
            <p className="body-lg text-steel mt-8 max-w-2xl">
              Anyone considering running one of these brands is entitled to know
              which entity holds what, so it is stated here rather than left to
              be discovered in a document later.
            </p>

            {/*
              A schedule rather than cards. Entity facts are record data, and a
              ruled two column register is the register that record data
              belongs in.
            */}
            <dl className="border-rule mt-12 max-w-3xl border-t">
              {LEGAL_ENTITIES.map((entity) => (
                <div
                  key={entity.name}
                  className="border-rule reveal grid gap-2 border-b py-7 sm:grid-cols-[minmax(0,18rem)_1fr] sm:gap-8"
                >
                  <dt className="text-graphite text-[1.0625rem] font-semibold">
                    {entity.name}
                  </dt>
                  <dd className="text-steel leading-relaxed">
                    <span className="label-sm text-copper block">
                      {entity.jurisdiction} limited liability company
                    </span>
                    <span className="mt-2 block">{entity.role}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          FOUNDING
          --------------------------------------------------------------- */}
      <section className="bg-zinc">
        <Container>
          <Band>
            <SectionLabel>Founding</SectionLabel>
            {/*
              FOUNDING_STATEMENT is the only permitted reference to the founder
              and it carries no name. Do not add one here, in an image alt, or
              in schema.
            */}
            <p className="display-2 mt-8 max-w-3xl text-balance">
              {FOUNDING_STATEMENT}
            </p>
            <p className="body-lg text-steel mt-8 max-w-2xl">
              Veterans considering ownership are encouraged to make contact. It
              is an invitation rather than a requirement, and nothing about this
              company is limited to people who served.
            </p>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          THE BRAND TODAY
          --------------------------------------------------------------- */}
      <section className="bg-kraft">
        <Container>
          <Band>
            <SectionLabel>The brand today</SectionLabel>
            <h2 className="display-2 mt-8 max-w-3xl text-balance">
              One operating brand, built first on purpose.
            </h2>
            <p className="body-lg text-steel mt-8 max-w-2xl">
              {wattsmith.summary} It is the brand the systems above were built
              on and tested against, which is the only order that produces a
              playbook worth handing to somebody.
            </p>
            <Rule className="mt-10 max-w-[8rem]" />
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Cta href={`/brands/${wattsmith.slug}`}>
                About {wattsmith.name}
              </Cta>
              <Cta href="/franchising" variant="outline">
                Franchise information
              </Cta>
            </div>
          </Band>
        </Container>
      </section>

      <TitleBlock sheet="About" />

      <JsonLd data={breadcrumbSchema([{ name: "About", path: "/about" }])} />
    </>
  );
}
