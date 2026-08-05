import { SITE_URL, COMPANY, FRANCHISE_DISCLAIMER } from "@/config/company";
import { NOTIFICATION_RECIPIENT, NOTIFICATION_SENDER } from "@/config/notifications";

/**
 * OUTBOUND EMAIL
 * ==============
 *
 * Every message this codebase can send, built by a pure function that returns
 * the exact payload handed to Resend. Nothing composes mail anywhere else.
 *
 * THAT SHAPE IS WHAT MAKES THEM AUDITABLE. Email has no server to drive and no
 * page to load, so the only way to hold a message to the same standard as a
 * page is to build it and assert on the result. scripts/email-audit.ts imports
 * these builders directly, which means it is asserting on precisely what leaves
 * the server rather than on a copy that can drift.
 *
 * FOUR MESSAGES, TWO KINDS
 * ------------------------
 *   Notifications go to the operator and exist so a person knows to read a
 *   stored row. They are complete and plain: every field, no persuasion.
 *
 *   Confirmations go to the person who wrote in. They exist so somebody who
 *   typed their details into a form knows it arrived and knows what happens
 *   next. They carry NO marketing copy, no next step they did not ask for, and
 *   no invitation to do anything further. A confirmation that sells is a
 *   confirmation nobody trusts.
 *
 * THE LEGAL GATES APPLY TO MAIL EXACTLY AS THEY APPLY TO PAGES. No fee, no
 * royalty, no capital figure, no earnings, no projection, and nothing that
 * reads as an offer or an acceptance. The franchise confirmation carries
 * FRANCHISE_DISCLAIMER verbatim, because an email acknowledging a franchise
 * inquiry is exactly where a reader might otherwise infer that something has
 * been offered to them.
 *
 * MAIL CLIENT CONSTRAINTS THAT DRIVE THE MARKUP
 * ---------------------------------------------
 * Tables for layout, inline styles only, no external stylesheet, no webfont.
 * Outlook ignores most of modern CSS and Gmail strips <style> in several
 * contexts, so anything that must render is expressed as an attribute or an
 * inline style on the element that needs it.
 */

/* -------------------------------------------------------------------------- */
/* Shared pieces                                                              */
/* -------------------------------------------------------------------------- */

/**
 * The mark, as an absolute URL on the production host.
 *
 * It MUST be absolute and it MUST be this host. A relative path cannot resolve
 * in a mail client, and a preview or localhost URL either fails to load or, if
 * it does load, tells the recipient something true and embarrassing about where
 * the message came from. The email audit asserts both.
 *
 * White background is the owner rule for this mark and it is also the only
 * thing that works here: the delivered PNG has no alpha, and mail clients in
 * dark mode composite unpredictably, so the surrounding cell is painted white
 * rather than left to the client.
 */
export const EMAIL_LOGO_URL = `${SITE_URL}/brand/craftline-logo.png`;

/**
 * Declared, not loaded. Mail clients strip @font-face, so naming a face here
 * means a recipient who already has it renders in it and everybody else lands
 * on a sensible platform default rather than on Times.
 */
const FONT_STACK =
  "'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/** Mirrored from globals.css. Raster mail cannot read a custom property. */
const GRAPHITE = "#14191c";
const STEEL = "#5a6569";
const LINE = "#e3e6e9";

export type EmailPayload = {
  from: string;
  to: string[];
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
};

/** Escapes user supplied values before they reach the HTML part. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type Field = [label: string, value: string | null];

/** Drops fields nobody filled in. An empty row tells the reader nothing. */
const present = (fields: Field[]) =>
  fields.filter(([, value]) => value !== null && value !== "") as [string, string][];

/**
 * The document shell: white page, centred card, the mark in a header band, and
 * a footer rule. `preheader` is the line a client shows beside the subject in
 * an inbox list; left unset it shows whatever the first text happens to be.
 */
function shell({
  preheader,
  heading,
  intro,
  body,
  footer,
}: {
  preheader: string;
  heading: string;
  intro?: string;
  body: string;
  footer: string;
}): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f6f7;">
<div style="display:none;font-size:1px;color:#f5f6f7;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(preheader)}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f5f6f7;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:100%;background-color:#ffffff;border:1px solid ${LINE};border-radius:8px;">
        <tr>
          <td align="left" style="padding:28px 32px 24px 32px;border-bottom:1px solid ${LINE};background-color:#ffffff;">
            <img src="${EMAIL_LOGO_URL}" width="180" height="69" alt="${escapeHtml(COMPANY.name)}" style="display:block;border:0;outline:none;text-decoration:none;width:180px;height:auto;">
          </td>
        </tr>
        <tr>
          <td style="padding:32px;font-family:${FONT_STACK};">
            <h1 style="margin:0;font-size:20px;line-height:1.3;font-weight:600;color:${GRAPHITE};">${escapeHtml(heading)}</h1>
            ${intro ? `<p style="margin:16px 0 0 0;font-size:15px;line-height:1.6;color:${STEEL};">${intro}</p>` : ""}
            ${body}
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 28px 32px;border-top:1px solid ${LINE};font-family:${FONT_STACK};">
            ${footer}
          </td>
        </tr>
      </table>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:100%;">
        <tr>
          <td style="padding:16px 8px;font-family:${FONT_STACK};font-size:12px;line-height:1.5;color:${STEEL};">
            ${escapeHtml(COMPANY.name)} &middot; <a href="${SITE_URL}/" style="color:${STEEL};text-decoration:underline;">${escapeHtml(COMPANY.domain)}</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

/** A definition table of the submitted fields. Used by both notifications. */
function fieldTable(fields: [string, string][]): string {
  const rows = fields
    .map(
      ([label, value]) => `
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid ${LINE};font-family:${FONT_STACK};font-size:13px;font-weight:600;color:${GRAPHITE};width:170px;vertical-align:top;">${escapeHtml(label)}</td>
              <td style="padding:10px 0 10px 16px;border-bottom:1px solid ${LINE};font-family:${FONT_STACK};font-size:14px;line-height:1.6;color:${GRAPHITE};vertical-align:top;">${escapeHtml(value).replace(/\n/g, "<br>")}</td>
            </tr>`,
    )
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:20px;">${rows}
          </table>`;
}

const textFields = (fields: [string, string][]) =>
  fields.map(([label, value]) => `${label}: ${value}`).join("\n");

const senderOrThrow = () => NOTIFICATION_SENDER;

/* -------------------------------------------------------------------------- */
/* Notifications, to the operator                                             */
/* -------------------------------------------------------------------------- */

export function buildFranchiseNotification(input: {
  name: string;
  email: string;
  phone: string | null;
  city: string;
  state: string;
  capital: string | null;
  timeline: string | null;
  veteran: string | null;
  message: string | null;
}): EmailPayload {
  const fields = present([
    ["Name", input.name],
    ["Email", input.email],
    ["Phone", input.phone],
    ["City of interest", input.city],
    ["State of interest", input.state],
    ["Liquid capital", input.capital],
    ["Timeline", input.timeline],
    ["Military veteran", input.veteran],
    ["Message", input.message],
  ]);

  return {
    from: senderOrThrow(),
    to: [NOTIFICATION_RECIPIENT],
    /*
      Replying goes straight to the person who wrote in rather than to the
      sending domain, which nobody monitors.
    */
    replyTo: input.email,
    subject: `Franchise inquiry: ${input.name}, ${input.city}, ${input.state}`,
    html: shell({
      preheader: `Franchise inquiry from ${input.name}`,
      heading: "New franchise inquiry",
      intro: "Submitted through the franchising page and stored. Reply to this message to reach the sender directly.",
      body: fieldTable(fields),
      footer: `<p style="margin:0;font-size:12px;line-height:1.6;color:${STEEL};">Operator notification. This message was generated by the inquiry form at ${escapeHtml(COMPANY.domain)}.</p>`,
    }),
    text: `New franchise inquiry\n\nSubmitted through the franchising page and stored.\n\n${textFields(fields)}\n\nReply to this message to reach the sender directly.`,
  };
}

export function buildContactNotification(input: {
  name: string;
  email: string;
  phone: string | null;
  message: string;
}): EmailPayload {
  const fields = present([
    ["Name", input.name],
    ["Email", input.email],
    ["Phone", input.phone],
    ["Message", input.message],
  ]);

  return {
    from: senderOrThrow(),
    to: [NOTIFICATION_RECIPIENT],
    replyTo: input.email,
    subject: `Contact message: ${input.name}`,
    html: shell({
      preheader: `Contact message from ${input.name}`,
      heading: "New contact message",
      intro: "Submitted through the contact page and stored. Reply to this message to reach the sender directly.",
      body: fieldTable(fields),
      footer: `<p style="margin:0;font-size:12px;line-height:1.6;color:${STEEL};">Operator notification. This message was generated by the contact form at ${escapeHtml(COMPANY.domain)}.</p>`,
    }),
    text: `New contact message\n\nSubmitted through the contact page and stored.\n\n${textFields(fields)}\n\nReply to this message to reach the sender directly.`,
  };
}

/* -------------------------------------------------------------------------- */
/* Confirmations, to the person who wrote in                                  */
/* -------------------------------------------------------------------------- */

/**
 * Franchise inquiry confirmation.
 *
 * READ THE DISCLAIMER NOTE BEFORE EDITING. This is the single highest risk
 * message this codebase sends. Somebody has just submitted a franchise inquiry
 * and is receiving a reply from the franchisor; that is precisely the context in
 * which a reader could infer that something has been offered to them. So the
 * message says what was received, says what happens next in the plainest
 * possible terms, and carries FRANCHISE_DISCLAIMER verbatim.
 *
 * It contains no link to the franchising page, no suggested reading, and no
 * call to action of any kind. Those would all be marketing in a message whose
 * entire job is to acknowledge receipt.
 */
export function buildFranchiseConfirmation(input: {
  name: string;
  email: string;
}): EmailPayload {
  const firstName = input.name.split(/\s+/)[0] || input.name;

  return {
    from: senderOrThrow(),
    to: [input.email],
    replyTo: NOTIFICATION_RECIPIENT,
    subject: `We received your inquiry, ${firstName}`,
    html: shell({
      preheader: "Your franchise inquiry has been received.",
      heading: "Your inquiry has been received",
      intro: `Thank you, ${escapeHtml(firstName)}. Your franchise inquiry reached ${escapeHtml(COMPANY.name)} and a person will read it.`,
      body: `<p style="margin:20px 0 0 0;font-family:${FONT_STACK};font-size:15px;line-height:1.7;color:${GRAPHITE};">You will receive a reply from someone who can answer questions. If what you are looking for is not what ${escapeHtml(COMPANY.name)} is building, you will be told that plainly rather than pursued.</p>
            <p style="margin:16px 0 0 0;font-family:${FONT_STACK};font-size:15px;line-height:1.7;color:${GRAPHITE};">Submitting the form commits you to nothing and reserves nothing. You may reply to this message at any time.</p>`,
      footer: `<p style="margin:0;font-family:${FONT_STACK};font-size:12px;line-height:1.6;color:${STEEL};">${escapeHtml(FRANCHISE_DISCLAIMER)}</p>`,
    }),
    text: `Your inquiry has been received\n\nThank you, ${firstName}. Your franchise inquiry reached ${COMPANY.name} and a person will read it.\n\nYou will receive a reply from someone who can answer questions. If what you are looking for is not what ${COMPANY.name} is building, you will be told that plainly rather than pursued.\n\nSubmitting the form commits you to nothing and reserves nothing. You may reply to this message at any time.\n\n${FRANCHISE_DISCLAIMER}`,
  };
}

/** Contact confirmation. Same restraint, and no disclaimer: not a franchise context. */
export function buildContactConfirmation(input: {
  name: string;
  email: string;
}): EmailPayload {
  const firstName = input.name.split(/\s+/)[0] || input.name;

  return {
    from: senderOrThrow(),
    to: [input.email],
    replyTo: NOTIFICATION_RECIPIENT,
    subject: `We received your message, ${firstName}`,
    html: shell({
      preheader: "Your message has been received.",
      heading: "Your message has been received",
      intro: `Thank you, ${escapeHtml(firstName)}. Your message reached ${escapeHtml(COMPANY.name)} and a person will read it.`,
      body: `<p style="margin:20px 0 0 0;font-family:${FONT_STACK};font-size:15px;line-height:1.7;color:${GRAPHITE};">You will receive a reply directly. If you wrote about electrical service rather than about ${escapeHtml(COMPANY.name)}, your message will be pointed to the right place.</p>`,
      footer: `<p style="margin:0;font-family:${FONT_STACK};font-size:12px;line-height:1.6;color:${STEEL};">${escapeHtml(COMPANY.name)} does not perform electrical work and does not take service calls.</p>`,
    }),
    text: `Your message has been received\n\nThank you, ${firstName}. Your message reached ${COMPANY.name} and a person will read it.\n\nYou will receive a reply directly. If you wrote about electrical service rather than about ${COMPANY.name}, your message will be pointed to the right place.\n\n${COMPANY.name} does not perform electrical work and does not take service calls.`,
  };
}

/** Everything the audit enumerates. Add a message here or it is not covered. */
export const EMAIL_BUILDERS = {
  franchiseNotification: () =>
    buildFranchiseNotification({
      name: "Audit Probe",
      email: "probe@example-domain.test",
      phone: "210 555 0100",
      city: "Kansas City",
      state: "Kansas",
      capital: "$50,000 to $150,000",
      timeline: "3 to 6 months",
      veteran: "Yes",
      message: "Interested in learning more about the programme.",
    }),
  contactNotification: () =>
    buildContactNotification({
      name: "Audit Probe",
      email: "probe@example-domain.test",
      phone: null,
      message: "A question about the company.",
    }),
  franchiseConfirmation: () =>
    buildFranchiseConfirmation({
      name: "Audit Probe",
      email: "probe@example-domain.test",
    }),
  contactConfirmation: () =>
    buildContactConfirmation({
      name: "Audit Probe",
      email: "probe@example-domain.test",
    }),
} as const;
