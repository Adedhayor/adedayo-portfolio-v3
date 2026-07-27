// ============================================================
// LabZone — THE STAR (A). Three pedestals topped with small
// procedural echoes of the lab experiments (Dot-field, Sound
// study, Staking motion), standing in front of the big Effects
// Studio screen in a thin dark frame. Composed to read from the
// lab camera (position [0,2.2,6], target [0,1.2,0]); the plinths
// sit under the experiment hotspots at [-2/0/2, 1.4, 1.5].
// ============================================================
import type { SoundRole } from '@/lib/sensory-ui'
import { getZone, type HotspotAction } from '../../data/playground'
import type { PlayPalette } from '../../hooks/usePlayColors'
import type { WorldMaterials } from '../materials'
import ScreenSurface from '../media/ScreenSurface'
import { CoinStack, DotField, Waveform } from '../objects/LabEchoes'

type LabProps = {
  palette: PlayPalette
  mats: WorldMaterials
  onAction: (action: HotspotAction, sound?: SoundRole) => void
  reducedMotion: boolean
}

// Pedestals line up under the experiment hotspots (x = -2/0/2, z = 1.5).
// Heights vary so the centre plinth (Sound study) reads tallest.
const PEDESTALS = [
  { x: -2, h: 1.0 },
  { x: 0, h: 1.15 },
  { x: 2, h: 0.9 },
]
const PLINTH_Z = 1.5
const SCREEN_W = 2.6

export default function LabZone({ palette, mats, onAction, reducedMotion }: LabProps) {
  const effects = getZone('lab').screens[0]
  const screenH = SCREEN_W * (10 / 16) // 16:10 → 1.625
  const frameH = screenH + 0.14
  const frameBottom = 1.6 - frameH / 2 // world y where the frame meets its post

  return (
    <group>
      {/* Pedestals + procedural experiment echoes */}
      {PEDESTALS.map((p, i) => (
        <group key={i} position={[p.x, 0, PLINTH_Z]}>
          <mesh position={[0, p.h / 2, 0]} material={mats.shell}>
            <boxGeometry args={[0.9, p.h, 0.9]} />
          </mesh>
          <mesh position={[0, p.h + 0.03, 0]} material={mats.shellDark}>
            <boxGeometry args={[1.0, 0.06, 1.0]} />
          </mesh>
          <group position={[0, p.h + 0.06, 0]}>
            {i === 0 && <DotField mats={mats} reducedMotion={reducedMotion} />}
            {i === 1 && <Waveform mats={mats} reducedMotion={reducedMotion} />}
            {i === 2 && <CoinStack mats={mats} reducedMotion={reducedMotion} />}
          </group>
        </group>
      ))}

      {/* Big Effects Studio screen — thin dark frame, soft glow from
          SetDressing's blue point light; grounded on a slim post. */}
      <group position={[0, 1.6, -1.3]}>
        <mesh position={[0, 0, -0.05]} material={mats.shellDark}>
          <boxGeometry args={[SCREEN_W + 0.14, frameH, 0.08]} />
        </mesh>
        <ScreenSurface content={effects} palette={palette} width={SCREEN_W} onAction={onAction} />
      </group>
      <mesh position={[0, frameBottom / 2, -1.36]} material={mats.metal}>
        <cylinderGeometry args={[0.05, 0.06, frameBottom, 12]} />
      </mesh>
    </group>
  )
}
