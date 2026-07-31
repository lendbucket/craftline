import type { Metadata } from "next";
import { Container } from "@/components/container";
import { EffectiveDate, LegalList, LegalSection, P } from "@/components/legal";
import { PageHeader } from "@/components/page-header";
import { BRANDS, COMPANY, CONTACT_EMAIL, LEGAL_ENTITIES } from "@/config/company";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy policy",
  description:
    "How craftlinebrands.com handles information. The site sets no cookies, runs no advertising, and does not sell personal information.",
  path: "/privacy",
});

/**
 * PRIVACY POLICY.
 *
 * PENDING ATTORNEY REVIEW. Neither this page nor the terms has been reviewed by
 * counsel. Both are written to describe what the site actually does today, so
 * that a lawyer is correcting an accurate document rather than discovering that
 * the site was described from a template.
 *
 * EVERY FACTUAL CLAIM BELOW WAS VERIFIED AGAINST THE BUILT SITE, NOT ASSUMED.
 * If you change what the site loads or stores, re-verify before editing here.
 * What was checked, and how:
 *
 *   - Cookies, localStorage, sessionStorage: a Playwright pass over all six
 *     routes, including after submitting the contact form, returned an empty
 *     cookie jar and no storage keys on every page.
 *   - Third party requests: the same pass recorded zero requests to any origin
 *     other than this site's own.
 *   - Analytics: @vercel/analytics 2.0.1 contains no occurrence of
 *     document.cookie, localStorage, or sessionStorage anywhere in its
 *     distributed source. In production it loads /_vercel/insights/script.js,
 *     a path on this site's own domain. The external va.vercel-scripts.com host
 *     in that package is used only in development builds.
 *   - Fonts: next/font self hosts Archivo and Inter, so no request reaches
 *     Google Fonts.
 *
 * The claim this page does NOT make, deliberately: it does not describe a
 * storage or notification pipeline for form submissions, because none exists.
 * The forms transmit nothing. When that changes, this policy is updated in the
 * same commit as the endpoint, not after it ships.
 */
export default function PrivacyPage() {
  const [wattsmith] = BRANDS;

  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy policy"
        lead="What this site collects, which is very little, and what it does with it."
      />

      <section className="bg-paper">
        <Container>
          <div className="py-16 sm:py-20">
            <div className="max-w-2xl space-y-12">
              <EffectiveDate />

              <LegalSection id="scope" heading="What this policy covers">
                <P>
                  This policy covers {COMPANY.domain}, the corporate website
                  operated by {LEGAL_ENTITIES[0].name} and{" "}
                  {LEGAL_ENTITIES[1].name}.
                </P>
                <P>
                  It does not cover {wattsmith.name}, which operates its own
                  website at {wattsmith.url.replace("https://", "")} and
                  publishes its own privacy policy. If you contacted that
                  business about electrical work, its policy applies to that
                  contact and this one does not.
                </P>
              </LegalSection>

              <LegalSection id="forms" heading="Information the forms ask for">
                <P>
                  There are two forms on this site. The contact form asks for
                  your name, email address, phone number, and message. The
                  franchise inquiry form asks for your name, email address,
                  phone number, the city and state you are interested in, a
                  broad liquid capital range, a timeline, whether you are a
                  military veteran, and anything you would like to add.
                </P>
                <P>
                  Neither form is accepting submissions yet. Nothing you type
                  into either one is transmitted anywhere, stored anywhere, or
                  received by anyone. The forms check that what you entered
                  looks complete and then tell you that submissions are not
                  open. That check happens entirely in your browser.
                </P>
                <P>
                  Neither form asks for a social security number, a financial
                  document, a bank detail, or a payment. Neither one ever will.
                </P>
              </LegalSection>

              <LegalSection id="cookies" heading="Cookies and browser storage">
                <P>
                  This site sets no cookies. It does not use local storage or
                  session storage. This was verified by loading every page in a
                  real browser, including after using a form, and finding an
                  empty cookie jar and no stored keys.
                </P>
                <P>
                  Because nothing is stored on your device, there is no cookie
                  banner and no consent prompt. There is nothing to consent to.
                </P>
              </LegalSection>

              <LegalSection id="analytics" heading="Analytics">
                <P>
                  This site uses Vercel Web Analytics to count page views. It
                  records which pages are visited and roughly where visits come
                  from, and it produces aggregate totals. It sets no cookies and
                  stores nothing on your device, and its script is served from
                  this site&apos;s own domain rather than a third party one, so
                  your browser does not contact another company when you read
                  this page.
                </P>
                <P>
                  As with any website, the server receives the information a web
                  request necessarily carries, including your IP address, your
                  browser and device type, and the page you asked for. That
                  information is used to produce visit counts and to keep the
                  site running. It is not used to build a profile of you and it
                  is not used to follow you to other websites.
                </P>
              </LegalSection>

              <LegalSection id="hosting" heading="Hosting">
                <P>
                  This site is hosted by Vercel. Vercel processes requests on
                  our behalf in order to serve the site and keeps standard
                  server logs for operational and security purposes.
                </P>
              </LegalSection>

              <LegalSection id="not" heading="What this site does not do">
                <LegalList
                  items={[
                    "It does not sell or share personal information. There is no personal information to sell, and there would be no sale of it if there were.",
                    "It carries no advertising and no advertising trackers.",
                    "It has no accounts, no logins, and no user profiles.",
                    "It runs no third party scripts, no tag manager, no social media pixels, and no session recording.",
                    "It does not send marketing email, because it holds no email addresses.",
                    "It does not track you across other websites.",
                  ]}
                />
              </LegalSection>

              <LegalSection id="links" heading="Links to other sites">
                <P>
                  This site links out to {wattsmith.url.replace("https://", "")}
                  . Following that link takes you to a different website with
                  its own privacy practices, and this policy stops at the edge
                  of this one.
                </P>
              </LegalSection>

              <LegalSection id="children" heading="Children">
                <P>
                  This site is a corporate and franchise development site
                  intended for adults. It is not directed to children and it
                  does not knowingly collect information from them.
                </P>
              </LegalSection>

              <LegalSection id="contact" heading="Questions about this policy">
                {/*
                  CONTACT_EMAIL is unset because no craftlinebrands.com mailbox
                  exists. Saying so plainly is better than publishing an address
                  that bounces or borrowing the Wattsmith one. This section
                  changes in the same commit that the mailbox goes live.
                */}
                {CONTACT_EMAIL ? (
                  <P>
                    Write to {CONTACT_EMAIL} with any question about this
                    policy or about information held about you.
                  </P>
                ) : (
                  <P>
                    A corporate mailbox for {COMPANY.name} is not published yet,
                    and the contact form is not yet accepting submissions. Until
                    one of those is live there is no route to reach us about this
                    policy through this website. That is stated here rather than
                    papered over with an address that does not work, and it will
                    be corrected as soon as the mailbox exists.
                  </P>
                )}
              </LegalSection>

              <LegalSection id="changes" heading="Changes to this policy">
                <P>
                  This policy describes the site as it is today. It will change
                  when the site does, in particular when the forms begin
                  accepting submissions, and the date at the top of this page
                  will change with it.
                </P>
              </LegalSection>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
