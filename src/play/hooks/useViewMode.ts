// ============================================================
// useViewMode — persisted 2D/3D preference for /play.
// Defaults to the 3D scene, except for prefers-reduced-motion
// users who start on the calmer 2D map.
// ============================================================
import { useCallback, useEffect, useState } from 'react'

export type PlayView = '2d' | '3d'

const STORAGE_KEY = 'play:view'

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
