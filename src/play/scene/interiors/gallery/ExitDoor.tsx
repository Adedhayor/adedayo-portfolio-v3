// ============================================================
// ExitDoor — the physical door + glowing EXIT sign on the right
// wall (W2, Wall of Arts). Wrapped around the data exit hotspot
// [2.6, 1.15, -1.4]; the interactive marker/label comes from the
// shared Hotspots layer, so this is scenery only (no onClick):
// jambs + lintel, a dark recessed doorway panel, and an unlit
// EXIT sign lit by a small warm-green lamp. No idle animation.
// ============================================================
import { useEffect, useMemo } from 'react'
import type { PlayPalette } from '../../../hooks/usePlayColors'
import type { GalleryMaterials } from './galleryMaterials'
import { EXIT_DOOR } from './layout'
import { exitGlowColor, makeExitTexture } from './textures'

const DW = 1.15 // door opening width
const DH = 2.5 // door opening height
const JT = 0.14 // jamb thickness
const DEP = 0.16 // how proud the frame stands off the wall

export default function ExitDoor({
  palette,
  materials,
}: {
  palette: PlayPalette
  materials: GalleryMaterials
}) {
  const exitTex = useMemo(() => makeExitTexture(palette), [palette])
  useEffect(() => () => exitTex.dispose(), [exitTex])
  const glow = useMemo(() => exitGlowColor(palette), [palette])

  const signY = DH + JT + 0.26

  return (
    // Right wall, facing into the room: local +z → world -x.
    <group position={[EXIT_DOOR.faceX, 0, EXIT_DOOR.z]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Recessed dark doorway (just proud of the wall face to avoid z-fight). */}
      <mesh position={[0, DH / 2, 0.006]} material={materials.doorPanel}>
        <planeGeometry args={[DW, DH]} />
      </mesh>

      {/* Jambs + lintel. */}
      <mesh position={[-(DW / 2 + JT / 2), DH / 2, DEP / 2]} material={materials.doorFrame}>
        <boxGeometry args={[JT, DH + JT, DEP]} />
      </mesh>
      <mesh position={[DW / 2 + JT / 2, DH / 2, DEP / 2]} material={materials.doorFrame}>
        <boxGeometry args={[JT, DH + JT, DEP]} />
      </mesh>
      <mesh position={[0, DH + JT / 2, DEP / 2]} material={materials.doorFrame}>
        <boxGeometry args={[DW + JT * 2, JT, DEP]} />
      </mesh>

      {/* Sign housing + illuminated face + a small glow lamp. */}
      <mesh position={[0, signY, 0.08]} material={materials.doorFrame}>
        <boxGeometry args={[0.62, 0.32, 0.06]} />
      </mesh>
      <mesh position={[0, signY, 0.115]}>
        <planeGeometry args={[0.52, 0.24]} />
        <meshBasicMaterial map={exitTex} toneMapped={false} />
      </mesh>
      <pointLight position={[0, signY - 0.05, 0.4]} color={glow} intensity={2.2} distance={3} decay={2} />
    </group>
  )
}
