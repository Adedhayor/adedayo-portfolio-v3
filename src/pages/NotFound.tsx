// ============================================================
// NotFound — 404 page. Clear message + a way back home and to
// the main sections. Same chrome as the rest of the site.
// ============================================================
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import PageFrame from '@/components/global/PageFrame'
import NavIsland from '@/components/global/NavIsland'
import FooterWordmark from '@/blocks/FooterWordmark'
import { buttonVariants } from '@/components/ui/button'

const QUICK = [
  { label: 'Work', to: '/#work' },
  { label: 'About', to: '/#about' },
  { label: 'Writing', to: '/#writing' },
  { label: 'Contact', to: '/#contact' },
]

export default function NotFound() {
  return (
    <div id="top" className="min-h-screen">
      <PageFrame />
      <NavIsland />
      <main className="relative z-[1]">
        <section className="container-opt flex min-h-[82vh] flex-col justify-center pt-40 pb-opt-6xl">
          <p className="font-display leading-[0.85] tracking-[-0.03em] text-opt-text-heading text-[clamp(5rem,20vw,13rem)]">
            404
          </p>
          <h1 className="mt-4 max-w-[18ch] font-display text-[clamp(1.75rem,4vw,var(--opt-font-size-h2))] leading-[1.05] text-opt-text-heading">
            This page wandered off.
          </h1>
          <p className="mt-4 max-w-[52ch] text-[var(--opt-font-size-lead)] leading-[1.5] text-opt-text-secondary">
            The link may be broken, or the page has moved. Let’s get you back to something that exists.
          </p>

          <div className="mt-opt-2xl flex flex-wrap items-center gap-3">
            <Link to="/#top" className={buttonVariants({ variant: 'primary', iconPosition: 'leading' })}>
              <ArrowLeft size={14} strokeWidth={2.5} /> Back home
            </Link>
            <Link to="/#work" className={buttonVariants({ variant: 'secondary', iconPosition: 'trailing' })}>
              See the work <ArrowUpRight size={14} strokeWidth={2.5} />
            </Link>
          </div>

          <div className="mt-opt-2xl flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-opt-text-secondary">
            {QUICK.map((q) => (
              <Link key={q.label} to={q.to} className="link-underline transition-colors hover:text-opt-text-heading">
                {q.label}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <div className="relative z-[1]">
        <FooterWordmark />
      </div>
    </div>
  )
}
