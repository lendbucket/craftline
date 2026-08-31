import type { Metadata } from "next";
import { BrandRow } from "@/components/brand-row";
import { Cta, CtaRow } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { CtaBand } from "@/components/cta-band";
import { Section } from "@/components/system/section";
import { SectionHead } from "@/components/system/section-head";
import { BRANDS } from "@/config/company";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Brands",
  description:
    "The operating brands held by Craftline Brands. Wattsmith Electric is a licensed, insured, veteran owned electrical contractor operating in San Antonio, Texas.",
  path: "/brands",
});

/**
 * Brands index.
 *
 * One brand today. The page is built from the BRANDS array rather than written
 * around a single entry, so the second brand is a data edit and not a redesign.
 * It will never be padded with invented brands to make the company look larger:
 * a prospect who counts the cards should learn something true.
 *
 * Nothing here describes services in a way that competes with the operating
 * brand's own site for service keywords. Craftline states what the brand is and
 * links out; wattsmithelectric.com is the authority on what it does.
 *
 * THE PRIMARY ACTION STAYS ON THIS SITE. The import points "About Wattsmith
 * Electric" at wattsmithelectric.com, which leaves /brands/wattsmith-electric
 * with no inbound link from the index above it while it is still in the
 * sitemap. That is an orphaned route, and it is recorded in BACKLOG.md as a
 * rejected import behaviour so it does not come back.
 */
export default function BrandsPage() {
  const [wattsmith] = BRANDS;

  return (
    <>
      <PageHeader
        label="Brands"
        title="The brands Craftline builds and operates."
        lead="Craftline builds a brand to a working standard before any part of it is offered to anyone else to run. One brand is operating today."
        ctaHref="/franchising#inquiry"
        ctaLabel="Franchise inquiry"
        secondaryHref="/franchising"
        secondaryLabel="How franchising works"
      />

      {/*
        The brand block is the whole point of this page, so it gets the loose
        band and no heading above it. A section title over a single block that
        the page title already named would be furniture.
      */}
      <Section ground="white" density="loose">
        <BrandRow />
      </Section>

      <Section ground="mist" density="tight" edge>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <SectionHead
            eyebrow="Why only one"
            title="A system is worth handing over only after it has been run."
            compact
          />
          <div>
            <p className="text-steel max-w-[62ch] leading-relaxed">
              A franchise programme assembled before anyone has operated the
              brand is a set of assumptions. Building and running the first
              business is what turns those into a playbook, and it is the reason
              this list is short.
            </p>
            <CtaRow className="mt-9">
              <Cta href={`/brands/${wattsmith.slug}`}>
                About {wattsmith.name}
              </Cta>
              <Cta href="/franchising" variant="secondary">
                How franchising works
              </Cta>
            </CtaRow>
          </div>
        </div>
      </Section>

      <CtaBand
        ground="white"
        title="Interested in operating one?"
        lead="Craftline is developing its franchise programme. There is nothing to offer yet, and a conversation now costs you nothing."
        secondaryHref="/about"
        secondaryLabel="About the company"
      />

      <JsonLd data={breadcrumbSchema([{ name: "Brands", path: "/brands" }])} />
    </>
  );
}
