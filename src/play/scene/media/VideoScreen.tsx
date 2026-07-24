// ============================================================
// VideoScreen — OWNED BY THE MEDIA WORKSTREAM (C). A screen
// plane that plays its transcoded demo loop as a video texture
// when the pool allows it, and falls back to its poster (or a
// flat tint) otherwise. The component API is the frozen contract
// the art workstream composes against — shells/frames around the
// plane belong to the world set, not here.
//
// Playback rules: muted + loop + playsInline (autoplay-safe);
// the video element is only created the first time the pool
// activates this screen ("warm"), then pause/play toggles with
// pool membership so hidden TVs stop decoding. Poster shows
// until the first frame is decodable.
//
// Deliberately NOT drei's useVideoTexture — it hard-bundles
// hls.js (~500KB) into the world chunk and our loops are plain
// MP4s on the same origin.
// ============================================================
import { Suspense, useEffect, useState } from 'react'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import type { HotspotAction, ScreenContent } from '../../data/playground'
import type { PlayPalette } from '../../hooks/usePlayColors'
import { useIsActiveScreen } from './videoPool'

function PosterMaterial({ url }: { url: string }) {
  const texture = useTexture(url)
  texture.colorSpace = THREE.SRGBColorSpace
  return <meshBasicMaterial map={texture} toneMapped={false} />
}

/** Lifecycle-managed <video> + THREE.VideoTexture. Created on `warm`,
    torn down (src released, texture disposed) on unmount. */
function useDemoVideo(src: string | undefined, warm: boolean, playing: boolean) {
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!src || !warm) return
    const video = document.createElement('video')
    video.src = src
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.crossOrigin = 'anonymous'
    video.preload = 'auto'
    const tex = new THREE.VideoTexture(video)
    tex.colorSpace = THREE.SRGBColorSpace
    const onLoaded = () => setReady(true)
    video.addEventListener('loadeddata', onLoaded)
    setTexture(tex)
    return () => {
      video.removeEventListener('loadeddata', onLoaded)
      video.pause()
      video.removeAttribute('src')
      video.load()
      tex.dispose()
      setTexture(null)
      setReady(false)
    }
  }, [src, warm])

  useEffect(() => {
    const video = texture?.image as HTMLVideoElement | undefined
    if (!video) return
    if (playing) {
      void video.play().catch(() => {
        // Autoplay refused (shouldn't happen muted) — poster stays.
      })
    } else {
      video.pause()
    }
  }, [texture, playing])

  return { texture, ready }
}

export type VideoScreenProps = {
  content: ScreenContent
  palette: PlayPalette
  /** Plane width in world units; height follows content.aspect (default 16:10) */
  width?: number
  onAction?: (action: HotspotAction) => void
}

export default function VideoScreen({ content, palette, width = 1.6, onAction }: VideoScreenProps) {
  const [aw, ah] = content.aspect ?? [16, 10]
  const height = width * (ah / aw)
  const active = useIsActiveScreen(content.id)
  // Once activated, keep the video element alive so pause/resume is
  // instant and we never re-download; never-activated screens stay posters.
  const [warm, setWarm] = useState(false)
  useEffect(() => {
    if (active) setWarm(true)
  }, [active])
  const { texture: videoTexture, ready } = useDemoVideo(content.video, warm, active)

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
      {/* Suspense stays INSIDE the mesh — useTexture suspends, and without
          a local boundary it would bubble past the Canvas and remount the
          whole world on every poster load. */}
      <Suspense fallback={<meshBasicMaterial color={palette.ink} />}>
        {videoTexture && ready ? (
          <meshBasicMaterial map={videoTexture} toneMapped={false} />
        ) : poster ? (
          <PosterMaterial url={poster} />
        ) : (
          <meshBasicMaterial color={palette.blue} />
        )}
      </Suspense>
    </mesh>
  )
}
