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
