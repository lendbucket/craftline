/**
 * ORIGINAL SVG LINE ILLUSTRATION
 * ==============================
 *
 * The non photographic half of the visual layer.
 *
 * Craftline owns no photographs of its own operations, and stock photography
 * of people and job sites is refused rather than deferred: a franchisor in
 * formation showing crews and trucks that are not its own implies scale that
 * does not exist. So the pages carry drawn geometry. It is honest because it
 * depicts nothing, and it is the treatment that stands in for a licensed
 * material photograph until one is bought, which means every page is finished
 * now and improved later rather than waiting.
 *
 * Everything here is drawn with `currentColor` and token driven opacity rather
 * than a fill of its own, so a real identity landing in globals.css updates it
 * without anyone opening this file. No hex values live here.
 *
 * All of it is decorative and aria-hidden. None of it carries meaning that is
 * not also present in the text beside it, which is the test for whether a
 * graphic is allowed to be invisible to a screen reader.
 */

/**
 * A raceway field: conduit runs with junction boxes and taps.
 *
 * The vernacular is a riser or raceway diagram, the drawing that shows where
 * conduit goes and what it feeds. It reads as routed infrastructure, which is
 * the subject, and deliberately not as a circuit board or a network graph,
 * which is what generic technology illustration reaches for.
 *
 * Drawn on a fixed grid so the linework stays on whole pixels at common
 * widths. Stretches to fill whatever it is placed behind.
 */
export function SchematicField({ className = "" }: { className?: string }) {
  /* Horizontal runs. Each is a conduit: start, end, and where it drops. */
  const runs = [
    { y: 40, x1: 0, x2: 300, drop: 220 },
    { y: 96, x1: 60, x2: 400, drop: 150 },
    { y: 152, x1: 0, x2: 340, drop: 280 },
    { y: 208, x1: 120, x2: 400, drop: 200 },
    { y: 264, x1: 0, x2: 260, drop: 180 },
  ];

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <g stroke="currentColor" fill="none" strokeWidth={1}>
        {runs.map((run) => (
          <g key={run.y}>
            {/* The run itself. */}
            <line
              x1={run.x1}
              y1={run.y}
              x2={run.x2}
              y2={run.y}
              opacity={0.55}
            />
            {/* A drop off the run, turning at a right angle the way conduit does. */}
            <polyline
              points={`${run.drop},${run.y} ${run.drop},${run.y + 32}`}
              opacity={0.4}
            />
            {/* Junction box at the drop. */}
            <rect
              x={run.drop - 7}
              y={run.y + 32}
              width={14}
              height={14}
              opacity={0.7}
            />
            {/* Tap point on the run. */}
            <circle
              cx={run.drop}
              cy={run.y}
              r={2.5}
              fill="currentColor"
              stroke="none"
              opacity={0.85}
            />
          </g>
        ))}
        {/* One vertical riser tying the runs together. */}
        <line x1={30} y1={40} x2={30} y2={264} opacity={0.45} />
        {runs.map((run) => (
          <circle
            key={`r${run.y}`}
            cx={30}
            cy={run.y}
            r={2}
            fill="currentColor"
            stroke="none"
            opacity={0.7}
          />
        ))}
      </g>
    </svg>
  );
}

/**
 * Four nodes on a spine.
 *
 * Used only where the text beside it is already explaining that a brand system
 * is a small number of separate parts held on one line. It carries no labels,
 * so it cannot drift out of sync with the copy and it needs no translating.
 * The count matches CAPABILITIES, which is the point: four parts, one line
 * through them.
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
