// ============================================================
// MonitorCarousel (W3) — the Workspace hero. A monitor on the desk
// showing ONE case-study screen at a time via ScreenSurface (the
// videoPool still decides playback; this component only chooses
// WHICH screen is composed). Component-local index state, wrapping.
//
// Controls:
//   • ←/→ paddle meshes flanking the screen — hover cursor + a
//     small press dip (spring, Hotspots pattern), tap-vs-drag
//     guarded via e.delta.
//   • Wheel over the monitor steps too (debounced ~250ms;
//     stopPropagation + stopImmediatePropagation so orbit dolly
//     doesn't fight while hovering the slide).
//   • Click the slide → { kind: 'lightbox', screenId } through the
//     shared dispatcher (invisible hit-plane over the screen; the
//     ScreenSurface itself gets no onAction so its own route
//     action can't double-fire).
//   • Caption strip under the slide: title + "n/8", mono, Html,
//     pointer-events-none.
//
// KNOWN GAP (for the integrator): carousel steps are SILENT. The
// spec wants a `navigation.tab` sting per step, but a step is not
// a HotspotAction (nothing should route/open), and sound hooks are
// contexts that can't cross into the Canvas. W5/integrator: thread
// a `playSound`-style callback prop through PlayWorld → room →
// here, then call it in step().
// ============================================================
import { useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import type { SoundRole } from '@/lib/sensory-ui'
import type { HotspotAction, ScreenContent } from '../../../data/playground'
import type { PlayPalette } from '../../../hooks/usePlayColors'
import type { WorldMaterials } from '../../materials'
import ScreenSurface from '../../media/ScreenSurface'

const MONITOR_W = 1.9
const MONITOR_H = MONITOR_W * (10 / 16)
const SCREEN_CENTER_Y = 0.3 + MONITOR_H / 2 // above the desk surface (group origin)
const WHEEL_DEBOUNCE_MS = 250
const TAP_SLOP_PX = 6

// ------------------------------------------------------------
// Paddle — a ←/→ step button: backing disc + arrow cone, hover
// cursor, press dip on tap (spring scale + invalidate so it also
// animates under the demand frameloop).
// ------------------------------------------------------------
function Paddle({
  dir,
  position,
  palette,
  mats,
  onStep,
}: {
  dir: -1 | 1
  position: [number, number, number]
  palette: PlayPalette
  mats: WorldMaterials
  onStep: (dir: -1 | 1) => void
}) {
  const invalidate = useThree((s) => s.invalidate)
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const punchUntil = useRef(0)
  const setCursor = useRef(false)

  // If we unmount mid-hover (room swap), pointerOut never fires — clear
  // the cursor ourselves, but only if THIS paddle set it.
  useEffect(
    () => () => {
      if (setCursor.current) document.body.style.cursor = ''
    },
    [],
  )

  useFrame((_, delta) => {
    const group = groupRef.current
    if (!group) return
    const punching = performance.now() < punchUntil.current
    const target = punching ? 0.84 : hovered ? 1.1 : 1
    const k = 1 - Math.exp(-12 * delta)
    const next = group.scale.x + (target - group.scale.x) * k
    group.scale.setScalar(next)
    if (punching || Math.abs(next - target) > 0.001) invalidate()
  })

  return (
    <group ref={groupRef} position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]} material={mats.shellDark}>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 20]} />
      </mesh>
      <mesh position={[dir * 0.01, 0, 0.04]} rotation={[0, 0, dir * -(Math.PI / 2)]}>
        <coneGeometry args={[0.06, 0.12, 16]} />
        <meshBasicMaterial color={hovered ? palette.textHeading : palette.yellow} toneMapped={false} />
      </mesh>
      {/* Oversized invisible hit target */}
      <mesh
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation()
          if (e.delta > TAP_SLOP_PX) return // drag, not a tap
          punchUntil.current = performance.now() + 130
          invalidate()
          onStep(dir)
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
          setCursor.current = true
          setHovered(true)
          invalidate()
        }}
        onPointerOut={() => {
          document.body.style.cursor = ''
          setCursor.current = false
          setHovered(false)
          invalidate()
        }}
      >
        <sphereGeometry args={[0.24, 10, 10]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}

// ------------------------------------------------------------
// The monitor. Group origin sits ON the desk surface, centred.
// ------------------------------------------------------------
export default function MonitorCarousel({
  screens,
  palette,
  mats,
  onAction,
  onStepSound,
}: {
  screens: ScreenContent[]
  palette: PlayPalette
  mats: WorldMaterials
  onAction: (action: HotspotAction, sound?: SoundRole) => void
  /** navigation.tab sting per step — threaded from PlayWorld (DOM side). */
  onStepSound?: () => void
}) {
  const invalidate = useThree((s) => s.invalidate)
  const [index, setIndex] = useState(0)
  const lastWheel = useRef(0)
  const hitCursor = useRef(false)

  useEffect(
    () => () => {
      if (hitCursor.current) document.body.style.cursor = ''
    },
    [],
  )

  const total = screens.length
  const screen = screens[total ? index % total : 0]

  const step = useCallback(
    (dir: -1 | 1) => {
      if (!total) return
      setIndex((i) => (i + dir + total) % total)
      onStepSound?.()
      invalidate()
    },
    [total, invalidate, onStepSound],
  )

  const onWheel = useCallback(
    (e: ThreeEvent<WheelEvent>) => {
      // Keep the orbit's dolly out of the fight while over the monitor.
      e.stopPropagation()
      e.nativeEvent.stopImmediatePropagation()
      const now = performance.now()
      if (now - lastWheel.current < WHEEL_DEBOUNCE_MS) return
      const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      if (d === 0) return
      lastWheel.current = now
      step(d > 0 ? 1 : -1)
    },
    [step],
  )

  if (!screen) return null

  return (
    <group>
      {/* Stand: foot + neck */}
      <mesh position={[0, 0.02, -0.02]} material={mats.shellDark}>
        <boxGeometry args={[0.46, 0.04, 0.3]} />
      </mesh>
      <mesh position={[0, 0.17, -0.06]} material={mats.metal}>
        <boxGeometry args={[0.07, 0.28, 0.06]} />
      </mesh>

      {/* Bezel */}
      <mesh position={[0, SCREEN_CENTER_Y, -0.06]} material={mats.shellDark}>
        <boxGeometry args={[MONITOR_W + 0.08, MONITOR_H + 0.08, 0.06]} />
      </mesh>
      {/* Power LED */}
      <mesh position={[MONITOR_W / 2 - 0.05, SCREEN_CENTER_Y - MONITOR_H / 2 - 0.015, -0.028]}>
        <circleGeometry args={[0.012, 8]} />
        <meshBasicMaterial color={palette.yellow} toneMapped={false} />
      </mesh>

      {/* The slide — keyed so each case study gets a fresh surface; the
          videoPool decides whether it actually plays. */}
      <group position={[0, SCREEN_CENTER_Y, -0.03]}>
        <ScreenSurface key={screen.id} content={screen} palette={palette} width={MONITOR_W} />
      </group>

      {/* Invisible hit-plane over the slide → lightbox (+ wheel stepping). */}
      <mesh
        position={[0, SCREEN_CENTER_Y, -0.01]}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation()
          if (e.delta > TAP_SLOP_PX) return
          onAction({ kind: 'lightbox', screenId: screen.id })
        }}
        onWheel={onWheel}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
          hitCursor.current = true
        }}
        onPointerOut={() => {
          document.body.style.cursor = ''
          hitCursor.current = false
        }}
      >
        <planeGeometry args={[MONITOR_W, MONITOR_H]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* ←/→ paddles flanking the screen */}
      <Paddle dir={-1} position={[-(MONITOR_W / 2 + 0.26), SCREEN_CENTER_Y, 0]} palette={palette} mats={mats} onStep={step} />
      <Paddle dir={1} position={[MONITOR_W / 2 + 0.26, SCREEN_CENTER_Y, 0]} palette={palette} mats={mats} onStep={step} />

      {/* Caption strip: current title + n/N */}
      <Html center zIndexRange={[15, 0]} position={[0, SCREEN_CENTER_Y - MONITOR_H / 2 - 0.17, 0.1]} className="pointer-events-none select-none">
        <div
          className="flex items-center gap-2 whitespace-nowrap border-[1.5px] px-2.5 py-1 font-opt-mono text-[10px] uppercase tracking-[0.14em]"
          style={{
            color: palette.textHeading,
            backgroundColor: palette.surfaceRaised,
            borderColor: palette.borderDefault,
          }}
        >
          <span className="max-w-[240px] overflow-hidden text-ellipsis">{screen.title}</span>
          <span style={{ color: palette.textSecondary }}>
            {(index % total) + 1}/{total}
          </span>
        </div>
      </Html>
    </group>
  )
}
