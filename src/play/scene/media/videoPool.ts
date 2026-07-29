// ============================================================
// videoPool — OWNED BY THE MEDIA WORKSTREAM (C). Decides which
// screens may decode video right now (iOS tabs die if every TV
// plays at once). Module-level store so scene components can
// subscribe by id without threading props through the scene
// composition (the Canvas runs its own reconciler; no contexts).
//
// Budget: 3 concurrent on fine pointers, 1 on coarse (mobile).
// Phase 2: eligibility = the ACTIVE location's screens only, in
// data order. Outside has no screens today (the stand-in TVs stay
// on posters); interiors play their own. Nothing before the gate.
// ============================================================
import { useEffect, useSyncExternalStore } from 'react'
import { usePlay } from '../../PlayContext'
import { getPlace } from '../../data/playground'

let activeIds: ReadonlySet<string> = new Set()
const listeners = new Set<() => void>()

function setActiveScreens(ids: string[]) {
  const next = new Set(ids)
  if (next.size === activeIds.size && [...next].every((id) => activeIds.has(id))) return
  activeIds = next
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Scene-side: may this screen play its video right now? */
export function useIsActiveScreen(id: string): boolean {
  return useSyncExternalStore(subscribe, () => activeIds.has(id))
}

/** DOM-side controller — mount once in PlayWorld, outside the Canvas. */
export function VideoPoolController() {
  const { phase, location, reducedMotion } = usePlay()

  useEffect(() => {
    // No autoplaying screens before the gate or for reduced-motion users.
    if (phase === 'gate' || reducedMotion) {
      setActiveScreens([])
      return
    }
    const budget = window.matchMedia('(pointer: coarse)').matches ? 1 : 3
    const screens = location === 'outside' ? [] : getPlace(location).interior.screens
    const ordered = screens.filter((s) => Boolean(s.video)).map((s) => s.id)
    setActiveScreens(ordered.slice(0, budget))
  }, [phase, location, reducedMotion])

  return null
}
