// ============================================================
// GalleryShell — the room the Wall of Arts hangs in (W2).
// Wood-plank floor, three walls (the fourth is behind the camera),
// a ceiling hint, picture rail + skirting mouldings, and ≤4 warm
// SpotLights angled at the walls over a soft ambient/hemisphere
// base. Fully static — no idle animation, no per-frame work.
// ============================================================
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { PlayPalette } from '../../../hooks/usePlayColors'
import type { GalleryMaterials } from './galleryMaterials'
import { DEPTH_SPAN, FAR_FACE, LEFT_FACE, MID_Z, RIGHT_FACE, ROOM } from './layout'

/** A warm spot aimed at a fixed point on a wall. three needs the
    target in the scene graph with an up-to-date world matrix. */
function WallSpot({
  position,
  target,
  color,
  intensity,
}: {
  position: [number, number, number]
  target: [number, number, number]
  color: THREE.Color
  intensity: number
}) {
  const light = useRef<THREE.SpotLight>(null)
  const tgt = useRef<THREE.Object3D>(null)
  useEffect(() => {
    if (light.current && tgt.current) {
      light.current.target = tgt.current
      light.current.target.updateMatrixWorld()
    }
  }, [])
  return (
    <>
      <spotLight
        ref={light}
        position={position}
        color={color}
        intensity={intensity}
        angle={0.7}
        penumbra={0.85}
        distance={13}
        decay={2}
      />
      <object3D ref={tgt} position={target} />
    </>
  )
}

export default function GalleryShell({
  palette,
  materials,
}: {
  palette: PlayPalette
  materials: GalleryMaterials
}) {
  const { halfW, halfD, wallH, wallT, railY, skirtH, eye } = ROOM

  const warm = useMemo(
    () => new THREE.Color(palette.yellow).lerp(new THREE.Color(palette.surfaceRaised), 0.55),
    [palette],
  )
  const bg = useMemo(
    () => `#${new THREE.Color(palette.ink).lerp(new THREE.Color(palette.blue), 0.08).getHexString()}`,
    [palette],
  )

  return (
    <>
      {/* Room void so gaps/corners never flash canvas black. */}
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, 12, 34]} />

      {/* Soft neutral base so frames + walls always read. */}
      <ambientLight intensity={0.5} />
      <hemisphereLight args={[palette.surfaceRaised, palette.ink, 0.4]} />

      {/* ≤4 warm gallery spots: two wash the main wall, one per side wall. */}
      <WallSpot position={[-1.5, wallH - 0.5, -2.0]} target={[-1.9, eye, FAR_FACE]} color={warm} intensity={13} />
      <WallSpot position={[1.5, wallH - 0.5, -2.0]} target={[1.9, eye, FAR_FACE]} color={warm} intensity={13} />
      <WallSpot position={[-2.2, wallH - 0.5, -2.4]} target={[LEFT_FACE, eye, -2.3]} color={warm} intensity={11} />
      <WallSpot position={[2.2, wallH - 0.5, -1.9]} target={[RIGHT_FACE, eye, -2.0]} color={warm} intensity={11} />

      {/* Floor (wood planks) + ceiling hint. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, MID_Z]} material={materials.floor}>
        <planeGeometry args={[halfW * 2, DEPTH_SPAN]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, wallH, MID_Z]} material={materials.ceiling}>
        <planeGeometry args={[halfW * 2, DEPTH_SPAN]} />
      </mesh>

      {/* Three walls — the fourth (front) is behind the camera. */}
      <mesh position={[0, wallH / 2, -halfD]} material={materials.wallFar}>
        <boxGeometry args={[halfW * 2, wallH, wallT]} />
      </mesh>
      <mesh position={[-halfW, wallH / 2, MID_Z]} material={materials.wall}>
        <boxGeometry args={[wallT, wallH, DEPTH_SPAN]} />
      </mesh>
      <mesh position={[halfW, wallH / 2, MID_Z]} material={materials.wall}>
        <boxGeometry args={[wallT, wallH, DEPTH_SPAN]} />
      </mesh>

      {/* Picture rail — a moulding proud of each wall near the top. */}
      <mesh position={[0, railY, FAR_FACE + 0.03]} material={materials.rail}>
        <boxGeometry args={[halfW * 2, 0.09, 0.06]} />
      </mesh>
      <mesh position={[LEFT_FACE + 0.03, railY, MID_Z]} material={materials.rail}>
        <boxGeometry args={[0.06, 0.09, DEPTH_SPAN]} />
      </mesh>
      <mesh position={[RIGHT_FACE - 0.03, railY, MID_Z]} material={materials.rail}>
        <boxGeometry args={[0.06, 0.09, DEPTH_SPAN]} />
      </mesh>

      {/* Skirting — baseboard at the foot of each wall. */}
      <mesh position={[0, skirtH / 2, FAR_FACE + 0.025]} material={materials.skirt}>
        <boxGeometry args={[halfW * 2, skirtH, 0.05]} />
      </mesh>
      <mesh position={[LEFT_FACE + 0.025, skirtH / 2, MID_Z]} material={materials.skirt}>
        <boxGeometry args={[0.05, skirtH, DEPTH_SPAN]} />
      </mesh>
      <mesh position={[RIGHT_FACE - 0.025, skirtH / 2, MID_Z]} material={materials.skirt}>
        <boxGeometry args={[0.05, skirtH, DEPTH_SPAN]} />
      </mesh>
    </>
  )
}
