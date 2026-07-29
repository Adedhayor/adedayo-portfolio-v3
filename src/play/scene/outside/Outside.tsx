// ============================================================
// Outside — the composed outdoor world root (W1). This is what
// PlayWorld mounts when `location === 'outside'`, replacing the
// Phase-1 SetDressing + WorldZones diorama.
//
// Time-of-day wiring: `useTimeOfDay()` is a module store
// (useSyncExternalStore), so subscribing HERE — inside the Canvas
// reconciler — is safe; no context crosses the bridge. The band
// feeds `useEnvironment`, which owns the ~1.5s gsap lerp between
// day / dusk / night (instant under reduced motion) and hands
// every child the same mutating Env object:
//
//   SetDressing  sky dome · ground · fog · key lights · sun/moon/stars
//   Silhouettes  distant cut-out panels (static, band-agnostic ink)
//   Facades      the three enterable buildings + signage + glows
//   YardProps    fence · mailbox · signpost · gate · lamps · grass
//   RoadTruck    road strip + looping truck + night headlights
//   Billboard    HIRE A DESIGNER (clickable → home)
//
// Door/yard hotspot MARKERS stay in the shared Hotspots layer
// (data-driven); the façades are the bodies built around them.
// ============================================================
import type { SoundRole } from '@/lib/sensory-ui'
import type { HotspotAction } from '../../data/playground'
import type { PlayPalette } from '../../hooks/usePlayColors'
import { useTimeOfDay } from '../../hooks/useTimeOfDay'
import { useWorldMaterials } from '../materials'
import SetDressing from '../set/SetDressing'
import { useEnvironment } from './environment'
import Silhouettes from './Silhouettes'
import Facades from './Facades'
import YardProps from './YardProps'
import RoadTruck from './RoadTruck'
import Billboard from './Billboard'

export default function Outside({
  palette,
  onAction,
  reducedMotion,
}: {
  palette: PlayPalette
  onAction: (action: HotspotAction, sound?: SoundRole) => void
  reducedMotion: boolean
}) {
  const timeOfDay = useTimeOfDay()
  const env = useEnvironment(palette, timeOfDay, reducedMotion)
  const mats = useWorldMaterials(palette)

  return (
    <>
      <SetDressing palette={palette} env={env} />
      <Silhouettes palette={palette} />
      <Facades palette={palette} mats={mats} env={env} reducedMotion={reducedMotion} onAction={onAction} />
      <YardProps palette={palette} mats={mats} env={env} reducedMotion={reducedMotion} />
      <RoadTruck palette={palette} env={env} reducedMotion={reducedMotion} />
      <Billboard palette={palette} env={env} onAction={onAction} />
    </>
  )
}
