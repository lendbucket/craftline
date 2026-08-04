import { Container } from "@/components/container";

/**
 * The band every interior page opens with.
 *
 * Consistency here is doing more work than it looks like. What makes these
 * pages feel like one site is that they all start the same way: eyebrow,
 * heading, one paragraph. Pages that each invented their own opening would read
 * as a collection of documents rather than one site.
 *
 * White ground. The retired version was a dark graphite band with a mono label
 * over a plotted rule, which was the single most recognisable device on the
 * property and the reason every interior page announced itself as designed.
 */
export function PageHeader({
  label,
  title,
  lead,
}: {
  /** Small blue eyebrow above the page title. */
  label: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="border-line border-b bg-white">
      <Container>
        <div className="py-14 sm:py-16 lg:py-20">
          <p className="eyebrow">{label}</p>
          <h1 className="h1 mt-3 max-w-3xl">{title}</h1>
          {lead ? <p className="lead mt-5 max-w-2xl">{lead}</p> : null}
        </div>
      </Container>
    </section>
  );
}
