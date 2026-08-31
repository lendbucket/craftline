import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { WattsmithLockup } from "@/components/brand/wattsmith-lockup";
import { Cta, CtaRow } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { CtaBand, CtaPrompt } from "@/components/cta-band";
import { Chip } from "@/components/system/ruled-list";
import { Section } from "@/components/system/section";
import { SectionHead } from "@/components/system/section-head";
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
 * targets city plus service queries. Concretely: the service list below is
 * plain unlinked category names with no city attached, no service page exists
 * on this property and none may be added, and the outbound link is prominent
 * because sending a customer to the brand's own site is the correct outcome
 * for every service intent that lands here.
 *
 * Every fact rendered here traces to src/config/company.ts. A second brand
 * added without a palette or a service list will fail the type check rather
 * than render a half empty showcase, which is the intended failure mode.
 *
 * PHASE 2A. This is one of the five templates the import left undesigned, so
 * everything here is derived from the six pages it did draw rather than
 * invented. The derivation and what it could not settle are stated in the
 * report. The two colour swatches keep their inline background values for the
 * reason recorded below, which is the only place on the site a colour is set
 * outside the token system, and it is a fact about the delivered artwork rather
 * than a Craftline design choice.
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
        ctaHref="/franchising#inquiry"
        ctaLabel="Franchise inquiry"
        secondaryHref={brand.url}
        secondaryLabel="Visit the brand site"
        secondaryExternal
      />

      {/* ---------------------------------------------------------------
          THE LOCKUP, ON BOTH APPROVED SURFACES
          --------------------------------------------------------------- */}
      <Section ground="white">
        <SectionHead
          eyebrow="The brand system"
          tone="signal"
          title="One mark, two surfaces, no third version."
          aside="The lockup is approved on the brand's navy field and on a light field. The bolt and the ELECTRIC banner stay gold on both. What changes between them is only the navy artwork, which reverses so it stays visible."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {/*
            Reversed usage. The background is the brand's own navy, taken from
            config rather than typed in, so it cannot drift from the value the
            schedule below publishes.

            No token driven text colour inside this panel. The tokens in
            globals.css are all pinned to white and mist, and an inline
            background is invisible to that, so a token here would resolve to
            its light ground value and fail contrast on navy. The caption sits
            outside the painted area instead.
          */}
          <figure className="border-graphite border-2">
            <div
              className="flex items-center justify-center px-10 py-16 sm:py-24"
              style={{ backgroundColor: navy.hex }}
            >
              <WattsmithLockup onDark decorative className="w-full max-w-xs" />
            </div>
            <figcaption className="border-graphite border-t-2 bg-white px-6 py-6">
              <p className="d3">Reversed</p>
              <p className="text-steel mt-3 text-[0.9375rem] leading-relaxed">
                On the brand&apos;s navy field. The mark and the WATTSMITH
                wordmark reverse out so they stay legible.
              </p>
            </figcaption>
          </figure>

          <figure className="border-graphite border-2">
            <div className="bg-mist flex items-center justify-center px-10 py-16 sm:py-24">
              <WattsmithLockup decorative className="w-full max-w-xs" />
            </div>
            <figcaption className="border-graphite border-t-2 bg-white px-6 py-6">
              <p className="d3">Primary</p>
              <p className="text-steel mt-3 text-[0.9375rem] leading-relaxed">
                On a light field. The mark and the wordmark carry the brand
                navy, which is the primary usage.
              </p>
            </figcaption>
          </figure>
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          BRAND COLOURS
          --------------------------------------------------------------- */}
      <Section ground="mist" density="tight" edge>
        <SectionHead
          eyebrow="Brand colours"
          tone="datum"
          title="Two colours, and the discipline is that there is no third."
          compact
        />

        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:max-w-4xl">
          {brand.palette.map((colour) => (
            <li key={colour.hex} className="border-graphite border-2">
              {/*
                The swatch labels itself in the colour it must be legible
                against: reversed ink on navy, brand navy on gold. Both pairings
                are the ones the delivered artwork already uses, so the swatch
                demonstrates the rule as well as stating it.
              */}
              <div
                className="px-7 py-14"
                style={{
                  backgroundColor: colour.hex,
                  color: colour.hex === gold.hex ? navy.hex : brand.reversedInk,
                }}
              >
                <p className="font-display text-2xl font-bold uppercase">
                  {colour.name}
                </p>
                <p className="font-display mt-2 text-3xl font-extrabold uppercase tabular-nums">
                  {colour.hex}
                </p>
              </div>
              <p className="border-graphite text-steel border-t-2 bg-white px-7 py-6 text-[0.9375rem] leading-relaxed">
                {colour.role}
              </p>
            </li>
          ))}
        </ul>

        <CtaPrompt
          className="mt-14 max-w-3xl"
          title="This is the brand the system was built on."
          lead="Craftline is developing a franchise programme around it. Nothing has been offered yet and an inquiry commits you to nothing."
        />
      </Section>

      {/* ---------------------------------------------------------------
          THE FACTUAL STORY
          Chips rather than a ruled list. Each of these is a single attested
          attribute rather than a sentence, and four short attested facts read
          as a set of credentials, which is what they are.
          --------------------------------------------------------------- */}
      <Section ground="white" density="tight">
        <SectionHead
          eyebrow="What is established"
          tone="signal"
          title="The facts about this brand."
          aside={`${brand.name} is a licensed and insured, veteran owned electrical contractor operating in ${brand.city}, ${brand.state}. It serves residential and light commercial customers. That is the whole of what is established, and nothing beyond it is claimed here.`}
        />
        {/*
          Every item is something the brand can evidence on request. No
          superlatives, no counts, no performance claims, and nothing about
          revenue or growth.
        */}
        <ul className="mt-12 flex flex-wrap gap-3">
          {brand.attributes.map((attribute) => (
            <li key={attribute}>
              <Chip>{attribute}</Chip>
            </li>
          ))}
        </ul>
      </Section>

      {/* ---------------------------------------------------------------
          SERVICE CATEGORIES
          --------------------------------------------------------------- */}
      <Section ground="mist" edge>
        <SectionHead
          eyebrow="Services offered"
          tone="datum"
          title="The categories of work the business does."
          aside="Listed so you can see what kind of trade business this is. For scope, coverage, and anything resembling a quote, go to the brand's own site. Craftline does not take service calls and does not publish service pages."
        />

        {/*
          Plain text, deliberately not links. Linking each category to the
          operating brand's matching service page would build a service keyword
          surface on this domain pointing at that one, which is the exact
          competition this property is built to avoid.
        */}
        <ul className="border-graphite mt-14 grid border-t-2 sm:grid-cols-2 sm:gap-x-12">
          {brand.services.map((service) => (
            <li
              key={service}
              className="border-line text-graphite border-b py-4"
            >
              {service}
            </li>
          ))}
        </ul>
      </Section>

      {/* ---------------------------------------------------------------
          PROMINENT OUTBOUND LINK
          --------------------------------------------------------------- */}
      <Section ground="white" density="tight">
        <div className="max-w-3xl">
          <h2 className="d2">{brand.name} publishes its own site.</h2>
          <p className="lead mt-6">
            Service details, coverage, pricing, and contact for electrical work
            in {brand.city} live there, and that site is the authority on all of
            it. If you are looking for an electrician rather than for{" "}
            {COMPANY.name}, this is the link you want.
          </p>
          <CtaRow className="mt-9">
            <Cta href={brand.url} external>
              {domain}
              <ArrowUpRight aria-hidden="true" className="ml-2 h-4 w-4" />
              <span className="sr-only">(opens in a new tab)</span>
            </Cta>
            <Cta href="/franchising" variant="secondary">
              How franchising works
            </Cta>
          </CtaRow>
          <p className="mt-9">
            <Link href="/brands" className="link tap-44 font-semibold">
              All brands
            </Link>
          </p>
        </div>
      </Section>

      <CtaBand
        title="This is the brand the system was built on."
        lead="Craftline is developing a franchise programme around it. No Franchise Disclosure Document has been issued, so an inquiry starts a conversation rather than an application."
        secondaryHref="/franchising"
        secondaryLabel="How franchising works"
      />

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
