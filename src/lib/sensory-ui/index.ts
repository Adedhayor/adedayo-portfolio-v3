// ============================================================
// sensory-ui — runtime-synthesized UI sound system, ported from
// Effects Studio (no audio files; pure Web Audio). 17 semantic
// roles × 9 packs. Mount <SensoryUIProvider>, play via
// usePlaySound({ sound: 'interaction.tap' }).
//
// NOTE: engine playback is single-slot — a new sound stops the
// previous one. Long-running audio (the /play ambient bed) must
// build its own nodes on getAudioContext(), never playSound().
// ============================================================
export { SensoryUIProvider, useSensoryUI, type SensoryUIContextValue } from './provider'
export { usePlaySound, type UsePlaySoundOptions, type UsePlaySoundReturn } from './use-play-sound'
export {
  ALL_SOUND_ROLES,
  parseRole,
  type SoundRole,
  type SoundCategory,
  type InteractionRole,
  type OverlayRole,
  type NavigationRole,
  type NotificationRole,
  type HeroRole,
} from './sound-roles'
export { defaultConfig, mergeConfig, resolveRole, type SensoryUIConfig } from './config'
export { packRegistry, DEFAULT_PACK, type SoundPackName, type SoundPack } from './registry'
export {
  getAudioContext,
  playSound,
  closeAudioContext,
  type PlaySoundOptions,
  type SoundPlayback,
  type SoundSource,
  type SoundSynthesizer,
} from './engine'
