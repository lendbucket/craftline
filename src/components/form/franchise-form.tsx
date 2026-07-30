"use client";

import { useRef, useState } from "react";
import {
  ErrorSummary,
  RadioGroupField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/form/fields";
import {
  CAPITAL_BRACKETS,
  TIMELINE_OPTIONS,
  VETERAN_OPTIONS,
} from "@/config/company";
import { isEmail, isPhone, required } from "@/lib/validate";

/**
 * Franchise inquiry form.
 *
 * INQUIRY ONLY. This is not an application and it must never become one. It
 * takes no SSN, no financial documents, no credit authorisation, no signature,
 * and no payment, and it does not tell anyone they qualify for anything. The
 * FDD is not issued; a form that reads as a purchase flow before that point is
 * the exact thing the disclaimer exists to prevent.
 *
 * Capital is asked as a broad bracket, is optional, and includes a decline
 * option. Nothing on the page states a capital requirement, because there is
 * none to state.
 *
 * Like the contact form, it validates and stops. No endpoint exists yet.
 */
const EMPTY = {
  name: "",
  email: "",
  phone: "",
  location: "",
  capital: "",
  timeline: "",
  veteran: "",
  message: "",
};
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
  if (required(values.phone) && !isPhone(values.phone)) {
    errors.phone = "Enter a phone number with at least 10 digits.";
  }
  if (!required(values.location)) {
    errors.location = "Tell us the city and state you are interested in.";
  }
  if (!required(values.timeline)) {
    errors.timeline = "Choose a timeline.";
  }
  // Capital, veteran status, and message are all optional. Capital especially:
  // requiring it would turn an inquiry into a screening step.
  return errors;
}

export function FranchiseForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const summaryRef = useRef<HTMLDivElement | null>(null);

  const set = (field: keyof Values) => (value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
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
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setAccepted(true);
  };

  const errorCount = Object.keys(errors).length;

  return (
    <form noValidate onSubmit={onSubmit} className="max-w-xl space-y-7">
      <ErrorSummary id="franchise-errors" count={errorCount} headingRef={summaryRef} />

      <TextField
        id="franchise-name"
        name="name"
        label="Name"
        value={values.name}
        onChange={set("name")}
        error={errors.name}
        autoComplete="name"
      />
      <TextField
        id="franchise-email"
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
        id="franchise-phone"
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
      <TextField
        id="franchise-location"
        name="location"
        label="City and state of interest"
        value={values.location}
        onChange={set("location")}
        error={errors.location}
      />
      <SelectField
        id="franchise-capital"
        name="capital"
        label="Liquid capital available"
        optional
        value={values.capital}
        onChange={set("capital")}
        error={errors.capital}
        options={CAPITAL_BRACKETS}
      />
      <SelectField
        id="franchise-timeline"
        name="timeline"
        label="Timeline"
        value={values.timeline}
        onChange={set("timeline")}
        error={errors.timeline}
        options={TIMELINE_OPTIONS}
      />
      <RadioGroupField
        name="veteran"
        legend="Are you a military veteran?"
        value={values.veteran}
        onChange={set("veteran")}
        error={errors.veteran}
        options={VETERAN_OPTIONS}
      />
      <TextAreaField
        id="franchise-message"
        name="message"
        label="Anything you would like us to know"
        optional
        value={values.message}
        onChange={set("message")}
        error={errors.message}
      />

      <button
        type="submit"
        className="inline-flex min-h-11 items-center justify-center rounded bg-bronze-bright px-6 py-3 text-sm font-semibold tracking-wide text-ink transition-colors hover:bg-bronze-bright-hover"
      >
        Send inquiry
      </button>

      {accepted ? (
        <div role="status" className="rounded border border-ink/20 bg-white p-5">
          <p className="text-sm font-semibold text-ink">
            This form is not accepting submissions yet.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Everything you entered is valid, but there is nowhere to send it
            yet. Nothing has been stored and nothing has been sent.
          </p>
        </div>
      ) : null}
    </form>
  );
}
