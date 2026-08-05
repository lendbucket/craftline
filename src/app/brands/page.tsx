import type { Metadata } from "next";
import { BrandRow } from "@/components/brand-row";
import { Container } from "@/components/container";
import { Cta } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { Band, SectionHeading } from "@/components/section";
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
 */
export default function BrandsPage() {
  const [wattsmith] = BRANDS;

  return (
    <>
      <PageHeader
        label="Brands"
        title="The brands Craftline builds and operates."
        lead="Craftline builds a brand to a working standard before any part of it is offered to anyone else to run. One brand is operating today."
      />

      <section className="bg-white">
        <Container>
          <Band>
            <BrandRow />

            <div className="mt-14 max-w-3xl">
              <SectionHeading
                eyebrow="Why only one"
                title="A system is worth handing over only after it has been run."
                lead="A franchise programme assembled before anyone has operated the brand is a set of assumptions. Building and running the first business is what turns those into a playbook, and it is the reason this list is short."
              />
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Cta href={`/brands/${wattsmith.slug}`}>
                  About {wattsmith.name}
                </Cta>
                <Cta href="/franchising" variant="secondary">
                  How franchising works
                </Cta>
              </div>
            </div>
          </Band>
        </Container>
      </section>

      <JsonLd data={breadcrumbSchema([{ name: "Brands", path: "/brands" }])} />
    </>
  );
}
