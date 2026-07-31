/**
 * ABSTRACT GRAPHIC ELEMENTS
 * =========================
 *
 * The visual layer that is not photography.
 *
 * Craftline owns no photographs of its own operations, and stock photography of
 * people and job sites is off the table: a corporate site for a franchisor in
 * formation showing crews and trucks that are not ours implies scale that does
 * not exist, which is the same category of problem as inventing a franchisee
 * count. So the pages carry geometry instead. It is honest because it depicts
 * nothing, and it is cheap to replace when real photography arrives.
 *
 * Every element here is drawn with `currentColor` and token driven opacity
 * rather than a fill of its own. That is deliberate: these must inherit whatever
 * palette replaces the current one, so a real identity landing in globals.css
 * updates them without anyone opening this file. No hex values live here.
 *
 * All of it is decorative and every element is aria-hidden. None of it carries
 * meaning that is not also present in the text beside it, which is the test for
 * whether a graphic is allowed to be invisible to a screen reader.
 */

/**
 * A field of measured vertical rules that thins out as it descends.
 *
 * The motif is the single bronze rule in the wordmark, repeated and put on a
 * grid. It reads as measurement and standardisation, which is what the company
 * actually does, and it deliberately does not read as electricity: Craftline is
 * the parent, not a louder version of the operating brand.
 *
 * Sized to sit behind a hero at low opacity. It renders as a fixed viewBox and
 * stretches, so it never needs to know the height of what it is behind.
 */
export function MeasuredField({ className = "" }: { className?: string }) {
  // 24 columns on a 480 unit field. Every fourth rule is full height and
  // heavier, so the eye reads a repeating measure rather than a hatch.
  const columns = Array.from({ length: 24 }, (_, index) => index);

  return (
    <svg
      viewBox="0 0 480 240"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {columns.map((index) => {
        const x = index * 20 + 10;
        const major = index % 4 === 0;
        return (
          <line
            key={index}
            x1={x}
            y1={0}
            x2={x}
            y2={major ? 240 : 96 - (index % 4) * 12}
            stroke="currentColor"
            strokeWidth={major ? 1.5 : 0.75}
            opacity={major ? 0.5 : 0.28}
          />
        );
      })}
      {/* One horizontal measure, echoing the rule in the wordmark. */}
      <line
        x1={0}
        y1={168}
        x2={480}
        y2={168}
        stroke="currentColor"
        strokeWidth={0.75}
        opacity={0.35}
      />
    </svg>
  );
}

/**
 * Four nodes on a spine.
 *
 * Used where the text is already explaining that a brand system is a small
 * number of separate parts held together. The diagram carries no labels, so it
 * cannot drift out of sync with the copy beside it and it does not need
 * translating. The count matches CAPABILITIES, which is the point: four parts,
 * one line through them.
 */
export function SystemSpine({ className = "" }: { className?: string }) {
  const nodes = [60, 160, 260, 360];

  return (
    <svg
      viewBox="0 0 420 120"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {/* The spine. Drawn under the nodes so they sit on it. */}
      <line
        x1={20}
        y1={60}
        x2={400}
        y2={60}
        stroke="currentColor"
        strokeWidth={1}
        opacity={0.45}
      />
      {nodes.map((x, index) => (
        <g key={x}>
          {/* Riser, alternating above and below, so the row has rhythm. */}
          <line
            x1={x}
            y1={60}
            x2={x}
            y2={index % 2 === 0 ? 22 : 98}
            stroke="currentColor"
            strokeWidth={1}
            opacity={0.45}
          />
          <rect
            x={x - 13}
            y={index % 2 === 0 ? 9 : 85}
            width={26}
            height={26}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.25}
            opacity={0.75}
          />
          <circle cx={x} cy={60} r={3.5} fill="currentColor" opacity={0.9} />
        </g>
      ))}
    </svg>
  );
}
