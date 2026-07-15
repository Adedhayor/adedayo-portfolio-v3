// ============================================================
// RouteMeta — GLOBAL. Per-route SEO plumbing for the SPA
// (2026-07-15): document.title, meta description, and canonical
// URL follow the route (crawlers execute JS; shared deep links
// get real titles). Also emits the route-aware analytics
// pageview, so one location listener drives both concerns.
// The static OG/Twitter tags in index.html stay site-level —
// social scrapers don't run JS; per-route OG needs prerendering.
// ============================================================
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { caseStudies, writing } from '@/data'
import { trackPageview } from '@/lib/analytics'

const ORIGIN = 'https://adedayobabalola.com'
const SITE = 'Adedayo Babalola'
const DEFAULT_TITLE = `${SITE} — Design Engineer`
const DEFAULT_DESC =
  'Design engineer turning complex, technical systems into experiences that feel simple, human, and trustworthy. Currently shaping RepliKit at RepliHaus.'

const STATIC_META: Record<string, { title: string; desc?: string }> = {
  '/': { title: DEFAULT_TITLE },
  '/work': { title: `Work — ${SITE}`, desc: 'Deep dives into the work — systems, research, and the decisions behind them.' },
  '/about': { title: `About — ${SITE}`, desc: 'Engineer turned design engineer — the story, the process, and the people behind the work.' },
  '/notes': { title: `Notes — ${SITE}`, desc: 'Essays on design, momentum, and doing fewer things with more meaning.' },
  '/play': { title: `Play — ${SITE}`, desc: 'Side projects, live builds, and small experiments.' },
}

function metaFor(pathname: string): { title: string; desc: string } {
  const fixed = STATIC_META[pathname]
  if (fixed) return { title: fixed.title, desc: fixed.desc ?? DEFAULT_DESC }

  const cs = pathname.match(/^\/case-study\/([^/]+)$/)
  if (cs) {
    const study = caseStudies.find((c) => c.slug === cs[1])
    if (study) return { title: `${study.title} — ${SITE}`, desc: study.blurb }
  }

  const note = pathname.match(/^\/notes\/([^/]+)$/)
  if (note) {
    const essay = writing.find((w) => w.slug === note[1])
    if (essay) return { title: `${essay.title} — ${SITE}`, desc: DEFAULT_DESC }
  }

  return { title: DEFAULT_TITLE, desc: DEFAULT_DESC }
}

function setHeadTag(selector: string, create: () => HTMLElement, set: (el: HTMLElement) => void) {
  let el = document.head.querySelector<HTMLElement>(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  set(el)
}

export default function RouteMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const { title, desc } = metaFor(pathname)
    document.title = title
    setHeadTag(
      'meta[name="description"]',
      () => Object.assign(document.createElement('meta'), { name: 'description' }),
      (el) => el.setAttribute('content', desc)
    )
    setHeadTag(
      'link[rel="canonical"]',
      () => Object.assign(document.createElement('link'), { rel: 'canonical' }),
      (el) => el.setAttribute('href', pathname === '/' ? `${ORIGIN}/` : `${ORIGIN}${pathname}`)
    )
    trackPageview()
  }, [pathname])

  return null
}
