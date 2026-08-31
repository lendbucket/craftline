import type { Metadata } from "next";
import { COMPANY } from "@/config/company";
import { getReadyImage } from "@/data/images";

/**
 * Builds a page's Metadata.
 *
 * THIS EXISTS BECAUSE OF A SHARP EDGE, not to save typing.
 *
 * Next.js does not deep merge `openGraph` between a layout and a page. A page
 * that exports `openGraph: { url, title }` REPLACES the parent object outright,
 * silently dropping `siteName`, `type`, and `locale`. The page still looks
 * correct in the browser and still scores 100 on Lighthouse SEO, because none
 * of those are things Lighthouse checks. The only symptom is that og:site_name
 * quietly disappears from every page except the home page, which defeats the
 * one SEO objective this site actually has: teaching search engines what the
 * company is called.
 *
 * So no page composes its own openGraph block. They all come through here, and
 * every field the layout sets is restated rather than assumed to be inherited.
 *
 * The same replace-not-merge rule applies to `twitter`, which is why the card
 * type is repeated here too, and why the Open Graph image is restated on every
 * page rather than inherited from the layout. A page that sets `openGraph`
 * without `images` has no card image at all, which is the same failure that
 * dropped `og:site_name` and is just as invisible in a browser.
 */

/**
 * The shared card image, read from the imagery manifest rather than written as
 * a literal path. If the slot is ever downgraded to pending, the build fails
 * here instead of shipping a card that points at a deleted file.
 */
const OG = getReadyImage("og-default");

/** Restated on the layout and on every page. See the note above. */
export const OG_IMAGE = {
  url: OG.src,
  width: OG.width,
  height: OG.height,
  alt: OG.alt,
} as const;

export function pageMetadata({
  title,
  description,
  path,
  brandSuffix = true,
}: {
  /** Page title without the company suffix. The layout template appends it. */
  title: string;
  description: string;
  /** Root relative, with a leading slash. Resolved against metadataBase. */
  path: string;
  /**
   * WHETHER THE LAYOUT'S BRAND SUFFIX IS APPENDED TO THE SEARCH RESULT TITLE.
   * On by default, and off for the insights articles.
   *
   * The suffix is 19 characters. A desktop result truncates somewhere around
   * 60, so on a core page the suffix costs a fifth of the line and buys the
   * brand a place in every result. That is the trade this site wants: nobody
   * knows the company yet, and the result is where they learn the name.
   *
   * On an article it is the wrong trade. An article headline is the whole
   * proposition, it has to carry a question somebody actually typed, and 41
   * characters is not enough room to do that. Sixteen of the eighteen article
   * titles ran past the truncation point and the suffix was the cause in every
   * one, which makes this a single template decision rather than sixteen
   * separate writing problems.
   *
   * The Open Graph and Twitter titles keep the suffix either way. Those are
   * shared link cards rather than search results: they carry no 60 character
   * pressure, and a link pasted into a message is exactly where a reader needs
   * to be told whose writing this is.
   */
  brandSuffix?: boolean;
}): Metadata {
  // Open Graph has no template mechanism, so the suffix is applied by hand to
  // keep a shared link reading the same as a search result.
  const socialTitle = `${title} | ${COMPANY.name}`;

  return {
    title: brandSuffix ? title : { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: COMPANY.name,
      locale: "en_US",
      url: path,
      title: socialTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
