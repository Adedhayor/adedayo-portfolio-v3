// ============================================================
// YardProps — the wayfinding dressing of the outside world (W1,
// carried over from the Phase-1 YardZone). Mailbox (NOTES),
// signpost (ABOUT), gate frame (LEAVE), an instanced picket
// fence, warm lamp posts and scattered stones — now joined by a
// scatter of instanced grass tufts that breathe in the daytime.
//
// Time-of-day flows through the shared Env: lamp light + bulb glow
// scale with env.lamp (off by day, full at night); the grass sway
// amplitude rides env.grass and is silenced entirely under reduced
// motion (a single seeded pose, painted with one invalidate).
// ============================================================
import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { PlayPalette } from '../../hooks/usePlayColors'
import { mixColor, type WorldMaterials } from '../materials'
import type { Env } from './environment'

type YardProps = {
  palette: PlayPalette
  mats: WorldMaterials
  env: Env
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
// LampPost — warm point light + bulb, both gated by env.lamp so
// they switch OFF by day and glow at dusk/night. Gentle flicker
// only while lit and motion is allowed.
// ------------------------------------------------------------
function LampPost({ palette, mats, env, reducedMotion, position }: YardProps & { position: [number, number, number] }) {
  const light = useRef<THREE.PointLight>(null)
  const bulb = useRef<THREE.MeshStandardMaterial>(null)
  useFrame((state) => {
    const l = light.current
    if (!l) return
    const flicker = reducedMotion
      ? 1
      : 1 + Math.sin(state.clock.elapsedTime * 9) * 0.06 + Math.sin(state.clock.elapsedTime * 23) * 0.03
    l.intensity = 4 * env.lamp * flicker
    if (bulb.current) bulb.current.emissiveIntensity = 2.2 * env.lamp
  })
  return (
    <group position={position}>
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
          ref={bulb}
          color={palette.yellow}
          emissive={palette.yellow}
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
      <pointLight ref={light} position={[-0.45, 1.95, 0]} color={palette.yellow} distance={6} intensity={0} />
    </group>
  )
}

// ------------------------------------------------------------
// Grass — instanced tufts that lean in the breeze (daytime).
// Geometry pivots at its base so the sway reads as a bend.
// ------------------------------------------------------------
const TUFTS = 46
function Grass({ palette, env, reducedMotion }: Pick<YardProps, 'palette' | 'env' | 'reducedMotion'>) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const invalidate = useThree((s) => s.invalidate)

  const blades = useMemo(() => {
    const out: { x: number; z: number; s: number; phase: number }[] = []
    for (let i = 0; i < TUFTS; i++) {
      // Scatter across the near yard, skipping the very centre path.
      const x = (Math.random() - 0.5) * 15
      const z = -1 + Math.random() * 7
      if (Math.abs(x) < 1.2 && z > 1) continue
      out.push({ x, z, s: 0.7 + Math.random() * 0.7, phase: Math.random() * Math.PI * 2 })
    }
    return out
  }, [])

  // Blade pivots at its base (geometry translated up half its height).
  const geo = useMemo(() => {
    const g = new THREE.ConeGeometry(0.03, 0.34, 4)
    g.translate(0, 0.17, 0)
    return g
  }, [])
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: mixColor(palette.cyan, palette.yellow, 0.5).lerp(new THREE.Color(palette.ink), 0.32),
        roughness: 0.9,
        metalness: 0,
      }),
    [palette],
  )
  useLayoutEffect(() => () => {
    geo.dispose()
    mat.dispose()
  }, [geo, mat])

  const write = (t: number) => {
    const mesh = ref.current
    if (!mesh) return
    for (let i = 0; i < blades.length; i++) {
      const b = blades[i]
      const lean = reducedMotion ? 0 : Math.sin(t * 1.6 + b.phase) * 0.22 * env.grass
      dummy.position.set(b.x, 0, b.z)
      dummy.rotation.set(0, 0, lean)
      dummy.scale.set(1, b.s, 1)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  }

  useLayoutEffect(() => {
    write(0)
    invalidate()
  })
  useFrame((state) => {
    if (!reducedMotion) write(state.clock.elapsedTime)
  })

  return <instancedMesh ref={ref} args={[geo, mat, blades.length]} />
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

export default function YardProps({ palette, mats, env, reducedMotion }: YardProps) {
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
      <LampPost palette={palette} mats={mats} env={env} reducedMotion={reducedMotion} position={[3.4, 0, -8]} />
      <LampPost palette={palette} mats={mats} env={env} reducedMotion={reducedMotion} position={[-5.6, 0, -6.5]} />
      <Grass palette={palette} env={env} reducedMotion={reducedMotion} />

      {STONES.map((s, i) => (
        <mesh key={i} position={s.p} rotation={[s.rot, s.rot * 1.3, 0]} material={mats.shellDark}>
          {s.ico ? <icosahedronGeometry args={[s.r, 0]} /> : <dodecahedronGeometry args={[s.r, 0]} />}
        </mesh>
      ))}
    </group>
  )
}
