import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { Cta } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { Band, SectionHeading } from "@/components/section";
import {
  type Block,
  formatPublished,
  getInsight,
  INSIGHTS,
  ORDERED_INSIGHTS,
} from "@/data/insights";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

/**
 * Insight article.
 *
 * Static over the INSIGHTS array. Body content is structured blocks rather than
 * a markdown string or MDX: it keeps the posts type checked, adds no dependency
 * and no build step, and means the renderer here decides the typography instead
 * of a prose plugin deciding it differently on each page.
 *
 * Kraft ground and a real measure. This is the one part of the site with
 * enough continuous text for reading comfort to be the governing concern, and
 * it is why the body face is a documentary serif rather than a UI sans.
 *
 * Everything legally load bearing about this section is documented at the top
 * of src/data/insights.ts. The short version: no statistics, no financial
 * performance representations, no offer, no geography.
 */

export function generateStaticParams() {
  return INSIGHTS.map((insight) => ({ slug: insight.slug }));
}

// params is a Promise in Next 16. Synchronous access was removed, not deprecated.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const insight = getInsight(slug);
  if (!insight) return {};

  return pageMetadata({
    title: insight.title,
    description: insight.description,
    path: `/insights/${insight.slug}`,
  });
}

/**
 * Renders one content block.
 *
 * Headings are h2 because the post title is the h1. Nothing in the data can
 * emit a heading level, which keeps the document outline correct by
 * construction rather than by review.
 *
 * Each heading carries a short datum rule above it. That is the same device
 * the section labels use, so a long article stays navigable by scanning for
 * the rule rather than by reading heading weights.
 */
function BlockView({ block }: { block: Block }) {
  if (block.kind === "heading") {
    return (
      <h2 className="h2 mt-14 first:mt-0">{block.text}</h2>
    );
  }

  if (block.kind === "list") {
    return (
      <ul className="prose-body mt-6 list-disc space-y-3 pl-6">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return <p className="prose-body mt-6">{block.text}</p>;
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const insight = getInsight(slug);
  if (!insight) notFound();

  // Everything except this post, so the further reading list cannot link to
  // the page it is sitting on.
  const others = ORDERED_INSIGHTS.filter(
    (candidate) => candidate.slug !== insight.slug,
  );

  return (
    <>
      <PageHeader
        label={insight.eyebrow}
        title={insight.title}
        lead={insight.lead}
      />

      <section className="bg-white">
        <Container>
          <Band>
            {/*
              A single measure column. Prose that runs the full container width
              is unreadable, and this is the one part of the site with enough
              continuous text for that to matter.
            */}
            <article className="max-w-[38rem]">
              <p className="text-steel text-[0.9375rem]">
                Published{" "}
                <time dateTime={insight.published}>
                  {formatPublished(insight.published)}
                </time>
              </p>

              <div className="mt-12">
                {insight.body.map((block, index) => (
                  <BlockView key={index} block={block} />
                ))}
              </div>
            </article>
          </Band>
        </Container>
      </section>

      {others.length > 0 ? (
        <section className="bg-mist">
          <Container>
            <Band>
              <SectionHeading
                eyebrow="More reading"
                title="Other guides in this section."
              />
              <ul className="mt-10 grid gap-5 sm:grid-cols-2">
                {others.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/insights/${other.slug}`}
                      className="border-line hover:border-datum block h-full rounded-lg border bg-white p-6 transition-colors"
                    >
                      <p className="eyebrow">{other.eyebrow}</p>
                      <p className="h3 text-graphite mt-3">{other.title}</p>
                      <p className="text-steel mt-3 text-[0.9375rem] leading-relaxed">
                        {other.description}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Cta href="/franchising">How franchising works</Cta>
                <Cta href="/insights" variant="secondary">
                  All insights
                </Cta>
              </div>
            </Band>
          </Container>
        </section>
      ) : null}


      <JsonLd
        data={articleSchema({
          title: insight.title,
          description: insight.description,
          path: `/insights/${insight.slug}`,
          datePublished: insight.published,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Insights", path: "/insights" },
          { name: insight.title, path: `/insights/${insight.slug}` },
        ])}
      />
    </>
  );
}
