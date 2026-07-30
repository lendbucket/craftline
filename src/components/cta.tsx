import Link from "next/link";

/**
 * The site's two button treatments, and nothing else. Restraint is the brand
 * position here, so there is no ghost variant, no size scale, and no icon slot
 * until something actually needs one.
 *
 * Contrast notes, since these sit on both charcoal and paper:
 *   - `solid` fills with bright bronze and sets ink text on it (5.86:1). That
 *     pairing passes on every surface the site has, which is why the fill is
 *     pinned to the bright shade rather than reading --color-bronze.
 *   - `outline` inherits the surface aware --color-bronze from the section
 *     background class, so its text and border are the AA-passing shade for
 *     whatever it is sitting on.
 *
 * min-h-11 is the 44px touch floor. These are discrete controls, so the height
 * is the design and growing it is the correct fix rather than the invisible
 * tap-44 expansion used for inline text links.
 */
export function Cta({
  href,
  children,
  variant = "solid",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline";
  className?: string;
}) {
  const base =
    "inline-flex min-h-11 items-center justify-center rounded px-6 py-3 text-sm font-semibold tracking-wide transition-colors";

  const variants = {
    solid: "bg-bronze-bright text-ink hover:bg-bronze-bright-hover",
    outline: "border border-bronze text-bronze hover:bg-bronze/10",
  } as const;

  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
