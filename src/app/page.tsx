import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandLockup, hasBrandLockup } from "@/components/brand/brand-lockup";
import { Container } from "@/components/container";
import { Cta } from "@/components/cta";
import { MeasuredField } from "@/components/graphic";
import { Eyebrow } from "@/components/page-header";
import { BRANDS, CAPABILITIES, COMPANY, FOUNDING_STATEMENT } from "@/config/company";

/**
 * Home page.
 *
 * Positioning only. This page states what the company is, shows the one brand
 * that exists, and offers two ways to make contact. It does not sell anything,
 * and every franchise reference on it points at an information page rather than
 * an application.
 *
 * CATEGORY LANGUAGE. Four national category phrases appear across this page,
 * each once, each in a sentence that would be worth writing without them. They
 * describe what the company is. None of them carries a place name, because a
 * category plus a location is a statement about where a franchise is available,
 * and the FDD is not issued.
 *
 * IMAGERY. Still no photography, by choice rather than by delay. The hero
 * carries an abstract rule field from the design system and the brand section
 * carries the operating brand's real delivered lockup. Stock photography of
 * crews and job sites would imply operations Craftline does not have. See
 * src/data/images.ts for the slots that remain genuinely pending.
 */

export default function HomePage() {
  const [wattsmith] = BRANDS;
  const showLockup = hasBrandLockup(wattsmith.slug);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-paper">
        {/*
          Decorative only, and aria-hidden at the component. It sits behind the
          content at low opacity and is clipped by the section, so it can never
          push the headline around or introduce a horizontal scrollbar.
        */}
        <MeasuredField className="pointer-events-none absolute inset-y-0 right-0 h-full w-full text-bronze-bright opacity-[0.16] sm:w-3/4 lg:w-2/3" />
        <Container>
          <div className="relative py-20 sm:py-28 lg:py-36">
            <Eyebrow>Brand and franchise development</Eyebrow>
            <h1 className="display-xl mt-6 max-w-3xl text-paper">
              Skilled trade service brands, built to run in more than one market.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-dark">
              {COMPANY.name} builds skilled trades franchise systems and the
              brands that run on them. The first is {wattsmith.name}, a
              licensed, insured, veteran owned electrical contractor operating
              in {wattsmith.city}, {wattsmith.state}.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Cta href="/franchising">Franchise information</Cta>
              <Cta href="/contact" variant="outline">
                Contact
              </Cta>
            </div>
          </div>
        </Container>
      </section>

      {/* WHAT WE DO */}
      <section className="bg-paper">
        <Container wide>
          <div className="py-20 sm:py-24">
            <Eyebrow>What we do</Eyebrow>
            <h2 className="display-lg mt-5 max-w-2xl">
              Craftline sits behind the brand, not in front of the customer.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
              An operator runs the business in their own market. Craftline owns
              and maintains the system they run it with, so the standard is set
              once and held everywhere the brand appears. That system is what a
              home services franchise actually is: the brand, the playbook, the
              technology, and the expansion plan, held in one place and kept
              current.
            </p>

            <ul className="mt-14 grid gap-px overflow-hidden rounded-lg bg-paper-dark sm:grid-cols-2">
              {CAPABILITIES.map((capability) => (
                <li key={capability.title} className="bg-paper p-7 sm:p-8">
                  <h3 className="display-md">{capability.title}</h3>
                  <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">
                    {capability.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* BRANDS */}
      <section className="bg-paper-dark">
        <Container wide>
          <div className="py-20 sm:py-24">
            <Eyebrow>Brands</Eyebrow>
            <h2 className="display-lg mt-5 max-w-2xl">
              One operating brand today.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
              Craftline builds a brand to a working standard before it is
              offered to anyone else to run. An electrician franchise has to
              start with an electrical company that already works, so that is
              what was built first.
            </p>

            {/*
              The two column split only applies when there is artwork to put in
              the first column. Without that guard a brand with no lockup would
              squeeze its entire card into a 20rem column.
            */}
            <article
              className={`mt-12 overflow-hidden rounded-lg border border-ink/10 bg-white ${
                showLockup ? "lg:grid lg:grid-cols-[minmax(0,20rem)_1fr]" : ""
              }`}
            >
              {/*
                The operating brand's real delivered lockup, on the brand's own
                navy field, taken from config so the panel colour cannot drift
                from the palette published on the brand page.

                Decorative: the brand name is the h3 immediately beside it, and
                labelling both would make a screen reader announce "Wattsmith
                Electric" twice in a row.

                The whole panel is conditional, not just the artwork inside it.
                A brand with no ported lockup would otherwise render as a bare
                navy rectangle, which reads as a failed image rather than as a
                card that simply has no logo yet.
              */}
              {showLockup ? (
                <div
                  className="flex items-center justify-center px-8 py-12 lg:py-14"
                  style={{ backgroundColor: wattsmith.palette[0].hex }}
                >
                  <BrandLockup
                    slug={wattsmith.slug}
                    onDark
                    decorative
                    className="w-full max-w-[15rem]"
                  />
                </div>
              ) : null}

              <div className="p-7 sm:p-10">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h3 className="display-md">{wattsmith.name}</h3>
                  <p className="tracked-caps text-[0.65rem] text-bronze">
                    {wattsmith.category}
                  </p>
                </div>

                <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
                  {wattsmith.summary}
                </p>

                <ul className="mt-7 flex flex-wrap gap-2">
                  {wattsmith.attributes.map((attribute) => (
                    <li
                      key={attribute}
                      className="rounded-sm border border-ink/15 px-3 py-1.5 text-xs text-ink-600"
                    >
                      {attribute}
                    </li>
                  ))}
                </ul>

                <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3">
                  <Link
                    href={`/brands/${wattsmith.slug}`}
                    className="tap-44 text-sm font-semibold text-bronze hover:underline"
                  >
                    About this brand
                  </Link>
                  {/*
                    Outbound to the operating brand's own site. rel="noopener"
                    is the safety default for target="_blank"; there is no
                    nofollow because Craftline genuinely publishes this brand.
                  */}
                  <a
                    href={wattsmith.url}
                    target="_blank"
                    rel="noopener"
                    className="tap-44 inline-flex items-center gap-1.5 text-sm text-ink-600 hover:text-bronze"
                  >
                    {wattsmith.url.replace("https://", "")}
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </div>
              </div>
            </article>
          </div>
        </Container>
      </section>

      {/* FRANCHISE INTEREST */}
      <section className="bg-ink text-paper">
        <Container>
          <div className="py-20 sm:py-24">
            <Eyebrow>For prospective operators</Eyebrow>
            <h2 className="display-lg mt-5 max-w-2xl text-paper">
              Craftline is developing its franchise program.
            </h2>
            {/*
              Information and inquiry only. No offer language, no pricing, no
              capital requirement, and no statement or implication about what an
              operator might earn. The FDD is not issued.
            */}
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-dark">
              The franchising page describes the kind of operator the brand is
              built for and how the support model works. It is information and
              inquiry only. This is a veteran franchise company in the plainest
              sense of the phrase. {FOUNDING_STATEMENT} The brand operating
              under it is veteran owned as well, and veterans considering
              ownership are encouraged to make contact.
            </p>
            <div className="mt-10">
              <Cta href="/franchising">Read the franchise information</Cta>
            </div>
          </div>
        </Container>
      </section>

      {/* CONTACT */}
      <section className="bg-paper">
        <Container>
          <div className="py-20 sm:py-24">
            <Eyebrow>Contact</Eyebrow>
            <h2 className="display-lg mt-5 max-w-2xl">
              Corporate and brand inquiries.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
              For questions about {COMPANY.name}, the brands it operates, or
              anything that is not a service call for one of those brands.
            </p>
            <div className="mt-10">
              <Cta href="/contact" variant="outline">
                Contact Craftline
              </Cta>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
