/**
 * The single horizontal rhythm for the site. Every full width section places
 * its content in one of these, so the left edge of a heading on the home page
 * lines up with the left edge of a heading on the franchising page.
 *
 * THE MEASURE IS THE IMPORT'S, AND IT IS A TOKEN. See --container-page and
 * --container-gutter in globals.css for where the numbers come from and what
 * went wrong when they were approximated. The short version: the import runs a
 * 1200px content measure inside a 40px gutter at a 1280 viewport, this build
 * ran 1136 inside 72, and five separate layout faults were all that one
 * difference showing up in five places.
 *
 * THERE IS NO `wide` ANY MORE. It existed because the header and footer wanted
 * more room than the old, too-narrow default. The default is now correct, and
 * the import runs its nav, its footer and its home page on the same 1280
 * container, so a second width would be a difference with nothing behind it.
 *
 * Nothing else may introduce its own width.
 */
export function Container({
  children,
  narrow = false,
  className = "",
}: {
  children: React.ReactNode;
  /** Reading measure, for the legal documents and other prose-first pages. */
  narrow?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full px-[var(--container-gutter)] ${
        narrow ? "max-w-[var(--container-read)]" : "max-w-[var(--container-page)]"
      } ${className}`}
    >
      {children}
    </div>
  );
}
