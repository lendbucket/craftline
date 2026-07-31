import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { Cta } from "@/components/cta";
import { SystemSpine } from "@/components/graphic";
import { JsonLd } from "@/components/json-ld";
import { Eyebrow, PageHeader } from "@/components/page-header";
import { FRANCHISE_DISCLAIMER } from "@/config/company";
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
 * A list, not a magazine. There are three posts, so there is no pagination, no
 * tag taxonomy, and no featured slot: building navigation for a volume of
 * content that does not exist is how a section starts looking abandoned.
 *
 * No author bylines anywhere in this section. The founder's name is never
 * rendered on this property, and corporate authorship is also the truthful
 * description of what these are. See articleSchema in src/lib/schema.ts.
 */
export default function InsightsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="How trade service businesses and franchise systems actually work."
        lead="Category writing for people evaluating this kind of business. No statistics anyone cannot source, no figures about what an operator might earn, and nothing here is an offer."
      />

      <section className="bg-paper">
        <Container wide>
          <div className="py-20 sm:py-24">
            <ul className="space-y-8">
              {ORDERED_INSIGHTS.map((insight) => (
                <li key={insight.slug}>
                  <article className="rounded-lg border border-ink/10 bg-white p-7 sm:p-10">
                    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                      <Eyebrow>{insight.eyebrow}</Eyebrow>
                      {/*
                        A real date, hardcoded in the post data. It is the one
                        piece of metadata a reader can use to judge whether a
                        piece is current, so it must never be a build timestamp.
                      */}
                      <time
                        dateTime={insight.published}
                        className="text-xs text-muted"
                      >
                        {formatPublished(insight.published)}
                      </time>
                    </div>

                    <h2 className="display-md mt-5 max-w-3xl">
                      <Link
                        href={`/insights/${insight.slug}`}
                        className="tap-44 hover:text-bronze"
                      >
                        {insight.title}
                      </Link>
                    </h2>

                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
                      {insight.description}
                    </p>

                    <Link
                      href={`/insights/${insight.slug}`}
                      className="tap-44 mt-7 inline-flex min-h-11 items-center text-sm font-semibold text-bronze hover:underline"
                    >
                      Read this
                      <span className="sr-only">: {insight.title}</span>
                    </Link>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* WHAT THIS SECTION IS FOR */}
      <section className="bg-ink text-paper">
        <Container wide>
          <div className="py-20 sm:py-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,22rem)]">
              <div>
                <Eyebrow>Why this section exists</Eyebrow>
                <h2 className="display-lg mt-5 max-w-2xl text-paper">
                  Information, published before there is anything to sell.
                </h2>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-dark">
                  Craftline is developing its franchise programme and no
                  Franchise Disclosure Document has been issued. Until one is,
                  there is nothing to offer and no terms to discuss. What can be
                  done honestly in the meantime is to set out how this kind of
                  business works, so that anyone who eventually looks at a real
                  disclosure document arrives already understanding the
                  structure.
                </p>
                <div className="mt-10">
                  <Cta href="/franchising">Franchise information</Cta>
                </div>
              </div>
              {/*
                Decorative geometry, aria-hidden at the component. It echoes the
                four part structure the third article describes and carries no
                information that is not in the text.
              */}
              <SystemSpine className="hidden w-full text-bronze-bright lg:block" />
            </div>
          </div>
        </Container>
      </section>

      {/*
        FRANCHISE DISCLAIMER, verbatim and in the page body, in addition to the
        global instance in the site footer. Every franchise related page carries
        it, and a section devoted to writing about franchise systems is
        emphatically one of those.
      */}
      <section className="bg-paper-dark">
        <Container>
          <div className="py-12">
            <p className="max-w-4xl text-xs leading-relaxed text-muted">
              {FRANCHISE_DISCLAIMER}
            </p>
          </div>
        </Container>
      </section>

      <JsonLd
        data={breadcrumbSchema([{ name: "Insights", path: "/insights" }])}
      />
    </>
  );
}
