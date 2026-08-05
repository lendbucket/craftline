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
 * The retired pieces are gone: no Rule, no SectionLabel, no Register. If you
 * are looking for them, they were the drawing set vocabulary and every page
 * that used them has been rebuilt.
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
