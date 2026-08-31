/**
 * THE HAIRLINE GRID AND ITS CELLS
 * ===============================
 *
 * A group of cells separated by a single line rather than by a gap, bounded by
 * a heavier graphite edge. The group reads as one ruled table instead of as
 * scattered tiles.
 *
 * WHY THIS REPLACED CARDS EVERYWHERE. The diagnosis found the previous system
 * answering every content shape with the same rounded hairline rectangle: four
 * capabilities, three operator traits, five FDD explanations, nine FAQ entries,
 * eighteen articles and two legal entities all rendered as the same object. A
 * gapped card grid says "here are some unrelated things". A ruled grid says
 * "here are the parts of one thing", which is what a four part model and a set
 * of brand facts actually are.
 *
 * The mechanism is a one pixel grid gap over a line coloured background, which
 * is the import's construction and the cheapest way to get a true hairline
 * between cells without doubling borders at every seam. See .hairline-grid in
 * globals.css.
 *
 * COLUMN CLASSES ARE WRITTEN OUT IN FULL. Tailwind scans source text for class
 * names, so a template built column count would produce a class that exists in
 * the markup and not in the stylesheet, and the grid would silently collapse to
 * one column with no error anywhere. That failure mode has already cost this
 * repository two dead tokens; see the token existence check in BACKLOG.md.
 */

type Cols = 2 | 3 | 4;

const COLUMNS: Record<Cols, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function HairlineGrid({
  children,
  cols = 2,
  as: Tag = "div",
  className = "",
}: {
  children: React.ReactNode;
  cols?: Cols;
  as?: "div" | "ul" | "ol" | "dl";
  className?: string;
}) {
  return (
    <Tag className={`hairline-grid ${COLUMNS[cols]} ${className}`}>
      {children}
    </Tag>
  );
}

/**
 * One cell.
 *
 * `edge` draws the datum blue top rule the import uses to mark a cell. It is
 * structural rather than decorative: blue is this site's structure colour, so a
 * blue edge says "this is a part of the system being described". It is applied
 * to every cell in a group or to none, never alternated by index. The import
 * alternates red and blue by array position, which is decoration dressed as
 * meaning and would spend the one colour reserved for action.
 */
export function Cell({
  children,
  edge = false,
  as: Tag = "div",
  className = "",
}: {
  children: React.ReactNode;
  edge?: boolean;
  as?: "div" | "li" | "article";
  className?: string;
}) {
  return (
    <Tag
      className={`${edge ? "border-datum border-t-4" : ""} p-6 sm:p-7 ${className}`}
    >
      {children}
    </Tag>
  );
}
