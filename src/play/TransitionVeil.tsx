// ============================================================
// TransitionVeil — the door fade (W0). A full-viewport DOM veil
// that covers the scene + camera swap during a location change.
// Purely driven by `transitioning` from PlayContext: opacity
// 0 → 1 (first half) while the veil rises, holds opaque across
// the midpoint swap, then 1 → 0 (second half) as it clears.
//
// It plays NO sound — useHotspotAction fires the enter/exit
// stings. Under reduced motion there is no veil at all (goTo
// does an instant cut), so this renders nothing.
// ============================================================
import { usePlay, TRANSITION_MS } from './PlayContext'

export default function TransitionVeil() {
  const { transitioning, reducedMotion } = usePlay()

  // Reduced motion swaps instantly — no veil to animate.
  if (reducedMotion) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40"
      style={{
        backgroundColor: 'var(--opt-color-ink, #0f0e0e)',
        opacity: transitioning ? 1 : 0,
        // Half the transition each way: reaches full cover by the midpoint
        // swap, then eases back out. ease-in-out reads as a door closing/opening.
        transition: `opacity ${TRANSITION_MS / 2}ms ease-in-out`,
      }}
    />
  )
}
