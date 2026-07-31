import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { Cta } from "@/components/cta";
import { Eyebrow, PageHeader } from "@/components/page-header";
import {
  BRANDS,
  CAPABILITIES,
  COMPANY,
  FOUNDING_STATEMENT,
  LEGAL_ENTITIES,
} from "@/config/company";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Craftline Brands is a holding company for skilled trade service brands and the skilled trades franchise system behind them. It owns the marks, the operating playbooks, the technology, and the territory plan that its brands run on.",
  path: "/about",
});

/**
 * About page.
 *
 * The holding company model in plain language, plus the corporate structure.
 *
 * The four capabilities are rendered from CAPABILITIES, the same array the home
 * page reads. That is intentional duplication rather than an oversight: the
 * alternative is a paraphrase on one of the two pages, and a paraphrase of a
 * fact drifts from the fact. Single source wins over a marginal concern about
 * repeated text across two pages of an eight page site.
 *
 * Everything on this page traces to src/config/company.ts. The founder's name
 * does not appear, and FOUNDING_STATEMENT is the only permitted reference.
 */
export default function AboutPage() {
  const [wattsmith] = BRANDS;

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A holding company for skilled trade service brands."
        lead={`${COMPANY.name} owns the marks, the operating playbooks, the technology, and the territory plan. The operator runs the business.`}
      />

      {/* THE MODEL */}
      <section className="bg-paper">
        <Container>
          <div className="py-20 sm:py-24">
            <Eyebrow>The model</Eyebrow>
            <h2 className="display-lg mt-5 max-w-2xl">
              Four things live at the brand level.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
              A trade business is not hard to start and it is hard to run well
              twice. What separates one good shop from a brand that works in
              several markets is whether the standard survives being handed to
              someone else. These are the four pieces Craftline holds so that it
              can, and together they are the skilled trades franchise system its
              brands run on.
            </p>

            {/*
              A description list, not cards. On the home page these four are a
              scan; here they are the substance of the page, and a dl is what a
              term with a definition actually is.

              dt and dd are direct children of the wrapping div, which is itself
              a direct child of the dl. That single div is the only wrapper the
              spec allows inside a description list, so the numeral and the term
              are laid out as sibling grid cells rather than the term being
              boxed together with its definition.
            */}
            <dl className="mt-14 space-y-10">
              {CAPABILITIES.map((capability, index) => (
                <div
                  key={capability.title}
                  className="border-t border-ink/10 pt-8 sm:grid sm:grid-cols-[3rem_1fr] sm:gap-x-8"
                >
                  <span
                    aria-hidden="true"
                    className="tracked-caps hidden text-[0.7rem] text-bronze sm:block sm:row-span-2"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <dt className="display-md">{capability.title}</dt>
                  <dd className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
                    {capability.body}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* STRUCTURE */}
      <section className="bg-paper-dark">
        <Container>
          <div className="py-20 sm:py-24">
            <Eyebrow>Corporate structure</Eyebrow>
            <h2 className="display-lg mt-5 max-w-2xl">
              Two entities, each with one job.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
              Anyone considering running one of these brands is entitled to know
              which entity holds what, so it is stated here rather than left to
              be discovered in a document later.
            </p>

            <dl className="mt-12 grid gap-6 sm:grid-cols-2">
              {LEGAL_ENTITIES.map((entity) => (
                <div
                  key={entity.name}
                  className="rounded-lg border border-ink/10 bg-white p-7"
                >
                  <dt className="text-lg font-semibold">{entity.name}</dt>
                  <dd className="mt-3 text-[0.95rem] leading-relaxed text-muted">
                    A {entity.jurisdiction} limited liability company.{" "}
                    {entity.role}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* FOUNDING */}
      <section className="bg-ink text-paper">
        <Container>
          <div className="py-20 sm:py-24">
            <Eyebrow>Founding</Eyebrow>
            {/*
              FOUNDING_STATEMENT is the only permitted reference to the founder
              and it carries no name. Do not add one here, in an image alt, or
              in schema.
            */}
            <p className="display-lg mt-6 max-w-3xl text-paper">
              {FOUNDING_STATEMENT}
            </p>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-dark">
              Veterans considering ownership are encouraged to make contact.
            </p>
          </div>
        </Container>
      </section>

      {/* BRAND */}
      <section className="bg-paper">
        <Container>
          <div className="py-20 sm:py-24">
            <Eyebrow>The brand today</Eyebrow>
            <h2 className="display-lg mt-5 max-w-2xl">
              One operating brand, built first.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
              {wattsmith.summary} It is the brand the systems above were built
              on and tested against.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Cta href={`/brands/${wattsmith.slug}`}>About {wattsmith.name}</Cta>
              <Link
                href="/franchising"
                className="tap-44 inline-flex min-h-11 items-center text-sm font-semibold text-bronze hover:underline"
              >
                Franchise information
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
