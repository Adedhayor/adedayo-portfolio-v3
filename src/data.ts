// ============================================================
// Content — single source of truth for the portfolio
// ============================================================

// Real product shots, pulled from prior work (Vite resolves these to URLs)
import lithiumCover from './assets/work/lithium-cover.jpg'
import lithium2 from './assets/work/lithium-2.jpg'
import lithium3 from './assets/work/lithium-3.jpg'
import lithium4 from './assets/work/lithium-4.jpg'
import zilliqaCover from './assets/work/zilliqa-cover.jpg'
import zilliqa2 from './assets/work/zilliqa-2.jpg'
import zilliqa3 from './assets/work/zilliqa-3.jpg'
import lighthouseCover from './assets/work/lighthouse-cover.jpg'
import lighthouse2 from './assets/work/lighthouse-2.jpg'
import lighthouse3 from './assets/work/lighthouse-3.jpg'
import lighthouse4 from './assets/work/lighthouse-4.jpg'
import lighthouse5 from './assets/work/lighthouse-5.jpg'
import tabuleraCover from './assets/work/tabulera-cover.jpg'
import tabulera2 from './assets/work/tabulera-2.jpg'
import tabulera3 from './assets/work/tabulera-3.jpg'
import tabulera4 from './assets/work/tabulera-4.jpg'
// More-work covers (from the vault gallery — 08 — Portfolio/_assets/gallery)
import ebankCover from './assets/work/ebank-cover.jpg'
import emonieCover from './assets/work/emonie-cover.jpg'
import westgateCover from './assets/work/westgate-cover.jpg'
import nukodesCover from './assets/work/nukodes-cover.jpg'
import postpaddyCover from './assets/work/postpaddy-cover.jpg'
// Design-system studies — title-card placeholders (swap for real
// Storybook captures once grabbed). SVGs resolve to URLs in Vite.
import inkwellCover from './assets/work/inkwell-cover.svg'
import propertyPanelCover from './assets/work/property-panel-cover.svg'
import portfolioCover from './assets/work/portfolio-cover.svg'
import portrait from './assets/portrait.jpg'
// Pre-fetched Substack article bodies (cleaned HTML, keyed by slug)
import notesContent from './data/notesContent.json'
import { isHeldBack } from './lib/release'

export const profile = {
  name: 'Babalola Adedayo',
  fullName: 'Emmanuel Adedayo Babalola',
  shortName: 'Adedayo',
  role: 'Product & UX Designer',
  secondaryRole: 'Product Designer',
  location: 'Lagos, Nigeria',
  timezone: 'WAT',
  email: 'dayo@replikit.ai',
  calendly: 'https://calendly.com/adedayobabalola/30min',
  whatsapp: '2348121779861', // intl format (08121779861 → +234)
  linkedin: 'https://www.linkedin.com/in/emmanuel-adedayo-babalola/',
  instagram: 'https://instagram.com/__dedayo',
  instagramPhotography: 'https://www.instagram.com/optimus.randoms/',
  twitter: 'https://x.com/__dedayo',
  substack: 'https://dedayo.substack.com/',
  resumeUrl: '#', // TODO: host résumé PDF

  // Hero — calm, values-first (no metric-shouting)
  intro:
    'I’m a product & UX designer — I turn complex, technical systems into experiences that feel simple, human, and trustworthy. I care about clarity, craft, and the small details that make software feel right.',
  currently:
    'Shaping RepliKit at RepliHaus — and exploring where design meets intelligent systems.',
  question: 'Lately I’ve been asking: what does software feel like when it earns your trust in the first ten seconds?',

  metrics: [
    { value: '$5M+', label: 'on-chain value designed for' },
    { value: '50+', label: 'component design systems' },
    { value: '+2,100', label: 'in-product interactions driven' },
    { value: '~5 yrs', label: 'fintech · Web3 · SaaS' },
  ],
} as const

export type CaseStudy = {
  slug: string
  index: string
  title: string
  blurb: string
  tag: string
  client: string
  year: string
  role: string
  metric: string
  accent?: string
  cover: string
  /** crop hint for the cover within the card */
  coverPos?: string
  /** NDA-fenced — the detail page asks for a password before it renders */
  nda?: boolean
  /** Being rewritten — the detail page shows a "coming soon" note instead */
  comingSoon?: boolean
}

// Deep case studies — lead with the current flagship design-system work.
// Staged-only studies (src/lib/release.ts) are filtered out below, so
// production builds never list, route, or link to them.
const allCaseStudies: CaseStudy[] = [
  {
    slug: 'inkwell',
    index: '01',
    title: 'Inkwell — RepliHaus’s editor design system',
    blurb:
      'A neutral-first, closed-token design system that keeps a dense pro editor calm — built ground-up and shipped as Storybook components.',
    tag: 'Design Systems',
    client: 'RepliHaus',
    year: '2026',
    role: 'Design System Lead',
    metric: 'Closed-token system',
    accent: '#111111',
    cover: inkwellCover,
    coverPos: 'center',
    nda: true,
  },
  {
    slug: 'property-panel',
    index: '02',
    title: 'Redesigning the Property Panel',
    blurb:
      'Taking the editor’s most overloaded surface — an 800px wall of fields — apart, researching it against 11 tools, and rebuilding it as a semantic-first inspector.',
    tag: 'UX Research · Design Systems',
    client: 'RepliHaus',
    year: '2026',
    role: 'Lead Designer',
    metric: '11-tool teardown',
    accent: '#3b6ef5',
    cover: propertyPanelCover,
    coverPos: 'center',
    nda: true,
  },
  {
    slug: 'lithium-staking',
    index: '03',
    title: 'Unified multi-protocol staking',
    blurb:
      'A single platform that makes staking across blockchains feel certain — designed for “minimum certainty in 10 seconds.”',
    tag: 'Web3 · Fintech',
    client: 'Lithium Digital',
    year: '2024',
    role: 'Lead Product Designer',
    metric: '$5M+ on-chain',
    accent: '#2b2bff',
    cover: lithiumCover,
    coverPos: 'center',
  },
  {
    slug: 'lighthouse-ds',
    index: '02',
    title: 'Lighthouse — Vizible’s first design system',
    blurb:
      'A token-based system built ground-up: 50+ components, accessibility by default, 50% faster design-to-dev turnaround.',
    tag: 'Design Systems',
    client: 'Vizible Labs',
    year: '2024',
    role: 'Product Designer',
    metric: '50+ components',
    accent: '#ff7a18',
    cover: lighthouseCover,
    coverPos: 'center',
  },
  {
    slug: 'zilliqa-migration',
    index: '03',
    title: 'Zilliqa 1.0 → 2.0 staking migration',
    blurb:
      'A step-by-step migration flow for moving staked ZIL to the new EVM network, plus the launch UX for lit-ZIL liquid staking.',
    tag: 'Web3 · Migration',
    client: 'Lithium Digital',
    year: '2025',
    role: 'Lead Product Designer',
    metric: 'lit-ZIL launch',
    accent: '#00b894',
    cover: zilliqaCover,
    coverPos: 'center',
  },
  {
    slug: 'tabulerasa',
    index: '04',
    title: 'Tabulerasa — legal workflow redesign',
    blurb:
      'A modular brief builder and collaboration space for legal teams, scaling from solo lawyers to large firms.',
    tag: 'Legal-tech · B2B',
    client: 'Tabulerasa Inc.',
    year: '2022',
    role: 'Product Designer',
    metric: '30+ lawyer interviews',
    accent: '#6c5ce7',
    cover: tabuleraCover,
    coverPos: 'center',
  },
  {
    slug: 'westgate',
    index: '07',
    title: 'Westgate — an electronics store that converts',
    blurb:
      'An electronics retailer with traffic but a leaky checkout — rebuilt around a faster, clearer path from product to purchase.',
    tag: 'eCommerce · B2C',
    client: 'Westgate Technologies',
    year: '2026',
    role: 'Product Designer',
    metric: '+25% completed checkouts',
    accent: '#d98a1f',
    cover: westgateCover,
    coverPos: 'center',
    comingSoon: true,
  },
  {
    slug: 'building-this-portfolio',
    index: '08',
    title: 'Building this portfolio',
    blurb:
      'The site you’re on — an editorial one-pager built on its own design system (Optimus), a WebGL chrome footer, and an AI pair-programmer in the loop.',
    tag: 'Claude Code · Design Engineering',
    client: 'Self-initiated',
    year: '2026',
    role: 'Designer & Developer',
    metric: 'Designed × built solo',
    accent: '#c8ff2d',
    cover: portfolioCover,
    coverPos: 'center',
  },
]

export const caseStudies: CaseStudy[] = allCaseStudies.filter((cs) => !isHeldBack(cs.slug))

// Lighter "more work" row — real covers from the vault gallery
export type MoreWorkItem = {
  title: string
  tag: string
  year: string
  note: string
  cover: string
  url?: string // TODO: live project URL — activates the "View project" hover CTA
}
export const moreWork: MoreWorkItem[] = [
  { title: 'eMonie', tag: 'Fintech web', year: '2025', note: '40% engagement increase', cover: emonieCover },
  { title: 'eBank Group', tag: 'Fintech web', year: '2025', note: 'Modular web system', cover: ebankCover },
  { title: 'Nukodes', tag: 'Bookkeeping', year: '2026', note: 'Coming soon', cover: nukodesCover },
  { title: 'PostPaddy', tag: 'Social', year: '2022', note: '2K+ active users', cover: postpaddyCover },
]

// ============================================================
// Testimonials — PLACEHOLDERS (owner decision, 2026-07-07).
// Real references are being collected from referees: Seun, Caleb,
// Dami, Tof, Ibukun, Temidayo, Martin. Nothing here is a real
// quote; flip `placeholder: false` and drop the words in as they
// land. v2 candidate quotes are kept in the vault (02 — Work),
// pending re-confirmation.
// ============================================================
export type Testimonial = {
  quote: string
  name: string
  title: string
  company: string
  /** true until the referee's real reference lands */
  placeholder: boolean
}

const PLACEHOLDER_QUOTE =
  'Reference on its way — this space is reserved for their words, not mine.'

export const testimonials: Testimonial[] = [
  { quote: PLACEHOLDER_QUOTE, name: 'Seun', title: 'Reference pending', company: '—', placeholder: true },
  { quote: PLACEHOLDER_QUOTE, name: 'Dami', title: 'Reference pending', company: '—', placeholder: true },
  { quote: PLACEHOLDER_QUOTE, name: 'Temidayo', title: 'Reference pending', company: '—', placeholder: true },
]

// ============================================================
// Mini about — landing-page cut of the About essay (BRIEF §4.3).
// Full essay lives in the vault (08 — Portfolio / 01 — About)
// and ships on /about.
// ============================================================
export const about = {
  heading: 'Designing experiences that solve real problems.',
  portrait,
  bio: [
    'I didn’t start in design — I started in mechanical engineering. What I loved was the systems part: understand how the thing works, find where it strains, change it, then measure whether the change held. That’s still exactly how I design.',
    'Nearly five years across blockchain, fintech, legal tech, and infrastructure — interfaces managing $5M+ in on-chain value at Lithium Digital, Vizible’s first design system, and now RepliKit at RepliHaus. Then I did the same with code: I build and ship my designs to production, so the handoff gap I used to design around, I just close.',
  ],
  // Stack & process — text chips for now; swap in official SVG marks
  // when collected (BRIEF §4.3 TODO — never redraw a brand from memory).
  stack: ['Figma', 'Paper', 'Claude Code', 'Obsidian', 'Notion', 'Storybook', 'Linear', 'Framer'],
}

// How I work — numbered process for the About page (§ about, feedback #13)
export const process = [
  {
    no: '01',
    title: 'Understand the system',
    body: 'Before pixels: how does the thing actually work, and where does it strain? I read the flows, the tickets, and the code — the delta between what was intended and what shipped.',
  },
  {
    no: '02',
    title: 'Frame the bet',
    body: 'Turn friction into a point of view. Research earns the opinion — competitive teardowns and named patterns become a few composable directions, not a mood board.',
  },
  {
    no: '03',
    title: 'Design every state',
    body: 'Not just the happy path — empty, single, multiple, mixed, error. Grounded in a design system, so each decision is also a contribution to it.',
  },
  {
    no: '04',
    title: 'Finish in code',
    body: 'Ship the design as real, token-driven components. The work isn’t done until an engineer can build from it — so I close the handoff gap by building it myself.',
  },
]

export const workHistory = [
  {
    period: '2026 — Present',
    company: 'RepliHaus',
    role: 'UX Designer',
    summary:
      'Leading design on the RepliKit editor — built Inkwell, its closed-token design system, and shipping the Property Panel redesign as real React components.',
  },
  {
    period: '2023 — 2025',
    company: 'Lithium Digital',
    role: 'Founding Designer',
    summary:
      'First designer — took multi-protocol staking from idea to a live platform managing $5M+ on-chain, including the Zilliqa 1.0 → 2.0 migration and lit-ZIL launch.',
  },
  {
    period: '2024 — 2025',
    company: 'Vizible Labs',
    role: 'Associate Product Designer',
    summary:
      'Built Lighthouse, Vizible’s first design system — 50+ accessible components that halved design-to-dev turnaround.',
  },
  {
    period: '2022 — 2023',
    company: 'Tabulerasa Inc.',
    role: 'Product Designer',
    summary:
      'Redesigned legal workflows around a modular brief builder and client collaboration space, shaped by 30+ lawyer interviews.',
  },
  {
    period: '2021 — 2022',
    company: 'Digital Figures Solutions',
    role: 'Junior Product Designer',
    summary:
      'Cut my teeth on client web products — fintech dashboards and marketing sites, learning to ship under real constraints.',
  },
]

// "Now" — what I'm into lately (personal). TODO: confirm real picks.
export const now = {
  listening: {
    label: 'On repeat',
    playlistUrl: 'https://open.spotify.com/playlist/3uQ0TJHnzUBr3svWwrBcv2',
    tracks: [
      { title: 'Essence', artist: 'Wizkid' },
      { title: 'Time’s Up', artist: 'Cruel Santino' },
      { title: 'Higher', artist: 'Tems' },
    ],
  },
  reading: {
    label: 'Reading',
    title: 'Design Engineering Handbook',
    author: 'DesignBetter · InVision',
  },
}

// Writing — personal essays from Substack (dedayo.substack.com).
// Full article bodies are pre-fetched from the Substack RSS feed and
// stored in ./data/notesContent.json (keyed by slug) so they read
// in-app on /notes/:slug without leaving the site. Re-run the
// scratchpad extractor to refresh when new essays publish.
export const substackUrl = 'https://dedayo.substack.com/'
export const writing = [
  {
    slug: 'channeling-your-inner-child-chasing',
    title: 'Channeling Your Inner Child: Chasing Your Dreams',
    date: 'May 27, 2026',
    readTime: '7 min',
    url: 'https://dedayo.substack.com/p/channeling-your-inner-child-chasing',
    excerpt:
      'Childhood dreams don’t expire — we just get tired of defending them. On taking up swimming, running and cooking as an adult, and why it’s never too late.',
    quote: 'We don’t give up on our dreams because we forget them. We give up because we get tired of defending them.',
  },
  {
    slug: 'for-my-27th-i-write-to-my-mum',
    title: 'For my 27th, I write to my Mum.',
    date: 'Mar 28, 2026',
    readTime: '9 min',
    url: 'https://dedayo.substack.com/p/for-my-27th-i-write-to-my-mum',
    excerpt:
      'A birthday letter to my late mother, Aderonke — childhood memories, and how she prepared me for a life she knew she might not see.',
    quote: 'Maybe you knew you wouldn’t always be here… so you did everything you could while you were here.',
  },
  {
    slug: 'you-can-just-do-things-i-did',
    title: 'You can just do things. I did.',
    date: 'Jan 1, 2026',
    readTime: '5 min',
    url: 'https://dedayo.substack.com/p/you-can-just-do-things-i-did',
    excerpt:
      '2025 as a year of intentional movement — 174km run, learning to swim, getting my licence, quitting my job — and doing fewer, better-aligned things in 2026.',
    quote: 'Movement creates clarity, not the other way around.',
  },
] as const

export type Note = (typeof writing)[number]
const noteBodies = notesContent as Record<string, string>

/** The essay by slug, with its pre-fetched in-app body (may be empty). */
export function getNote(slug: string): { meta: Note; body: string } | undefined {
  const meta = writing.find((w) => w.slug === slug)
  if (!meta) return undefined
  return { meta, body: noteBodies[slug] ?? '' }
}

// Lab — experiments & explorations. TODO: replace with real experiments.
export const labs = [
  { title: 'Dot-field', blurb: 'A cursor-reactive generative grid.', tag: 'Interaction', year: '2026' },
  { title: 'Sound study', blurb: 'Subtle UI audio — clicks, transitions, ambience.', tag: 'Sound', year: '2026' },
  { title: 'Staking motion', blurb: 'Micro-interactions for high-stakes financial actions.', tag: 'Motion', year: '2025' },
]

export const nav = [
  { label: 'Work', to: '/work' },
  { label: 'Lab', to: '/lab' },
  { label: 'Writing', to: '/writing' },
  { label: 'Photos', to: '/photography' },
  { label: 'About', to: '/about' },
]

// ============================================================
// Case-study detail content
// ============================================================
export type Figure = { src: string; caption: string; wide?: boolean }
export type Section = {
  heading: string
  body: string[]
  list?: string[]
  figure?: Figure
}
export type CaseDetail = {
  tagline: string
  deliverables: string[]
  overview: string
  sections: Section[]
  outcomes: { value: string; label: string }[]
}

export const caseDetails: Record<string, CaseDetail> = {
  inkwell: {
    tagline:
      'A neutral-first, closed-token design system that keeps a dense professional editor calm — built ground-up and carried all the way into shipping React components.',
    deliverables: ['Three-layer design tokens', 'Component library (Storybook)', 'Contribution rules & docs'],
    overview:
      'RepliKit is an AI-powered, brand-safe template editor — a tool people live in for hours. As it grew, styling started to creep in ad-hoc: one-off colours, inconsistent spacing, components diverging surface to surface. Inkwell is the design system I lead to fix that: a closed, neutral-first token contract and a component library tuned for editor density, obeyed rather than merely documented.',
    sections: [
      {
        heading: 'A system for people who live in the tool',
        body: [
          'An editor is not a landing page. The people using RepliKit sit in it eight hours a day, so colour has to stay quiet and every control has to be legible at a glance. The friction wasn’t any single ugly screen — it was drift: the same idea styled five different ways because there was no single answer to reach for.',
        ],
        list: [
          'Ad-hoc colours and off-step neutrals appearing per feature.',
          'Controls sized and spaced differently across surfaces.',
          'No shared contract between design files and the shipped UI.',
        ],
      },
      {
        heading: 'Tokens before components',
        body: [
          'Inkwell is built as three layers — primitive → semantic → component — under a single `--rk-*` namespace, and the schema is deliberately closed: no new colours, no off-step neutrals, ever. It’s neutral-first by design. Chroma is reserved for exactly four semantic roles — info, success, warning, danger — and never spent on a generic UI accent. Getting the foundations right first meant every component assembled from an already-aligned palette.',
        ],
      },
      {
        heading: 'The Ink aesthetic',
        body: [
          'The visual language is tuned for density and calm: a 300px rail, 32px controls at a 2px radius, hairline dividers instead of shadows, numeric values in monospace, and Lucide for standard glyphs. A no-pills rule and a quiet neutral state keep the surface from shouting. Constraints like these aren’t a cage — an off-token colour is just a sign the real answer hasn’t been found yet.',
        ],
      },
      {
        heading: 'Shipped, not just documented',
        body: [
          'Inkwell isn’t a static kit — it’s a living system that ships. Components are built as real, token-driven React in Storybook, reusing shared atoms rather than hand-rolling, so the design-to-code handoff gap closes instead of widening. That discipline is exactly what let the Property Panel redesign stand on solid ground.',
        ],
      },
    ],
    outcomes: [
      { value: 'Closed', label: 'token schema, obeyed' },
      { value: '4 roles', label: 'chroma reserved for meaning' },
      { value: 'Storybook', label: 'components that ship' },
    ],
  },

  'property-panel': {
    tagline:
      'The editor’s most overloaded surface — a 197KB, 800px-tall wall of fields — taken apart, researched against eleven competing tools, and rebuilt as a labeled, semantic-first inspector grounded in a closed design-token schema.',
    deliverables: ['UX audit', 'Competitive research (11 tools)', 'IA & feature briefs', 'React / Storybook components'],
    overview:
      'In a canvas editor, the property panel is where the work happens — sizing a node, styling it, binding it to a token, tagging it with meaning. In RepliKit it was also the single most overloaded thing in the product: the largest file in the codebase, rendering 10+ context-driven sections as one continuous 800px scroll. And it was quietly doing two jobs at once — inspecting a node and authoring a template schema — while only really doing the first.',
    sections: [
      {
        heading: 'The most overloaded surface',
        body: [
          'The work began inside a surface-by-surface UX audit of the editor, framed as the delta between the intended flow (the PRDs) and the actual implementation (the code). The Property Panel was one of the worst offenders, and the audit produced a concrete friction inventory.',
        ],
        list: [
          'Zone tagging — a core workflow — sat dead last, under an 800px scroll.',
          'Model config was gated behind selecting the root frame, with nothing pointing there.',
          'No grouping, labels, or collapse: 10+ sections separated only by thin dividers.',
          'Multi-select collapsed to Align/Distribute only — every per-node property hidden.',
        ],
      },
      {
        heading: 'Research earns the right to an opinion',
        body: [
          'I wanted decisions grounded in precedent, not taste — so for each state (empty and selected) I ran a structured teardown of eleven tools, ordered closest-precedent to most-distinctive, with Figma Buzz weighted heaviest as the direct competitor. Every claim was tied to a source; gaps were flagged, not smoothed over.',
        ],
        list: [
          'Buzz — the template schema literally is the marketer’s UI; order typed/semantic controls first.',
          'Sketch — edit through a named, resettable override model, not the raw node.',
          'Penpot — best-in-class multi-select: show the union, mark conflicts “Mixed”, keep them editable.',
          'Cross-cutting: nobody pins AI in the empty state — it’s always contextual.',
        ],
      },
      {
        heading: 'Semantic-first — lead with meaning',
        body: [
          'The teardowns collapsed into named patterns so the conversation could happen at the level of ideas. Two of the best — a live-preview feedback loop and full token-chain transparency — turned out to already exist inside the product, just siloed; a lot of the “redesign” was propagating internal wins. The confirmed bet layered three directions: a grouped, collapsible IA as the foundation, a pinned “Identity” group (Semantic Type · Zone · Variant binding · Token bindings) as the organising principle, and an override model for components — with Penpot’s “Mixed” cross-cutting all of it.',
        ],
        list: [
          'Align & distribute pinned at the top, always — the one control identical across every node.',
          'Zone promoted from last to the pinned Identity group, hover-highlighting on canvas.',
          'Predictable, fixed section order with collapse state that persists across selections and reloads.',
        ],
      },
      {
        heading: 'Grounded in Inkwell — and in subtraction',
        body: [
          'None of this floats free of Inkwell’s closed token schema: every surface, divider, tone, radius, and step had to resolve to a token already wired in the system — a constraint that caught a stray blue active-ring more than once. The clearest lesson came from the Stroke section, the most-iterated of all: it cycled through cap/join/dash and per-side models before resetting to basics only, because the underlying stroke is just a CSS border. When the model is simple, fight to keep the UI simple. The Fill picker, by contrast, earned its complexity — near-duplicate detection, contrast checks, and token-drift re-linking that operationalise “keep the palette closed” at the point of creation.',
        ],
      },
      {
        heading: 'Finished in code',
        body: [
          'A panel design that only lives in design files isn’t finished. The molecules convert into real, token-driven React shipped to Storybook — reusing Inkwell atoms rather than hand-rolling. Shipped so far: FillSection + FillPicker, StrokeSection, and a wave of section components (Intelligence, Effects, Guides, Typography, Fit & Asset), with Position + Layout mid-flight. The work isn’t real until it’s a component an engineer can build from.',
        ],
      },
    ],
    outcomes: [
      { value: '11 tools', label: 'competitive teardown' },
      { value: 'Semantic-first', label: 'meaning above CSS' },
      { value: 'Shipped', label: 'token-driven components' },
    ],
  },

  'lithium-staking': {
    tagline:
      'A unified platform that makes staking across blockchains feel certain — built for “minimum certainty in 10 seconds.”',
    deliverables: ['Product website (desktop & mobile)', 'Responsive dashboard', 'Design direction'],
    overview:
      'In the rapidly evolving world of decentralised finance, users face fragmented experiences when staking assets across protocols. The challenge was to design a single platform that makes multi-protocol staking intuitive and accessible — for first-timers and power users alike.',
    sections: [
      {
        heading: 'What I stepped into',
        body: [
          'When I joined Lithium Digital, the product was still an idea. The plan was multi-protocol staking — letting users stake and manage assets across several blockchain protocols from one place. We needed a design that supported the core tasks and a UI that matched our emerging brand.',
          'My role was to design the staking experience — not just visually, but structurally — so that new and experienced users could onboard, stake, and manage assets with confidence. I worked alongside a small cross-functional team of engineers, brand and content, and our heads of growth.',
        ],
        figure: { src: lithium2, caption: 'User dashboard — active positions and rewards at a glance.', wide: true },
      },
      {
        heading: 'How I thought about it',
        body: ['From day one I knew we couldn’t just repaint the UI — we had to rethink how staking was explained and experienced.'],
        list: [
          'Design for “minimum certainty” — what does a first-time user need in the first 10 seconds to feel safe?',
          'Show, don’t overwhelm — make every step lightweight, progressive, and clearly labelled.',
          'Mobile-first, not mobile-also — structure content vertically first, then layer up to desktop.',
        ],
        figure: { src: lithium3, caption: 'Wallet management — connection deferred until it’s actually needed.', wide: true },
      },
      {
        heading: 'What we tried and changed',
        body: [
          'We began with low-fidelity wireframes and tested early versions of the flow with internal users and early adopters. Two changes mattered most:',
        ],
        list: [
          'V1 listed every protocol in one long view. We replaced it with a single scrollable surface that grouped protocols with clear visual distinction, plus a simplified dashboard for all actions.',
          'We originally forced a wallet connection before users could see anything. We deferred it until after protocol selection and yield estimation — giving people control before commitment.',
        ],
        figure: { src: lithium4, caption: 'Stake flow — projected yields and terms shown before any commitment.', wide: true },
      },
      {
        heading: 'Where we landed',
        body: [
          'The final product was a responsive staking dashboard that let users browse protocols with clear hierarchy, see projected yields and terms before committing, connect wallets only when needed, and stake and manage positions with confidence. First-time completion improved markedly in internal testing, and the consistent UI cut down on user confusion.',
        ],
      },
    ],
    outcomes: [
      { value: '$5M+', label: 'on-chain value managed' },
      { value: 'Multi-chain', label: 'protocols unified' },
      { value: 'Mobile-first', label: 'IA that scales to desktop' },
    ],
  },

  'zilliqa-migration': {
    tagline:
      'A step-by-step migration flow for moving staked ZIL to the new EVM network — plus the launch UX for lit-ZIL liquid staking.',
    deliverables: ['Product website (desktop & mobile)', 'Responsive dashboard', 'lit-ZIL launch UX'],
    overview:
      'With the transition from Zilliqa 1.0 to 2.0, users had to manually migrate their staked ZIL and rewards to the new EVM-compatible network — a process that was confusing and fragmented. I designed a unified, step-by-step interface for Lithium Digital that guides users through unstaking, transferring, and restaking, and introduced lit-ZIL, a liquid staking token that keeps users liquid while they participate in DeFi.',
    sections: [
      {
        heading: 'The migration problem',
        body: [
          'Migrating across network versions is high-stakes and unforgiving — a wrong step can strand funds. Users needed a flow that made an irreversible, multi-stage process feel safe and legible end to end.',
        ],
        figure: { src: zilliqa2, caption: 'Legacy withdrawal — unstaking from the 1.0 network.', wide: true },
      },
      {
        heading: 'A guided, three-step flow',
        body: [
          'I broke the journey into three clearly-signposted steps — unstake from Zillion, move to an EVM-compatible wallet, and restake on Lithium Digital — with state and progress visible at every point. lit-ZIL was introduced as part of the restake step so users could stay liquid without leaving the flow.',
        ],
        list: [
          'EVM wallet connection handled with explicit, reversible steps.',
          'Progress and network state surfaced continuously, never hidden.',
          'lit-ZIL liquid staking offered inline, at the moment of restaking.',
        ],
        figure: { src: zilliqa3, caption: 'EVM wallet connection — explicit, reversible, legible.', wide: true },
      },
    ],
    outcomes: [
      { value: 'lit-ZIL', label: 'liquid staking token launched' },
      { value: '3 steps', label: 'from fragmented to guided' },
      { value: 'EVM', label: '1.0 → 2.0 migration shipped' },
    ],
  },

  'lighthouse-ds': {
    tagline:
      'Vizible’s first design system — a token-based foundation that scaled the brand without losing it.',
    deliverables: ['Design tokens', 'UI components', 'Design system documentation'],
    overview:
      'As the product evolved and the visual identity took shape, design started to feel fragmented — each page, component, and flow styled in isolation. We needed a system that was foundational, scalable, and true to the brand we were building. That’s how Lighthouse was born.',
    sections: [
      {
        heading: 'What wasn’t working',
        body: ['Before Lighthouse, the design process faced compounding friction:'],
        list: [
          'Inconsistent use of colour, typography, and spacing.',
          'Components styled differently across desktop and mobile.',
          'Developers recreating UI from scratch for each feature.',
          'Handoff delays from unclear specs or missing states.',
          'No single source of truth for component usage or behaviour.',
        ],
        figure: { src: lighthouse2, caption: 'Typography tokens — the foundation, defined before any component.', wide: true },
      },
      {
        heading: 'Foundations before components',
        body: [
          'We audited every existing component and logged its variants in Linear. One early decision shaped everything: start with typography and colour tokens before touching components, so all visual styles aligned before assembly. Accessibility — contrast, focus states, keyboard navigation — was built into the defaults, and components were tested in Chromatic for cross-browser consistency.',
        ],
        figure: { src: lighthouse3, caption: 'Colour tokens — accessible by default, consistent across surfaces.', wide: true },
      },
      {
        heading: 'A living system',
        body: ['Lighthouse needed to be more than a UI kit — a living system that reflected the brand, empowered developers with Storybook-ready components, scaled with the product, and reduced decision fatigue so designers could focus on user problems instead of button radii.'],
        figure: { src: lighthouse4, caption: 'Component library — production-accurate, documented for self-serve.', wide: true },
      },
      {
        heading: 'Where we landed',
        body: ['Lighthouse became Vizible’s design backbone — and is now baked into every new feature release.'],
        figure: { src: lighthouse5, caption: 'Components in context — states, variants, and interactions documented.', wide: true },
      },
    ],
    outcomes: [
      { value: '50+', label: 'reusable components' },
      { value: '50%', label: 'faster design-to-dev turnaround' },
      { value: '1', label: 'shared language for design & eng' },
    ],
  },

  tabulerasa: {
    tagline:
      'Redesigning legal workflows for speed and clarity — a modular brief builder and collaboration space for legal teams.',
    deliverables: ['Lawyer & client dashboards', 'Brief builder', 'Marketplace'],
    overview:
      'The legal-tech space is notoriously complex, and the early version of Tabulerasa showed growing pains: slow, repetitive brief creation; scattered communication; limited visibility into document status; and inflexible systems that didn’t adapt to different practice areas. The redesign centred on one goal — make legal work faster, more collaborative, and easier to manage from a central platform.',
    sections: [
      {
        heading: 'Research & insights',
        body: [
          'I ran interviews and stakeholder sessions with lawyers from pilot firms. The product had to work for solo practitioners and large legal teams alike, so flexibility and clarity were top priorities throughout.',
        ],
        list: [
          'Slow, repetitive brief-creation workflows.',
          'Scattered communication between teams and clients.',
          'Limited visibility into ongoing document status.',
          'Inflexible systems that didn’t adapt across practice areas.',
        ],
        figure: { src: tabulera2, caption: 'Flow mapping — every interaction from onboarding to handoff.', wide: true },
      },
      {
        heading: 'Design & prototyping',
        body: ['Working with product and engineering, I led the UX/UI in Figma and redesigned three core surfaces:'],
        list: [
          'The Brief Builder — a modular system to create, duplicate, and send forms to clients.',
          'The Messaging & Collaboration space — a shared lawyer/client timeline for updates and documents.',
          'Team & Workspace management — organise matters, assign members, and view progress at a glance.',
        ],
        figure: { src: tabulera3, caption: 'Client feed — structured, guided collaboration.', wide: true },
      },
      {
        heading: 'Testing & outcome',
        body: [
          'We tested with internal teams and pilot-firm lawyers in continuous feedback loops, iterating to address both legal and technical needs. The result lets legal teams focus less on repetitive admin and more on high-value work — while giving clients a clearer, more professional experience.',
        ],
        figure: { src: tabulera4, caption: 'Lawyer feed — visibility across matters and team.', wide: true },
      },
    ],
    outcomes: [
      { value: '30+', label: 'lawyer interviews' },
      { value: '10%', label: 'drafting-time reduction' },
      { value: 'Solo → firm', label: 'one system, every tier' },
    ],
  },

  // NOTE: Westgate content is a first draft — verify specifics (funnel
  // numbers, exact scope, timeline) against your own record before ship.
  westgate: {
    tagline:
      'An electronics retailer with real demand but a leaky checkout — rebuilt around a faster, clearer path from product to purchase.',
    deliverables: ['UX audit', 'Storefront & product-page redesign', 'Checkout flow'],
    overview:
      'Westgate Technologies had products people wanted and traffic to match — but too many shoppers dropped out between the product page and a completed order. The redesign focused on one thing: reduce the friction and uncertainty on the path to buy, so intent turns into purchases.',
    sections: [
      {
        heading: 'Where the funnel leaked',
        body: [
          'The store wasn’t short on interest; it was short on follow-through. Carts filled and stalled. Mapping the journey from landing to confirmation surfaced the usual, costly culprits — unclear pricing and shipping, a long multi-step checkout, and too little reassurance at the exact moments a buyer hesitates.',
        ],
        list: [
          'Total cost (shipping, fees) surfaced late — a classic abandonment trigger.',
          'Checkout asked for too much, too early, with no guest path.',
          'Thin trust cues at the point of payment.',
        ],
      },
      {
        heading: 'A clearer path to buy',
        body: [
          'The redesign tightened the whole path from product to purchase: cleaner product pages that answer the buying questions up front, transparent pricing before checkout, a condensed flow with a guest option, and trust cues placed where doubt actually shows up. Fewer steps, fewer surprises, more completed orders.',
        ],
      },
      {
        heading: 'What moved',
        body: [
          'The clearer, shorter path paid off where it counts — a 25% lift in completed checkouts, with the biggest gains on the steps that used to leak most.',
        ],
      },
    ],
    outcomes: [
      { value: '+25%', label: 'completed checkouts' },
      { value: 'Guest', label: 'checkout, fewer steps' },
      { value: 'Upfront', label: 'pricing & trust cues' },
    ],
  },

  // The meta case study — linked from the footer credit. In the works;
  // grows as the site does.
  'building-this-portfolio': {
    tagline:
      'The site you’re reading this on — designed and built by one person, on its own design system, with an AI pair-programmer in the loop.',
    deliverables: ['Optimus design system', 'The site itself', 'This write-up'],
    overview:
      'A portfolio for a design engineer has one honest test: was it designed AND built by the person it’s about? This one was. v3 replaced a dark Framer build with a light, editorial one-pager written in React — and because the positioning is “designer who ships”, the process had to be the proof: a real token system, real components in Storybook, and every effect hand-built rather than embedded.',
    sections: [
      {
        heading: 'Optimus — a design system for one',
        body: [
          'The site doesn’t use a UI kit. It runs on Optimus — a personal design system with the same three-layer token architecture (primitive → semantic → component) I use on client systems, under an --opt-* namespace. Six laws govern everything: sharp edges, light and dark in sync, glass surfaces, motion as the experience, and pages assembled from blocks. Recoleta carries the display voice; Switzer does the work.',
        ],
        list: [
          'Tokens and atoms built first, in Storybook — pages assembled only after.',
          'Both themes designed together; no dark-mode afterthought.',
          'Every block reads from data.ts — one source of truth for content.',
        ],
      },
      {
        heading: 'Feedback as annotations, not meetings',
        body: [
          'Each design round happens on the live site: an annotation toolbar (Agentation) pins feedback to real elements, and each pass — the nav island, the scatter-to-bento work grid, the cursor, the hero — is a batch of annotations turned into commits. The site is the design file.',
        ],
      },
      {
        heading: 'An AI pair in the loop',
        body: [
          '“Built with Claude Code” is literal: the build runs as a conversation — briefs and annotated feedback in, reviewed diffs out, verified live on localhost before anything lands. The taste stays human; the throughput doesn’t have to. It’s the same design-engineering loop I run at work, compressed to one person.',
        ],
      },
      {
        heading: 'The details templates can’t ship',
        body: [
          'The footer wordmark is a hand-written WebGL shader — liquid-chrome bands with RGB-split fringes, masked to live text. Essays are pre-fetched from Substack and read in-app. NDA’d client work sits behind a password gate. A scripted chat widget answers the front-door questions. None of it is a plugin; all of it is a decision.',
        ],
      },
    ],
    outcomes: [
      { value: '1 system', label: 'Optimus — tokens to blocks' },
      { value: '100%', label: 'designed & built solo' },
      { value: 'Living', label: 'this study grows with the site' },
    ],
  },
}

/** Returns the next case study in the list (wraps around). */
export function nextCaseStudy(slug: string): CaseStudy {
  const i = caseStudies.findIndex((c) => c.slug === slug)
  return caseStudies[(i + 1) % caseStudies.length]
}
