// ============================================================
// Facades — the three enterable buildings seen from the yard (W1).
// Bodies + roofs + lit marquee signs + window glows built around
// the door anchors from the Place contract (the "GO INSIDE" mono
// markers come from the shared Hotspots layer; these are the
// bodies wrapped around them). Each façade's front wall is also a
// click target → the same `enter` action, so the whole building
// invites you in, not just the floating dot.
//
//   gallery   — barn/shed, gable roof, a CRT glowing in a window
//   workspace — studio cabin, warm interior window
//   lab       — garage, roll-up door with a bubbling chemistry glow
//
// Window/sign glow rides env.windowGlow (dim by day, bright at
// night). Signs are crisp canvas-texture marquees, palette-driven
// and disposed on change.
// ============================================================
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import type { HotspotAction } from '../../data/playground'
import { places } from '../../data/playground'
import type { PlayPalette } from '../../hooks/usePlayColors'
import { mixColor, type WorldMaterials } from '../materials'
import type { Env } from './environment'

type FacadeShared = {
  palette: PlayPalette
  mats: WorldMaterials
  env: Env
  onAction: (action: HotspotAction) => void
}

const TAP_SLOP_PX = 6

// ------------------------------------------------------------
// Marquee sign — a crisp canvas-texture board that glows at night.
// ------------------------------------------------------------
function makeSignTexture(text: string, palette: PlayPalette): THREE.CanvasTexture {
  const w = 512
  const h = 150
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  // Board
  ctx.fillStyle = `#${mixColor(palette.ink, palette.surfaceBase, 0.08).getHexString()}`
  ctx.fillRect(0, 0, w, h)
  // Accent frame
  ctx.strokeStyle = `#${new THREE.Color(palette.yellow).getHexString()}`
  ctx.lineWidth = 8
  ctx.strokeRect(10, 10, w - 20, h - 20)
  // Text
  ctx.fillStyle = `#${new THREE.Color(palette.surfaceRaised).getHexString()}`
  ctx.font = '900 62px "Arial Narrow", "Helvetica Neue", Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text.toUpperCase(), w / 2, h / 2 + 4, w - 48)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

function SignBoard({
  text,
  palette,
  env,
  position,
  width = 2.4,
}: {
  text: string
  palette: PlayPalette
  env: Env
  position: [number, number, number]
  width?: number
}) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  const texture = useMemo(() => makeSignTexture(text, palette), [text, palette])
  useEffect(() => () => texture.dispose(), [texture])
  useFrame(() => {
    if (matRef.current) matRef.current.emissiveIntensity = 0.35 + env.windowGlow * 1.0
  })
  const height = width * (150 / 512)
  return (
    <mesh position={position}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial
        ref={matRef}
        map={texture}
        emissiveMap={texture}
        emissive={palette.yellow}
        emissiveIntensity={0.6}
        roughness={0.7}
        toneMapped={false}
      />
    </mesh>
  )
}

// ------------------------------------------------------------
// Clickable façade front — invisible hit box, drag-vs-tap guarded.
// ------------------------------------------------------------
function EnterHit({
  action,
  onAction,
  size,
  position,
}: {
  action: HotspotAction
  onAction: (action: HotspotAction) => void
  size: [number, number, number]
  position: [number, number, number]
}) {
  const invalidate = useThree((s) => s.invalidate)
  const owns = useRef(false)
  useEffect(
    () => () => {
      if (owns.current) document.body.style.cursor = ''
    },
    [],
  )
  return (
    <mesh
      position={position}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        if (e.delta > TAP_SLOP_PX) return
        onAction(action)
      }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
        owns.current = true
        invalidate()
      }}
      onPointerOut={() => {
        document.body.style.cursor = ''
        owns.current = false
        invalidate()
      }}
    >
      <boxGeometry args={size} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

// ------------------------------------------------------------
// A glowing window pane whose emissive rides env.windowGlow.
// ------------------------------------------------------------
function GlowPane({
  color,
  env,
  base = 0.5,
  position,
  size,
}: {
  color: string | THREE.Color
  env: Env
  base?: number
  position: [number, number, number]
  size: [number, number]
}) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  useFrame(() => {
    if (matRef.current) matRef.current.emissiveIntensity = base + env.windowGlow * 1.6
  })
  return (
    <mesh position={position}>
      <planeGeometry args={size} />
      <meshStandardMaterial
        ref={matRef}
        color={color}
        emissive={color}
        emissiveIntensity={base}
        toneMapped={false}
      />
    </mesh>
  )
}

// ------------------------------------------------------------
// Gallery — barn/shed with a gable roof + a CRT in the window.
// Anchor [-8, 0, -1]; front wall at z = -1.
// ------------------------------------------------------------
function GalleryFacade({ palette, mats, env, onAction }: FacadeShared) {
  const place = places.find((p) => p.id === 'gallery')!
  const [ax, , az] = place.exterior.anchor
  const bodyH = 2.4
  const bodyW = 4
  const depth = 3
  const frontZ = az // -1
  const centerZ = frontZ - depth / 2
  const crtGlow = useRef<THREE.MeshBasicMaterial>(null)
  useFrame(() => {
    if (crtGlow.current) crtGlow.current.opacity = 0.55 + env.windowGlow * 0.45
  })
  return (
    <group position={[ax, 0, 0]}>
      {/* Body */}
      <mesh position={[0, bodyH / 2, centerZ]} material={mats.wood}>
        <boxGeometry args={[bodyW, bodyH, depth]} />
      </mesh>
      {/* Gable roof — two leaning slabs meeting at a ridge */}
      <mesh position={[-1.02, bodyH + 0.42, centerZ]} rotation={[0, 0, 0.72]} material={mats.shellDark}>
        <boxGeometry args={[1.9, 0.12, depth + 0.3]} />
      </mesh>
      <mesh position={[1.02, bodyH + 0.42, centerZ]} rotation={[0, 0, -0.72]} material={mats.shellDark}>
        <boxGeometry args={[1.9, 0.12, depth + 0.3]} />
      </mesh>
      {/* Door recess */}
      <mesh position={[0, 0.85, frontZ + 0.01]} material={mats.shellDark}>
        <boxGeometry args={[1.0, 1.7, 0.08]} />
      </mesh>
      {/* Window opening (left of door) with a CRT peeking through */}
      <mesh position={[-1.2, 1.35, frontZ + 0.01]} material={mats.shellDark}>
        <boxGeometry args={[0.95, 0.8, 0.06]} />
      </mesh>
      <group position={[-1.2, 1.35, frontZ + 0.08]}>
        {/* CRT shell */}
        <mesh position={[0, 0, 0]} material={mats.shell}>
          <boxGeometry args={[0.62, 0.5, 0.28]} />
        </mesh>
        {/* Emissive blue screen (no video — pure exterior scenery) */}
        <mesh position={[0, 0.02, 0.15]}>
          <planeGeometry args={[0.44, 0.32]} />
          <meshBasicMaterial ref={crtGlow} color={palette.blue} transparent opacity={0.7} toneMapped={false} />
        </mesh>
      </group>
      {/* Marquee */}
      <SignBoard text="Wall of Arts" palette={palette} env={env} position={[0, bodyH + 0.05, frontZ + 0.05]} width={2.6} />
      <EnterHit
        action={place.exterior.door.action}
        onAction={onAction}
        size={[bodyW, bodyH, 0.2]}
        position={[0, bodyH / 2, frontZ]}
      />
    </group>
  )
}

// ------------------------------------------------------------
// Workspace — studio cabin with a warm interior window.
// Anchor [8, 0, -1]; front wall at z = -1.
// ------------------------------------------------------------
function WorkspaceFacade({ palette, mats, env, onAction }: FacadeShared) {
  const place = places.find((p) => p.id === 'workspace')!
  const [ax, , az] = place.exterior.anchor
  const bodyH = 2.3
  const bodyW = 3.4
  const depth = 2.8
  const frontZ = az
  const centerZ = frontZ - depth / 2
  const warm = useMemo(() => mixColor(palette.yellow, palette.coral, 0.28), [palette])
  return (
    <group position={[ax, 0, 0]}>
      <mesh position={[0, bodyH / 2, centerZ]} material={mats.wood}>
        <boxGeometry args={[bodyW, bodyH, depth]} />
      </mesh>
      {/* Shallow gable */}
      <mesh position={[-0.85, bodyH + 0.32, centerZ]} rotation={[0, 0, 0.5]} material={mats.shellDark}>
        <boxGeometry args={[1.7, 0.12, depth + 0.3]} />
      </mesh>
      <mesh position={[0.85, bodyH + 0.32, centerZ]} rotation={[0, 0, -0.5]} material={mats.shellDark}>
        <boxGeometry args={[1.7, 0.12, depth + 0.3]} />
      </mesh>
      {/* Door recess */}
      <mesh position={[0.95, 0.85, frontZ + 0.01]} material={mats.shellDark}>
        <boxGeometry args={[0.9, 1.7, 0.08]} />
      </mesh>
      {/* Warm window (left) + its frame */}
      <mesh position={[-0.85, 1.3, frontZ + 0.005]} material={mats.shellDark}>
        <boxGeometry args={[1.35, 1.0, 0.05]} />
      </mesh>
      <GlowPane color={warm} env={env} base={0.55} position={[-0.85, 1.3, frontZ + 0.04]} size={[1.15, 0.82]} />
      <SignBoard text="Workspace" palette={palette} env={env} position={[0, bodyH + 0.02, frontZ + 0.05]} width={2.4} />
      <EnterHit
        action={place.exterior.door.action}
        onAction={onAction}
        size={[bodyW, bodyH, 0.2]}
        position={[0, bodyH / 2, frontZ]}
      />
    </group>
  )
}

// ------------------------------------------------------------
// Lab — garage with a roll-up door + a bubbling chemistry glow.
// Anchor [0, 0, 0]; front wall at z = 0. The hero, dead centre.
// ------------------------------------------------------------
function LabFacade({ palette, mats, env, reducedMotion, onAction }: FacadeShared & { reducedMotion: boolean }) {
  const place = places.find((p) => p.id === 'lab')!
  const [ax, , az] = place.exterior.anchor
  const bodyH = 2.6
  const bodyW = 4.2
  const depth = 3.2
  const frontZ = az // 0
  const centerZ = frontZ - depth / 2
  const glowColor = useMemo(() => mixColor(palette.cyan, palette.blue, 0.35), [palette])
  const glowLight = useRef<THREE.PointLight>(null)
  useFrame((state) => {
    if (!glowLight.current) return
    const pulse = reducedMotion ? 1 : 1 + Math.sin(state.clock.elapsedTime * 2.4) * 0.18
    glowLight.current.intensity = (0.6 + env.windowGlow * 2.2) * pulse
  })
  return (
    <group position={[ax, 0, 0]}>
      {/* Body */}
      <mesh position={[0, bodyH / 2, centerZ]} material={mats.shell}>
        <boxGeometry args={[bodyW, bodyH, depth]} />
      </mesh>
      {/* Low parapet roof */}
      <mesh position={[0, bodyH + 0.08, centerZ]} material={mats.shellDark}>
        <boxGeometry args={[bodyW + 0.2, 0.16, depth + 0.2]} />
      </mesh>
      {/* Roll-up garage door (metal) */}
      <mesh position={[0, 1.05, frontZ + 0.02]} material={mats.metal}>
        <boxGeometry args={[2.4, 2.0, 0.08]} />
      </mesh>
      {/* Bubbling glow strip leaking under the door */}
      <GlowPane color={glowColor} env={env} base={0.4} position={[0, 0.14, frontZ + 0.06]} size={[2.3, 0.18]} />
      {/* Side window glow */}
      <GlowPane color={glowColor} env={env} base={0.35} position={[-1.55, 1.5, frontZ + 0.04]} size={[0.7, 0.7]} />
      <pointLight ref={glowLight} position={[0, 0.6, frontZ + 0.6]} color={glowColor} distance={4.5} intensity={1} />
      <SignBoard text="Lab" palette={palette} env={env} position={[0, bodyH + 0.02, frontZ + 0.05]} width={2.0} />
      <EnterHit
        action={place.exterior.door.action}
        onAction={onAction}
        size={[bodyW, bodyH, 0.2]}
        position={[0, bodyH / 2, frontZ]}
      />
    </group>
  )
}

export default function Facades({
  palette,
  mats,
  env,
  reducedMotion,
  onAction,
}: FacadeShared & { reducedMotion: boolean }) {
  return (
    <>
      <GalleryFacade palette={palette} mats={mats} env={env} onAction={onAction} />
      <WorkspaceFacade palette={palette} mats={mats} env={env} onAction={onAction} />
      <LabFacade palette={palette} mats={mats} env={env} reducedMotion={reducedMotion} onAction={onAction} />
    </>
  )
}
