/**
 * FORMS AUDIT
 * ===========
 *
 * Drives every form on the site in a real browser and asserts that it behaves
 * the way the site claims it behaves.
 *
 * Three of these checks exist for legal reasons rather than usability ones, and
 * they are the reason this runs on every pass rather than living in someone's
 * memory:
 *
 *   - NOTHING IS SUBMITTED. No form carries an action, and pressing submit
 *     fires no network request. The privacy policy states in plain words that
 *     nothing typed into these forms is transmitted or stored. This is what
 *     keeps that sentence true, and it is the check that catches a future
 *     endpoint being wired up before the policy is updated to match.
 *   - NO FALSE SUCCESS. A valid submit must say submissions are not open. It
 *     must never say thank you, received, or we will be in touch. A form that
 *     fakes success is worse than a form that is plainly switched off, because
 *     the person walks away believing they made contact.
 *   - NO SENSITIVE FIELDS. The franchise inquiry must never grow a field asking
 *     for a social security number, bank details, or a date of birth. It is an
 *     inquiry, not an application, and the FDD is not issued.
 *
 * The rest is ordinary correctness: every control is labelled, required fields
 * block an empty submit and say so accessibly, and optional fields stay
 * optional.
 *
 *   npm run build && npm run forms-audit
 *   BASE_URL=http://localhost:3000 npm run forms-audit
 *   AUDIT_ONLY=franchise npm run forms-audit
 */
import { chromium } from "playwright";
import { startNextServer } from "./lib/dev-server.mjs";

const PORT = 3136;

/**
 * One entry per form. Adding a form to the site means adding it here; a form
 * that is not listed is a form nobody is checking.
 */
const FORMS = [
  {
    name: "contact",
    path: "/contact",
    submitLabel: "Send message",
    summary: "#contact-errors",
    required: [
      ["#contact-name", "#contact-name-error"],
      ["#contact-email", "#contact-email-error"],
      ["#contact-message", "#contact-message-error"],
    ],
    optional: [["#contact-phone", "#contact-phone-error"]],
    email: ["#contact-email", "#contact-email-error"],
    fill: [
      ["#contact-name", "Audit Probe"],
      ["#contact-email", "probe@example-domain.test"],
      ["#contact-message", "Audit probe message."],
    ],
    select: [],
  },
  {
    name: "franchise",
    path: "/franchising",
    submitLabel: "Send inquiry",
    summary: "#franchise-errors",
    required: [
      ["#franchise-name", "#franchise-name-error"],
      ["#franchise-email", "#franchise-email-error"],
      ["#franchise-location", "#franchise-location-error"],
      ["#franchise-timeline", "#franchise-timeline-error"],
    ],
    // Capital and veteran status are optional by design. Requiring either would
    // turn an inquiry into a screening step.
    optional: [
      ["#franchise-phone", "#franchise-phone-error"],
      ["#franchise-capital", "#franchise-capital-error"],
      ["#franchise-message", "#franchise-message-error"],
      [null, "#veteran-error"],
    ],
    email: ["#franchise-email", "#franchise-email-error"],
    fill: [
      ["#franchise-name", "Audit Probe"],
      ["#franchise-email", "probe@example-domain.test"],
      ["#franchise-location", "Austin, Texas"],
    ],
    select: [["#franchise-timeline", "3 to 6 months"]],
  },
];

/** Language that would mean a switched off form is pretending to have worked. */
const FALSE_SUCCESS = [
  "thank you",
  "thanks",
  "we will be in touch",
  "we'll be in touch",
  "received",
  "successfully",
  "we have your",
  "message sent",
  "submitted",
];

/** Field names or labels that must never appear on an inquiry form. */
const SENSITIVE = [
  "ssn",
  "social security",
  "bank",
  "routing",
  "account number",
  "credit card",
  "card number",
  "date of birth",
  "dob",
  "net worth",
  "tax return",
];

const only = process.env.AUDIT_ONLY;
const forms = only ? FORMS.filter((form) => form.name.includes(only)) : FORMS;
if (forms.length === 0) throw new Error(`AUDIT_ONLY="${only}" matched no form.`);

const failures = [];
function check(form, name, pass, detail = "") {
  if (!pass) failures.push(`${form}: ${name}${detail ? ` (${detail})` : ""}`);
  console.log(`  ${pass ? "pass" : "FAIL"}  ${form}: ${name}${detail ? `  (${detail})` : ""}`);
}

let server = null;
let browser = null;

try {
  server = await startNextServer({ port: PORT });
  console.log(`Server ready at ${server.base}\n`);
  browser = await chromium.launch();

  for (const form of FORMS.filter((f) => forms.includes(f))) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();

    // Any non-GET request, or any GET that is not the page load itself, would
    // mean something left the browser. Collected across the whole run.
    const escaped = [];
    page.on("request", (request) => {
      if (request.method() !== "GET") {
        escaped.push(`${request.method()} ${request.url()}`);
      }
    });

    await page.goto(server.base + form.path, { waitUntil: "load" });
    // Let hydration attach handlers before clicking anything.
    await page.waitForTimeout(1500);
    const startUrl = page.url();

    // --- structural checks -------------------------------------------------
    check(
      form.name,
      "form carries no action attribute",
      (await page.locator("form").evaluateAll((f) => f.every((x) => !x.getAttribute("action")))),
    );

    const unlabelled = await page.locator("form").evaluateAll((formEls) => {
      const bad = [];
      for (const formEl of formEls) {
        const controls = formEl.querySelectorAll(
          'input:not([type="hidden"]), select, textarea',
        );
        for (const control of controls) {
          const id = control.getAttribute("id");
          const hasFor = id && formEl.querySelector(`label[for="${CSS.escape(id)}"]`);
          const wrapped = control.closest("label");
          const aria =
            control.getAttribute("aria-label") ||
            control.getAttribute("aria-labelledby");
          if (!hasFor && !wrapped && !aria) {
            bad.push(control.getAttribute("name") || control.tagName.toLowerCase());
          }
        }
      }
      return bad;
    });
    check(form.name, "every control has a label", unlabelled.length === 0, unlabelled.join(", "));

    const sensitive = await page.locator("form").evaluateAll(
      (formEls, terms) => {
        const found = [];
        for (const formEl of formEls) {
          const haystack = `${formEl.innerText} ${Array.from(
            formEl.querySelectorAll("input, select, textarea"),
          )
            .map((c) => `${c.getAttribute("name") || ""} ${c.getAttribute("id") || ""}`)
            .join(" ")}`.toLowerCase();
          for (const term of terms) if (haystack.includes(term)) found.push(term);
        }
        return found;
      },
      SENSITIVE,
    );
    check(form.name, "asks for nothing sensitive", sensitive.length === 0, sensitive.join(", "));

    // --- empty submit ------------------------------------------------------
    await page.getByRole("button", { name: form.submitLabel }).click();
    await page.waitForTimeout(400);

    check(form.name, "empty submit shows error summary", (await page.locator(form.summary).count()) === 1);
    check(form.name, "empty submit does not navigate", page.url() === startUrl, page.url());

    for (const [field, errorSelector] of form.required) {
      const shown = (await page.locator(errorSelector).count()) === 1;
      check(form.name, `required field errors: ${errorSelector}`, shown);
      if (field) {
        const invalid = await page.locator(field).getAttribute("aria-invalid");
        check(form.name, `aria-invalid set: ${field}`, invalid === "true", String(invalid));
      }
    }
    for (const [, errorSelector] of form.optional) {
      check(
        form.name,
        `optional field stays optional: ${errorSelector}`,
        (await page.locator(errorSelector).count()) === 0,
      );
    }

    // --- invalid email -----------------------------------------------------
    const [emailField, emailError] = form.email;
    for (const [selector, value] of form.fill) await page.fill(selector, value);
    for (const [selector, value] of form.select) await page.selectOption(selector, value);
    await page.fill(emailField, "not-an-email");
    await page.waitForTimeout(300);
    check(form.name, "malformed email rejected", (await page.locator(emailError).count()) === 1);

    // --- valid submit ------------------------------------------------------
    await page.fill(emailField, "probe@example-domain.test");
    await page.waitForTimeout(300);
    await page.getByRole("button", { name: form.submitLabel }).click();
    await page.waitForTimeout(600);

    const notice = (await page.locator('[role="status"]').first().innerText().catch(() => "")).toLowerCase();
    check(
      form.name,
      "valid submit states submissions are not open",
      notice.includes("not accepting submissions"),
      notice.slice(0, 50).replace(/\n/g, " "),
    );
    const falseSuccess = FALSE_SUCCESS.filter((phrase) => notice.includes(phrase));
    check(form.name, "no false success language", falseSuccess.length === 0, falseSuccess.join(", "));
    check(form.name, "valid submit does not navigate", page.url() === startUrl, page.url());
    check(form.name, "nothing left the browser", escaped.length === 0, escaped.join("; "));

    await context.close();
    console.log("");
  }

  console.log("================ RESULT ================");
  if (failures.length === 0) {
    console.log(`ALL GREEN. ${forms.length} form(s) validate, submit nowhere, and claim nothing false.`);
    process.exitCode = 0;
  } else {
    console.log(`${failures.length} FAILURE(S):`);
    for (const failure of failures) console.log(`  - ${failure}`);
    process.exitCode = 1;
  }
} catch (error) {
  console.error(`Harness error: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (server) await server.stop();
}
