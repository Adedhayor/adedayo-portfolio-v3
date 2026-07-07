// ============================================================
// NavIsland — GLOBAL. The square dynamic island (BRIEF §3.2).
// Anatomy: B mark left · active section center · dot/square/
// triangle oscillating right.
// Desktop: hover/focus expands along the x-axis to reveal links.
// Mobile: tapping the oscillating dots expands a y-axis dropdown
// (no hamburger). Fixed-position glass surface + Framer `layout`
// with popLayout → the island hugs its content and never
// overshoots to full width or reflows the page.
// ============================================================
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Moon, Sun, ArrowUpRight } from 'lucide-react'
import { dur, easeExpo } from '@/lib/motion'
import { profile } from '@/data'

type NavLink = { label: string; href: string; external?: boolean }

const LINKS: NavLink[] = [
  { label: 'Home', href: '#top' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Writing', href: '#writing' },
  { label: 'Contact', href: '#contact' },
  { label: 'Résumé', href: profile.resumeUrl, external: true },
]

/* ---------- The B mark — square ink tile ---------- */
function BMark() {
  return (
    <a
      href="#top"
      aria-label="Adedayo Babalola — home"
      className="grid size-9 shrink-0 place-items-center rounded-none bg-opt-interactive-active-fill font-display text-[17px] leading-none text-opt-surface-base"
    >
      B
    </a>
  )
}

/* ---------- Oscillating shapes: dot · square · triangle ---------- */
function OscShapes() {
  return (
    <span className="flex shrink-0 items-center gap-[7px] text-opt-text-secondary" aria-hidden="true">
      <svg className="nav-osc" style={{ animationDelay: '0ms' }} width="7" height="7" viewBox="0 0 7 7">
        <circle cx="3.5" cy="3.5" r="3.5" fill="currentColor" />
      </svg>
      <svg className="nav-osc" style={{ animationDelay: '-600ms' }} width="7" height="7" viewBox="0 0 7 7">
        <rect width="7" height="7" fill="currentColor" />
      </svg>
      <svg className="nav-osc" style={{ animationDelay: '-1200ms' }} width="8" height="7" viewBox="0 0 8 7">
        <polygon points="4,0 8,7 0,7" fill="currentColor" />
      </svg>
    </span>
  )
}

/* ---------- Theme toggle (lives in the expanded island) ---------- */
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <span className="size-8" />
  const dark = resolvedTheme === 'dark'
  return (
    <button
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-none text-opt-text-secondary transition-colors duration-[var(--opt-motion-base)] hover:text-opt-text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-border-focus"
    >
      {dark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  )
}

/* ---------- Scroll-spy: watches [data-section] on the page ---------- */
function useActiveSection() {
  const [active, setActive] = useState('Home')
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'))
    if (els.length === 0) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.getAttribute('data-section') ?? 'Home')
        }
      },
      { rootMargin: '-35% 0px -60% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return active
}

export default function NavIsland() {
  const active = useActiveSection()
  const [expanded, setExpanded] = useState(false) // desktop x-expand (hover/focus)
  const [open, setOpen] = useState(false) // mobile y-dropdown (dots tap)
  const rootRef = useRef<HTMLDivElement>(null)

  // Close the mobile panel on Escape / outside click
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousedown', onClick)
    }
  }, [open])

  const swap = { duration: dur.fast, ease: easeExpo }

  return (
    <div ref={rootRef} className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="relative">
        {/* The island — `layout` animates the box; popLayout pops the
            outgoing child out of flow so width hugs content, no overshoot. */}
        <motion.nav
          layout
          aria-label="Primary"
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
          onFocus={() => setExpanded(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setExpanded(false)
          }}
          transition={{ duration: dur.slow, ease: easeExpo }}
          className="glass flex h-14 items-center gap-4 rounded-none px-3"
        >
          <BMark />

          {/* Desktop: crossfade between the section label and the link row.
              popLayout keeps the swap from pushing width mid-animation. */}
          <div className="hidden md:block">
            <AnimatePresence mode="popLayout" initial={false}>
              {expanded ? (
                <motion.ul
                  key="links"
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={swap}
                  className="flex items-center gap-5 whitespace-nowrap"
                >
                  {LINKS.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                        className={[
                          'link-underline text-[14px] transition-colors duration-[var(--opt-motion-base)]',
                          active === l.label
                            ? 'font-medium text-opt-text-heading'
                            : 'text-opt-text-secondary hover:text-opt-text-heading',
                        ].join(' ')}
                        aria-current={active === l.label ? 'true' : undefined}
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                  <li className="flex items-center border-l border-opt-border-subtle pl-3">
                    <ThemeToggle />
                  </li>
                </motion.ul>
              ) : (
                <motion.span
                  key="label"
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={swap}
                  className="block min-w-[72px] text-center text-[14px] font-medium text-opt-text-heading"
                >
                  {active}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile: current section label (dots below act as the toggle) */}
          <span className="min-w-[56px] text-center text-[14px] font-medium text-opt-text-heading md:hidden">
            {active}
          </span>

          {/* Oscillating shapes — decorative on desktop; on mobile they ARE
              the menu button (replaces the old hamburger). */}
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid shrink-0 cursor-pointer place-items-center rounded-none px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-border-focus md:cursor-default"
          >
            <OscShapes />
          </button>
        </motion.nav>

        {/* Mobile: y-axis dropdown panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: dur.slow, ease: easeExpo }}
              className="glass absolute inset-x-0 top-[calc(100%+8px)] overflow-hidden rounded-none md:hidden"
            >
              <ul className="flex flex-col px-5 py-3">
                {LINKS.map((l) => (
                  <li key={l.label} className="border-b border-opt-border-subtle last:border-b-0">
                    <a
                      href={l.href}
                      {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-3 text-[16px] text-opt-text-heading"
                    >
                      {l.label}
                      {l.external && <ArrowUpRight size={14} className="text-opt-text-secondary" />}
                    </a>
                  </li>
                ))}
                <li className="flex items-center justify-between py-3">
                  <span className="label">Theme</span>
                  <ThemeToggle />
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
