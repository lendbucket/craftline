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
export function SplitBar({
  onMark = false,
  className = "",
}: {
  /** Inside the red band the two halves would vanish, so it reverses to white. */
  onMark?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`grid h-1.5 w-13 shrink-0 grid-cols-2 ${className}`}
    >
      <span className={onMark ? "bg-white" : "bg-signal"} />
      <span className={onMark ? "bg-white/55" : "bg-datum"} />
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
  tone = "datum",
  className = "",
}: {
  children: React.ReactNode;
  /**
   * Which brand colour the label takes.
   *
   * The import alternates red and blue down a page, and the alternation is what
   * stops a long document reading as one undifferentiated run: a reader
   * scrolling the franchising page passes ten section markers and the colour
   * change tells them a new one has started even before they read it.
   *
   * Both clear AA for normal text on both grounds. Red measures 5.93 on white
   * and 5.48 on mist; blue 6.32 and 5.84.
   *
   * `mark` is for the closing red band, where the label sits on the fill and
   * takes white.
   */
  tone?: "datum" | "signal" | "mark";
  className?: string;
}) {
  const tones = {
    datum: "text-datum",
    signal: "text-signal",
    mark: "text-white",
  } as const;
  return (
    <p className={`flex items-center gap-3 ${className}`}>
      <SplitBar onMark={tone === "mark"} />
      <span className={`eyebrow ${tones[tone]}`}>{children}</span>
    </p>
  );
}

/**
 * Two outlined rectangles, offset from each other, one red and one blue.
 *
 * The import hangs these behind its hero and behind its corporate structure
 * panel. They are pure geometry: no text, no image, nothing asserted, and
 * nothing to license. On an ink ground it ran them at half opacity; on white
 * they take the delivered values at full strength as hairline outlines, because
 * a washed out rule on white reads as a printing fault rather than a device.
 *
 * Decorative and hidden from assistive technology. Hidden below the large
 * breakpoint too: at 390 there is no room to the side of the headline for them
 * to sit in, and overlapping them with the type would be noise.
 */
export function OffsetFrames({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 hidden overflow-hidden lg:block ${className}`}
    >
      <span className="border-signal absolute top-16 -right-24 h-72 w-[26rem] border-[3px]" />
      <span className="border-datum absolute top-32 right-8 h-72 w-[26rem] border-[3px]" />
    </div>
  );
}
