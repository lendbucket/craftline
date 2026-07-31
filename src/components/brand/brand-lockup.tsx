import { WattsmithLockup } from "@/components/brand/wattsmith-lockup";

/**
 * Renders the delivered lockup for a brand, chosen by slug.
 *
 * WHY A DISPATCHER RATHER THAN <img src={brand.logo}>
 * ---------------------------------------------------
 * Every brand's lockup is inline SVG so it can reverse on a dark surface, stay
 * crisp at any size, and cost no extra request. Inline SVG cannot come from a
 * path in config, so something has to map a brand to its artwork component, and
 * an explicit map is the honest form of that. The alternative, an <img> at
 * brand.logo, renders a sealed box that cannot reverse, which is exactly the
 * problem the inline artwork exists to solve.
 *
 * Returns null for a brand with no artwork yet. That is the deliberate
 * behaviour: a brand added to config before its logo is ported should render a
 * card with no logo rather than a broken image or a placeholder mark. Callers
 * must handle null, which is why every one of them wraps this in a check rather
 * than reserving space for it unconditionally.
 */

type Props = {
  slug: string;
  className?: string;
  /** Set on navy and charcoal surfaces. See the artwork component for rules. */
  onDark?: boolean;
  /** Hide from assistive tech when the brand name is visible text nearby. */
  decorative?: boolean;
};

export function BrandLockup({ slug, className, onDark, decorative }: Props) {
  switch (slug) {
    case "wattsmith-electric":
      return (
        <WattsmithLockup
          className={className}
          onDark={onDark}
          decorative={decorative}
        />
      );
    default:
      return null;
  }
}

/** Whether a brand has ported artwork, so a caller can lay out around it. */
export function hasBrandLockup(slug: string): boolean {
  return slug === "wattsmith-electric";
}
