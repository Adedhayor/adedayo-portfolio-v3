// ============================================================
// BottleShelf — a wall plank carrying a row of tinted-glass
// bottles: two instanced meshes (tall reagent cylinders + a few
// round-bottom flask spheres) with per-instance colours + heights
// for variety, and a per-instance stopper. Static — matrices are
// written once in a layout effect and invalidate() paints them so
// they also appear under the demand frameloop (reduced motion /
// gate). One preallocated Object3D scratch; no per-frame allocs.
// ============================================================
import { useLayoutEffect, useMemo, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { PlayPalette } from '../../../hooks/usePlayColors'
import { mixColor } from '../../materials'
import type { LabMaterials } from './labMaterials'

type ShelfProps = {
  mats: LabMaterials
  palette: PlayPalette
  position: [number, number, number]
  width: number
  /** Deterministic per-shelf variation */
  seed: number
}

const BOTTLE_N = 6

export default function BottleShelf({ mats, palette, position, width, seed }: ShelfProps) {
  const bottlesRef = useRef<THREE.InstancedMesh>(null)
  const stoppersRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color(), [])
  const invalidate = useThree((s) => s.invalidate)

  // Tint palette for the glass (multiplies the white-ish glass base).
  const tints = useMemo(
    () => [
      mixColor(palette.cyan, palette.surfaceRaised, 0.15),
      mixColor(palette.blue, palette.cyan, 0.4),
      mixColor(palette.coral, palette.surfaceRaised, 0.25),
      mixColor(palette.yellow, palette.surfaceRaised, 0.3),
    ],
    [palette],
  )

  const bottles = useMemo(() => {
    const out: { x: number; h: number; r: number; tint: number }[] = []
    const step = width / BOTTLE_N
    for (let i = 0; i < BOTTLE_N; i++) {
      const rnd = Math.abs(Math.sin((i + 1) * 12.9898 + seed * 78.233)) % 1
      out.push({
        x: -width / 2 + step / 2 + i * step,
        h: 0.28 + rnd * 0.22,
        r: 0.07 + rnd * 0.03,
        tint: (i + seed) % tints.length,
      })
    }
    return out
  }, [width, seed, tints.length])

  useLayoutEffect(() => {
    const bMesh = bottlesRef.current
    const sMesh = stoppersRef.current
    if (!bMesh || !sMesh) return
    bottles.forEach((b, i) => {
      // Bottle body: unit cylinder scaled to (r, h, r), sat on the shelf.
      dummy.position.set(b.x, b.h / 2, 0)
      dummy.scale.set(b.r, b.h, b.r)
      dummy.rotation.set(0, 0, 0)
      dummy.updateMatrix()
      bMesh.setMatrixAt(i, dummy.matrix)
      color.copy(tints[b.tint])
      bMesh.setColorAt(i, color)
      // Stopper: small metal cap at the neck.
      dummy.position.set(b.x, b.h + 0.02, 0)
      dummy.scale.set(b.r * 0.55, 0.05, b.r * 0.55)
      dummy.updateMatrix()
      sMesh.setMatrixAt(i, dummy.matrix)
    })
    bMesh.instanceMatrix.needsUpdate = true
    if (bMesh.instanceColor) bMesh.instanceColor.needsUpdate = true
    sMesh.instanceMatrix.needsUpdate = true
    invalidate()
  }, [bottles, dummy, color, tints, invalidate])

  return (
    <group position={position}>
      {/* Plank + a pair of brackets */}
      <mesh position={[0, -0.03, 0]} material={mats.shelf}>
        <boxGeometry args={[width + 0.2, 0.05, 0.34]} />
      </mesh>
      <mesh position={[-width / 2, -0.14, -0.02]} material={mats.metal}>
        <boxGeometry args={[0.04, 0.2, 0.28]} />
      </mesh>
      <mesh position={[width / 2, -0.14, -0.02]} material={mats.metal}>
        <boxGeometry args={[0.04, 0.2, 0.28]} />
      </mesh>

      {/* Bottles (unit cylinder, per-instance scale + colour) */}
      <instancedMesh ref={bottlesRef} args={[undefined, undefined, BOTTLE_N]} material={mats.glass}>
        <cylinderGeometry args={[1, 1, 1, 14]} />
      </instancedMesh>
      {/* Stoppers */}
      <instancedMesh ref={stoppersRef} args={[undefined, undefined, BOTTLE_N]} material={mats.metal}>
        <cylinderGeometry args={[1, 1, 1, 12]} />
      </instancedMesh>
    </group>
  )
}
