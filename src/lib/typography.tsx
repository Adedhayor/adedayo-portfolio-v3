// ============================================================
// Typographic primitives — Display, SectionTitle, Eyebrow, Lead.
// One place owns the type ramp. Theme-aware via semantic tokens.
// ============================================================
import type { ReactNode, ElementType } from 'react'

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={['eyebrow', className].join(' ')}>{children}</p>
}

export function Display({
  children,
  as: As = 'h1',
  className = '',
}: {
  children: ReactNode
  as?: ElementType
  className?: string
}) {
  return (
    <As
      className={[
        'font-display text-opt-text-heading',
        'text-[clamp(2.75rem,7vw,var(--opt-font-size-display))]',
        className,
      ].join(' ')}
    >
      {children}
    </As>
  )
}

export function SectionTitle({
  children,
  as: As = 'h2',
  className = '',
}: {
  children: ReactNode
  as?: ElementType
  className?: string
}) {
  return (
    <As
      className={[
        'font-display text-opt-text-heading',
        'text-[clamp(2rem,4.4vw,var(--opt-font-size-h2))] leading-[1.04]',
        className,
      ].join(' ')}
    >
      {children}
    </As>
  )
}

export function Lead({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={['max-w-[54ch] text-[var(--opt-font-size-lead)] leading-[1.5] text-opt-text-secondary', className].join(' ')}>
      {children}
    </p>
  )
}
