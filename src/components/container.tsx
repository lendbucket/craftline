/**
 * The single horizontal rhythm for the site. Every full width section places
 * its content in one of these, so the left edge of a heading on the home page
 * lines up with the left edge of a heading on the franchising page.
 *
 * WIDENED IN PHASE 2A, FROM 1024 TO 1200. The diagnosis measured the home page
 * brands band as a 307 pixel card at the left edge of a 1024 pixel column with
 * 685 pixels of empty white beside it. Part of that is the card, which is now a
 * block that runs the full width, and part of it was the column: 1024 is a
 * reading measure, and this site's structural blocks are tables and grids that
 * want the room. Reading measure is now set where reading happens, by
 * `narrow` and by the article column, rather than by the page container.
 *
 * Nothing else may introduce its own max width.
 */
export function Container({
  children,
  wide = false,
  narrow = false,
  className = "",
}: {
  children: React.ReactNode;
  /** Full structural width, for blocks that run to the page edges. */
  wide?: boolean;
  /** Reading measure, for the legal documents and other prose-first pages. */
  narrow?: boolean;
  className?: string;
}) {
  const width = narrow
    ? "max-w-[52rem]"
    : wide
      ? "max-w-[80rem]"
      : "max-w-[75rem]";
  return (
    <div className={`mx-auto w-full ${width} px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}
