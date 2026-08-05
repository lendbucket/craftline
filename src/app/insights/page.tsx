import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { Cta } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { CtaBand } from "@/components/cta-band";
import { Band, Card, SectionHeading } from "@/components/section";
import { SectionImage } from "@/components/section-image";
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
 * Part of the franchising education section rather than a separate magazine.
 * The franchising page explains the structure and the vocabulary; these are the
 * longer pieces behind it, and both directions link to each other so a reader
 * who starts in either place can find the rest.
 *
 * There are three posts, so there is no pagination, no tag taxonomy, and no
 * featured slot. Building navigation for a volume of content that does not
 * exist is how a section starts looking abandoned.
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
        lead="Longer guides that sit behind the franchising section. No statistics anyone cannot source, no figures about what an operator might earn, and nothing here is an offer."
        ctaHref="/franchising#inquiry"
        ctaLabel="Franchise inquiry"
        secondaryHref="/franchising"
        secondaryLabel="How franchising works"
      />

      <section className="bg-white">
        <Container>
          <Band>
            <ul className="grid gap-5">
              {ORDERED_INSIGHTS.map((insight) => (
                <Card as="li" key={insight.slug} className="p-0">
                  <Link
                    href={`/insights/${insight.slug}`}
                    className="block h-full rounded-lg p-6 sm:p-7"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <p className="eyebrow">{insight.eyebrow}</p>
                      {/*
                        A real date, hardcoded in the post data. It is the one
                        piece of metadata a reader can use to judge whether a
                        piece is current, so it must never be a build timestamp.
                      */}
                      <time
                        dateTime={insight.published}
                        className="text-steel text-[0.8125rem]"
                      >
                        {formatPublished(insight.published)}
                      </time>
                    </div>
                    <h2 className="h3 mt-3 max-w-3xl">{insight.title}</h2>
                    <p className="text-steel mt-3 max-w-3xl leading-relaxed">
                      {insight.description}
                    </p>
                    <p className="text-datum mt-4 text-[0.9375rem] font-semibold">
                      Read this
                      <span className="sr-only">: {insight.title}</span>
                    </p>
                  </Link>
                </Card>
              ))}
            </ul>
          </Band>
        </Container>
      </section>

      <section className="bg-mist">
        <Container>
          <Band>
            <SectionHeading
              eyebrow="Why this section exists"
              title="Information, published before there is anything to sell."
              lead="Craftline is developing its franchise programme and no Franchise Disclosure Document has been issued. Until one is, there is nothing to offer and no terms to discuss. What can be done honestly in the meantime is to set out how this kind of business works, so that anyone who eventually reads a real disclosure document arrives already understanding the structure and can tell a good one from a bad one."
            />
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Cta href="/franchising">How franchising works</Cta>
              <Cta href="/about" variant="secondary">
                About the company
              </Cta>
            </div>

            <SectionImage
              slot="insights-texture"
              className="mt-12 h-48 w-full sm:h-64"
              sizes="100vw"
            />
          </Band>
        </Container>
      </section>

      <CtaBand
        ground="white"
        title="Still working out whether this suits you?"
        lead="That is the right question to be asking, and it is the one an inquiry is for. You will get a straight answer, including a no."
        secondaryHref="/franchising"
        secondaryLabel="How franchising works"
      />

      <JsonLd
        data={breadcrumbSchema([{ name: "Insights", path: "/insights" }])}
      />
    </>
  );
}
