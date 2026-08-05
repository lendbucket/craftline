import { Container } from "@/components/container";
import { Cta } from "@/components/cta";

/**
 * The band every interior page opens with.
 *
 * Consistency here is doing more work than it looks like. What makes these
 * pages feel like one site is that they all start the same way: eyebrow,
 * heading, one paragraph, and a way to act. Pages that each invented their own
 * opening would read as a collection of documents rather than one site.
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
}: {
  /** Small blue eyebrow above the page title. */
  label: string;
  title: string;
  lead?: string;
  ctaHref?: string;
  ctaLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="border-line border-b bg-white">
      <Container>
        <div className="py-14 sm:py-16 lg:py-20">
          <p className="eyebrow">{label}</p>
          <h1 className="h1 mt-3 max-w-3xl">{title}</h1>
          {lead ? <p className="lead mt-5 max-w-2xl">{lead}</p> : null}
          {ctaHref && ctaLabel ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Cta href={ctaHref}>{ctaLabel}</Cta>
              {secondaryHref && secondaryLabel ? (
                <Cta href={secondaryHref} variant="secondary">
                  {secondaryLabel}
                </Cta>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
