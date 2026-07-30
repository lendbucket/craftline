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
 * Colour comes entirely from tokens. `--color-danger` is surface aware in
 * globals.css the same way bronze is, so error text passes AA wherever a form
 * ends up sitting.
 */

/** Marks a field optional. Required is the default, so it needs no marker. */
function OptionalTag() {
  return <span className="ml-2 text-xs font-normal text-muted">Optional</span>;
}

function ErrorText({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} role="alert" className="mt-2 text-sm font-medium text-danger">
      {children}
    </p>
  );
}

function labelClasses() {
  return "block text-sm font-semibold text-ink";
}

function controlClasses(hasError: boolean) {
  // min-h-11 is the 44px touch floor. Font size comes from globals.css, which
  // pins form controls to 16px so iOS never zooms the viewport on focus.
  const base =
    "mt-2 block w-full min-h-11 rounded border bg-white px-3 py-3 text-ink transition-colors";
  return hasError
    ? `${base} border-danger`
    : `${base} border-ink/25 hover:border-ink/40`;
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
            className="flex min-h-11 cursor-pointer items-center gap-3 text-ink"
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="h-5 w-5 accent-bronze"
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
      className="rounded border border-danger bg-white p-4"
    >
      <p className="text-sm font-semibold text-danger">
        {count === 1
          ? "One field needs attention before this can be sent."
          : `${count} fields need attention before this can be sent.`}
      </p>
    </div>
  );
}
