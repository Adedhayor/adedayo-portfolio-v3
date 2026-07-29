// ============================================================
// Wall of Arts (gallery interior) — W2 OWNS THIS FILE.
// The real gallery: GalleryShell (planked floor, 3 walls, ceiling
// hint, picture rail, skirting, ≤4 warm spots) + the 6 works from
// getPlace('gallery').interior.screens hung as framed pieces
// (3 on the main wall — hero centred — 2 left, 1 right) + the
// exit-door build around the shared exit hotspot. Clicking a
// frame dispatches { kind:'lightbox', screenId } via onAction;
// the EXIT marker itself renders in PlayWorld's Hotspots layer.
//
// File name stays PlaceholderRoom.tsx because PlayWorld's import
// is frozen; the default export + props are the stable contract.
// ============================================================
import { useMemo } from 'react'
import type { SoundRole } from '@/lib/sensory-ui'
import { getPlace, type HotspotAction } from '../../../data/playground'
import type { PlayPalette } from '../../../hooks/usePlayColors'
import ArtFrame from './ArtFrame'
import ExitDoor from './ExitDoor'
import GalleryShell from './GalleryShell'
import { useGalleryMaterials } from './galleryMaterials'
import { captionFor, SLOTS } from './layout'

export default function GalleryRoom({
  palette,
  onAction,
}: {
  palette: PlayPalette
  onAction: (action: HotspotAction, sound?: SoundRole) => void
}) {
  const materials = useGalleryMaterials(palette)

  // Zip screens onto hang slots by index — the data order (emonie,
  // ebank-group, nukodes, postpaddy, spotifeed, family-tree) is the hang
  // order; extra screens beyond the 6 slots would simply not hang.
  const hang = useMemo(() => {
    const screens = getPlace('gallery').interior.screens
    return SLOTS.map((slot, i) => ({ slot, screen: screens[i] })).filter(
      (entry) => entry.screen !== undefined,
    )
  }, [])

  return (
    <>
      <GalleryShell palette={palette} materials={materials} />
      {hang.map(({ slot, screen }) => (
        <ArtFrame
          key={screen.id}
          screen={screen}
          palette={palette}
          materials={materials}
          slot={slot}
          caption={captionFor(screen)}
          onAction={onAction}
        />
      ))}
      <ExitDoor palette={palette} materials={materials} />
    </>
  )
}
