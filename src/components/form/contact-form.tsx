"use client";

import { useRef, useState } from "react";
import { submitContactMessage } from "@/app/actions/submit";
import {
  ErrorSummary,
  TextAreaField,
  TextField,
} from "@/components/form/fields";
import { isEmail, isPhone, required } from "@/lib/validate";

/**
 * General contact form.
 *
 * Live: a valid submit stores a row and triggers a notification. Three end
 * states, and the distinction between the last two is the whole point:
 *
 *   - invalid: field errors, nothing sent
 *   - sent: the row is stored, and only then does this say so
 *   - failed: the row is NOT stored, and this says exactly that
 *
 * There is deliberately no optimistic success. The server is the only thing
 * that knows whether a message was saved, so the confirmation waits for it. A
 * form that says thank you before the write lands teaches people to walk away
 * from a message nobody received.
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
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement | null>(null);

  const set = (field: keyof Values) => (value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    // Only re-validate live once they have tried to submit. Validating from the
    // first keystroke marks a field wrong while it is still being typed.
    if (submitted) {
      setErrors(validate({ ...values, [field]: value }));
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    setFailure(null);

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setPending(true);
    try {
      const result = await submitContactMessage(values);
      if (result.ok) {
        setSent(true);
      } else {
        setFailure(result.message);
      }
    } catch {
      // A thrown action means the request never completed. Same user facing
      // outcome as a rejected one: not saved, and said so.
      setFailure(
        "Something went wrong and your message was not saved. Please try again in a moment.",
      );
    } finally {
      setPending(false);
    }
  };

  const errorCount = Object.keys(errors).length;

  if (sent) {
    return (
      <div
        role="status"
        data-testid="submit-success"
        className="max-w-xl rounded border border-ink/20 bg-white p-6"
      >
        <p className="text-base font-semibold text-ink">Message received.</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          It has been recorded and someone will read it. If it needs a reply you
          will get one at the address you gave.
        </p>
      </div>
    );
  }

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

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center rounded bg-bronze-bright px-6 py-3 text-sm font-semibold tracking-wide text-ink transition-colors hover:bg-bronze-bright-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Sending" : "Send message"}
      </button>

      {/*
        Failure is an alert, not a status. It is the one outcome the person must
        act on, and it must never be mistakable for the confirmation above.
      */}
      {failure ? (
        <div
          role="alert"
          data-testid="submit-failure"
          className="rounded border border-danger bg-white p-5"
        >
          <p className="text-sm font-semibold text-danger">
            Your message was not sent.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{failure}</p>
        </div>
      ) : null}
    </form>
  );
}
