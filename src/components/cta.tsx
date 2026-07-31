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
 *   - `solid` fills with the deep copper and sets zinc on it. That pairing
 *     clears AA on every surface the site has, which is why the fill is pinned
 *     to the deep shade rather than reading the surface aware --color-copper.
 *     Reading the token would flip the fill to the bright shade on graphite and
 *     put light text on a light fill.
 *   - `outline` inherits the surface aware --color-copper from the section
 *     ground, so its text and border are the AA-passing shade for whatever it
 *     is sitting on.
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
      "bg-copper-solid text-zinc hover:bg-copper-solid-hover",
    outline: "border border-copper text-copper hover:bg-copper/10",
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
