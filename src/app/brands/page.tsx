import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandLockup, hasBrandLockup } from "@/components/brand/brand-lockup";
import { Container } from "@/components/container";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { Band, SectionLabel } from "@/components/section";
import { TitleBlock } from "@/components/title-block";
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
 *
 * The lockup plate sits on the light ground rather than inside a dark band, so
 * the brand's navy reads as a distinct plate instead of dissolving into the
 * section. That is also why the palette keeps graphite well clear of Wattsmith
 * navy. See globals.css.
 */
export default function BrandsPage() {
  return (
    <>
      <PageHeader
        label="Brands"
        title="The brands Craftline builds and operates."
        lead="Craftline builds a brand to a working standard before it is offered to anyone else to run. One brand is operating today."
      />

      <section className="bg-zinc">
        <Container wide>
          <Band>
            <ul className="space-y-10">
              {BRANDS.map((brand) => (
                <li key={brand.slug}>
                  <article className="border-rule bg-chalk reveal border lg:grid lg:grid-cols-[minmax(0,22rem)_1fr]">
                    {/*
                      The delivered lockup on the brand's own navy, from config
                      so the plate cannot drift from the palette published on
                      the brand page. Decorative because the brand name is the
                      heading beside it. Rendered only when artwork has been
                      ported: a brand without it gets a type only card rather
                      than an empty navy rectangle, which reads as a failure.
                    */}
                    {hasBrandLockup(brand.slug) ? (
                      <div
                        className="flex items-center justify-center px-10 py-14"
                        style={{ backgroundColor: brand.palette[0].hex }}
                      >
                        <BrandLockup
                          slug={brand.slug}
                          onDark
                          decorative
                          className="w-full max-w-[16rem]"
                        />
                      </div>
                    ) : null}

                    <div className="p-8 sm:p-12">
                      <p className="label-sm text-copper">{brand.category}</p>
                      <h2 className="display-3 mt-4">
                        <Link
                          href={`/brands/${brand.slug}`}
                          className="hover:text-copper tap-44 transition-colors"
                        >
                          {brand.name}
                        </Link>
                      </h2>

                      <p className="text-steel mt-5 max-w-xl leading-relaxed">
                        {brand.summary}
                      </p>

                      <ul className="border-rule mt-8 grid gap-px sm:grid-cols-2">
                        {brand.attributes.map((attribute) => (
                          <li
                            key={attribute}
                            className="border-rule value text-steel border-t py-3"
                          >
                            {attribute}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                        <Link
                          href={`/brands/${brand.slug}`}
                          className="text-copper tap-44 text-[0.9375rem] font-semibold hover:underline"
                        >
                          About this brand
                        </Link>
                        <a
                          href={brand.url}
                          target="_blank"
                          rel="noopener"
                          className="text-steel hover:text-copper tap-44 inline-flex items-center gap-1.5 text-[0.9375rem] transition-colors"
                        >
                          {brand.url.replace("https://", "")}
                          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>

            {/*
              Stated plainly rather than dressed up as a teaser. There is no
              second brand, no announced timeline, and nothing to hint at.
            */}
            <div className="mt-16 max-w-2xl">
              <SectionLabel>Additional brands</SectionLabel>
              <p className="text-steel mt-6 leading-relaxed">
                Additional brands will be listed here as they begin operating.
                There is no announced timeline and nothing in development that
                is being held back from this page.
              </p>
            </div>
          </Band>
        </Container>
      </section>

      <TitleBlock sheet="Brands" />

      <JsonLd data={breadcrumbSchema([{ name: "Brands", path: "/brands" }])} />
    </>
  );
}
