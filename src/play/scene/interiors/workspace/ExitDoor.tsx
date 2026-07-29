// ============================================================
// ExitDoor (W3) — a door built into the right wall around the
// workspace's exit hotspot ([2.6, 1.15, -1.4] — the shared
// Hotspots layer renders the clickable EXIT marker there; this is
// the scenery it points at). Slab + jambs + inset panels + knob +
// a small glowing sign strip above the frame.
// ============================================================
import type { PlayPalette } from '../../../hooks/usePlayColors'
import { type WorldMaterials } from '../../materials'

export default function ExitDoor({
  palette,
  mats,
  position,
  rotationY,
}: {
  palette: PlayPalette
  mats: WorldMaterials
  position: [number, number, number]
  rotationY: number
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Jambs + header */}
      <mesh position={[-0.55, 1.08, 0]} material={mats.wood}>
        <boxGeometry args={[0.09, 2.2, 0.11]} />
      </mesh>
      <mesh position={[0.55, 1.08, 0]} material={mats.wood}>
        <boxGeometry args={[0.09, 2.2, 0.11]} />
      </mesh>
      <mesh position={[0, 2.22, 0]} material={mats.wood}>
        <boxGeometry args={[1.19, 0.09, 0.11]} />
      </mesh>

      {/* Slab + two inset panels */}
      <mesh position={[0, 1.06, -0.01]} material={mats.shellDark}>
        <boxGeometry args={[1.0, 2.12, 0.06]} />
      </mesh>
      <mesh position={[0, 1.55, 0.02]} material={mats.shell}>
        <boxGeometry args={[0.74, 0.78, 0.02]} />
      </mesh>
      <mesh position={[0, 0.6, 0.02]} material={mats.shell}>
        <boxGeometry args={[0.74, 0.78, 0.02]} />
      </mesh>

      {/* Knob */}
      <mesh position={[0.38, 1.05, 0.05]} material={mats.metal}>
        <sphereGeometry args={[0.038, 12, 12]} />
      </mesh>

      {/* Glowing sign strip above the frame (label text comes from the
          shared EXIT hotspot marker) */}
      <mesh position={[0, 2.4, 0.03]}>
        <planeGeometry args={[0.5, 0.14]} />
        <meshBasicMaterial color={palette.cyan} toneMapped={false} />
      </mesh>
    </group>
  )
}
