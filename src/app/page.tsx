import Link from "next/link";
import { BrandRow } from "@/components/brand-row";
import { Container } from "@/components/container";
import { Cta } from "@/components/cta";
import { Band, Card, SectionHeading } from "@/components/section";
import { SectionImage } from "@/components/section-image";
import {
  BRANDS,
  CAPABILITIES,
  COMPANY,
  FOUNDING_STATEMENT,
  LEGAL_ENTITIES,
  OPERATOR_PROFILE,
} from "@/config/company";
import { getInsight } from "@/data/insights";

/**
 * Home page.
 *
 * WHAT THIS PAGE HAS TO DO, IN ORDER: say what the company is in one sentence a
 * reader can repeat, show the brand it actually operates, explain franchising
 * plainly enough that someone new to it is not bluffing their way through the
 * rest of the site, say who it is looking for, and offer a way to make contact.
 * It is read by prospects, their attorneys, and their lenders, and all three
 * are looking for reasons to trust a company that has not issued an FDD.
 *
 * LEGAL, SAME AS EVERY PAGE. No financial performance representation of any
 * kind: no revenue, profit, earnings, ROI, payback, unit economics, averages,
 * ranges, or examples. No fee, royalty, or capital figure. No "buy", "own
 * today", "apply", "qualify", "approved", or "secure your". No statement about
 * which markets are open, because territory availability is an offer term. The
 * disclaimer renders in the footer of every page, including this one.
 *
 * CATEGORY LANGUAGE. The four national category phrases from
 * CATEGORY_POSITIONING each appear once, in a sentence that would be worth
 * writing without them. None carries a place name: a category plus a location
 * is a statement about where a franchise is available, and there is no such
 * statement to make.
 *
 * Every fact here traces to src/config/company.ts.
 */
export default function HomePage() {
  const [wattsmith] = BRANDS;
  const primer = getInsight("how-a-franchise-brand-system-works");

  return (
    <>
      {/* ---------------------------------------------------------------
          HERO
          --------------------------------------------------------------- */}
      <section className="bg-white">
        <Container>
          <div className="py-16 sm:py-20 lg:py-24">
            <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
              <div>
              <h1 className="h1">
                A franchise development company building skilled trade service
                brands.
              </h1>
              <p className="lead mt-6 max-w-2xl">
                {COMPANY.name} owns the marks, the operating playbooks, the
                technology, and the expansion plan behind the brands it builds.
                An operator joins a business that already works instead of
                assembling one.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Cta href="/franchising">Explore franchising</Cta>
                <Cta href="/about" variant="secondary">
                  About the company
                </Cta>
              </div>
              </div>

              <SectionImage
                slot="home-hero"
                priority
                className="h-64 w-full sm:h-80 lg:h-[26rem]"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          WHAT CRAFTLINE BUILDS
          --------------------------------------------------------------- */}
      <section className="bg-mist">
        <Container>
          <Band>
            <SectionHeading
              eyebrow="What we build"
              title="Four things a brand needs before anyone runs it."
              lead="A franchise system is only worth as much as what it hands an operator on the first day. These are the four parts Craftline builds and maintains at the brand level."
            />

            <ul className="mt-12 grid gap-5 sm:grid-cols-2">
              {CAPABILITIES.map((capability) => (
                <Card as="li" key={capability.title}>
                  <h3 className="h3">{capability.title}</h3>
                  <p className="text-steel mt-3 leading-relaxed">
                    {capability.body}
                  </p>
                </Card>
              ))}
            </ul>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          OUR BRANDS
          --------------------------------------------------------------- */}
      <section className="bg-white">
        <Container>
          <Band>
            <SectionHeading
              eyebrow="Our brands"
              title="The brands Craftline operates."
              lead="One brand today, built and run before any part of it was offered to anyone else. That order is deliberate. A playbook is worth handing over only after it has been tested in a real business."
            />

            <div className="mt-12">
              <BrandRow />
            </div>

            <p className="text-steel mt-8 max-w-3xl leading-relaxed">
              {wattsmith.summary} It is the business the systems above were
              built on and tested against, which is why this site describes a
              skilled trades franchise programme rather than a plan for one.
            </p>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          FRANCHISING EXPLAINED
          --------------------------------------------------------------- */}
      <section className="bg-mist">
        <Container>
          <Band>
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <SectionHeading
                  eyebrow="Franchising, explained"
                  title="Start here if franchising is new to you."
                  lead="Most people evaluating a home services franchise for the first time are asked to make a serious decision using vocabulary nobody explained to them. This section exists to fix that before any conversation starts."
                />
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Cta href="/franchising">How franchising works</Cta>
                  <Cta href="/insights" variant="secondary">
                    Read the guides
                  </Cta>
                </div>
              </div>

              {/*
                Definitions only, and each describes the structure of
                franchising in general rather than Craftline's terms. Describing
                the framework is permitted before an FDD is issued. Describing
                this company's fees, royalties, or territory would be an offer
                term, so none of them appear here or anywhere.
              */}
              <dl className="border-line divide-line divide-y rounded-lg border bg-white">
                <div className="p-6">
                  <dt className="text-graphite font-semibold">Franchisor</dt>
                  <dd className="text-steel mt-2 leading-relaxed">
                    The company that owns the brand and the system and licenses
                    the right to operate under it.
                  </dd>
                </div>
                <div className="p-6">
                  <dt className="text-graphite font-semibold">Franchisee</dt>
                  <dd className="text-steel mt-2 leading-relaxed">
                    The independent owner who runs a business under that brand
                    and holds to its standards.
                  </dd>
                </div>
                <div className="p-6">
                  <dt className="text-graphite font-semibold">
                    Franchise Disclosure Document
                  </dt>
                  <dd className="text-steel mt-2 leading-relaxed">
                    The document a franchisor must deliver before it can offer a
                    franchise. It sets out the obligations on both sides.
                    Craftline has not issued one, so there is nothing to offer
                    yet.
                  </dd>
                </div>
              </dl>
            </div>

            {primer ? (
              <p className="text-steel mt-10 leading-relaxed">
                A longer explanation:{" "}
                <Link href={`/insights/${primer.slug}`} className="link tap-44">
                  {primer.title}
                </Link>
              </p>
            ) : null}
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          WHO THIS IS FOR
          --------------------------------------------------------------- */}
      <section className="bg-white">
        <Container>
          <Band>
            <SectionHeading
              eyebrow="Who this is for"
              title="What Craftline looks for in an operator."
              lead="These are traits rather than qualifications. There is deliberately no experience requirement and no background requirement stated anywhere on this site, because a stated threshold is a claim about who will be accepted and no such claim can be made before disclosure."
            />

            <ul className="mt-12 grid gap-5 sm:grid-cols-3">
              {OPERATOR_PROFILE.map((trait) => (
                <Card as="li" key={trait}>
                  <p className="text-graphite leading-relaxed">{trait}</p>
                </Card>
              ))}
            </ul>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          THE COMPANY
          --------------------------------------------------------------- */}
      <section className="bg-mist">
        <Container>
          <Band>
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <SectionHeading
                  eyebrow="The company"
                  title="Who Craftline Brands is."
                  lead={COMPANY.descriptor}
                />
                <p className="text-steel mt-6 leading-relaxed">
                  {FOUNDING_STATEMENT} The brand operating under it is veteran
                  owned as well, which makes this a veteran franchise company by
                  origin rather than by positioning. Veterans considering
                  ownership are encouraged to make contact.
                </p>
                <div className="mt-8">
                  <Cta href="/about" variant="secondary">
                    How the company is structured
                  </Cta>
                </div>
              </div>

              <div className="border-line rounded-lg border bg-white p-7">
                <h3 className="h3">Corporate structure</h3>
                <dl className="mt-5 space-y-5">
                  {LEGAL_ENTITIES.map((entity) => (
                    <div key={entity.name}>
                      <dt className="text-graphite font-semibold">
                        {entity.name}
                      </dt>
                      <dd className="text-steel mt-1 leading-relaxed">
                        {entity.role} Registered in {entity.jurisdiction}.
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Band>
        </Container>
      </section>

      {/* ---------------------------------------------------------------
          CONTACT
          --------------------------------------------------------------- */}
      <section className="bg-white">
        <Container>
          <Band>
            <div className="border-line rounded-lg border p-8 sm:p-12">
              <div className="max-w-2xl">
                <h2 className="h2">Start a conversation.</h2>
                <p className="lead mt-4">
                  This is an inquiry, not an application. It asks for nothing
                  sensitive, commits you to nothing, and is read by a person.
                  Craftline runs an electrician franchise brand today and is
                  building the programme around it.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Cta href="/contact">Get in touch</Cta>
                  <Cta href="/franchising" variant="secondary">
                    Franchise information
                  </Cta>
                </div>
              </div>
            </div>
          </Band>
        </Container>
      </section>
    </>
  );
}
