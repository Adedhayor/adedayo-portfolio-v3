// ============================================================
// VideoScreen — OWNED BY THE MEDIA WORKSTREAM (C). Foundation
// stub: poster-or-color plane only. C replaces the material with
// drei useVideoTexture (muted, loop, playsInline) behind the
// useVideoPool concurrency budget (3 desktop / 1 mobile, release
// src on mobile after unfocus). The component API below is the
// frozen contract the art workstream composes against.
// ============================================================
import { Suspense } from 'react'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import type { HotspotAction, ScreenContent } from '../../data/playground'
import type { PlayPalette } from '../../hooks/usePlayColors'

function PosterMaterial({ url }: { url: string }) {
  const texture = useTexture(url)
  texture.colorSpace = THREE.SRGBColorSpace
  return <meshBasicMaterial map={texture} toneMapped={false} />
}

export type VideoScreenProps = {
  content: ScreenContent
  palette: PlayPalette
  /** Plane width in world units; height follows content.aspect (default 16:10) */
  width?: number
  /** Whether this screen may play video right now (pool decision, C's) */
  active?: boolean
  onAction?: (action: HotspotAction) => void
}

export default function VideoScreen({ content, palette, width = 1.6, onAction }: VideoScreenProps) {
  const [aw, ah] = content.aspect ?? [16, 10]
  const height = width * (ah / aw)
  // TextureLoader can't decode SVG covers — treat them as absent.
  const poster = content.poster && !content.poster.toLowerCase().endsWith('.svg') ? content.poster : null
  const clickable = Boolean(content.action && onAction)

  return (
    <mesh
      onClick={
        clickable
          ? (e: ThreeEvent<MouseEvent>) => {
              e.stopPropagation()
              onAction?.(content.action as HotspotAction)
            }
          : undefined
      }
      onPointerOver={clickable ? () => (document.body.style.cursor = 'pointer') : undefined}
      onPointerOut={clickable ? () => (document.body.style.cursor = '') : undefined}
    >
      <planeGeometry args={[width, height]} />
      <Suspense fallback={<meshBasicMaterial color={palette.ink} />}>
        {poster ? <PosterMaterial url={poster} /> : <meshBasicMaterial color={palette.blue} />}
      </Suspense>
    </mesh>
  )
}
