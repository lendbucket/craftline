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

/*
  THE IMPORT DOES NOT COUNT COLUMNS, IT DECLARES A MINIMUM AND LETS THE MEASURE
  DECIDE, and that is why its four part grid is three across with the fourth
  alone beneath rather than a 2x2.

    grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
    gap: 24px;

  At the 1200px measure that fits three 384px tracks, because four would need
  1432px. An explicit lg:grid-cols-2 cannot produce that shape at any width, and
  cannot follow the measure if the measure ever changes again.
*/
const AUTO_FIT_340 =
  "grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))]";
const AUTO_FIT_270 =
  "grid-cols-[repeat(auto-fit,minmax(min(100%,270px),1fr))]";

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
/**
 * NUMBERED BLOCKS. The import's signature device and the one this build
 * dropped.
 *
 * Each block is bounded by its own 2px graphite rule with a gap between it and
 * its neighbours, and its numeral sits knocked out of the top rule in one of
 * the two brand colours, alternating down the group. That knockout is the whole
 * effect: the number is not inside the box and not above it, it is cut into its
 * edge, which is what makes the group read as drawn rather than as a table.
 *
 * A gapped grid rather than the hairline grid, because the knockout needs a
 * top rule of its own to sit on and a hairline grid shares its rules between
 * cells.
 *
 * ON THE NUMERALS THEMSELVES: they enumerate, they do not sequence. See the
 * note on .numeral in globals.css. The list stays unordered and the numeral is
 * aria-hidden, so nothing tells a screen reader there is an order that the
 * content does not have.
 */
export function NumberedGrid({
  items,
  ground = "white",
  className = "",
}: {
  items: readonly { title: string; body: string }[];
  /** The knockout has to be filled with the ground the block sits on. */
  ground?: "white" | "mist";
  className?: string;
}) {
  const knockout = ground === "mist" ? "bg-mist" : "bg-white";
  return (
    <ul className={`grid gap-6 ${AUTO_FIT_340} ${className}`}>
      {items.map((item, index) => (
        <li
          key={item.title}
          className="border-graphite border-2 px-7 pb-8 sm:px-8"
        >
          <span
            aria-hidden="true"
            className={`numeral ${knockout} ${index % 2 === 0 ? "text-signal" : "text-datum"}`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="d3 mt-3">{item.title}</h3>
          <p className="text-steel mt-4 leading-relaxed">{item.body}</p>
        </li>
      ))}
    </ul>
  );
}

/**
 * The same device carrying a single statement rather than a title and body.
 * Used for the operator traits, which are one sentence each.
 */
export function NumberedStatements({
  items,
  ground = "white",
  className = "",
}: {
  items: readonly string[];
  ground?: "white" | "mist";
  className?: string;
}) {
  const knockout = ground === "mist" ? "bg-mist" : "bg-white";
  return (
    <ul className={`grid gap-8 ${AUTO_FIT_270} ${className}`}>
      {items.map((item, index) => (
        <li
          key={item}
          className="border-graphite border-2 px-7 pb-8 sm:px-8"
        >
          <span
            aria-hidden="true"
            className={`numeral ${knockout} ${index % 2 === 0 ? "text-signal" : "text-datum"}`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="text-graphite mt-3 text-[1.0625rem] leading-relaxed font-semibold">
            {item}
          </p>
        </li>
      ))}
    </ul>
  );
}

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
