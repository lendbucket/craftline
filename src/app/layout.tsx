import type { Metadata, Viewport } from "next";
import { Barlow, Big_Shoulders, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { JsonLd } from "@/components/json-ld";
import { MobileCta, MobileCtaSpacer } from "@/components/mobile-cta";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { COMPANY, SITE_URL } from "@/config/company";
import { getImageSlot } from "@/data/images";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { OG_IMAGE } from "@/lib/seo";
import "./globals.css";

/**
 * THREE TYPE ROLES.
 *
 * All three are self hosted. next/font downloads the files at build time and
 * serves them from this deployment, so the browser never contacts Google, and
 * the privacy policy's claim that this site makes zero third party requests
 * stays true. That is not an optimisation, it is a factual statement on
 * /privacy that the font loader is responsible for keeping accurate.
 *
 * DISPLAY, Big Shoulders. Page titles, section titles, eyebrows, buttons,
 * chips, navigation, fact values.
 *
 *   THE IMPORT ASKS FOR "Big Shoulders Display". GOOGLE NO LONGER SERVES THAT
 *   FAMILY. It was folded into "Big Shoulders", a variable family with an
 *   optical size axis running 10 to 72, where the top of that range is the
 *   drawing the old Display cut carried. Requesting the retired name would have
 *   failed silently to a system fallback, which is exactly the class of bug the
 *   *-family naming note below exists to prevent.
 *
 *   `axes: ["opsz"]` is requested deliberately, and it is free. Measured: the
 *   emitted woff2 is 58,296 bytes with the axis, without it, and with specific
 *   static weights requested instead. Google serves the same variable file
 *   either way, so declining the axis would have bought nothing and lost the
 *   thing the face is drawn for: at the 88px page title it wants the display
 *   drawing, at the 16px eyebrow it wants the text drawing. With the axis
 *   present, `font-optical-sizing: auto` in globals.css maps it from the
 *   rendered size and no component ever sets it by hand.
 *
 * SANS, Barlow. Body copy, form controls, captions, small labels.
 *
 *   Barlow is NOT a variable family on Google Fonts, so each weight is a
 *   separate file and every weight requested is bytes shipped. Two are
 *   requested: 400 for reading and 600 for labels, emphasis, and form labels.
 *   The import uses four. The other two were dropped because the display face
 *   now carries everything that would have needed 700, and 500 was doing
 *   nothing 400 does not. If a design need for a third weight appears, add it
 *   here rather than reaching for a synthetic bold.
 *
 * SERIF, Source Serif 4. Long form reading only, through .prose-body: the
 * franchising education prose, the eighteen articles, and the two legal
 * documents.
 *
 *   IT SURVIVED THE CHANGE OF PAIRING, AND THAT WAS THE DECISION MOST WORTH
 *   GETTING RIGHT. The import has no reading face at all and sets four thousand
 *   word articles in the same grotesque as its buttons. The articles are the
 *   longest continuous reading on this property and the audience for them is a
 *   prospect's attorney and accountant. Barlow is a UI grotesque with a large
 *   x-height and tight apertures; it is a good interface face and a poor
 *   sustained reading face at that length. Source Serif 4 is drawn for exactly
 *   this and is already here.
 *
 *   It no longer shares a superfamily with the sans, which was the original
 *   reason for choosing it. What replaces that argument is a plainer one: a
 *   condensed gothic for structure, a grotesque for interface, and a
 *   transitional serif for reading is the stack trade and technical publishing
 *   has used for a century, and the three do not compete because they are never
 *   asked to do each other's job.
 *
 * PRELOADING. The display face and the body sans are preloaded. The serif is
 * not, because it appears only inside a reading column that is always below the
 * fold, and preloading it on /contact would spend bandwidth on a face that
 * route never renders.
 *
 *   THE DISPLAY FACE'S PRELOAD WAS TESTED AND KEPT, AND THE TEST IS WORTH
 *   RECORDING BECAUSE THE FIRST ANSWER WAS WRONG. It is 58KB, and preloading it
 *   puts that 58KB in contention with the HTML, the CSS and the body face on a
 *   throttled connection. Dropping the preload did buy real time:
 *
 *                       preloaded      not preloaded
 *     home              LCP 2.77s      LCP 2.41s      3 runs, medians
 *     franchising       LCP 2.71s      LCP 2.70s      unchanged
 *     article           LCP 3.22s      LCP 3.22s      unchanged
 *
 *   On that evidence the preload was removed. It was then put back, because the
 *   measurement was incomplete. Without the preload the face arrives after more
 *   of the page has been laid out, and the swap starts moving things:
 *
 *                       preloaded      not preloaded
 *     home              CLS 0.000      CLS 0.047      5 runs, identical each time
 *     brand detail      CLS 0.000      CLS 0.030      5 runs, identical each time
 *
 *   So the trade is 0.36s of Lighthouse LCP against 0.047 of layout shift, and
 *   it is not a close call. The LCP figure is Lantern's simulation of a slow
 *   connection; under throttling actually applied, the home page LCP element
 *   paints at 856ms in both configurations. The shift is real in both. A reader
 *   does not experience a simulated second, and does experience a heading
 *   jumping under their thumb.
 *
 *   WHAT THAT 0.047 ACTUALLY IS, because the first explanation was wrong. It is
 *   the h1 reflowing: with the real face late, the home page lead paragraph
 *   moves from y=485 to y=444, so the headline lost a line when the display
 *   face arrived. A metric matched fallback matches AVERAGE CHARACTER WIDTH. It
 *   cannot guarantee that a balanced headline breaks across the same number of
 *   lines in both faces, and at a 16ch measure a small per-character difference
 *   is a whole line.
 *
 *   So the preload is the primary defence and the fallback is the backstop, not
 *   the other way round. Neutralising the fallback's size-adjust and rerunning
 *   the no-preload case changes CLS not at all, which is the evidence for that
 *   split. The fallback is verified applied by a separate measurement: with the
 *   webfonts blocked it sets a reference string at 1287px where plain Arial
 *   sets it at 2229px. It is doing its job. Its job is simply narrower than
 *   "no shift".
 *
 * CLS. All three take `display: "swap"`. Barlow and Source Serif 4 get their
 * metric matched fallback from `adjustFontFallback`, which is on by default.
 * The display face does not, because next/font has no metrics for it, so its
 * fallback is declared by hand in globals.css from measurements taken by
 * `npm run font-metrics`. That is the mechanism that keeps the swap from moving
 * the page, and it is verified rather than assumed: `npm run lighthouse`
 * records CLS for each of the ten templates it can score.
 *
 * All three are declared under *-family names that differ from the Tailwind
 * theme keys in globals.css. Matching the names would create a
 * self-referential custom property, which resolves to invalid and silently
 * drops the face to a system fallback with no error anywhere.
 */
const display = Big_Shoulders({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-display-family",
  display: "swap",
});

const sans = Barlow({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-sans-family",
  display: "swap",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif-family",
  display: "swap",
  preload: false,
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
   * All of these are composed from the delivered mark by
   * scripts/brand-assets.mjs. The set is: a 32px PNG for the tab, a 512px PNG
   * for home screens and app switchers, a 180px apple touch icon because iOS
   * downsamples a 512 badly when it is asked to, and favicon.ico at the root
   * for the many clients that request it without reading these tags at all.
   */
  icons: {
    icon: [
      { url: getImageSlot("app-icon").src as string, sizes: "512x512", type: "image/png" },
      { url: "/brand/craftline-icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/brand/craftline-icon-180.png", sizes: "180x180", type: "image/png" },
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

/**
 * Viewport, which is a separate export from metadata and must stay that way.
 *
 * `viewportFit: "cover"` is what puts the page under the notch and the home
 * indicator on a modern phone, and it is the half of safe area handling that
 * lives here. The other half is the padding: once the page extends into those
 * regions, anything anchored to an edge has to inset itself with
 * env(safe-area-inset-*) or it sits under the hardware. See the .pb-safe and
 * .pt-safe helpers in globals.css and the mobile menu that uses them.
 *
 * `themeColor` white, matching the page. On Android Chrome it paints the
 * address bar, and in a standalone window it paints the status bar area; any
 * other value produces a visible band above a white site. It is declared for
 * both colour schemes on purpose. The site has no dark mode, so a device in
 * dark mode must still get white here rather than a browser chosen dark.
 *
 * `maximumScale` and `userScalable` are deliberately NOT set. Blocking pinch
 * zoom is the single most common accessibility failure on a phone, and nothing
 * about this layout needs it.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#ffffff" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${serif.variable}`}
    >
      <body className="text-graphite flex min-h-screen flex-col bg-white">
        {/*
          First focusable element on the page. The header nav is short, but a
          keyboard user still should not have to walk it on every route.
        */}
        <a
          href="#main"
          className="focus:bg-graphite sr-only text-sm font-semibold focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:px-4 focus:py-3 focus:text-white"
        >
          Skip to content
        </a>

        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <MobileCtaSpacer />
        <MobileCta />

        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />

        <Analytics />
      </body>
    </html>
  );
}
