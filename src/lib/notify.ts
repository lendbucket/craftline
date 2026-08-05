import "server-only";
import { RESEND_ENDPOINT } from "@/config/notifications";
import type { EmailPayload } from "@/lib/email-templates";

/**
 * Outbound mail.
 *
 * Uses Resend's REST endpoint through fetch rather than the SDK. Two reasons:
 * one fewer dependency in a project that has almost none, and the endpoint is
 * overridable, which is what lets the forms audit assert exactly how many
 * messages were issued without holding a real API key or sending real mail.
 *
 * SENDING IS NOT PART OF SUCCESS. The caller stores the row first and treats
 * that as the outcome. If a message fails, the submission still happened and
 * the person who sent it is told it happened, because it did. Reporting a
 * failure at that point would be a lie that also invites a duplicate
 * submission. A failed send is an operations problem, logged here, and the row
 * is still in the table to be found.
 *
 * The payload is built by src/lib/email-templates.ts and passed through
 * untouched. Nothing composes mail in this file, which is what lets the email
 * audit assert on the same object that reaches the wire.
 */
export async function sendEmail(
  payload: EmailPayload,
): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey || !payload.from) {
    return {
      sent: false,
      reason: "Resend is not configured (missing API key or sender address).",
    };
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: payload.from,
        to: payload.to,
        ...(payload.replyTo ? { reply_to: payload.replyTo } : {}),
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      }),
      // A hanging mail provider must not hold the submitter's request open.
      // The row is already stored by the time this runs.
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      return {
        sent: false,
        reason: `Resend responded ${response.status}. ${detail.slice(0, 200)}`,
      };
    }

    return { sent: true };
  } catch (error) {
    return { sent: false, reason: (error as Error).message };
  }
}
