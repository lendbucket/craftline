import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { COMPANY, SITE_URL } from "@/config/company";
import { getImageSlot } from "@/data/images";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { OG_IMAGE } from "@/lib/seo";
import "./globals.css";

/**
 * THREE TYPE ROLES, EACH WITH A JOB THE SUBJECT ACTUALLY HAS.
 *
 * Bricolage Grotesque carries display. It is a humanist grotesque with real
 * irregularity in its letterforms, so it reads drawn rather than engineered.
 * That is where the warmth in this system comes from, and it is why the
 * display face is not another neutral corporate sans. Display sizes only; it
 * is deliberately not used for UI.
 *
 * Source Serif 4 carries body. It is documentary rather than literary, built
 * for long technical reading, which is the register of code books, permits,
 * and specifications. There is a lot of copy on this site now and it has to be
 * genuinely readable at length.
 *
 * IBM Plex Mono carries the label layer: title block fields, section
 * registers, dates, schedules. It has an engineering software lineage, which
 * is exactly the vernacular being borrowed.
 *
 * WEIGHT BUDGET. Bricolage and Source Serif load as variable weight only. Both
 * support an optical size axis and Bricolage also supports width; neither is
 * requested, because the gain is invisible at the sizes used here and the axes
 * cost real bytes. Plex Mono is not variable on Google Fonts, so it loads the
 * two static weights actually used and no more.
 *
 * All three are declared under *-family names that differ from the Tailwind
 * theme keys in globals.css. Matching the names would create a
 * self-referential custom property, which resolves to invalid and silently
 * drops the face to a system fallback with no error anywhere.
 */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display-family",
  display: "swap",
});

const body = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body-family",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-family",
  display: "swap",
});

export const metadata: Metadata = {
  /**
   * Absolute base for every relative URL Next resolves in metadata, including
   * canonicals and Open Graph images. Without it those emit as paths and are
   * useless to a crawler.
   */
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${COMPANY.name} | Skilled trade brand and franchise development`,
    /**
     * Pages supply the leading half. Ending every title with the company name
     * is what teaches the SERP what this site is called, alongside the WebSite
     * schema.
     */
    template: `%s | ${COMPANY.name}`,
  },
  description: COMPANY.descriptor,
  applicationName: COMPANY.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    // Set here for the home page. NOT inherited by pages that export their own
    // openGraph: Next replaces the object rather than merging it. Every other
    // page goes through pageMetadata in src/lib/seo.ts, which restates all of
    // this. See the long note in that file before changing anything here.
    siteName: COMPANY.name,
    locale: "en_US",
    url: "/",
    title: `${COMPANY.name} | Skilled trade brand and franchise development`,
    description: COMPANY.descriptor,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${COMPANY.name} | Skilled trade brand and franchise development`,
    description: COMPANY.descriptor,
    images: [OG_IMAGE.url],
  },
  /**
   * Icons are declared explicitly rather than through the app/icon file
   * convention. The convention would work, but it puts the asset somewhere
   * src/data/images.ts cannot see, and the placeholder audit verifies that
   * every manifest path resolves under /public. Keeping the files in /public
   * keeps the manifest load bearing instead of decorative.
   *
   * The SVG-first ordering the file convention would give us is not available
   * for a generated raster icon, so the set is: a 32px PNG for the tab, a
   * 512px PNG for home screens and app switchers, and favicon.ico at the root
   * for the many clients that request it without reading these tags at all.
   */
  icons: {
    icon: [
      { url: getImageSlot("app-icon").src as string, sizes: "512x512", type: "image/png" },
      { url: "/brand/craftline-icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: getImageSlot("app-icon").src as string, sizes: "512x512", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  /**
   * No `authors`, no `creator`, no `publisher` name string. Those fields render
   * into meta tags, and the founder's name never renders on this property.
   */
  formatDetection: { telephone: false, address: false, email: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="bg-zinc text-graphite flex min-h-screen flex-col">
        {/*
          First focusable element on the page. The header nav is short, but a
          keyboard user still should not have to walk it on every route.
        */}
        <a
          href="#main"
          className="label focus:bg-graphite focus:text-zinc sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:px-4 focus:py-3"
        >
          Skip to content
        </a>

        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />

        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />

        <Analytics />
      </body>
    </html>
  );
}
