import type { Metadata } from "next";
import { Container } from "@/components/container";
import { ContactForm } from "@/components/form/contact-form";
import { Cta } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { Band, Card, SectionHeading } from "@/components/section";
import { BRANDS, COMPANY, CONTACT_EMAIL } from "@/config/company";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact Craftline Brands about the company, its brands, or franchise development. Service calls go to the operating brand, not to Craftline.",
  path: "/contact",
});

/**
 * Contact.
 *
 * Two jobs: take a corporate inquiry, and redirect service customers to the
 * operating brand before they type a message Craftline cannot act on. The
 * second job is why the brand routing note sits above the form rather than
 * under it.
 *
 * No email address is rendered. CONTACT_EMAIL is unset because no
 * craftlinebrands.com mailbox exists, and inventing one or borrowing the
 * Wattsmith address would both be worse than showing none.
 */
export default function ContactPage() {
  const [wattsmith] = BRANDS;

  return (
    <>
      <PageHeader
        label="Contact"
        title="Corporate and brand inquiries."
        lead={`For questions about ${COMPANY.name}, the brands it operates, or franchise development.`}
      />

      <section className="bg-white">
        <Container>
          <Band>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
              <div>
                <SectionHeading
                  eyebrow="Send a message"
                  title="Get in touch."
                  lead="An inquiry commits you to nothing and is read by a person."
                />

                {/*
                  Routing note directly under the heading. Someone with an
                  electrical problem who reaches this page should leave for the
                  brand site before filling anything in, not after waiting for a
                  reply that is not coming.
                */}
                <Card className="bg-mist mt-8">
                  <h3 className="text-graphite font-semibold">
                    Looking for electrical service?
                  </h3>
                  <p className="text-steel mt-3 text-[0.9375rem] leading-relaxed">
                    Craftline does not take service calls. {wattsmith.name}{" "}
                    handles work in {wattsmith.state} and is reachable at{" "}
                    <a
                      href={wattsmith.url}
                      target="_blank"
                      rel="noopener"
                      className="link tap-44 font-semibold"
                    >
                      {wattsmith.url.replace("https://", "")}
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                    .
                  </p>
                </Card>

                <Card className="mt-6">
                  <h3 className="text-graphite font-semibold">
                    Asking about franchising?
                  </h3>
                  <p className="text-steel mt-3 text-[0.9375rem] leading-relaxed">
                    The franchise inquiry form asks the few extra questions that
                    make a first reply useful, so it is the faster route.
                  </p>
                  <div className="mt-5">
                    <Cta href="/franchising#inquiry">Franchise inquiry</Cta>
                  </div>
                </Card>

                {CONTACT_EMAIL ? (
                  <p className="text-steel mt-6 leading-relaxed">
                    You can also write to{" "}
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="link font-semibold"
                    >
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </p>
                ) : null}
              </div>

              <div>
                <ContactForm />
              </div>
            </div>
          </Band>
        </Container>
      </section>

      <JsonLd data={breadcrumbSchema([{ name: "Contact", path: "/contact" }])} />
    </>
  );
}
