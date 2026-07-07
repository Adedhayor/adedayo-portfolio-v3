// ============================================================
// Stub — routed placeholder pages (BRIEF §5). Real content
// structure, clearly marked as in-progress. Filled in v1.1:
// /work (full bento + GitHub playground) · /about (full essay)
// · /writing (in-site Substack reader).
// ============================================================
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import PageFrame from '@/components/global/PageFrame'
import NavIsland from '@/components/global/NavIsland'
import FooterWordmark from '@/blocks/FooterWordmark'

type Props = {
  section: string
  title: string
  blurb: string
  children?: React.ReactNode
}

export default function Stub({ section, title, blurb, children }: Props) {
  return (
    <div className="min-h-screen">
      <PageFrame />
      <NavIsland />
      <main className="relative z-[1]">
        <section data-section={section} className="container-opt pt-40 pb-opt-6xl">
          <Link
            to="/"
            className="link-underline inline-flex items-center gap-1.5 text-[13px] font-medium text-opt-text-secondary"
          >
            <ArrowLeft size={13} /> Home
          </Link>
          <h1 className="mt-6 font-display text-[clamp(2.5rem,6vw,var(--opt-font-size-h1))] leading-[1.02] text-opt-text-heading">
            {title}
          </h1>
          <p className="mt-6 max-w-[58ch] text-[var(--opt-font-size-lead)] leading-[1.5] text-opt-text-secondary">
            {blurb}
          </p>
          <span className="mt-8 inline-block border border-dashed border-opt-border-default px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-opt-text-placeholder">
            Full page shipping in v1.1
          </span>
          {children}
        </section>
      </main>
      <div className="relative z-[1]">
        <FooterWordmark />
      </div>
    </div>
  )
}
