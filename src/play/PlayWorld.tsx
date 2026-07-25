// ============================================================
// PlayWorld — the 3D world, lazy-loaded so three/fiber/drei stay
// out of the main bundle. Composes the scene from the data
// contract; all world state comes from PlayContext (DOM side)
// and is passed into the Canvas as props — the Canvas runs its
// own reconciler, so scene components never reach for contexts.
//
// Post-foundation ownership: Canvas perf props → F; the pieces
// composed here (CameraRig, zones, screens, hotspots, ambient)
// belong to their own workstreams. Keep composition thin.
// ============================================================
import { useCallback, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useSensoryUI } from '@/lib/sensory-ui'
import { usePlay } from './PlayContext'
import { useHotspotAction } from './useHotspotAction'
import { usePlayColors } from './hooks/usePlayColors'
import { getZone, overviewHotspots, zones } from './data/playground'
import CameraRig, { GATE_POSE } from './scene/CameraRig'
import Hotspots from './scene/Hotspots'
import ZonePlaceholder from './scene/ZonePlaceholder'
import AmbientBed from './audio/AmbientBed'

export default function PlayWorld() {
  const { phase, focusedZoneId, reducedMotion, muted, introDone, goOverview } = usePlay()
  const palette = usePlayColors()
  const runAction = useHotspotAction()
  const { playSound } = useSensoryUI()
  const pointerDownAt = useRef<{ x: number; y: number } | null>(null)

  const hoverSound = useCallback(() => {
    void playSound('interaction.subtle')
  }, [playSound])

  const hotspots = focusedZoneId ? getZone(focusedZoneId).hotspots : overviewHotspots

  return (
    <>
      <div
        className="absolute inset-0"
        onPointerDownCapture={(event) => {
          pointerDownAt.current = { x: event.clientX, y: event.clientY }
        }}
      >
        <Canvas
          dpr={[1, 1.75]}
          // Idle at the gate (and under reduced motion) renders on demand only.
          frameloop={phase === 'gate' || reducedMotion ? 'demand' : 'always'}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          camera={{ fov: 45, position: GATE_POSE.position, near: 0.1, far: 120 }}
          onPointerMissed={(event) => {
            // Tap on nothing (not a drag) while focused → back to overview.
            const down = pointerDownAt.current
            if (down && Math.hypot(event.clientX - down.x, event.clientY - down.y) > 8) return
            if (phase === 'focused') {
              void playSound('navigation.backward')
              goOverview()
            }
          }}
        >
          <color attach="background" args={[palette.surfaceBase]} />
          <fog attach="fog" args={[palette.surfaceBase, 16, 42]} />
          <ambientLight intensity={0.8} />
          <hemisphereLight args={[palette.cyan, palette.ink, 0.4]} />
          <directionalLight position={[6, 10, 4]} intensity={1.4} />

          {/* Ground disc fading into the fog */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
            <circleGeometry args={[42, 48]} />
            <meshStandardMaterial color={palette.surfaceRaised} roughness={1} />
          </mesh>

          {zones.map((zone) => (
            <ZonePlaceholder key={zone.id} zone={zone} palette={palette} onAction={runAction} />
          ))}
          <Hotspots hotspots={hotspots} palette={palette} onAction={runAction} onHover={hoverSound} />
          <CameraRig
            phase={phase}
            focusedZoneId={focusedZoneId}
            reducedMotion={reducedMotion}
            onIntroDone={introDone}
          />
        </Canvas>
      </div>

      {/* Keyboard/screen-reader path to every visible hotspot */}
      <div role="group" aria-label="Places in the yard" className="absolute bottom-24 left-4 z-20">
        {hotspots.map((hotspot) => (
          <button
            key={hotspot.id}
            type="button"
            className="sr-only focus:not-sr-only focus:fixed focus:bottom-24 focus:left-4 focus:z-50 focus:inline-flex focus:h-9 focus:items-center focus:gap-1.5 focus:border-[1.5px] focus:border-opt-text-heading focus:bg-opt-surface-raised focus:px-3 focus:font-opt-mono focus:text-[12px] focus:text-opt-text-heading focus:outline-none"
            onClick={() => runAction(hotspot.action, hotspot.sound)}
          >
            {hotspot.label.toLowerCase()}
          </button>
        ))}
      </div>

      <AmbientBed active={phase !== 'gate'} muted={muted} />
    </>
  )
}
