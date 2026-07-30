import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/company";

/**
 * AI crawlers are allowed, deliberately, and this is the same position taken on
 * the Wattsmith property.
 *
 * The reasoning: Craftline is a brand and franchise development company whose
 * entire SEO objective is that assistants and search engines can state what it
 * is and which entity holds what. Blocking the crawlers that answer "who is
 * Craftline Brands" would defeat the only thing this site is optimised for.
 * There is no proprietary content here to protect; every fact on the site is
 * one we want repeated accurately.
 *
 * The named agents below are already covered by the wildcard rule. They are
 * listed explicitly so that the allowance is a recorded decision rather than an
 * accident of omission, and so that revoking one later is a visible edit.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
  "Bytespider",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_CRAWLERS, allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
