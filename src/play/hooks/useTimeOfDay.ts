// ============================================================
// useTimeOfDay — SHARED CONTRACT (integrator-owned). The outside
// scenery follows the VISITOR's local clock, same philosophy as
// the footer's LocalTime: day ≈ 07–17, dusk ≈ 17–20 (the built
// golden-hour look), night ≈ 20–07. Re-checked each minute while
// anyone subscribes; a manual override (HUD sun/moon chip) wins
// until cleared. Module store so scene components inside the
// Canvas reconciler can subscribe without contexts.
//
// Consumers: the Outside workstream reads the band and drives
// sky/fog/lights/lamps/headlights; the HUD chip calls
// cycleTimeOfDay(). Session-only override, not persisted.
// ============================================================
import { useSyncExternalStore } from 'react'

export type TimeOfDay = 'day' | 'dusk' | 'night'

const ORDER: TimeOfDay[] = ['day', 'dusk', 'night']

function bandForHour(hour: number): TimeOfDay {
  if (hour >= 7 && hour < 17) return 'day'
  if (hour >= 17 && hour < 20) return 'dusk'
  return 'night'
}

let override: TimeOfDay | null = null
let current: TimeOfDay = bandForHour(new Date().getHours())
const listeners = new Set<() => void>()
let ticker: ReturnType<typeof setInterval> | null = null

function recompute() {
  const next = override ?? bandForHour(new Date().getHours())
  if (next === current) return
  current = next
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  // Tick the clock only while someone is watching.
  if (!ticker) ticker = setInterval(recompute, 60_000)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0 && ticker) {
      clearInterval(ticker)
      ticker = null
    }
  }
}

export function getTimeOfDay(): TimeOfDay {
  return current
}

/** Manual override (null returns to the visitor's clock). */
export function setTimeOfDayOverride(value: TimeOfDay | null) {
  override = value
  recompute()
}

/** HUD sun/moon chip: day → dusk → night → day. Returns the new band. */
export function cycleTimeOfDay(): TimeOfDay {
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length]
  setTimeOfDayOverride(next)
  return next
}

export function useTimeOfDay(): TimeOfDay {
  return useSyncExternalStore(subscribe, getTimeOfDay)
}
