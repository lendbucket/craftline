import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service role Supabase client.
 *
 * `import "server-only"` at the top is not decoration. It makes the build fail
 * if this module is ever pulled into a client component, which is the single
 * mistake that would leak a key capable of reading and writing every row in the
 * shared project. A comment asking people not to do that would not fail a build.
 *
 * NEITHER ENV VAR IS PREFIXED NEXT_PUBLIC_, and neither ever may be. The
 * prefix is what tells Next.js to inline a value into the browser bundle, so
 * NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY would publish the key to every visitor.
 *
 * This writes into the Wattsmith project, which holds that brand's leads,
 * applicants, offers, and onboarding rows alongside the two Craftline tables.
 * A service role key bypasses RLS entirely, so it can reach all of them. That
 * is the reason inserts are confined to the two table names in
 * src/config/notifications.ts and this client is never handed to anything that
 * takes a table name from user input.
 */

/** Null when the project is not configured, so callers handle it explicitly. */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  // Both or neither. A half configured project is a misconfiguration, and
  // guessing at it would produce a confusing runtime error later instead of a
  // clean failure now.
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      // No session to persist and no token to refresh: this is a stateless
      // server side client, and leaving these on makes it try to use storage
      // that does not exist in this environment.
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
