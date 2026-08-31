import { llmsFullTxt } from "@/lib/llms";

/**
 * /llms-full.txt
 *
 * The long form: everything in /llms.txt, plus the support model, the operator
 * profile, the inquiry process, the questions and answers, and the full text
 * of every article. Generated from the same exports for the same reason.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsFullTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
