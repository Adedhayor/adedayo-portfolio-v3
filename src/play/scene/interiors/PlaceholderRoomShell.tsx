// ============================================================
// PlaceholderRoomShell — W0 scaffolding for the interiors. A
// minimal enclosed room (floor + 3 walls + interior light + a
// dark backdrop) with the place's screens hung on the back wall
// via ScreenSurface, plus an invisible hit-plane per screen that
// opens the lightbox stub. The EXIT + any in-room hotspots come
// through PlayWorld's shared Hotspots layer, not this component.
//
// W2/W3/W4 replace their place's PlaceholderRoom.tsx with the real
// Wall of Arts / Workspace / Chemistry Lab; this shell can then be
// deleted. Geometry is kept in sync with INTERIOR_CAMERA/ORBIT in
// data/playground.ts (camera stands at z≈3.2 looking at z=-4).
// ============================================================
import { useMemo } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import type { SoundRole } from '@/lib/sensory-ui'
import type { HotspotAction, Place } from '../../data/playground'
import type { PlayPalette } from '../../hooks/usePlayColors'
import { mixColor } from '../materials'
import ScreenSurface from '../media/ScreenSurface'

const HALF_W = 5 // room spans x −5..5
const HALF_D = 4 // room spans z −4..4
const WALL_H = 5
const WALL_T = 0.2
const BACK_Z = -HALF_D + WALL_T / 2 // wall centre
const SCREEN_Z = -HALF_D + WALL_T + 0.02 // just in front of the back wall face

// Back-wall screen grid.
const COLS = 3
const CELL_W = 2.0
const GAP_X = 0.6
const GAP_Y = 0.6
const CENTER_Y = 2.15

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = []
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size))
  return rows
}

export default function PlaceholderRoomShell({
  place,
  palette,
  onAction,
}: {
  place: Place
  palette: PlayPalette
  onAction: (action: HotspotAction, sound?: SoundRole) => void
}) {
  const colors = useMemo(
    () => ({
      floor: mixColor(palette.surfaceRaised, palette.ink, 0.42),
      wall: mixColor(palette.surfaceRaised, palette.ink, 0.24),
      wallBack: mixColor(palette.surfaceRaised, palette.ink, 0.3),
      background: mixColor(palette.ink, palette.blue, 0.12),
    }),
    [palette],
  )

  const screens = place.interior.screens
  const rows = useMemo(() => chunk(screens, COLS), [screens])
  const rowH = CELL_W * (10 / 16) + GAP_Y
  const topY = CENTER_Y + ((rows.length - 1) * rowH) / 2

  return (
    // Fragment (not a group) so background/fog attach to the SCENE, not a
    // group object. The room is authored in world space, centred at origin.
    <>
      {/* Room void behind the (roofless) walls, so you never see canvas black. */}
      <color attach="background" args={[`#${colors.background.getHexString()}`]} />
      <fog attach="fog" args={[`#${colors.background.getHexString()}`, 10, 26]} />

      {/* Interior lighting — soft + neutral so screens/frames always read. */}
      <ambientLight intensity={0.75} />
      <hemisphereLight args={[palette.surfaceRaised, palette.ink, 0.4]} />
      <pointLight position={[0, WALL_H - 0.6, 1.2]} intensity={5} distance={16} color={palette.surfaceRaised} />
      <pointLight position={[0, 2.4, -2]} intensity={3} distance={10} color={palette.cyan} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[HALF_W * 2, HALF_D * 2]} />
        <meshStandardMaterial color={colors.floor} roughness={0.95} metalness={0} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, WALL_H / 2, BACK_Z]}>
        <boxGeometry args={[HALF_W * 2, WALL_H, WALL_T]} />
        <meshStandardMaterial color={colors.wallBack} roughness={0.9} metalness={0} />
      </mesh>
      {/* Side walls */}
      <mesh position={[-HALF_W + WALL_T / 2, WALL_H / 2, 0]}>
        <boxGeometry args={[WALL_T, WALL_H, HALF_D * 2]} />
        <meshStandardMaterial color={colors.wall} roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[HALF_W - WALL_T / 2, WALL_H / 2, 0]}>
        <boxGeometry args={[WALL_T, WALL_H, HALF_D * 2]} />
        <meshStandardMaterial color={colors.wall} roughness={0.9} metalness={0} />
      </mesh>

      {/* Screens on the back wall + a transparent hit-plane each → lightbox. */}
      {rows.map((row, r) =>
        row.map((screen, c) => {
          const x = (c - (row.length - 1) / 2) * (CELL_W + GAP_X)
          const y = topY - r * rowH
          const h = CELL_W * ((screen.aspect?.[1] ?? 10) / (screen.aspect?.[0] ?? 16))
          return (
            <group key={screen.id} position={[x, y, SCREEN_Z]}>
              <ScreenSurface content={screen} palette={palette} width={CELL_W} />
              <mesh
                position={[0, 0, 0.03]}
                onClick={(e: ThreeEvent<MouseEvent>) => {
                  e.stopPropagation()
                  onAction({ kind: 'lightbox', screenId: screen.id })
                }}
                onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                  e.stopPropagation()
                  document.body.style.cursor = 'pointer'
                }}
                onPointerOut={() => (document.body.style.cursor = '')}
              >
                <planeGeometry args={[CELL_W, h]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
              </mesh>
            </group>
          )
        }),
      )}
    </>
  )
}
