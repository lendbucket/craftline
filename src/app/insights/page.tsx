import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { Cta, CtaRow } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { CtaBand, CtaPrompt } from "@/components/cta-band";
import { Section } from "@/components/system/section";
import { SectionHead } from "@/components/system/section-head";
import { formatPublished, ORDERED_INSIGHTS } from "@/data/insights";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Insights",
  description:
    "Guides on franchising and skilled trade service businesses: what a Franchise Disclosure Document is, how royalties and territory work, what a home services franchise involves, and how to check a franchisor before you sign.",
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
 * No pagination, no tag taxonomy, and no featured slot. The section is now
 * eighteen posts, which a single dated list still handles without help. Add
 * navigation when a reader cannot find something, not before: taxonomy built
 * ahead of the volume that needs it is how a section starts looking abandoned.
 *
 * THE IMPORT'S CATEGORY FILTER WAS DECLINED. Ten buttons over client held
 * state is a new capability on an existing route rather than a restyle of it,
 * and this hub is server rendered and static today. The import also rewrites
 * all eighteen links as absolute URLs opening in a new tab, which would turn
 * the site's own internal linking into outbound behaviour on the most linked
 * section of the property. Both are recorded in BACKLOG.md.
 *
 * PHASE 2A. The eighteen posts are now one ruled index rather than eighteen
 * bordered cards. A dated list of articles is a table of contents, and a table
 * of contents should look like one: the category and date align in a left
 * column a reader can run their eye down, the titles align in another, and
 * scanning for the piece you want is a matter of moving down one column rather
 * than reading eighteen boxes.
 *
 * No author bylines anywhere in this section. The founder's name is never
 * rendered on this property, and corporate authorship is also the truthful
 * description of what these are. See articleSchema in src/lib/schema.ts.
 */
/**
 * Where the mid-list prompts go, by card index.
 *
 * Two of them, and the number came from measurement rather than preference. One
 * prompt after the fifth card still left just under five viewports of unbroken
 * list below it at desktop width, which the CTA audit failed. Two breaks the
 * eighteen card list into three runs, none of which is long enough to go
 * barren.
 *
 * Derived from the list length so the spacing survives the section growing.
 */
const PROMPT_AFTER = new Set([4, 11]);

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

      <Section ground="white">
        <ul className="border-graphite border-t-2">
          {ORDERED_INSIGHTS.map((insight, index) => (
            <Fragment key={insight.slug}>
              <li className="border-line border-b">
                <Link
                  href={`/insights/${insight.slug}`}
                  className="hover:bg-mist group grid gap-x-10 gap-y-3 py-7 transition-colors md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]"
                >
                  <div>
                    <p className="label-sm">{insight.eyebrow}</p>
                    {/*
                      A real date, hardcoded in the post data. It is the one
                      piece of metadata a reader can use to judge whether a
                      piece is current, so it must never be a build timestamp.
                    */}
                    <time
                      dateTime={insight.published}
                      className="text-steel mt-2 block text-[0.8125rem]"
                    >
                      {formatPublished(insight.published)}
                    </time>
                  </div>
                  <div>
                    <h2 className="d3-sentence group-hover:text-datum max-w-[52ch] transition-colors">
                      {insight.title}
                    </h2>
                    <p className="text-steel mt-3 max-w-[68ch] leading-relaxed">
                      {insight.description}
                    </p>
                    <p className="text-datum font-display mt-4 text-[0.9375rem] font-bold tracking-[0.07em] uppercase">
                      Read this
                      <span className="sr-only">: {insight.title}</span>
                    </p>
                  </div>
                </Link>
              </li>
              {/*
                A prompt partway down the list rather than only at its foot.
                The section runs to eighteen posts, and the CTA audit measured
                nearly seven viewports of unbroken cards at desktop width with
                no way to act anywhere in it.
              */}
              {PROMPT_AFTER.has(index) ? (
                <li className="py-8">
                  <CtaPrompt
                    className="max-w-3xl"
                    title="Reading to decide rather than to browse?"
                    lead="An inquiry reaches a person who can answer directly. No Franchise Disclosure Document has been issued, so there is nothing to apply for."
                  />
                </li>
              ) : null}
            </Fragment>
          ))}
        </ul>
      </Section>

      <Section ground="mist" density="tight" edge>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-20">
          <SectionHead
            eyebrow="Why this section exists"
            tone="signal"
            title="Information, published before there is anything to sell."
            compact
          />
          <div>
            <p className="text-steel max-w-[68ch] leading-relaxed">
              Craftline is developing its franchise programme and no Franchise
              Disclosure Document has been issued. Until one is, there is nothing
              to offer and no terms to discuss. What can be done honestly in the
              meantime is to set out how this kind of business works, so that
              anyone who eventually reads a real disclosure document arrives
              already understanding the structure and can tell a good one from a
              bad one.
            </p>
            <CtaRow className="mt-9">
              <Cta href="/franchising">How franchising works</Cta>
              <Cta href="/about" variant="secondary">
                About the company
              </Cta>
            </CtaRow>
          </div>
        </div>
      </Section>

      <CtaBand

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
