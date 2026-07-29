// ============================================================
// roomColors — LOCAL palette helpers for the Workspace interior
// (W3). scene/materials.ts is a frozen read-only contract, so the
// room-surface tints + the window's time-of-day sky live here and
// only REUSE materials.ts's mixColor/duskTones. Everything derives
// from the palette so the room follows theme flips.
// ============================================================
import * as THREE from 'three'
import type { PlayPalette } from '../../../hooks/usePlayColors'
import type { TimeOfDay } from '../../../hooks/useTimeOfDay'
import { duskTones, mixColor } from '../../materials'

export type RoomColors = {
  floor: THREE.Color
  wall: THREE.Color
  wallBack: THREE.Color
  ceiling: THREE.Color
  background: THREE.Color
}

/** Warm studio-cabin room surfaces — a touch of coral in the floor,
    neutral walls, a slightly darker ceiling so the box reads as a room. */
export function roomColors(palette: PlayPalette): RoomColors {
  return {
    floor: mixColor(palette.coral, palette.ink, 0.66),
    wall: mixColor(palette.surfaceRaised, palette.ink, 0.28),
    wallBack: mixColor(palette.surfaceRaised, palette.ink, 0.34),
    ceiling: mixColor(palette.ink, palette.surfaceRaised, 0.22),
    background: mixColor(palette.ink, palette.blue, 0.14),
  }
}

export type SkyTones = {
  /** Top of the window gradient */
  zenith: THREE.Color
  /** Bottom of the window gradient */
  horizon: THREE.Color
  /** Sun/moon disc tint */
  disc: THREE.Color
  /** Rim light spilling into the room from the window */
  glow: THREE.Color
}

/** The sky seen through the window, by time-of-day band. Interiors
    only let the WINDOW (+ its rim light) follow the clock; room
    lighting stays constant so the monitor always reads (plan §2.5). */
export function windowSky(palette: PlayPalette, band: TimeOfDay): SkyTones {
  switch (band) {
    case 'day':
      return {
        zenith: mixColor(palette.blue, palette.surfaceRaised, 0.58),
        horizon: mixColor(palette.cyan, palette.surfaceRaised, 0.5),
        disc: mixColor(palette.yellow, palette.surfaceRaised, 0.32),
        glow: mixColor(palette.cyan, palette.surfaceRaised, 0.3),
      }
    case 'night':
      return {
        zenith: mixColor(palette.ink, palette.blue, 0.34),
        horizon: mixColor(palette.ink, palette.blue, 0.14),
        disc: mixColor(palette.cyan, palette.surfaceRaised, 0.55),
        glow: mixColor(palette.blue, palette.ink, 0.45),
      }
    case 'dusk':
    default: {
      const d = duskTones(palette)
      return {
        zenith: d.zenith,
        horizon: d.horizon,
        disc: mixColor(palette.coral, palette.yellow, 0.4),
        glow: mixColor(palette.coral, palette.yellow, 0.35),
      }
    }
  }
}
