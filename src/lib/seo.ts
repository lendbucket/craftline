import type { Metadata } from "next";
import { COMPANY } from "@/config/company";

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
 * type is repeated here too.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  /** Page title without the company suffix. The layout template appends it. */
  title: string;
  description: string;
  /** Root relative, with a leading slash. Resolved against metadataBase. */
  path: string;
}): Metadata {
  // Open Graph has no template mechanism, so the suffix is applied by hand to
  // keep a shared link reading the same as a search result.
  const socialTitle = `${title} | ${COMPANY.name}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: COMPANY.name,
      locale: "en_US",
      url: path,
      title: socialTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
    },
  };
}
