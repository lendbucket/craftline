import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/container";
import { Cta } from "@/components/cta";
import { BRANDS, CAPABILITIES, COMPANY, FOUNDING_STATEMENT } from "@/config/company";

/**
 * Home page.
 *
 * Positioning only. This page states what the company is, shows the one brand
 * that exists, and offers two ways to make contact. It does not sell anything,
 * and every franchise reference on it points at an information page rather than
 * an application.
 *
 * The layout carries no imagery. Every slot in src/data/images.ts is still
 * pending, and the hero is built to look deliberate with type and surface alone
 * rather than to look like it is missing a photograph. See the home-hero slot
 * for the direction if one is ever shot.
 */

/** Small caps label used above every section heading. Keeps the rhythm. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="tracked-caps text-[0.65rem] text-bronze">{children}</p>
  );
}

export default function HomePage() {
  const [wattsmith] = BRANDS;

  return (
    <>
      {/* HERO */}
      <section className="bg-ink text-paper">
        <Container>
          <div className="py-20 sm:py-28 lg:py-36">
            <Eyebrow>Brand and franchise development</Eyebrow>
            <h1 className="display-xl mt-6 max-w-3xl text-paper">
              Skilled trade service brands, built to run in more than one market.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-dark">
              {COMPANY.name} builds and operates skilled trade service brands
              designed to expand into new markets. The first is{" "}
              {wattsmith.name}, a licensed, insured, veteran owned electrical
              contractor operating in {wattsmith.state}.
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
              once and held everywhere the brand appears.
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
              offered to anyone else to run.
            </p>

            <article className="mt-12 rounded-lg border border-ink/10 bg-white p-7 sm:p-10">
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
                  Outbound to the operating brand's own site. rel="noopener" is
                  the safety default for target="_blank"; there is no nofollow
                  because Craftline genuinely publishes this brand.
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
              inquiry only. {FOUNDING_STATEMENT} Veterans considering ownership
              are encouraged to make contact.
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
