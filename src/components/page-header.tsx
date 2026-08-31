import { Container } from "@/components/container";
import { Cta, CtaRow } from "@/components/cta";
import { Eyebrow } from "@/components/system/rule";

/**
 * The band every interior page opens with.
 *
 * Consistency here is doing more work than it looks like. What makes these
 * pages feel like one site is that they all start the same way: the split bar
 * and a category, a title at the largest size on the page, one paragraph, and a
 * way to act. Pages that each invented their own opening would read as a
 * collection of documents rather than one site.
 *
 * WHAT PHASE 2A CHANGED. The title is now the display face at up to 5.5rem
 * instead of a grotesque capped at 3rem, and the header closes on a heavy
 * graphite rule rather than a hairline. The diagnosis found no page had an
 * element that owned it; this is that element, on every route except the two
 * legal documents.
 *
 * The opening is deliberately the ONE stamp that survives unchanged across the
 * site. The finding was that 33 of 42 sections repeated it, not that any
 * repetition is wrong: a page header should be recognisable. The fix was
 * giving the sections beneath it four different shapes to choose from, which is
 * what SectionHead now offers.
 *
 * THE ACTION IS NOT DECORATION, IT CLOSES A MEASURED GAP. The CTA audit found
 * every interior page opening with four to six viewports of reading before the
 * first conversion path, every one of those gaps starting at the very top. A
 * reader who arrives convinced had to scroll the whole page to act. One control
 * in the header fixes that on every route at once, and it is where a corporate
 * site puts it anyway.
 *
 * It is optional because the legal pages do not take one. A conversion prompt
 * at the head of a privacy policy is in poor taste in front of exactly the
 * reader most likely to be checking.
 */
export function PageHeader({
  label,
  title,
  lead,
  ctaHref,
  ctaLabel,
  secondaryHref,
  secondaryLabel,
  secondaryExternal = false,
  titleStyle = "d1",
  meta,
  children,
}: {
  /** Category above the page title. Rendered with the split bar. */
  label: string;
  title: string;
  lead?: string;
  ctaHref?: string;
  ctaLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  /** The brand page's secondary action points at the brand's own site. */
  secondaryExternal?: boolean;
  /**
   * `d1-prose` for the eighteen article pages: sentence case, and smaller.
   * See the note on .d1-prose in globals.css. An article title is a sentence a
   * reader reads rather than a marker they scan for, and it opens the longest
   * continuous reading on the site.
   */
  titleStyle?: "d1" | "d1-prose";
  /** Publication date or similar, set directly under the title. */
  meta?: React.ReactNode;
  /** A fact strip or similar, set against the bottom edge of the header. */
  children?: React.ReactNode;
}) {
  return (
    <section className="border-graphite border-b-2 bg-white">
      <Container>
        <div className="band-loose">
          <Eyebrow>{label}</Eyebrow>
          <h1 className={`${titleStyle} mt-6 max-w-[22ch]`}>{title}</h1>
          {meta ? <div className="mt-6">{meta}</div> : null}
          {lead ? <p className="lead mt-7 max-w-2xl">{lead}</p> : null}
          {ctaHref && ctaLabel ? (
            <CtaRow className="mt-10">
              <Cta href={ctaHref}>{ctaLabel}</Cta>
              {secondaryHref && secondaryLabel ? (
                <Cta
                  href={secondaryHref}
                  variant="secondary"
                  external={secondaryExternal}
                >
                  {secondaryLabel}
                </Cta>
              ) : null}
            </CtaRow>
          ) : null}
          {children ? <div className="mt-14">{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}
