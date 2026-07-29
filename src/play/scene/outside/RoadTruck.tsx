// ============================================================
// RoadTruck — the distant road strip + the looping box-truck (W1,
// owner ask, itsbeenawful reference). A dark asphalt band with
// dashed centre lines runs across the far background at z≈-32;
// a small primitive truck (cargo box + cab + four wheels) drives
// the full viewport width on a constant-speed wrap, with a slight
// bob. Headlights = two emissive dots + two additive beam cones,
// faded by env.headlight so they only burn in the night band.
//
// Everything out here sits deep in the fog range, so the road and
// truck use fog-exempt basic materials in pre-darkened tones —
// they read as graphic cutouts against the sky like the
// silhouettes do. Reduced motion parks the truck at a fixed spot
// (lights still correct for the band); no per-frame allocations —
// the group's transform and material opacities are mutated.
// ============================================================
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { PlayPalette } from '../../hooks/usePlayColors'
import { mixColor } from '../materials'
import type { Env } from './environment'

const ROAD_Z = -32
const ROAD_W = 92
const ROAD_D = 2.6
const SPAN = 76 // truck wrap span (x from -38 to +38)
const SPEED = 4.2 // units/s
const PARKED_X = 7 // reduced-motion spot

function useCutoutMaterial(color: THREE.Color, opts: Partial<THREE.MeshBasicMaterialParameters> = {}) {
  const mat = useMemo(
    () => new THREE.MeshBasicMaterial({ color, fog: false, toneMapped: false, ...opts }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [color],
  )
  useEffect(() => () => mat.dispose(), [mat])
  return mat
}

function Road({ palette }: { palette: PlayPalette }) {
  const asphalt = useCutoutMaterial(useMemo(() => mixColor(palette.ink, palette.blue, 0.18), [palette]))
  const dashMat = useCutoutMaterial(
    useMemo(() => mixColor(palette.surfaceRaised, palette.ink, 0.45), [palette]),
  )
  const dashes = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const invalidate = useThree((s) => s.invalidate)
  const DASHES = 16

  useLayoutEffect(() => {
    const mesh = dashes.current
    if (!mesh) return
    for (let i = 0; i < DASHES; i++) {
      dummy.position.set(-42 + i * 5.6, 0.035, ROAD_Z)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
    invalidate()
  }, [dummy, invalidate])

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, ROAD_Z]} material={asphalt}>
        <planeGeometry args={[ROAD_W, ROAD_D]} />
      </mesh>
      <instancedMesh ref={dashes} args={[undefined, undefined, DASHES]} material={dashMat}>
        <boxGeometry args={[1.1, 0.02, 0.09]} />
      </instancedMesh>
    </group>
  )
}

function Truck({ palette, env, reducedMotion }: { palette: PlayPalette; env: Env; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null)
  const beamL = useRef<THREE.MeshBasicMaterial>(null)
  const beamR = useRef<THREE.MeshBasicMaterial>(null)
  const dotL = useRef<THREE.MeshBasicMaterial>(null)
  const dotR = useRef<THREE.MeshBasicMaterial>(null)

  const bodyMat = useCutoutMaterial(useMemo(() => mixColor(palette.coral, palette.ink, 0.3), [palette]))
  const cabMat = useCutoutMaterial(useMemo(() => mixColor(palette.ink, palette.surfaceRaised, 0.25), [palette]))
  const wheelMat = useCutoutMaterial(useMemo(() => mixColor(palette.ink, palette.blue, 0.1), [palette]))
  const lampColor = useMemo(
    () => mixColor(palette.yellow, palette.surfaceRaised, 0.4),
    [palette],
  )

  // Reduced motion: park it once (painted by the invalidate).
  const invalidate = useThree((s) => s.invalidate)
  useLayoutEffect(() => {
    if (!reducedMotion || !group.current) return
    group.current.position.set(PARKED_X, 0, ROAD_Z)
    group.current.rotation.set(0, 0, 0)
    invalidate()
  }, [reducedMotion, invalidate])

  useFrame((state) => {
    // Headlight fade runs even when parked — env snaps invalidate a frame.
    const glow = env.headlight
    if (beamL.current) beamL.current.opacity = glow * 0.22
    if (beamR.current) beamR.current.opacity = glow * 0.22
    if (dotL.current) dotL.current.opacity = 0.12 + glow * 0.88
    if (dotR.current) dotR.current.opacity = 0.12 + glow * 0.88

    const g = group.current
    if (!g || reducedMotion) return
    const t = state.clock.elapsedTime
    const x = ((t * SPEED) % SPAN) - SPAN / 2
    g.position.set(x, 0.04 * Math.abs(Math.sin(t * 9)), ROAD_Z)
    g.rotation.z = Math.sin(t * 9) * 0.006
  })

  return (
    <group ref={group} position={[PARKED_X, 0, ROAD_Z]}>
      {/* Cargo box */}
      <mesh position={[-0.25, 0.98, 0]} material={bodyMat}>
        <boxGeometry args={[1.9, 1.05, 0.85]} />
      </mesh>
      {/* Cab */}
      <mesh position={[1.05, 0.72, 0]} material={cabMat}>
        <boxGeometry args={[0.72, 0.68, 0.8]} />
      </mesh>
      {/* Wheels — cylinder axis along z so they roll along x */}
      {([
        [-0.85, 0.35],
        [0.35, 0.35],
        [1.1, 0.35],
      ] as [number, number][]).map(([wx], i) =>
        ([-0.38, 0.38] as number[]).map((wz, j) => (
          <mesh key={`${i}-${j}`} position={[wx, 0.2, wz]} rotation={[Math.PI / 2, 0, 0]} material={wheelMat}>
            <cylinderGeometry args={[0.2, 0.2, 0.14, 12]} />
          </mesh>
        )),
      )}
      {/* Headlight dots on the cab face */}
      <mesh position={[1.44, 0.62, -0.26]}>
        <sphereGeometry args={[0.055, 8, 8]} />
        <meshBasicMaterial ref={dotL} color={lampColor} transparent opacity={0} toneMapped={false} fog={false} />
      </mesh>
      <mesh position={[1.44, 0.62, 0.26]}>
        <sphereGeometry args={[0.055, 8, 8]} />
        <meshBasicMaterial ref={dotR} color={lampColor} transparent opacity={0} toneMapped={false} fog={false} />
      </mesh>
      {/* Beam cones — apex at the lamp, flaring forward (+x) */}
      <mesh position={[2.55, 0.56, -0.26]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.42, 2.2, 12, 1, true]} />
        <meshBasicMaterial
          ref={beamL}
          color={lampColor}
          transparent
          opacity={0}
          toneMapped={false}
          fog={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[2.55, 0.56, 0.26]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.42, 2.2, 12, 1, true]} />
        <meshBasicMaterial
          ref={beamR}
          color={lampColor}
          transparent
          opacity={0}
          toneMapped={false}
          fog={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

export default function RoadTruck({
  palette,
  env,
  reducedMotion,
}: {
  palette: PlayPalette
  env: Env
  reducedMotion: boolean
}) {
  return (
    <group>
      <Road palette={palette} />
      <Truck palette={palette} env={env} reducedMotion={reducedMotion} />
    </group>
  )
}
