"use client";

/**
 * FORM PRIMITIVES
 * ===============
 *
 * Presentational controls only. Each one takes a value, an onChange, and an
 * optional error string; the owning form holds the state and decides what is
 * valid. Keeping validation out of here means the franchise inquiry and the
 * contact form can have completely different rules without either one growing
 * a special case inside a shared input.
 *
 * Accessibility decisions that are load bearing, not incidental:
 *
 *   - Every control has a real <label htmlFor>. No placeholder-as-label. A
 *     placeholder disappears the moment someone types, which is exactly when a
 *     distracted person on a phone needs to check what the field was.
 *   - Errors are wired through aria-describedby and announced with role="alert",
 *     so a screen reader user learns the field is wrong without hunting for red
 *     text they cannot see.
 *   - aria-invalid marks the control itself, because "the border went red" is
 *     not information that reaches everyone.
 *   - Radio inputs sit inside labels tall enough to tap. The native control
 *     stays native: no sr-only input with a styled proxy, because that pattern
 *     breaks focus visibility in ways that are easy to ship and hard to notice.
 *
 * Colour comes entirely from tokens. `--color-fault` is surface aware in
 * globals.css the same way the accents are, so error text passes AA wherever a
 * form ends up sitting.
 *
 * FAULT IS AMBER, NOT RED, AND IT NEVER TRAVELS ALONE. Red is the action colour
 * on this site, so an error painted red would look like the submit button. And
 * no hue separates reliably from red for a red-green colourblind reader, which
 * means colour cannot be the carrier at all. Every failure state below pairs the
 * amber with a literal mono FAULT label. If you add an error state, it gets the
 * label too.
 */

/**
 * The mono FAULT tag. This is the part that actually carries the meaning; the
 * amber is reinforcement. Do not render an error without it.
 */
export function FaultTag() {
  return (
    <>
      <span className="label-sm text-fault mr-2 align-baseline">Fault</span>
      {/*
        A real space, not just the margin. Without it the text content runs
        together as "Faultyour inquiry was not sent", which is what a screen
        reader announces and what the forms audit reads. The margin is visual
        only and does nothing for either.
      */}{" "}
    </>
  );
}

/** Marks a field optional. Required is the default, so it needs no marker. */
function OptionalTag() {
  return <span className="ml-2 text-xs font-normal text-steel">Optional</span>;
}

function ErrorText({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} role="alert" className="text-fault mt-2 text-sm font-medium">
      <FaultTag />
      {children}
    </p>
  );
}

/**
 * Field labels are set in the mono label face, matching the title block and the
 * section registers. A form is a set of fields, and the rest of the site labels
 * fields in exactly one hand; leaving these in the body serif made the form
 * look like it belonged to a different design.
 *
 * Deliberately NOT the .label class: that is uppercase and tracked wide, which
 * is right for a document field name a reader scans once and wrong for a form
 * label a person reads while deciding what to type. Sentence case, mild
 * tracking, and a size that stays comfortable next to a 16px control.
 */
function labelClasses() {
  return "block font-mono text-[0.8125rem] font-medium tracking-[0.05em] text-graphite";
}

function controlClasses(hasError: boolean) {
  // min-h-11 is the 44px touch floor. Font size comes from globals.css, which
  // pins form controls to 16px so iOS never zooms the viewport on focus.
  const base =
    "mt-2 block w-full min-h-11 rounded border bg-chalk px-3 py-3 text-graphite transition-colors";
  return hasError
    ? `${base} border-fault`
    : `${base} border-rule hover:border-graphite/40`;
}

interface BaseProps {
  id: string;
  name: string;
  label: string;
  error?: string;
  optional?: boolean;
}

export function TextField({
  id,
  name,
  label,
  value,
  onChange,
  error,
  optional = false,
  type = "text",
  autoComplete,
  inputMode,
}: BaseProps & {
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel";
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className={labelClasses()}>
        {label}
        {optional ? <OptionalTag /> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={controlClasses(Boolean(error))}
      />
      {error ? <ErrorText id={errorId}>{error}</ErrorText> : null}
    </div>
  );
}

export function TextAreaField({
  id,
  name,
  label,
  value,
  onChange,
  error,
  optional = false,
  rows = 5,
}: BaseProps & {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className={labelClasses()}>
        {label}
        {optional ? <OptionalTag /> : null}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={controlClasses(Boolean(error))}
      />
      {error ? <ErrorText id={errorId}>{error}</ErrorText> : null}
    </div>
  );
}

export function SelectField({
  id,
  name,
  label,
  value,
  onChange,
  options,
  error,
  optional = false,
  placeholder = "Select one",
}: BaseProps & {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className={labelClasses()}>
        {label}
        {optional ? <OptionalTag /> : null}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={controlClasses(Boolean(error))}
      >
        {/*
          An empty first option rather than a pre-selected value. Defaulting a
          select to a real answer is how forms collect answers nobody gave.
        */}
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <ErrorText id={errorId}>{error}</ErrorText> : null}
    </div>
  );
}

export function RadioGroupField({
  name,
  legend,
  value,
  onChange,
  options,
  error,
}: {
  name: string;
  legend: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  error?: string;
}) {
  const errorId = `${name}-error`;
  return (
    <fieldset
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
    >
      <legend className={labelClasses()}>{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-x-8 gap-y-1">
        {options.map((option) => (
          <label
            key={option}
            className="flex min-h-11 cursor-pointer items-center gap-3 text-graphite"
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="accent-signal h-5 w-5"
            />
            <span className="text-base">{option}</span>
          </label>
        ))}
      </div>
      {error ? <ErrorText id={errorId}>{error}</ErrorText> : null}
    </fieldset>
  );
}

/**
 * Summary shown after a failed submit.
 *
 * Focus moves here rather than to the first bad field. On a long form, throwing
 * someone straight into an input skips past the fact that four other things are
 * also wrong, and they discover the rest one submit at a time.
 */
export function ErrorSummary({
  id,
  count,
  headingRef,
}: {
  id: string;
  count: number;
  headingRef: React.RefObject<HTMLDivElement | null>;
}) {
  if (count === 0) return null;
  return (
    <div
      id={id}
      ref={headingRef}
      tabIndex={-1}
      role="alert"
      className="border-fault bg-chalk rounded border p-4"
    >
      <p className="text-fault text-sm font-semibold">
        <FaultTag />
        {count === 1
          ? "One field needs attention before this can be sent."
          : `${count} fields need attention before this can be sent.`}
      </p>
    </div>
  );
}
