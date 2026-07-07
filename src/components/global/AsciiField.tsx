// ============================================================
// AsciiField — GLOBAL. The pixelated/ASCII background field
// (BRIEF §3.3). A single fixed canvas behind all content:
// ambient character shimmer + a heat ripple that follows the
// cursor as it moves/scrolls across sections.
// Successor to the v2 DotField — same DNA, new clothes.
// Desktop fine-pointer only · rAF capped ~30fps · DPR capped.
// ============================================================
import { useEffect, useRef } from 'react'

const CHARS = ' ·:;+*#%@'
const CELL = 14 // px per character cell
const FPS = 30
const HEAT_DECAY = 0.9
const AMBIENT = 0.16 // ambient shimmer ceiling (0..1)

/** Resolve a CSS custom property on <html> (theme-aware). */
function cssVar(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

export default function AsciiField({ ambient = false }: { ambient?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Fine pointers only (the ripple is a cursor effect) — unless the
    // field is used as an ambient backdrop (e.g. inside the loader).
    const finePointer = window.matchMedia('(pointer: fine)').matches
    if (!finePointer && !ambient) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let cols = 0
    let rows = 0
    let heat: Float32Array = new Float32Array(0)
    let ink = cssVar('--opt-text-secondary', 'rgba(120,120,120,1)')

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.font = `${CELL - 3}px ui-monospace, monospace`
      ctx.textBaseline = 'top'
      cols = Math.ceil(window.innerWidth / CELL)
      rows = Math.ceil(window.innerHeight / CELL)
      heat = new Float32Array(cols * rows)
    }
    resize()
    window.addEventListener('resize', resize)

    // Theme changes re-tint the field
    const mo = new MutationObserver(() => {
      ink = cssVar('--opt-text-secondary', ink)
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    // Cursor heat — injected on move, decays each frame
    const onMove = (e: PointerEvent) => {
      const cx = Math.floor(e.clientX / CELL)
      const cy = Math.floor(e.clientY / CELL)
      const R = 6
      for (let dy = -R; dy <= R; dy++) {
        for (let dx = -R; dx <= R; dx++) {
          const x = cx + dx
          const y = cy + dy
          if (x < 0 || y < 0 || x >= cols || y >= rows) continue
          const d2 = dx * dx + dy * dy
          if (d2 > R * R) continue
          const i = y * cols + x
          const add = Math.exp(-d2 / (R * 1.6))
          heat[i] = Math.min(1, heat[i] + add * 0.9)
        }
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    // Scroll also stirs the field (a column sweep at viewport center)
    let lastScroll = window.scrollY
    const onScroll = () => {
      const v = Math.min(Math.abs(window.scrollY - lastScroll) / 40, 1)
      lastScroll = window.scrollY
      if (v < 0.05) return
      for (let k = 0; k < cols; k += 3) {
        const y = Math.floor(rows / 2 + Math.sin(k) * rows * 0.3)
        const i = y * cols + k
        if (i >= 0 && i < heat.length) heat[i] = Math.min(1, heat[i] + v * 0.35)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    let raf = 0
    let last = 0
    const frame = (t: number) => {
      raf = requestAnimationFrame(frame)
      if (t - last < 1000 / FPS) return
      last = t
      const time = t / 1000

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = ink
      const n = CHARS.length - 1

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x
          heat[i] *= HEAT_DECAY
          // Ambient shimmer — cheap trig noise, drifts with time
          const a =
            AMBIENT *
            Math.max(0, Math.sin(x * 0.35 + time * 0.7) * Math.cos(y * 0.45 - time * 0.5))
          const v = Math.min(1, a + heat[i])
          if (v < 0.06) continue // sparse draw — most cells stay empty
          const ch = CHARS[Math.min(n, Math.floor(v * n))]
          ctx.globalAlpha = Math.min(0.55, v)
          ctx.fillText(ch, x * CELL, y * CELL)
        }
      }
      ctx.globalAlpha = 1
    }
    raf = requestAnimationFrame(frame)

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf)
      else raf = requestAnimationFrame(frame)
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVis)
      mo.disconnect()
    }
  }, [ambient])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  )
}
