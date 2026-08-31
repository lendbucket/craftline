import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Cta, CtaRow } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { CtaBand, CtaPrompt } from "@/components/cta-band";
import { Cell, HairlineGrid } from "@/components/system/grid";
import { Section } from "@/components/system/section";
import { SectionHead } from "@/components/system/section-head";
import {
  type Block,
  type Inline,
  formatPublished,
  getInsight,
  INSIGHTS,
  ORDERED_INSIGHTS,
} from "@/data/insights";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

/**
 * Insight article. Eighteen routes, and the longest continuous reading on the
 * property.
 *
 * Static over the INSIGHTS array. Body content is structured blocks rather than
 * a markdown string or MDX: it keeps the posts type checked, adds no dependency
 * and no build step, and means the renderer here decides the typography instead
 * of a prose plugin deciding it differently on each page.
 *
 * Everything legally load bearing about this section is documented at the top
 * of src/data/insights.ts. The short version: no statistics, no financial
 * performance representations, no offer, no geography.
 *
 * THE READING FACE, WHICH IS THE DECISION THIS TEMPLATE TURNS ON
 * -------------------------------------------------------------
 * Source Serif 4 stays, and it is the one place Phase 2A refused the import
 * outright on typographic rather than legal grounds.
 *
 * The import has no serif and no reading role at all. Every page in it is a
 * layout page, and it sets everything in Barlow, which is the same face as its
 * buttons and its navigation. Applied here that would mean four thousand words
 * of a UI grotesque with a tall x-height and tight apertures, read by a
 * prospect's attorney and accountant deciding whether this company is serious.
 * Barlow is a good interface face and a poor sustained reading face at that
 * length, and the articles are the only content on this site that is read
 * rather than scanned.
 *
 * What the serif lost in the change of pairing is the superfamily argument: it
 * was chosen to sit with Source Sans 3, which is gone. What replaces that is a
 * plainer argument. A condensed gothic for structure, a grotesque for
 * interface, and a transitional serif for reading is what trade and technical
 * publishing has used for a century, and the three do not compete because none
 * of them is asked to do another's job. The display face still opens the
 * article and still sets its subheadings, so a reader never loses the site.
 *
 * THE TITLE AND THE SUBHEADS ARE SENTENCE CASE. Everywhere else on this site the
 * display face is uppercase, because uppercase marks the top of a region a
 * reader is scanning for. An article title and its subheads are sentences a
 * reader reads. "What makes skilled trade service businesses suited to
 * franchise systems" set in capitals at 88px is a poster, not a heading, and
 * the eleven subheads inside a long piece would each cost the reader a moment
 * they did not need to spend. See .d1-prose and .d3-prose in globals.css.
 *
 * MEASURE. A single 38rem column, which is roughly 64 characters at the serif's
 * reading size. Prose that runs the full container is unreadable and this is
 * the one part of the site where that governs everything else.
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
 * Renders a run of text that may contain links.
 *
 * Post content is structured data rather than markup, so the anchor decision
 * lives here rather than in fifteen files of prose. Two consequences worth
 * knowing: an external link gets rel="noopener" and opens in a new tab while an
 * internal one never does, and internal links go through next/link so they
 * prefetch and navigate client side.
 *
 * The index key is safe because these arrays are static content, authored once
 * and never reordered at runtime.
 */
function InlineRun({ content }: { content: string | Inline[] }) {
  if (typeof content === "string") return <>{content}</>;
  return (
    <>
      {content.map((part, index) => {
        if (typeof part === "string") return <span key={index}>{part}</span>;
        if (part.external) {
          return (
            <a
              key={index}
              href={part.href}
              target="_blank"
              rel="noopener"
              className="link"
            >
              {part.text}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          );
        }
        return (
          <Link key={index} href={part.href} className="link">
            {part.text}
          </Link>
        );
      })}
    </>
  );
}

/**
 * Renders one content block.
 *
 * Headings are h2 because the post title is the h1. Nothing in the data can
 * emit a heading level, which keeps the document outline correct by
 * construction rather than by review.
 *
 * A subhead carries a short signal rule above it in datum blue. That is the one
 * ornament in the reading column and it earns its place: an article of this
 * length is navigated by its subheads, and a reader scrolling for the section
 * they want is looking for a mark rather than reading every line. Blue because
 * blue is this site's structure colour, and a hairline rather than a block
 * because the column is quiet and has to stay that way.
 */
function BlockView({ block }: { block: Block }) {
  if (block.kind === "heading") {
    return (
      <div className="mt-14 first:mt-0">
        <span aria-hidden="true" className="bg-datum block h-1 w-10" />
        <h2 className="d3-prose mt-5">{block.text}</h2>
      </div>
    );
  }

  if (block.kind === "list") {
    return (
      /*
        Discs, kept. A list inside a reading column needs a marker: without one
        the items read as short paragraphs and the reader loses the fact that
        they are a set. This was one of the few places the previous template was
        already right.
      */
      <ul className="prose-body mt-6 list-disc space-y-3 pl-6">
        {block.items.map((item, index) => (
          <li key={index}>
            <InlineRun content={item} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p className="prose-body mt-6">
      <InlineRun content={block.text} />
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

  // Everything except this post, so the further reading list cannot link to
  // the page it is sitting on.
  const others = ORDERED_INSIGHTS.filter(
    (candidate) => candidate.slug !== insight.slug,
  );

  /*
    Where the in-body prompt goes. Biased to 40% rather than the midpoint,
    because block INDEX is not block HEIGHT: a heading is a fraction of a
    paragraph, so a true index midpoint lands well past the visual middle. The
    CTA audit caught exactly that on the third article.
  */
  const midpoint = Math.floor(insight.body.length * 0.4);

  return (
    <>
      <PageHeader
        label={insight.eyebrow}
        title={insight.title}
        titleStyle="d1-prose"
        lead={insight.lead}
        meta={
          <p className="label-sm">
            Published{" "}
            <time dateTime={insight.published}>
              {formatPublished(insight.published)}
            </time>
          </p>
        }
        ctaHref="/franchising#inquiry"
        ctaLabel="Franchise inquiry"
        secondaryHref="/franchising"
        secondaryLabel="How franchising works"
      />

      <Section ground="white">
        {/*
          A single measure column. Prose that runs the full container width is
          unreadable, and this is the one part of the site with enough
          continuous text for that to matter.
        */}
        <article className="max-w-[38rem]">
          {insight.body.map((block, index) => (
            <div key={index}>
              <BlockView block={block} />
              {index === midpoint ? (
                <CtaPrompt
                  className="mt-14"
                  title="Evaluating a franchise?"
                  lead="Craftline is developing its programme and no Franchise Disclosure Document has been issued. An inquiry starts a conversation and nothing else."
                />
              ) : null}
            </div>
          ))}

          <CtaPrompt
            className="mt-14"
            title="Questions this raised?"
            lead="An inquiry is read by a person and commits you to nothing. No Franchise Disclosure Document has been issued, so there is nothing to apply for yet."
          />
        </article>
      </Section>

      {others.length > 0 ? (
        <Section ground="mist" edge>
          <SectionHead
            eyebrow="More reading"
            title="Other guides in this section."
            compact
          />
          <HairlineGrid as="ul" cols={2} className="mt-12">
            {others.map((other) => (
              <Cell as="li" key={other.slug} className="p-0">
                <Link
                  href={`/insights/${other.slug}`}
                  className="hover:bg-mist block h-full p-6 transition-colors sm:p-7"
                >
                  <p className="label-sm">{other.eyebrow}</p>
                  <p className="d3 mt-3">{other.title}</p>
                  <p className="text-steel mt-3 text-[0.9375rem] leading-relaxed">
                    {other.description}
                  </p>
                </Link>
              </Cell>
            ))}
          </HairlineGrid>

          <CtaRow className="mt-12">
            <Cta href="/franchising">How franchising works</Cta>
            <Cta href="/insights" variant="secondary">
              All insights
            </Cta>
          </CtaRow>
        </Section>
      ) : null}

      <CtaBand
        ground="white"
        title="Have a question this did not answer?"
        lead="Ask it. An inquiry is read by a person, reserves nothing, and commits you to nothing."
        secondaryHref="/insights"
        secondaryLabel="All guides"
      />

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
