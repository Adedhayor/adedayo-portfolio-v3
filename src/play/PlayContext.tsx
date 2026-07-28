// ============================================================
// PlayContext — the world's single state surface. Every
// workstream (camera, HUD, panels, audio, scene) talks to the
// world ONLY through this context; nobody else owns state.
//
// Phase 2 location model: one OUTSIDE world + three enterable
// interiors. Zone-focus is retired. `goTo(location)` runs the
// door-veil transition; the scene + camera swap behind the veil
// at its midpoint. Post-integration this file is frozen again.
// ============================================================
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { PlayLocation } from './data/playground'
import { useReducedMotionFlag } from './hooks/useViewMode'

export type PlayPhase = 'gate' | 'intro' | 'live'

/** Total door-veil transition (ms). The scene + camera swap at the
    midpoint (veil fully covering); veil clears over the second half.
    Exported so TransitionVeil animates to the same clock. */
export const TRANSITION_MS = 380

export type PlayContextValue = {
  phase: PlayPhase
  /** Where the visitor is right now. Outside is one place; interiors are entered. */
  location: PlayLocation
  /** Door-veil in flight — DOM veil is opaque, HUD hides the swap. */
  transitioning: boolean
  activePanelId: string | null
  /** World-level mute — drives the nested SensoryUIProvider AND the ambient bed */
  muted: boolean
  reducedMotion: boolean
  /** Gate tap → intro (or straight to live under reduced motion) */
  enterWorld: () => void
  /** Camera rig calls this when the intro flight settles (→ live, outside) */
  introDone: () => void
  /** Run the door transition to a location. No-op mid-transition or if
      already there. Reduced motion = instant cut, no veil. */
  goTo: (location: PlayLocation) => void
  openPanel: (id: string) => void
  closePanel: () => void
  setMuted: (muted: boolean) => void
}

const PlayCtx = createContext<PlayContextValue | null>(null)

export function usePlay(): PlayContextValue {
  const ctx = useContext(PlayCtx)
  if (!ctx) throw new Error('[play] usePlay must be called inside <PlayProvider>')
  return ctx
}

export function PlayProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotionFlag()
  const [phase, setPhase] = useState<PlayPhase>('gate')
  const [location, setLocation] = useState<PlayLocation>('outside')
  const [transitioning, setTransitioning] = useState(false)
  const [activePanelId, setActivePanelId] = useState<string | null>(null)
  const [muted, setMuted] = useState(false)

  // Synchronous mirrors so goTo can guard re-entry / same-location without
  // stale-closure races (state updates are async). Timers are tracked so
  // StrictMode mount/unmount and page teardown never leak a pending swap.
  const locationRef = useRef<PlayLocation>('outside')
  const transitionRef = useRef(false)
  const timers = useRef<number[]>([])
  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t))
      timers.current = []
    },
    [],
  )

  const enterWorld = useCallback(() => {
    setPhase((p) => (p === 'gate' ? (reducedMotion ? 'live' : 'intro') : p))
  }, [reducedMotion])

  const introDone = useCallback(() => {
    setPhase((p) => (p === 'intro' ? 'live' : p))
  }, [])

  const goTo = useCallback(
    (next: PlayLocation) => {
      // No-op mid-transition or when already there.
      if (transitionRef.current || locationRef.current === next) return
      // Any open panel/lightbox closes as we move.
      setActivePanelId(null)

      // Reduced motion: instant cut, no veil, no timing.
      if (reducedMotion) {
        locationRef.current = next
        setLocation(next)
        return
      }

      // Veil path: cover → swap scene + camera at the midpoint → clear.
      transitionRef.current = true
      locationRef.current = next
      setTransitioning(true)
      const swap = window.setTimeout(() => setLocation(next), TRANSITION_MS / 2)
      const done = window.setTimeout(() => {
        setTransitioning(false)
        transitionRef.current = false
      }, TRANSITION_MS)
      timers.current.push(swap, done)
    },
    [reducedMotion],
  )

  const openPanel = useCallback((id: string) => setActivePanelId(id), [])
  const closePanel = useCallback(() => setActivePanelId(null), [])

  const value = useMemo(
    () => ({
      phase,
      location,
      transitioning,
      activePanelId,
      muted,
      reducedMotion,
      enterWorld,
      introDone,
      goTo,
      openPanel,
      closePanel,
      setMuted,
    }),
    [phase, location, transitioning, activePanelId, muted, reducedMotion, enterWorld, introDone, goTo, openPanel, closePanel],
  )

  return <PlayCtx.Provider value={value}>{children}</PlayCtx.Provider>
}
