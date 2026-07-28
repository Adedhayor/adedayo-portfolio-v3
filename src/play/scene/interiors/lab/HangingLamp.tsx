// ============================================================
// HangingLamp — a pendant over the bench: a cord from the ceiling
// line down to a conic shade, an emissive bulb disc, and a warm
// SpotLight aimed at the stations. Static (no idle animation).
// ============================================================
import { useMemo } from 'react'
import * as THREE from 'three'
import type { PlayPalette } from '../../../hooks/usePlayColors'
import type { LabMaterials } from './labMaterials'

export default function HangingLamp({
  mats,
  palette,
  position,
  targetY,
}: {
  mats: LabMaterials
  palette: PlayPalette
  /** Shade centre position */
  position: [number, number, number]
  /** Bench-top height the spot aims at */
  targetY: number
}) {
  const [x, y, z] = position
  // Stable target object for the SpotLight (added to the scene via primitive).
  const target = useMemo(() => {
    const o = new THREE.Object3D()
    o.position.set(x, targetY, z)
    return o
  }, [x, z, targetY])

  const cordTop = 5 // ceiling line (WALL_H)
  const cordLen = cordTop - (y + 0.18)

  return (
    <group>
      {/* Cord */}
      <mesh position={[x, y + 0.18 + cordLen / 2, z]} material={mats.metal}>
        <cylinderGeometry args={[0.012, 0.012, cordLen, 8]} />
      </mesh>
      {/* Conic shade */}
      <mesh position={[x, y, z]} material={mats.lampShade}>
        <coneGeometry args={[0.42, 0.34, 24, 1, true]} />
      </mesh>
      {/* Bulb disc */}
      <mesh position={[x, y - 0.16, z]} material={mats.glow}>
        <cylinderGeometry args={[0.13, 0.13, 0.03, 20]} />
      </mesh>

      {/* Warm pool on the bench */}
      <primitive object={target} />
      <spotLight
        position={[x, y - 0.1, z]}
        target={target}
        angle={0.7}
        penumbra={0.6}
        intensity={5}
        distance={6}
        color={palette.yellow}
      />
    </group>
  )
}
