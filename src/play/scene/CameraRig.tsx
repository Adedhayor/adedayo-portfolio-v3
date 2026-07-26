// ============================================================
// CameraRig — camera choreography for The Yard (workstream B).
//
// gate     Low close-up near the TV wall, held while the splash
//          is up (canvas renders on demand behind it).
// intro    A gsap crane: sweep low across the front of the set,
//          then rise and pull back to the overview, settling
//          framed toward the Lab. Poses are applied per-tick via
//          setLookAt(..., false) — NOTE: controls must stay
//          `enabled`, a disabled camera-controls instance skips
//          update() and freezes transitions (observed; the gate
//          overlay is what blocks input pre-entry, and the
//          timeline overwrites any mid-intro drag each tick).
// overview Idle azimuth drift after 4s + pointer parallax
//          (±0.03 rad az / ±0.015 rad polar, lerped, fine
//          pointers only) layered on top of CameraControls.
// focused  Weightier damped fly-in (smoothTime 0.8), snappier
//          return (0.55); distance range tightens around the
//          zone and relaxes again at overview.
// ============================================================
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import type CameraControlsImpl from 'camera-controls'
import gsap from 'gsap'
import { getZone, overviewCamera, type CameraPose, type ZoneId } from '../data/playground'
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

const IDLE_DELAY_MS = 4000
const DRIFT_RAD_PER_S = 0.05
const PARALLAX_AZIMUTH = 0.03
const PARALLAX_POLAR = 0.015

export default function CameraRig({
  phase,
  focusedZoneId,
  reducedMotion,
  onIntroDone,
}: {
  phase: PlayPhase
  focusedZoneId: ZoneId | null
  reducedMotion: boolean
  onIntroDone: () => void
}) {
  const invalidate = useThree((state) => state.invalidate)
  const controlsRef = useRef<CameraControlsImpl | null>(null)
  const lastInteraction = useRef(performance.now())
  const parallax = useRef({ az: 0, pol: 0 })
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
      // Shouldn't happen (context jump-cuts to overview), but stay safe.
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

  // Focus fly-in / glide back, with per-direction weight and a
  // tighter orbit range while inside a zone.
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls || phase === 'gate' || phase === 'intro') return
    const focused = focusedZoneId ? getZone(focusedZoneId) : null
    controls.smoothTime = focused ? 0.8 : 0.55
    controls.minDistance = focused ? 2 : 3
    controls.maxDistance = focused ? 11 : 24
    const pose = focused ? focused.camera : overviewCamera
    void controls.setLookAt(...pose.position, ...pose.target, !reducedMotion)
    invalidate()
    lastInteraction.current = performance.now()
  }, [phase, focusedZoneId, reducedMotion, invalidate])

  // Overview life: idle drift + pointer parallax (fine pointers only).
  useFrame((state, delta) => {
    const controls = controlsRef.current
    if (!controls || reducedMotion || phase !== 'overview') return

    if (performance.now() - lastInteraction.current > IDLE_DELAY_MS) {
      controls.azimuthAngle += delta * DRIFT_RAD_PER_S
    }

    if (!coarsePointer) {
      const targetAz = state.pointer.x * PARALLAX_AZIMUTH
      const targetPol = -state.pointer.y * PARALLAX_POLAR
      const k = 1 - Math.exp(-3 * delta)
      const nextAz = parallax.current.az + (targetAz - parallax.current.az) * k
      const nextPol = parallax.current.pol + (targetPol - parallax.current.pol) * k
      controls.azimuthAngle += nextAz - parallax.current.az
      controls.polarAngle += nextPol - parallax.current.pol
      parallax.current = { az: nextAz, pol: nextPol }
    }
  })

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    const markInteraction = () => {
      lastInteraction.current = performance.now()
    }
    controls.addEventListener('controlstart', markInteraction)
    return () => controls.removeEventListener('controlstart', markInteraction)
  }, [])

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      minDistance={3}
      maxDistance={24}
      minPolarAngle={0.3}
      maxPolarAngle={Math.PI / 2 - 0.06}
      truckSpeed={0}
      smoothTime={0.55}
    />
  )
}
