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
 * THE SAME RULED ROW, BUT THE TERM IS A REAL HEADING.
 *
 * Identical presentation to RuledRow: same grid, same rules, same weights. The
 * difference is semantic and it is not optional for the content that uses it.
 *
 * WHY THIS EXISTS. The FDD explainer moved from five <h3> cards into <dt> when
 * this section became ruled rows. The strings all still rendered, so nothing
 * looked wrong, but five pieces of the most franchise-facing explainer content
 * on the property had left the heading outline. That is exactly the content a
 * generative engine lifts by heading, so it works directly against the
 * extractability work Phase 3 is for.
 *
 * A <dt> CANNOT SIMPLY CONTAIN AN <h3>. The content model for <dt> is flow
 * content with no heading content descendants, so keeping the <dl> and nesting
 * a heading inside it is invalid rather than merely unusual. The container has
 * to change, and it does: a plain sectioned list of <h3> and <p>, styled to be
 * indistinguishable from the definition list beside it.
 *
 * USE THE DEFINITION LIST WHERE THE CONTENT REALLY IS DEFINITIONS. The
 * glossary, the vocabulary and the corporate entities are term and definition
 * pairs and stay <dl>. This is for explainer prose whose headings a reader, or
 * a machine, should be able to find.
 */
export function RuledHeadingRows({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`border-graphite border-t-2 ${className}`}>{children}</div>
  );
}

export function RuledHeadingRow({
  heading,
  children,
}: {
  heading: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="border-line grid gap-x-10 gap-y-3 border-b py-6 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
      <h3 className="d3">{heading}</h3>
      <p className="text-steel max-w-[68ch] leading-relaxed">{children}</p>
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
  /*
    The import distributes these with repeat(auto-fit, minmax(210px, 1fr)),
    which is why removing two of its four cells redistributes the remaining two
    across the full measure instead of leaving them crowded at the left. Fixed
    column counts cannot do that. `cols` now only sets the floor.
  */
  const columns =
    cols === "two"
      ? "grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))]"
      : "grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))]";
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
          className="border-line grid gap-x-8 gap-y-3 border-b py-7 sm:grid-cols-[7rem_minmax(0,1fr)]"
        >
          {/*
            "Step 1" AS RENDERED TEXT, NOT A DECORATIVE NUMERAL.

            This marker was a large aria-hidden "01" through "04". The Rule One
            verification caught what that cost: the strings "Step 1" through
            "Step 4" left the page entirely, and because the numeral was hidden
            they left the accessibility tree with them. A bare "01" does not say
            that this is an ordered process, and a reader who cannot see it was
            told nothing at all.

            One element, one text node, no nested spans, and the label is built
            with a template literal rather than as Step {index + 1}. React emits
            adjacent JSX expressions as separate text nodes with a comment
            marker between them, so the first attempt put "Step 1" in the DOM
            and left it absent from the served bytes. A verification that greps
            the built HTML has to be able to find it there too.
          */}
          <p className="text-signal font-display text-2xl leading-none font-extrabold tracking-[0.06em] uppercase tabular-nums">
            {`Step ${index + 1}`}
          </p>
          <div>
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
