/**
 * THE SPLIT BAR, AND THE EYEBROW IT BELONGS TO
 * ============================================
 *
 * The one mark this system repeats everywhere. A short two tone block, brand
 * red beside brand blue, set immediately before every section eyebrow and
 * again as a full width hairline at the top of the header and the foot of the
 * footer.
 *
 * IT IS THE IMPORT'S BEST IDEA AND IT IS FREE. It is drawn from the logo,
 * which is red CRAFT beside blue LINE, so it is the mark reduced to its
 * smallest possible statement. It carries no text, so it is exempt from
 * contrast minimums and can use the delivered brand values at full strength. It
 * costs two divs. And because it appears at the top of every region, a reader
 * scrolling learns within one page that this is where a new subject starts.
 *
 * THE BAR AND THE EYEBROW ARE ONE COMPONENT ON PURPOSE. An eyebrow without the
 * bar is a loose end: the previous system had a bare blue label and it read as
 * a small heading rather than as a marker. If you want an eyebrow, you get the
 * bar. If a slot genuinely cannot take the bar, it wants a `label-sm` instead,
 * which is a different thing and looks like one.
 */

/**
 * The mark on its own. Decorative and hidden from assistive technology: it
 * carries no information a screen reader could act on, and the eyebrow text
 * beside it says what the section is.
 */
export function SplitBar({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`grid h-1.5 w-13 shrink-0 grid-cols-2 ${className}`}
    >
      <span className="bg-signal" />
      <span className="bg-datum" />
    </span>
  );
}

/**
 * A full width version, used as the top edge of the header and the closing
 * edge of the footer. Same mark, stretched, so the page opens and closes on it.
 */
export function SplitRule({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`grid h-1.5 grid-cols-2 ${className}`}>
      <span className="bg-signal" />
      <span className="bg-datum" />
    </div>
  );
}

/**
 * Section eyebrow: the mark, then the label.
 *
 * Rendered as a <p> rather than a heading. It is a category marker sitting
 * above a real heading, and promoting it to an h3 would put a level in the
 * document outline that says nothing and breaks heading order on every page.
 */
export function Eyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`flex items-center gap-3 ${className}`}>
      <SplitBar />
      <span className="eyebrow">{children}</span>
    </p>
  );
}
