// ============================================================
// PlayWorld — the 3D world, lazy-loaded so three/fiber/drei stay
// out of the main bundle. Composes the scene from the data
// contract; all world state comes from PlayContext (DOM side)
// and is passed into the Canvas as props — the Canvas runs its
// own reconciler, so scene components never reach for contexts.
//
// Phase 2: only the ACTIVE location's scene group is mounted —
// outside (SetDressing + WorldZones stand-in) OR one interior
// room. The swap happens behind the door veil. Post-integration
// ownership: Canvas perf props → F; outside → W1; interiors →
// W2/W3/W4. Keep composition thin.
// ============================================================
import { useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { useSensoryUI } from '@/lib/sensory-ui'
import { usePlay } from './PlayContext'
import { useHotspotAction } from './useHotspotAction'
import { usePlayColors } from './hooks/usePlayColors'
import { hotspotsForLocation } from './data/playground'
import CameraRig, { GATE_POSE } from './scene/CameraRig'
import Hotspots from './scene/Hotspots'
import SetDressing from './scene/set/SetDressing'
import WorldZones from './scene/zones/WorldZones'
import GalleryRoom from './scene/interiors/gallery/PlaceholderRoom'
import WorkspaceRoom from './scene/interiors/workspace/PlaceholderRoom'
import LabRoom from './scene/interiors/lab/PlaceholderRoom'
import { VideoPoolController } from './scene/media/videoPool'
import AmbientBed from './audio/AmbientBed'
import AdaptiveQuality, { initialDpr } from './fallback/AdaptiveQuality'

export default function PlayWorld() {
  const { phase, location, reducedMotion, muted, introDone } = usePlay()
  const palette = usePlayColors()
  const runAction = useHotspotAction()
  const { playSound } = useSensoryUI()

  const hoverSound = useCallback(() => {
    void playSound('interaction.subtle')
  }, [playSound])

  const hotspots = hotspotsForLocation(location)

  return (
    <>
      <div className="absolute inset-0">
        <Canvas
          // Coarse pointers start capped at 1.5; AdaptiveQuality steps
          // dpr from here on sustained low fps. Stable value — see initialDpr().
          dpr={initialDpr()}
          // Idle at the gate (and under reduced motion) renders on demand only.
          frameloop={phase === 'gate' || reducedMotion ? 'demand' : 'always'}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          camera={{ fov: 45, position: GATE_POSE.position, near: 0.1, far: 120 }}
        >
          <AdaptiveQuality />

          {/* Only the active location's scene group is mounted — the perf
              win that pays for richer interiors, and why you never see the
              rest of the world from inside a building. */}
          {location === 'outside' && (
            <>
              <SetDressing palette={palette} />
              <WorldZones palette={palette} onAction={runAction} reducedMotion={reducedMotion} />
            </>
          )}
          {location === 'gallery' && <GalleryRoom palette={palette} onAction={runAction} />}
          {location === 'workspace' && <WorkspaceRoom palette={palette} onAction={runAction} />}
          {location === 'lab' && <LabRoom palette={palette} onAction={runAction} />}

          <Hotspots hotspots={hotspots} palette={palette} onAction={runAction} onHover={hoverSound} />
          <CameraRig phase={phase} location={location} reducedMotion={reducedMotion} onIntroDone={introDone} />
        </Canvas>
      </div>

      {/* Keyboard/screen-reader path to every visible hotspot in this location */}
      <div role="group" aria-label="Places you can go" className="absolute bottom-24 left-4 z-20">
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

      <VideoPoolController />
      <AmbientBed active={phase !== 'gate'} muted={muted} />
    </>
  )
}
