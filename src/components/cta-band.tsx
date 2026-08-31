import { Cta, CtaRow } from "@/components/cta";
import { Section } from "@/components/system/section";

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
 *
 * THE IMPORT SETS THIS AS A FULL BLEED RED FIELD AND THAT WAS DECLINED. It is
 * the same objection as the dark grounds: on #CB0000 only white clears AA,
 * while graphite, steel and datum all fail, so a red band is a dark ground in
 * the brand's colour and would need the identical re-pinning mechanism. What
 * carries the emphasis instead is the heavy graphite edge above it, the display
 * face at section size, and the fact that this is the only band on the page
 * with nothing in it but a statement and two controls.
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
    <Section ground={ground} density="normal" edge>
      <div className="max-w-3xl">
        <h2 className="d2">{title}</h2>
        <p className="lead mt-6">{lead}</p>
        <CtaRow className="mt-9">
          <Cta href={primaryHref}>{primaryLabel}</Cta>
          <Cta href={secondaryHref} variant="secondary">
            {secondaryLabel}
          </Cta>
        </CtaRow>
      </div>
    </Section>
  );
}

/**
 * The mid page variant: a ruled prompt that sits inside a section rather than
 * forming one.
 *
 * Used at natural decision points on long pages, which means after a passage
 * that answers a question rather than at a fixed interval. A prompt placed by
 * word count instead of by argument is the thing that makes a page feel like it
 * is selling to you.
 *
 * Bounded top and bottom by a graphite rule rather than boxed. A box around a
 * prompt inside a reading column reads as an advertisement dropped into the
 * article; two rules read as the page pausing, which is what this is.
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
      className={`border-graphite border-y-2 py-7 ${className}`}
    >
      <h3 className="d3">{title}</h3>
      <p className="text-steel mt-3 max-w-[62ch] leading-relaxed">{lead}</p>
      <div className="mt-6">
        <Cta href={href}>{label}</Cta>
      </div>
    </div>
  );
}
