// ============================================================
// AmbientBed — OWNED BY THE SOUND WORKSTREAM (D). Foundation
// stub: silent. The real bed is a generative Web Audio drone
// built directly on getAudioContext() from '@/lib/sensory-ui'.
//
// HARD CONSTRAINT: never route the bed through the sensory-ui
// engine's playSound() — engine playback is single-slot, so the
// first UI sting would stop the music. Own nodes only.
//
// Contract: mounts once inside the world shell; `active` flips
// true after the gate tap (AudioContext already resumed by the
// gate's gesture handler); fade in ~2s, fade out on unmount or
// mute. `muted` mirrors PlayContext.muted.
// ============================================================
export default function AmbientBed(_props: { active: boolean; muted: boolean }) {
  return null
}
