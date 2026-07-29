// ============================================================
// materials — palette-driven material set for the world (A).
// Everything derives from usePlayColors so the diorama follows
// light/dark theme flips; materials are created transparent so
// future opacity tweens never recompile shaders (seville trick),
// memoized per palette and disposed on change.
// ============================================================
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import type { PlayPalette } from '../hooks/usePlayColors'
import type { TimeOfDay } from '../hooks/useTimeOfDay'

export function mixColor(a: string, b: string, t: number): THREE.Color {
  return new THREE.Color(a).lerp(new THREE.Color(b), t)
}

export type WorldMaterials = {
  /** TV/desk bodies — raised surface pulled toward ink for dusk */
  shell: THREE.MeshStandardMaterial
  /** Bezels, posts, feet */
  shellDark: THREE.MeshStandardMaterial
  /** Desk top, sign boards — warm plank tone */
  wood: THREE.MeshStandardMaterial
  metal: THREE.MeshStandardMaterial
  accentYellow: THREE.MeshStandardMaterial
  accentCoral: THREE.MeshStandardMaterial
  accentBlue: THREE.MeshStandardMaterial
  accentCyan: THREE.MeshStandardMaterial
}

export function useWorldMaterials(palette: PlayPalette): WorldMaterials {
  const materials = useMemo<WorldMaterials>(() => {
    const make = (
      color: THREE.Color | string,
      opts: Partial<THREE.MeshStandardMaterialParameters> = {},
    ) =>
      new THREE.MeshStandardMaterial({
        color: color instanceof THREE.Color ? color : new THREE.Color(color),
        roughness: 0.85,
        metalness: 0.05,
        transparent: true,
        ...opts,
      })
    return {
      shell: make(mixColor(palette.surfaceRaised, palette.ink, 0.22)),
      shellDark: make(mixColor(palette.ink, palette.surfaceBase, 0.15), { roughness: 0.7 }),
      wood: make(mixColor(palette.coral, palette.ink, 0.58), { roughness: 0.92 }),
      metal: make(palette.borderDefault, { roughness: 0.4, metalness: 0.55 }),
      accentYellow: make(palette.yellow, { roughness: 0.6 }),
      accentCoral: make(palette.coral, { roughness: 0.6 }),
      accentBlue: make(palette.blue, { roughness: 0.6 }),
      accentCyan: make(palette.cyan, { roughness: 0.6 }),
    }
  }, [palette])

  useEffect(
    () => () => {
      Object.values(materials).forEach((m) => m.dispose())
    },
    [materials],
  )

  return materials
}

export type SkyTones = { horizon: THREE.Color; zenith: THREE.Color; groundCenter: THREE.Color }

/** Sky/ground tones per time-of-day band, derived from the palette so the
    horizon line stays coherent under theme flips (W1). Generalizes the old
    `duskTones` — dusk is the untouched golden-hour look; day leans pale-blue
    with a greener ground; night sinks to ink. Consumed by the outside
    environment lerp AND by interior windows that follow the visitor clock. */
export function skyTones(palette: PlayPalette, timeOfDay: TimeOfDay): SkyTones {
  switch (timeOfDay) {
    case 'day':
      return {
        // Pale, luminous horizon → bright blue-cyan zenith.
        horizon: mixColor(palette.surfaceBase, palette.cyan, 0.5),
        zenith: mixColor(palette.blue, palette.cyan, 0.4).lerp(
          new THREE.Color(palette.surfaceRaised),
          0.18,
        ),
        // Warm-lit turf: nudge the raised surface toward a muted grass green
        // (cyan+yellow with no green token to reach for).
        groundCenter: new THREE.Color(palette.surfaceRaised).lerp(
          mixColor(palette.cyan, palette.yellow, 0.5),
          0.34,
        ),
      }
    case 'night':
      return {
        horizon: mixColor(palette.ink, palette.blue, 0.28),
        zenith: mixColor(palette.ink, palette.blue, 0.08),
        groundCenter: mixColor(palette.ink, palette.surfaceRaised, 0.12),
      }
    case 'dusk':
    default:
      return {
        horizon: mixColor(palette.surfaceBase, palette.coral, 0.16).lerp(
          new THREE.Color(palette.ink),
          0.45,
        ),
        zenith: mixColor(palette.ink, palette.blue, 0.3),
        groundCenter: mixColor(palette.surfaceRaised, palette.ink, 0.35),
      }
  }
}

/** Back-compat alias — the golden-hour band. Retained so any consumer that
    still reaches for the original name keeps resolving to the dusk look. */
export function duskTones(palette: PlayPalette) {
  return skyTones(palette, 'dusk')
}
