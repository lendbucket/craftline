/**
 * The single horizontal rhythm for the site. Every full width section places
 * its content in one of these, so the left edge of a heading on the home page
 * lines up with the left edge of a heading on the franchising page.
 *
 * `wide` exists for card grids that need the extra room. Nothing else should
 * introduce its own max width.
 */
export function Container({
  children,
  wide = false,
  className = "",
}: {
  children: React.ReactNode;
  wide?: boolean;
  className?: string;
}) {
  const width = wide ? "max-w-6xl" : "max-w-5xl";
  return (
    <div className={`mx-auto w-full ${width} px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}
