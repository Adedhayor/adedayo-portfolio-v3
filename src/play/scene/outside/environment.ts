// ============================================================
// environment — the outside world's time-of-day driver (W1).
//
// `useTimeOfDay()` (integrator-owned module store) reports the
// visitor-local band; this hook turns a band flip into a smooth
// ~1.5s gsap tween across every colour/intensity the scenery
// reads — sky dome, ground, fog, key/ambient/hemi light, plus
// the on/off "channels" (lamps, façade window glow, truck
// headlights, sun/moon/stars, grass breeze).
//
// The returned `Env` is a STABLE object whose fields mutate in
// place during the tween. Scene components either share a colour
// ref (sky uniforms / fog / ground / light colour all point at
// the SAME Colour instance, so they follow for free) or copy a
// scalar in a tiny useFrame. Every tween tick calls invalidate()
// so it also paints under a demand frameloop; reduced motion
// snaps to the target with a single invalidate and no animation.
// ============================================================
import { useEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import type { PlayPalette } from '../../hooks/usePlayColors'
import type { TimeOfDay } from '../../hooks/useTimeOfDay'
import { skyTones } from '../materials'

/** Live environment state. Colours are shared, mutated-in-place refs;
    scalars are plain numbers copied per-frame by the consumers. */
export type Env = {
  horizon: THREE.Color
  zenith: THREE.Color
  groundCenter: THREE.Color
  fogColor: THREE.Color
  keyColor: THREE.Color
  fogNear: number
  fogFar: number
  ambient: number
  hemi: number
  key: number
  /** 0→1 dawn-of-the-body opacities and on/off multipliers. */
  sun: number
  moon: number
  stars: number
  lamp: number
  windowGlow: number
  headlight: number
  grass: number
}

type EnvScalars = Pick<
  Env,
  'fogNear' | 'fogFar' | 'ambient' | 'hemi' | 'key' | 'sun' | 'moon' | 'stars' | 'lamp' | 'windowGlow' | 'headlight' | 'grass'
>

const SCALARS_BY_BAND: Record<TimeOfDay, EnvScalars> = {
  day: {
    fogNear: 26, fogFar: 72, ambient: 0.82, hemi: 0.5, key: 1.35,
    sun: 1, moon: 0, stars: 0, lamp: 0, windowGlow: 0.3, headlight: 0, grass: 1,
  },
  dusk: {
    fogNear: 18, fogFar: 48, ambient: 0.55, hemi: 0.3, key: 0.9,
    sun: 0, moon: 0, stars: 0, lamp: 0.8, windowGlow: 0.7, headlight: 0, grass: 0.4,
  },
  night: {
    fogNear: 12, fogFar: 40, ambient: 0.26, hemi: 0.16, key: 0.32,
    sun: 0, moon: 1, stars: 1, lamp: 1, windowGlow: 1, headlight: 1, grass: 0.15,
  },
}

/** Warm midday sun / neutral dusk / cool moon for the key light. */
function keyColorForBand(palette: PlayPalette, band: TimeOfDay): THREE.Color {
  switch (band) {
    case 'day':
      return new THREE.Color(palette.surfaceRaised).lerp(new THREE.Color(palette.yellow), 0.12)
    case 'night':
      return new THREE.Color(palette.blue).lerp(new THREE.Color(palette.surfaceRaised), 0.32)
    case 'dusk':
    default:
      return new THREE.Color(palette.surfaceRaised)
  }
}

function targetFor(palette: PlayPalette, band: TimeOfDay) {
  const { horizon, zenith, groundCenter } = skyTones(palette, band)
  return {
    horizon,
    zenith,
    groundCenter,
    fogColor: horizon.clone(),
    keyColor: keyColorForBand(palette, band),
    ...SCALARS_BY_BAND[band],
  }
}

function snap(env: Env, t: ReturnType<typeof targetFor>) {
  env.horizon.copy(t.horizon)
  env.zenith.copy(t.zenith)
  env.groundCenter.copy(t.groundCenter)
  env.fogColor.copy(t.fogColor)
  env.keyColor.copy(t.keyColor)
  env.fogNear = t.fogNear
  env.fogFar = t.fogFar
  env.ambient = t.ambient
  env.hemi = t.hemi
  env.key = t.key
  env.sun = t.sun
  env.moon = t.moon
  env.stars = t.stars
  env.lamp = t.lamp
  env.windowGlow = t.windowGlow
  env.headlight = t.headlight
  env.grass = t.grass
}

/**
 * Build the stable Env and keep it lerping toward the current band. First
 * paint (and every reduced-motion change) snaps; band/theme changes after
 * that tween over ~1.5s. Returns the same object every render.
 */
export function useEnvironment(palette: PlayPalette, timeOfDay: TimeOfDay, reducedMotion: boolean): Env {
  const invalidate = useThree((s) => s.invalidate)
  // Created once; seeded to the initial band so nothing fades up from black.
  const env = useMemo<Env>(() => {
    const base: Env = {
      horizon: new THREE.Color(),
      zenith: new THREE.Color(),
      groundCenter: new THREE.Color(),
      fogColor: new THREE.Color(),
      keyColor: new THREE.Color(),
      fogNear: 18, fogFar: 48, ambient: 0.55, hemi: 0.3, key: 0.9,
      sun: 0, moon: 0, stars: 0, lamp: 0.8, windowGlow: 0.7, headlight: 0, grass: 0.4,
    }
    snap(base, targetFor(palette, timeOfDay))
    return base
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const t = targetFor(palette, timeOfDay)
    // First run already matches (seeded above); reduced motion cuts instantly.
    if (reducedMotion) {
      snap(env, t)
      invalidate()
      return
    }
    const DUR = 1.5
    const EASE = 'sine.inOut'
    const tl = gsap.timeline({ onUpdate: invalidate, onComplete: invalidate })
    tl.to(
      env,
      {
        fogNear: t.fogNear, fogFar: t.fogFar, ambient: t.ambient, hemi: t.hemi, key: t.key,
        sun: t.sun, moon: t.moon, stars: t.stars, lamp: t.lamp, windowGlow: t.windowGlow,
        headlight: t.headlight, grass: t.grass,
        duration: DUR, ease: EASE,
      },
      0,
    )
    ;(
      [
        [env.horizon, t.horizon],
        [env.zenith, t.zenith],
        [env.groundCenter, t.groundCenter],
        [env.fogColor, t.fogColor],
        [env.keyColor, t.keyColor],
      ] as [THREE.Color, THREE.Color][]
    ).forEach(([cur, to]) => {
      tl.to(cur, { r: to.r, g: to.g, b: to.b, duration: DUR, ease: EASE }, 0)
    })
    return () => {
      tl.kill()
    }
  }, [palette, timeOfDay, reducedMotion, env, invalidate])

  return env
}
