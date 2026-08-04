import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { WattsmithLockup } from "@/components/brand/wattsmith-lockup";
import { Container } from "@/components/container";
import { Cta } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { Band, SectionLabel } from "@/components/section";
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
 * page for a holding company, and it is the reason someone evaluating
 * Craftline would visit.
 *
 * It is NOT a second front door for the operating brand's customers. Craftline
 * does not compete with wattsmithelectric.com for service keywords and never
 * targets city plus service queries. Concretely: the service schedule below is
 * plain unlinked category names with no city attached, no service page exists
 * on this property and none may be added, and the outbound link is prominent
 * because sending a customer to the brand's own site is the correct outcome
 * for every service intent that lands here.
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
  // description never has to guess between "a" and "an" for a config value.
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
   * this repository. Google will not resolve a relative one.
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
        label={brand.category}
        title={brand.name}
        lead={brand.summary}
      />

      {/* ---------------------------------------------------------------
          THE LOCKUP, ON BOTH APPROVED SURFACES
          --------------------------------------------------------------- */}
      <section className="bg-zinc">
        <Container wide>
          <Band>
            <SectionLabel>The brand system</SectionLabel>
            <h2 className="display-2 mt-8 max-w-3xl text-balance">
              One mark, two surfaces, no third version.
            </h2>
            <p className="body-lg text-steel mt-8 max-w-2xl">
              The lockup is approved on the brand&apos;s navy field and on a
              light field. The bolt and the ELECTRIC banner stay gold on both.
              What changes between them is only the navy artwork, which reverses
              so it stays visible.
            </p>

            <div className="mt-14 grid gap-8 lg:grid-cols-2">
              {/*
                Reversed usage. The background is the brand's own navy, taken
                from config rather than typed in, so it cannot drift from the
                value the schedule below publishes.

                No text-datum and no SectionLabel inside this panel. The
                surface aware colour in globals.css is pinned by the ground
                class names, and an inline background is invisible to that
                mechanism, so datum here would silently resolve to its light
                ground value and fail contrast on navy.
              */}
              <figure className="border-line reveal border">
                <div
                  className="flex items-center justify-center px-10 py-16 sm:py-20"
                  style={{ backgroundColor: navy.hex }}
                >
                  <WattsmithLockup
                    onDark
                    decorative
                    className="w-full max-w-xs"
                  />
                </div>
                <figcaption className="bg-chalk border-line border-t px-7 py-5">
                  <p className="label-sm text-datum">Reversed</p>
                  <p className="text-steel mt-3 text-[0.9375rem] leading-relaxed">
                    On the brand&apos;s navy field. The mark and the WATTSMITH
                    wordmark reverse out so they stay legible.
                  </p>
                </figcaption>
              </figure>

              <figure className="border-line reveal border">
                <div className="bg-chalk flex items-center justify-center px-10 py-16 sm:py-20">
                  <WattsmithLockup decorative className="w-full max-w-xs" />
                </div>
                <figcaption className="bg-chalk border-line border-t px-7 py-5">
                  <p className="label-sm text-datum">Primary</p>
                  <p className="text-steel mt-3 text-[0.9375rem] leading-relaxed">
                    On a light field. The mark and the wordmark carry the brand
                    navy, which is the primary usage.
                  </p>
                </figcaption>
              </figure>
            </div>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          BRAND COLOURS
          --------------------------------------------------------------- */}
      <section className="bg-chalk">
        <Container wide>
          <Band>
            <SectionLabel>Brand colours</SectionLabel>
            <h2 className="display-2 mt-8 max-w-3xl text-balance">
              Two colours, and the discipline is that there is no third.
            </h2>

            <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:max-w-4xl">
              {brand.palette.map((colour) => (
                <li key={colour.hex} className="border-line reveal border">
                  {/*
                    The swatch labels itself in the colour it must be legible
                    against: reversed ink on navy, brand navy on gold. Both
                    pairings are the ones the delivered artwork already uses, so
                    the swatch demonstrates the rule as well as stating it.
                  */}
                  <div
                    className="px-7 py-12"
                    style={{
                      backgroundColor: colour.hex,
                      color:
                        colour.hex === gold.hex ? navy.hex : brand.reversedInk,
                    }}
                  >
                    <p className="label-sm">{colour.name}</p>
                    <p className="value mt-3 text-xl uppercase">{colour.hex}</p>
                  </div>
                  {/*
                    Zinc, not chalk, because this band is chalk since kraft was
                    retired. A chalk caption on a chalk ground would dissolve
                    into it and the swatch card would lose its footer.
                  */}
                  <p className="bg-zinc border-line text-steel border-t px-7 py-5 text-[0.9375rem] leading-relaxed">
                    {colour.role}
                  </p>
                </li>
              ))}
            </ul>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          THE FACTUAL STORY
          --------------------------------------------------------------- */}
      <section className="bg-zinc">
        <Container>
          <Band>
            <SectionLabel>What is established</SectionLabel>
            <h2 className="display-2 mt-8 max-w-3xl text-balance">
              The facts about this brand.
            </h2>
            <p className="body-lg text-steel mt-8 max-w-2xl">
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
            <ul className="border-line mt-12 max-w-2xl border-t">
              {brand.attributes.map((attribute) => (
                <li
                  key={attribute}
                  className="border-line text-graphite border-b py-5 text-[1.0625rem]"
                >
                  {attribute}
                </li>
              ))}
            </ul>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          SERVICE SCHEDULE
          --------------------------------------------------------------- */}
      <section className="bg-chalk">
        <Container wide>
          <Band>
            <SectionLabel>Services offered</SectionLabel>
            <h2 className="display-2 mt-8 max-w-3xl text-balance">
              The categories of work the business does.
            </h2>
            <p className="body-lg text-steel mt-8 max-w-2xl">
              Listed so you can see what kind of trade business this is. For
              scope, coverage, and anything resembling a quote, go to the
              brand&apos;s own site. Craftline does not take service calls and
              does not publish service pages.
            </p>

            {/*
              A schedule: numbered rows, mono, ruled. That is what a service
              list in this trade actually looks like on a document, and the
              numbering is a row index rather than a ranking.

              Plain text, deliberately not links. Linking each category to the
              operating brand's matching service page would build a service
              keyword surface on this domain pointing at that one, which is the
              exact competition this property is built to avoid.
            */}
            <ol className="border-line mt-14 grid border-t sm:grid-cols-2">
              {brand.services.map((service, index) => (
                <li
                  key={service}
                  className="border-line flex items-baseline gap-5 border-b py-4"
                >
                  <span className="label-sm text-datum shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-graphite text-[1.0625rem]">
                    {service}
                  </span>
                </li>
              ))}
            </ol>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          PROMINENT OUTBOUND LINK
          --------------------------------------------------------------- */}
      <section className="bg-graphite text-zinc">
        <Container>
          <Band>
            <SectionLabel>Visit the brand</SectionLabel>
            <h2 className="display-2 mt-8 max-w-3xl text-balance">
              {brand.name} publishes its own site.
            </h2>
            <p className="body-lg text-steel mt-8 max-w-2xl">
              Service details, coverage, pricing, and contact for electrical
              work in {brand.city} live there, and that site is the authority on
              all of it. If you are looking for an electrician rather than for{" "}
              {COMPANY.name}, this is the link you want.
            </p>
            <div className="mt-12 flex flex-col gap-3 sm:flex-row">
              <Cta href={brand.url} external>
                {domain}
                <ArrowUpRight aria-hidden="true" className="ml-2 h-4 w-4" />
                <span className="sr-only">(opens in a new tab)</span>
              </Cta>
              <Cta href="/franchising" variant="secondary">
                Franchise information
              </Cta>
            </div>
            <div className="mt-10">
              <Link
                href="/brands"
                className="text-datum tap-44 inline-flex min-h-11 items-center text-[0.9375rem] font-semibold hover:underline"
              >
                All brands
              </Link>
            </div>
          </Band>
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
