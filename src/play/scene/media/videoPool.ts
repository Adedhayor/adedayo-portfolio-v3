// ============================================================
// videoPool — OWNED BY THE MEDIA WORKSTREAM (C). Decides which
// screens may decode video right now (iOS tabs die if every TV
// plays at once). Module-level store so scene components can
// subscribe by id without threading props through the zone
// composition (the Canvas runs its own reconciler; no contexts).
//
// Budget: 3 concurrent on fine pointers, 1 on coarse (mobile).
// Priority: screens in the focused zone (data order), then the
// rest in world data order. Nothing plays before the gate tap.
// ============================================================
import { useEffect, useSyncExternalStore } from 'react'
import { usePlay } from '../../PlayContext'
import { zones } from '../../data/playground'

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
  const { phase, focusedZoneId, reducedMotion } = usePlay()

  useEffect(() => {
    // No autoplaying screens before the gate or for reduced-motion users.
    if (phase === 'gate' || reducedMotion) {
      setActiveScreens([])
      return
    }
    const budget = window.matchMedia('(pointer: coarse)').matches ? 1 : 3
    const ordered = [
      ...zones.filter((z) => z.id === focusedZoneId),
      ...zones.filter((z) => z.id !== focusedZoneId),
    ]
      .flatMap((z) => z.screens)
      .filter((s) => Boolean(s.video))
      .map((s) => s.id)
    setActiveScreens(ordered.slice(0, budget))
  }, [phase, focusedZoneId, reducedMotion])

  return null
}
