// ============================================================
// PageFrame — GLOBAL. The two vertical hairline strokes that
// bound every page (BRIEF §3.3). All section content lives
// between them; they persist across pages and both themes.
// Fixed + pointer-events-none → zero layout impact.
// ============================================================

export default function PageFrame() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-y-0 left-0 right-0 z-10">
      <div
        className="absolute inset-y-0 w-px bg-opt-border-subtle"
        style={{ left: 'var(--opt-frame-inset)' }}
      />
      <div
        className="absolute inset-y-0 w-px bg-opt-border-subtle"
        style={{ right: 'var(--opt-frame-inset)' }}
      />
    </div>
  )
}
