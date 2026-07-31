import { Container } from "@/components/container";
import { Rule } from "@/components/section";

/**
 * The band every interior page opens with.
 *
 * Consistency here is doing more work than it looks like. What makes these
 * pages feel like one site is that they all start the same way: label, rule,
 * heading, one paragraph. Pages that each invented their own opening would read
 * as a collection of documents rather than one drawing set.
 *
 * Graphite ground, which is one of the few places dark appears. The site is
 * light dominant; this band, the header, the footer, and the title block are
 * the punctuation.
 */
export function PageHeader({
  label,
  title,
  lead,
}: {
  /** Mono caps label. The drawing's own name for this sheet. */
  label: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="bg-graphite text-zinc">
      <Container>
        <div className="py-20 sm:py-24 lg:py-28">
          <div className="max-w-[22rem]">
            <Rule />
            <p className="label text-copper mt-4">{label}</p>
          </div>
          <h1 className="display-1 mt-8 max-w-4xl text-balance">{title}</h1>
          {lead ? (
            <p className="body-lg text-steel mt-8 max-w-2xl">{lead}</p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
