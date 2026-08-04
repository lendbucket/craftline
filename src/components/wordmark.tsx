import Link from "next/link";
import { COMPANY } from "@/config/company";

/**
 * The company mark in the header and footer, set in type.
 *
 * WHITE GROUND IS AN OWNER RULE, NOT A STYLE CHOICE. The mark is only approved
 * on white. That is why the header and footer are both white and why this
 * component sets no background of its own: it must never end up on a coloured
 * or dark ground. If you are about to place it on one, you have found a layout
 * bug, not an exception to the rule.
 *
 * To render artwork instead, replace the <span> below with next/image and an
 * explicit width and height. Every call site already places this on white, so
 * nothing else needs to change.
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
    <span
      className={`text-graphite text-[1.0625rem] leading-none font-bold tracking-[-0.01em] ${className}`}
    >
      {COMPANY.name}
    </span>
  );

  if (as === "plain") return mark;

  return (
    <Link
      href="/"
      aria-label={`${COMPANY.name} home`}
      className="inline-flex min-h-11 items-center transition-opacity hover:opacity-75"
    >
      {mark}
    </Link>
  );
}
