// ============================================================
// CrtTv — a single stylized CRT television (A). Box shell with
// an inset dark bezel, the VideoScreen plane sitting proud of
// the bezel, a metal tuning knob and two cylinder feet. Origin
// sits at the floor so the TV-wall can stack rows flush.
// All colors come from the shared WorldMaterials set.
// ============================================================
import type { HotspotAction, ScreenContent } from '../../data/playground'
import type { PlayPalette } from '../../hooks/usePlayColors'
import type { WorldMaterials } from '../materials'
import ScreenSurface from '../media/ScreenSurface'

const FEET_H = 0.09
const BEZEL_M = 0.09
const DEPTH = 0.5

/** Body/screen dimensions for a CRT of the given screen width. */
export function crtDims(width: number, aspect: [number, number] = [16, 10]) {
  const [aw, ah] = aspect
  const screenH = width * (ah / aw)
  const bodyW = width + BEZEL_M * 2
  const bodyH = screenH + BEZEL_M * 2
  return { screenH, bodyW, bodyH, depth: DEPTH, feetH: FEET_H, total: FEET_H + bodyH }
}

/** Total height from floor to top — used by the TV wall to stack flush. */
export function crtHeight(width: number, aspect?: [number, number]) {
  return crtDims(width, aspect).total
}

export default function CrtTv({
  screen,
  palette,
  mats,
  width,
  onAction,
}: {
  screen: ScreenContent
  palette: PlayPalette
  mats: WorldMaterials
  width: number
  onAction?: (action: HotspotAction) => void
}) {
  const { screenH, bodyW, bodyH, depth, feetH } = crtDims(width, screen.aspect)
  const bodyY = feetH + bodyH / 2
  const footX = bodyW / 2 - 0.16

  return (
    <group>
      {/* Shell body */}
      <mesh position={[0, bodyY, 0]} material={mats.shell}>
        <boxGeometry args={[bodyW, bodyH, depth]} />
      </mesh>
      {/* Inset dark bezel around the screen */}
      <mesh position={[0, bodyY, depth / 2 - 0.015]} material={mats.shellDark}>
        <boxGeometry args={[width + 0.05, screenH + 0.05, 0.05]} />
      </mesh>
      {/* Screen plane, sitting ~0.03 proud of the bezel */}
      <group position={[0, bodyY, depth / 2 + 0.03]}>
        <ScreenSurface content={screen} palette={palette} width={width} onAction={onAction} />
      </group>
      {/* Tuning knob */}
      <mesh
        position={[bodyW / 2 - 0.13, feetH + 0.15, depth / 2]}
        rotation={[Math.PI / 2, 0, 0]}
        material={mats.metal}
      >
        <cylinderGeometry args={[0.045, 0.045, 0.06, 16]} />
      </mesh>
      {/* Two cylinder feet */}
      <mesh position={[-footX, feetH / 2, depth / 2 - 0.13]} material={mats.shellDark}>
        <cylinderGeometry args={[0.06, 0.075, feetH, 12]} />
      </mesh>
      <mesh position={[footX, feetH / 2, depth / 2 - 0.13]} material={mats.shellDark}>
        <cylinderGeometry args={[0.06, 0.075, feetH, 12]} />
      </mesh>
    </group>
  )
}
