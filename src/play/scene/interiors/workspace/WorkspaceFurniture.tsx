// ============================================================
// WorkspaceFurniture (W3) — the room's dressing, primitives only:
//   • Desk       — wood plank on four legs (the monitor's home)
//   • Chair      — office chair (disc base, post, seat, back)
//   • Laptop     — half-open, glowing screen plane
//   • ShelfUnit  — wall shelf: instanced books (per-instance color
//                  from the palette accents) + a potted plant whose
//                  leaves sway gently (reduced-motion gated)
//   • LeaningBoards — 2–3 case-study covers as small poster boards
//                  leaning on the floor behind the desk, decorative
//                  (no actions; video/action stripped, distinct ids
//                  so the videoPool never targets them)
// Instanced meshes seed matrices in layout effects + invalidate()
// so they paint under the demand frameloop too (LabEchoes pattern).
// ============================================================
import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import type { ScreenContent } from '../../../data/playground'
import type { PlayPalette } from '../../../hooks/usePlayColors'
import { mixColor, type WorldMaterials } from '../../materials'
import ScreenSurface from '../../media/ScreenSurface'

/** Deterministic pseudo-random in [0,1) — stable dressing, no Math.random. */
function rand(i: number, salt: number) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}

// ------------------------------------------------------------
// Desk — top plank + four legs. Origin at the floor, top at DESK_TOP.
// ------------------------------------------------------------
export const DESK_TOP = 0.92
export const DESK_SURFACE = DESK_TOP + 0.04

export function Desk({ mats }: { mats: WorldMaterials }) {
  return (
    <group>
      <mesh position={[0, DESK_TOP, 0]} material={mats.wood}>
        <boxGeometry args={[2.7, 0.08, 1.15]} />
      </mesh>
      {(
        [
          [-1.2, -0.47],
          [1.2, -0.47],
          [-1.2, 0.47],
          [1.2, 0.47],
        ] as [number, number][]
      ).map(([lx, lz], i) => (
        <mesh key={i} position={[lx, DESK_TOP / 2, lz]} material={mats.shellDark}>
          <boxGeometry args={[0.09, DESK_TOP, 0.09]} />
        </mesh>
      ))}
    </group>
  )
}

// ------------------------------------------------------------
// Chair — pushed back from the desk, slightly turned, as if the
// owner just stepped away.
// ------------------------------------------------------------
export function Chair({ mats }: { mats: WorldMaterials }) {
  return (
    <group>
      <mesh position={[0, 0.03, 0]} material={mats.shellDark}>
        <cylinderGeometry args={[0.3, 0.32, 0.05, 16]} />
      </mesh>
      <mesh position={[0, 0.26, 0]} material={mats.metal}>
        <cylinderGeometry args={[0.035, 0.035, 0.42, 10]} />
      </mesh>
      <mesh position={[0, 0.49, 0]} material={mats.shell}>
        <boxGeometry args={[0.46, 0.07, 0.44]} />
      </mesh>
      <mesh position={[0, 0.82, -0.21]} rotation={[-0.1, 0, 0]} material={mats.shell}>
        <boxGeometry args={[0.44, 0.58, 0.06]} />
      </mesh>
    </group>
  )
}

// ------------------------------------------------------------
// Laptop — half-open on the desk, inner screen glowing. The lid
// hinges at the back edge and leans forward over the keys (the
// "stepped away mid-task" pose). Glow tint follows the palette.
// ------------------------------------------------------------
export function Laptop({ palette, mats }: { palette: PlayPalette; mats: WorldMaterials }) {
  const glow = useMemo(() => mixColor(palette.cyan, palette.surfaceRaised, 0.25), [palette])
  const keys = useMemo(() => mixColor(palette.ink, palette.cyan, 0.25), [palette])
  return (
    <group>
      {/* Base + keyboard tint */}
      <mesh position={[0, 0.012, 0]} material={mats.shellDark}>
        <boxGeometry args={[0.36, 0.024, 0.25]} />
      </mesh>
      <mesh position={[0, 0.025, 0.01]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 0.16]} />
        <meshBasicMaterial color={keys} toneMapped={false} transparent opacity={0.5} />
      </mesh>
      {/* Lid — hinged at the back edge, ~57° up, leaning over the base */}
      <group position={[0, 0.024, -0.125]} rotation={[-1.0, 0, 0]}>
        <mesh position={[0, 0, 0.115]} material={mats.shellDark}>
          <boxGeometry args={[0.36, 0.02, 0.25]} />
        </mesh>
        {/* Inner screen face — the glow */}
        <mesh position={[0, -0.011, 0.115]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.33, 0.21]} />
          <meshBasicMaterial color={glow} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

// ------------------------------------------------------------
// ShelfUnit — a wood shelf on the wall: a row of instanced books
// (per-instance palette-accent colors) and a potted plant. The
// plant's leaves sway; reduced motion freezes them at the seed pose.
// ------------------------------------------------------------
const BOOKS = 9
const LEAVES = 8

export function ShelfUnit({
  palette,
  mats,
  reducedMotion,
}: {
  palette: PlayPalette
  mats: WorldMaterials
  reducedMotion: boolean
}) {
  const invalidate = useThree((s) => s.invalidate)
  const booksRef = useRef<THREE.InstancedMesh>(null)
  const leavesRef = useRef<THREE.InstancedMesh>(null)
  const leavesGroup = useRef<THREE.Group>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const scratch = useMemo(() => new THREE.Color(), [])
  const inkScratch = useMemo(() => new THREE.Color(), [])
  const leafColor = useMemo(() => mixColor(palette.cyan, palette.ink, 0.55), [palette])

  // Books: varied widths/heights along the shelf, one slightly leaning,
  // spines tinted from the palette accents (instance colors).
  useLayoutEffect(() => {
    const mesh = booksRef.current
    if (!mesh) return
    const accents = [palette.blue, palette.coral, palette.yellow, palette.cyan, palette.borderDefault]
    let x = -0.86
    for (let i = 0; i < BOOKS; i++) {
      const w = 0.045 + rand(i, 4) * 0.03
      const h = 0.24 + rand(i, 5) * 0.1
      const lean = i === BOOKS - 3 ? 0.16 : 0
      dummy.position.set(x + w / 2, h / 2 + 0.026, 0)
      dummy.rotation.set(0, 0, lean)
      dummy.scale.set(w, h, 0.19)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      inkScratch.set(palette.ink)
      scratch.set(accents[i % accents.length]).lerp(inkScratch, 0.2 + rand(i, 6) * 0.2)
      mesh.setColorAt(i, scratch)
      x += w + 0.014 + lean * 0.12
    }
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    invalidate()
  }, [palette, dummy, scratch, inkScratch, invalidate])

  // Plant leaves: a fan of cones around the pot's centre.
  useLayoutEffect(() => {
    const mesh = leavesRef.current
    if (!mesh) return
    for (let i = 0; i < LEAVES; i++) {
      if (i === LEAVES - 1) {
        dummy.position.set(0, 0.1, 0)
        dummy.rotation.set(0, 0, 0)
      } else {
        const a = (i / (LEAVES - 1)) * Math.PI * 2
        const lean = 0.42 + rand(i, 7) * 0.22
        dummy.position.set(Math.cos(a) * 0.05, 0.08, Math.sin(a) * 0.05)
        dummy.rotation.set(Math.sin(a) * lean, 0, -Math.cos(a) * lean)
      }
      dummy.scale.setScalar(0.85 + rand(i, 8) * 0.35)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
    invalidate()
  }, [dummy, invalidate])

  // Idle sway — reduced-motion gated; the world runs frameloop='always'
  // otherwise, so no invalidate needed here.
  useFrame((state) => {
    if (reducedMotion || !leavesGroup.current) return
    leavesGroup.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.9) * 0.045
  })

  return (
    <group>
      {/* Shelf board + brackets */}
      <mesh material={mats.wood}>
        <boxGeometry args={[2.0, 0.05, 0.28]} />
      </mesh>
      <mesh position={[-0.8, -0.09, -0.08]} material={mats.shellDark}>
        <boxGeometry args={[0.04, 0.14, 0.1]} />
      </mesh>
      <mesh position={[0.8, -0.09, -0.08]} material={mats.shellDark}>
        <boxGeometry args={[0.04, 0.14, 0.1]} />
      </mesh>

      {/* Books */}
      <instancedMesh ref={booksRef} args={[undefined, undefined, BOOKS]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffffff" roughness={0.88} metalness={0} />
      </instancedMesh>

      {/* Plant */}
      <group position={[0.78, 0.026, 0]}>
        <mesh position={[0, 0.075, 0]} material={mats.accentCoral}>
          <cylinderGeometry args={[0.085, 0.065, 0.15, 12]} />
        </mesh>
        <group ref={leavesGroup} position={[0, 0.15, 0]}>
          <instancedMesh ref={leavesRef} args={[undefined, undefined, LEAVES]}>
            <coneGeometry args={[0.042, 0.27, 7]} />
            <meshStandardMaterial color={leafColor} roughness={0.9} metalness={0} />
          </instancedMesh>
        </group>
      </group>
    </group>
  )
}

// ------------------------------------------------------------
// LeaningBoards — case-study covers as poster boards leaning on
// the wall behind the desk. Pure decoration: actions + video are
// stripped and ids are namespaced so neither the lightbox nor the
// videoPool ever addresses them; SVG covers are skipped (the
// screen contract can't texture them).
// ------------------------------------------------------------
const BOARD_W = 0.8
// Negative pitch leans the board's top BACK against the wall at z≈-3.8.
const BOARD_SLOTS: { x: number; z: number; yaw: number }[] = [
  { x: -2.15, z: -3.7, yaw: 0.07 },
  { x: -1.6, z: -3.64, yaw: -0.09 },
  { x: 2.02, z: -3.7, yaw: 0.05 },
]

export function LeaningBoards({
  screens,
  palette,
  mats,
}: {
  screens: ScreenContent[]
  palette: PlayPalette
  mats: WorldMaterials
}) {
  const boards = useMemo(
    () =>
      screens
        .filter((s) => s.poster && !s.poster.toLowerCase().endsWith('.svg'))
        .slice(0, BOARD_SLOTS.length)
        .map(
          (s): ScreenContent => ({
            id: `ws-board-${s.id}`,
            title: s.title,
            poster: s.poster,
            aspect: s.aspect ?? [16, 10],
          }),
        ),
    [screens],
  )
  const boardH = BOARD_W * (10 / 16)

  return (
    <>
      {boards.map((board, i) => {
        const slot = BOARD_SLOTS[i]
        return (
          <group
            key={board.id}
            position={[slot.x, boardH / 2 + 0.02, slot.z]}
            rotation={[-0.15, slot.yaw, 0]}
          >
            <mesh position={[0, 0, -0.02]} material={mats.shellDark}>
              <boxGeometry args={[BOARD_W + 0.05, boardH + 0.05, 0.03]} />
            </mesh>
            <group position={[0, 0, 0.01]}>
              <ScreenSurface content={board} palette={palette} width={BOARD_W} />
            </group>
          </group>
        )
      })}
    </>
  )
}
