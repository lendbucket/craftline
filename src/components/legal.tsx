import { POLICY_LAST_UPDATED } from "@/config/company";

/**
 * Shared furniture for the privacy policy and the terms.
 *
 * Both documents are long form prose, which is what the .prose-body serif
 * exists for. Rather than let each page invent its own measure and spacing,
 * they share these: a single reading column, one heading rhythm, and list
 * styling that stays legible at 320px.
 */

export function LegalSection({
  id,
  heading,
  children,
}: {
  id: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="border-line border-t pt-9">
      <h2 id={id} className="h3">
        {heading}
      </h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="prose-body">{children}</p>
  );
}

export function LegalList({ items }: { items: readonly string[] }) {
  return (
    <ul className="prose-body space-y-2 pl-5">
      {items.map((item) => (
        <li
          key={item}
          className="list-disc"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Effective date line. Same treatment on both documents. */
export function EffectiveDate() {
  return (
    <p className="text-steel text-[0.8125rem] font-semibold">
      Last updated {POLICY_LAST_UPDATED}
    </p>
  );
}
