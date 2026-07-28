// ============================================================
// ScaleStation (Staking motion) — a balance scale with a coin
// stack on each pan and a slow tilt oscillation of the beam; the
// pans counter-rotate to hang level as it tips. Coin stacks are
// instanced (one Object3D scratch, matrices seeded once). Idle
// tilt is reducedMotion-gated: a small static tilt is seeded in a
// layout effect + invalidate() so it reads under demand frameloop.
// ============================================================
import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { LabMaterials } from './labMaterials'

const BEAM_HALF = 0.42
const TILT_AMP = 0.09
const COIN_R = 0.1
const COIN_H = 0.024
const LEFT_COINS = 4
const RIGHT_COINS = 3

export default function ScaleStation({
  mats,
  reducedMotion,
  position,
}: {
  mats: LabMaterials
  reducedMotion: boolean
  position: [number, number, number]
}) {
  const beamRef = useRef<THREE.Group>(null)
  const panLeftRef = useRef<THREE.Group>(null)
  const panRightRef = useRef<THREE.Group>(null)
  const coinLeftRef = useRef<THREE.InstancedMesh>(null)
  const coinRightRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const invalidate = useThree((s) => s.invalidate)

  const applyTilt = (tilt: number) => {
    if (beamRef.current) beamRef.current.rotation.z = tilt
    // Pans hang level regardless of beam tip.
    if (panLeftRef.current) panLeftRef.current.rotation.z = -tilt
    if (panRightRef.current) panRightRef.current.rotation.z = -tilt
  }

  // Seed coin stacks (static) + a resting tilt; paint under demand mode.
  useLayoutEffect(() => {
    const stack = (mesh: THREE.InstancedMesh | null, n: number) => {
      if (!mesh) return
      for (let i = 0; i < n; i++) {
        dummy.position.set(0, -0.14 + COIN_H / 2 + i * COIN_H, 0)
        dummy.rotation.set(0, i * 0.4, 0)
        dummy.scale.setScalar(1)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
      }
      mesh.instanceMatrix.needsUpdate = true
    }
    stack(coinLeftRef.current, LEFT_COINS)
    stack(coinRightRef.current, RIGHT_COINS)
    // Heavier left pan rests slightly down under reduced motion.
    applyTilt(reducedMotion ? TILT_AMP * 0.5 : 0)
    invalidate()
  })

  useFrame((state) => {
    if (reducedMotion) return
    applyTilt(TILT_AMP * Math.sin(state.clock.elapsedTime * 0.5))
  })

  return (
    <group position={position}>
      {/* Base foot */}
      <mesh position={[0, 0.02, 0]} material={mats.metal}>
        <cylinderGeometry args={[0.22, 0.24, 0.04, 28]} />
      </mesh>
      {/* Pillar */}
      <mesh position={[0, 0.29, 0]} material={mats.metal}>
        <cylinderGeometry args={[0.028, 0.032, 0.5, 16]} />
      </mesh>
      {/* Fulcrum */}
      <mesh position={[0, 0.55, 0]} material={mats.metal}>
        <sphereGeometry args={[0.035, 14, 14]} />
      </mesh>

      {/* Tilting beam with two hanging pans */}
      <group ref={beamRef} position={[0, 0.55, 0]}>
        <mesh material={mats.metal}>
          <boxGeometry args={[BEAM_HALF * 2 + 0.06, 0.028, 0.028]} />
        </mesh>

        {/* Left pan (heavier stack) */}
        <group ref={panLeftRef} position={[-BEAM_HALF, 0, 0]}>
          <mesh position={[0, -0.07, 0]} material={mats.metal}>
            <cylinderGeometry args={[0.008, 0.008, 0.14, 8]} />
          </mesh>
          <mesh position={[0, -0.15, 0]} material={mats.metal}>
            <cylinderGeometry args={[0.16, 0.13, 0.02, 24]} />
          </mesh>
          <group position={[0, -0.15, 0]}>
            <instancedMesh ref={coinLeftRef} args={[undefined, undefined, LEFT_COINS]} material={mats.accentYellow}>
              <cylinderGeometry args={[COIN_R, COIN_R, COIN_H, 24]} />
            </instancedMesh>
          </group>
        </group>

        {/* Right pan */}
        <group ref={panRightRef} position={[BEAM_HALF, 0, 0]}>
          <mesh position={[0, -0.07, 0]} material={mats.metal}>
            <cylinderGeometry args={[0.008, 0.008, 0.14, 8]} />
          </mesh>
          <mesh position={[0, -0.15, 0]} material={mats.metal}>
            <cylinderGeometry args={[0.16, 0.13, 0.02, 24]} />
          </mesh>
          <group position={[0, -0.15, 0]}>
            <instancedMesh ref={coinRightRef} args={[undefined, undefined, RIGHT_COINS]} material={mats.accentYellow}>
              <cylinderGeometry args={[COIN_R, COIN_R, COIN_H, 24]} />
            </instancedMesh>
          </group>
        </group>
      </group>
    </group>
  )
}
