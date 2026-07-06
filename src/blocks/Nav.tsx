// ============================================================
// Nav block — responsive top navigation. Wordmark + links + CTA.
// Desktop: horizontal bar. Mobile (<768px): hamburger → sheet.
// Scaffold — links/content populated later.
// ============================================================
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Cta } from '@/blocks/_parts'
import { IconBtn } from '@/blocks/_parts'

type Link = { label: string; href: string }

type Props = {
  wordmark?: string
  links?: Link[]
  ctaLabel?: string
  ctaHref?: string
  className?: string
}

export default function Nav({
  wordmark = 'Adedayo',
  links = [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Writing', href: '#writing' },
  ],
  ctaLabel = 'Get in touch',
  ctaHref = '#contact',
  className = '',
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <header className={['sticky top-0 z-40 w-full border-b border-opt-border-default bg-opt-surface-base/80 backdrop-blur-md', className].join(' ')}>
      <nav className="container-opt flex h-16 items-center justify-between gap-4">
        {/* Wordmark */}
        <a href="#top" className="font-display text-[20px] font-semibold tracking-[-0.01em] text-opt-text-heading">
          {wordmark}
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-opt-xl md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="link-underline text-[15px] text-opt-text-secondary transition-colors hover:text-opt-text-heading">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Cta as="a" href={ctaHref} variant="solid" size="sm" caps>
            {ctaLabel}
          </Cta>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden">
          <IconBtn label={open ? 'Close menu' : 'Open menu'} tone="ghost" onClick={() => setOpen((v) => !v)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </IconBtn>
        </div>
      </nav>

      {/* Mobile sheet */}
      {open && (
        <div className="border-t border-opt-border-default bg-opt-surface-base md:hidden">
          <ul className="container-opt flex flex-col py-opt-sm">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-opt-md text-[16px] text-opt-text-heading"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="py-opt-sm">
              <Cta as="a" href={ctaHref} variant="solid" size="md" caps className="w-full">
                {ctaLabel}
              </Cta>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
