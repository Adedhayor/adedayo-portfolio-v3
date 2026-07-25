// ============================================================
// World sound config — OWNED BY THE SOUND WORKSTREAM (D).
// Consumed by the nested <SensoryUIProvider> in the /play shell.
// `retro` fits the CRT diorama; hero is opt-in (off by default
// in sensory-ui) and the world wants its gate/milestone stings.
// ============================================================
import type { SensoryUIConfig } from '@/lib/sensory-ui'

export const WORLD_SOUND_CONFIG: Partial<SensoryUIConfig> = {
  theme: 'retro',
  categories: {
    interaction: true,
    overlay: true,
    navigation: true,
    notification: true,
    hero: true,
  },
}
