import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/container";
import { Cta } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { Eyebrow, PageHeader } from "@/components/page-header";
import { BRANDS, SITE_URL } from "@/config/company";
import { ORGANIZATION_ID } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

/**
 * Brand detail.
 *
 * A dynamic segment over the BRANDS array rather than a hand written page for
 * Wattsmith, so brand number two is a data edit. generateStaticParams keeps the
 * route fully static.
 *
 * This page deliberately stays short. Everything it could say beyond the facts
 * in the config would either duplicate wattsmithelectric.com or invent
 * something, and the whole purpose of the outbound link is that the operating
 * brand speaks for itself. A thin honest page beats a padded one.
 */

export function generateStaticParams() {
  return BRANDS.map((brand) => ({ slug: brand.slug }));
}

// params is a Promise in Next 16. Synchronous access was removed, not deprecated.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = BRANDS.find((candidate) => candidate.slug === slug);
  if (!brand) return {};

  return pageMetadata({
    title: brand.name,
    description: brand.summary,
    path: `/brands/${brand.slug}`,
  });
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = BRANDS.find((candidate) => candidate.slug === slug);
  if (!brand) notFound();

  /**
   * Organization schema for the brand itself, tied back to Craftline as its
   * parent. `url` points at the brand's own site, not this page, because that
   * site is the entity's home on the web and this is a reference to it.
   *
   * No aggregateRating, no review, no service or offer markup. Craftline does
   * not hold reviews for its brands and does not sell their services.
   */
  const brandSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    url: brand.url,
    description: brand.summary,
    parentOrganization: { "@id": ORGANIZATION_ID },
    areaServed: brand.state,
    subjectOf: `${SITE_URL}/brands/${brand.slug}`,
  };

  return (
    <>
      <PageHeader eyebrow={brand.category} title={brand.name} lead={brand.summary} />

      <section className="bg-paper">
        <Container>
          <div className="py-20 sm:py-24">
            <Eyebrow>What is established</Eyebrow>
            <h2 className="display-lg mt-5 max-w-2xl">
              The facts about this brand.
            </h2>
            {/*
              Every item is something the brand can evidence on request. No
              superlatives, no counts, no performance claims, and nothing about
              revenue or growth.
            */}
            <ul className="mt-10 max-w-2xl divide-y divide-ink/10 border-y border-ink/10">
              {brand.attributes.map((attribute) => (
                <li key={attribute} className="py-4 text-base text-ink">
                  {attribute}
                </li>
              ))}
            </ul>

            <div className="mt-12 rounded-lg border border-ink/10 bg-white p-7 sm:p-9">
              <h3 className="text-lg font-semibold">
                {brand.name} publishes its own site.
              </h3>
              <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-muted">
                Service details, coverage, and contact for work in{" "}
                {brand.state} live there. Craftline does not take service calls
                for its brands.
              </p>
              <a
                href={brand.url}
                target="_blank"
                rel="noopener"
                className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-bronze hover:underline"
              >
                {brand.url.replace("https://", "")}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>

            <div className="mt-12 flex flex-col gap-3 sm:flex-row">
              <Cta href="/franchising">Franchise information</Cta>
              <Link
                href="/brands"
                className="tap-44 inline-flex min-h-11 items-center text-sm font-semibold text-bronze hover:underline"
              >
                All brands
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <JsonLd data={brandSchema} />
    </>
  );
}
