import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { Cta } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { FRANCHISE_DISCLAIMER } from "@/config/company";
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
 */
function BlockView({ block }: { block: Block }) {
  if (block.kind === "heading") {
    return <h2 className="display-md mt-14 first:mt-0">{block.text}</h2>;
  }

  if (block.kind === "list") {
    return (
      <ul className="mt-6 space-y-3 border-l-2 border-bronze/40 pl-6">
        {block.items.map((item) => (
          <li key={item} className="text-[1.05rem] leading-relaxed text-ink-600">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p className="mt-6 text-[1.05rem] leading-relaxed text-ink-600">
      {block.text}
    </p>
  );
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const insight = getInsight(slug);
  if (!insight) notFound();

  // Everything except this post, so the further reading list cannot link to the
  // page it is sitting on.
  const others = ORDERED_INSIGHTS.filter(
    (candidate) => candidate.slug !== insight.slug,
  );

  return (
    <>
      <PageHeader
        eyebrow={insight.eyebrow}
        title={insight.title}
        lead={insight.lead}
      />

      <section className="bg-paper">
        <Container>
          <div className="py-16 sm:py-20">
            {/*
              The article is a single measure column. Prose that runs the full
              container width is unreadable, and this is the one part of the
              site with enough continuous text for that to matter.
            */}
            <article className="max-w-2xl">
              <p className="text-xs text-muted">
                Published{" "}
                <time dateTime={insight.published}>
                  {formatPublished(insight.published)}
                </time>
              </p>

              <div className="mt-10">
                {insight.body.map((block, index) => (
                  <BlockView key={index} block={block} />
                ))}
              </div>

              {/*
                FRANCHISE DISCLAIMER, verbatim, in the body of the article as
                well as in the global site footer. Do not reword it, do not
                summarise it, and do not split it across elements.
              */}
              <div className="mt-16 border-t border-ink/15 pt-8">
                <p className="text-xs leading-relaxed text-muted">
                  {FRANCHISE_DISCLAIMER}
                </p>
              </div>
            </article>
          </div>
        </Container>
      </section>

      {others.length > 0 ? (
        <section className="bg-paper-dark">
          <Container wide>
            <div className="py-16 sm:py-20">
              <h2 className="display-md">More from Insights</h2>
              <ul className="mt-8 grid gap-6 sm:grid-cols-2">
                {others.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/insights/${other.slug}`}
                      className="lift block h-full rounded-lg border border-ink/10 bg-white p-6 hover:border-bronze"
                    >
                      <p className="tracked-caps text-[0.65rem] text-bronze">
                        {other.eyebrow}
                      </p>
                      <p className="mt-4 text-base font-semibold leading-snug text-ink">
                        {other.title}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-12 flex flex-col gap-3 sm:flex-row">
                <Cta href="/franchising">Franchise information</Cta>
                <Link
                  href="/insights"
                  className="tap-44 inline-flex min-h-11 items-center text-sm font-semibold text-bronze hover:underline"
                >
                  All insights
                </Link>
              </div>
            </div>
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
