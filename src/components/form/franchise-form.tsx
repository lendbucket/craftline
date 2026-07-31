"use client";

import { useRef, useState } from "react";
import { submitFranchiseInquiry } from "@/app/actions/submit";
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
 * City and state are two fields rather than one, because the table stores them
 * as two columns. The alternative was a single free text box split on a comma
 * at write time, which quietly mangles "Kansas City, Kansas" and every other
 * address a person writes in a way the parser did not anticipate. Ask for what
 * is stored.
 *
 * Confirmation waits for the server. See contact-form.tsx for why.
 */
const EMPTY = {
  name: "",
  email: "",
  phone: "",
  city: "",
  state: "",
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
  if (!required(values.city)) errors.city = "Enter the city you are interested in.";
  if (!required(values.state)) errors.state = "Enter the state.";
  if (!required(values.timeline)) errors.timeline = "Choose a timeline.";
  // Capital, veteran status, and message are all optional. Capital especially:
  // requiring it would turn an inquiry into a screening step.
  return errors;
}

export function FranchiseForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement | null>(null);

  const set = (field: keyof Values) => (value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
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
      const result = await submitFranchiseInquiry(values);
      if (result.ok) {
        setSent(true);
      } else {
        setFailure(result.message);
      }
    } catch {
      setFailure(
        "Something went wrong and your inquiry was not saved. Please try again in a moment.",
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
        className="max-w-xl rounded border border-rule bg-chalk p-6"
      >
        <p className="text-base font-semibold text-graphite">Inquiry received.</p>
        <p className="mt-3 text-sm leading-relaxed text-steel">
          It has been recorded and a person will read it. This is an inquiry
          only. Nothing has been offered, promised, or reserved, and no
          agreement exists between you and Craftline Brands.
        </p>
      </div>
    );
  }

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
        id="franchise-city"
        name="city"
        label="City of interest"
        value={values.city}
        onChange={set("city")}
        error={errors.city}
        autoComplete="address-level2"
      />
      <TextField
        id="franchise-state"
        name="state"
        label="State of interest"
        value={values.state}
        onChange={set("state")}
        error={errors.state}
        autoComplete="address-level1"
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
        disabled={pending}
        className="label bg-copper-solid text-zinc hover:bg-copper-solid-hover inline-flex min-h-11 items-center justify-center px-7 py-3.5 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Sending" : "Send inquiry"}
      </button>

      {failure ? (
        <div
          role="alert"
          data-testid="submit-failure"
          className="rounded border border-oxide bg-chalk p-5"
        >
          <p className="text-sm font-semibold text-oxide">
            Your inquiry was not sent.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-steel">{failure}</p>
        </div>
      ) : null}
    </form>
  );
}
