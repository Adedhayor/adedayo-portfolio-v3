// ============================================================
// RiveScreen — prototype for the interactive-scenery workstream.
// Renders a Rive state machine to an offscreen canvas and feeds
// it into a THREE.CanvasTexture on a screen plane, mirroring
// VideoScreen's lifecycle (create on warm, dispose on unmount).
//
// Unlike THREE.VideoTexture, THREE.CanvasTexture does NOT default
// to mipmap-free linear filtering — it inherits generateMipmaps:
// true + minFilter: LinearMipmapLinearFilter from the base Texture
// class. Our canvas is NPOT (819×512) and re-painted every frame,
// so those defaults leave it mip-incomplete and it silently
// samples as solid black. Must set generateMipmaps: false and a
// non-mipmap filter explicitly.
//
// The canvas is kept out of layout (position: fixed, opacity 0,
// pointer-events: none — real clicks/scroll never reach it) but
// IS attached to the document, because Rive's own pointer
// Listeners (hover/press regions authored in the Rive editor)
// read the canvas's getBoundingClientRect() to map coordinates;
// a fully detached canvas reports a 0×0 rect and silently zeroes
// out both that math and resizeDrawingSurfaceToCanvas(). CSS size
// is pinned 1:1 to the buffer size so no devicePixelRatio scaling
// is needed for the coordinate math below.
//
// Two interactivity paths run in parallel, since Rive assets are
// authored either way: named state-machine inputs (set directly,
// no coordinate math — used if the asset exposes an input whose
// name looks like "hover"/"click") and forwarded pointer events
// (for assets, like this prototype's, that rely on editor-authored
// Listener hit regions instead of named inputs).
// ============================================================
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Rive, Fit, Layout, type StateMachineInput } from '@rive-app/canvas'
import type { ThreeEvent } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'
import type { HotspotAction, ScreenContent } from '../../data/playground'
import type { PlayPalette } from '../../hooks/usePlayColors'

const CANVAS_HEIGHT = 512

function findInput(inputs: StateMachineInput[], hints: string[]) {
  return inputs.find((i) => hints.some((h) => i.name.toLowerCase().includes(h)))
}

function useRiveTexture(rive: NonNullable<ScreenContent['rive']>, aspect: [number, number]) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null)
  const riveRef = useRef<Rive | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const hoverInputRef = useRef<StateMachineInput | null>(null)
  const clickInputRef = useRef<StateMachineInput | null>(null)

  useEffect(() => {
    const canvas = document.createElement('canvas')
    const width = Math.round((CANVAS_HEIGHT * aspect[0]) / aspect[1])
    canvas.width = width
    canvas.height = CANVAS_HEIGHT
    canvas.style.cssText = `position:fixed; left:0; top:0; width:${width}px; height:${CANVAS_HEIGHT}px; opacity:0; pointer-events:none;`
    document.body.appendChild(canvas)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.generateMipmaps = false
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    setTexture(tex)

    const r = new Rive({
      canvas,
      src: rive.src,
      autoplay: true,
      stateMachines: rive.stateMachine,
      layout: new Layout({ fit: Fit.Cover }),
      onLoad: () => {
        const smName = rive.stateMachine ?? r.stateMachineNames[0]
        if (!smName) return
        const inputs = r.stateMachineInputs(smName) ?? []
        hoverInputRef.current =
          (rive.hoverInput ? inputs.find((i) => i.name === rive.hoverInput) : undefined) ??
          findInput(inputs, ['hover']) ??
          null
        clickInputRef.current =
          (rive.clickInput ? inputs.find((i) => i.name === rive.clickInput) : undefined) ??
          findInput(inputs, ['click', 'tap', 'press']) ??
          null
      },
    })
    riveRef.current = r
    canvasRef.current = canvas

    return () => {
      r.cleanup()
      riveRef.current = null
      canvasRef.current = null
      hoverInputRef.current = null
      clickInputRef.current = null
      tex.dispose()
      setTexture(null)
      canvas.remove()
    }
  }, [rive, aspect])

  const dispatchPointer = (type: string, u: number, v: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const clientX = u * canvas.width
    const clientY = (1 - v) * canvas.height
    canvas.dispatchEvent(
      new PointerEvent(type, { clientX, clientY, bubbles: true, pointerId: 1, isPrimary: true }),
    )
  }

  const setHover = (value: boolean, uv?: { x: number; y: number }) => {
    const input = hoverInputRef.current
    if (input) input.value = value
    if (uv) dispatchPointer(value ? 'pointermove' : 'pointerleave', uv.x, uv.y)
  }
  const movePointer = (uv: { x: number; y: number }) => dispatchPointer('pointermove', uv.x, uv.y)
  const fireClick = (uv?: { x: number; y: number }) => {
    clickInputRef.current?.fire()
    if (uv) {
      dispatchPointer('pointerdown', uv.x, uv.y)
      dispatchPointer('pointerup', uv.x, uv.y)
    }
  }

  return { texture, setHover, movePointer, fireClick }
}

export type RiveScreenProps = {
  content: ScreenContent
  palette: PlayPalette
  width?: number
  onAction?: (action: HotspotAction) => void
}

/** Guaranteed a `rive` config by RiveScreen below — keeps hook order stable. */
function RiveScreenLoaded({
  content,
  rive,
  palette,
  width,
  onAction,
}: RiveScreenProps & { rive: NonNullable<ScreenContent['rive']>; width: number }) {
  const [aw, ah] = content.aspect ?? [16, 10]
  const height = width * (ah / aw)
  const { texture, setHover, movePointer, fireClick } = useRiveTexture(
    rive,
    content.aspect ?? [16, 10],
  )
  const clickable = Boolean(content.action && onAction)

  // Rive draws into the canvas on its own RAF loop; the GPU texture
  // only picks up new pixels when we say so.
  useFrame(() => {
    if (texture) texture.needsUpdate = true
  })

  return (
    <mesh
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        if (e.uv) setHover(true, e.uv)
        if (clickable) document.body.style.cursor = 'pointer'
      }}
      onPointerMove={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        if (e.uv) movePointer(e.uv)
      }}
      onPointerOut={(e: ThreeEvent<PointerEvent>) => {
        setHover(false, e.uv)
        if (clickable) document.body.style.cursor = ''
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        fireClick(e.uv)
        if (clickable) onAction?.(content.action as HotspotAction)
      }}
    >
      <planeGeometry args={[width, height]} />
      {/* Distinct `key`s force a fresh material instance per branch —
          otherwise R3F mutates the existing one in place and a stale
          `color` from the fallback branch keeps multiplying against
          the texture map (MeshBasicMaterial does color × map), crushing
          it to near-black even once the real texture is ready. */}
      {texture ? (
        <meshBasicMaterial key="rive-map" map={texture} color="#ffffff" toneMapped={false} />
      ) : (
        <meshBasicMaterial key="rive-fallback" color={palette.ink} />
      )}
    </mesh>
  )
}

export default function RiveScreen({ content, palette, width = 1.6, onAction }: RiveScreenProps) {
  if (!content.rive) return null
  return (
    <RiveScreenLoaded
      content={content}
      rive={content.rive}
      palette={palette}
      width={width}
      onAction={onAction}
    />
  )
}
