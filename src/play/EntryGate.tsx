// ============================================================
// EntryGate — OWNED BY THE GATE/HUD WORKSTREAM (E).
// The threshold into The Yard: a dark cinematic scrim over the
// already-warming 3D world. The tap is the browser audio-unlock
// gesture — resume the shared AudioContext, fire hero.complete,
// enter — and ALL THREE must stay synchronous inside the handler.
// A secondary "enter muted" runs the exact same unlock (the
// gesture still needs a real sound to unlock iOS audio for the
// ambient bed) after flipping the world to muted.
// ============================================================
import { motion, type Variants } from 'framer-motion'
import { getAudioContext, useSensoryUI } from '@/lib/sensory-ui'
import { easeExpo } from '@/lib/motion'
import { usePlay } from './PlayContext'

export default function EntryGate() {
  const { enterWorld, setMuted, reducedMotion } = usePlay()
  const { playSound } = useSensoryUI()

  // The audio unlock — kept intact per the frozen behaviour contract.
  // Must run synchronously inside the pointer gesture: resume (or lazily
  // create) the AudioContext, play a real sound to satisfy the iOS unlock,
  // then hand off to the intro.
  const unlockAndEnter = () => {
    try {
      void getAudioContext().resume()
    } catch {
      // No Web Audio — the world still works, silently.
    }
    void playSound('hero.complete')
    enterWorld()
  }

  const handleEnter = () => unlockAndEnter()

  // Same unlock, but the world starts silent. setMuted flips on the next
  // render, so the single hero.complete above still fires — the deliberate
  // one-shot that unlocks the context; everything after it is quiet.
  const handleEnterMuted = () => {
    setMuted(true)
    unlockAndEnter()
  }

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.08,
        delayChildren: reducedMotion ? 0 : 0.12,
      },
    },
  }

  const item: Variants = reducedMotion
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
    : {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeExpo } },
      }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.2 : 0.6, ease: easeExpo }}
      className="absolute inset-0 z-30 overflow-hidden bg-[radial-gradient(120%_120%_at_50%_38%,rgba(6,6,8,0.62),rgba(0,0,0,0.9))] backdrop-blur-[3px]"
    >
      {/* Full-bleed primary hit target — sits behind the content, which is
          pointer-events-none so a tap anywhere on the scrim enters. */}
      <button
        type="button"
        onClick={handleEnter}
        aria-label="Enter the playground with sound"
        className="absolute inset-0 z-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/40"
      />

      {/* Content — decorative + the one re-enabled control (enter muted). */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center gap-5 px-6 text-center"
      >
        <motion.span
          variants={item}
          className="font-opt-mono text-[11px] uppercase tracking-[0.32em] text-white/45"
        >
          Adedayo · Playground
        </motion.span>

        <motion.h1
          variants={item}
          className="font-display text-[clamp(2.5rem,7vw,4.5rem)] font-medium leading-[0.95] text-white"
        >
          The Yard
        </motion.h1>

        <motion.p
          variants={item}
          className="max-w-[34ch] text-[14px] leading-[1.55] text-white/65"
        >
          A small world of experiments, screens, and sound. Wander in, look around,
          poke at things.
        </motion.p>

        {/* Outer node does the staggered reveal; inner node carries the
            infinite pulse so the two animations don't fight on one element. */}
        <motion.span variants={item} className="mt-2">
          <motion.span
            {...(reducedMotion
              ? {}
              : {
                  animate: { opacity: [0.4, 1, 0.4] },
                  transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
                })}
            className="block font-opt-mono text-[12px] uppercase tracking-[0.28em] text-white"
          >
            Tap to enter
          </motion.span>
        </motion.span>

        <motion.span
          variants={item}
          className="flex items-center gap-2 font-opt-mono text-[10px] uppercase tracking-[0.18em] text-white/40"
        >
          <span aria-hidden className="inline-block size-1.5 bg-opt-accent-lime-fill" />
          Sound on
        </motion.span>

        <motion.button
          variants={item}
          type="button"
          onClick={handleEnterMuted}
          className="pointer-events-auto mt-3 border border-white/25 px-3.5 py-2 font-opt-mono text-[10px] uppercase tracking-[0.18em] text-white/60 transition-colors duration-[var(--opt-motion-base)] hover:border-white/55 hover:text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          Enter muted
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
