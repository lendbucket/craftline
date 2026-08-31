/**
 * RULED ROWS, FACT STRIPS, CHIPS AND STEPS
 * ========================================
 *
 * The four remaining pieces of the vocabulary. Each answers a content shape the
 * card was answering badly.
 */

/**
 * RULED ROWS. A term and its explanation, separated by a rule.
 *
 * This is the import's answer to a long list and it is a better answer than
 * nine stacked cards. The FAQ band on the franchising page measured 4415 pixels
 * at 390 as identical boxes with no ordering signal and no way to skip one; as
 * ruled rows the same content is scannable by term, because the terms line up
 * in a column a reader can run their eye down.
 *
 * Two columns at desktop, stacked below. The term column is fixed rather than
 * fractional so terms of very different lengths still align.
 *
 * Always a <dl>. Everything this renders is a term and its definition, and the
 * one place that shape was wrong, the FAQ, gets its own treatment on the
 * franchising page rather than a variant flag here.
 */
export function RuledRows({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <dl className={`border-graphite border-t-2 ${className}`}>{children}</dl>
  );
}

/**
 * THE TERM AND BODY ARE <dt> AND <dd>, NOT DIVS, AND THAT IS NOT COSMETIC.
 *
 * A <dl> may contain only <dt>, <dd>, and a <div> that wraps a group of them.
 * The first version of this component rendered a wrapping div holding two more
 * divs, which is invalid, and axe caught it as five serious `definition-list`
 * violations across the home, about and franchising pages on the first run
 * after the rebuild.
 *
 * It matters beyond validity. A definition list is how a screen reader knows
 * these are term and definition pairs and how many there are; rendered as
 * nested divs it is an unlabelled pile of text. The glossary and the FDD
 * explainer are exactly the content where that structure is the point.
 *
 * The single-div wrapper around each pair stays, because the grid needs one box
 * per row and grouping a dt with its dd inside a div is the one nesting the
 * spec allows.
 */
export function RuledRow({
  term,
  children,
  termClassName = "d3",
}: {
  term: React.ReactNode;
  children: React.ReactNode;
  termClassName?: string;
}) {
  return (
    <div className="border-line grid gap-x-10 gap-y-3 border-b py-6 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
      <dt className={termClassName}>{term}</dt>
      <dd className="text-steel max-w-[68ch] leading-relaxed">{children}</dd>
    </div>
  );
}

/**
 * A ruled row carrying only body text, with no heading of its own.
 *
 * Used for the due diligence list, which is five complete instructions rather
 * than five labelled things. Giving each one an invented label would be
 * decoration, and numbering them would claim an order the content does not
 * have.
 */
export function RuledItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="border-line text-graphite border-b py-6 max-w-[72ch] leading-relaxed">
      {children}
    </li>
  );
}

/**
 * FACT STRIP. Label above value, in a hairline grid.
 *
 * Every value in one of these must trace to a committed source in
 * src/config/company.ts. A fact strip is the most assertive container on the
 * site: a label and a short uppercase value reads as a published figure, and a
 * reader gives it the weight of one. That is exactly why the import's
 * "1 operating brand" hero statistic was declined. If a value cannot be pointed
 * at in config, it does not go in a strip.
 */
export function FactStrip({
  facts,
  className = "",
  cols = "four",
  bordered = true,
}: {
  facts: readonly { label: string; value: string }[];
  className?: string;
  cols?: "two" | "four";
  /**
   * Off when the strip is already bounded by the band it sits in.
   *
   * The hero strip sits directly under the section's own closing rule, and a
   * bordered grid there draws a second rule a few pixels below the first, which
   * reads as a printing fault rather than as structure. Unbordered, the cells
   * keep their single hairline divider and the band's rule does the bounding.
   */
  bordered?: boolean;
}) {
  const columns =
    cols === "two" ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4";
  const frame = bordered
    ? "hairline-grid"
    : "grid gap-px bg-line [&>*]:bg-white";
  return (
    <dl className={`${frame} ${columns} ${className}`}>
      {facts.map((fact) => (
        <div key={fact.label} className="px-6 py-6 sm:px-7 sm:py-7">
          <dt className="label-sm">{fact.label}</dt>
          <dd className="d4 mt-2">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * CHIP. A short attested attribute.
 *
 * Square, ruled, display face, uppercase. Used only for facts the operating
 * brand can evidence on demand, which in practice means the strings in
 * BRANDS[].attributes and nothing else. It is not a tag system and there is no
 * taxonomy behind it.
 */
export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="border-graphite text-graphite inline-flex items-center border-2 px-3.5 py-1.5 font-display text-sm font-bold tracking-[0.1em] uppercase">
      {children}
    </span>
  );
}

/**
 * STEPS. A numbered sequence.
 *
 * NUMERALS ARE RESERVED FOR CONTENT THAT IS ACTUALLY A SEQUENCE, and on this
 * site that is one list: INQUIRY_PROCESS, where step three cannot happen before
 * step two.
 *
 * The import numbers the four capabilities 01 to 04 and the three operator
 * traits 01 to 03. Neither is ordered. Brand systems does not precede operating
 * playbooks, and an operator who wants a system to follow is not the second
 * thing about them. Numbering an unordered list tells a reader something untrue
 * about it, which is the same failure as any other unsupported claim, so those
 * two render as an ordinary hairline grid instead.
 *
 * The numeral is signal red, which is the one non-button use of red in the
 * system. It is permitted here because the sequence is the path to the inquiry
 * and red is this site's action colour: the numerals are literally counting the
 * steps toward the only action the page offers.
 */
export function Steps({
  steps,
  className = "",
}: {
  steps: readonly { title: string; body: string }[];
  className?: string;
}) {
  return (
    <ol className={`border-graphite border-t-2 ${className}`}>
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="border-line grid gap-x-8 gap-y-3 border-b py-7 sm:grid-cols-[4rem_minmax(0,1fr)]"
        >
          <span
            aria-hidden="true"
            className="text-signal font-display text-4xl leading-none font-extrabold tabular-nums"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            {/*
              The visible numeral is decorative because the ordered list already
              conveys position to assistive technology. Announcing "zero one"
              before every title would be noise on top of the list semantics.
            */}
            <h3 className="d3">{step.title}</h3>
            <p className="text-steel mt-3 max-w-[68ch] leading-relaxed">
              {step.body}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
