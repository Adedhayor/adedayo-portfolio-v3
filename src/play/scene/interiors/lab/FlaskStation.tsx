// ============================================================
// FlaskStation (Sound study) — an Erlenmeyer flask on a ring
// stand with an animated liquid level, rising instanced bubbles,
// and a small waveform strip breathing behind the glass. All idle
// motion (liquid bob, bubbles, bars) is gated by reducedMotion:
// under it, a single static pose is seeded in a layout effect and
// invalidate() paints it under the demand frameloop. Preallocated
// Object3D scratch per instanced mesh; no per-frame allocations.
// ============================================================
import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { LabMaterials } from './labMaterials'

const BUBBLES = 8
const BUB_RISE = 0.26 // vertical travel inside the flask
const BARS = 9
const BAR_SP = 0.032
const BAR_W = 0.02

export default function FlaskStation({
  mats,
  reducedMotion,
  position,
}: {
  mats: LabMaterials
  reducedMotion: boolean
  position: [number, number, number]
}) {
  const liquidRef = useRef<THREE.Mesh>(null)
  const bubblesRef = useRef<THREE.InstancedMesh>(null)
  const barsRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const invalidate = useThree((s) => s.invalidate)

  // Per-bubble seed (angle, radius, phase, speed) — deterministic.
  const bubbles = useMemo(
    () =>
      Array.from({ length: BUBBLES }, (_, i) => ({
        ang: (i / BUBBLES) * Math.PI * 2,
        rad: 0.04 + (i % 3) * 0.03,
        phase: (i * 0.618) % 1,
        speed: 0.35 + (i % 4) * 0.05,
      })),
    [],
  )

  const write = (t: number) => {
    // Liquid level — subtle bob.
    const liquid = liquidRef.current
    if (liquid) {
      const s = reducedMotion ? 1 : 1 + 0.08 * Math.sin(t * 0.8)
      liquid.scale.y = s
      liquid.position.y = 0.03 + (0.16 * s) / 2
    }
    // Bubbles rising, converging as the flask narrows, wrapping.
    const bMesh = bubblesRef.current
    if (bMesh) {
      for (let i = 0; i < BUBBLES; i++) {
        const b = bubbles[i]
        const prog = reducedMotion ? b.phase : (b.phase + t * b.speed) % 1
        const y = 0.06 + prog * BUB_RISE
        const taper = 1 - prog * 0.55 // narrower higher up
        dummy.position.set(Math.cos(b.ang) * b.rad * taper, y, Math.sin(b.ang) * b.rad * taper)
        const sc = 0.6 + (1 - prog) * 0.6
        dummy.scale.setScalar(sc)
        dummy.updateMatrix()
        bMesh.setMatrixAt(i, dummy.matrix)
      }
      bMesh.instanceMatrix.needsUpdate = true
    }
    // Waveform bars breathing.
    const barMesh = barsRef.current
    if (barMesh) {
      for (let i = 0; i < BARS; i++) {
        const x = (i - (BARS - 1) / 2) * BAR_SP
        const phase = i * 0.6
        const amp = reducedMotion ? 0.5 + 0.5 * Math.sin(phase) : 0.5 + 0.5 * Math.sin(t * 3.4 + phase)
        const h = 0.04 + amp * 0.11
        dummy.position.set(x, h / 2, 0)
        dummy.scale.set(1, h, 1)
        dummy.rotation.set(0, 0, 0)
        dummy.updateMatrix()
        barMesh.setMatrixAt(i, dummy.matrix)
      }
      barMesh.instanceMatrix.needsUpdate = true
    }
  }

  useLayoutEffect(() => {
    write(0)
    invalidate()
  })
  useFrame((state) => {
    if (!reducedMotion) write(state.clock.elapsedTime)
  })

  return (
    <group position={position}>
      {/* Ring stand */}
      <mesh position={[0, 0.015, -0.02]} material={mats.metal}>
        <boxGeometry args={[0.5, 0.03, 0.28]} />
      </mesh>
      <mesh position={[0.26, 0.33, -0.08]} material={mats.metal}>
        <cylinderGeometry args={[0.016, 0.016, 0.62, 10]} />
      </mesh>
      <mesh position={[0.14, 0.24, -0.06]} material={mats.metal}>
        <boxGeometry args={[0.24, 0.03, 0.03]} />
      </mesh>
      {/* Support ring around the flask */}
      <mesh position={[0, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.metal}>
        <torusGeometry args={[0.15, 0.012, 8, 28]} />
      </mesh>

      {/* Waveform strip behind the flask */}
      <group position={[0, 0.05, -0.2]}>
        <mesh position={[0, 0.09, -0.02]}>
          <boxGeometry args={[BARS * BAR_SP + 0.04, 0.22, 0.01]} />
          <meshStandardMaterial color={mats.hood.color} roughness={0.8} />
        </mesh>
        <instancedMesh ref={barsRef} args={[undefined, undefined, BARS]} material={mats.accentCoral}>
          <boxGeometry args={[BAR_W, 1, BAR_W]} />
        </instancedMesh>
      </group>

      {/* Liquid (scaled in Y for level) */}
      <mesh ref={liquidRef} position={[0, 0.11, 0]} material={mats.liquidBlue}>
        <cylinderGeometry args={[0.15, 0.21, 0.16, 28]} />
      </mesh>
      {/* Rising bubbles */}
      <instancedMesh ref={bubblesRef} args={[undefined, undefined, BUBBLES]} material={mats.accentCyan}>
        <sphereGeometry args={[0.018, 10, 10]} />
      </instancedMesh>

      {/* Flask body (Erlenmeyer cone) + neck + mouth — glass, drawn last */}
      <mesh position={[0, 0.16, 0]} material={mats.glass}>
        <cylinderGeometry args={[0.075, 0.24, 0.32, 28]} />
      </mesh>
      <mesh position={[0, 0.38, 0]} material={mats.glass}>
        <cylinderGeometry args={[0.06, 0.06, 0.13, 20]} />
      </mesh>
      <mesh position={[0, 0.445, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.glass}>
        <torusGeometry args={[0.062, 0.012, 8, 20]} />
      </mesh>
    </group>
  )
}
