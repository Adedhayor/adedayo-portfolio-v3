// ============================================================
// DeskZone — a work desk (A) at [8,0,-1], yawed -0.5 rad toward
// the camera at [5.5,2,3.5]. Wood top on four legs, a monitor on
// a stand playing the first case study that has a live video
// (else the first cover), and the remaining case-study covers as
// small thin-framed boards leaning on two shelves behind the desk.
// ============================================================
import type { SoundRole } from '@/lib/sensory-ui'
import { getZone, type HotspotAction, type ScreenContent } from '../../data/playground'
import type { PlayPalette } from '../../hooks/usePlayColors'
import type { WorldMaterials } from '../materials'
import ScreenSurface from '../media/ScreenSurface'

type DeskProps = {
  palette: PlayPalette
  mats: WorldMaterials
  onAction: (action: HotspotAction, sound?: SoundRole) => void
}

const DESK_TOP = 0.95 // top-plank centre height
const DESK_SURFACE = DESK_TOP + 0.04 // top of the plank
const MONITOR_W = 1.5
const BOARD_W = 0.85

// Leaning covers: lower shelf holds up to 4, upper shelf the rest.
const SHELVES = [
  { y: 1.32, z: -0.62, per: 4, spacing: 0.92 },
  { y: 2.18, z: -0.62, per: 3, spacing: 0.92 },
]
// Deterministic per-board yaw jitter.
const BOARD_YAW = [0.05, -0.04, 0.03, -0.05, 0.04, -0.03, 0.05, -0.04]

function Board({
  screen,
  palette,
  mats,
  onAction,
  position,
  yaw,
}: {
  screen: ScreenContent
  palette: PlayPalette
  mats: WorldMaterials
  onAction: (action: HotspotAction, sound?: SoundRole) => void
  position: [number, number, number]
  yaw: number
}) {
  const boardH = BOARD_W * (10 / 16)
  return (
    <group position={position} rotation={[0.14, yaw, 0]}>
      <mesh position={[0, 0, -0.02]} material={mats.shellDark}>
        <boxGeometry args={[BOARD_W + 0.05, boardH + 0.05, 0.03]} />
      </mesh>
      <group position={[0, 0, 0.01]}>
        <ScreenSurface content={screen} palette={palette} width={BOARD_W} onAction={onAction} />
      </group>
    </group>
  )
}

export default function DeskZone({ palette, mats, onAction }: DeskProps) {
  const screens = getZone('desk').screens
  const monitorScreen = screens.find((s) => s.video) ?? screens[0]
  const boards = screens.filter((s) => s.id !== monitorScreen?.id)

  const monitorH = MONITOR_W * (10 / 16)
  const monitorCenterY = DESK_SURFACE + 0.3 + monitorH / 2

  // Slice the boards across the two shelves.
  let cut = 0
  const boardShelves = SHELVES.map((shelf) => {
    const slice = boards.slice(cut, cut + shelf.per)
    cut += shelf.per
    return { shelf, slice }
  })

  return (
    <group position={[8, 0, -1]} rotation={[0, -0.5, 0]}>
      {/* Desk top + legs */}
      <mesh position={[0, DESK_TOP, 0]} material={mats.wood}>
        <boxGeometry args={[2.5, 0.08, 1.1]} />
      </mesh>
      {(
        [
          [-1.1, -0.45],
          [1.1, -0.45],
          [-1.1, 0.45],
          [1.1, 0.45],
        ] as [number, number][]
      ).map(([lx, lz], i) => (
        <mesh key={i} position={[lx, DESK_TOP / 2, lz]} material={mats.shellDark}>
          <boxGeometry args={[0.09, DESK_TOP, 0.09]} />
        </mesh>
      ))}

      {/* Monitor on a stand */}
      <mesh position={[0, DESK_SURFACE + 0.02, -0.15]} material={mats.shellDark}>
        <boxGeometry args={[0.42, 0.04, 0.26]} />
      </mesh>
      <mesh position={[0, DESK_SURFACE + 0.17, -0.15]} material={mats.metal}>
        <boxGeometry args={[0.07, 0.26, 0.07]} />
      </mesh>
      <mesh position={[0, monitorCenterY, -0.16]} material={mats.shellDark}>
        <boxGeometry args={[MONITOR_W + 0.06, monitorH + 0.06, 0.05]} />
      </mesh>
      {monitorScreen && (
        <group position={[0, monitorCenterY, -0.13]}>
          <ScreenSurface content={monitorScreen} palette={palette} width={MONITOR_W} onAction={onAction} />
        </group>
      )}

      {/* Shelves of leaning case-study covers */}
      {boardShelves.map(({ shelf, slice }, si) => (
        <group key={si}>
          <mesh position={[0, shelf.y - 0.02, shelf.z]} material={mats.wood}>
            <boxGeometry args={[3.4, 0.05, 0.2]} />
          </mesh>
          {slice.map((screen, bi) => {
            const x = (bi - (slice.length - 1) / 2) * shelf.spacing
            const yawIdx = si * SHELVES[0].per + bi
            return (
              <Board
                key={screen.id}
                screen={screen}
                palette={palette}
                mats={mats}
                onAction={onAction}
                position={[x, shelf.y + 0.28, shelf.z + 0.08]}
                yaw={BOARD_YAW[yawIdx % BOARD_YAW.length]}
              />
            )
          })}
        </group>
      ))}
    </group>
  )
}
