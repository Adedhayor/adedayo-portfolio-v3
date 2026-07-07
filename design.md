# Optimus — Design System

**The portfolio-building design system for Adedayo Babalola.**
Source of truth for tokens, rules, and conventions. Forked in spirit from the
Inkwell architecture (3-layer tokens), with its own editorial identity.

> Optimus is not a generic UI kit. It is a kit for **assembling portfolios** —
> a foundation plus composable **blocks** you arrange to build a portfolio site.

---

## 1. Identity

| | |
|---|---|
| **Display type** | Recoleta (self-hosted woff2, weights 500/600) |
| **Text / UI type** | Switzer (self-hosted woff2, weights 300–700) |
| **Ink** | `#0F0E0E` (primary) |
| **Paper** | `#FBFBF9` (canvas) |
| **Accent** | `#C8F169` lime — the one chromatic accent, used sparingly |
| **Voice** | Editorial, calm, values-first. The work carries the colour. |

---

## 2. The Laws (non-negotiable)

1. **Edges are sharp.** No corner rounding anywhere. Every radius token
   (`--opt-radius-sm|md|lg|xl|full`) resolves to `0`. Do not add `rounded-*`
   classes with real radii, do not soften cards, pills, avatars, or images.
   Straight edges are the signature.

2. **Light & dark stay in sync.** Components consume **only the semantic layer**.
   Dark mode is a set of *semantic overrides* in `.dark` that re-point the same
   role names to different primitives. Never fork a component's colours per
   theme — change the semantic token and both themes move together.

3. **Closed token schema.** Only use tokens defined in `src/styles/tokens.css`.
   Never introduce a raw hex, an off-step neutral, or a new colour inside a
   component. If a value is missing, add it to the token layer first (with
   sign-off), then consume it.

4. **Glass is first-class.** The frosted `.glass` surface is a foundation effect,
   not decoration. Use it for floating pills, nav, and overlays — the contact
   widget is the reference. Blur is theme-aware via tokens.

5. **Motion has one rhythm — and motion is the experience.** Durations and
   easings come from tokens and are shared by CSS, GSAP, and Framer Motion
   alike. Enter with ease-out (`--opt-easing-expo`), keep micro-interactions
   ≤ `base` (250ms). *Amended 2026-07-07 (owner decision):* signature sequences
   (loader, island, scatter-to-bento, ASCII field, footer shader) always play —
   under `prefers-reduced-motion`, simplify (shorter durations, fewer layers)
   but never strip to a static render. No motionless variants.

6. **Compose from blocks.** Pages are assembled from composable **blocks**
   (Hero, Project Grid, Testimonial, Contact, Footer). Blocks are built from
   atoms; atoms are built from tokens. Never reach past a layer.

---

## 3. Token architecture (3 layers)

`src/styles/tokens.css` — **the source of truth**. Namespace: `--opt-*`.

```
PRIMITIVES          raw, theme-agnostic scale (ink, paper, neutral-0…950, lime, status)
      ↓             never used directly in components
SEMANTICS           theme-aware roles — the ONLY layer components consume
      ↓             light in :root · dark overrides in .dark
ATMOSPHERE          elevation · motion · glass · radius(=0) · type scale · spacing
      ↓
@theme inline       maps everything to Tailwind utilities, all prefixed `opt-`
```

### Semantic roles (what you use)
- **Surface** — `surface-base` (canvas) · `surface-low` (recessed) · `surface-raised` (cards) · `surface-overlay` (scrim)
- **Text** — `text-heading` · `text-primary` · `text-secondary` · `text-placeholder` · `text-link`
- **Border** — `border-subtle` · `border-default` · `border-focus` (+ width tokens)
- **Interactive** — `interactive-active-fill` / `hover-fill` / `pressed-fill` / `ghost-hover` / `disabled-fill` / `selection`
  (Ink anchors action in light; inverts to Paper/white in dark.)
- **Accent** — `accent-lime-{bg,fill,fg}`, plus `success` / `danger` for forms
- **Glass** — `glass-{bg,border,shadow}` (theme-aware) + `--opt-blur-glass`

### Tailwind usage
`bg-opt-surface-raised`, `text-opt-text-heading`, `border-opt-border-subtle`,
`font-opt-display`, `text-opt-h2`, `shadow-opt-md`, `duration-opt-base`,
`ease-opt-expo`. Primitive utilities (`bg-opt-neutral-500`) exist but are for
foundations/demos only — **components use semantics**.

---

## 4. Type scale

| Token | Size / LH | Font | Use |
|---|---|---|---|
| `display` | 96 / 0.98 | Recoleta 600 | hero wordmark |
| `h1` | 64 / 1.02 | Recoleta 600 | page titles |
| `h2` | 44 / 1.04 | Recoleta 600 | section titles |
| `h3` | 28 / 1.12 | Recoleta 600 | sub-headers |
| `lead` | 20 / 1.5 | Switzer 400 | intro copy |
| `body` | 17 / 1.55 | Switzer 400 | default body |
| `sm` | 14 | Switzer | meta / small |
| `xs` | 12 | Switzer | labels |

Eyebrows: mono, uppercase, `0.14em` tracking (`.eyebrow`). Display headings
clamp fluidly (`clamp(2.75rem, 7vw, display)`).

---

## 5. Spacing, elevation, radius

- **Spacing** — 4/8 rhythm: `micro 2 · xs 4 · sm 8 · md 12 · lg 16 · xl 24 · 2xl 32 · 3xl 48 · 4xl 64 · 5xl 96 · 6xl 128`. Section gaps live at the top of the scale.
- **Elevation** — `xs · sm · md` only. Editorial leans on hairline borders over shadows.
- **Radius** — all `0`. See Law 1.

---

## 6. Motion (GSAP + Framer Motion + custom)

- **Durations** — `instant 0 · fast 150 · base 250 · slow 400 · slower 700` (image/hero reveals).
- **Easings** — `standard cubic-bezier(0.2,0,0,1)` · `expo cubic-bezier(0.16,1,0.3,1)` (signature) · `quint cubic-bezier(0.22,1,0.36,1)`.
- **Rules** — transform/opacity only; ease-out to enter, exit ~60–70% of enter;
  stagger lists 30–50ms; animations interruptible; never block input.
- **Libraries** — CSS transitions for state; **Framer Motion** for React
  enter/exit + layout; **GSAP** for scroll-driven / timeline sequences. Custom
  effects (shaders, canvas) get forked in over time — always token-timed and
  reduced-motion aware.

---

## 7. Accessibility (from ui-ux-pro-max)

- Text contrast ≥ 4.5:1 (primary) / ≥ 3:1 (secondary) — **verified in both themes**.
- Visible focus rings on all interactive elements (`focus-visible:ring-opt-border-focus`).
- Icon-only buttons carry `aria-label`. Icons are SVG (no emoji).
- Touch targets ≥ 44px. Colour is never the only signal.
- `prefers-reduced-motion` respected globally.

---

## 8. Structure

```
src/
  styles/tokens.css      ← the source of truth (3-layer)
  index.css              ← tailwind + tokens + fonts + base + .glass/.eyebrow
  ui/                    ← Atoms (Button, ProjectCard, ContactWidget, Testimonial, Text, Icons)
  ui/*.stories.tsx       ← Storybook stories (Atoms/*)
  ui/Foundations.stories ← Foundations (Colour, Type, Spacing, Radius, Elevation, Motion, Glass)
  Welcome.stories.tsx    ← the front door
  blocks/                ← (Phase 5) composable portfolio blocks
.storybook/preview.tsx   ← Theme toggle (.dark) + Agentation toggle + storySort
```

Storybook: `npm run storybook` → **localhost:6008**. App: `npm run dev` → **localhost:5173**.
Annotate any component with the **Annotate** toolbar (Agentation → MCP on port 4747).

---

## 9. Blocks (Phase 5 — the point of Optimus)

Composable sections a user arranges to build a portfolio:
`Hero · ProjectGrid · Services · Testimonials · ClientLogos · Contact · FooterWordmark`.
Each block is token-driven, theme-aware, sharp, and motion-tokened. New blocks
and effects are forked in over time.
