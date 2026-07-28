// ============================================================
// FumeHood — the Effects Studio screen mounted above the bench,
// dressed as a fume hood: a boxy frame with an angled hood visor
// on top and a sash lip below, wrapping the ScreenSurface plane.
// The screen keeps its own click-through action (effects-studio →
// external), so onAction is passed straight to ScreenSurface; the
// hood shell itself is non-interactive.
// ============================================================
import type { SoundRole } from '@/lib/sensory-ui'
import type { HotspotAction, ScreenContent } from '../../../data/playground'
import type { PlayPalette } from '../../../hooks/usePlayColors'
import ScreenSurface from '../../media/ScreenSurface'
import type { LabMaterials } from './labMaterials'

export default function FumeHood({
  screen,
  palette,
  mats,
  onAction,
  position,
  width,
}: {
  screen: ScreenContent
  palette: PlayPalette
  mats: LabMaterials
  onAction: (action: HotspotAction, sound?: SoundRole) => void
  position: [number, number, number]
  width: number
}) {
  const [aw, ah] = screen.aspect ?? [16, 10]
  const height = width * (ah / aw)
  const frameW = width + 0.5
  const frameH = height + 0.5
  const jamb = 0.16

  return (
    <group position={position}>
      {/* Back panel behind the screen */}
      <mesh position={[0, 0, -0.06]} material={mats.hood}>
        <boxGeometry args={[frameW, frameH, 0.08]} />
      </mesh>

      {/* Side jambs */}
      <mesh position={[-frameW / 2 + jamb / 2, 0, 0.06]} material={mats.hood}>
        <boxGeometry args={[jamb, frameH, 0.24]} />
      </mesh>
      <mesh position={[frameW / 2 - jamb / 2, 0, 0.06]} material={mats.hood}>
        <boxGeometry args={[jamb, frameH, 0.24]} />
      </mesh>
      {/* Sash lip below the screen */}
      <mesh position={[0, -frameH / 2 + jamb / 2, 0.12]} material={mats.metal}>
        <boxGeometry args={[frameW, jamb, 0.36]} />
      </mesh>
      {/* Top rail */}
      <mesh position={[0, frameH / 2 - jamb / 2, 0.06]} material={mats.hood}>
        <boxGeometry args={[frameW, jamb, 0.24]} />
      </mesh>

      {/* Angled hood visor — a plane raked forward over the top rail */}
      <mesh
        position={[0, frameH / 2 + 0.16, 0.22]}
        rotation={[-0.7, 0, 0]}
        material={mats.hood}
      >
        <boxGeometry args={[frameW, 0.06, 0.5]} />
      </mesh>
      {/* Duct stub rising off the hood */}
      <mesh position={[0, frameH / 2 + 0.42, 0.02]} material={mats.metal}>
        <cylinderGeometry args={[0.12, 0.14, 0.35, 16]} />
      </mesh>

      {/* The screen itself — clickable through its own action. */}
      <group position={[0, 0, 0.02]}>
        <ScreenSurface content={screen} palette={palette} width={width} onAction={onAction} />
      </group>
    </group>
  )
}
