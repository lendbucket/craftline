import Link from "next/link";
import { COMPANY } from "@/config/company";

/**
 * The wordmark is set in type, not drawn. Craftline has no emblem and will not
 * get an invented one here: a placeholder logo is the hardest placeholder to
 * remove later, because it accumulates recognition it did not earn.
 *
 * What carries the identity in the meantime is the treatment. "CRAFTLINE" in
 * tracked caps at weight, "BRANDS" lighter behind it, one bronze rule. That
 * reads as a holding company mark rather than as a heading, and it survives
 * being replaced by a real one.
 *
 * Tuned for charcoal surfaces, which is where both current usages sit (header
 * and footer). The "Brands" half uses `muted-dark`, which passes AA on ink and
 * does NOT pass on paper. Putting this on a light surface needs a tone prop
 * first, not a one-off class override at the call site.
 */
export function Wordmark({
  as = "link",
  className = "",
}: {
  /** The footer already sits inside a landmark, so it renders the inert form. */
  as?: "link" | "plain";
  className?: string;
}) {
  const mark = (
    <span className="flex items-baseline gap-2">
      <span className="tracked-caps text-[0.95rem] font-semibold sm:text-base">
        Craftline
      </span>
      <span
        aria-hidden="true"
        className="h-px w-4 shrink-0 self-center bg-bronze"
      />
      <span className="tracked-caps text-[0.7rem] font-normal text-muted-dark sm:text-xs">
        Brands
      </span>
    </span>
  );

  if (as === "plain") {
    return <span className={className}>{mark}</span>;
  }

  return (
    <Link
      href="/"
      aria-label={`${COMPANY.name} home`}
      className={`inline-flex min-h-11 items-center transition-opacity hover:opacity-80 ${className}`}
    >
      {mark}
    </Link>
  );
}
