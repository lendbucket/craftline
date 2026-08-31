import type { Metadata } from "next";
import { Container } from "@/components/container";
import { EffectiveDate, LegalList, LegalSection, P } from "@/components/legal";
import { PageHeader } from "@/components/page-header";
import {
  BRANDS,
  COMPANY,
  CONTACT_EMAIL,
  LEGAL_ENTITIES,
} from "@/config/company";
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
 * THIS PAGE CHANGES IN THE SAME COMMIT AS THE FORMS. It previously said the
 * forms transmitted nothing, which was true until the commit that wired them to
 * a database. A privacy policy that lags the code by even one deploy is a false
 * statement about what is happening to someone's data, so the rule is: if you
 * change what a form sends, where it goes, or who is told about it, this file
 * changes with it or the change does not ship.
 *
 * EVERY FACTUAL CLAIM BELOW WAS VERIFIED AGAINST THE BUILT SITE, NOT ASSUMED.
 * What was checked, and how:
 *
 *   - Cookies, localStorage, sessionStorage: a Playwright pass over all eight
 *     routes, including submitting both forms, returned an empty cookie jar and
 *     no storage keys on every page. Re-verified after the forms went live,
 *     because server actions are a new request path.
 *   - Third party requests from the browser: zero on every route. The forms
 *     post to this site's own server, which is what then talks to Supabase and
 *     Resend. The visitor's browser never contacts either one.
 *   - Analytics: @vercel/analytics 2.0.1 contains no occurrence of
 *     document.cookie, localStorage, or sessionStorage anywhere in its
 *     distributed source. In production it loads /_vercel/insights/script.js,
 *     a path on this site's own domain.
 *   - Stored columns: the forms audit asserts the exact column set written to
 *     each table, so the list below cannot silently drift from what is stored.
 *
 * NO EMAIL ADDRESS IS RENDERED ON THIS PAGE. The notification recipient is
 * described but never printed: publishing an internal mailbox on a public page
 * is a spam magnet, and the Craftline address does not exist yet anyway. See
 * the contact section at the bottom, which states that gap plainly.
 */
export default function PrivacyPage() {
  const [wattsmith] = BRANDS;

  return (
    <>
      <PageHeader
        label="Legal"
        title="Privacy policy"
        lead="What this site collects, which is very little, and what it does with it."
      />

      <section className="bg-white">
        <Container narrow>
          <div className="band">
            <div className="space-y-12">
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

              <LegalSection id="forms" heading="What the forms collect">
                <P>
                  There are two forms on this site, and they are the only way
                  this site collects anything about you. Both are voluntary.
                </P>
                <P>
                  The contact form collects your name, your email address, your
                  phone number if you give one, and your message.
                </P>
                <P>
                  The franchise inquiry form collects your name, your email
                  address, your phone number if you give one, the city and state
                  you are interested in, a broad liquid capital range if you
                  choose to answer, your timeline, whether you are a military
                  veteran if you choose to answer, and anything you add in the
                  message box. Declining to answer the capital or veteran
                  questions is recorded as no answer, not as a no.
                </P>
                <P>
                  Neither form asks for a social security number, a financial
                  document, a bank detail, or a payment. Neither one ever will.
                </P>
              </LegalSection>

              <LegalSection id="storage" heading="What happens when you submit">
                <P>
                  When you submit a form, what you entered is sent to this
                  site&apos;s own server, which writes it to a database and then
                  sends a notification email so that a person knows to read it.
                  Your browser never contacts the database or the mail provider
                  directly.
                </P>
                <P>
                  The database is a Supabase project operated by {COMPANY.name}.
                  It is the same project that holds records for{" "}
                  {wattsmith.name}, in separate tables. Access is closed by
                  default: the tables have row level security enabled with no
                  access policies, which means no browser, no public key, and no
                  ordinary connection can read them. Only the server, holding a
                  credential that is never sent to your browser, can write or
                  read those rows.
                </P>
                <P>
                  The notification email goes to a working company mailbox and
                  contains what you submitted, so that whoever reads it can
                  reply. It is not published on this page, and it is not the
                  same as a public contact address.
                </P>
                <P>
                  If the database write fails, the form tells you plainly that
                  your message was not sent, and no notification is issued. It
                  will never show you a confirmation for something that was not
                  saved.
                </P>
              </LegalSection>

              <LegalSection id="processors" heading="Who else handles it">
                <P>
                  Three companies process this data on our behalf, and none of
                  them is permitted to use it for their own purposes:
                </P>
                <LegalList
                  items={[
                    "Vercel hosts this site and runs the server that receives your submission.",
                    "Supabase provides the database the submission is stored in.",
                    "Resend delivers the notification email.",
                  ]}
                />
                <P>
                  That is the entire list. Your submission is not passed to
                  anyone else.
                </P>
              </LegalSection>

              <LegalSection id="retention" heading="How long it is kept">
                <P>
                  Submissions are kept as business records until they are no
                  longer needed and are then deleted by hand. There is currently
                  no automatic deletion schedule, and saying otherwise would
                  describe a process that does not exist. If you want your
                  submission deleted, ask, and it will be.
                </P>
              </LegalSection>

              <LegalSection id="cookies" heading="Cookies and browser storage">
                <P>
                  This site sets no cookies. It does not use local storage or
                  session storage. This was verified by loading every page in a
                  real browser and submitting both forms, then finding an empty
                  cookie jar and no stored keys.
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

              <LegalSection id="not" heading="What this site does not do">
                <LegalList
                  items={[
                    "It does not sell personal information, and it does not share it for advertising.",
                    "It carries no advertising and no advertising trackers.",
                    "It has no accounts, no logins, and no user profiles.",
                    "It runs no third party scripts in your browser, no tag manager, no social media pixels, and no session recording.",
                    "It does not add you to a mailing list. An address you give on a form is used to reply to you.",
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
                  exists. The gap language stays until one does. Do not
                  substitute the internal notification address here: that is an
                  operational mailbox, not a published contact point, and the
                  two are separate decisions.
                */}
                {CONTACT_EMAIL ? (
                  <P>
                    Write to {CONTACT_EMAIL} with any question about this
                    policy, or to ask for a submission of yours to be deleted.
                  </P>
                ) : (
                  <P>
                    A public mailbox for {COMPANY.name} is not published yet. In
                    the meantime the contact form on this site works and reaches
                    a person, so use it for any question about this policy or to
                    ask for a submission of yours to be deleted. A published
                    address will be added here as soon as one exists.
                  </P>
                )}
              </LegalSection>

              <LegalSection id="changes" heading="Changes to this policy">
                <P>
                  This policy describes the site as it is today, and it changes
                  in the same release as the behaviour it describes rather than
                  afterwards. The date at the top of this page shows when it
                  last changed.
                </P>
              </LegalSection>
            </div>
          </div>
        </Container>
      </section>

    </>
  );
}
