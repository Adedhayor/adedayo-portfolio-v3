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
import { Link } from 'react-router-dom'
import { useTheme } from 'next-themes'
import { Moon, Sun, ArrowUpRight } from 'lucide-react'
import { dur, easeExpo } from '@/lib/motion'
import { profile } from '@/data'
import { showPlayground } from '@/lib/release'
import bLogo from '@/assets/b-logo.png'

type NavLink = { label: string; href: string; external?: boolean }

// Internal links are /#section so they route + scroll from any page
// (App's ScrollToHash handles the scroll). External links open in a tab.
const LINKS: NavLink[] = [
  { label: 'Home', href: '/#top' },
  { label: 'Work', href: '/work' },
  { label: 'Play', href: '/play' },
  { label: 'Notes', href: '/notes' },
  { label: 'About', href: '/about' },
  { label: 'Résumé', href: profile.resumeUrl, external: true },
]
// Drop dead external links (e.g. résumé before the PDF is hosted)
// and staging-only pages (src/lib/release.ts).
const NAV_LINKS = LINKS.filter(
  (l) => !(l.external && (!l.href || l.href === '#')) && !(l.href === '/play' && !showPlayground)
)

/* ---------- The B mark — square ink tile ---------- */
function BMark() {
  return (
    <Link to="/#top" aria-label="Adedayo Babalola — home" className="shrink-0">
      <img src={bLogo} alt="" className="size-9 rounded-none" />
    </Link>
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
  const [hovered, setHovered] = useState(false) // desktop x-expand (hover/focus)
  const [atTop, setAtTop] = useState(true) // viewport parked at the top of the page
  const [open, setOpen] = useState(false) // mobile y-dropdown (dots tap)
  const [canHover, setCanHover] = useState(false) // fine pointer — hover-expand is desktop-only
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCanHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  }, [])

  // At the top of the page the desktop nav rides open as a full-width bar;
  // once the user scrolls it collapses into the compact island (feedback #2).
  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Expanded when parked at the top OR on hover/focus while scrolled.
  const expanded = atTop || hovered

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
          onMouseEnter={() => canHover && setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => canHover && setHovered(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setHovered(false)
          }}
          transition={{ duration: dur.slow, ease: easeExpo }}
          className={[
            'glass flex h-14 items-center rounded-none [-webkit-tap-highlight-color:transparent]',
            // Mobile: one stable compact style — no atTop-driven relayout,
            // so tapping never bounces the island (feedback 2026-07-12 #1).
            'gap-4 px-3',
            // Desktop at the top: a roomier open island — items evenly
            // spaced, width hugs content, never full-width.
            atTop ? 'md:gap-7 md:px-6' : 'md:gap-4 md:px-3',
          ].join(' ')}
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
                  className="flex items-center gap-7 whitespace-nowrap"
                >
                  {NAV_LINKS.map((l) => {
                    const cls = [
                      'link-underline text-[14px] transition-colors duration-[var(--opt-motion-base)]',
                      active === l.label
                        ? 'font-medium text-opt-text-heading'
                        : 'text-opt-text-secondary hover:text-opt-text-heading',
                    ].join(' ')
                    return (
                      <li key={l.label}>
                        {l.external ? (
                          <a href={l.href} target="_blank" rel="noreferrer" className={cls}>
                            {l.label}
                          </a>
                        ) : (
                          <Link to={l.href} className={cls} aria-current={active === l.label ? 'true' : undefined}>
                            {l.label}
                          </Link>
                        )}
                      </li>
                    )
                  })}
                  <li className="flex items-center border-l border-opt-border-subtle pl-4">
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
            className="grid shrink-0 cursor-pointer place-items-center rounded-none px-1 [-webkit-tap-highlight-color:transparent] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-border-focus md:cursor-default"
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
                {NAV_LINKS.map((l) => (
                  <li key={l.label} className="border-b border-opt-border-subtle last:border-b-0">
                    {l.external ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between py-3 text-[16px] text-opt-text-heading"
                      >
                        {l.label}
                        <ArrowUpRight size={14} className="text-opt-text-secondary" />
                      </a>
                    ) : (
                      <Link
                        to={l.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between py-3 text-[16px] text-opt-text-heading"
                      >
                        {l.label}
                      </Link>
                    )}
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
