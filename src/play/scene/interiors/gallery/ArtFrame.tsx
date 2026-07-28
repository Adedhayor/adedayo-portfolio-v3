// ============================================================
// ArtFrame — one framed piece on the wall (W2, Wall of Arts).
// A frame (varied profile: thin metal / deep box / classic) around
// a recessed mat + the ScreenSurface plane, a gallery caption plaque
// beneath, and an invisible hit-plane in front that opens the
// lightbox. The screen is composed WITHOUT its own onAction so its
// native click never fires — the hit-plane owns interaction (and
// stopPropagation()s), exactly as the shared contract prescribes.
// ============================================================
import { useEffect, useMemo } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import type { SoundRole } from '@/lib/sensory-ui'
import type { HotspotAction, ScreenContent } from '../../../data/playground'
import type { PlayPalette } from '../../../hooks/usePlayColors'
import ScreenSurface from '../../media/ScreenSurface'
import type { GalleryMaterials } from './galleryMaterials'
import { makeLabelTexture } from './textures'
import type { FrameProfile, Slot } from './layout'

/** face = moulding width around the opening; depth = how proud it
    stands off the wall (the box profile is a deep shadowbox). */
const PROFILE_SPEC: Record<FrameProfile, { face: number; depth: number }> = {
  metal: { face: 0.05, depth: 0.06 },
  box: { face: 0.09, depth: 0.2 },
  classic: { face: 0.12, depth: 0.1 },
}

/** Same drag-vs-tap slop the shared Hotspots layer uses — an orbit drag
    released over a frame must not open the lightbox. */
const TAP_SLOP_PX = 6

export default function ArtFrame({
  screen,
  palette,
  materials,
  slot,
  caption,
  onAction,
}: {
  screen: ScreenContent
  palette: PlayPalette
  materials: GalleryMaterials
  slot: Slot
  caption: { title: string; tag: string }
  onAction: (action: HotspotAction, sound?: SoundRole) => void
}) {
  const [aw, ah] = screen.aspect ?? [16, 10]
  const openingW = slot.width
  const openingH = openingW * (ah / aw)
  const { face, depth } = PROFILE_SPEC[slot.profile]
  const frameMat =
    slot.profile === 'metal'
      ? materials.frameMetal
      : slot.profile === 'box'
        ? materials.frameBox
        : materials.frameClassic

  // Image sits inside a mat reveal (a hair for metal, wider for box/classic).
  const matReveal = slot.profile === 'metal' ? 0.025 : 0.06
  const imgW = openingW - matReveal * 2

  const matZ = depth * 0.34
  const imgZ = depth * 0.52
  const hitZ = depth + 0.03
  const outerW = openingW + face * 2
  const outerH = openingH + face * 2

  const capW = Math.min(0.56, openingW * 0.55)
  const capH = capW / 2.74
  const capY = -outerH / 2 - 0.05 - capH / 2

  const labelTex = useMemo(
    () => makeLabelTexture(caption.title, caption.tag, palette),
    [caption.title, caption.tag, palette],
  )
  useEffect(() => () => labelTex.dispose(), [labelTex])

  return (
    <group position={slot.position} rotation={[0, slot.rotationY, 0]}>
      {/* Moulding — four bars standing off the wall (back flush at local z=0). */}
      <mesh position={[0, openingH / 2 + face / 2, depth / 2]} material={frameMat}>
        <boxGeometry args={[outerW, face, depth]} />
      </mesh>
      <mesh position={[0, -openingH / 2 - face / 2, depth / 2]} material={frameMat}>
        <boxGeometry args={[outerW, face, depth]} />
      </mesh>
      <mesh position={[-openingW / 2 - face / 2, 0, depth / 2]} material={frameMat}>
        <boxGeometry args={[face, openingH, depth]} />
      </mesh>
      <mesh position={[openingW / 2 + face / 2, 0, depth / 2]} material={frameMat}>
        <boxGeometry args={[face, openingH, depth]} />
      </mesh>

      {/* Mat board behind the image (fills the opening; the image is smaller). */}
      <mesh position={[0, 0, matZ]} material={materials.mat}>
        <planeGeometry args={[openingW, openingH]} />
      </mesh>

      {/* The artwork — no onAction, so ScreenSurface's own click stays inert. */}
      <group position={[0, 0, imgZ]}>
        <ScreenSurface content={screen} palette={palette} width={imgW} />
      </group>

      {/* Invisible hit-plane over the whole piece → lightbox. */}
      <mesh
        position={[0, 0, hitZ]}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation()
          if (e.delta > TAP_SLOP_PX) return // drag, not a tap
          onAction({ kind: 'lightbox', screenId: screen.id })
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = ''
        }}
      >
        <planeGeometry args={[outerW, outerH]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Gallery caption plaque (title · tag), unlit so it always reads. */}
      <mesh position={[0, capY, 0.02]}>
        <planeGeometry args={[capW, capH]} />
        <meshBasicMaterial map={labelTex} toneMapped={false} />
      </mesh>
    </group>
  )
}
