// ============================================================
// Play — /play. The Yard: an explorable dusk diorama of
// experiments, screens, and sound (foundation shell).
//
// Shell responsibilities only: WebGL probe, 2D/3D preference,
// gate → lazy world → HUD/panel layering, and the nested
// sound-provider scope. World internals live in src/play/.
// Post-foundation this file is frozen — workstreams own the
// pieces it composes, not the composition.
// ============================================================
import { lazy, Suspense, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { SensoryUIProvider } from '@/lib/sensory-ui'
import { PlayProvider, usePlay } from '@/play/PlayContext'
import { WORLD_SOUND_CONFIG } from '@/play/audio/soundConfig'
import { useViewMode } from '@/play/hooks/useViewMode'
import PlayFallback2D from '@/play/fallback/PlayFallback2D'
import EntryGate from '@/play/EntryGate'
import PlayHud from '@/play/hud/PlayHud'
import ZonePanel from '@/play/panels/ZonePanel'

// three + fiber + drei stay out of the main bundle — the world only
// downloads when someone actually stands at the gate.
const PlayWorld = lazy(() => import('@/play/PlayWorld'))

function webglSupported(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

function WorldShell({ onExitToGrid }: { onExitToGrid: () => void }) {
  const { phase, muted } = usePlay()
  return (
    // World mute drives the sting provider; the ambient bed reads the
    // same flag from PlayContext, so one toggle silences everything.
    <SensoryUIProvider config={{ ...WORLD_SOUND_CONFIG, enabled: !muted }}>
      <div className="fixed inset-0 z-10 bg-opt-surface-base" aria-label="The Yard — interactive playground">
        <Suspense
          fallback={
            <p className="absolute inset-0 flex items-center justify-center font-opt-mono text-[12px] uppercase tracking-[0.14em] text-opt-text-secondary">
              Setting up the yard…
            </p>
          }
        >
          <PlayWorld />
        </Suspense>
        <AnimatePresence>{phase === 'gate' && <EntryGate key="gate" />}</AnimatePresence>
        <PlayHud onExitToGrid={onExitToGrid} />
        <ZonePanel />
      </div>
    </SensoryUIProvider>
  )
}

export default function Play() {
  const [view, setView] = useViewMode()
  // Probe once per mount — no context is created, just support detection.
  const [webglOk] = useState(webglSupported)

  if (!webglOk || view === '2d') {
    return <PlayFallback2D onEnterWorld={webglOk ? () => setView('3d') : undefined} />
  }

  return (
    <PlayProvider>
      <WorldShell onExitToGrid={() => setView('2d')} />
    </PlayProvider>
  )
}
