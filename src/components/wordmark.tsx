import Image from "next/image";
import Link from "next/link";
import { COMPANY } from "@/config/company";

/**
 * The Craftline lockup in the header and footer.
 *
 * WHITE GROUND IS AN OWNER RULE, NOT A STYLE CHOICE. The mark is only approved
 * on white, and the delivered artwork is RGB with no alpha channel, so it
 * carries its own white background rather than compositing onto whatever is
 * behind it. Put it on a coloured or dark ground and it renders as a white
 * rectangle with a logo in it. The header and footer are both white for this
 * reason. If you are about to place this somewhere else, you have found a
 * layout bug rather than an exception to the rule.
 *
 * Never recolour it, never add transparency, and never apply a filter to fake
 * either. The absence of alpha is intended.
 *
 * SIZING. The intrinsic dimensions below are the delivered file's, which is
 * what next/image needs to reserve the right space and avoid a layout shift.
 * The rendered size is set in CSS by the call site, and the defaults here are
 * tuned against the 64px and 80px header bar.
 *
 * `priority` because this sits in the header on every route and is the largest
 * contentful paint candidate on short pages. Lazy loading the thing at the top
 * of the document is the one case where the default is wrong.
 */

/** The delivered lockup, 2042 x 783. */
const LOGO_SRC = "/brand/craftline-logo.png";
const LOGO_WIDTH = 2042;
const LOGO_HEIGHT = 783;

export function Wordmark({
  as = "link",
  /*
    Sized by screenshot against the nav rather than by guess. The delivered
    lockup stacks BRANDS under the wordmark, so a given pixel height buys much
    less apparent size than a single line mark would, and at h-9 it read as a
    label beside the navigation rather than as the primary object in the bar.
    The bar was grown to 80px on mobile and 96px on desktop to carry it, which
    leaves 16px and 22px of clearance.
  */
  className = "h-12 w-auto sm:h-14",
}: {
  /** The footer already sits inside a landmark, so it renders the inert form. */
  as?: "link" | "plain";
  className?: string;
}) {
  const mark = (
    <Image
      src={LOGO_SRC}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority
      /*
        Decorative at every call site. The company name is always present as
        real text nearby: the link wrapper below carries an aria-label, and the
        footer prints the descriptor directly under the mark. Giving it alt text
        as well would make a screen reader announce the company twice.
      */
      alt=""
      className={className}
    />
  );

  if (as === "plain") return mark;

  return (
    <Link
      href="/"
      aria-label={`${COMPANY.name} home`}
      className="inline-flex min-h-11 items-center transition-opacity hover:opacity-80"
    >
      {mark}
    </Link>
  );
}
