/**
 * Renders a JSON-LD graph into the document.
 *
 * The `<` escape is not decoration. Without it, a `<` in any interpolated
 * string would let content close the script element early, which is the
 * standard injection vector for inline JSON-LD. Every value on this site is
 * authored in src/config, so nothing hostile can reach it today, but the escape
 * costs nothing and the day someone renders a form field into schema is not the
 * day you want to remember this.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
