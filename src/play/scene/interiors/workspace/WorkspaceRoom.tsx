// ============================================================
// WorkspaceRoom (W3) — the studio-cabin interior behind the
// workspace façade. Replaces the W0 placeholder room.
//
// Layout (world space, camera stands at [0,1.6,3.2] looking at
// the back wall per getPlace('workspace').interior):
//   back wall  z=-3.9 : window (left) + shelf w/ books+plant (right)
//   desk       z=-3.0 : MonitorCarousel (the hero) + half-open laptop
//   floor              : rug, chair pushed back, leaning cover boards
//   right wall z=-1.4 : exit door scenery under the shared EXIT marker
//
// Room lighting is constant (screens must always read); ONLY the
// window + its glow light follow the visitor-local time of day.
// Background/fog attach at scene level (fragment, not a group) —
// safe because only one location's scene is ever mounted.
// ============================================================
import { useMemo } from 'react'
import type { SoundRole } from '@/lib/sensory-ui'
import { getPlace, type HotspotAction } from '../../../data/playground'
import type { PlayPalette } from '../../../hooks/usePlayColors'
import { useReducedMotionFlag } from '../../../hooks/useViewMode'
import { mixColor, useWorldMaterials } from '../../materials'
import { roomColors } from './roomColors'
import MonitorCarousel from './MonitorCarousel'
import WindowPlane from './WindowPlane'
import ExitDoor from './ExitDoor'
import { Chair, Desk, Laptop, LeaningBoards, ShelfUnit } from './WorkspaceFurniture'

const HALF_W = 5 // room spans x −5..5
const HALF_D = 4 // room spans z −4..4
const WALL_H = 3.6
const WALL_T = 0.2
const BACK_Z = -HALF_D + WALL_T / 2

const WORKSPACE = getPlace('workspace')

export default function WorkspaceRoom({
  palette,
  onAction,
  onStepSound,
}: {
  palette: PlayPalette
  onAction: (action: HotspotAction, sound?: SoundRole) => void
  /** Carousel step sting — threaded from PlayWorld to MonitorCarousel. */
  onStepSound?: () => void
}) {
  const mats = useWorldMaterials(palette)
  // matchMedia-backed hook (no React context) — safe inside the Canvas.
  const reducedMotion = useReducedMotionFlag()
  const colors = useMemo(() => roomColors(palette), [palette])
  const keyLight = useMemo(() => mixColor(palette.yellow, palette.surfaceRaised, 0.75), [palette])
  const rug = useMemo(() => mixColor(palette.blue, palette.ink, 0.52), [palette])

  const screens = WORKSPACE.interior.screens
  const exitPos = WORKSPACE.interior.exit.position

  return (
    // Fragment (not a group) so background/fog attach to the SCENE.
    <>
      <color attach="background" args={[`#${colors.background.getHexString()}`]} />
      <fog attach="fog" args={[`#${colors.background.getHexString()}`, 10, 26]} />

      {/* Constant room lighting — warm key + neutral fills; the window
          adds its own clock-driven glow light. */}
      <ambientLight intensity={0.72} />
      <hemisphereLight args={[palette.surfaceRaised, palette.ink, 0.38]} />
      <pointLight position={[0.6, 3.1, -0.4]} intensity={4.5} distance={15} color={keyLight} />
      <pointLight position={[0, 2.1, -2.3]} intensity={1.6} distance={8} color={palette.cyan} />

      {/* Shell: floor, rug, walls, ceiling, skirting */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[HALF_W * 2, HALF_D * 2]} />
        <meshStandardMaterial color={colors.floor} roughness={0.95} metalness={0} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.3, 0.005, -1.9]}>
        <circleGeometry args={[1.5, 28]} />
        <meshStandardMaterial color={rug} roughness={0.98} metalness={0} />
      </mesh>
      <mesh position={[0, WALL_H / 2, BACK_Z]}>
        <boxGeometry args={[HALF_W * 2, WALL_H, WALL_T]} />
        <meshStandardMaterial color={colors.wallBack} roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[-HALF_W + WALL_T / 2, WALL_H / 2, 0]}>
        <boxGeometry args={[WALL_T, WALL_H, HALF_D * 2]} />
        <meshStandardMaterial color={colors.wall} roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[HALF_W - WALL_T / 2, WALL_H / 2, 0]}>
        <boxGeometry args={[WALL_T, WALL_H, HALF_D * 2]} />
        <meshStandardMaterial color={colors.wall} roughness={0.9} metalness={0} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, WALL_H, 0]}>
        <planeGeometry args={[HALF_W * 2, HALF_D * 2]} />
        <meshStandardMaterial color={colors.ceiling} roughness={0.96} metalness={0} />
      </mesh>
      {/* Skirting along the three walls */}
      <mesh position={[0, 0.07, BACK_Z + WALL_T / 2 + 0.02]} material={mats.shellDark}>
        <boxGeometry args={[HALF_W * 2 - WALL_T * 2, 0.14, 0.04]} />
      </mesh>
      <mesh position={[-HALF_W + WALL_T + 0.02, 0.07, 0]} material={mats.shellDark}>
        <boxGeometry args={[0.04, 0.14, HALF_D * 2 - WALL_T]} />
      </mesh>
      <mesh position={[HALF_W - WALL_T - 0.02, 0.07, 0]} material={mats.shellDark}>
        <boxGeometry args={[0.04, 0.14, HALF_D * 2 - WALL_T]} />
      </mesh>

      {/* Back wall: window (clock-driven) + shelf */}
      <WindowPlane palette={palette} mats={mats} position={[-2.9, 2.05, BACK_Z + WALL_T / 2 + 0.03]} />
      <group position={[2.95, 2.02, BACK_Z + WALL_T / 2 + 0.16]}>
        <ShelfUnit palette={palette} mats={mats} reducedMotion={reducedMotion} />
      </group>

      {/* Desk set: desk + hero monitor + laptop; chair pushed back */}
      <group position={[0, 0, -3.0]}>
        <Desk mats={mats} />
        <group position={[0, 0.96, -0.28]}>
          <MonitorCarousel
            screens={screens}
            palette={palette}
            mats={mats}
            onAction={onAction}
            onStepSound={onStepSound}
          />
        </group>
        <group position={[-1.0, 0.96, 0.22]} rotation={[0, 0.35, 0]}>
          <Laptop palette={palette} mats={mats} />
        </group>
      </group>
      <group position={[0.55, 0, -1.95]} rotation={[0, Math.PI - 0.5, 0]}>
        <Chair mats={mats} />
      </group>

      {/* Case-study covers leaning behind the desk — decoration only */}
      <LeaningBoards screens={screens} palette={palette} mats={mats} />

      {/* Exit door scenery on the right wall, behind the shared EXIT
          marker (contract position drives the z placement). */}
      <ExitDoor
        palette={palette}
        mats={mats}
        position={[HALF_W - WALL_T + 0.01, 0, exitPos[2]]}
        rotationY={-Math.PI / 2}
      />
    </>
  )
}
