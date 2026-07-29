// ============================================================
// WindowPlane (W3) — the Workspace's window onto the sky. A
// vertex-colored gradient plane (zenith → horizon) tinted by the
// visitor-local time-of-day band from the shared useTimeOfDay
// store: day = bright blue, dusk = the golden-hour tones, night =
// ink + instanced star dots + a moon disc. A soft point light
// spills the sky's glow into the room as the window rim light —
// per plan §2.5 the window is the ONLY interior surface that
// follows the clock; room lighting stays constant so the monitor
// always reads.
//
// The gradient is 4 vertex colors on a 1×1-segment plane — no
// shader, no texture. Colors are rewritten (and invalidate()
// called, for the demand frameloop) when the band or palette
// changes; stars are seeded once in a layout effect.
// ============================================================
import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import type { PlayPalette } from '../../../hooks/usePlayColors'
import { useTimeOfDay } from '../../../hooks/useTimeOfDay'
import { mixColor, type WorldMaterials } from '../../materials'
import { windowSky } from './roomColors'

const STARS = 46

/** Deterministic pseudo-random in [0,1) — stable star field, no Math.random. */
function rand(i: number, salt: number) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}

export default function WindowPlane({
  palette,
  mats,
  position,
  width = 1.7,
  height = 1.45,
}: {
  palette: PlayPalette
  mats: WorldMaterials
  position: [number, number, number]
  width?: number
  height?: number
}) {
  const invalidate = useThree((s) => s.invalidate)
  const band = useTimeOfDay()
  const sky = useMemo(() => windowSky(palette, band), [palette, band])

  const skyW = width - 0.16
  const skyH = height - 0.16
  const geomRef = useRef<THREE.PlaneGeometry>(null)
  const starsRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Gradient: plane verts 0,1 are the top row, 2,3 the bottom row.
  useLayoutEffect(() => {
    const geom = geomRef.current
    if (!geom) return
    let attr = geom.getAttribute('color') as THREE.BufferAttribute | undefined
    if (!attr) {
      attr = new THREE.BufferAttribute(new Float32Array(4 * 3), 3)
      geom.setAttribute('color', attr)
    }
    attr.setXYZ(0, sky.zenith.r, sky.zenith.g, sky.zenith.b)
    attr.setXYZ(1, sky.zenith.r, sky.zenith.g, sky.zenith.b)
    attr.setXYZ(2, sky.horizon.r, sky.horizon.g, sky.horizon.b)
    attr.setXYZ(3, sky.horizon.r, sky.horizon.g, sky.horizon.b)
    attr.needsUpdate = true
    invalidate()
  }, [sky, invalidate])

  // Star field — seeded once; the group's `visible` flag flips at night.
  useLayoutEffect(() => {
    const mesh = starsRef.current
    if (!mesh) return
    for (let i = 0; i < STARS; i++) {
      dummy.position.set(
        (rand(i, 1) - 0.5) * (skyW - 0.12),
        (rand(i, 2) - 0.5) * (skyH - 0.12),
        0,
      )
      const s = 0.55 + rand(i, 3) * 0.9
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
    invalidate()
  }, [dummy, skyW, skyH, invalidate])

  // Sun / moon disc placement per band: high for day, sunk toward the
  // horizon at dusk, a high small moon at night.
  const discPos = useMemo<[number, number, number]>(() => {
    switch (band) {
      case 'day':
        return [skyW * 0.26, skyH * 0.24, 0.012]
      case 'night':
        return [skyW * 0.24, skyH * 0.22, 0.012]
      case 'dusk':
      default:
        return [-skyW * 0.2, -skyH * 0.28, 0.012]
    }
  }, [band, skyW, skyH])

  const starColor = useMemo(() => mixColor(palette.surfaceRaised, palette.cyan, 0.35), [palette])

  return (
    <group position={position}>
      {/* Sky gradient */}
      <mesh>
        <planeGeometry ref={geomRef} args={[skyW, skyH, 1, 1]} />
        <meshBasicMaterial vertexColors toneMapped={false} />
      </mesh>

      {/* Stars — night only */}
      <group visible={band === 'night'} position={[0, 0, 0.008]}>
        <instancedMesh ref={starsRef} args={[undefined, undefined, STARS]}>
          <circleGeometry args={[0.014, 6]} />
          <meshBasicMaterial color={starColor} toneMapped={false} />
        </instancedMesh>
      </group>

      {/* Sun / moon disc */}
      <mesh position={discPos}>
        <circleGeometry args={[band === 'night' ? 0.12 : 0.16, 24]} />
        <meshBasicMaterial color={sky.disc} toneMapped={false} />
      </mesh>

      {/* Muntin bars over the glass */}
      <mesh position={[0, 0, 0.02]} material={mats.shellDark}>
        <boxGeometry args={[0.035, skyH, 0.03]} />
      </mesh>
      <mesh position={[0, skyH * 0.14, 0.02]} material={mats.shellDark}>
        <boxGeometry args={[skyW, 0.035, 0.03]} />
      </mesh>

      {/* Frame + sill */}
      <mesh position={[0, height / 2 - 0.04, 0.01]} material={mats.wood}>
        <boxGeometry args={[width, 0.08, 0.09]} />
      </mesh>
      <mesh position={[0, -height / 2 + 0.04, 0.01]} material={mats.wood}>
        <boxGeometry args={[width, 0.08, 0.09]} />
      </mesh>
      <mesh position={[-width / 2 + 0.04, 0, 0.01]} material={mats.wood}>
        <boxGeometry args={[0.08, height, 0.09]} />
      </mesh>
      <mesh position={[width / 2 - 0.04, 0, 0.01]} material={mats.wood}>
        <boxGeometry args={[0.08, height, 0.09]} />
      </mesh>
      <mesh position={[0, -height / 2 - 0.05, 0.05]} material={mats.wood}>
        <boxGeometry args={[width + 0.22, 0.06, 0.18]} />
      </mesh>

      {/* Sky glow spilling into the room — the one clock-driven light. */}
      <pointLight position={[0, -0.1, 0.6]} intensity={1.35} distance={5.5} color={sky.glow} />
    </group>
  )
}
