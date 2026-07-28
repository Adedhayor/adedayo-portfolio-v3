// ============================================================
// Bench — the long lab counter: dark epoxy top over a run of
// under-cabinets with door fronts + knobs. Purely decorative
// (no hit targets; the station hotspots own the clicks).
// ============================================================
import type { LabMaterials } from './labMaterials'

const WIDTH = 6.8
const DEPTH = 1.0
const TOP_Y = 0.92
const TOP_T = 0.08
const CABINET_H = TOP_Y - TOP_T // 0.84
const DOORS = 4
const DOOR_GAP = 0.06

export const BENCH_TOP_Y = TOP_Y
export const BENCH_Z = -2.7

export default function Bench({ mats }: { mats: LabMaterials }) {
  const innerW = WIDTH - 0.12
  const doorW = (innerW - DOOR_GAP * (DOORS + 1)) / DOORS
  const frontZ = BENCH_Z + DEPTH / 2 - 0.02

  return (
    <group position={[0, 0, BENCH_Z]}>
      {/* Counter top */}
      <mesh position={[0, TOP_Y - TOP_T / 2, 0]} material={mats.benchTop} castShadow>
        <boxGeometry args={[WIDTH, TOP_T, DEPTH]} />
      </mesh>
      {/* Thin lip so the top reads as a slab */}
      <mesh position={[0, TOP_Y - TOP_T - 0.015, DEPTH / 2 - 0.01]} material={mats.metal}>
        <boxGeometry args={[WIDTH, 0.03, 0.03]} />
      </mesh>

      {/* Cabinet body */}
      <mesh position={[0, CABINET_H / 2, -0.04]} material={mats.cabinet}>
        <boxGeometry args={[WIDTH - 0.04, CABINET_H, DEPTH - 0.08]} />
      </mesh>
      {/* Toe-kick recess shadow strip */}
      <mesh position={[0, 0.05, frontZ - 0.06]} material={mats.benchTop}>
        <boxGeometry args={[WIDTH - 0.2, 0.1, 0.04]} />
      </mesh>

      {/* Door fronts + knobs */}
      {Array.from({ length: DOORS }, (_, i) => {
        const x = -innerW / 2 + DOOR_GAP + doorW / 2 + i * (doorW + DOOR_GAP)
        return (
          <group key={i} position={[x, CABINET_H / 2 + 0.06, frontZ]}>
            <mesh material={mats.cabinetDoor}>
              <boxGeometry args={[doorW, CABINET_H - 0.14, 0.04]} />
            </mesh>
            <mesh position={[doorW / 2 - 0.09, 0, 0.045]} material={mats.metal}>
              <sphereGeometry args={[0.028, 12, 12]} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
