// ============================================================
// CameraRig — camera choreography for The Yard (workstream B).
//
// gate     Low close-up near the world, held while the splash is
//          up (canvas renders on demand behind it).
// intro    A gsap crane: sweep low across the front, then rise
//          and pull back to the outside overview. Poses applied
//          per-tick via setLookAt(..., false).
// live     Location-driven. OUTSIDE keeps the overview orbit +
//          idle drift + pointer parallax + drag. INTERIORS use the
//          place's standing camera with CLAMPED orbit (turn your
//          head, don't walk) — no idle drift, parallax stays.
//
// Location changes CUT (setLookAt no-transition) behind the door
// veil — never a damped glide through walls. controls must stay
// `enabled`; a disabled camera-controls instance skips update().
// ============================================================
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import type CameraControlsImpl from 'camera-controls'
import gsap from 'gsap'
import { getPlace, overviewCamera, type CameraPose, type PlayLocation } from '../data/playground'
import type { PlayPhase } from '../PlayContext'

/** Low close-up the world waits in behind the gate. */
export const GATE_POSE: CameraPose = {
  position: [-3.5, 1.1, 7],
  target: [-6, 1.6, -1],
}

/** Mid-crane waypoint: swung across the front of the set, still low. */
const CRANE_MID: CameraPose = {
  position: [2.4, 1.8, 9.5],
  target: [0, 1.2, 0],
}

// Outside overview orbit envelope.
const OUTSIDE_MIN_DIST = 3
const OUTSIDE_MAX_DIST = 24
const OUTSIDE_MIN_POLAR = 0.3
const OUTSIDE_MAX_POLAR = Math.PI / 2 - 0.06

const IDLE_DELAY_MS = 4000
const DRIFT_RAD_PER_S = 0.05
const PARALLAX_AZIMUTH = 0.03
const PARALLAX_POLAR = 0.015

export default function CameraRig({
  phase,
  location,
  reducedMotion,
  onIntroDone,
}: {
  phase: PlayPhase
  location: PlayLocation
  reducedMotion: boolean
  onIntroDone: () => void
}) {
  const invalidate = useThree((state) => state.invalidate)
  const controlsRef = useRef<CameraControlsImpl | null>(null)
  const lastInteraction = useRef(performance.now())
  const parallax = useRef({ az: 0, pol: 0 })
  const dragging = useRef(false)
  const reseedParallax = useRef(false)
  const coarsePointer = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches,
    [],
  )

  // Hold the gate pose while the splash is up.
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls || phase !== 'gate') return
    controls.setLookAt(...GATE_POSE.position, ...GATE_POSE.target, false)
    invalidate()
  }, [phase, invalidate])

  // Intro crane. A proxy pose is tweened through the waypoints and
  // applied every tick; kill() on cleanup handles StrictMode/unmount.
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls || phase !== 'intro') return
    if (reducedMotion) {
      // Shouldn't happen (context jump-cuts to live), but stay safe.
      controls.setLookAt(...overviewCamera.position, ...overviewCamera.target, false)
      invalidate()
      onIntroDone()
      return
    }

    const pose = {
      px: GATE_POSE.position[0], py: GATE_POSE.position[1], pz: GATE_POSE.position[2],
      tx: GATE_POSE.target[0], ty: GATE_POSE.target[1], tz: GATE_POSE.target[2],
    }
    const apply = () => {
      controls.setLookAt(pose.px, pose.py, pose.pz, pose.tx, pose.ty, pose.tz, false)
      invalidate()
    }
    const timeline = gsap.timeline({ onUpdate: apply, onComplete: onIntroDone })
    timeline
      .to(pose, {
        px: CRANE_MID.position[0], py: CRANE_MID.position[1], pz: CRANE_MID.position[2],
        tx: CRANE_MID.target[0], ty: CRANE_MID.target[1], tz: CRANE_MID.target[2],
        duration: 1.05,
        ease: 'power2.inOut',
      })
      .to(pose, {
        px: overviewCamera.position[0], py: overviewCamera.position[1], pz: overviewCamera.position[2],
        tx: overviewCamera.target[0], ty: overviewCamera.target[1], tz: overviewCamera.target[2],
        duration: 1.45,
        ease: 'expo.out',
      })
    return () => {
      timeline.kill()
    }
  }, [phase, reducedMotion, onIntroDone, invalidate])

  // Live: apply the location's pose + orbit clamps. Location changes CUT
  // behind the veil (setLookAt no-transition) — never a glide through walls.
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls || phase === 'gate' || phase === 'intro') return

    if (location === 'outside') {
      controls.smoothTime = 0.55
      controls.minDistance = OUTSIDE_MIN_DIST
      controls.maxDistance = OUTSIDE_MAX_DIST
      controls.minAzimuthAngle = -Infinity
      controls.maxAzimuthAngle = Infinity
      controls.minPolarAngle = OUTSIDE_MIN_POLAR
      controls.maxPolarAngle = OUTSIDE_MAX_POLAR
      controls.setLookAt(...overviewCamera.position, ...overviewCamera.target, false)
    } else {
      const { camera, orbit } = getPlace(location).interior
      controls.smoothTime = 0.4
      controls.minDistance = orbit.minDistance
      controls.maxDistance = orbit.maxDistance
      controls.minAzimuthAngle = orbit.minAzimuth
      controls.maxAzimuthAngle = orbit.maxAzimuth
      controls.minPolarAngle = orbit.minPolar
      controls.maxPolarAngle = orbit.maxPolar
      controls.setLookAt(...camera.position, ...camera.target, false)
    }
    invalidate()
    lastInteraction.current = performance.now()
  }, [phase, location, invalidate])

  // Live life: idle drift (OUTSIDE only) + pointer parallax (everywhere,
  // fine pointers only), both suspended while actively dragging.
  useFrame((state, delta) => {
    const controls = controlsRef.current
    if (!controls || reducedMotion || phase !== 'live') return

    // While dragging: no parallax, no drift. Keep the idle clock fresh so
    // drift can't snap in the instant the drag ends, and arm a parallax
    // re-seed so its baseline resets to the drag's final orientation.
    if (dragging.current) {
      lastInteraction.current = performance.now()
      reseedParallax.current = true
      return
    }

    // Idle drift is an outside-only luxury; interiors stay put.
    if (location === 'outside' && performance.now() - lastInteraction.current > IDLE_DELAY_MS) {
      controls.azimuthAngle += delta * DRIFT_RAD_PER_S
    }

    // Parallax feels great indoors too — kept everywhere, fine pointers only.
    if (!coarsePointer) {
      const targetAz = state.pointer.x * PARALLAX_AZIMUTH
      const targetPol = -state.pointer.y * PARALLAX_POLAR
      // Re-seed from the live target after a drag so the first post-drag
      // frame applies a ~zero delta (no sudden camera swing).
      if (reseedParallax.current) {
        parallax.current = { az: targetAz, pol: targetPol }
        reseedParallax.current = false
      }
      const k = 1 - Math.exp(-3 * delta)
      const nextAz = parallax.current.az + (targetAz - parallax.current.az) * k
      const nextPol = parallax.current.pol + (targetPol - parallax.current.pol) * k
      controls.azimuthAngle += nextAz - parallax.current.az
      controls.polarAngle += nextPol - parallax.current.pol
      parallax.current = { az: nextAz, pol: nextPol }
    }
  })

  // Track active drags: suspend parallax/drift on start, and on end refresh
  // the idle clock + re-seed the parallax baseline (see useFrame above).
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    const onStart = () => {
      dragging.current = true
      lastInteraction.current = performance.now()
    }
    const onEnd = () => {
      dragging.current = false
      lastInteraction.current = performance.now()
      reseedParallax.current = true
    }
    controls.addEventListener('controlstart', onStart)
    controls.addEventListener('controlend', onEnd)
    return () => {
      controls.removeEventListener('controlstart', onStart)
      controls.removeEventListener('controlend', onEnd)
    }
  }, [])

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      minDistance={OUTSIDE_MIN_DIST}
      maxDistance={OUTSIDE_MAX_DIST}
      minPolarAngle={OUTSIDE_MIN_POLAR}
      maxPolarAngle={OUTSIDE_MAX_POLAR}
      truckSpeed={0}
      smoothTime={0.55}
    />
  )
}
