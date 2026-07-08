// ============================================================
// CustomCursor — GLOBAL. A ring + arrow-up-right follower (the
// Framer build's cursor, Image #4). Fine-pointer / hover devices
// only; hides the native cursor while active. Springs toward the
// pointer, grows over interactive targets, spins a lime accent
// (unless reduced-motion). Decorative — pointer-events-none.
// ============================================================
import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]'

export default function CustomCursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 600, damping: 40, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 600, damping: 40, mass: 0.4 })

  const [enabled, setEnabled] = useState(false)
  const [hidden, setHidden] = useState(true)
  const [hovering, setHovering] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    setEnabled(true)
    document.documentElement.classList.add('cursor-none')

    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setHidden(false)
      const el = e.target as HTMLElement | null
      setHovering(!!el?.closest?.(INTERACTIVE))
    }
    const leave = () => setHidden(true)
    const down = () => setHovering(true)
    const up = () => setHovering(false)

    window.addEventListener('mousemove', move)
    document.addEventListener('mouseleave', leave)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    return () => {
      document.documentElement.classList.remove('cursor-none')
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseleave', leave)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden="true"
      style={{ left: reduced ? x : sx, top: reduced ? y : sy }}
      animate={{ opacity: hidden ? 0 : 1, scale: hovering ? 1.55 : 1 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none fixed z-[100] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
    >
      <div className="relative grid size-9 place-items-center rounded-full border-[1.5px] border-white/70">
        {/* Spinning lime accent arc */}
        {!reduced && (
          <motion.span
            className="absolute inset-0 rounded-full border-[1.5px] border-transparent border-t-opt-accent-lime-fill"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          />
        )}
        <ArrowUpRight size={14} strokeWidth={2.5} className="text-white" />
      </div>
    </motion.div>
  )
}
