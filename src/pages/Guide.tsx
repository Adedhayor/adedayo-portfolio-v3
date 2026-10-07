import { useEffect, useRef } from 'react'
import content from '@/data/guide.html?raw'
import '@/guide.css'

/** Native editorial layout retained from the author's tech_511 guide. */
export default function Guide() {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const links = Array.from(root.current?.querySelectorAll<HTMLAnchorElement>('.rail a') ?? [])
    const updateHash = () => links.forEach(link => { if (link.hash === window.location.hash) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current') })
    window.addEventListener('hashchange', updateHash)
    updateHash()
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        links.forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location')
          else link.removeAttribute('aria-current')
        })
      }
    }, { rootMargin: '-10% 0px -65% 0px' })
    links.forEach(link => { const section = root.current?.querySelector(link.hash); if (section) observer.observe(section) })
    return () => { observer.disconnect(); window.removeEventListener('hashchange', updateHash) }
  }, [])
  return <div ref={root} className="guide-page relative z-[1]" dangerouslySetInnerHTML={{ __html: content }} />
}
