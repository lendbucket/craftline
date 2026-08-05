/**
 * IMAGERY MANIFEST
 * ================
 *
 * Every image slot on this site is declared here, whether or not a real asset
 * exists for it yet. The manifest answers "what imagery does this site still
 * owe, and where would it come from?", it is what `npm run placeholder-audit`
 * reads to decide whether the site is shippable, and it is the source the
 * licensing shopping list is generated from by `npm run image-brief`. There is
 * no second document to keep in sync.
 *
 * THE HONESTY LINE, STATED PRECISELY
 * ----------------------------------
 * Imagery may never assert a false fact.
 *
 * That rules out, permanently and without exception:
 *   - Any person presented as staff, a crew, a franchisee, or a customer.
 *     Craftline has none of these to photograph, and a stock model in a
 *     branded polo is a claim about the company, not decoration.
 *   - Any job site, vehicle, or premises implied to be ours.
 *   - Anything implying scale, footprint, or activity that does not exist.
 *
 * It permits, and this redesign is built on:
 *   - Macro and material photography of the trade world used as texture and
 *     atmosphere. Copper, conduit, panel interiors, drawings, steel, brass,
 *     timber. A close photograph of copper busbar asserts nothing about who
 *     owns it; a photograph of a crew does.
 *   - The real Wattsmith brand assets, which are genuinely ours.
 *   - Original SVG line illustration in the design system.
 *
 * Rules:
 *   - A slot with status "pending" has NO asset and RENDERS NOTHING. Not a grey
 *     box, not a placeholder graphic, and not an <img> pointing at a file that
 *     does not exist. The sections that would carry photography are designed to
 *     stand without it: white ground, type, and the brand marks. A missing
 *     image is honest, a fake one is not, and a section that only works with a
 *     picture in it was not finished.
 *   - A slot only moves to "ready" in the same commit that adds the real file
 *     under /public and fills in `src`, `width`, `height`, `alt`, and `license`.
 *   - `license` is not optional bookkeeping. An unlicensed or unattributed
 *     stock image on a commercial site is a legal exposure that surfaces years
 *     later with no record of where the file came from. If you cannot state the
 *     licence, the image does not ship.
 *   - Alt text is written here, next to the intent of the slot, so it is
 *     composed deliberately rather than typed into a component at 2am. It must
 *     never contain the founder's name, and for a texture image it is usually
 *     null, because atmosphere behind a headline is decorative and announcing
 *     it to a screen reader is noise.
 *
 * NOT TRACKED HERE, DELIBERATELY: the inline SVG in src/components/graphic.tsx
 * and the brand lockups in src/components/brand/. Those are components, not
 * assets. They ship inside the HTML, have no file under /public, and cannot be
 * a broken image, which is the failure mode this manifest exists to catch. The
 * one exception is the Wattsmith lockup, whose source file IS committed and so
 * IS tracked below.
 */

export type ImageStatus = "pending" | "ready";

/** Where an asset comes from. Determines what licence evidence is required. */
export type ImageSource =
  /** Licensed stock. `license` must name the library and the licence type. */
  | "stock"
  /** Owned brand artwork, ours or an operating brand's. */
  | "brand"
  /** Produced by a script in this repository. */
  | "generated";

export interface ImageSlot {
  /** Stable key. Referenced by components and by the audit script. */
  id: string;
  /** Where it appears, in plain language. */
  location: string;
  /** What the finished asset needs to show. Direction for whoever buys it. */
  intent: string;
  /** Target intrinsic dimensions. Aspect ratio is the binding part. */
  aspect: string;
  orientation: "landscape" | "portrait" | "square";
  /**
   * Tone direction. This is the part most likely to be ignored by whoever
   * sources the file, and it is the part that decides whether the image sits
   * under headline type or fights it.
   */
  tone: string;
  /**
   * Search terms for the stock library, in priority order. Empty for assets
   * that are not bought. Read by the image brief generator.
   */
  searchTerms: readonly string[];
  source: ImageSource;
  /**
   * Licence record. Null while pending. For stock this must name the library,
   * the licence type, and the asset id, so the entitlement is provable years
   * from now without anyone remembering the purchase.
   */
  license: string | null;
  status: ImageStatus;
  /** Path under /public. Null while pending. */
  src: string | null;
  /**
   * Intrinsic pixel dimensions of the real asset. Null while pending, and null
   * for vector assets with no single intrinsic size.
   */
  width: number | null;
  height: number | null;
  /**
   * Alt text. Null for slots that are decorative when they land, in which case
   * the component hides them from assistive technology rather than shipping an
   * empty alt on a meaningful image.
   */
  alt: string | null;
}

/**
 * LICENCES OBTAINED AND NOT USED.
 *
 * Four royalty free photographs were licensed and briefly shipped, then removed
 * on the owner's instruction. The files are deleted and the slots below are
 * pending again. The entitlements are recorded here rather than dropped,
 * because a licence that exists and is invisible gets bought a second time.
 *
 * All four are Unsplash Licence: free for commercial use, no attribution
 * required, and no expiry. They can be re-downloaded from these URLs if
 * photography is ever reinstated.
 *
 *   home-hero            Sergio Martins          https://unsplash.com/photos/HrPtg-HH6_k
 *   about-system         Daniel Miksha           https://unsplash.com/photos/28ww1dSengI
 *   franchising-material Vladyslav Cherkasenko   https://unsplash.com/photos/2jftyBtoqzQ
 *   insights-texture     Annie Spratt            https://unsplash.com/photos/OZ2BNYfF_xM
 *
 * A fifth candidate was rejected before use because it was Unsplash+, a paid
 * licence rather than the free one. It was never shipped and is not recorded as
 * an entitlement.
 */
export const IMAGE_SLOTS: ImageSlot[] = [
  {
    id: "craftline-lockup",
    location:
      "Site header and footer on every route, and the Organization schema logo.",
    intent:
      "The delivered Craftline Brands lockup. This is the master artwork every other Craftline raster asset is composed from, and it is the source of truth: the icon set and the Open Graph card are generated from it and from the icon master by scripts/brand-assets.mjs, so they cannot drift from the delivered mark.",
    aspect: "2042x783",
    orientation: "landscape",
    tone: "Delivered artwork. Brand red, brand blue, dark grey BRANDS. Never recoloured, never filtered.",
    searchTerms: [],
    source: "brand",
    license: "Owned. Delivered by the owner.",
    status: "ready",
    src: "/brand/craftline-logo.png",
    width: 2042,
    height: 783,
    /*
      Decorative at every call site. The header wraps it in a link carrying an
      aria-label with the company name, and the footer prints the descriptor
      directly beneath it, so alt text here would announce the company twice.
    */
    alt: null,
  },
  {
    id: "craftline-icon-master",
    location:
      "Not rendered. Source artwork for the generated icon set and favicon.",
    intent:
      "The delivered Craftline mark reduced to the CL monogram, which is what survives at tile sizes. Kept in the repository as the master because every icon the site ships is composed from it, and regenerating from the lockup instead would produce a different and worse crop.",
    aspect: "1936x1638",
    orientation: "landscape",
    tone: "Delivered artwork. Brand red and brand blue on white, no alpha.",
    searchTerms: [],
    source: "brand",
    license: "Owned. Delivered by the owner.",
    status: "ready",
    src: "/brand/craftline-icon.png",
    width: 1936,
    height: 1638,
    alt: null,
  },
  {
    id: "og-default",
    location: "Open Graph and Twitter card fallback for every page.",
    intent:
      "The delivered Craftline lockup centred on white with generous margin. No photograph, no tagline, no strapline: this card is the fallback for every page on the site, so any words on it would be wrong on most of them. Composed from the lockup master by scripts/brand-assets.mjs, so a shared link and the page it opens carry the same mark.",
    aspect: "1200x630",
    orientation: "landscape",
    tone: "White ground, delivered artwork, nothing else.",
    searchTerms: [],
    source: "generated",
    license:
      "Owned. Composed from the delivered lockup by scripts/brand-assets.mjs.",
    status: "ready",
    src: "/brand/craftline-og-default.png",
    width: 1200,
    height: 630,
    alt: "The Craftline Brands logo.",
  },
  {
    id: "app-icon",
    location: "Browser tab, bookmark, and home screen icon.",
    intent:
      "The delivered CL monogram centred on a white square. The source is not square, so it is padded rather than cropped: deciding where to cut a mark is the job of whoever drew it, not of a build script.",
    aspect: "512x512",
    orientation: "square",
    tone: "White ground, delivered artwork, nothing else.",
    searchTerms: [],
    source: "generated",
    license:
      "Owned. Composed from the delivered icon master by scripts/brand-assets.mjs.",
    status: "ready",
    src: "/brand/craftline-icon-512.png",
    width: 512,
    height: 512,
    alt: null,
  },
  {
    id: "apple-touch-icon",
    location: "iOS home screen icon.",
    intent:
      "The same tile as the app icon at 180 pixels. Declared separately rather than letting iOS downsample the 512, which it does badly.",
    aspect: "180x180",
    orientation: "square",
    tone: "White ground, delivered artwork, nothing else.",
    searchTerms: [],
    source: "generated",
    license:
      "Owned. Composed from the delivered icon master by scripts/brand-assets.mjs.",
    status: "ready",
    src: "/brand/craftline-icon-180.png",
    width: 180,
    height: 180,
    alt: null,
  },
  {
    id: "brand-card-wattsmith",
    location:
      "Wattsmith Electric card on the home page, the brands index, and the brand showcase.",
    intent:
      "The delivered Wattsmith Electric lockup, copied from that brand's own repository so the two properties cannot drift apart. This file is the designer master and the source of truth; it is rendered as inline SVG by src/components/brand/wattsmith-lockup.tsx so the navy artwork can reverse on a navy field, which an <img> cannot do. Decorative at every call site, because the brand name is always present as visible text beside it.",
    aspect: "1372x498",
    orientation: "landscape",
    tone: "Brand navy and gold, unmodified. Craftline does not restyle it.",
    searchTerms: [],
    source: "brand",
    license:
      "Owned. Wattsmith Electric is a Craftline Brands operating brand; artwork supplied by that brand's repository.",
    status: "ready",
    src: "/brand/wattsmith-electric-lockup.svg",
    width: null,
    height: null,
    alt: null,
  },

  /* ---------------------------------------------------------------------
     PENDING. All four are material texture. None contains a person, a job
     site, or anything that could be read as a claim about Craftline's
     operations. Each has a designed treatment already in place, so the page
     is finished without the photograph and improved by it.
     --------------------------------------------------------------------- */

  {
    id: "home-hero",
    location: "Home page, beside the opening statement.",
    intent:
      "Circuit breakers in a distribution panel, photographed square on so the rows read as an ordered system rather than as a location. It asserts nothing about whose panel it is, which is the requirement: it is equipment, not our equipment.",
    aspect: "2000x1125",
    orientation: "landscape",
    tone: "Even light, neutral grey and white, no drama. It sits on a white page at full opacity as an ordinary photograph, so it needs to be clean rather than moody.",
    searchTerms: [
      "copper busbar macro",
      "electrical panel copper conductors close up",
      "copper wire terminals macro dark",
      "bare copper conductor detail low key",
    ],
    source: "stock",
    license: null,
    status: "pending",
    src: null,
    width: null,
    height: null,
    alt: null,
  },
  {
    id: "about-system",
    location: "About page, beside the four part model explanation.",
    intent:
      "A technical drawing photographed close, with the linework reading as geometry rather than as a legible document. Nothing on the sheet can be read, because legible text in a photograph is a fact being asserted.",
    aspect: "2000x1125",
    orientation: "landscape",
    tone: "Neutral paper, grey linework, flat even light. Not a cyanotype: modern trade drawings are not blue, and the blueprint is the most predictable image in this category.",
    searchTerms: [
      "electrical drawing panel schedule paper",
      "construction drawing detail linework close up",
      "one line diagram print markup",
      "engineering drawing paper texture flat lay",
    ],
    source: "stock",
    license: null,
    status: "pending",
    src: null,
    width: null,
    height: null,
    alt: null,
  },
  {
    id: "franchising-material",
    location: "Franchising page, beside the support model section.",
    intent:
      "Brass fittings as material. They stand for standards and tolerance, which is what the section beside them is about. No hands, no person, no workshop context that could read as somebody's premises.",
    aspect: "2000x1500",
    orientation: "landscape",
    tone: "Cool light ground with a warm brass note. No rim lighting and no black backdrop product photography.",
    searchTerms: [
      "brass fittings macro muted",
      "steel conduit threaded close up",
      "precision hand tool macro neutral background",
      "machined metal surface texture detail",
    ],
    source: "stock",
    license: null,
    status: "pending",
    src: null,
    width: null,
    height: null,
    alt: null,
  },
  {
    id: "insights-texture",
    location: "Insights hub, beside the section explaining why it exists.",
    intent:
      "Paper as material: overlapping sheets, abstract enough that no document is legible. It is the reading surface of the trade and it sits with the section about publishing information.",
    aspect: "2000x1500",
    orientation: "landscape",
    tone: "Near white, soft even light, minimal contrast. Nothing styled as a flat lay and no props placed for composition.",
    searchTerms: [
      "kraft paper texture macro",
      "manila folder edge close up",
      "drafting vellum texture",
      "bound technical manual page edges macro",
    ],
    source: "stock",
    license: null,
    status: "pending",
    src: null,
    width: null,
    height: null,
    alt: null,
  },
];

/** Slots still awaiting a real asset. Used by the placeholder audit. */
export const PENDING_IMAGE_SLOTS = IMAGE_SLOTS.filter(
  (slot) => slot.status === "pending",
);

/** Slots that must be licensed. Drives the image brief. */
export const STOCK_IMAGE_SLOTS = IMAGE_SLOTS.filter(
  (slot) => slot.source === "stock",
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

/**
 * A slot that is ready, with its asset path guaranteed present.
 *
 * Metadata builders need `src`, `width`, `height`, and `alt` as non null
 * values. Rather than have every caller assert that a slot it knows is ready
 * really is, this narrows once and throws loudly if a slot is downgraded to
 * pending without its consumers being updated in the same commit.
 */
export function getReadyImage(id: string): {
  src: string;
  width: number;
  height: number;
  alt: string;
} {
  const slot = getImageSlot(id);
  if (
    slot.status !== "ready" ||
    !slot.src ||
    slot.width === null ||
    slot.height === null ||
    !slot.alt
  ) {
    throw new Error(
      `Image slot "${id}" is consumed somewhere that requires a ready asset ` +
        "with dimensions and alt text, but it is not fully populated. Either " +
        "restore the asset or remove the consumer.",
    );
  }
  return {
    src: slot.src,
    width: slot.width,
    height: slot.height,
    alt: slot.alt,
  };
}
