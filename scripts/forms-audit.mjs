/**
 * FORMS AUDIT
 * ===========
 *
 * Drives every form in a real browser against stand-ins for Supabase and
 * Resend, and asserts what the site now actually does.
 *
 * The forms are live. Until this commit, this audit asserted that nothing left
 * the browser, which was true and is no longer. The checks below replace that
 * with the properties that matter once a form really stores something:
 *
 *   - SUCCESS ONLY AFTER A STORED ROW. The confirmation must appear only when
 *     an insert actually reached the database. This is the one that keeps the
 *     privacy policy honest, and it is verified from both directions: a healthy
 *     database must produce a row, and a failing one must produce a failure
 *     message and no confirmation.
 *   - CORRECT COLUMNS. Inserted keys are checked against the live schema of
 *     craftline_contact_messages and craftline_franchise_inquiries. A form that
 *     silently stops sending a field would otherwise pass every other check.
 *   - EXACTLY ONE NOTIFICATION, to the configured recipient. Not zero, which
 *     would mean nobody learns about the inquiry, and not two.
 *   - NO SENSITIVE FIELDS. The franchise inquiry must never grow an SSN, bank
 *     detail, or date of birth field. It is an inquiry, not an application, and
 *     the FDD is not issued.
 *
 * Deliberately NOT run against the real project. Auditing production would mean
 * writing junk rows beside Wattsmith's real leads on every run, and could not
 * exercise the failure path at all. See scripts/lib/service-stubs.mjs.
 *
 *   npm run build && npm run forms-audit
 *   AUDIT_ONLY=franchise npm run forms-audit
 */
import { chromium } from "playwright";
import { startNextServer } from "./lib/dev-server.mjs";
import { startServiceStubs } from "./lib/service-stubs.mjs";

const PORT = 3136;
const STUB_PORT = 3141;
const RECIPIENT = "audit-recipient@example-domain.test";
const SENDER = "audit-sender@example-domain.test";

/**
 * Columns that exist on each table, taken from the live schema. An insert key
 * outside this set would be rejected by PostgREST in production, and the stub
 * would happily accept it, so the check lives here.
 */
const SCHEMA = {
  craftline_contact_messages: {
    allowed: ["name", "email", "phone", "message", "source", "status"],
    expected: ["name", "email", "message"],
  },
  craftline_franchise_inquiries: {
    allowed: [
      "name",
      "email",
      "phone",
      "city_of_interest",
      "state_of_interest",
      "liquid_capital_bracket",
      "timeline",
      "military_veteran",
      "message",
      "source",
      "status",
      "notes",
    ],
    expected: [
      "name",
      "email",
      "city_of_interest",
      "state_of_interest",
      "timeline",
      "military_veteran",
    ],
  },
};

const FORMS = [
  {
    name: "contact",
    path: "/contact",
    table: "craftline_contact_messages",
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
    radio: [],
    // What the stored row must contain, given the fill above.
    expectRow: {
      name: "Audit Probe",
      email: "probe@example-domain.test",
      message: "Audit probe message.",
    },
  },
  {
    name: "franchise",
    path: "/franchising",
    table: "craftline_franchise_inquiries",
    submitLabel: "Send inquiry",
    summary: "#franchise-errors",
    required: [
      ["#franchise-name", "#franchise-name-error"],
      ["#franchise-email", "#franchise-email-error"],
      ["#franchise-city", "#franchise-city-error"],
      ["#franchise-state", "#franchise-state-error"],
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
      ["#franchise-city", "Kansas City"],
      ["#franchise-state", "Kansas"],
    ],
    select: [["#franchise-timeline", "3 to 6 months"]],
    radio: [["veteran", "Prefer not to say"]],
    expectRow: {
      name: "Audit Probe",
      email: "probe@example-domain.test",
      city_of_interest: "Kansas City",
      state_of_interest: "Kansas",
      timeline: "3 to 6 months",
      // Declining to answer must store null, never false.
      military_veteran: null,
    },
  },
];

/** Copy that would mean a failure is being dressed up as a success. */
const FALSE_SUCCESS = ["thank you", "received", "we will be in touch", "successfully"];

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
function check(scope, name, pass, detail = "") {
  if (!pass) failures.push(`${scope}: ${name}${detail ? ` (${detail})` : ""}`);
  console.log(`  ${pass ? "pass" : "FAIL"}  ${scope}: ${name}${detail ? `  (${detail})` : ""}`);
}

async function fillValid(page, form) {
  for (const [selector, value] of form.fill) await page.fill(selector, value);
  for (const [selector, value] of form.select) await page.selectOption(selector, value);
  for (const [name, value] of form.radio) {
    await page.locator(`input[name="${name}"][value="${value}"]`).check();
  }
}

let stubs = null;
let server = null;
let browser = null;

try {
  stubs = await startServiceStubs({ port: STUB_PORT });

  // The application is configured exactly as it is in production. It has no
  // idea these are stand-ins.
  server = await startNextServer({
    port: PORT,
    env: {
      SUPABASE_URL: stubs.base,
      SUPABASE_SERVICE_ROLE_KEY: "stub-service-role-key",
      RESEND_API_KEY: "stub-resend-key",
      RESEND_API_URL: `${stubs.base}/emails`,
      INQUIRY_TO_EMAIL: RECIPIENT,
      INQUIRY_FROM_EMAIL: SENDER,
    },
  });
  console.log(`Server ready at ${server.base}, stubs at ${stubs.base}\n`);

  browser = await chromium.launch();

  for (const form of forms) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    // Each form is isolated. A broken first form used to abort the run and take
    // the second form's results with it, which is how a single failure can hide
    // an unrelated one. A form that throws is a failure of that form and
    // nothing more.
    try {
    await page.goto(server.base + form.path, { waitUntil: "load" });
    await page.waitForTimeout(1500); // hydration

    // --- structural --------------------------------------------------------
    const unlabelled = await page.locator("form").evaluateAll((formEls) => {
      const bad = [];
      for (const formEl of formEls) {
        for (const control of formEl.querySelectorAll(
          'input:not([type="hidden"]), select, textarea',
        )) {
          const id = control.getAttribute("id");
          const hasFor = id && formEl.querySelector(`label[for="${CSS.escape(id)}"]`);
          if (!hasFor && !control.closest("label") && !control.getAttribute("aria-label")) {
            bad.push(control.getAttribute("name") || control.tagName.toLowerCase());
          }
        }
      }
      return bad;
    });
    check(form.name, "every control has a label", unlabelled.length === 0, unlabelled.join(", "));

    const sensitive = await page.locator("form").evaluateAll((formEls, terms) => {
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
    }, SENSITIVE);
    check(form.name, "asks for nothing sensitive", sensitive.length === 0, sensitive.join(", "));

    // --- validation blocks a bad submit ------------------------------------
    stubs.reset();
    await page.getByRole("button", { name: form.submitLabel }).click();
    await page.waitForTimeout(500);

    check(form.name, "empty submit shows error summary", (await page.locator(form.summary).count()) === 1);
    check(
      form.name,
      "empty submit reaches no database",
      stubs.received.inserts.length === 0,
      `${stubs.received.inserts.length} insert(s)`,
    );
    for (const [field, errorSelector] of form.required) {
      check(form.name, `required field errors: ${errorSelector}`, (await page.locator(errorSelector).count()) === 1);
      if (field) {
        const invalid = await page.locator(field).getAttribute("aria-invalid");
        check(form.name, `aria-invalid set: ${field}`, invalid === "true", String(invalid));
      }
    }
    for (const [, errorSelector] of form.optional) {
      check(form.name, `optional field stays optional: ${errorSelector}`, (await page.locator(errorSelector).count()) === 0);
    }

    const [emailField, emailError] = form.email;
    await fillValid(page, form);
    await page.fill(emailField, "not-an-email");
    await page.waitForTimeout(300);
    check(form.name, "malformed email rejected", (await page.locator(emailError).count()) === 1);
    check(form.name, "malformed email reaches no database", stubs.received.inserts.length === 0);

    // --- FAILURE PATH: database is down ------------------------------------
    stubs.reset();
    stubs.setFailInserts(true);
    await page.fill(emailField, "probe@example-domain.test");
    await page.waitForTimeout(200);
    await page.getByRole("button", { name: form.submitLabel }).click();
    await page.waitForTimeout(2500);

    const failureShown = (await page.locator('[data-testid="submit-failure"]').count()) === 1;
    check(form.name, "failed insert shows a failure message", failureShown);
    check(
      form.name,
      "failed insert shows NO confirmation",
      (await page.locator('[data-testid="submit-success"]').count()) === 0,
    );
    const failureText = (
      await page.locator('[data-testid="submit-failure"]').innerText().catch(() => "")
    ).toLowerCase();
    check(
      form.name,
      "failure message contains no success language",
      !FALSE_SUCCESS.some((phrase) => failureText.includes(phrase)),
      failureText.slice(0, 60).replace(/\n/g, " "),
    );
    check(
      form.name,
      "failed insert sends no notification",
      stubs.received.emails.length === 0,
      `${stubs.received.emails.length} email(s)`,
    );

    // --- SUCCESS PATH: database is healthy ---------------------------------
    stubs.reset();
    stubs.setFailInserts(false);
    await page.getByRole("button", { name: form.submitLabel }).click();
    await page.waitForTimeout(2500);

    check(
      form.name,
      "successful insert shows confirmation",
      (await page.locator('[data-testid="submit-success"]').count()) === 1,
    );
    check(
      form.name,
      "confirmation replaces the failure message",
      (await page.locator('[data-testid="submit-failure"]').count()) === 0,
    );

    const inserts = stubs.received.inserts;
    check(form.name, "exactly one row stored", inserts.length === 1, `${inserts.length}`);

    if (inserts.length === 1) {
      const { table, row } = inserts[0];
      check(form.name, `stored into ${form.table}`, table === form.table, table);

      const schema = SCHEMA[form.table];
      const unknown = Object.keys(row).filter((key) => !schema.allowed.includes(key));
      check(form.name, "no column outside the live schema", unknown.length === 0, unknown.join(", "));

      const missing = schema.expected.filter((key) => !(key in row));
      check(form.name, "every expected column present", missing.length === 0, missing.join(", "));

      for (const [key, value] of Object.entries(form.expectRow)) {
        check(
          form.name,
          `stored ${key} correctly`,
          row[key] === value,
          `${JSON.stringify(row[key])} vs ${JSON.stringify(value)}`,
        );
      }
    }

    const emails = stubs.received.emails;
    check(form.name, "exactly one notification sent", emails.length === 1, `${emails.length}`);
    if (emails.length === 1) {
      check(
        form.name,
        "notification went to the configured recipient",
        Array.isArray(emails[0].to) && emails[0].to[0] === RECIPIENT,
        JSON.stringify(emails[0].to),
      );
      check(form.name, "notification came from the configured sender", emails[0].from === SENDER, String(emails[0].from));
      check(
        form.name,
        "notification carries the submission",
        typeof emails[0].text === "string" && emails[0].text.includes("Audit Probe"),
      );
    }

    } catch (error) {
      check(form.name, "harness drove this form to completion", false, String(error.message).split("\n")[0]);
    } finally {
      await context.close();
      console.log("");
    }
  }

  console.log("================ RESULT ================");
  if (failures.length === 0) {
    console.log(
      `ALL GREEN. ${forms.length} form(s): validation blocks bad input, a failed write ` +
        "surfaces as a failure, and a confirmation appears only after a stored row.",
    );
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
  if (stubs) await stubs.stop();
}
