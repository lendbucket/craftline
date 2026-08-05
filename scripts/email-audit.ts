#!/usr/bin/env tsx
/**
 * EMAIL AUDIT
 * ===========
 *
 *   npm run email-audit
 *
 * Builds every message this codebase can send and holds it to the same
 * standards the pages are held to.
 *
 * WHY THIS EXISTS
 * ---------------
 * Every other audit in this suite drives a server and reads what it sends.
 * Email has no server to drive: the only way to see one of these messages is to
 * build it. Without this, email copy is the one surface that never goes through
 * the constraint check, the link check, or the legal gates, on the medium where
 * a wrong link is indistinguishable from a phishing attempt and a wrong
 * disclaimer is a franchise offer.
 *
 * The messages are auditable because each one is a pure builder in
 * src/lib/email-templates.ts returning the exact payload handed to Resend.
 * Asserting on that object is asserting on what leaves the server.
 *
 * Ported from the Wattsmith repository's email-audit, adapted to this
 * property's rules: the franchise gates replace the trade licence checks, and
 * the logo host assertion replaces the phone number assertion.
 */
import {
  EMAIL_BUILDERS,
  EMAIL_LOGO_URL,
  type EmailPayload,
} from "../src/lib/email-templates";
import { COMPANY, SITE_URL, FRANCHISE_DISCLAIMER } from "../src/config/company";

type Failure = { message: string; rule: string };
const failures: Failure[] = [];
const fail = (rule: string, message: string) => failures.push({ rule, message });

/** Strips tags so prose rules see what a reader sees, not the markup. */
const visibleText = (html: string) =>
  html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&middot;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

/* -------------------------------------------------------------------------- */
/* The rules                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * House style, identical to the constraint check run over rendered pages. Mail
 * is not exempt from it: an em dash in an email is the same tell as an em dash
 * on a page.
 */
const PROSE_RULES: [string, RegExp][] = [
  ["em dash", /—/],
  ["en dash", /–/],
  ["other long dash", /[‒―−]/],
  ["hyphen used as a connector", /\s-\s/],
  ["emoji", /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u],
  [
    "AI cliche phrasing",
    /\b(delve|leverage|seamless|cutting[- ]edge|unlock the|elevate your|reach out|excited to|thrilled|we're passionate|best[- ]in[- ]class|world[- ]class|next level|touch base|circle back)\b/i,
  ],
];

/**
 * The franchise gates, applied to mail.
 *
 * These are the same prohibitions the pages carry. The confirmation email is
 * the highest risk surface on the property for them: it is a reply from a
 * franchisor to somebody who just expressed interest, which is exactly the
 * context in which a reader infers that something has been offered.
 */
const LEGAL_RULES: [string, RegExp][] = [
  [
    "financial performance representation",
    /\b(revenue|profit|earnings|ROI|payback|return on investment|you will earn|projected)\b/i,
  ],
  ["fee or capital figure", /\$\s?[\d,]+|\b\d+\s?% (royalty|fee)/i],
  [
    "offer or acceptance language",
    /\b(your application|you have been (approved|accepted)|congratulations|reserve your|secure your|territory is available|award(ed)? (you|a) franchise)\b/i,
  ],
  ["the banned phrase", /first territory/i],
];

function auditMessage(name: string, payload: EmailPayload) {
  const prose = `${payload.subject} ${visibleText(payload.html)} ${payload.text}`;

  for (const [rule, re] of PROSE_RULES) {
    const hit = prose.match(re);
    if (hit) fail(rule, `${name}: ${rule} -> ${JSON.stringify(hit[0])}`);
  }

  /*
    WHO IS SPEAKING DECIDES WHICH LEGAL RULES APPLY, and the distinction is
    real rather than a convenience.

    A CONFIRMATION is Craftline speaking to a prospect. Every gate applies:
    nothing in it may state a figure, because a figure in a franchisor's reply
    to an inquiry is a representation.

    A NOTIFICATION is the submitter's own words being relayed to the operator,
    and it necessarily contains whatever they selected, including the liquid
    capital bracket the form asks for. Flagging that would be flagging the
    inquirer for answering a question they were asked, and suppressing it would
    mean the operator reads an inquiry with fields silently missing.

    So notifications are exempt from the figure rule ONLY. Every other gate,
    including offer language and the banned phrase, still applies to them,
    because those would be Craftline's words rather than the submitter's.
  */
  const isNotification = name.endsWith("Notification");
  for (const [rule, re] of LEGAL_RULES) {
    if (isNotification && rule === "fee or capital figure") continue;
    const hit = prose.match(re);
    if (hit) fail(rule, `${name}: ${rule} -> ${JSON.stringify(hit[0])}`);
  }

  /* LINKS. Every href absolute and on the company host. A relative URL cannot
     resolve in a mail client, and a preview or localhost host in a real send
     is both broken and revealing. */
  const hrefs = [...payload.html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  for (const href of hrefs) {
    if (href.startsWith("mailto:")) continue;
    if (!href.startsWith("https://")) {
      fail("link not absolute https", `${name}: ${href}`);
      continue;
    }
    if (!href.startsWith(SITE_URL)) {
      fail("link off the company host", `${name}: ${href}`);
    }
  }

  /* IMAGES. Absolute, on the company host, and carrying alt text. A mail
     client that blocks images shows the alt, and a logo with an empty alt
     shows nothing at all. */
  const imgs = [...payload.html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  if (imgs.length === 0) {
    fail("no logo", `${name}: the message carries no image, so it has no mark`);
  }
  for (const img of imgs) {
    const src = img.match(/src="([^"]+)"/)?.[1] ?? "";
    const alt = img.match(/alt="([^"]*)"/)?.[1];
    if (!src.startsWith(`${SITE_URL}/`)) {
      fail("image not on the company host", `${name}: ${src}`);
    }
    if (alt === undefined || alt.trim() === "") {
      fail("image without alt text", `${name}: ${src}`);
    }
  }

  /* THE MARK. Must be the delivered lockup, on the production host. */
  if (!payload.html.includes(EMAIL_LOGO_URL)) {
    fail("logo missing", `${name}: does not carry ${EMAIL_LOGO_URL}`);
  }
  if (!EMAIL_LOGO_URL.startsWith("https://") || !EMAIL_LOGO_URL.includes(COMPANY.domain)) {
    fail("logo host", `logo URL is not absolute on ${COMPANY.domain}: ${EMAIL_LOGO_URL}`);
  }

  /* WHITE BACKGROUND behind the mark. It is an owner rule and the delivered
     artwork has no alpha, so the cell carrying it must paint white. */
  if (!/background-color:#ffffff;?"[^>]*>\s*<img/i.test(payload.html.replace(/\n/g, ""))) {
    const headerCell = payload.html.match(/<td[^>]*>\s*<img[^>]*>/i)?.[0] ?? "";
    if (!headerCell.includes("#ffffff")) {
      fail(
        "logo not on white",
        `${name}: the cell carrying the mark does not set a white background`,
      );
    }
  }

  /* STRUCTURE. A usable text part, a subject, and a recipient. */
  if (!payload.text || payload.text.trim().length < 40) {
    fail("thin text part", `${name}: text part is missing or too short to be usable`);
  }
  if (!payload.subject || payload.subject.trim().length === 0) {
    fail("no subject", name);
  }
  if (!payload.to?.length || payload.to.some((t) => !t.includes("@"))) {
    fail("bad recipient", `${name}: ${JSON.stringify(payload.to)}`);
  }

  return { hrefs: hrefs.length, imgs: imgs.length };
}

/* -------------------------------------------------------------------------- */
/* Run                                                                        */
/* -------------------------------------------------------------------------- */

console.log("Building every outbound message...\n");

const rows: string[] = [];
for (const [name, build] of Object.entries(EMAIL_BUILDERS)) {
  const payload = build();
  const stats = auditMessage(name, payload);
  rows.push(
    `  ${name.padEnd(24)} subject=${JSON.stringify(payload.subject).padEnd(46)} links=${stats.hrefs} images=${stats.imgs}`,
  );
}
console.log(rows.join("\n"));

/* The franchise confirmation carries the disclaimer verbatim. This is the one
   assertion in this file that exists for a legal reason rather than a quality
   one, and it is checked against the config string rather than a copy. */
const franchiseConfirmation = EMAIL_BUILDERS.franchiseConfirmation();
for (const part of ["html", "text"] as const) {
  const body =
    part === "html" ? visibleText(franchiseConfirmation.html) : franchiseConfirmation.text;
  if (!body.includes(FRANCHISE_DISCLAIMER)) {
    fail(
      "disclaimer missing",
      `franchiseConfirmation: FRANCHISE_DISCLAIMER not present verbatim in the ${part} part`,
    );
  }
}

/* Both notifications must reach the operator, and both confirmations must
   reach the person who wrote in. A swap here sends somebody else's details to
   the wrong inbox, which no page level audit would ever catch. */
const notificationTargets = [
  EMAIL_BUILDERS.franchiseNotification(),
  EMAIL_BUILDERS.contactNotification(),
];
for (const payload of notificationTargets) {
  if (payload.to.includes("probe@example-domain.test")) {
    fail(
      "notification addressed to the submitter",
      `a notification is going to the person who submitted, not to the operator: ${payload.to.join(", ")}`,
    );
  }
}
const confirmationTargets = [
  EMAIL_BUILDERS.franchiseConfirmation(),
  EMAIL_BUILDERS.contactConfirmation(),
];
for (const payload of confirmationTargets) {
  if (!payload.to.includes("probe@example-domain.test")) {
    fail(
      "confirmation not addressed to the submitter",
      `a confirmation is not going to the person who submitted: ${payload.to.join(", ")}`,
    );
  }
}

console.log("\n================ RESULT ================");
if (failures.length) {
  console.log(`${failures.length} failure(s):`);
  for (const f of failures) console.log(`  [${f.rule}] ${f.message}`);
  process.exitCode = 1;
} else {
  console.log(
    `ALL GREEN. ${Object.keys(EMAIL_BUILDERS).length} message(s): house style clean, every link and image absolute on ${COMPANY.domain}, the mark present on white with alt text, the disclaimer verbatim in the franchise confirmation, and every message addressed to the right party.`,
  );
}
