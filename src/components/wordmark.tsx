import Image from "next/image";
import Link from "next/link";

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
  /**
   * THE COMPANY NAME ARRIVES AS A PROP, AND THAT IS A BUNDLING DECISION.
   *
   * This component used to import COMPANY from src/config/company.ts for one
   * string, the link's accessible name. It renders inside site-header.tsx,
   * which is a client component, so that one import pulled the whole config
   * module across the client boundary on all 27 routes. Tree shaking kept the
   * prose out, but a 10.7 KB chunk carrying the capital brackets and the
   * domain shipped to every page including the ones with no form on them.
   *
   * A prop crosses the boundary as serialised data rather than as a module, so
   * the config stays on the server where it belongs. The server call sites
   * read COMPANY themselves; the client one is handed the string by the
   * layout, which is a server component.
   */
  name,
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
  /** COMPANY.name, passed rather than imported. See the note above. */
  name: string;
  className?: string;
}) {
  const mark = (
    <Image
      src={LOGO_SRC}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      /*
        WITHOUT THIS, THE BROWSER FETCHED A 2048 PIXEL IMAGE TO DRAW 146.

        next/image builds its srcset from the declared width when no sizes
        attribute is given, so the delivered 2042 by 783 lockup was served at
        w=2048, and the head preloaded a w=3840 variant for 2x displays. The
        rendered box is 48 to 56 pixels tall, which is about 146 wide.

        The value is the widest the mark is ever drawn, which is the desktop
        h-14 case. Removing the preload entirely was measured separately at
        -4ms with a confidence interval spanning zero, so this buys bytes and
        not time: about 10.7 KB down to roughly 2. It is one attribute and the
        previous state was plainly wrong, which is the whole argument for it.
      */
      sizes="146px"
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
      aria-label={`${name} home`}
      className="inline-flex min-h-11 items-center transition-opacity hover:opacity-80"
    >
      {mark}
    </Link>
  );
}
