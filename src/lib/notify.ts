import "server-only";
import {
  NOTIFICATION_RECIPIENT,
  NOTIFICATION_SENDER,
  RESEND_ENDPOINT,
} from "@/config/notifications";

/**
 * Notification email on a stored submission.
 *
 * Uses Resend's REST endpoint through fetch rather than the SDK. Two reasons:
 * one fewer dependency in a project that has almost none, and the endpoint is
 * overridable, which is what lets the forms audit assert that exactly one
 * notification was issued without holding a real API key or sending real mail.
 *
 * SENDING IS NOT PART OF SUCCESS. The caller stores the row first and treats
 * that as the outcome. If the notification fails, the submission still happened
 * and the person who sent it is told it happened, because it did. Reporting a
 * failure at that point would be a lie that also invites a duplicate
 * submission. A failed send is an operations problem, logged here, and the row
 * is still in the table to be found.
 */

/** Plain text only. Nothing here needs HTML, and text cannot render markup. */
export async function sendNotification({
  subject,
  body,
}: {
  subject: string;
  body: string;
}): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey || !NOTIFICATION_SENDER) {
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
        from: NOTIFICATION_SENDER,
        to: [NOTIFICATION_RECIPIENT],
        subject,
        text: body,
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

/** Renders a submission as readable lines. Omits fields nobody filled in. */
export function formatSubmission(fields: [string, string | null][]): string {
  return fields
    .filter(([, value]) => value !== null && value !== "")
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}
