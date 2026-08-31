import type { Metadata } from "next";
import { ContactForm } from "@/components/form/contact-form";
import { Cta, CtaRow } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/system/section";
import { SectionHead } from "@/components/system/section-head";
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
 *
 * THE CONDITIONAL EMAIL BLOCK STAYS. The import drops it. It renders nothing
 * today, but it is the mechanism that makes a Craftline mailbox appear on the
 * day one exists, and deleting a working mechanism because its output is
 * currently empty is how a site quietly loses a capability.
 *
 * PHASE 2A. The two routing notes are ruled blocks rather than boxed cards.
 * They are asides beside a form, and a box around each one made them compete
 * with the form for weight when their whole job is to send a subset of readers
 * somewhere else before they start typing.
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

      <Section ground="white">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
          <div>
            <SectionHead
              eyebrow="Send a message"
              tone="signal"
              title="Get in touch."
              lead="An inquiry commits you to nothing and is read by a person."
            />

            {/*
              Routing note directly under the heading. Someone with an
              electrical problem who reaches this page should leave for the
              brand site before filling anything in, not after waiting for a
              reply that is not coming.
            */}
            <div className="border-graphite mt-12 border-t-2 pt-7">
              <h3 className="d3-sentence">Looking for electrical service?</h3>
              <p className="text-steel mt-3 max-w-[58ch] leading-relaxed">
                Craftline does not take service calls. {wattsmith.name} handles
                work in {wattsmith.state} and is reachable at{" "}
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
            </div>

            <div className="border-line mt-8 border-t pt-7">
              <h3 className="d3-sentence">Asking about franchising?</h3>
              <p className="text-steel mt-3 max-w-[58ch] leading-relaxed">
                The franchise inquiry form asks the few extra questions that make
                a first reply useful, so it is the faster route.
              </p>
              <CtaRow className="mt-6">
                <Cta href="/franchising#inquiry">Franchise inquiry</Cta>
              </CtaRow>
            </div>

            {CONTACT_EMAIL ? (
              <p className="text-steel mt-8 leading-relaxed">
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
      </Section>

      <JsonLd data={breadcrumbSchema([{ name: "Contact", path: "/contact" }])} />
    </>
  );
}
