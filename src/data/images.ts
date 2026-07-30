/**
 * IMAGERY MANIFEST
 * ================
 *
 * Every image slot on this site is declared here, whether or not a real asset
 * exists for it yet. The manifest is the answer to "what photography does this
 * site still owe?" and it is the thing `npm run placeholder-audit` reads to
 * decide whether the site is shippable.
 *
 * Rules:
 *   - A slot with status "pending" has NO asset. Components must render the
 *     designed empty state for it, not a grey box, not a stock photo, and not
 *     an <img> pointing at a file that does not exist. A missing image is
 *     honest; a fake one is not.
 *   - A slot only moves to "ready" in the same commit that adds the real file
 *     under /public and fills in `src`, `width`, `height`, and `alt`.
 *   - Alt text is written here, next to the intent of the slot, so it is
 *     composed deliberately rather than typed into a component at 2am. It must
 *     never contain the founder's name.
 *
 * Craftline has no photography and no designer identity yet. Every slot below
 * is therefore pending, and the site is built to look finished without any of
 * them: the visual weight is carried by type, rule, and surface. When real
 * assets arrive they should be an upgrade, not a rescue.
 */

export type ImageStatus = "pending" | "ready";

export interface ImageSlot {
  /** Stable key. Referenced by components and by the audit script. */
  id: string;
  /** Where it appears, in plain language. */
  location: string;
  /** What the finished asset needs to show. Direction for whoever shoots it. */
  intent: string;
  /** Target intrinsic dimensions. Aspect ratio is the binding part. */
  aspect: string;
  status: ImageStatus;
  /** Path under /public. Null while pending. */
  src: string | null;
  /**
   * Alt text for the finished asset. Null only for slots that will be
   * decorative when they land, in which case the component renders alt="".
   */
  alt: string | null;
}

export const IMAGE_SLOTS: ImageSlot[] = [
  {
    id: "og-default",
    location: "Open Graph and Twitter card fallback for every page.",
    intent:
      "The Craftline wordmark set in type on a charcoal field, with generous margin. No photograph, no emblem, no tagline. This is the one slot that should be produced from the identity system rather than shot, and it must be replaced the day a real identity exists.",
    aspect: "1200x630",
    status: "pending",
    src: null,
    alt: null,
  },
  {
    id: "app-icon",
    location: "Browser tab, bookmark, and home screen icon.",
    intent:
      "A single letterform drawn from the finished wordmark on a charcoal field. Deliberately not commissioned yet: inventing an emblem now would create a mark the real identity has to fight. Until then the site ships without a custom icon.",
    aspect: "512x512",
    status: "pending",
    src: null,
    alt: null,
  },
  {
    id: "home-hero",
    location: "Home page hero, behind the headline.",
    intent:
      "Wide environmental shot of skilled trade work in progress, shot dark and low contrast so headline type stays legible over it. Real technicians on a real job. No posed models, no crossed arms, no branded truck hero shot. The hero is designed to work with no image at all, so this only lands if the photograph is genuinely good.",
    aspect: "16x9",
    status: "pending",
    src: null,
    alt: null,
  },
  {
    id: "brand-card-wattsmith",
    location: "Wattsmith Electric card on the home page and the brands index.",
    intent:
      "Wattsmith work in the field, or the Wattsmith mark on a vehicle or uniform. Must come from Wattsmith's own asset library so the two properties stay visually consistent.",
    aspect: "3x2",
    status: "pending",
    src: null,
    alt: "A Wattsmith Electric technician at work.",
  },
  {
    id: "about-operations",
    location: "About page, alongside the holding company explanation.",
    intent:
      "Documentation, training, or dispatch in use. The point is the system behind the trade, not the trade itself. Avoid stock office imagery.",
    aspect: "4x3",
    status: "pending",
    src: null,
    alt: "Craftline operating procedures in use.",
  },
  {
    id: "franchising-operator",
    location: "Franchising page, supporting the operator profile section.",
    intent:
      "An owner operator running the business side of a trade company. Must not read as a sales pitch and must not imply any financial outcome.",
    aspect: "3x2",
    status: "pending",
    src: null,
    alt: "An owner operator at work.",
  },
];

/** Slots still awaiting a real asset. Used by the placeholder audit. */
export const PENDING_IMAGE_SLOTS = IMAGE_SLOTS.filter(
  (slot) => slot.status === "pending",
);

/**
 * Lookup by id. Throws on an unknown key rather than returning undefined: a
 * typo in a slot id should fail the build, not silently render nothing.
 */
export function getImageSlot(id: string): ImageSlot {
  const slot = IMAGE_SLOTS.find((candidate) => candidate.id === id);
  if (!slot) {
    throw new Error(
      `Unknown image slot "${id}". Every image on this site must be declared in src/data/images.ts.`,
    );
  }
  return slot;
}
