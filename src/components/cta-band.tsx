import { Container } from "@/components/container";
import { Cta } from "@/components/cta";
import { Band } from "@/components/section";

/**
 * The end of page conversion block, and the inline mid page variant.
 *
 * Every long page ends with one of these, so a reader who has finished has
 * somewhere to go that is not the browser back button. It is the same object
 * everywhere on purpose: a reader learns its shape once, and a site that
 * invents a different closing block per page reads as assembled rather than
 * built.
 *
 * HONEST BY CONSTRUCTION. It states what the next step is and what it is not.
 * There is no countdown, no scarcity, no "spaces filling", no social proof, and
 * no number of any kind. The FDD is not issued, so the only truthful next step
 * this site can offer is a conversation, and the copy says exactly that.
 *
 * The secondary action is deliberately an education destination rather than a
 * second conversion path. Somebody who is not ready to make contact should be
 * given something to read, not asked twice.
 */
export function CtaBand({
  title,
  lead,
  primaryHref = "/franchising#inquiry",
  primaryLabel = "Franchise inquiry",
  secondaryHref = "/franchising",
  secondaryLabel = "How franchising works",
  ground = "mist",
}: {
  title: string;
  lead: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  /** Pick the one that alternates against the section above it. */
  ground?: "white" | "mist";
}) {
  return (
    <section className={ground === "mist" ? "bg-mist" : "bg-white"}>
      <Container>
        <Band>
          <div className="max-w-2xl">
            <h2 className="h2">{title}</h2>
            <p className="lead mt-4">{lead}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Cta href={primaryHref}>{primaryLabel}</Cta>
              <Cta href={secondaryHref} variant="secondary">
                {secondaryLabel}
              </Cta>
            </div>
          </div>
        </Band>
      </Container>
    </section>
  );
}

/**
 * The mid page variant: a bordered prompt that sits inside a section rather
 * than forming one.
 *
 * Used at natural decision points on long pages, which means after a passage
 * that answers a question rather than at a fixed interval. A prompt placed by
 * word count instead of by argument is the thing that makes a page feel like it
 * is selling to you.
 */
export function CtaPrompt({
  title,
  lead,
  href = "/franchising#inquiry",
  label = "Franchise inquiry",
  className = "",
}: {
  title: string;
  lead: string;
  href?: string;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`border-line rounded-lg border bg-white p-6 sm:p-7 ${className}`}
    >
      <h3 className="h3">{title}</h3>
      <p className="text-steel mt-3 leading-relaxed">{lead}</p>
      <div className="mt-5">
        <Cta href={href}>{label}</Cta>
      </div>
    </div>
  );
}
