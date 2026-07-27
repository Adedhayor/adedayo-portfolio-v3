// ============================================================
// YardZone — wayfinding props at the back of the diorama (A),
// around [0,0,-9], viewed from [0,2.5,-3]. A mailbox on a post
// (NOTES), a signpost with two angled boards (ABOUT), a fence
// run with instanced pickets and a gate frame (LEAVE THE YARD),
// a warm flickering lamp post, and a few scattered stones.
// Props are built under the yard hotspots at [-2,1.2,-9] /
// [0,1.6,-10] / [2,1.2,-9]. Lamp flicker is gated by reducedMotion.
// ============================================================
import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { PlayPalette } from '../../hooks/usePlayColors'
import type { WorldMaterials } from '../materials'

type YardProps = {
  palette: PlayPalette
  mats: WorldMaterials
  reducedMotion: boolean
}

// ------------------------------------------------------------
// Fence — instanced pickets + rails, with a gap for the gate.
// ------------------------------------------------------------
const FENCE_Z = -9.35
const PICKET_H = 0.8
const GATE_X = 2
const GATE_HALF = 0.7 // clear span left/right of gate centre

function Fence({ mats }: { mats: WorldMaterials }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const invalidate = useThree((s) => s.invalidate)
  const xs = useMemo(() => {
    const out: number[] = []
    for (let x = -4; x <= 4.001; x += 0.4) {
      if (x > GATE_X - GATE_HALF && x < GATE_X + GATE_HALF) continue
      out.push(Number(x.toFixed(3)))
    }
    return out
  }, [])

  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    xs.forEach((x, i) => {
      dummy.position.set(x, PICKET_H / 2, FENCE_Z)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
    invalidate()
  }, [xs, dummy, invalidate])

  // Rails span the two solid runs either side of the gate.
  const rails: { cx: number; len: number }[] = [
    { cx: (-4 + (GATE_X - GATE_HALF)) / 2, len: GATE_X - GATE_HALF + 4 },
    { cx: (GATE_X + GATE_HALF + 4) / 2, len: 4 - (GATE_X + GATE_HALF) },
  ]

  return (
    <group>
      <instancedMesh ref={ref} args={[undefined, undefined, xs.length]} material={mats.wood}>
        <boxGeometry args={[0.06, PICKET_H, 0.06]} />
      </instancedMesh>
      {rails.map((r, i) =>
        [0.28, 0.6].map((ry, j) => (
          <mesh key={`${i}-${j}`} position={[r.cx, ry, FENCE_Z]} material={mats.wood}>
            <boxGeometry args={[r.len, 0.05, 0.05]} />
          </mesh>
        )),
      )}
    </group>
  )
}

// ------------------------------------------------------------
// LampPost — warm point light with an optional gentle flicker.
// ------------------------------------------------------------
function LampPost({ palette, mats, reducedMotion }: YardProps) {
  const light = useRef<THREE.PointLight>(null)
  useFrame((state) => {
    if (reducedMotion || !light.current) return
    const t = state.clock.elapsedTime
    light.current.intensity = 4 + Math.sin(t * 9) * 0.25 + Math.sin(t * 23) * 0.12
  })
  return (
    <group position={[3.4, 0, -8]}>
      <mesh position={[0, 1.1, 0]} material={mats.metal}>
        <cylinderGeometry args={[0.05, 0.07, 2.2, 12]} />
      </mesh>
      <mesh position={[-0.22, 2.15, 0]} material={mats.metal}>
        <boxGeometry args={[0.5, 0.06, 0.06]} />
      </mesh>
      <mesh position={[-0.45, 2.05, 0]} material={mats.shellDark}>
        <boxGeometry args={[0.16, 0.14, 0.16]} />
      </mesh>
      <mesh position={[-0.45, 1.97, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial
          color={palette.yellow}
          emissive={palette.yellow}
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
      <pointLight ref={light} position={[-0.45, 1.95, 0]} color={palette.yellow} distance={6} intensity={4} />
    </group>
  )
}

// ------------------------------------------------------------
// Scattered stones / planters.
// ------------------------------------------------------------
const STONES: { p: [number, number, number]; r: number; ico: boolean; rot: number }[] = [
  { p: [-3.2, 0.18, -7.2], r: 0.22, ico: true, rot: 0.6 },
  { p: [1.0, 0.14, -6.6], r: 0.16, ico: false, rot: 1.2 },
  { p: [3.9, 0.2, -9.6], r: 0.2, ico: true, rot: 2.1 },
  { p: [-0.8, 0.12, -6.2], r: 0.13, ico: false, rot: 0.3 },
]

export default function YardZone({ palette, mats, reducedMotion }: YardProps) {
  return (
    <group>
      {/* Mailbox on a post — NOTES, at x=-2, z=-9 */}
      <group position={[-2, 0, -9]}>
        <mesh position={[0, 0.5, 0]} material={mats.shellDark}>
          <boxGeometry args={[0.09, 1.0, 0.09]} />
        </mesh>
        <mesh position={[0, 1.02, 0]} material={mats.shell}>
          <boxGeometry args={[0.34, 0.22, 0.5]} />
        </mesh>
        <mesh position={[0, 1.14, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.shell}>
          <cylinderGeometry args={[0.17, 0.17, 0.5, 16, 1, false, 0, Math.PI]} />
        </mesh>
        <mesh position={[0.2, 1.18, 0]} material={mats.accentCoral}>
          <boxGeometry args={[0.02, 0.16, 0.1]} />
        </mesh>
      </group>

      {/* Signpost with two angled boards — ABOUT, at x=0, z=-10 */}
      <group position={[0, 0, -10]}>
        <mesh position={[0, 0.8, 0]} material={mats.wood}>
          <cylinderGeometry args={[0.06, 0.06, 1.6, 12]} />
        </mesh>
        <mesh position={[0.26, 1.46, 0.02]} rotation={[0, 0.32, 0]} material={mats.wood}>
          <boxGeometry args={[0.7, 0.18, 0.04]} />
        </mesh>
        <mesh position={[-0.26, 1.18, 0.02]} rotation={[0, -0.36, 0]} material={mats.wood}>
          <boxGeometry args={[0.66, 0.16, 0.04]} />
        </mesh>
      </group>

      {/* Gate frame — LEAVE THE YARD, at x=2, z=-9 */}
      <group position={[GATE_X, 0, FENCE_Z]}>
        <mesh position={[-0.62, 0.55, 0]} material={mats.shellDark}>
          <boxGeometry args={[0.09, 1.1, 0.09]} />
        </mesh>
        <mesh position={[0.62, 0.55, 0]} material={mats.shellDark}>
          <boxGeometry args={[0.09, 1.1, 0.09]} />
        </mesh>
        <mesh position={[0, 1.12, 0]} material={mats.shellDark}>
          <boxGeometry args={[1.42, 0.1, 0.1]} />
        </mesh>
      </group>

      <Fence mats={mats} />
      <LampPost palette={palette} mats={mats} reducedMotion={reducedMotion} />

      {STONES.map((s, i) => (
        <mesh key={i} position={s.p} rotation={[s.rot, s.rot * 1.3, 0]} material={mats.shellDark}>
          {s.ico ? <icosahedronGeometry args={[s.r, 0]} /> : <dodecahedronGeometry args={[s.r, 0]} />}
        </mesh>
      ))}
    </group>
  )
}
