// ============================================================
// World sound config — OWNED BY THE SOUND WORKSTREAM (D).
// Consumed by the nested <SensoryUIProvider> in the /play shell.
// `retro` fits the CRT diorama; hero is opt-in (off by default
// in sensory-ui) and the world wants its gate/milestone stings.
// ============================================================
import type { SensoryUIConfig } from '@/lib/sensory-ui'

export const WORLD_SOUND_CONFIG: Partial<SensoryUIConfig> = {
  theme: 'retro', // to A/B, swap for 'aero' or 'crisp' — the closest alternates for this world
  categories: {
    interaction: true,
    overlay: true,
    navigation: true,
    notification: true,
    hero: true,
  },
}

/**
 * Final level of the ambient drone's master GainNode — the one knob for
 * how loud the bed sits under the UI stings. (~0.06 = quiet dusk hum.)
 */
export const AMBIENT_LEVEL = 0.06
