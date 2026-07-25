// ============================================================
// usePlayColors — resolves the --opt-* CSS tokens the 3D scene
// needs into plain color strings THREE.Color can parse.
// Re-reads when next-themes flips the .dark class (one rAF later
// so the class change has landed).
// ============================================================
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

export type PlayPalette = {
  ink: string
  blue: string
  yellow: string
  coral: string
  cyan: string
  surfaceBase: string
  surfaceRaised: string
  textHeading: string
  textSecondary: string
  borderDefault: string
}

const TOKEN_MAP: Record<keyof PlayPalette, string> = {
  ink: '--opt-color-ink',
  blue: '--opt-color-blue-500',
  yellow: '--opt-color-yellow-500',
  coral: '--opt-color-coral-500',
  cyan: '--opt-color-cyan-100',
  surfaceBase: '--opt-surface-base',
  surfaceRaised: '--opt-surface-raised',
  textHeading: '--opt-text-heading',
  textSecondary: '--opt-text-secondary',
  borderDefault: '--opt-border-default',
}

// Light-theme values from tokens.css, used when a token is missing
// or resolves to something THREE.Color can't parse (e.g. color-mix).
const FALLBACK: PlayPalette = {
  ink: '#0F0E0E',
  blue: '#2364AA',
  yellow: '#F4C300',
  coral: '#F06060',
  cyan: '#B5F2F3',
  surfaceBase: '#FBFBF9',
  surfaceRaised: '#FFFFFF',
  textHeading: '#000000',
  textSecondary: '#737373',
  borderDefault: '#E5E5E5',
}

function parseable(value: string) {
  return value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')
}

function readPalette(): PlayPalette {
  const styles = getComputedStyle(document.documentElement)
  const palette = { ...FALLBACK }
  for (const key of Object.keys(TOKEN_MAP) as Array<keyof PlayPalette>) {
    const value = styles.getPropertyValue(TOKEN_MAP[key]).trim()
    if (value && parseable(value)) palette[key] = value
  }
  return palette
}

export function usePlayColors() {
  const { resolvedTheme } = useTheme()
  const [palette, setPalette] = useState<PlayPalette>(FALLBACK)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setPalette(readPalette()))
    return () => cancelAnimationFrame(raf)
  }, [resolvedTheme])

  return palette
}
