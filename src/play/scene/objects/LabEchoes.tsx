// ============================================================
// LabEchoes — the three small procedural "experiment" sculptures
// that sit atop the Lab pedestals (A):
//   • DotField  — 7×7 instanced dot grid with a radial ripple
//   • Waveform  — 12 instanced bars breathing sine heights
//   • CoinStack — 6 slightly-offset coin cylinders, slow spin
// Idle micro-motion only, via useFrame with small math, ALL
// frozen to a static pose when reducedMotion is set. Under
// reducedMotion the Canvas runs frameloop='demand', so the seed
// pose is written in a layout effect and invalidate() is called
// to schedule the one render that shows it. InstancedMesh + a
// single preallocated Object3D scratch — no per-frame allocs.
// ============================================================
import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { WorldMaterials } from '../materials'

type EchoProps = { mats: WorldMaterials; reducedMotion: boolean }

// ------------------------------------------------------------
// DotField — cursor-reactive generative grid, echoed as a ripple.
// ------------------------------------------------------------
const DOT_N = 7
const DOT_SP = 0.1
const DOT_AMP = 0.05

export function DotField({ mats, reducedMotion }: EchoProps) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const invalidate = useThree((s) => s.invalidate)
  const cells = useMemo(() => {
    const out: { x: number; z: number; d: number }[] = []
    for (let i = 0; i < DOT_N; i++)
      for (let j = 0; j < DOT_N; j++) {
        const x = (i - (DOT_N - 1) / 2) * DOT_SP
        const z = (j - (DOT_N - 1) / 2) * DOT_SP
        out.push({ x, z, d: Math.hypot(x, z) })
      }
    return out
  }, [])

  const write = (t: number) => {
    const mesh = ref.current
    if (!mesh) return
    for (let k = 0; k < cells.length; k++) {
      const c = cells[k]
      const wave = reducedMotion ? 0.5 + 0.5 * Math.sin(c.d * 9) : Math.sin(c.d * 9 - t * 2.2)
      dummy.position.set(c.x, 0.02 + wave * DOT_AMP, c.z)
      dummy.updateMatrix()
      mesh.setMatrixAt(k, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  }

  useLayoutEffect(() => {
    write(0)
    invalidate()
  }) // seed a static pose every commit; invalidate paints it under demand mode
  useFrame((state) => {
    if (!reducedMotion) write(state.clock.elapsedTime)
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, DOT_N * DOT_N]} material={mats.accentCyan}>
      <cylinderGeometry args={[0.016, 0.016, 0.02, 10]} />
    </instancedMesh>
  )
}

// ------------------------------------------------------------
// Waveform — a bar chart of UI sound, breathing.
// ------------------------------------------------------------
const BARS = 12
const BAR_W = 0.045
const BAR_SP = 0.052

export function Waveform({ mats, reducedMotion }: EchoProps) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const invalidate = useThree((s) => s.invalidate)

  const write = (t: number) => {
    const mesh = ref.current
    if (!mesh) return
    for (let i = 0; i < BARS; i++) {
      const x = (i - (BARS - 1) / 2) * BAR_SP
      const phase = i * 0.55
      const s = reducedMotion ? 0.5 + 0.5 * Math.sin(phase) : 0.5 + 0.5 * Math.sin(t * 3 + phase)
      const h = 0.05 + s * 0.2
      dummy.position.set(x, h / 2, 0)
      dummy.scale.set(1, h, 1)
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

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, BARS]} material={mats.accentCoral}>
      <boxGeometry args={[BAR_W, 1, BAR_W]} />
    </instancedMesh>
  )
}

// ------------------------------------------------------------
// CoinStack — staking motion; a small tower of coins, slow spin.
// ------------------------------------------------------------
const COINS = 6

export function CoinStack({ mats, reducedMotion }: EchoProps) {
  const group = useRef<THREE.Group>(null)
  const ref = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const invalidate = useThree((s) => s.invalidate)

  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    for (let i = 0; i < COINS; i++) {
      const ang = i * 0.5
      dummy.position.set(Math.cos(ang) * 0.02, 0.028 + i * 0.056, Math.sin(ang) * 0.02)
      dummy.rotation.set(0, ang, 0)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
    invalidate()
  }, [dummy, invalidate])

  useFrame((_, delta) => {
    if (reducedMotion || !group.current) return
    group.current.rotation.y += delta * 0.4
  })

  return (
    <group ref={group}>
      <instancedMesh ref={ref} args={[undefined, undefined, COINS]} material={mats.accentYellow}>
        <cylinderGeometry args={[0.16, 0.16, 0.05, 24]} />
      </instancedMesh>
    </group>
  )
}
