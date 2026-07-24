// ============================================================
// ZonePlaceholder — FOUNDATION ONLY. A stand-in body for each
// zone (colored block + its screens in a plain grid) so the
// world runs end-to-end before the art lands. THE WORLD-SET
// WORKSTREAM (A) DELETES THIS and builds real zone composition
// under scene/zones/ (CRT shells, desk, plinths, props).
// ============================================================
import type { SoundRole } from '@/lib/sensory-ui'
import type { HotspotAction, Zone, ZoneId } from '../data/playground'
import type { PlayPalette } from '../hooks/usePlayColors'
import VideoScreen from './media/VideoScreen'

const ZONE_TINT: Record<ZoneId, keyof PlayPalette> = {
  lab: 'yellow',
  'tv-wall': 'coral',
  desk: 'blue',
  yard: 'cyan',
}

export default function ZonePlaceholder({
  zone,
  palette,
  onAction,
}: {
  zone: Zone
  palette: PlayPalette
  onAction: (action: HotspotAction, sound?: SoundRole) => void
}) {
  const [tx, ty, tz] = zone.camera.target
  const cols = Math.max(1, Math.ceil(Math.sqrt(zone.screens.length)))
  const gapX = 1.9
  const gapY = 1.3

  return (
    <group position={[tx, 0, tz]}>
      {/* Zone body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.2, 1, 1.2]} />
        <meshStandardMaterial color={palette[ZONE_TINT[zone.id]]} roughness={0.6} />
      </mesh>
      {/* Screens in a plain grid floating above/behind the body */}
      {zone.screens.map((screen, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        const x = (col - (cols - 1) / 2) * gapX
        const y = ty + 0.8 + row * -gapY + (Math.ceil(zone.screens.length / cols) - 1) * gapY * 0.5
        return (
          <group key={screen.id} position={[x, y, -1.2]}>
            <VideoScreen content={screen} palette={palette} onAction={onAction} />
          </group>
        )
      })}
    </group>
  )
}
