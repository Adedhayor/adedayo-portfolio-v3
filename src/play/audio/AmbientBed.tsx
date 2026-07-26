// ============================================================
// AmbientBed — OWNED BY THE SOUND WORKSTREAM (D).
// A quiet, warm dusk drone, generated live on the shared
// AudioContext from '@/lib/sensory-ui'.
//
// HARD CONSTRAINT: never route the bed through the sensory-ui
// engine's playSound() — engine playback is single-slot, so the
// first UI sting would stop the music. Own nodes only.
//
// Graph (drone mode):
//
//   C2 sine ──► voiceGain ─┐        ┌─ drift LFO (±4c) per osc
//   G2 sine ──► voiceGain ─┤◄───────┘   (rates co-prime, never lock)
//   C3 tri  ──► voiceGain ─┼─► master lowpass ─► fade ─► level ─► out
//   noise loop ► bandpass ─┘        ▲            0..1     0.06
//                                   └─ breath LFO (0.05 Hz, ±250 Hz)
//
// `ambientSrc` escape hatch: a looping decoded track replaces the
// drone through the same fade/level plumbing; fetch or decode
// failure falls back to the drone. Pure Web Audio graph — no
// ScriptProcessor, no per-frame JS; safe to run for minutes.
//
// Contract: mounts once inside the world shell; `active` flips
// true after the gate tap (the gate's gesture handler resumes the
// AudioContext); `muted` mirrors PlayContext.muted. Mute fades to
// 0 but keeps the graph running so unmute is seamless.
// ============================================================
import { useEffect, useRef } from 'react'
import { getAudioContext } from '@/lib/sensory-ui'
import { AMBIENT_LEVEL } from './soundConfig'

const FADE_IN_SECONDS = 2 // first fade-in after the gate tap
const FADE_SECONDS = 0.9 // mute/unmute and tab-visible resume
const HIDE_SECONDS = 0.25 // tab hidden — stop humming promptly
const UNMOUNT_FADE_SECONDS = 0.35 // click-free exit before nodes stop

const DRIFT_CENTS = 4 // each voice wanders ±4 cents around its base detune
const LOWPASS_BASE_HZ = 850
const BREATH_RATE_HZ = 0.05 // the whole bed opens/closes on a ~20s cycle
const BREATH_DEPTH_HZ = 250
const AIR_BAND_HZ = 480 // center of the noise "air" layer
const AIR_GAIN = 0.05 // well under the oscillators

interface DroneVoice {
  freq: number
  type: OscillatorType
  gain: number
  /** Static detune (cents) so the stack beats gently even between drifts. */
  detune: number
  /** Drift LFO rate (Hz). Deliberately co-prime-ish across voices. */
  driftRate: number
}

const DRONE_VOICES: DroneVoice[] = [
  { freq: 65.41, type: 'sine', gain: 0.5, detune: -3, driftRate: 0.029 }, // C2 root
  { freq: 98.0, type: 'sine', gain: 0.34, detune: 4, driftRate: 0.041 }, // G2 fifth
  { freq: 130.81, type: 'triangle', gain: 0.2, detune: 2, driftRate: 0.053 }, // C3 octave — harmonics = warmth
]

interface AmbientBedProps {
  active: boolean
  muted: boolean
  /** Optional composed loop (URL). Load failure falls back to the drone. */
  ambientSrc?: string
}

export default function AmbientBed({ active, muted, ambientSrc }: AmbientBedProps) {
  // Mirror `muted` into a ref so the graph effect never re-runs on mute —
  // mute is a gain ramp on the living graph, not a rebuild.
  const mutedRef = useRef(muted)
  mutedRef.current = muted
  const applyTargetRef = useRef<((seconds?: number) => void) | null>(null)

  useEffect(() => {
    if (!active) return

    // Always fetch fresh: the dev provider closes the context on unmount
    // and the engine recreates it, so a cached reference would go stale.
    const ctx = getAudioContext()
    let disposed = false
    let started = false

    // ---- Shared plumbing: source(s) → fade (0..1) → level → destination
    const level = ctx.createGain()
    level.gain.value = AMBIENT_LEVEL
    level.connect(ctx.destination)

    const fade = ctx.createGain()
    fade.gain.value = 0
    fade.connect(level)

    const nodes: AudioNode[] = [fade, level]
    const sources: AudioScheduledSourceNode[] = []

    /** Ramp the fade gain toward where it should sit right now. */
    const applyTarget = (seconds = FADE_SECONDS) => {
      // Before the context runs, hold at 0 — beginFadeIn applies the real
      // target once the gate's resume() lands, so nothing ramps early.
      if (disposed || !started) return
      const target = mutedRef.current || document.visibilityState === 'hidden' ? 0 : 1
      try {
        const now = ctx.currentTime
        fade.gain.cancelScheduledValues(now)
        fade.gain.setValueAtTime(fade.gain.value, now)
        fade.gain.linearRampToValueAtTime(target, now + seconds)
      } catch {
        // Context torn down mid-flight (dev close) — nothing left to ramp.
      }
    }
    applyTargetRef.current = applyTarget

    const buildDrone = () => {
      // Master lowpass — everything warm; cutoff breathes on a slow LFO.
      const lowpass = ctx.createBiquadFilter()
      lowpass.type = 'lowpass'
      lowpass.frequency.value = LOWPASS_BASE_HZ
      lowpass.Q.value = 0.5
      lowpass.connect(fade)
      nodes.push(lowpass)

      const breath = ctx.createOscillator()
      breath.frequency.value = BREATH_RATE_HZ
      const breathDepth = ctx.createGain()
      breathDepth.gain.value = BREATH_DEPTH_HZ
      breath.connect(breathDepth)
      breathDepth.connect(lowpass.frequency)
      breath.start()
      nodes.push(breathDepth)
      sources.push(breath)

      // Detuned oscillator stack, each with an independent drift LFO.
      for (const voice of DRONE_VOICES) {
        const osc = ctx.createOscillator()
        osc.type = voice.type
        osc.frequency.value = voice.freq
        osc.detune.value = voice.detune

        const lfo = ctx.createOscillator()
        lfo.frequency.value = voice.driftRate
        const drift = ctx.createGain()
        drift.gain.value = DRIFT_CENTS
        lfo.connect(drift)
        drift.connect(osc.detune)

        const voiceGain = ctx.createGain()
        voiceGain.gain.value = voice.gain
        osc.connect(voiceGain)
        voiceGain.connect(lowpass)

        osc.start()
        lfo.start()
        nodes.push(drift, voiceGain)
        sources.push(osc, lfo)
      }

      // "Air": two seconds of looped white noise through a bandpass.
      const noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 2), ctx.sampleRate)
      const channel = noiseBuffer.getChannelData(0)
      for (let i = 0; i < channel.length; i++) channel[i] = Math.random() * 2 - 1
      const noise = ctx.createBufferSource()
      noise.buffer = noiseBuffer
      noise.loop = true
      const airFilter = ctx.createBiquadFilter()
      airFilter.type = 'bandpass'
      airFilter.frequency.value = AIR_BAND_HZ
      airFilter.Q.value = 0.8
      const airGain = ctx.createGain()
      airGain.gain.value = AIR_GAIN
      noise.connect(airFilter)
      airFilter.connect(airGain)
      airGain.connect(lowpass)
      noise.start()
      nodes.push(airFilter, airGain)
      sources.push(noise)
    }

    if (ambientSrc) {
      fetch(ambientSrc)
        .then((res) => {
          if (!res.ok) throw new Error(`[AmbientBed] fetch ${res.status}`)
          return res.arrayBuffer()
        })
        .then((buf) => ctx.decodeAudioData(buf))
        .then((audioBuffer) => {
          if (disposed) return
          const track = ctx.createBufferSource()
          track.buffer = audioBuffer
          track.loop = true
          track.connect(fade)
          track.start()
          sources.push(track)
        })
        .catch(() => {
          if (!disposed) buildDrone()
        })
    } else {
      buildDrone()
    }

    // ---- Start: fade in now if running, otherwise wait for the gate's
    // resume() to land (one-shot statechange), holding silent meanwhile.
    const beginFadeIn = () => {
      if (disposed || started) return
      started = true
      applyTarget(FADE_IN_SECONDS)
    }
    const onStateChange = () => {
      if (ctx.state === 'running') {
        ctx.removeEventListener('statechange', onStateChange)
        beginFadeIn()
      }
    }
    if (ctx.state === 'running') {
      beginFadeIn()
    } else {
      ctx.addEventListener('statechange', onStateChange)
      // `active` only flips after the gate tap, so a nudge is gesture-safe
      // and covers Safari's 'interrupted' state; harmless if already resuming.
      void ctx.resume().catch(() => {})
    }

    // ---- Hidden tabs shouldn't hum: fade out on hidden, back on visible.
    const onVisibility = () => {
      applyTarget(document.visibilityState === 'hidden' ? HIDE_SECONDS : FADE_SECONDS)
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      disposed = true
      applyTargetRef.current = null
      ctx.removeEventListener('statechange', onStateChange)
      document.removeEventListener('visibilitychange', onVisibility)

      // Short fade so teardown never clicks, then stop every source.
      try {
        if (ctx.state !== 'closed') {
          const now = ctx.currentTime
          fade.gain.cancelScheduledValues(now)
          fade.gain.setValueAtTime(fade.gain.value, now)
          fade.gain.linearRampToValueAtTime(0, now + UNMOUNT_FADE_SECONDS)
          for (const source of sources) {
            try {
              source.stop(now + UNMOUNT_FADE_SECONDS + 0.05)
            } catch {
              // Already stopped — fine.
            }
          }
        }
      } catch {
        // Context closed under us (dev provider) — nodes die with it.
      }
      // Disconnect after the fade completes. In StrictMode's double-mount
      // the timer only touches this build's nodes; the remount's fresh
      // graph is untouched.
      window.setTimeout(
        () => {
          for (const node of [...sources, ...nodes]) {
            try {
              node.disconnect()
            } catch {
              // Already disconnected or context closed — fine.
            }
          }
        },
        (UNMOUNT_FADE_SECONDS + 0.1) * 1000
      )
    }
  }, [active, ambientSrc])

  // Mute/unmute = ramp on the living graph. Skip the initial run so the
  // 2s first fade-in isn't shortened by an immediate re-ramp.
  const prevMutedRef = useRef(muted)
  useEffect(() => {
    if (prevMutedRef.current === muted) return
    prevMutedRef.current = muted
    applyTargetRef.current?.()
  }, [muted])

  return null
}
