// ============================================================
// Billboard — the roadside "HIRE A DESIGNER" board (W1, owner
// decision §8.6). A paper-faced board on two posts near the road:
// big display line + the mono subline "Adedayo · inquire within →",
// a hood lamp on an arm that only burns in the night band, and a
// warm light-wash overlay on the face that rides env.lamp.
//
// CLICKABLE — dispatches { kind:'route' } through the shared
// action dispatcher, which plays the 'interaction.confirm' sting
// (soundForAction default for routes). Route target: verified
// that no `#contact` anchor is mounted on Home (the Contact block
// with id="contact" exists in src/blocks but no page renders it;
// Home's contact affordances are the footer ContactWidget + the
// FloatingContact FAB) — so per the brief this falls back to `/`.
// Swap BILLBOARD_ROUTE to '/#contact' the day Home mounts one.
//
// Far enough out to sit in fog range → fog-exempt materials in
// pre-toned colours, like the rest of the distant set.
// ============================================================
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import type { HotspotAction } from '../../data/playground'
import type { PlayPalette } from '../../hooks/usePlayColors'
import { mixColor } from '../materials'
import type { Env } from './environment'

/** No #contact anchor is mounted on Home (verified) — brief fallback. */
const BILLBOARD_ROUTE = '/'
const BILLBOARD_ACTION: HotspotAction = { kind: 'route', to: BILLBOARD_ROUTE }

const TAP_SLOP_PX = 6
const BOARD_W = 4.6
const BOARD_H = 2.4

function makeBoardTexture(palette: PlayPalette): THREE.CanvasTexture {
  const w = 640
  const h = 334
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!

  const paper = `#${new THREE.Color(palette.surfaceBase).getHexString()}`
  const ink = `#${new THREE.Color(palette.ink).getHexString()}`
  const yellow = `#${new THREE.Color(palette.yellow).getHexString()}`
  const secondary = `#${new THREE.Color(palette.textSecondary).getHexString()}`

  // Paper face + thin ink border
  ctx.fillStyle = paper
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = ink
  ctx.lineWidth = 6
  ctx.strokeRect(8, 8, w - 16, h - 16)

  // Big line — two stacked display rows
  ctx.fillStyle = ink
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.font = '900 96px "Arial Narrow", "Helvetica Neue", Arial, sans-serif'
  ctx.fillText('HIRE A', 46, 128, w - 92)
  ctx.fillText('DESIGNER', 46, 224, w - 92)

  // Yellow accent tick
  ctx.fillStyle = yellow
  ctx.fillRect(46, 246, 150, 12)

  // Mono subline
  ctx.fillStyle = secondary
  ctx.font = '500 30px "SF Mono", "IBM Plex Mono", Menlo, monospace'
  ctx.fillText('Adedayo · inquire within →', 46, 300, w - 92)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

export default function Billboard({
  palette,
  env,
  onAction,
}: {
  palette: PlayPalette
  env: Env
  onAction: (action: HotspotAction) => void
}) {
  const invalidate = useThree((s) => s.invalidate)
  const boardMat = useRef<THREE.MeshBasicMaterial>(null)
  const washMat = useRef<THREE.MeshBasicMaterial>(null)
  const lampDot = useRef<THREE.MeshBasicMaterial>(null)
  const ownsCursor = useRef(false)

  const texture = useMemo(() => makeBoardTexture(palette), [palette])
  useEffect(() => () => texture.dispose(), [texture])
  useEffect(
    () => () => {
      if (ownsCursor.current) document.body.style.cursor = ''
    },
    [],
  )

  const postMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: mixColor(palette.ink, palette.surfaceRaised, 0.2), fog: false }),
    [palette],
  )
  const backMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: mixColor(palette.ink, palette.blue, 0.12), fog: false }),
    [palette],
  )
  useEffect(
    () => () => {
      postMat.dispose()
      backMat.dispose()
    },
    [postMat, backMat],
  )
  const lampColor = useMemo(() => mixColor(palette.yellow, palette.surfaceRaised, 0.35), [palette])

  // The face dims as the sky darkens (windowGlow ≈ inverse daylight) and the
  // hood lamp claws warmth back at night. setScalar mutates — no allocations.
  useFrame(() => {
    if (boardMat.current) boardMat.current.color.setScalar(1.02 - 0.4 * env.windowGlow + 0.28 * env.lamp)
    if (washMat.current) washMat.current.opacity = 0.16 * env.lamp
    if (lampDot.current) lampDot.current.opacity = 0.1 + 0.9 * env.lamp
  })

  return (
    <group position={[13.5, 0, -27]} rotation={[0, -0.22, 0]}>
      {/* Posts */}
      <mesh position={[-1.6, 1.15, -0.12]} material={postMat}>
        <cylinderGeometry args={[0.09, 0.11, 2.3, 10]} />
      </mesh>
      <mesh position={[1.6, 1.15, -0.12]} material={postMat}>
        <cylinderGeometry args={[0.09, 0.11, 2.3, 10]} />
      </mesh>
      {/* Board backing + face */}
      <mesh position={[0, 3.2, -0.08]} material={backMat}>
        <boxGeometry args={[BOARD_W + 0.24, BOARD_H + 0.24, 0.12]} />
      </mesh>
      <mesh position={[0, 3.2, 0]}>
        <planeGeometry args={[BOARD_W, BOARD_H]} />
        <meshBasicMaterial ref={boardMat} map={texture} toneMapped={false} fog={false} />
      </mesh>
      {/* Warm lamp wash over the face (night) */}
      <mesh position={[0, 3.2, 0.015]}>
        <planeGeometry args={[BOARD_W, BOARD_H]} />
        <meshBasicMaterial
          ref={washMat}
          color={lampColor}
          transparent
          opacity={0}
          toneMapped={false}
          fog={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Hood lamp — arm over the top + head + glowing dot */}
      <mesh position={[0, 4.62, 0.16]} rotation={[0.5, 0, 0]} material={postMat}>
        <cylinderGeometry args={[0.035, 0.035, 0.7, 8]} />
      </mesh>
      <mesh position={[0, 4.78, 0.34]} material={backMat}>
        <boxGeometry args={[0.5, 0.12, 0.22]} />
      </mesh>
      <mesh position={[0, 4.7, 0.34]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshBasicMaterial ref={lampDot} color={lampColor} transparent opacity={0} toneMapped={false} fog={false} />
      </mesh>
      {/* Click target — the whole board face */}
      <mesh
        position={[0, 3.2, 0.05]}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation()
          if (e.delta > TAP_SLOP_PX) return
          onAction(BILLBOARD_ACTION)
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
          ownsCursor.current = true
          invalidate()
        }}
        onPointerOut={() => {
          document.body.style.cursor = ''
          ownsCursor.current = false
          invalidate()
        }}
      >
        <planeGeometry args={[BOARD_W + 0.3, BOARD_H + 0.3]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}
