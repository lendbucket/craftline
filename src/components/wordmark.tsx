import Link from "next/link";
import { COMPANY } from "@/config/company";

/**
 * The wordmark is set in type, not drawn. Craftline has no emblem and will not
 * get an invented one here: a placeholder logo is the hardest placeholder to
 * remove later, because it accumulates recognition it did not earn.
 *
 * What carries the identity is the treatment. CRAFTLINE in the mono label face
 * at weight, a copper rule, then BRANDS lighter behind it. Setting the wordmark
 * in the same face as the title block fields is deliberate: the company signs
 * its documents in the same hand it labels them with.
 *
 * `tone` exists because this now appears on both grounds. The old version was
 * tuned for charcoal only and put a muted grey on the second word that would
 * have failed contrast the moment anyone placed it on a light surface. Rather
 * than leave that trap set, the surface is a required decision at the call
 * site.
 */
export function Wordmark({
  as = "link",
  tone = "dark",
  className = "",
}: {
  /** The footer already sits inside a landmark, so it renders the inert form. */
  as?: "link" | "plain";
  /** Which ground this is sitting on. */
  tone?: "dark" | "light";
  className?: string;
}) {
  const primary = tone === "dark" ? "text-zinc" : "text-graphite";

  const mark = (
    <span className="flex items-baseline gap-2.5">
      <span className={`label ${primary}`}>Craftline</span>
      <span
        aria-hidden="true"
        className="bg-copper h-px w-4 shrink-0 self-center"
      />
      <span className="label-sm text-steel">Brands</span>
    </span>
  );

  if (as === "plain") {
    return <span className={className}>{mark}</span>;
  }

  return (
    <Link
      href="/"
      aria-label={`${COMPANY.name} home`}
      className={`inline-flex min-h-11 items-center transition-opacity hover:opacity-75 ${className}`}
    >
      {mark}
    </Link>
  );
}
