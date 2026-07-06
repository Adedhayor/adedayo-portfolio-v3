// ============================================================
// Block-internal parts — the small patterns blocks compose from.
// NOT a Storybook group (no stories); these live inside Blocks.
// Self-contained, sharp, theme-aware, Recoleta/Switzer only.
// ============================================================
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Mail, Calendar, ArrowUpRight } from 'lucide-react'

/* ---------- Cta — marketing button/anchor ---------- */
type CtaVariant = 'solid' | 'ghost' | 'glass'
type CtaSize = 'sm' | 'md' | 'lg'
type CtaProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: CtaVariant
  size?: CtaSize
  icon?: ReactNode
  caps?: boolean
  as?: 'button' | 'a'
  href?: string
}
const ctaBase =
  'group inline-flex items-center justify-center gap-2 rounded-none font-opt-sans font-medium select-none cursor-pointer ' +
  'transition-[transform,background-color,border-color,box-shadow] duration-[var(--opt-motion-base)] [transition-timing-function:var(--opt-easing-expo)] ' +
  'active:translate-y-px disabled:opacity-40 disabled:pointer-events-none ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-opt-surface-base'
const ctaSizes: Record<CtaSize, string> = {
  sm: 'h-9 px-3.5 text-[13px]',
  md: 'h-11 px-5 text-[14px]',
  lg: 'h-13 px-6 text-[15px]',
}
const ctaVariants: Record<CtaVariant, string> = {
  solid:
    'bg-opt-interactive-active-fill text-opt-surface-base border border-opt-interactive-active-fill hover:bg-opt-interactive-hover-fill hover:border-opt-interactive-hover-fill hover:-translate-y-0.5 shadow-[0_1px_2px_rgba(15,14,14,0.18),0_10px_24px_-8px_rgba(15,14,14,0.35)]',
  ghost: 'bg-opt-surface-raised/60 text-opt-text-heading border border-opt-border-default hover:border-opt-border-focus/40 hover:-translate-y-0.5 hover:bg-opt-surface-raised',
  glass: 'glass text-opt-text-heading hover:-translate-y-0.5',
}
export function Cta({ variant = 'solid', size = 'md', icon, caps = false, className = '', children, as = 'button', href, ...rest }: CtaProps) {
  const cls = [ctaBase, ctaSizes[size], ctaVariants[variant], caps ? 'uppercase tracking-[0.08em] font-semibold' : '', className].join(' ')
  const inner = (
    <>
      <span>{children}</span>
      {icon && <span className="transition-transform duration-[var(--opt-motion-base)] [transition-timing-function:var(--opt-easing-expo)] group-hover:translate-x-0.5">{icon}</span>}
    </>
  )
  if (as === 'a') return <a href={href} className={cls}>{inner}</a>
  return <button className={cls} {...rest}>{inner}</button>
}

/* ---------- Square icon button ---------- */
export function IconBtn({ label, children, tone = 'solid', className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; children: ReactNode; tone?: 'solid' | 'ghost' }) {
  const toneCls = tone === 'solid'
    ? 'bg-opt-interactive-active-fill text-opt-surface-base hover:bg-opt-interactive-hover-fill'
    : 'bg-opt-surface-raised text-opt-text-heading border border-opt-border-default hover:border-opt-border-focus/40'
  return (
    <button aria-label={label} className={['inline-flex size-11 shrink-0 items-center justify-center rounded-none cursor-pointer transition-transform duration-[var(--opt-motion-base)] [transition-timing-function:var(--opt-easing-expo)] hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opt-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-opt-surface-base', toneCls, className].join(' ')} {...rest}>
      {children}
    </button>
  )
}

/* ---------- ProjectCard ---------- */
export function ProjectCard({ name, type, cover, href = '#', coverPos = 'center', className = '' }: { name: string; type: string; cover: string; href?: string; coverPos?: string; className?: string }) {
  return (
    <a href={href} className={['group block', className].join(' ')}>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-none border border-opt-border-subtle bg-opt-surface-raised">
        <img src={cover} alt={name} style={{ objectPosition: coverPos }} className="size-full object-cover transition-transform duration-[var(--opt-motion-slower)] [transition-timing-function:var(--opt-easing-expo)] group-hover:scale-[1.03]" />
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-opt-sans text-[17px] font-medium leading-tight text-opt-text-heading">{name}</h3>
          <p className="mt-0.5 label">{type}</p>
        </div>
        <span className="mt-0.5 inline-flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-opt-text-secondary transition-colors group-hover:text-opt-text-heading">
          View&nbsp;Project
          <ArrowUpRight size={15} className="transition-transform duration-[var(--opt-motion-base)] [transition-timing-function:var(--opt-easing-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </a>
  )
}

/* ---------- ContactWidget — frosted glass pill ---------- */
export function ContactWidget({ email = 'dayo@replikit.ai', calendly = '#', className = '' }: { email?: string; calendly?: string; className?: string }) {
  return (
    <div className={['inline-flex items-center gap-4 rounded-none glass pl-5 pr-2 py-2', className].join(' ')}>
      <div className="leading-tight">
        <p className="text-[15px] font-medium text-opt-text-heading">Speak to me</p>
        <p className="text-[13px] text-opt-text-secondary">Email or book a call</p>
      </div>
      <div className="flex items-center gap-2">
        <IconBtn label="Email me" onClick={() => (window.location.href = `mailto:${email}`)}><Mail size={18} /></IconBtn>
        <IconBtn label="Book a call" onClick={() => window.open(calendly, '_blank')}><Calendar size={18} /></IconBtn>
      </div>
    </div>
  )
}

/* ---------- Quote — big testimonial ---------- */
export function Quote({ quote, name, role, avatar, className = '' }: { quote: string; name: string; role: string; avatar?: string; className?: string }) {
  return (
    <figure className={['max-w-[46ch]', className].join(' ')}>
      <blockquote className="font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.28] tracking-[-0.01em] text-opt-text-heading">
        <span className="text-opt-text-placeholder">“</span>{quote}<span className="text-opt-text-placeholder">”</span>
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        {avatar
          ? <img src={avatar} alt={name} className="size-10 rounded-none object-cover" />
          : <span className="grid size-10 place-items-center rounded-none bg-opt-interactive-active-fill text-[13px] font-semibold text-opt-surface-base">{name.charAt(0)}</span>}
        <div className="leading-tight">
          <div className="text-[14px] font-semibold text-opt-text-heading">{name}</div>
          <div className="text-[13px] text-opt-text-secondary">{role}</div>
        </div>
      </figcaption>
    </figure>
  )
}
