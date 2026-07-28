// ============================================================
// PetriStation (Dot-field) — a shallow glass petri tray holding an
// instanced dot grid that ripples as a radial wave. Idle-only
// micro-motion via useFrame; frozen to a static crest pose under
// reduced motion (seeded in a layout effect + invalidate() so it
// paints under the demand frameloop). One Object3D scratch.
// ============================================================
import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { LabMaterials } from './labMaterials'

const N = 7
const SP = 0.09
const AMP = 0.022
const R_CLIP = 0.34
const DISH_R = 0.5

export default function PetriStation({
  mats,
  reducedMotion,
  position,
}: {
  mats: LabMaterials
  reducedMotion: boolean
  position: [number, number, number]
}) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const invalidate = useThree((s) => s.invalidate)

  // Grid cells clipped to the dish circle.
  const cells = useMemo(() => {
    const out: { x: number; z: number; d: number }[] = []
    for (let i = 0; i < N; i++)
      for (let j = 0; j < N; j++) {
        const x = (i - (N - 1) / 2) * SP
        const z = (j - (N - 1) / 2) * SP
        const d = Math.hypot(x, z)
        if (d <= R_CLIP) out.push({ x, z, d })
      }
    return out
  }, [])

  const write = (t: number) => {
    const mesh = ref.current
    if (!mesh) return
    for (let k = 0; k < cells.length; k++) {
      const c = cells[k]
      const wave = reducedMotion ? 0.5 + 0.5 * Math.sin(c.d * 12) : Math.sin(c.d * 12 - t * 2.4)
      dummy.position.set(c.x, 0.05 + Math.max(0, wave) * AMP + 0.01, c.z)
      dummy.updateMatrix()
      mesh.setMatrixAt(k, dummy.matrix)
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
    <group position={position}>
      {/* Dish base */}
      <mesh position={[0, 0.025, 0]} material={mats.glass}>
        <cylinderGeometry args={[DISH_R, DISH_R, 0.05, 36]} />
      </mesh>
      {/* Liquid film */}
      <mesh position={[0, 0.045, 0]} material={mats.liquidCyan}>
        <cylinderGeometry args={[DISH_R - 0.04, DISH_R - 0.04, 0.02, 36]} />
      </mesh>
      {/* Dish wall (open cylinder) */}
      <mesh position={[0, 0.06, 0]} material={mats.glass}>
        <cylinderGeometry args={[DISH_R, DISH_R, 0.08, 36, 1, true]} />
      </mesh>
      {/* Rippling dot grid */}
      <instancedMesh
        ref={ref}
        args={[undefined, undefined, cells.length]}
        material={mats.accentCyan}
      >
        <cylinderGeometry args={[0.018, 0.018, 0.02, 10]} />
      </instancedMesh>
    </group>
  )
}
