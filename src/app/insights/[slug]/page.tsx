import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { CtaBand } from "@/components/cta-band";
import { Cell, HairlineGrid } from "@/components/system/grid";
import { RuledItem } from "@/components/system/ruled-list";
import { SplitBar } from "@/components/system/rule";
import { Section } from "@/components/system/section";
import { SectionHead } from "@/components/system/section-head";
import {
  type Block,
  type Inline,
  formatPublished,
  getInsight,
  INSIGHTS,
  LIMITS_HEADING,
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
    /*
      NO BRAND SUFFIX ON AN ARTICLE. See the note on brandSuffix in
      src/lib/seo.ts. The suffix is 19 characters and it pushed sixteen of the
      eighteen article titles past the point a desktop result truncates, which
      cost the end of the headline on every one of them. The headline is what
      the article is; the brand is what the other nine routes carry.
    */
    brandSuffix: false,
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
function BlockView({ block, first = false }: { block: Block; first?: boolean }) {
  if (block.kind === "heading") {
    return (
      /*
        THE SPACE ABOVE A SUBHEAD WAS BEING CANCELLED ON EVERY SUBHEAD.

        This read "mt-14 first:mt-0", which is correct only if the heading is a
        sibling of the blocks around it. It is not: the body renders each block
        inside its own wrapper, so the heading div is the first child of its
        wrapper every single time and first:mt-0 won every single time. Every
        subhead in the section sat 24 pixels under the paragraph above it, on
        the same margin as another paragraph, which is why the articles read as
        one undifferentiated run.

        The first block of an article is the only one that genuinely needs no
        space above it, and the renderer already knows which one that is.
      */
      <div className={first ? "" : "mt-14"}>
        {/*
          THE SUBHEAD MARK IS NOW THE MARK THE REST OF THE SITE USES.

          It was a 40 pixel blue rule, invented here and used nowhere else. It
          did the job a mark does, so a reader scrolling found their section,
          but it meant the longest reading on the property was the one place
          the split bar did not appear. Eighteen articles, four to six subheads
          each, all carrying a device that belongs to no system.

          The bar costs nothing here that it does not cost anywhere else: it is
          two spans, it carries no text, and it is hidden from assistive
          technology because the heading beside it says what the section is.
        */}
        <SplitBar />
        <h2 className="d3-prose mt-5">{block.text}</h2>
      </div>
    );
  }

  if (block.kind === "list") {
    return (
      /*
        RULED ROWS, NOT DISCS, AND THE REASON IS THE NUMERALS.

        Fourteen list blocks across twelve articles, sixty four items, and not
        one of them is a sequence. "The kinds of fee, and what each one is for"
        is four kinds, not four steps, and numbering it would tell a reader
        something untrue about it. That is settled: numerals mean order on this
        site and they appear on exactly one article.

        Which leaves the question of what a SET looks like, and a disc is not
        an answer to it. A disc is the absence of a device rather than a
        different one, so the reader has nothing to tell a set from a sequence
        by except the presence of numbers somewhere else.

        RuledItem is the system's existing answer and it is already used for
        exactly this shape: the due diligence list on the franchising page,
        five complete instructions that are not ordered. Nothing new is
        invented here. The rules stay at the line colour rather than graphite,
        which is what that list already does, so the weight sits closer to a
        paragraph break than to a table.

        THE SPLIT BAR WAS CONSIDERED AND DECLINED. It is the one mark the whole
        site repeats and it costs two spans, which makes it tempting. It also
        means "a new region starts here" on all 27 routes, and five of them
        stacked down a list would teach a reader something false about it. A
        device that means two things means neither.
      */
      <ul className="mt-8 border-t-2 border-graphite">
        {block.items.map((item, index) => (
          <RuledItem key={index}>
            <InlineRun content={item} />
          </RuledItem>
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

/**
 * A SUBHEAD IN THE ONE ARTICLE THAT IS GENUINELY A SEQUENCE.
 *
 * Numerals mean order on this site and nowhere else, which is the rule the
 * Steps component is written under. Exactly one post qualifies: the buying
 * sequence, where step three cannot happen before step two, and whose headings
 * already read "One:", "Two:", "Three:".
 *
 * BECAUSE THE ORDINAL IS ALREADY IN THE HEADING, THE NUMERAL IS DECORATIVE AND
 * IS HIDDEN. That is the opposite of the Phase 2A failure, where a decorative
 * numeral replaced the words "Step 1" and took the sequence out of the page
 * with it. Here the numeral repeats what the heading says out loud, so hiding
 * it costs a screen reader nothing and showing it costs a sighted reader
 * nothing either. Nothing is added to the page's text and nothing is removed
 * from it.
 */
function SequenceHeading({
  block,
  first = false,
}: {
  block: Block & { kind: "heading" };
  first?: boolean;
}) {
  return (
    <div
      className={`grid gap-x-6 sm:grid-cols-[3.5rem_minmax(0,1fr)] ${
        first ? "" : "mt-14"
      }`}
    >
      <p
        aria-hidden="true"
        className="text-signal font-display hidden text-[2.75rem] leading-[0.8] font-extrabold tabular-nums sm:block"
      >
        {String(block.step).padStart(2, "0")}
      </p>
      <div>
        <SplitBar className="sm:hidden" />
        <h2 className="d3-prose mt-5 sm:mt-0">{block.text}</h2>
      </div>
    </div>
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
    THE CLOSING LIMITS SECTION COMES OUT OF THE READING COLUMN.

    Fifteen of the eighteen posts end on "What this does not establish", and
    until now it was the last subhead in a run of subheads: the same size, the
    same mark, the same column, indistinguishable from the section above it.

    It is not the same as the section above it. It is the passage a reader who
    has been sold to before is looking for, and it is the passage a generative
    engine lifts when it wants a statement it can attribute, because a stated
    limit is unusual in this category. Giving it its own band on its own ground
    is the article's fifth section and the one place the uppercase display
    heading belongs in a piece that is otherwise set in sentence case.

    Split on the heading rather than on a count, so a post that does not carry
    one simply has no band and loses nothing.
  */
  const limitsAt = insight.body.findIndex(
    (block) => block.kind === "heading" && block.text === LIMITS_HEADING,
  );
  const body = limitsAt === -1 ? insight.body : insight.body.slice(0, limitsAt);
  const limits = limitsAt === -1 ? [] : insight.body.slice(limitsAt + 1);

  /*
    ONE ASK PER ARTICLE, AND IT IS THE LAST BLOCK BEFORE THE FOOTER.

    An article used to carry five call to action positions and eight links:
    two in the page header above its own opening paragraph, a prompt at forty
    per cent, another at the end of the body, two more under the further
    reading grid, and the closing band. The first ask arrived before the piece
    had given a reader anything, which is the opposite of what this section is
    for. The band is the ask now, and nothing above it competes with it.

    The site header keeps its inquiry link and the phone keeps its persistent
    bar. Those are furniture, present on all 27 routes, and they are excluded
    from the article count by node in the audit rather than by position.

    The contextual links inside the prose stay. They are written into the
    sentences that earn them, they point where the sentence is already
    pointing, and a link a reader chose to follow is not an interruption.
  */

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
      />

      <Section ground="white">
        {/*
          A single measure column. Prose that runs the full container width is
          unreadable, and this is the one part of the site with enough
          continuous text for that to matter.
        */}
        <article className="max-w-[38rem]">
          {body.map((block, index) => (
            <div key={index}>
              {block.kind === "heading" && block.step ? (
                <SequenceHeading block={block} first={index === 0} />
              ) : (
                <BlockView block={block} first={index === 0} />
              )}
            </div>
          ))}
        </article>
      </Section>

      {limits.length > 0 ? (
        <Section ground="mist" density="tight" edge>
          <SectionHead
            eyebrow="Limits"
            tone="signal"
            title={LIMITS_HEADING}
            size="d3"
            compact
          />
          <div className="mt-8 max-w-[38rem]">
            {limits.map((block, index) => (
              <BlockView key={index} block={block} />
            ))}
          </div>
        </Section>
      ) : null}

      {/*
        Still mist, and the graphite edge rule is what separates it from the
        limits band above rather than a change of ground. HairlineGrid fills
        its cells white so the grid reads against the ground it sits on, which
        is the whole reason this section was put on mist in the first place;
        moving it to white would have made the cards invisible to gain an
        alternation the edge rule already provides.
      */}
      {others.length > 0 ? (
        <Section ground="mist" edge>
          <SectionHead
            eyebrow="More reading"
            tone="datum"
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
                  <p className="d3-sentence mt-3">{other.title}</p>
                  <p className="text-steel mt-3 text-[0.9375rem] leading-relaxed">
                    {other.description}
                  </p>
                </Link>
              </Cell>
            ))}
          </HairlineGrid>

          {/*
            NO CONTROLS UNDER THE FURTHER READING GRID.

            It carried two, and a reader who has reached this point is choosing
            what to read next rather than deciding whether to make contact. The
            grid itself is seventeen links to the rest of the section, the site
            header carries the index, and the ask is one section below. Three
            competing destinations in the space of one screen is the shape this
            template is being taken out of.
          */}
        </Section>
      ) : null}

      <CtaBand

        title="Have a question this did not answer?"
        /*
          Three clauses landing on person, nothing, nothing. The voice audit
          caught it on all eighteen articles once the triad rule learned to
          read clauses instead of sentences. What replaces it states the legal
          position once and lets the reader draw the conclusion, which is more
          accurate and less comforting, and that is the right way round here.
        */
        lead="No Franchise Disclosure Document has been issued, so there is nothing to apply for."
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
