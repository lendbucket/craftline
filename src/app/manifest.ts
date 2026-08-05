import type { MetadataRoute } from "next";
import { COMPANY } from "@/config/company";

/**
 * Web app manifest.
 *
 * A route rather than a static file in /public, because the name and short name
 * come from config and a hand maintained JSON copy would drift from it. Next
 * serves this at /manifest.webmanifest and links it from every page.
 *
 * WHY THIS EXISTS ON A CORPORATE SITE. Not because anyone will install it from
 * an app store, but because iOS and Android use it the moment somebody adds the
 * site to a home screen, and without it they get a screenshot thumbnail and the
 * page title truncated to nothing. A franchise prospect who saves the site
 * during a research session should find a real icon and the company name.
 *
 * `display: standalone` is deliberate and the one genuinely opinionated choice
 * here. Launched from a home screen the site opens without browser chrome,
 * which is what makes it feel like an application rather than a bookmark. The
 * site is navigable without the back button because the header is on every
 * route, so removing browser chrome does not strand anybody.
 *
 * ICONS COME FROM THE EXISTING GENERATED SET. Nothing new is drawn here, and
 * the paths are the same files the link tags in layout.tsx point at, so a
 * regeneration by scripts/brand-assets.mjs updates the home screen icon too.
 *
 * `purpose: "maskable"` is NOT declared on these. A maskable icon must survive
 * being cropped to a circle or a squircle, and the delivered monogram sits on a
 * white square with a small margin: Android would crop into the mark. Declaring
 * only "any" means the platform draws its own rounded container around the full
 * tile, which is correct for this artwork.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${COMPANY.name} | Skilled trade brand and franchise development`,
    short_name: COMPANY.shortName,
    description: COMPANY.descriptor,
    start_url: "/",
    id: "/",
    display: "standalone",
    orientation: "portrait",
    /*
      White, matching the page. The theme colour paints the status bar area in a
      standalone window and the address bar on Android Chrome, so anything other
      than the page ground produces a visible band above a white site.
    */
    background_color: "#ffffff",
    theme_color: "#ffffff",
    categories: ["business"],
    icons: [
      {
        src: "/brand/craftline-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/craftline-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
