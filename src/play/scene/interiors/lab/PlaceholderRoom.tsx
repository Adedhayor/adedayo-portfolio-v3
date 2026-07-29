// ============================================================
// Chemistry Lab (lab interior) — W4 OWNS THIS FILE. Replaces the
// W0 placeholder shell with the real room: tiled floor, a long
// bench of under-cabinets, flanking bottle shelves, a pendant
// lamp, the Effects Studio screen in a fume-hood frame, an exit
// door, and three apparatus stations sitting UNDER the experiment
// hotspots (the shared Hotspots layer renders those markers/labels
// and owns their panel clicks — the apparatus adds no hit target).
//
// Stable contract: default export, props {palette, onAction}. The
// component reads reduced-motion via useReducedMotionFlag() (the
// same matchMedia source PlayContext uses) since the prop set is
// frozen; all idle animation is gated by it and paints under the
// demand frameloop via seed-in-layout-effect + invalidate().
// ============================================================
import type { SoundRole } from '@/lib/sensory-ui'
import { getPlace, type HotspotAction } from '../../../data/playground'
import type { PlayPalette } from '../../../hooks/usePlayColors'
import { useReducedMotionFlag } from '../../../hooks/useViewMode'
import RoomShell, { WALL_FACE_Z } from './RoomShell'
import Bench, { BENCH_TOP_Y } from './Bench'
import BottleShelf from './BottleShelf'
import FumeHood from './FumeHood'
import HangingLamp from './HangingLamp'
import ExitDoor from './ExitDoor'
import PetriStation from './PetriStation'
import FlaskStation from './FlaskStation'
import ScaleStation from './ScaleStation'
import { useLabMaterials, useTileTexture } from './labMaterials'

// Stations line up under the three experiment hotspots
// (data: position [(i−1)·2, 1.0, −2.4]).
const STATION_X = [-2, 0, 2] as const
const STATION_Z = -2.4

export default function LabRoom({
  palette,
  onAction,
}: {
  palette: PlayPalette
  onAction: (action: HotspotAction, sound?: SoundRole) => void
}) {
  const reducedMotion = useReducedMotionFlag()
  const mats = useLabMaterials(palette)
  const tileTexture = useTileTexture(palette)

  const place = getPlace('lab')
  const effectsScreen = place.interior.screens[0]

  return (
    <>
      <RoomShell palette={palette} mats={mats} tileTexture={tileTexture} />

      <Bench mats={mats} />

      {/* Bottle shelves flanking the fume hood */}
      <BottleShelf mats={mats} palette={palette} position={[-3.1, 2.35, WALL_FACE_Z + 0.15]} width={1.9} seed={1} />
      <BottleShelf mats={mats} palette={palette} position={[3.1, 2.35, WALL_FACE_Z + 0.15]} width={1.9} seed={5} />

      {/* Effects Studio screen — fume-hood frame above the bench */}
      {effectsScreen && (
        <FumeHood
          screen={effectsScreen}
          palette={palette}
          mats={mats}
          onAction={onAction}
          position={[0, 2.45, WALL_FACE_Z + 0.2]}
          width={3}
        />
      )}

      {/* Pendant lamp over the bench */}
      <HangingLamp mats={mats} palette={palette} position={[0, 3.35, STATION_Z]} targetY={BENCH_TOP_Y} />

      {/* Three apparatus stations (non-interactive) */}
      <PetriStation mats={mats} reducedMotion={reducedMotion} position={[STATION_X[0], BENCH_TOP_Y, STATION_Z]} />
      <FlaskStation mats={mats} reducedMotion={reducedMotion} position={[STATION_X[1], BENCH_TOP_Y, STATION_Z]} />
      <ScaleStation mats={mats} reducedMotion={reducedMotion} position={[STATION_X[2], BENCH_TOP_Y, STATION_Z]} />

      {/* Exit door built around the exit hotspot (data: [2.6, 1.15, −1.4]) */}
      <ExitDoor mats={mats} palette={palette} position={[2.6, 0, -1.4]} />
    </>
  )
}
