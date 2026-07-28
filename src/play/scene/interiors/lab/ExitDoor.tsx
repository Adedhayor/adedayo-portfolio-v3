// ============================================================
// ExitDoor — decoration built AROUND the exit hotspot position
// (the shared Hotspots layer renders the clickable EXIT marker +
// label; this adds no hit target). A framed doorway with a dark
// recessed panel, a kick plate, and a glowing green-teal exit
// sign above. Angled to face the standing camera.
// ============================================================
import type { PlayPalette } from '../../../hooks/usePlayColors'
import { mixColor } from '../../materials'
import type { LabMaterials } from './labMaterials'

const DOOR_W = 1.15
const DOOR_H = 2.15
const JAMB = 0.12

export default function ExitDoor({
  mats,
  palette,
  position,
  rotationY = -0.32,
}: {
  mats: LabMaterials
  palette: PlayPalette
  /** Base (floor-level) position; door rises from here */
  position: [number, number, number]
  rotationY?: number
}) {
  const panel = mixColor(palette.ink, palette.blue, 0.14)
  const [x, , z] = position

  return (
    <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      {/* Recessed door panel */}
      <mesh position={[0, DOOR_H / 2, -0.03]}>
        <boxGeometry args={[DOOR_W, DOOR_H, 0.05]} />
        <meshStandardMaterial color={panel} roughness={0.8} metalness={0.1} />
      </mesh>
      {/* Kick plate */}
      <mesh position={[0, 0.14, 0]} material={mats.metal}>
        <boxGeometry args={[DOOR_W - 0.08, 0.28, 0.03]} />
      </mesh>
      {/* Push bar */}
      <mesh position={[0, 1.0, 0.04]} material={mats.metal}>
        <boxGeometry args={[DOOR_W - 0.24, 0.06, 0.05]} />
      </mesh>

      {/* Frame — jambs + lintel */}
      <mesh position={[-DOOR_W / 2 - JAMB / 2, DOOR_H / 2, 0]} material={mats.hood}>
        <boxGeometry args={[JAMB, DOOR_H + JAMB, 0.16]} />
      </mesh>
      <mesh position={[DOOR_W / 2 + JAMB / 2, DOOR_H / 2, 0]} material={mats.hood}>
        <boxGeometry args={[JAMB, DOOR_H + JAMB, 0.16]} />
      </mesh>
      <mesh position={[0, DOOR_H + JAMB / 2, 0]} material={mats.hood}>
        <boxGeometry args={[DOOR_W + JAMB * 2, JAMB, 0.16]} />
      </mesh>

      {/* Glowing EXIT sign above the lintel */}
      <mesh position={[0, DOOR_H + 0.28, 0.06]} material={mats.exitSign}>
        <boxGeometry args={[0.62, 0.22, 0.05]} />
      </mesh>
    </group>
  )
}
