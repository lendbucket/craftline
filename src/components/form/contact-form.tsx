"use client";

import { useRef, useState } from "react";
import {
  ErrorSummary,
  TextAreaField,
  TextField,
} from "@/components/form/fields";
import { isEmail, isPhone, required } from "@/lib/validate";

/**
 * General contact form.
 *
 * Validates on submit and goes no further. There is no endpoint yet: storage
 * and notification land once the database decision is made, and wiring a
 * submit handler to nothing in the meantime would produce the worst possible
 * outcome, which is a form that looks like it sent something.
 *
 * So a valid submit says plainly that submissions are not open. That is a
 * deliberately unsatisfying end state and it is the honest one. It is also why
 * this notice should be the first thing removed when the endpoint exists.
 */
const EMPTY = { name: "", email: "", phone: "", message: "" };
type Values = typeof EMPTY;
type Errors = Partial<Record<keyof Values, string>>;

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!required(values.name)) errors.name = "Enter your name.";
  if (!required(values.email)) {
    errors.email = "Enter an email address so we can reply.";
  } else if (!isEmail(values.email)) {
    errors.email = "That email address does not look right.";
  }
  // Phone is optional, but a wrong one is worse than none.
  if (required(values.phone) && !isPhone(values.phone)) {
    errors.phone = "Enter a phone number with at least 10 digits.";
  }
  if (!required(values.message)) errors.message = "Tell us what this is about.";
  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const summaryRef = useRef<HTMLDivElement | null>(null);

  const set = (field: keyof Values) => (value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    // Only re-validate live once they have tried to submit. Validating from the
    // first keystroke marks a field wrong while it is still being typed.
    if (submitted) {
      setErrors(validate({ ...values, [field]: value }));
    }
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setAccepted(false);
      // Let the summary render before moving focus to it.
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setAccepted(true);
  };

  const errorCount = Object.keys(errors).length;

  return (
    <form noValidate onSubmit={onSubmit} className="max-w-xl space-y-7">
      <ErrorSummary id="contact-errors" count={errorCount} headingRef={summaryRef} />

      <TextField
        id="contact-name"
        name="name"
        label="Name"
        value={values.name}
        onChange={set("name")}
        error={errors.name}
        autoComplete="name"
      />
      <TextField
        id="contact-email"
        name="email"
        label="Email"
        type="email"
        inputMode="email"
        value={values.email}
        onChange={set("email")}
        error={errors.email}
        autoComplete="email"
      />
      <TextField
        id="contact-phone"
        name="phone"
        label="Phone"
        type="tel"
        inputMode="tel"
        optional
        value={values.phone}
        onChange={set("phone")}
        error={errors.phone}
        autoComplete="tel"
      />
      <TextAreaField
        id="contact-message"
        name="message"
        label="Message"
        value={values.message}
        onChange={set("message")}
        error={errors.message}
      />

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center rounded bg-bronze-bright px-6 py-3 text-sm font-semibold tracking-wide text-ink transition-colors hover:bg-bronze-bright-hover"
        >
          Send message
        </button>
      </div>

      {accepted ? (
        <div role="status" className="rounded border border-ink/20 bg-white p-5">
          <p className="text-sm font-semibold text-ink">
            This form is not accepting submissions yet.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Everything you entered is valid, but there is nowhere to send it
            yet. Nothing has been stored and nothing has been sent. The form
            goes live with the corporate mailbox.
          </p>
        </div>
      ) : null}
    </form>
  );
}
