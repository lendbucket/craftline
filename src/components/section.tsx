/**
 * SECTION FURNITURE
 * =================
 *
 * The small set of devices every section is built from. Kept together so the
 * rhythm of the site is defined in one file rather than reassembled by hand on
 * each page, which is how a site drifts into looking like a collection of
 * documents.
 */

/**
 * The datum rule.
 *
 * The structural mark of the system, and the thing that carries the site's one
 * motion idea: on scroll into view it draws from zero to full width, which is a
 * line being plotted on a drawing. See globals.css. The animation is scroll
 * driven CSS with no JavaScript, so a browser without support simply shows the
 * finished rule rather than hiding content behind a script.
 *
 * Painted in datum-true, the exact brand blue, because this is a decorative
 * hairline and not text. It clears the 3:1 non-text floor on every ground.
 */
export function Rule({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`bg-datum-true rule-draw block h-px w-full ${className}`}
    />
  );
}

/**
 * A section's label: mono caps over a datum rule.
 *
 * This replaces the old eyebrow. The difference is not cosmetic. An eyebrow is
 * a small line of text above a heading; this is the label on a drawing,
 * carrying the same weight and the same tracking as the fields in the title
 * block, so the label layer reads as one system across the whole site.
 */
export function SectionLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-[22rem] ${className}`}>
      <Rule />
      <p className="label text-datum mt-4">{children}</p>
    </div>
  );
}

/**
 * THE SECTION REGISTER.
 *
 * A numbered register in the left margin, the second and last literal drawing
 * device on this site.
 *
 * READ THIS BEFORE USING IT. It is only permitted where the content is a
 * genuinely defined set whose order carries meaning: the four parts of the
 * brand system, the steps of a process that actually happen in sequence. It is
 * NOT permitted on narrative sections, on a list of arguments, or anywhere the
 * numbers are there to make a page look organised. Decorative 01 / 02 / 03 is
 * the single most common tell of a generated layout, and the only thing that
 * makes it legitimate is that the content really is a schedule.
 *
 * If you are about to add this to a section and cannot say what breaks when
 * item three is read before item two, use SectionLabel instead.
 */
export function Register({
  index,
  label,
  children,
}: {
  /** One based. Rendered zero padded, the way a schedule numbers its rows. */
  index: number;
  /** Short name for this entry in the set. */
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-rule reveal grid gap-6 border-t pt-8 lg:grid-cols-[9rem_minmax(0,1fr)] lg:gap-12">
      <div className="lg:sticky lg:top-10 lg:self-start">
        <p className="label-sm text-datum">
          {String(index).padStart(2, "0")}
        </p>
        <p className="label-sm text-steel mt-2">{label}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

/**
 * Standard vertical rhythm for a band. Every section uses this rather than
 * setting its own padding, so the page has one spacing scale and sections
 * cannot drift apart from each other.
 */
export function Band({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`py-20 sm:py-24 lg:py-28 ${className}`}>{children}</div>;
}
