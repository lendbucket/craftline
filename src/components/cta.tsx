import Link from "next/link";

/**
 * The site's two button treatments, and nothing else.
 *
 * Set in the body sans at sentence case. The retired version was mono,
 * uppercase, tracked wide and squared, so it read as a switch legend on
 * equipment. That was the point then and it is the problem now: a franchise
 * prospect should recognise a button, not notice one.
 *
 * Contrast:
 *   - `primary` fills with the brand red and sets white on it, which clears AA
 *     at 5.93 on every ground this site has. The fill reads
 *     --color-signal-solid, which is never re-pinned per surface; reading the
 *     surface aware --color-signal would flip the fill to its light pin inside
 *     a dark section and put light text on a light fill.
 *   - `secondary` is neutral, through the surface aware --color-control. It is
 *     not a second red. A band gets one red control and the secondary takes
 *     the ground's own foreground.
 *
 * The old variant names were `solid` and `outline`. They are renamed on
 * purpose: a page still passing variant="outline" will fail the type check
 * rather than silently fall through to the primary style.
 *
 * min-h-11 is the 44px touch floor. These are discrete controls, so the height
 * IS the design and growing it is the correct fix rather than the invisible
 * tap-44 expansion used for inline text links.
 */
export function Cta({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  /** Renders an anchor rather than a Link, for outbound brand sites. */
  external?: boolean;
  className?: string;
}) {
  const base =
    "inline-flex min-h-11 items-center justify-center rounded px-6 py-3 text-[0.9375rem] font-semibold transition-colors";

  const variants = {
    primary: "bg-signal-solid hover:bg-signal-solid-hover text-white",
    secondary: "border-control text-control hover:bg-control/5 border",
  } as const;

  const classes = `${base} ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
