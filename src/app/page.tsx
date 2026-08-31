import Link from "next/link";
import { BrandRow } from "@/components/brand-row";
import { Container } from "@/components/container";
import { Cta, CtaRow } from "@/components/cta";
import { CtaBand } from "@/components/cta-band";
import { NumberedGrid, NumberedStatements } from "@/components/system/grid";
import { FactStrip, RuledRow, RuledRows } from "@/components/system/ruled-list";
import { Eyebrow, OffsetFrames } from "@/components/system/rule";
import { Section } from "@/components/system/section";
import { SectionHead } from "@/components/system/section-head";
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
 *
 * PHASE 2A. Every string on this page is the string that was here before, in
 * the same order, with two additions the owner directed: the hero eyebrow,
 * which is the metadata title suffix rendered in the body, and the label
 * "Veteran founded" in the fact strip. Both are named in the report.
 *
 * THE COLOUR AND THE DEVICES ARE THE POINT OF THIS PAGE. Tricolour headline,
 * offset frames, a two item fact strip, numbered blocks with the numeral
 * knocked out of the top rule, the filled brand block, alternating eyebrow
 * colour, and a full red closing band. An earlier version of this build took
 * the import's structure and left all of that behind, which produced a page
 * with the right bones and none of the system.
 */
export default function HomePage() {
  const [wattsmith] = BRANDS;
  const primer = getInsight("how-a-franchise-brand-system-works");

  return (
    <>
      {/* ---------------------------------------------------------------
          HERO
          The only loose band on the page, and the largest type on the site.
          --------------------------------------------------------------- */}
      <section className="border-graphite relative border-b-2 bg-white">
        <OffsetFrames />
        <Container className="relative">
          {/*
            The import gives the hero 104px above and nothing below, then closes
            it on the fact strip, with 80px between the controls and the strip.
            band-loose would put 144px there and leave the strip floating.
          */}
          <div className="pt-20 pb-20 sm:pt-28 lg:pt-36">
            <Eyebrow tone="datum">
              Skilled trade brand and franchise development
            </Eyebrow>
            {/*
              THE TRICOLOUR HEADLINE. Graphite, then blue, then red, which is
              the import's treatment restored on white. Measured on this ground:
              graphite 17.71, datum blue 6.32, signal red 5.93, all AA for
              normal text and all far clear of the 3:1 large text minimum this
              actually needs at 88px.

              The colour is not decoration. It splits the sentence at its two
              real joints: what the company is, what it builds, and what it
              builds them into.
            */}
            <h1 className="d1 mt-7 max-w-[67.5rem]">
              A franchise development company building{" "}
              <span className="text-datum">skilled trade</span>{" "}
              <span className="text-signal">service brands.</span>
            </h1>
            <p className="lead mt-8 max-w-2xl">
              {COMPANY.name} owns the marks, the operating playbooks, the
              technology, and the expansion plan behind the brands it builds. An
              operator joins a business that already works instead of assembling
              one.
            </p>
            <CtaRow className="mt-10">
              <Cta href="/franchising">Explore franchising</Cta>
              <Cta href="/about" variant="secondary">
                About the company
              </Cta>
            </CtaRow>
          </div>
        </Container>

        {/*
          THE FACT STRIP, REBUILT WITH THE TWO ITEMS THAT STAND.

          The import ships four. Two were declined in Phase 1 and stay declined:
          "1 operating brand", because a unit count in a figure strip under a
          franchisor's hero is read as a system statistic, and "flagship
          market", because it asserts a sequenced expansion plan as present
          fact. Neither is in company.ts.

          The two here do trace. Wyoming is LEGAL_ENTITIES[].jurisdiction, and
          the veteran line is FOUNDING_STATEMENT reduced to a label and its
          qualifier. "Veteran founded" is a label written for this strip rather
          than a string lifted from config, and it is the one composed value on
          the page.
        */}
        <div className="border-graphite border-t-2">
          <Container>
            <FactStrip
              cols="two"
              bordered={false}
              facts={[
                { label: "State of registration", value: "Wyoming" },
                {
                  label: "Service disabled veteran",
                  value: "Veteran founded",
                },
              ]}
            />
          </Container>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          WHAT CRAFTLINE BUILDS
          Asymmetric head: the lead becomes a note beside the title rather
          than a paragraph under it, which is the first of the four head
          shapes and the reason this section does not open like the next one.
          --------------------------------------------------------------- */}
      <Section ground="mist">
        <SectionHead
          eyebrow="What we build"
          title="Four things a brand needs before anyone runs it."
          aside="A franchise system is only worth as much as what it hands an operator on the first day. These are the four parts Craftline builds and maintains at the brand level."
        />

        {/*
          Numbered blocks, alternating red and blue, each numeral knocked out of
          its top rule. They enumerate rather than sequence: the markup stays an
          unordered list and the numerals are aria-hidden, so nothing tells a
          screen reader that brand systems precedes operating playbooks.
        */}
        <NumberedGrid items={CAPABILITIES} ground="mist" className="mt-16" />
      </Section>

      {/* ---------------------------------------------------------------
          OUR BRANDS
          --------------------------------------------------------------- */}
      <Section ground="white">
        <SectionHead
          eyebrow="Our brands"
          tone="signal"
          title="The brands Craftline operates."
          lead="One brand today, built and run before any part of it was offered to anyone else. That order is deliberate. A playbook is worth handing over only after it has been tested in a real business."
        />

        <div className="mt-14">
          <BrandRow />
        </div>

        <p className="text-steel mt-10 max-w-[68ch] leading-relaxed">
          {wattsmith.summary} It is the business the systems above were built on
          and tested against, which is why this site describes a skilled trades
          franchise programme rather than a plan for one.
        </p>
      </Section>

      {/* ---------------------------------------------------------------
          FRANCHISING EXPLAINED
          --------------------------------------------------------------- */}
      <Section ground="mist" edge>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <div>
            <SectionHead
              eyebrow="Franchising, explained"
              tone="datum"
              title="Start here if franchising is new to you."
              lead="Most people evaluating a home services franchise for the first time are asked to make a serious decision using vocabulary nobody explained to them. This section exists to fix that before any conversation starts."
            />
            <CtaRow className="mt-9">
              <Cta href="/franchising">How franchising works</Cta>
              <Cta href="/insights" variant="secondary">
                Read the guides
              </Cta>
            </CtaRow>
          </div>

          {/*
            Definitions only, and each describes the structure of franchising in
            general rather than Craftline's terms. Describing the framework is
            permitted before an FDD is issued. Describing this company's fees,
            royalties, or territory would be an offer term, so none of them
            appear here or anywhere.

            Ruled rows rather than a boxed definition list: the terms line up in
            a column a reader can run their eye down, which is the whole job of
            a glossary.
          */}
          <RuledRows>
            <RuledRow term="Franchisor">
              The company that owns the brand and the system and licenses the
              right to operate under it.
            </RuledRow>
            <RuledRow term="Franchisee">
              The independent owner who runs a business under that brand and
              holds to its standards.
            </RuledRow>
            <RuledRow term="Franchise Disclosure Document">
              The document a franchisor must deliver before it can offer a
              franchise. It sets out the obligations on both sides. Craftline has
              not issued one, so there is nothing to offer yet.
            </RuledRow>
          </RuledRows>
        </div>

        {primer ? (
          <p className="text-steel mt-12 leading-relaxed">
            A longer explanation:{" "}
            <Link href={`/insights/${primer.slug}`} className="link tap-44">
              {primer.title}
            </Link>
          </p>
        ) : null}
      </Section>

      {/* ---------------------------------------------------------------
          WHO THIS IS FOR
          A tight band. Three short statements do not need the height of a
          section that explains a four part model, and giving them the same
          height is what made every band on the old page weigh the same.
          --------------------------------------------------------------- */}
      <Section ground="white" density="tight">
        <SectionHead
          eyebrow="Who this is for"
          tone="signal"
          title="What Craftline looks for in an operator."
          aside="These are traits rather than qualifications. There is deliberately no experience requirement and no background requirement stated anywhere on this site, because a stated threshold is a claim about who will be accepted and no such claim can be made before disclosure."
        />

        <NumberedStatements
          items={OPERATOR_PROFILE}
          ground="white"
          className="mt-14"
        />
      </Section>

      {/* ---------------------------------------------------------------
          THE COMPANY
          --------------------------------------------------------------- */}
      <Section ground="mist" edge>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <SectionHead
              eyebrow="The company"
              tone="datum"
              title="Who Craftline Brands is."
              lead={COMPANY.descriptor}
            />
            <p className="text-steel mt-7 leading-relaxed">
              {FOUNDING_STATEMENT} The brand operating under it is veteran owned
              as well, which makes this a veteran franchise company by origin
              rather than by positioning. Veterans considering ownership are
              encouraged to make contact.
            </p>
            <CtaRow className="mt-9">
              <Cta href="/about" variant="secondary">
                How the company is structured
              </Cta>
            </CtaRow>
          </div>

          <div>
            <h3 className="label-sm">Corporate structure</h3>
            <RuledRows className="mt-4">
              {LEGAL_ENTITIES.map((entity, index) => (
                <RuledRow
                  key={entity.name}
                  term={entity.name}
                  termClassName={
                    "d3 " + (index % 2 === 0 ? "text-signal" : "text-datum")
                  }
                >
                  {entity.role} Registered in {entity.jurisdiction}.
                </RuledRow>
              ))}
            </RuledRows>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          CONTACT
          --------------------------------------------------------------- */}
      <CtaBand
        title="Start a conversation."
        lead="This is an inquiry, not an application. It asks for nothing sensitive, commits you to nothing, and is read by a person. Craftline runs an electrician franchise brand today and is building the programme around it."
        primaryHref="/contact"
        primaryLabel="Get in touch"
        secondaryHref="/franchising"
        secondaryLabel="Franchise information"
      />
    </>
  );
}
