import type { Metadata } from "next";
import { Cta, CtaRow } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { CtaBand, CtaPrompt } from "@/components/cta-band";
import { RuledRow, RuledRows } from "@/components/system/ruled-list";
import { Section } from "@/components/system/section";
import { SectionHead } from "@/components/system/section-head";
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
 *
 * PHASE 2A. The model section is the reason this page is laid out the way it
 * is. Four capabilities, each with a limit stated beside it, is the densest
 * argument on the site, and the previous treatment stacked four identical cards
 * with the limit in a left ruled column inside each. That made the limit look
 * like an aside. It is the point of the section, so it now sits in the same
 * ruled row as the capability it belongs to, at the same weight.
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
          Serif prose left, corporate structure right. The prose column is the
          first place on this page the reading face appears, and it is set at a
          real measure rather than at container width.
          --------------------------------------------------------------- */}
      <Section ground="white">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <SectionHead
              eyebrow="The company"
              tone="signal"
              title="What Craftline is."
              compact
            />
            <div className="prose-body mt-8 max-w-[62ch] space-y-5">
              <p>
                Craftline Brands is a holding company. It does not perform
                electrical work, it does not take service calls, and it has no
                customers in the ordinary sense. What it owns is the intangible
                half of a trade services business: the trademarks, the documented
                way of operating, the software stack, and the plan for where a
                brand goes next.
              </p>
              <p>
                That separation is the point of the structure. An operating
                business is consumed by the day: the calls, the scheduling, the
                hiring, the collections. Work on the system itself loses to work
                in the business every single time, which is why most independent
                trade companies never build one. Putting the system in a separate
                company, with its own responsibility for it, is how the system
                gets built at all.
              </p>
              <p>
                {FOUNDING_STATEMENT} The brand operating under it is veteran
                owned as well, which makes this veteran founded by origin rather
                than by positioning.
              </p>
            </div>
          </div>

          <div>
            <h2 className="label-sm">Corporate structure</h2>
            <p className="text-steel mt-4 max-w-[42ch] text-[0.9375rem] leading-relaxed">
              Two entities, both registered in {LEGAL_ENTITIES[0].jurisdiction}.
              A prospective operator is entitled to know which one holds what,
              and it is verifiable.
            </p>
            {/*
              The entity names take the two brand colours, which is the import's
              treatment of this block. Red measures 5.93 on white and blue 6.32,
              both AA for normal text. The colour marks that these are two
              distinct legal persons rather than one company described twice,
              which is the single thing this panel exists to say.
            */}
            <RuledRows className="mt-7">
              {LEGAL_ENTITIES.map((entity, index) => (
                <RuledRow
                  key={entity.name}
                  term={entity.name}
                  termClassName={
                    "d3 " + (index % 2 === 0 ? "text-signal" : "text-datum")
                  }
                >
                  {entity.role}
                </RuledRow>
              ))}
            </RuledRows>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          THE MODEL, WITH ITS LIMITS
          --------------------------------------------------------------- */}
      <Section ground="mist" edge>
        <SectionHead
          eyebrow="The model"
          tone="datum"
          title="Four parts, and what each one does not do."
          aside="A capability list that only claims strengths is marketing. The limits below are what a serious operator is actually trying to work out, and stating them costs nothing for a company that means them."
        />

        {/*
          Capability and limit in one ruled row, at equal weight. The previous
          treatment put the limit in a bordered column inside a card, which read
          as a footnote to the claim above it. It is not a footnote: a reader
          who takes this page seriously is here for the right hand column.
        */}
        <div className="border-graphite mt-14 border-t-2">
          {CAPABILITIES.map((capability, index) => (
            <div
              key={capability.title}
              className="border-line grid gap-x-12 gap-y-6 border-b py-9 lg:grid-cols-2"
            >
              <div>
                {/*
                  The numeral runs down the left of the model, alternating red
                  and blue. Inline here rather than knocked out of a rule,
                  because these are rows in a table rather than bounded blocks.
                */}
                <span
                  aria-hidden="true"
                  className={
                    "font-display block text-4xl leading-none font-extrabold tabular-nums " +
                    (index % 2 === 0 ? "text-signal" : "text-datum")
                  }
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="d3 mt-4">{capability.title}</h3>
                <p className="text-graphite mt-4 max-w-[58ch] leading-relaxed">
                  {capability.body}
                </p>
              </div>
              {LIMITS[capability.title] ? (
                <div>
                  <p className="label-sm">What it does not do</p>
                  <p className="text-steel mt-4 max-w-[58ch] leading-relaxed">
                    {LIMITS[capability.title]}
                  </p>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <CtaPrompt
          className="mt-14 max-w-3xl"
          title="Want to know how this would work for an operator?"
          lead="The franchising section explains the structure in full, and an inquiry reaches a person who can answer the rest."
        />
      </Section>

      {/* ---------------------------------------------------------------
          THE BRAND TODAY
          A tight band. It is a signpost to another page, not a section that
          has to carry an argument.
          --------------------------------------------------------------- */}
      <Section ground="white" density="tight">
        <SectionHead
          eyebrow="The brand today"
          tone="signal"
          title="One operating brand, built first on purpose."
          lead={`${wattsmith.summary} It is the brand the systems above were built on and tested against, which is the only order that produces a playbook worth handing to somebody.`}
        />
        <CtaRow className="mt-10">
          <Cta href={`/brands/${wattsmith.slug}`}>About {wattsmith.name}</Cta>
          <Cta href="/franchising" variant="secondary">
            How franchising works
          </Cta>
        </CtaRow>
      </Section>

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
