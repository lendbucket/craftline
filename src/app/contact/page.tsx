import type { Metadata } from "next";
import { Container } from "@/components/container";
import { ContactForm } from "@/components/form/contact-form";
import { PageHeader } from "@/components/page-header";
import { SectionLabel } from "@/components/section";
import { TitleBlock } from "@/components/title-block";
import { BRANDS, COMPANY, CONTACT_EMAIL } from "@/config/company";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact Craftline Brands about the company, its brands, or franchise development. Service calls go to the operating brand, not to Craftline.",
  path: "/contact",
});

/**
 * Contact page.
 *
 * Two jobs: take a corporate enquiry, and redirect service customers to the
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

      <section className="bg-zinc">
        <Container>
          <div className="py-20 sm:py-24">
            {/*
              Routing note first. Someone with an electrical problem who reaches
              this page should leave for the brand site before filling anything
              in, not after waiting for a reply that is not coming.
            */}
            <div className="max-w-xl rounded-lg border border-rule bg-chalk p-6">
              <h2 className="text-base font-semibold">
                Looking for electrical service?
              </h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-steel">
                Craftline does not take service calls. {wattsmith.name} handles
                work in {wattsmith.state} and is reachable at{" "}
                <a
                  href={wattsmith.url}
                  target="_blank"
                  rel="noopener"
                  className="tap-44 font-semibold text-copper hover:underline"
                >
                  {wattsmith.url.replace("https://", "")}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
                .
              </p>
            </div>

            <div className="mt-14">
              <SectionLabel>Send a message</SectionLabel>
              <h2 className="display-2 mt-5 max-w-2xl">Get in touch.</h2>
              {CONTACT_EMAIL ? (
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-steel">
                  You can also write to{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-semibold text-copper hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
              ) : null}

              <div className="mt-10">
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <TitleBlock sheet="Contact" />
    </>
  );
}
