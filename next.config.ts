import type { NextConfig } from "next";

// Security headers applied to every route. Mirrors the Wattsmith set so both
// properties harden the same way.
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    // Report-Only so it never breaks the live site while we tune it. Allows the
    // self-hosted next/font assets, inline JSON-LD, and hydration. There are no
    // third-party script origins on this property yet; add them here, not by
    // loosening a directive.
    key: "Content-Security-Policy-Report-Only",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline'",
      "connect-src 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,

  /**
   * THE STYLESHEET SHIPS IN THE HTML RATHER THAN AS A REQUEST.
   *
   * WHAT IT BUYS, MEASURED ON THE TWO REAL BUILDS. Both were built, served as
   * static files with brotli the way the CDN serves them, and driven under
   * 1.6 Mbps down with 150ms RTT applied through CDP. n=20 per arm, alternating
   * in blocks of five so machine drift cannot land on one side.
   *
   *                     link      inline    delta    95% CI
   *   home              818ms     536ms     -282ms   [-312, -264]
   *   franchising       800ms     550ms     -250ms   [-268, -238]
   *   article           792ms     500ms     -292ms   [-304, -280]
   *
   * FCP and LCP move together on this site, because the largest contentful
   * element is the headline and it paints in the first frame. Run to run spread
   * on the link arm was 40 to 80ms, so the effect is three to seven times the
   * noise and no interval is anywhere near zero.
   *
   * LIGHTHOUSE DISAGREES, AND IT IS WRONG HERE. Its Lantern simulation reports
   * LCP moving the other way on most templates, home 2.41s to 2.94s and
   * franchising 2.71s to 3.23s. Lantern models a larger HTML document as
   * delaying everything downstream and does not credit the eliminated round
   * trip the way a real connection does. It is a model, not a measurement, and
   * this is the second time in this build it has pointed the wrong way: it also
   * produced a false half second home regression at n=3 during the font work.
   * Every template stays under the 3.5s ceiling either way, so the audit floor
   * is green on both, and the decision was taken on the applied numbers.
   *
   * WHAT IT COSTS. The HTML grows 7.3 KB brotli per route and the 6.7 KB
   * stylesheet request disappears, so a first visit is marginally cheaper in
   * bytes as well as faster. A returning reader pays the 7.3 KB again on every
   * page, where today the stylesheet is cached immutably for a year, so a
   * three page session costs about 14.6 KB more than it does now. That trade
   * was taken deliberately: the audience for this property is people meeting
   * it for the first time.
   *
   * THIS FLAG IS EXPERIMENTAL. WHAT HAPPENS IF NEXT CHANGES IT, TESTED RATHER
   * THAN ASSUMED. Each case below was actually planted and built.
   *
   *   RENAMED, in either position. The build FAILS, loudly, at type check:
   *   "Object literal may only specify known properties, and 'inlineCss' does
   *   not exist in type 'ExperimentalConfig'". Both the outer key and the
   *   inner one are typed, so a rename cannot pass silently. Next also prints
   *   "Invalid next.config.ts options detected" before that. This is the safe
   *   failure and it needs nothing from us.
   *
   *   ACCEPTED BUT INERT. The key stays valid and the behaviour goes away,
   *   either deprecated to a no-op or defaulted off. THIS is the dangerous
   *   one: the build passes with no warning at all, every route quietly gets a
   *   render blocking link back, and the site is 330ms slower with nothing to
   *   say so. Planted by setting the flag to false: 27 routes reverted, the
   *   build was silent, and scripts/seo-audit.mjs failed. That assertion is
   *   the only thing standing between this flag and an invisible regression.
   *   Do not remove it when upgrading Next.
   *
   *   REMOVED because the behaviour became the default: nothing breaks and
   *   this block should be deleted.
   *
   *   NARROWED, for example to inline only above the fold rules: the site
   *   still renders. Every rule is in one Tailwind stylesheet and the cascade
   *   layers make ordering explicit, so a partial inline degrades to a flash
   *   of unstyled content rather than to a broken page.
   */
  experimental: {
    inlineCss: true,
  },
  images: {
    // AVIF first, WebP as the fallback, original format last. The first entry
    // the request's Accept header matches is the one served.
    formats: ["image/avif", "image/webp"],
    // Next 16 requires an explicit quality allowlist; anything not listed is
    // refused rather than silently honoured, so the optimiser cannot be made to
    // burn CPU on arbitrary values. 75 is the default and all we ask for.
    qualities: [75],
    // Optimised derivatives are immutable in practice: the sources only change
    // when a new file is committed, which changes the hashed path. 31 days.
    minimumCacheTTL: 2678400,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
