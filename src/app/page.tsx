import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandLockup, hasBrandLockup } from "@/components/brand/brand-lockup";
import { Container } from "@/components/container";
import { Cta } from "@/components/cta";
import { MaterialPlate } from "@/components/material-plate";
import { Band, Register, Rule, SectionLabel } from "@/components/section";
import { TitleBlock } from "@/components/title-block";
import {
  BRANDS,
  CAPABILITIES,
  CATEGORY_POSITIONING,
  COMPANY,
  FOUNDING_STATEMENT,
  OPERATOR_PROFILE,
} from "@/config/company";

/**
 * Home page.
 *
 * The full Craftline thesis, in order: what the company is, why this category
 * suits the structure, what the system consists of, the brand that proves it
 * runs, and who it is built for. Each band carries a real argument. The
 * previous version stated the positioning and stopped, which is why it read
 * sparse: there was nothing on the page for a serious reader to actually
 * engage with.
 *
 * LEGAL. Positioning and information only. No offer language, no pricing, no
 * capital requirement, and no statement or implication about what an operator
 * might earn. Every franchise reference points at an information page rather
 * than an application. The FDD is not issued.
 *
 * CATEGORY LANGUAGE. The four national category phrases appear here, each
 * once, each in a sentence worth writing without it. None carries a place
 * name: a category plus a location is a statement about where a franchise is
 * available, and there is no such statement to make.
 */

export default function HomePage() {
  const [wattsmith] = BRANDS;
  const showLockup = hasBrandLockup(wattsmith.slug);

  return (
    <>
      {/* ---------------------------------------------------------------
          HERO. The thesis, over material. The plate is treatment ready:
          it renders the raceway linework today and a licensed copper
          macro the day one is bought, with no layout change either way.
          --------------------------------------------------------------- */}
      <section className="bg-graphite text-zinc relative isolate overflow-hidden">
        <MaterialPlate id="home-hero" intensity="quiet" />
        <Container>
          <div className="relative py-24 sm:py-32 lg:py-40">
            <div className="max-w-[22rem]">
              <Rule />
              <p className="label text-datum mt-4">
                Brand and franchise development
              </p>
            </div>

            <h1 className="display-1 mt-8 max-w-4xl text-balance">
              The trade is the easy part. The business around it is what breaks.
            </h1>

            <p className="body-lg text-steel mt-8 max-w-2xl">
              {COMPANY.name} builds skilled trades franchise systems and the
              brands that run on them. It owns the marks, the operating
              playbooks, the technology, and the expansion plan, so an operator
              inherits a business that already works instead of assembling one.
            </p>

            <div className="mt-12 flex flex-col gap-3 sm:flex-row">
              <Cta href="/franchising">Franchise information</Cta>
              <Cta href="/about" variant="outline">
                How the model works
              </Cta>
            </div>
          </div>
        </Container>

        {/*
          The category strip. A title block field row, which introduces the
          site's signature device in the first screen rather than saving it
          for the foot of the page. These are the four categories the company
          belongs to, stated as what it is.
        */}
        <div className="border-rule relative border-t">
          <Container>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-4">
              {CATEGORY_POSITIONING.map((category, index) => (
                <li
                  key={category}
                  className={`border-rule py-5 sm:px-6 sm:first:pl-0 ${
                    index > 0 ? "border-t sm:border-t-0 sm:border-l" : ""
                  }`}
                >
                  <p className="label-sm text-steel">{category}</p>
                </li>
              ))}
            </ul>
          </Container>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          WHY SKILLED TRADES
          --------------------------------------------------------------- */}
      <section className="bg-zinc">
        <Container>
          <Band>
            <SectionLabel>Why skilled trades</SectionLabel>
            <h2 className="display-2 mt-8 max-w-3xl text-balance">
              This category fits the structure, and not for fashionable reasons.
            </h2>

            <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="reveal space-y-6">
                <p className="body-lg text-steel">
                  Franchising gets talked about as a strategy you can apply to
                  any business. It is not. It is a structure, and structures fit
                  some shapes and not others. Trade service work happens to have
                  the properties the structure needs.
                </p>
                <p className="text-graphite">
                  The work has to happen where the customer is, so the natural
                  unit is one crew serving one metro area and there is no way to
                  consolidate it into a warehouse. Demand is a problem rather
                  than a preference: nobody shops for an electrician the way
                  they shop for a sofa, so the business does not have to
                  manufacture demand, it has to be findable and then show up
                  when it said it would.
                </p>
              </div>
              <div className="reveal space-y-6">
                <p className="text-graphite">
                  The standards already exist and somebody else wrote them.
                  Electrical work is governed by a code, permits are pulled, and
                  an inspector with no stake in the job signs it off. A playbook
                  in this category does not have to invent a definition of
                  correct. It has to define how a business consistently produces
                  work that passes.
                </p>
                <p className="text-graphite">
                  And the customer cannot check the work. Once the drywall is
                  closed nobody can tell careful wiring from wiring that becomes
                  someone else&apos;s problem in nine years. That is why a brand is
                  worth something here, and why it is only worth something if
                  there is a real method behind it.
                </p>
                <Link
                  href="/insights/why-trade-services-suit-franchise-systems"
                  className="text-datum tap-44 inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold hover:underline"
                >
                  Read the long version
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          THE SYSTEM. The four parts, on the register.

          The register is permitted here because this is a genuinely defined
          set: these four are the whole of what Craftline holds, and the
          order runs from the promise to the boundary it applies within.
          See the warning on Register in src/components/section.tsx.
          --------------------------------------------------------------- */}
      <section className="bg-chalk">
        <Container>
          <Band>
            <SectionLabel>The system</SectionLabel>
            <h2 className="display-2 mt-8 max-w-3xl text-balance">
              Four parts, and the whole thing only works as a loop.
            </h2>
            <p className="body-lg text-steel mt-8 max-w-2xl">
              That system is what a home services franchise actually is. The
              brand is a promise to a customer who cannot verify the work. The
              playbook is the method that makes the promise survivable. The
              technology is how anyone can tell whether the method is being
              followed. The territory is where one operator is accountable for
              all of it. Remove any one and the rest degrade.
            </p>

            <div className="mt-16 space-y-12">
              {CAPABILITIES.map((capability, index) => (
                <Register
                  key={capability.title}
                  index={index + 1}
                  label={capability.title}
                >
                  <h3 className="display-3 max-w-2xl">{capability.title}</h3>
                  <p className="text-graphite mt-5 max-w-2xl leading-relaxed">
                    {capability.body}
                  </p>
                </Register>
              ))}
            </div>

            <div className="mt-14">
              <Cta href="/about" variant="outline">
                The model in full
              </Cta>
            </div>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          THE PROOF POINT
          --------------------------------------------------------------- */}
      <section className="bg-zinc">
        <Container wide>
          <Band>
            <SectionLabel>The proof point</SectionLabel>
            <h2 className="display-2 mt-8 max-w-3xl text-balance">
              An electrician franchise has to start with an electrical company
              that already works.
            </h2>
            <p className="body-lg text-steel mt-8 max-w-2xl">
              So that is what was built first. {wattsmith.name} operates in{" "}
              {wattsmith.city}, {wattsmith.state}, and the systems above were
              built against it rather than designed in the abstract. A playbook
              written by people who have not done the work is the most expensive
              kind of document there is.
            </p>

            <article className="border-rule bg-chalk reveal mt-14 border lg:grid lg:grid-cols-[minmax(0,22rem)_1fr]">
              {/*
                The delivered lockup on the brand's own navy, taken from config
                so the plate colour cannot drift from the palette published on
                the brand page. It sits on the light ground rather than inside
                a dark band, so the navy reads as a distinct plate instead of
                dissolving into the section.

                Decorative: the brand name is the heading beside it, and
                labelling both makes a screen reader say it twice.
              */}
              {showLockup ? (
                <div
                  className="flex items-center justify-center px-10 py-14"
                  style={{ backgroundColor: wattsmith.palette[0].hex }}
                >
                  <BrandLockup
                    slug={wattsmith.slug}
                    onDark
                    decorative
                    className="w-full max-w-[16rem]"
                  />
                </div>
              ) : null}

              <div className="p-8 sm:p-12">
                <p className="label-sm text-datum">{wattsmith.category}</p>
                <h3 className="display-3 mt-4">{wattsmith.name}</h3>
                <p className="text-graphite mt-5 max-w-xl leading-relaxed">
                  {wattsmith.summary}
                </p>

                <ul className="border-rule mt-8 grid gap-px sm:grid-cols-2">
                  {wattsmith.attributes.map((attribute) => (
                    <li
                      key={attribute}
                      className="border-rule value text-steel border-t py-3"
                    >
                      {attribute}
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <Link
                    href={`/brands/${wattsmith.slug}`}
                    className="text-datum tap-44 text-[0.9375rem] font-semibold hover:underline"
                  >
                    About this brand
                  </Link>
                  {/*
                    Outbound to the operating brand's own site. rel="noopener"
                    is the safety default for target="_blank"; no nofollow,
                    because Craftline genuinely publishes this brand and the
                    link is an ownership statement.
                  */}
                  <a
                    href={wattsmith.url}
                    target="_blank"
                    rel="noopener"
                    className="text-steel hover:text-datum tap-44 inline-flex items-center gap-1.5 text-[0.9375rem] transition-colors"
                  >
                    {wattsmith.url.replace("https://", "")}
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </div>
              </div>
            </article>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          THE OPERATOR
          --------------------------------------------------------------- */}
      <section className="bg-graphite text-zinc">
        <Container>
          <Band>
            <SectionLabel>The operator</SectionLabel>
            <h2 className="display-2 mt-8 max-w-3xl text-balance">
              A good market with the wrong operator is a bad outcome that takes
              two years to become obvious.
            </h2>
            <p className="body-lg text-steel mt-8 max-w-2xl">
              There is no experience requirement stated anywhere on this site,
              because no Franchise Disclosure Document has been issued and a
              stated threshold would be a claim about who will be accepted.
              These are traits rather than qualifications, and each one follows
              from the support model above.
            </p>

            <ul className="mt-14 space-y-8">
              {OPERATOR_PROFILE.map((trait) => (
                <li key={trait} className="reveal max-w-3xl">
                  <Rule className="max-w-[6rem]" />
                  <p className="body-lg mt-5">{trait}</p>
                </li>
              ))}
            </ul>

            <p className="text-steel mt-14 max-w-2xl leading-relaxed">
              {FOUNDING_STATEMENT} That makes this a veteran franchise company
              by origin rather than by positioning, and the brand operating
              under it is veteran owned as well. Veterans considering ownership
              are encouraged to make contact.
            </p>

            <div className="mt-12 flex flex-col gap-3 sm:flex-row">
              <Cta href="/franchising">Franchise information</Cta>
              <Cta href="/contact" variant="outline">
                Contact Craftline
              </Cta>
            </div>
          </Band>
        </Container>
      </section>

      <TitleBlock sheet="Home" />
    </>
  );
}
