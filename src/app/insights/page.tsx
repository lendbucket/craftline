import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { Cta } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { MaterialPlate } from "@/components/material-plate";
import { PageHeader } from "@/components/page-header";
import { Band, SectionLabel } from "@/components/section";
import { TitleBlock } from "@/components/title-block";
import { formatPublished, ORDERED_INSIGHTS } from "@/data/insights";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Insights",
  description:
    "Writing on skilled trades franchise systems: what makes trade service businesses suit franchising, what veteran operators bring to them, and how a brand system works.",
  path: "/insights",
});

/**
 * Insights hub.
 *
 * A schedule of pieces, not a magazine. There are three posts, so there is no
 * pagination, no tag taxonomy, and no featured slot: building navigation for a
 * volume of content that does not exist is how a section starts looking
 * abandoned.
 *
 * Kraft ground, because this is a reading surface. That is the whole reason
 * kraft exists in the palette and it is not used as a general alternate band
 * elsewhere.
 *
 * No author bylines anywhere in this section. The founder's name is never
 * rendered on this property, and corporate authorship is also the truthful
 * description of what these are. See articleSchema in src/lib/schema.ts.
 */
export default function InsightsPage() {
  return (
    <>
      <PageHeader
        label="Insights"
        title="How trade service businesses and franchise systems actually work."
        lead="Category writing for people evaluating this kind of business. No statistics anyone cannot source, no figures about what an operator might earn, and nothing here is an offer."
      />

      <section className="bg-kraft">
        <Container>
          <Band>
            {/*
              A ruled schedule. Each row is date, category, title, summary,
              which is the register a document index uses rather than a grid of
              cards with equal visual weight.
            */}
            <ol className="border-rule border-t">
              {ORDERED_INSIGHTS.map((insight) => (
                <li key={insight.slug} className="border-rule border-b">
                  <article className="reveal grid gap-5 py-10 lg:grid-cols-[minmax(0,14rem)_1fr] lg:gap-12">
                    <div>
                      <p className="label-sm text-copper">{insight.eyebrow}</p>
                      {/*
                        A real date, hardcoded in the post data. It is the one
                        piece of metadata a reader can use to judge whether a
                        piece is current, so it must never be a build timestamp.
                      */}
                      <time
                        dateTime={insight.published}
                        className="value text-steel mt-3 block"
                      >
                        {formatPublished(insight.published)}
                      </time>
                    </div>

                    <div>
                      <h2 className="display-3 max-w-3xl">
                        <Link
                          href={`/insights/${insight.slug}`}
                          className="hover:text-copper tap-44 transition-colors"
                        >
                          {insight.title}
                        </Link>
                      </h2>
                      <p className="text-steel mt-5 max-w-2xl leading-relaxed">
                        {insight.description}
                      </p>
                      <Link
                        href={`/insights/${insight.slug}`}
                        className="text-copper tap-44 mt-6 inline-flex min-h-11 items-center text-[0.9375rem] font-semibold hover:underline"
                      >
                        Read this
                        <span className="sr-only">: {insight.title}</span>
                      </Link>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          WHY THIS SECTION EXISTS
          --------------------------------------------------------------- */}
      <section className="bg-graphite text-zinc relative isolate overflow-hidden">
        <MaterialPlate id="insights-texture" intensity="quiet" />
        <Container>
          <Band className="relative">
            <SectionLabel>Why this section exists</SectionLabel>
            <h2 className="display-2 mt-8 max-w-3xl text-balance">
              Information, published before there is anything to sell.
            </h2>
            <p className="body-lg text-steel mt-8 max-w-2xl">
              Craftline is developing its franchise programme and no Franchise
              Disclosure Document has been issued. Until one is, there is
              nothing to offer and no terms to discuss. What can be done
              honestly in the meantime is to set out how this kind of business
              works, so that anyone who eventually reads a real disclosure
              document arrives already understanding the structure and can tell
              a good one from a bad one.
            </p>
            <div className="mt-12">
              <Cta href="/franchising">Franchise information</Cta>
            </div>
          </Band>
        </Container>
      </section>

      <TitleBlock sheet="Insights" />

      <JsonLd
        data={breadcrumbSchema([{ name: "Insights", path: "/insights" }])}
      />
    </>
  );
}
