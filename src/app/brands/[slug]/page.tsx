import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { WattsmithLockup } from "@/components/brand/wattsmith-lockup";
import { Container } from "@/components/container";
import { Cta } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { Eyebrow, PageHeader } from "@/components/page-header";
import { BRANDS, COMPANY, SITE_URL } from "@/config/company";
import { breadcrumbSchema, ORGANIZATION_ID } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

/**
 * Brand showcase.
 *
 * A dynamic segment over the BRANDS array rather than a hand written page for
 * Wattsmith, so brand number two is a data edit. generateStaticParams keeps the
 * route fully static.
 *
 * WHAT THIS PAGE IS FOR, AND WHAT IT REFUSES TO BECOME
 * ---------------------------------------------------
 * It presents the brand as a system: the delivered lockup on both surfaces it
 * is approved for, the two colours that identify it, the facts that can be
 * evidenced, and the categories of work the business does. That is a portfolio
 * page for a holding company, and it is the reason someone evaluating Craftline
 * would visit.
 *
 * It is NOT a second front door for the operating brand's customers. Craftline
 * does not compete with wattsmithelectric.com for service keywords and never
 * targets city plus service queries. Concretely, that means the service list
 * below is a plain unlinked list of category names with no city attached, no
 * service page exists on this property and none may be added, and the outbound
 * link is prominent because sending a customer to the brand's own site is the
 * correct outcome for every service intent that lands here.
 *
 * Every fact rendered here traces to src/config/company.ts. A second brand
 * added without a palette or a service list will fail the type check rather
 * than render a half empty showcase, which is the intended failure mode.
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

  // Category leads the sentence rather than sitting after an article, so the
  // description never has to guess between "a" and "an" for a value that comes
  // from config and can change.
  return pageMetadata({
    title: brand.name,
    description: `${brand.category} brand held by ${COMPANY.name}. ${brand.name} is licensed, insured, and veteran owned, operating in ${brand.city}, ${brand.state}.`,
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

  const [navy, gold] = brand.palette;
  const domain = brand.url.replace("https://", "");

  /**
   * Organization schema for the brand itself, tied back to Craftline as its
   * parent. `url` points at the brand's own site, not this page, because that
   * site is the entity's home on the web and this is a reference to it.
   *
   * `logo` is an absolute URL to the copy of the delivered lockup committed to
   * this repository. Google requires an absolute URL here and will not resolve
   * a relative one.
   *
   * No aggregateRating, no review, no service or offer markup. Craftline does
   * not hold reviews for its brands and does not sell their services, and
   * emitting Service nodes here would be the structured data equivalent of
   * building the service pages this page exists to avoid.
   */
  const brandSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    url: brand.url,
    description: brand.summary,
    logo: `${SITE_URL}${brand.logo}`,
    parentOrganization: { "@id": ORGANIZATION_ID },
    areaServed: `${brand.city}, ${brand.state}`,
    subjectOf: `${SITE_URL}/brands/${brand.slug}`,
  };

  return (
    <>
      <PageHeader
        eyebrow={brand.category}
        title={brand.name}
        lead={brand.summary}
      />

      {/* THE LOCKUP, ON BOTH APPROVED SURFACES */}
      <section className="bg-paper">
        <Container wide>
          <div className="py-20 sm:py-24">
            <Eyebrow>The brand system</Eyebrow>
            <h2 className="display-lg mt-5 max-w-2xl">
              One mark, two surfaces, no third version.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
              The lockup is approved on the brand&apos;s navy field and on a
              light field. The bolt and the ELECTRIC banner stay gold on both.
              What changes between them is only the navy artwork, which reverses
              so it stays visible.
            </p>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {/*
                Reversed usage. The background is the brand's own navy, taken
                from config rather than typed in, so it cannot drift from the
                value the palette below publishes.

                No `text-bronze` and no <Eyebrow> inside this panel. The
                surface aware bronze in globals.css is pinned by the .bg-ink
                and .bg-paper class names, and an inline background colour is
                invisible to that mechanism, so bronze here would silently
                resolve to the deep shade and fail contrast on navy.
              */}
              <figure className="overflow-hidden rounded-lg border border-ink/10">
                <div
                  className="flex items-center justify-center px-8 py-14 sm:px-12 sm:py-20"
                  style={{ backgroundColor: navy.hex }}
                >
                  <WattsmithLockup onDark decorative className="w-full max-w-xs" />
                </div>
                <figcaption className="bg-white px-6 py-5 text-sm leading-relaxed text-muted">
                  On the brand&apos;s navy field. The mark and the WATTSMITH
                  wordmark reverse out so they stay legible.
                </figcaption>
              </figure>

              <figure className="overflow-hidden rounded-lg border border-ink/10">
                <div className="flex items-center justify-center bg-white px-8 py-14 sm:px-12 sm:py-20">
                  <WattsmithLockup decorative className="w-full max-w-xs" />
                </div>
                <figcaption className="bg-white px-6 py-5 text-sm leading-relaxed text-muted">
                  On a light field. The mark and the wordmark carry the brand
                  navy, which is the primary usage.
                </figcaption>
              </figure>
            </div>

            {/* BRAND COLOURS */}
            <h3 className="display-md mt-16">Brand colours.</h3>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
              Two colours, and the discipline is that there is no third.
            </p>

            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:max-w-3xl">
              {brand.palette.map((colour) => (
                <li
                  key={colour.hex}
                  className="overflow-hidden rounded-lg border border-ink/10"
                >
                  {/*
                    The swatch labels itself in the colour it must be legible
                    against: reversed ink on navy, brand navy on gold. Both
                    pairings are the ones the delivered artwork already uses,
                    so the swatch demonstrates the rule as well as stating it.
                  */}
                  <div
                    className="px-6 py-10"
                    style={{
                      backgroundColor: colour.hex,
                      color:
                        colour.hex === gold.hex ? navy.hex : brand.reversedInk,
                    }}
                  >
                    <p className="tracked-caps text-[0.65rem]">{colour.name}</p>
                    <p className="mt-3 font-mono text-lg font-semibold uppercase">
                      {colour.hex}
                    </p>
                  </div>
                  <p className="bg-white px-6 py-5 text-sm leading-relaxed text-muted">
                    {colour.role}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* THE FACTUAL STORY */}
      <section className="bg-paper-dark">
        <Container wide>
          <div className="py-20 sm:py-24">
            <Eyebrow>What is established</Eyebrow>
            <h2 className="display-lg mt-5 max-w-2xl">
              The facts about this brand.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
              {brand.name} is a licensed and insured, veteran owned electrical
              contractor operating in {brand.city}, {brand.state}. It serves
              residential and light commercial customers. That is the whole of
              what is established, and nothing beyond it is claimed here.
            </p>
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
          </div>
        </Container>
      </section>

      {/* SERVICES OFFERED */}
      <section className="bg-paper">
        <Container wide>
          <div className="py-20 sm:py-24">
            <Eyebrow>Services offered</Eyebrow>
            <h2 className="display-lg mt-5 max-w-2xl">
              The categories of work the business does.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
              Listed so you can see what kind of trade business this is. For
              scope, coverage, and anything resembling a quote, go to the
              brand&apos;s own site. Craftline does not take service calls and
              does not publish service pages.
            </p>

            {/*
              Plain text, deliberately not links. Linking each category to the
              operating brand's matching service page would build a service
              keyword surface on this domain pointing at that one, which is the
              exact competition this property is built to avoid.
            */}
            <ul className="mt-10 grid gap-x-10 gap-y-px overflow-hidden rounded-lg bg-paper-dark sm:grid-cols-2 sm:gap-x-px lg:grid-cols-3">
              {brand.services.map((service) => (
                <li
                  key={service}
                  className="bg-paper px-5 py-4 text-[0.95rem] leading-relaxed text-ink"
                >
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* PROMINENT OUTBOUND LINK */}
      <section className="bg-ink text-paper">
        <Container>
          <div className="py-20 sm:py-24">
            <Eyebrow>Visit the brand</Eyebrow>
            <h2 className="display-lg mt-5 max-w-2xl text-paper">
              {brand.name} publishes its own site.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-dark">
              Service details, coverage, pricing, and contact for electrical
              work in {brand.city} live there, and that site is the authority on
              all of it. If you are looking for an electrician rather than for{" "}
              {COMPANY.name}, this is the link you want.
            </p>
            {/*
              Outbound to the operating brand's own site. rel="noopener" is the
              safety default for target="_blank"; there is deliberately no
              nofollow, because Craftline genuinely publishes this brand and the
              link is an ownership statement, not a citation.
            */}
            <a
              href={brand.url}
              target="_blank"
              rel="noopener"
              className="mt-10 inline-flex min-h-11 items-center justify-center gap-2 rounded bg-bronze-bright px-6 py-3 text-sm font-semibold tracking-wide text-ink transition-colors hover:bg-bronze-bright-hover"
            >
              {domain}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </Container>
      </section>

      <section className="bg-paper">
        <Container>
          <div className="py-16 sm:py-20">
            <div className="flex flex-col gap-3 sm:flex-row">
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
      <JsonLd
        data={breadcrumbSchema([
          { name: "Brands", path: "/brands" },
          { name: brand.name, path: `/brands/${brand.slug}` },
        ])}
      />
    </>
  );
}
