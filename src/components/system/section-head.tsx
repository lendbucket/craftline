import { Eyebrow } from "@/components/system/rule";

/**
 * SECTION HEADINGS
 * ================
 *
 * Four shapes, and having four is the fix for the finding that 33 of 42
 * sections opened with the identical eyebrow, heading and grey paragraph in
 * that order at that spacing.
 *
 * The previous component offered one shape and a `center` flag nobody used, so
 * every section on the site opened the same way and a reader passed through the
 * same stamp ten times on the franchising page alone.
 *
 * PICK BY WHAT THE SECTION IS DOING:
 *
 *   <SectionHead>              eyebrow, title, and a lead beneath it. The
 *                              stacked form. Use where the lead is genuinely
 *                              introductory and the reader needs it before the
 *                              content.
 *
 *   <SectionHead aside={...}>  eyebrow and title on the left, a supporting
 *                              paragraph set small on the right, baselines
 *                              aligned at the bottom. The import's asymmetric
 *                              head. Use where the paragraph is a note about
 *                              the section rather than a way into it, and where
 *                              the section below is wide enough to carry a two
 *                              column head above it.
 *
 *   <SectionHead compact>      eyebrow and title only. Use where the content
 *                              immediately below is self explanatory and a
 *                              paragraph would be throat clearing.
 *
 *   <SectionHead level="h3">   for a head inside an existing section rather
 *                              than one that starts a section.
 *
 * There is no centred variant. Centred headings over left aligned content are
 * the most common template tell there is, and nothing on this property is
 * short enough to centre well.
 */
export function SectionHead({
  eyebrow,
  tone = "datum",
  title,
  lead,
  aside,
  compact = false,
  level = "h2",
  size = "d2",
  className = "",
}: {
  eyebrow?: string;
  /**
   * Which brand colour the eyebrow takes. Alternate it down a page: the colour
   * change tells a reader a new section has started before they read the label,
   * which is what stops a ten section document reading as one run. Both values
   * clear AA for normal text on white and on mist.
   */
  tone?: "datum" | "signal";
  title: string;
  /** Introductory paragraph, set beneath the title. */
  lead?: string;
  /** Supporting note, set small and to the right at desktop width. */
  aside?: string;
  /** Eyebrow and title only. */
  compact?: boolean;
  level?: "h2" | "h3";
  /** Drop to d3 for a head that opens a block rather than a section. */
  size?: "d2" | "d3";
  className?: string;
}) {
  const Heading = level;
  const titleNode = (
    <Heading className={`${size} ${eyebrow ? "mt-5" : ""} max-w-[18ch]`}>
      {title}
    </Heading>
  );

  /*
    THE ASYMMETRIC FORM. Title left, note right, bottom aligned so the note sits
    on the last line of the title rather than floating beside its middle. The
    note is capped at 38 characters of measure because a paragraph set beside a
    display heading has to read as an annotation, and one that runs the full
    column reads as a competing column.
  */
  if (aside) {
    return (
      <div
        className={`flex flex-wrap items-end justify-between gap-x-12 gap-y-6 ${className}`}
      >
        <div className="max-w-2xl">
          {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
          {titleNode}
        </div>
        <p className="text-steel max-w-[38ch] text-[0.9375rem] leading-relaxed">
          {aside}
        </p>
      </div>
    );
  }

  return (
    <div className={`max-w-3xl ${className}`}>
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
      {titleNode}
      {!compact && lead ? <p className="lead mt-5 max-w-2xl">{lead}</p> : null}
    </div>
  );
}
