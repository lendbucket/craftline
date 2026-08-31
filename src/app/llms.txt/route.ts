import { llmsTxt } from "@/lib/llms";

/**
 * /llms.txt
 *
 * A static route handler, not a file in public/. See src/lib/llms.ts for why
 * the content is generated: a hand written text file has nothing checking it
 * against the site, and this one is composed from the same config the pages
 * render from.
 *
 * force-static prerenders it at build time, so it is served as a static asset
 * with no function invocation, exactly like the sitemap.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
