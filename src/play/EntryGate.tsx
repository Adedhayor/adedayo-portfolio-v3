// ============================================================
// EntryGate — OWNED BY THE GATE/HUD WORKSTREAM (E) for styling.
// Foundation version is functional: the tap is the gesture that
// unlocks the shared AudioContext, fires hero.complete, and
// starts the world. Keep all three inside the click handler.
// ============================================================
import { motion } from 'framer-motion'
import { getAudioContext, useSensoryUI } from '@/lib/sensory-ui'
import { usePlay } from './PlayContext'

export default function EntryGate() {
  const { enterWorld } = usePlay()
  const { playSound } = useSensoryUI()

  const handleEnter = () => {
    // Inside the user gesture: resume (or lazily create) the context so
    // every later sound — stings and ambient bed — is unlocked.
    try {
      void getAudioContext().resume()
    } catch {
      // No Web Audio — the world still works, silently.
    }
    void playSound('hero.complete')
    enterWorld()
  }

  return (
    <motion.button
      type="button"
      onClick={handleEnter}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 z-30 flex cursor-pointer flex-col items-center justify-center gap-6 bg-opt-surface-base"
      aria-label="Enter the playground"
    >
      <span className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-none text-opt-text-heading">
        The Yard
      </span>
      <span className="max-w-[36ch] text-center text-[14px] leading-[1.5] text-opt-text-secondary">
        A small world of experiments, screens, and sound.
      </span>
      <motion.span
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="font-opt-mono text-[12px] uppercase tracking-[0.18em] text-opt-text-heading"
      >
        Tap to enter
      </motion.span>
      <span className="font-opt-mono text-[11px] uppercase tracking-[0.12em] text-opt-text-placeholder">
        Sound on
      </span>
    </motion.button>
  )
}
