import { Container } from "@/components/container";

/** Small caps label. Sets the rhythm above every section and page heading. */
export function Eyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`tracked-caps text-[0.65rem] text-bronze ${className}`}>
      {children}
    </p>
  );
}

/**
 * The charcoal band every interior page opens with.
 *
 * Consistency here is doing more work than it looks like. With no photography
 * and no emblem, the thing that makes these pages feel like one site is that
 * they all start the same way: eyebrow, heading, one paragraph, on ink. Pages
 * that each invented their own opening would read as a collection of documents.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="bg-ink text-paper">
      <Container>
        <div className="py-16 sm:py-20 lg:py-24">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="display-xl mt-6 max-w-3xl text-paper">{title}</h1>
          {lead ? (
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-dark">
              {lead}
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
