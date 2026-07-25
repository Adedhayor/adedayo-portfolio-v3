// ============================================================
// CameraRig — OWNED BY THE CAMERA WORKSTREAM (B). Foundation
// version: gate pose, a simple intro glide (B replaces with the
// full gsap crane timeline), focus fly-in with overview restore,
// idle azimuth drift, and interaction marking. Patterns proven
// in the seville prototype (PlayScene3D.tsx).
// ============================================================
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import type CameraControlsImpl from 'camera-controls'
import { getZone, overviewCamera, type CameraPose, type ZoneId } from '../data/playground'
import type { PlayPhase } from '../PlayContext'

/** Low close-up the world waits in behind the gate — the intro
    pulls back from here to the overview. */
export const GATE_POSE: CameraPose = {
  position: [-3.5, 1.1, 7],
  target: [-6, 1.6, -1],
}

const IDLE_DELAY_MS = 4000

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
  const controlsRef = useRef<CameraControlsImpl | null>(null)
  const lastInteraction = useRef(performance.now())

  // Hold the gate pose while the splash is up.
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls || phase !== 'gate') return
    controls.setLookAt(...GATE_POSE.position, ...GATE_POSE.target, false)
  }, [phase])

  // Intro: one smooth pull-back from the gate pose to the overview.
  // (B replaces this with the staged crane + prop-bloom timeline.)
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls || phase !== 'intro') return
    controls.enabled = false
    const restoreSmooth = controls.smoothTime
    controls.smoothTime = 1.1
    let cancelled = false
    void controls
      .setLookAt(...overviewCamera.position, ...overviewCamera.target, true)
      .then(() => {
        if (!cancelled) onIntroDone()
      })
    return () => {
      cancelled = true
      controls.enabled = true
      controls.smoothTime = restoreSmooth
    }
  }, [phase, onIntroDone])

  // Focus fly-in / glide back to the overview.
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls || phase === 'gate' || phase === 'intro') return
    const pose = focusedZoneId ? getZone(focusedZoneId).camera : overviewCamera
    controls.enabled = true
    void controls.setLookAt(...pose.position, ...pose.target, !reducedMotion)
    lastInteraction.current = performance.now()
  }, [phase, focusedZoneId, reducedMotion])

  // Idle auto-drift after 4s without interaction, overview only.
  useFrame((_, delta) => {
    const controls = controlsRef.current
    if (!controls || reducedMotion || phase !== 'overview') return
    if (performance.now() - lastInteraction.current > IDLE_DELAY_MS) {
      controls.azimuthAngle += delta * 0.05
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
      enabled={phase === 'overview' || phase === 'focused'}
      minDistance={3}
      maxDistance={24}
      minPolarAngle={0.3}
      maxPolarAngle={Math.PI / 2 - 0.06}
      truckSpeed={0}
      smoothTime={0.55}
    />
  )
}
