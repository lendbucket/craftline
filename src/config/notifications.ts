/**
 * Where inquiry notifications go.
 *
 * No Craftline mailbox exists yet, so notifications route to the Wattsmith
 * address in the interim. That is a deliberate stopgap and it is isolated here
 * so that switching it is a one line edit rather than a search across route
 * handlers.
 *
 * WHEN THE CRAFTLINE MAILBOX EXISTS, change NOTIFICATION_RECIPIENT below and
 * nothing else. Note that this is separate from NEXT_PUBLIC_CONTACT_EMAIL,
 * which is the address rendered publicly on the site. They are different
 * decisions: a published contact address is a commitment to the reader, and an
 * internal notification target is an operational detail. Do not couple them.
 */

/**
 * Interim recipient. Overridable by env so a deploy can be retargeted without a
 * code change, but the committed default is the operative value.
 */
export const NOTIFICATION_RECIPIENT =
  process.env.INQUIRY_TO_EMAIL?.trim() || "robert@wattsmithelectric.com";

/**
 * Sender. Must be a verified domain in the Resend account or the send is
 * rejected. There is no fallback default: an unset sender should fail loudly at
 * send time rather than silently attempt an address that was never verified.
 */
export const NOTIFICATION_SENDER = process.env.INQUIRY_FROM_EMAIL?.trim() || "";

/**
 * Resend's REST endpoint. Overridable so the forms audit can point the send at
 * a local stand-in and assert that exactly one notification was issued, without
 * either sending real mail or holding a real API key.
 */
export const RESEND_ENDPOINT =
  process.env.RESEND_API_URL?.trim() || "https://api.resend.com/emails";

/** Table names in the shared Supabase project. */
export const TABLES = {
  franchiseInquiries: "craftline_franchise_inquiries",
  contactMessages: "craftline_contact_messages",
} as const;
