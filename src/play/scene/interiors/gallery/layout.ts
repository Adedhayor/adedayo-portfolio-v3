// ============================================================
// Gallery hang layout — W2 (Wall of Arts).
// Room dimensions + the fixed hang. Screens arrive in the order
// tvWall.screens defines (emonie, ebank-group, nukodes, postpaddy,
// spotifeed, family-tree); SLOTS is zipped by index so the hang
// stays stable even if ids change.
//
// The camera stands at interior.camera [0,1.6,3.2] and orbits the
// far-wall centre with clamps az ±0.55 / dist 2.4–4.6, so the far
// wall + both side-wall rears all sit in the gaze cone.
// ============================================================
import { moreWork } from '@/data'
import type { ScreenContent } from '../../../data/playground'

export type FrameProfile = 'metal' | 'box' | 'classic'
export type Wall = 'far' | 'left' | 'right'

export type Slot = {
  wall: Wall
  position: [number, number, number]
  rotationY: number
  width: number
  profile: FrameProfile
}

/** Room, world space, centred at origin. Far wall faces the camera at
    z≈-3.9; open front (behind camera) at z=frontZ; only 3 walls. */
export const ROOM = {
  halfW: 3.2,
  halfD: 4.0, // far wall centre z = -4
  frontZ: 3.2, // floor front edge (open — no wall behind the camera)
  wallH: 4.0,
  wallT: 0.2,
  eye: 1.55,
  railY: 2.62,
  skirtH: 0.16,
} as const

export const FAR_FACE = -ROOM.halfD + ROOM.wallT / 2 // -3.9
export const LEFT_FACE = -ROOM.halfW + ROOM.wallT / 2 // -3.1
export const RIGHT_FACE = ROOM.halfW - ROOM.wallT / 2 // +3.1
/** Mid-point of the side walls / floor along z (far wall .. open front). */
export const MID_Z = (ROOM.frontZ + -ROOM.halfD) / 2
export const DEPTH_SPAN = ROOM.frontZ + ROOM.halfD

const E = ROOM.eye

// Main wall = 3 (one oversized hero centred), left wall = 2, right wall = 1.
export const SLOTS: Slot[] = [
  { wall: 'far', position: [-1.9, E, FAR_FACE], rotationY: 0, width: 1.34, profile: 'classic' },
  { wall: 'far', position: [0, E, FAR_FACE], rotationY: 0, width: 1.78, profile: 'box' }, // hero
  { wall: 'far', position: [1.9, E, FAR_FACE], rotationY: 0, width: 1.34, profile: 'metal' },
  { wall: 'left', position: [LEFT_FACE, E, -1.5], rotationY: Math.PI / 2, width: 1.2, profile: 'metal' },
  { wall: 'left', position: [LEFT_FACE, E, -3.0], rotationY: Math.PI / 2, width: 1.2, profile: 'classic' },
  { wall: 'right', position: [RIGHT_FACE, E, -3.0], rotationY: -Math.PI / 2, width: 1.2, profile: 'box' },
]

/** Right-wall exit door — wrapped around the data exit hotspot
    [2.6, 1.15, -1.4]. z is the door centre along the right wall. */
export const EXIT_DOOR = { faceX: RIGHT_FACE, z: -1.4 } as const

/** Gallery-label tag per work. moreWork carries the real tags (keyed by
    title so it never drifts); the two side projects get a local fallback. */
const TAG_BY_TITLE = new Map(moreWork.map((m) => [m.title, m.tag]))
const TAG_FALLBACK: Record<string, string> = {
  spotifeed: 'Side project · Rive',
  'family-tree': 'Side project',
}

export function captionFor(screen: ScreenContent): { title: string; tag: string } {
  const tag = TAG_BY_TITLE.get(screen.title) ?? TAG_FALLBACK[screen.id] ?? 'Project'
  return { title: screen.title, tag }
}
