import type { Meta, StoryObj } from '@storybook/react-vite'

// ============================================================
// Welcome — the front door of Optimus. First thing every user
// sees. Sharp, editorial, theme-aware.
// ============================================================
const meta = {
  title: 'Welcome',
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: false },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const LAWS = [
  {
    k: '01',
    t: 'Edges are sharp',
    d: 'No corner rounding, anywhere. Every radius token resolves to 0. Straight edges are the signature — do not soften them.',
  },
  {
    k: '02',
    t: 'Light & dark stay in sync',
    d: 'Components consume one semantic layer. Dark mode only re-points primitives, so the two themes can never structurally drift.',
  },
  {
    k: '03',
    t: 'Closed token schema',
    d: 'Only use tokens wired in tokens.css. Never introduce a raw hex, an off-step neutral, or a new colour in a component.',
  },
  {
    k: '04',
    t: 'Glass is first-class',
    d: 'The frosted blur surface is a foundation effect, not decoration — use .glass for floating pills, nav, and overlays.',
  },
  {
    k: '05',
    t: 'Motion has one rhythm',
    d: 'Durations + easings come from tokens (CSS, GSAP, Framer Motion alike). Ease-out to enter, respect reduced-motion.',
  },
  {
    k: '06',
    t: 'Compose from blocks',
    d: 'Portfolios are assembled from composable blocks — Hero, Project Grid, Testimonial, Contact — built on these atoms.',
  },
]

const MAP = [
  { t: 'Foundations', d: 'Colour · Typography · Spacing · Radius · Elevation · Motion · Glass' },
  { t: 'Atoms', d: 'Button · ProjectCard · ContactWidget · Testimonial' },
  { t: 'Blocks', d: 'Composable sections to assemble a full portfolio' },
]

function Welcome() {
  return (
    <div className="min-h-screen bg-opt-surface-base text-opt-text-primary">
      <div className="mx-auto max-w-[1100px] px-8 py-20">
        {/* Masthead */}
        <p className="eyebrow">The portfolio-building design system</p>
        <h1 className="mt-6 font-display text-[clamp(4rem,13vw,180px)] leading-[0.9] tracking-[-0.02em] text-opt-text-heading">
          Optimus
        </h1>
        <p className="mt-6 max-w-[56ch] text-[var(--opt-font-size-lead)] leading-[1.5] text-opt-text-secondary">
          The design system behind <strong className="text-opt-text-heading font-medium">Adedayo Babalola</strong>&rsquo;s
          portfolio — a set of tokens, atoms, and composable blocks you assemble to build a portfolio.
          Editorial, sharp-edged, and dual-theme by construction.
        </p>

        {/* Identity strip */}
        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-y border-opt-border-default py-5">
          <div>
            <div className="label">Display</div>
            <div className="font-display text-[22px] text-opt-text-heading">Recoleta</div>
          </div>
          <div>
            <div className="label">Text</div>
            <div className="text-[22px] font-medium text-opt-text-heading">Switzer</div>
          </div>
          <div>
            <div className="label">Ink</div>
            <div className="font-opt-mono text-[16px] text-opt-text-heading">#0F0E0E</div>
          </div>
          <div>
            <div className="label">Paper</div>
            <div className="font-opt-mono text-[16px] text-opt-text-heading">#FBFBF9</div>
          </div>
          <div>
            <div className="label">Accent</div>
            <div className="font-opt-mono text-[16px] text-opt-text-heading">#C8F169</div>
          </div>
        </div>

        {/* Laws */}
        <h2 className="mt-16 font-display text-[28px] text-opt-text-heading">The laws</h2>
        <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden border border-opt-border-default bg-opt-border-default sm:grid-cols-2 lg:grid-cols-3">
          {LAWS.map((l) => (
            <div key={l.k} className="bg-opt-surface-base p-6">
              <div className="font-opt-mono text-[12px] text-opt-text-placeholder">{l.k}</div>
              <div className="mt-2 text-[16px] font-semibold text-opt-text-heading">{l.t}</div>
              <p className="mt-1.5 text-[14px] leading-[1.5] text-opt-text-secondary">{l.d}</p>
            </div>
          ))}
        </div>

        {/* Map */}
        <h2 className="mt-16 font-display text-[28px] text-opt-text-heading">How it&rsquo;s organised</h2>
        <div className="mt-6 space-y-px overflow-hidden border border-opt-border-default bg-opt-border-default">
          {MAP.map((m) => (
            <div key={m.t} className="flex flex-col gap-1 bg-opt-surface-base p-6 sm:flex-row sm:items-baseline sm:gap-8">
              <div className="w-40 shrink-0 font-display text-[20px] text-opt-text-heading">{m.t}</div>
              <div className="text-[15px] text-opt-text-secondary">{m.d}</div>
            </div>
          ))}
        </div>

        <p className="mt-16 max-w-[54ch] text-[14px] leading-[1.6] text-opt-text-placeholder">
          Use the <strong className="text-opt-text-secondary font-medium">Theme</strong> toggle in the toolbar to check
          light &amp; dark, and <strong className="text-opt-text-secondary font-medium">Annotate</strong> to drop
          Agentation feedback straight onto any component.
        </p>
      </div>
    </div>
  )
}

export const Welcome_: Story = {
  name: 'Optimus',
  render: () => <Welcome />,
}
