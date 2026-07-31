import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandLockup, hasBrandLockup } from "@/components/brand/brand-lockup";
import { Container } from "@/components/container";
import { JsonLd } from "@/components/json-ld";
import { Eyebrow, PageHeader } from "@/components/page-header";
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
 *
 * Nothing here describes services in a way that competes with the operating
 * brand's own site for service keywords. Craftline states what the brand is and
 * links out; wattsmithelectric.com is the authority on what it does.
 */
export default function BrandsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Brands"
        title="The brands Craftline builds and operates."
        lead="Craftline builds a brand to a working standard before it is offered to anyone else to run. One brand is operating today."
      />

      <section className="bg-paper">
        <Container wide>
          <div className="py-20 sm:py-24">
            <ul className="space-y-8">
              {BRANDS.map((brand) => (
                <li key={brand.slug}>
                  <article className="rounded-lg border border-ink/10 bg-white p-7 sm:p-10">
                    {/*
                      The delivered lockup, on a light field, which is its
                      primary approved usage. Decorative because the brand name
                      is the h2 directly beneath it. Rendered only when artwork
                      has actually been ported: a brand without it gets a type
                      only card rather than a gap or a stand in mark.
                    */}
                    {hasBrandLockup(brand.slug) ? (
                      <BrandLockup
                        slug={brand.slug}
                        decorative
                        className="mb-8 w-full max-w-[13rem]"
                      />
                    ) : null}

                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                      <h2 className="display-md">
                        {/*
                          tap-44 rather than min-h-11: this is a heading, and
                          growing its box to 44px would open a gap between the
                          brand name and the category sitting on its baseline.
                          The invisible hit area fixes the thumb target without
                          moving the design.
                        */}
                        <Link
                          href={`/brands/${brand.slug}`}
                          className="tap-44 hover:text-bronze"
                        >
                          {brand.name}
                        </Link>
                      </h2>
                      <Eyebrow>{brand.category}</Eyebrow>
                    </div>

                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
                      {brand.summary}
                    </p>

                    <ul className="mt-7 flex flex-wrap gap-2">
                      {brand.attributes.map((attribute) => (
                        <li
                          key={attribute}
                          className="rounded-sm border border-ink/15 px-3 py-1.5 text-xs text-ink-600"
                        >
                          {attribute}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3">
                      <Link
                        href={`/brands/${brand.slug}`}
                        className="tap-44 text-sm font-semibold text-bronze hover:underline"
                      >
                        About this brand
                      </Link>
                      <a
                        href={brand.url}
                        target="_blank"
                        rel="noopener"
                        className="tap-44 inline-flex items-center gap-1.5 text-sm text-ink-600 hover:text-bronze"
                      >
                        {brand.url.replace("https://", "")}
                        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </div>
                  </article>
                </li>
              ))}
            </ul>

            {/*
              Stated plainly rather than dressed up as a teaser. There is no
              second brand, no announced timeline, and nothing to hint at.
            */}
            <p className="mt-12 max-w-2xl text-base leading-relaxed text-muted">
              Additional brands will be listed here as they begin operating.
            </p>
          </div>
        </Container>
      </section>

      <JsonLd data={breadcrumbSchema([{ name: "Brands", path: "/brands" }])} />
    </>
  );
}
