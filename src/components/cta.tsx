import Link from "next/link";

/**
 * The site's two button treatments, and nothing else. Restraint is the brand
 * position, so there is no ghost variant, no size scale, and no icon slot until
 * something actually needs one.
 *
 * Set in the mono label face, squared, with wide tracking. A control on this
 * site should read like a switch legend on equipment rather than like a call to
 * action in an ad, which is also the honest register for a page that is
 * information and inquiry only.
 *
 * Contrast, since these sit on every ground:
 *   - `solid` fills with the brand red and sets zinc on it, clearing AA at 4.86
 *     on every surface the site has. The fill is pinned to --color-signal-solid
 *     rather than the surface aware --color-signal, because reading the aware
 *     token would flip the fill to the salmon dark ground pin and put light
 *     text on a light fill.
 *   - `outline` is NEUTRAL, through the surface aware --color-control, which is
 *     graphite on light grounds and zinc on dark. It is not a second red. Red
 *     means the primary action, so a band gets one red control and the
 *     secondary takes the ground's own foreground. Making both red also breaks
 *     on graphite, where the solid fill stays brand red while an outline
 *     reading --color-signal flips to salmon, and the pair reads as a mistake.
 *
 * min-h-11 is the 44px touch floor. These are discrete controls, so the height
 * IS the design and growing it is the correct fix rather than the invisible
 * tap-44 expansion used for inline text links.
 */
export function Cta({
  href,
  children,
  variant = "solid",
  external = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline";
  /** Renders an anchor rather than a Link, for outbound brand sites. */
  external?: boolean;
  className?: string;
}) {
  const base =
    "label inline-flex min-h-11 items-center justify-center px-7 py-3.5 transition-colors";

  const variants = {
    solid:
      "bg-signal-solid text-zinc hover:bg-signal-solid-hover",
    outline: "border border-control text-control hover:bg-control/10",
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
