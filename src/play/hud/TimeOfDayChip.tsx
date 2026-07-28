// ============================================================
// TimeOfDayChip — the sun/moon HUD control (top-right, by mute).
// Reads the shared `useTimeOfDay()` band and shows Sun / Sunset /
// Moon; a click cycles day → dusk → night via `cycleTimeOfDay()`
// with an `interaction.toggle` sting. Session-only override; the
// Outside scene subscribes to the same store and re-lights.
// ============================================================
import { Sun, Sunset, Moon } from 'lucide-react'
import { useSensoryUI } from '@/lib/sensory-ui'
import { useTimeOfDay, cycleTimeOfDay, type TimeOfDay } from '../hooks/useTimeOfDay'

const BAND: Record<TimeOfDay, { Icon: typeof Sun; label: string }> = {
  day: { Icon: Sun, label: 'Daytime' },
  dusk: { Icon: Sunset, label: 'Golden hour' },
  night: { Icon: Moon, label: 'Night' },
}

export default function TimeOfDayChip({ className }: { className: string }) {
  const band = useTimeOfDay()
  const { playSound } = useSensoryUI()
  const { Icon, label } = BAND[band]

  return (
    <button
      type="button"
      className={className}
      title={`Time of day: ${label} — tap to change`}
      aria-label={`Time of day: ${label}. Tap to change.`}
      onClick={() => {
        cycleTimeOfDay()
        void playSound('interaction.toggle')
      }}
    >
      <Icon size={12} />
    </button>
  )
}
