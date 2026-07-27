// ============================================================
// TvWallZone — a hand-stacked pile of six CRT TVs (A) at
// [-8,0,-1], yawed +0.5 rad to face the camera at [-5.5,2,4].
// Rows of 3 / 2 / 1 from the floor up; the two live-video sets
// (eMonie, eBank Group) sit bottom-centre where the camera looks.
// Row heights are computed from CRT dimensions so rows sit flush
// with no interpenetration.
// ============================================================
import type { SoundRole } from '@/lib/sensory-ui'
import { getZone, type HotspotAction } from '../../data/playground'
import type { PlayPalette } from '../../hooks/usePlayColors'
import type { WorldMaterials } from '../materials'
import CrtTv, { crtHeight } from '../objects/CrtTv'

type TvWallProps = {
  palette: PlayPalette
  mats: WorldMaterials
  onAction: (action: HotspotAction, sound?: SoundRole) => void
}

const GAP = 0.14

// Rows from the bottom up; `screen` indexes zone.screens
// (0 eMonie, 1 eBank, 2 Nukodes, 3 PostPaddy, 4 Spotifeed, 5 Family Tree).
// Bottom row centres eMonie (widest) with eBank to its left.
const ROWS: { screen: number; width: number }[][] = [
  [
    { screen: 1, width: 1.55 },
    { screen: 0, width: 1.85 },
    { screen: 2, width: 1.5 },
  ],
  [
    { screen: 3, width: 1.7 },
    { screen: 4, width: 1.45 },
  ],
  [{ screen: 5, width: 1.55 }],
]

// Fixed per-TV yaw/z jitter (deterministic — no re-layout across renders).
const YAW = [0.03, -0.04, 0.025, -0.035, 0.04, -0.02]
const ZJIT = [0.04, -0.03, 0.03, -0.04, 0.02, -0.03]

export default function TvWallZone({ palette, mats, onAction }: TvWallProps) {
  const screens = getZone('tv-wall').screens

  let baseY = 0
  const placed = ROWS.flatMap((row) => {
    const totalW = row.reduce((s, sl) => s + sl.width, 0) + GAP * (row.length - 1)
    let cursor = -totalW / 2
    const items = row.map((sl) => {
      const x = cursor + sl.width / 2
      cursor += sl.width + GAP
      return { ...sl, x, y: baseY }
    })
    baseY += Math.max(...row.map((sl) => crtHeight(sl.width, screens[sl.screen]?.aspect)))
    return items
  })

  return (
    <group position={[-8, 0, -1]} rotation={[0, 0.5, 0]}>
      {placed.map((it) => {
        const screen = screens[it.screen]
        if (!screen) return null
        return (
          <group
            key={screen.id}
            position={[it.x, it.y, ZJIT[it.screen] ?? 0]}
            rotation={[0, YAW[it.screen] ?? 0, 0]}
          >
            <CrtTv screen={screen} palette={palette} mats={mats} width={it.width} onAction={onAction} />
          </group>
        )
      })}
    </group>
  )
}
