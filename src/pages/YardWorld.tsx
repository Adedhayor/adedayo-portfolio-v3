// The Yard's immersive WebGL world lives on /play/yard, while /play
// remains a browsable index of public experiments.
import { lazy, Suspense, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { SensoryUIProvider } from '@/lib/sensory-ui'
import { PlayProvider, usePlay } from '@/play/PlayContext'
import { WORLD_SOUND_CONFIG } from '@/play/audio/soundConfig'
import PlayFallback2D from '@/play/fallback/PlayFallback2D'
import EntryGate from '@/play/EntryGate'
import PlayHud from '@/play/hud/PlayHud'
import ZonePanel from '@/play/panels/ZonePanel'
import RouteLoader from '@/components/global/RouteLoader'

// Three, Fiber, and Drei stay out of the main bundle until someone
// opens the immersive world.
const PlayWorld = lazy(() => import('@/play/PlayWorld'))

function webglSupported(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

function WorldShell() {
  const { phase, muted } = usePlay()

  return (
    <SensoryUIProvider config={{ ...WORLD_SOUND_CONFIG, enabled: !muted }}>
      <div className="fixed inset-0 z-10 bg-opt-surface-base" aria-label="The Yard — interactive playground">
        <Suspense fallback={<RouteLoader label="Setting up The Yard" />}>
          <PlayWorld />
        </Suspense>
        <AnimatePresence>{phase === 'gate' ? <EntryGate key="gate" /> : null}</AnimatePresence>
        <PlayHud />
        <ZonePanel />
      </div>
    </SensoryUIProvider>
  )
}

export default function YardWorld() {
  const [webglOk] = useState(webglSupported)

  if (!webglOk) return <PlayFallback2D />

  return (
    <PlayProvider>
      <WorldShell />
    </PlayProvider>
  )
}
