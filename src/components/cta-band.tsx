import { Cta, CtaRow } from "@/components/cta";
import { Container } from "@/components/container";

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
 * A FULL BLEED SIGNAL RED FIELD WITH REVERSED TYPE, which is the import's
 * treatment and which an earlier version of this file declined on a bad
 * argument. I called it "a dark ground wearing the brand's colour" needing the
 * same re-pinning mechanism the dark grounds would have needed. That conflated
 * two different problems. A dark PAGE ground has to carry many tokens: body
 * copy, secondary copy, links, rules, section markers. This band carries two:
 *
 *   white            5.93 on #CB0000, for the heading and both controls
 *   --color-onred    4.90 on #CB0000, for the one supporting paragraph
 *
 * A surface with a two value palette does not need a mechanism, it needs a
 * rule, and the rule is that nothing else goes on it. Graphite measures 2.99
 * there and datum blue 1.07, so there is no third thing to be tempted by.
 *
 * It is the loudest object on the site and there is exactly one per page, at
 * the end, which is what keeps it meaning "this is where you act".
 */
export function CtaBand({
  title,
  lead,
  primaryHref = "/franchising#inquiry",
  primaryLabel = "Franchise inquiry",
  secondaryHref = "/franchising",
  secondaryLabel = "How franchising works",
}: {
  title: string;
  lead: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="bg-signal-solid">
      <Container>
        <div className="band">
          {/*
            The import sets this row align-items:center with the copy block
            capped at 560px and the controls opposite it, so the heading and the
            buttons sit on one line rather than the buttons dropping to the
            bottom of a tall left column.
          */}
          <div className="flex flex-wrap items-center justify-between gap-x-16 gap-y-9">
            <div className="max-w-[35rem]">
              <h2 className="d2 text-white">{title}</h2>
              <p className="text-onred mt-6 leading-relaxed">
                {lead}
              </p>
            </div>
            <CtaRow>
              <Cta href={primaryHref} variant="mark">
                {primaryLabel}
              </Cta>
              <Cta href={secondaryHref} variant="markOutline">
                {secondaryLabel}
              </Cta>
            </CtaRow>
          </div>
        </div>
      </Container>
    </section>
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
      <h3 className="d3-sentence">{title}</h3>
      <p className="text-steel mt-3 max-w-[62ch] leading-relaxed">{lead}</p>
      <div className="mt-6">
        <Cta href={href}>{label}</Cta>
      </div>
    </div>
  );
}
