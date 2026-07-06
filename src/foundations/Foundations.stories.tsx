import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { Eyebrow, Display, SectionTitle, Lead } from '@/lib/typography'

// One meta → the "Foundations" sidebar group. Every swatch reads a
// live CSS var, so it re-themes with the toolbar Theme toggle.
const meta = {
  title: 'Foundations',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function Frame({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-opt-surface-base p-10 text-opt-text-primary">{children}</div>
}
function Grid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">{children}</div>
}
function Chip({ label, token, mono }: { label: string; token: string; mono?: string }) {
  return (
    <div>
      <div className="mb-2 h-20 border border-opt-border-subtle" style={{ background: `var(${token})` }} />
      <div className="text-[13px] font-medium text-opt-text-heading">{label}</div>
      <div className="font-opt-mono text-[11px] text-opt-text-placeholder">{token}</div>
      {mono && <div className="font-opt-mono text-[11px] text-opt-text-placeholder">{mono}</div>}
    </div>
  )
}

/* ---------- COLOUR ---------- */
export const Colour: Story = {
  render: () => (
    <Frame>
      <Eyebrow>Foundations · Colour</Eyebrow>
      <p className="mt-2 mb-6 max-w-[60ch] text-[14px] text-opt-text-secondary">
        Semantic roles (top) are what components consume — they re-point per theme. Primitives (below)
        are the raw scale; never use them directly.
      </p>
      <h3 className="mb-3 label">Semantic — surface · text · border · interactive</h3>
      <Grid>
        <Chip label="Surface base" token="--opt-surface-base" />
        <Chip label="Surface low" token="--opt-surface-low" />
        <Chip label="Surface raised" token="--opt-surface-raised" />
        <Chip label="Border default" token="--opt-border-default" />
        <Chip label="Border subtle" token="--opt-border-subtle" />
        <Chip label="Text heading" token="--opt-text-heading" />
        <Chip label="Text secondary" token="--opt-text-secondary" />
        <Chip label="Interactive fill" token="--opt-interactive-active-fill" />
      </Grid>
      <h3 className="mt-10 mb-3 label">Primitives — neutral scale + accent</h3>
      <Grid>
        {['0', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'].map((s) => (
          <Chip key={s} label={`Neutral ${s}`} token={`--opt-color-neutral-${s}`} />
        ))}
        <Chip label="Lime 500" token="--opt-color-lime-500" mono="#C8F169" />
      </Grid>
    </Frame>
  ),
}

/* ---------- TYPOGRAPHY ---------- */
export const Typography: Story = {
  render: () => (
    <Frame>
      <Eyebrow>Foundations · Typography — Recoleta + Switzer only</Eyebrow>
      <div className="mt-6 space-y-8">
        <div>
          <Display>Adedayo Babalola</Display>
          <p className="mt-1 font-opt-mono text-[11px] text-opt-text-placeholder">Display · Recoleta 600 · clamp(44 → 96px)</p>
        </div>
        <div>
          <SectionTitle>Services that supercharge your business.</SectionTitle>
          <p className="mt-1 font-opt-mono text-[11px] text-opt-text-placeholder">Section title · Recoleta 600 · clamp(32 → 44px)</p>
        </div>
        <div>
          <Lead>I turn complex, technical systems into experiences that feel simple, human, and trustworthy.</Lead>
          <p className="mt-1 font-opt-mono text-[11px] text-opt-text-placeholder">Lead · Switzer · 20px / 1.5</p>
        </div>
        <div>
          <p className="max-w-[60ch] text-[17px] text-opt-text-heading">
            Body copy in Switzer at 17px. The quick brown fox jumps over the lazy dog while design systems,
            tokens, and shipped product stay in lockstep.
          </p>
          <p className="mt-1 font-opt-mono text-[11px] text-opt-text-placeholder">Body · Switzer 400 · 17px / 1.55</p>
        </div>
        <div>
          <Eyebrow>Eyebrow — Switzer · uppercase · tracked</Eyebrow>
          <p className="mt-1 font-opt-mono text-[11px] text-opt-text-placeholder">1234567890 · tabular figures (mono slot = Switzer)</p>
        </div>
      </div>
    </Frame>
  ),
}

/* ---------- SPACING ---------- */
export const Spacing: Story = {
  render: () => {
    const steps = ['micro', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl']
    return (
      <Frame>
        <Eyebrow>Foundations · Spacing</Eyebrow>
        <p className="mt-2 mb-6 text-[14px] text-opt-text-secondary">4 / 8 rhythm, extended for editorial section gaps.</p>
        <div className="space-y-3">
          {steps.map((s) => (
            <div key={s} className="flex items-center gap-4">
              <div className="w-16 font-opt-mono text-[12px] text-opt-text-placeholder">{s}</div>
              <div className="h-4 bg-opt-interactive-active-fill" style={{ width: `var(--opt-space-${s})` }} />
            </div>
          ))}
        </div>
      </Frame>
    )
  },
}

/* ---------- RADIUS ---------- */
export const Radius: Story = {
  render: () => (
    <Frame>
      <Eyebrow>Foundations · Radius</Eyebrow>
      <p className="mt-2 mb-6 max-w-[52ch] text-[14px] text-opt-text-secondary">
        Optimus is <strong className="text-opt-text-heading font-medium">sharp</strong>. Every radius token —
        sm, md, lg, xl, full — resolves to 0. This is a law, not a default.
      </p>
      <div className="flex flex-wrap gap-6">
        {['sm', 'md', 'lg', 'xl', 'full'].map((r) => (
          <div key={r} className="text-center">
            <div className="size-24 border border-opt-border-default bg-opt-surface-raised" style={{ borderRadius: `var(--opt-radius-${r})` }} />
            <div className="mt-2 font-opt-mono text-[11px] text-opt-text-placeholder">radius-{r} · 0</div>
          </div>
        ))}
      </div>
    </Frame>
  ),
}

/* ---------- ELEVATION ---------- */
export const Elevation: Story = {
  render: () => (
    <Frame>
      <Eyebrow>Foundations · Elevation</Eyebrow>
      <p className="mt-2 mb-8 text-[14px] text-opt-text-secondary">Editorial leans on hairlines; shadows stay subtle.</p>
      <div className="flex flex-wrap gap-8">
        {['xs', 'sm', 'md'].map((e) => (
          <div key={e} className="text-center">
            <div className="size-28 bg-opt-surface-raised" style={{ boxShadow: `var(--opt-elevation-${e})` }} />
            <div className="mt-3 font-opt-mono text-[11px] text-opt-text-placeholder">elevation-{e}</div>
          </div>
        ))}
      </div>
    </Frame>
  ),
}

/* ---------- MOTION ---------- */
export const Motion: Story = {
  render: () => {
    const durations = [['instant', '0ms'], ['fast', '150ms'], ['base', '250ms'], ['slow', '400ms'], ['slower', '700ms']]
    const easings = [
      ['standard', 'cubic-bezier(0.2, 0, 0, 1)'],
      ['expo', 'cubic-bezier(0.16, 1, 0.3, 1)'],
      ['quint', 'cubic-bezier(0.22, 1, 0.36, 1)'],
    ]
    return (
      <Frame>
        <Eyebrow>Foundations · Motion</Eyebrow>
        <p className="mt-2 mb-8 max-w-[56ch] text-[14px] text-opt-text-secondary">
          One rhythm across CSS, GSAP, and Framer Motion. Hover a bar to preview. Ease-out to enter;
          reduced-motion respected globally.
        </p>
        <h3 className="mb-3 label">Durations</h3>
        <div className="space-y-3">
          {durations.map(([n, ms]) => (
            <div key={n} className="group flex items-center gap-4">
              <div className="w-20 font-opt-mono text-[12px] text-opt-text-placeholder">{n}</div>
              <div className="relative h-8 w-64 border border-opt-border-subtle bg-opt-surface-low">
                <div className="absolute left-0 top-0 h-full w-8 bg-opt-interactive-active-fill group-hover:left-[calc(100%-2rem)]" style={{ transition: `left var(--opt-motion-${n}) var(--opt-easing-expo)` }} />
              </div>
              <div className="font-opt-mono text-[12px] text-opt-text-secondary">{ms}</div>
            </div>
          ))}
        </div>
        <h3 className="mt-10 mb-3 label">Easings</h3>
        <div className="space-y-1">
          {easings.map(([n, curve]) => (
            <div key={n} className="flex gap-4 font-opt-mono text-[12px]">
              <span className="w-20 text-opt-text-heading">{n}</span>
              <span className="text-opt-text-placeholder">{curve}</span>
            </div>
          ))}
        </div>
      </Frame>
    )
  },
}

/* ---------- GLASS ---------- */
export const Glass: Story = {
  render: () => (
    <Frame>
      <Eyebrow>Foundations · Glass</Eyebrow>
      <p className="mt-2 mb-8 max-w-[56ch] text-[14px] text-opt-text-secondary">
        A first-class frosted surface. Backdrop-blur + theme-aware tint + hairline border. Use{' '}
        <code className="font-opt-mono text-opt-text-heading">.glass</code> for floating pills, nav, and overlays.
      </p>
      <div className="relative h-80 overflow-hidden border border-opt-border-default">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 120% at 20% 10%, #c8f169 0%, transparent 45%), radial-gradient(120% 120% at 90% 80%, #0f0e0e 0%, transparent 55%), linear-gradient(120deg,#dfdcd3,#7a7770)' }} />
        <div className="absolute inset-0 grid place-items-center">
          <div className="glass px-8 py-6">
            <div className="text-[15px] font-medium text-opt-text-heading">Speak to me</div>
            <div className="text-[13px] text-opt-text-secondary">Frosted glass · backdrop-blur 16px</div>
          </div>
        </div>
      </div>
    </Frame>
  ),
}
