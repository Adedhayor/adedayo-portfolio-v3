// ============================================================
// useViewMode — persisted 2D/3D preference for /play.
// Defaults to the 3D scene, except for prefers-reduced-motion
// users who start on the calmer 2D map.
// ============================================================
import { useCallback, useEffect, useState } from 'react'

export type PlayView = '2d' | '3d'

const STORAGE_KEY = 'play:view'

/** Fired (on window) by the in-Canvas perf governor when the WebGL
    context is lost. Defined here — not in AdaptiveQuality — so this
    hook never imports three/fiber into the main bundle. */
export const WEBGL_LOST_EVENT = 'play:webgl-lost'

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function initialView(): PlayView {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === '2d' || stored === '3d') return stored
  } catch {
    // storage unavailable — fall through to default
  }
  return prefersReducedMotion() ? '2d' : '3d'
}

export function useViewMode() {
  const [view, setViewState] = useState<PlayView>(initialView)

  const setView = useCallback((next: PlayView) => {
    setViewState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // storage unavailable — preference just won't persist
    }
  }, [])

  // The world dispatches this when its WebGL context dies (GPU
  // pressure, driver reset, context-count cap). Swap to the 2D
  // fallback rather than leaving a black canvas on screen.
  useEffect(() => {
    const onWebglLost = () => setView('2d')
    window.addEventListener(WEBGL_LOST_EVENT, onWebglLost)
    return () => window.removeEventListener(WEBGL_LOST_EVENT, onWebglLost)
  }, [setView])

  return [view, setView] as const
}

export function useReducedMotionFlag() {
  const [reduced, setReduced] = useState(prefersReducedMotion)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return reduced
}
