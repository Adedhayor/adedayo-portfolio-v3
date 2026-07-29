// ============================================================
// AdaptiveQuality — in-Canvas perf governor for the /play world.
// OWNED BY THE FALLBACK/PERF WORKSTREAM (F). Lives inside the
// Canvas (it needs the fiber store), but stays scene-agnostic:
// it renders nothing visible and never touches world state.
//
// - Steps canvas dpr down 1.75 → 1.4 → 1.1 on sustained low fps
//   and back up when healthy. drei's PerformanceMonitor samples
//   ~2.5s windows, so steps are debounced by construction; a
//   flip-flop cap pins the floor instead of oscillating forever.
// - Caps dpr at 1.5 on coarse pointers (mobile GPUs) — via
//   initialDpr() on the Canvas prop, so the first frame never
//   allocates a larger drawing buffer than we'd keep.
// - On `webglcontextlost` (unrecoverable for us: buffers, video
//   textures and compiled programs are gone), preventDefault and
//   hand the session to the 2D fallback through a window event
//   that useViewMode listens for on the DOM side.
// ============================================================
import { useCallback, useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { WEBGL_LOST_EVENT } from '../hooks/useViewMode'

/** Quality ladder, highest first. Real dpr is additionally capped
    by the device pixel ratio and the coarse-pointer ceiling. */
const DPR_STEPS = [1.75, 1.4, 1.1] as const

function dprCeiling(): number {
  const coarse =
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  return coarse ? 1.5 : DPR_STEPS[0]
}

function dprForStep(step: number): number {
  const device = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1
  return Math.min(DPR_STEPS[step], dprCeiling(), device)
}

/** Initial value for the <Canvas dpr> prop. Stable across renders
    (same inputs → same number), so r3f never sees a prop change
    that would clobber the adaptive steps below. */
export function initialDpr(): number {
  return dprForStep(0)
}

export default function AdaptiveQuality() {
  const gl = useThree((s) => s.gl)
  const setDpr = useThree((s) => s.setDpr)
  const frameloop = useThree((s) => s.frameloop)
  const stepRef = useRef(0)

  // Context-loss handoff. preventDefault() opts into the restoration
  // protocol (required for a well-behaved handler), but we don't wait
  // for a restore — the 2D fallback takes over immediately.
  useEffect(() => {
    const canvas = gl.domElement
    const onLost = (event: Event) => {
      event.preventDefault()
      window.dispatchEvent(new CustomEvent(WEBGL_LOST_EVENT))
    }
    canvas.addEventListener('webglcontextlost', onLost)
    return () => canvas.removeEventListener('webglcontextlost', onLost)
  }, [gl])

  const moveStep = useCallback(
    (delta: -1 | 1) => {
      const next = Math.min(Math.max(stepRef.current + delta, 0), DPR_STEPS.length - 1)
      if (next === stepRef.current) return
      stepRef.current = next
      setDpr(dprForStep(next))
    },
    [setDpr],
  )

  // Too much up/down flapping → settle on the floor and stop tuning.
  const pinFloor = useCallback(() => {
    stepRef.current = DPR_STEPS.length - 1
    setDpr(dprForStep(stepRef.current))
  }, [setDpr])

  // 'demand' phases (gate idle, reduced motion) render sparse frames
  // by design — sampling them would read as ~0fps and tank quality.
  if (frameloop !== 'always') return null

  return (
    <PerformanceMonitor
      ms={250}
      iterations={10}
      flipflops={5}
      onDecline={() => moveStep(1)}
      onIncline={() => moveStep(-1)}
      onFallback={pinFloor}
    />
  )
}
