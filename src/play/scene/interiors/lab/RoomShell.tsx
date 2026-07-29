// ============================================================
// RoomShell — the enclosing Chemistry-Lab box: tiled floor,
// back + side walls, a skirting rail, and constant neutral room
// lighting (so screens/apparatus always read; the pendant lamp
// adds a warm pool on top). Background + fog attach to the SCENE
// (fragment, not a group) so canvas black never shows behind the
// roofless walls. Geometry matches the W0 camera/orbit (camera
// stands at z≈3.2 looking at z=-4).
// ============================================================
import * as THREE from 'three'
import type { PlayPalette } from '../../../hooks/usePlayColors'
import { mixColor } from '../../materials'
import type { LabMaterials } from './labMaterials'

export const HALF_W = 5 // room spans x −5..5
export const HALF_D = 4 // room spans z −4..4
export const WALL_H = 5
export const WALL_T = 0.2
export const BACK_Z = -HALF_D + WALL_T / 2 // back-wall centre (−3.9)
export const WALL_FACE_Z = -HALF_D + WALL_T // inner face of the back wall (−3.8)

export default function RoomShell({
  palette,
  mats,
  tileTexture,
}: {
  palette: PlayPalette
  mats: LabMaterials
  tileTexture: THREE.CanvasTexture | null
}) {
  const floorTint = mixColor(palette.surfaceRaised, palette.ink, 0.24)
  const wall = mixColor(palette.surfaceRaised, palette.ink, 0.2)
  const wallBack = mixColor(palette.surfaceRaised, palette.ink, 0.26)
  const background = mixColor(palette.ink, palette.blue, 0.1)
  const skirting = mixColor(palette.ink, palette.surfaceRaised, 0.12)

  return (
    <>
      {/* Void behind the roofless walls. */}
      <color attach="background" args={[`#${background.getHexString()}`]} />
      <fog attach="fog" args={[`#${background.getHexString()}`, 11, 28]} />

      {/* Constant, soft, neutral room light. */}
      <ambientLight intensity={0.62} />
      <hemisphereLight args={[palette.surfaceRaised, palette.ink, 0.42]} />
      <pointLight
        position={[0, WALL_H - 0.8, 1.4]}
        intensity={4.2}
        distance={18}
        color={palette.surfaceRaised}
      />
      <pointLight position={[-2.6, 2.6, -1.6]} intensity={1.6} distance={9} color={palette.cyan} />
      <pointLight position={[2.6, 2.6, -1.6]} intensity={1.4} distance={9} color={palette.surfaceRaised} />

      {/* Tiled floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[HALF_W * 2, HALF_D * 2]} />
        <meshStandardMaterial
          map={tileTexture ?? undefined}
          color={floorTint}
          roughness={0.85}
          metalness={0.04}
        />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, WALL_H / 2, BACK_Z]}>
        <boxGeometry args={[HALF_W * 2, WALL_H, WALL_T]} />
        <meshStandardMaterial color={wallBack} roughness={0.9} metalness={0} />
      </mesh>
      {/* Side walls */}
      <mesh position={[-HALF_W + WALL_T / 2, WALL_H / 2, 0]}>
        <boxGeometry args={[WALL_T, WALL_H, HALF_D * 2]} />
        <meshStandardMaterial color={wall} roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[HALF_W - WALL_T / 2, WALL_H / 2, 0]}>
        <boxGeometry args={[WALL_T, WALL_H, HALF_D * 2]} />
        <meshStandardMaterial color={wall} roughness={0.9} metalness={0} />
      </mesh>

      {/* Skirting along the back wall */}
      <mesh position={[0, 0.09, WALL_FACE_Z + 0.02]} material={mats.metal}>
        <boxGeometry args={[HALF_W * 2, 0.18, 0.04]} />
      </mesh>
      {/* Faint skirting tone strip using palette skirting colour */}
      <mesh position={[0, 0.09, WALL_FACE_Z + 0.045]}>
        <boxGeometry args={[HALF_W * 2, 0.18, 0.01]} />
        <meshStandardMaterial color={skirting} roughness={0.7} metalness={0.2} />
      </mesh>
    </>
  )
}
