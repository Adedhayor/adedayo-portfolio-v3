// ============================================================
// PlayContext — the world's single state surface. Every
// workstream (camera, HUD, panels, audio, scene) talks to the
// world ONLY through this context; nobody else owns state.
// Post-foundation this file is frozen — changes go through an
// integration PR.
// ============================================================
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { ZoneId } from './data/playground'
import { useReducedMotionFlag } from './hooks/useViewMode'

export type PlayPhase = 'gate' | 'intro' | 'overview' | 'focused'

export type PlayContextValue = {
  phase: PlayPhase
  focusedZoneId: ZoneId | null
  activePanelId: string | null
  /** World-level mute — drives the nested SensoryUIProvider AND the ambient bed */
  muted: boolean
  reducedMotion: boolean
  /** Gate tap → intro (or straight to overview under reduced motion) */
  enterWorld: () => void
  /** Camera rig calls this when the intro flight settles */
  introDone: () => void
  focusZone: (id: ZoneId) => void
  goOverview: () => void
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
  const [focusedZoneId, setFocusedZoneId] = useState<ZoneId | null>(null)
  const [activePanelId, setActivePanelId] = useState<string | null>(null)
  const [muted, setMuted] = useState(false)

  const enterWorld = useCallback(() => {
    setPhase((p) => (p === 'gate' ? (reducedMotion ? 'overview' : 'intro') : p))
  }, [reducedMotion])

  const introDone = useCallback(() => {
    setPhase((p) => (p === 'intro' ? 'overview' : p))
  }, [])

  const focusZone = useCallback((id: ZoneId) => {
    setFocusedZoneId(id)
    setPhase('focused')
  }, [])

  const goOverview = useCallback(() => {
    setFocusedZoneId(null)
    setActivePanelId(null)
    setPhase((p) => (p === 'focused' ? 'overview' : p))
  }, [])

  const openPanel = useCallback((id: string) => setActivePanelId(id), [])
  const closePanel = useCallback(() => setActivePanelId(null), [])

  const value = useMemo(
    () => ({
      phase,
      focusedZoneId,
      activePanelId,
      muted,
      reducedMotion,
      enterWorld,
      introDone,
      focusZone,
      goOverview,
      openPanel,
      closePanel,
      setMuted,
    }),
    [phase, focusedZoneId, activePanelId, muted, reducedMotion, enterWorld, introDone, focusZone, goOverview, openPanel, closePanel],
  )

  return <PlayCtx.Provider value={value}>{children}</PlayCtx.Provider>
}
