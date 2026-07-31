import type { Metadata } from "next";
import { Container } from "@/components/container";
import { EffectiveDate, LegalSection, P } from "@/components/legal";
import { PageHeader } from "@/components/page-header";
import { TitleBlock } from "@/components/title-block";
import {
  BRANDS,
  COMPANY,
  FRANCHISE_DISCLAIMER,
  LEGAL_ENTITIES,
  POLICY_LAST_UPDATED,
} from "@/config/company";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of use",
  description:
    "Terms of use for craftlinebrands.com. The site is informational, it is not a franchise offer, and it does not provide services.",
  path: "/terms",
});

/**
 * TERMS OF USE.
 *
 * PENDING ATTORNEY REVIEW, and more so than the privacy policy, because a
 * privacy policy describes what a site does while terms assert legal positions.
 * Everything here is written narrow and plain so that counsel is tightening
 * accurate language rather than removing invented claims.
 *
 * DELIBERATELY ABSENT, AND NOT AN OVERSIGHT. Three things a finished terms page
 * usually carries are missing because inventing them would be worse than the
 * gap, and each is a decision for the attorney and the owner rather than for
 * whoever is writing markup:
 *
 *   - Governing law. Both entities are Wyoming LLCs and the operating brand
 *     works in Texas. Picking one from here would be a guess with real
 *     consequences for where a dispute is heard.
 *   - Dispute resolution, arbitration, and any class action waiver. These are
 *     substantive rights, they are regulated differently state by state, and
 *     none of them should appear because a template had them.
 *   - Indemnification. A one sided indemnity written by the site author is
 *     exactly the clause a court reads narrowly, and it is not needed for an
 *     informational site.
 *
 * The franchise disclaimer below is FRANCHISE_DISCLAIMER rendered verbatim. It
 * is the one piece of text on this site that is legally load bearing. Do not
 * reword it here, and note that the global footer renders it again on this page
 * as it does on every page.
 */
export default function TermsPage() {
  const [wattsmith] = BRANDS;

  return (
    <>
      <PageHeader
        label="Legal"
        title="Terms of use"
        lead="The terms that apply when you use this website."
      />

      <section className="bg-zinc">
        <Container>
          <div className="py-16 sm:py-20">
            <div className="max-w-2xl space-y-12">
              <EffectiveDate />

              <LegalSection id="who" heading="Who operates this site">
                <P>
                  {COMPANY.domain} is operated by {LEGAL_ENTITIES[0].name} and{" "}
                  {LEGAL_ENTITIES[1].name}, both {LEGAL_ENTITIES[0].jurisdiction}{" "}
                  limited liability companies. {LEGAL_ENTITIES[0].name}{" "}
                  {LEGAL_ENTITIES[0].role.toLowerCase()}{" "}
                  {LEGAL_ENTITIES[1].name} is the franchisor entity.
                </P>
                <P>
                  Using this site means these terms apply to you. If you do not
                  accept them, please do not use the site.
                </P>
              </LegalSection>

              <LegalSection id="purpose" heading="What this site is for">
                <P>
                  This is a corporate website. It describes {COMPANY.name}, the
                  brands it holds, and its franchise development work. It is
                  information, and it is not advice of any kind, whether legal,
                  financial, tax, or business.
                </P>
                <P>
                  {COMPANY.name} does not perform electrical work and does not
                  take service calls. {wattsmith.name} is a separate operating
                  business with its own website, its own terms, and its own
                  customers. Nothing on this site is an offer to perform work
                  for you.
                </P>
              </LegalSection>

              <LegalSection id="franchise" heading="This site is not a franchise offer">
                {/*
                  Verbatim from FRANCHISE_DISCLAIMER. Rendered here in the body
                  of the terms in addition to the global footer instance,
                  because the terms page is where someone goes looking for
                  exactly this statement.
                */}
                <P>{FRANCHISE_DISCLAIMER}</P>
                <P>
                  The franchise inquiry form on this site collects interest and
                  nothing more. Sending it does not apply for anything, does not
                  reserve anything, does not qualify you for anything, and
                  creates no agreement between you and {COMPANY.name}.
                </P>
              </LegalSection>

              <LegalSection id="ip" heading="Trademarks and content">
                <P>
                  The {COMPANY.name} name, the brand names shown on this site,
                  and the text and design of the site are owned by{" "}
                  {LEGAL_ENTITIES[0].name} or used by it with permission. You
                  may read, share, and link to these pages. You may not use the
                  marks or copy the content to present yourself as connected
                  with {COMPANY.name} or any of its brands.
                </P>
              </LegalSection>

              <LegalSection id="links" heading="Links to other sites">
                <P>
                  This site links to {wattsmith.url.replace("https://", "")} and
                  may link to others. Those sites are governed by their own
                  terms, and {COMPANY.name} is not responsible for their content.
                </P>
              </LegalSection>

              <LegalSection id="accuracy" heading="Accuracy and availability">
                <P>
                  This site is published as it is. The information here is
                  believed to be accurate when published and may become out of
                  date. {COMPANY.name} does not promise that the site will be
                  available without interruption or free of error, and it may
                  change or remove any part of it at any time.
                </P>
              </LegalSection>

              <LegalSection id="changes" heading="Changes to these terms">
                <P>
                  These terms will change as the company and the site do. The
                  date at the top of this page shows when they last changed.
                  Continuing to use the site after a change means the revised
                  terms apply.
                </P>
              </LegalSection>
            </div>
          </div>
        </Container>
      </section>

      <TitleBlock
        sheet="Terms of use"
        issuedFor="Terms as published."
        revision={POLICY_LAST_UPDATED}
      />
    </>
  );
}
