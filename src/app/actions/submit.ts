"use server";

import { TABLES } from "@/config/notifications";
import { formatSubmission, sendNotification } from "@/lib/notify";
import { getSupabase } from "@/lib/supabase";
import { isEmail, isPhone, required } from "@/lib/validate";

/**
 * FORM SUBMISSION ACTIONS
 * =======================
 *
 * The only writes this site performs. Both follow the same shape:
 *
 *   1. Re-validate on the server. The browser already checked, and that check
 *      is a convenience for the person typing, not a control. Anything can post
 *      to a server action.
 *   2. Insert the row. If the insert fails, the caller is told it failed. There
 *      is no path through this file that reports success without a stored row,
 *      which is the property the forms audit exists to hold.
 *   3. Notify, and do not let the outcome of that change the answer. See
 *      lib/notify.ts for why a failed send is still a successful submission.
 *
 * The service role key bypasses RLS, so these tables are reachable only through
 * these two functions, with table names taken from config and never from input.
 */

export type SubmitResult = { ok: true } | { ok: false; message: string };

/**
 * Shown when storage fails. Deliberately plain, and deliberately not an
 * apology-shaped non answer: it says the message was not saved, so the person
 * knows the outcome rather than assuming the best.
 */
const STORAGE_FAILED =
  "Something went wrong and your message was not saved. Please try again in a moment.";

const NOT_CONFIGURED =
  "This form is temporarily unavailable and your message was not saved. Please try again later.";

const INVALID = "Please check the form and try again.";

/** Guards against a pasted novel. Generous enough that no real person hits it. */
const MAX = { short: 200, message: 5000 } as const;

function clean(value: unknown, limit: number): string {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

/**
 * The veteran question offers three answers and the column is a nullable
 * boolean, which maps exactly: yes is true, no is false, and both declining to
 * say and not answering are null. Null means "not stated" in both cases, which
 * is the truth. Do not coerce a decline to false.
 */
function veteranToBoolean(value: string): boolean | null {
  if (value === "Yes") return true;
  if (value === "No") return false;
  return null;
}

export async function submitContactMessage(input: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): Promise<SubmitResult> {
  const name = clean(input.name, MAX.short);
  const email = clean(input.email, MAX.short);
  const phone = clean(input.phone, MAX.short);
  const message = clean(input.message, MAX.message);

  if (!required(name) || !isEmail(email) || !required(message)) {
    return { ok: false, message: INVALID };
  }
  if (required(phone) && !isPhone(phone)) {
    return { ok: false, message: INVALID };
  }

  const supabase = getSupabase();
  if (!supabase) {
    console.error("[contact] Supabase is not configured; message not stored.");
    return { ok: false, message: NOT_CONFIGURED };
  }

  // `source` and `status` are left to their column defaults rather than set
  // here, so the database stays the one place those values are defined.
  const { error } = await supabase.from(TABLES.contactMessages).insert({
    name,
    email,
    phone: phone || null,
    message,
  });

  if (error) {
    console.error("[contact] insert failed:", error.message);
    return { ok: false, message: STORAGE_FAILED };
  }

  const notification = await sendNotification({
    subject: `Craftline contact message from ${name}`,
    body: formatSubmission([
      ["Name", name],
      ["Email", email],
      ["Phone", phone || null],
      ["Message", message],
    ]),
  });
  if (!notification.sent) {
    // Stored but not announced. Logged loudly; the submitter is still told the
    // truth, which is that their message was received.
    console.error("[contact] stored, notification failed:", notification.reason);
  }

  return { ok: true };
}

export async function submitFranchiseInquiry(input: {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  capital: string;
  timeline: string;
  veteran: string;
  message: string;
}): Promise<SubmitResult> {
  const name = clean(input.name, MAX.short);
  const email = clean(input.email, MAX.short);
  const phone = clean(input.phone, MAX.short);
  const city = clean(input.city, MAX.short);
  const state = clean(input.state, MAX.short);
  const capital = clean(input.capital, MAX.short);
  const timeline = clean(input.timeline, MAX.short);
  const veteran = clean(input.veteran, MAX.short);
  const message = clean(input.message, MAX.message);

  if (!required(name) || !isEmail(email) || !required(city) || !required(state)) {
    return { ok: false, message: INVALID };
  }
  if (!required(timeline)) return { ok: false, message: INVALID };
  if (required(phone) && !isPhone(phone)) {
    return { ok: false, message: INVALID };
  }

  const supabase = getSupabase();
  if (!supabase) {
    console.error("[franchise] Supabase is not configured; inquiry not stored.");
    return { ok: false, message: NOT_CONFIGURED };
  }

  const { error } = await supabase.from(TABLES.franchiseInquiries).insert({
    name,
    email,
    phone: phone || null,
    city_of_interest: city,
    state_of_interest: state,
    liquid_capital_bracket: capital || null,
    timeline: timeline || null,
    military_veteran: veteranToBoolean(veteran),
    message: message || null,
  });

  if (error) {
    console.error("[franchise] insert failed:", error.message);
    return { ok: false, message: STORAGE_FAILED };
  }

  const notification = await sendNotification({
    subject: `Craftline franchise inquiry from ${name}`,
    body: formatSubmission([
      ["Name", name],
      ["Email", email],
      ["Phone", phone || null],
      ["City of interest", city],
      ["State of interest", state],
      ["Liquid capital", capital || null],
      ["Timeline", timeline || null],
      ["Military veteran", veteran || null],
      ["Message", message || null],
    ]),
  });
  if (!notification.sent) {
    console.error("[franchise] stored, notification failed:", notification.reason);
  }

  return { ok: true };
}
