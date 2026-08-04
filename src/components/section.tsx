/**
 * SECTION FURNITURE
 * =================
 *
 * The ordinary pieces a corporate page is built from, kept in one file so the
 * rhythm is defined once rather than reassembled by hand on every page.
 *
 * The retired versions of these were literal drawing devices: a plotted rule
 * that animated on scroll, a numbered register in the margin, a mono label
 * layer. They are gone. What replaces them is a section heading with an
 * optional small blue eyebrow, which is what a franchisor site does and what a
 * reader passes over without noticing.
 *
 * The retired pieces are kept at the bottom of this file as transitional
 * shims, restyled onto the new system, because only the home page has been
 * rebuilt so far. Delete each one as its last consumer is rewritten.
 */

/**
 * Standard vertical rhythm for a section. Every band uses this rather than
 * setting its own padding, so the page has one spacing scale.
 */
export function Band({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`py-16 sm:py-20 lg:py-24 ${className}`}>{children}</div>
  );
}

/**
 * A section's heading block: optional eyebrow, title, optional lead.
 *
 * Centre alignment is available because a corporate section header is
 * conventionally centred and this site is trying to be conventional, but it is
 * off by default; left is easier to read at length.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-3xl"} ${className}`}
    >
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className={`h2 ${eyebrow ? "mt-3" : ""}`}>{title}</h2>
      {lead ? (
        <p className={`lead mt-4 ${centered ? "" : "max-w-2xl"}`}>{lead}</p>
      ) : null}
    </div>
  );
}

/**
 * Standard content card. White, hairline border, small radius.
 *
 * `as` exists because these are used both as plain containers and as list
 * items, and a div inside a ul is not valid markup.
 */
export function Card({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  return (
    <Tag
      className={`border-line rounded-lg border bg-white p-6 sm:p-7 ${className}`}
    >
      {children}
    </Tag>
  );
}

/* ==========================================================================
   TRANSITIONAL SHIMS. DELETE AS YOU GO.
   ==========================================================================

   Only the home page has been rebuilt. Every other route still imports these
   three, and removing them now would break the build rather than surface a
   design problem. So they stay, RESTYLED ONTO THE NEW SYSTEM rather than
   preserved as they were: an un-rebuilt page picks up the plain sans and the
   conventional spacing immediately, and is behind on layout only.

   What changed inside them, and why it matters: Rule no longer animates on
   scroll and is no longer blue, SectionLabel is no longer a mono chip, and
   Register no longer numbers itself in a margin column. Those three devices
   were the drawing set system. They are gone even where the page around them
   has not been rewritten yet.

   Remaining consumers: about, brands, brands/[slug], contact, franchising,
   insights, insights/[slug], not-found.
   ========================================================================== */

/** Was the plotted rule. Now an ordinary hairline divider. */
export function Rule({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`bg-line block h-px w-full ${className}`}
    />
  );
}

/** Was a mono chip over an animated rule. Now the standard section eyebrow. */
export function SectionLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

/**
 * Was the numbered margin register. Now a plain bordered row: the number is
 * gone entirely, because a decorative sequence number is exactly the kind of
 * element a reader stops and wonders about.
 */
export function Register({
  label,
  children,
}: {
  index: number;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-line grid gap-4 border-t pt-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-10">
      <p className="text-steel text-[0.9375rem] font-semibold">{label}</p>
      <div>{children}</div>
    </div>
  );
}
