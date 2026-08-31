import Link from "next/link";

/**
 * The site's two button treatments, and nothing else.
 *
 * PHASE 2A: square, display face, uppercase, tracked. The previous version was
 * the body sans at sentence case with a small radius, chosen so that a reader
 * would recognise a button rather than notice one. That worked and it is part
 * of why nothing on any page had any presence. These are recognisable as
 * buttons because of their shape and position; what changed is that they now
 * belong to the same type system as everything above them.
 *
 * Contrast, unchanged and still measured:
 *   - `primary` fills with the brand red and sets white on it, which clears AA
 *     at 5.93 on every ground this site has. The fill reads
 *     --color-signal-solid, which is never re-pinned per surface; reading the
 *     surface aware --color-signal would flip the fill to its light pin inside
 *     a dark section and put light text on a light fill. There are no dark
 *     sections, and the two names stay separate so that stays true by
 *     construction rather than by memory.
 *   - `secondary` is a graphite rule with graphite text, through the surface
 *     aware --color-control. It is not a second red. A band gets one red
 *     control and the secondary takes the ground's own foreground.
 *
 * The 2px rule on the secondary matches the rule weight the rest of the system
 * uses to bound a block, so a button reads as part of the same drawing rather
 * than as a control dropped onto it.
 *
 * min-h-12 is above the 44px touch floor. These are discrete controls, so the
 * height IS the design and growing it is the correct fix rather than the
 * invisible tap-44 expansion used for inline text links.
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
  variant?: "primary" | "secondary" | "mark" | "markOutline";
  /** Renders an anchor rather than a Link, for outbound brand sites. */
  external?: boolean;
  className?: string;
}) {
  const base =
    "font-display inline-flex min-h-12 items-center justify-center px-7 text-[1.0625rem] font-bold tracking-[0.07em] uppercase transition-colors";

  /*
    Four treatments, and the last two exist only inside the closing red band.

    On the signal red field the ordinary pair is unusable: a red fill on red is
    invisible and a graphite outline measures 2.99 against it. So the primary
    inverts to a white fill with red text, which is the same 5.93 ratio read the
    other way round, and the secondary becomes a white outline with white text.

    They are not general purpose. If you reach for `mark` outside the band, the
    ground underneath it is wrong.
  */
  const variants = {
    primary: "bg-signal-solid hover:bg-signal-solid-hover text-white",
    secondary: "border-control text-control hover:bg-control/5 border-2",
    mark: "bg-white text-signal hover:bg-onred",
    markOutline: "border-2 border-white text-white hover:bg-white/12",
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

/**
 * A row of actions. Every page pairs a primary with a secondary, and putting
 * the arrangement here means the stacking behaviour at 390 is decided once.
 */
export function CtaRow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:gap-4 ${className}`}>
      {children}
    </div>
  );
}
