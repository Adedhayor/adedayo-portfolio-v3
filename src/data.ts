// ============================================================
// Content — single source of truth for the portfolio
// ============================================================

// Real product shots, pulled from prior work (Vite resolves these to URLs)
import lithiumCover from './assets/work/lithium-cover.png'
import lithium2 from './assets/work/lithium-2.png'
import lithium3 from './assets/work/lithium-3.png'
import lithium4 from './assets/work/lithium-4.png'
import zilliqaCover from './assets/work/zilliqa-cover.png'
import zilliqa2 from './assets/work/zilliqa-2.png'
import zilliqa3 from './assets/work/zilliqa-3.png'
import lighthouseCover from './assets/work/lighthouse-cover.png'
import lighthouse2 from './assets/work/lighthouse-2.png'
import lighthouse3 from './assets/work/lighthouse-3.png'
import lighthouse4 from './assets/work/lighthouse-4.png'
import lighthouse5 from './assets/work/lighthouse-5.png'
import tabuleraCover from './assets/work/tabulera-cover.png'
import tabulera2 from './assets/work/tabulera-2.png'
import tabulera3 from './assets/work/tabulera-3.png'
import tabulera4 from './assets/work/tabulera-4.png'
import portrait from './assets/hero.png'

export const profile = {
  name: 'Babalola Adedayo',
  fullName: 'Emmanuel Adedayo Babalola',
  shortName: 'Adedayo',
  role: 'Design Engineer',
  secondaryRole: 'Product Designer',
  location: 'Lagos, Nigeria',
  timezone: 'WAT',
  email: 'dayo@replikit.ai',
  calendly: 'https://calendly.com/adedayobabalola/30min',
  linkedin: 'https://www.linkedin.com/in/emmanuel-adedayo-babalola/',
  instagram: 'https://instagram.com/__dedayo',
  instagramPhotography: 'https://www.instagram.com/optimus.randoms/',
  twitter: 'https://x.com/__dedayo',
  substack: 'https://dedayo.substack.com/',
  resumeUrl: '#', // TODO: host résumé PDF

  // Hero — calm, values-first (no metric-shouting)
  intro:
    'I’m a design engineer — I turn complex, technical systems into experiences that feel simple, human, and trustworthy, then build and ship them in code. I care about clarity, craft, and the small details that make software feel right.',
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
}

// The 4 deep case studies — lead with Lithium + Lighthouse DS
export const caseStudies: CaseStudy[] = [
  {
    slug: 'lithium-staking',
    index: '01',
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
    slug: 'tabulera',
    index: '04',
    title: 'Tabulera — legal workflow redesign',
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
]

// ============================================================
// Hero scatter — images floating around the hero that scroll
// into their bento-grid slots (BRIEF §4.1). Items with a slug
// land in the matching work-grid cell; the rest are decorative
// and drift away on scroll.
// ============================================================
export type ScatterItem = {
  id: string
  slug?: string
  src: string
  top: string
  left: string
  w: number
  rotate: number
}
export const heroScatter: ScatterItem[] = [
  { id: 'sc-lithium', slug: 'lithium-staking', src: lithiumCover, top: '13%', left: '3%', w: 300, rotate: -7 },
  { id: 'sc-lighthouse', slug: 'lighthouse-ds', src: lighthouseCover, top: '9%', left: '73%', w: 270, rotate: 6 },
  { id: 'sc-zilliqa', slug: 'zilliqa-migration', src: zilliqaCover, top: '63%', left: '76%', w: 250, rotate: -5 },
  { id: 'sc-tabulera', slug: 'tabulera', src: tabuleraCover, top: '66%', left: '5%', w: 260, rotate: 8 },
  { id: 'sc-x1', src: lithium3, top: '40%', left: '-1%', w: 170, rotate: -12 },
  { id: 'sc-x2', src: lighthouse4, top: '42%', left: '87%', w: 170, rotate: 11 },
]

// Lighter "more work" row
export const moreWork = [
  { title: 'Westgate Technologies', tag: 'eCommerce', year: '2026', note: '25% lift in completed checkouts' },
  { title: 'eMonie', tag: 'Fintech web', year: '2025', note: '40% engagement increase' },
  { title: 'eBank Group', tag: 'Fintech web', year: '2025', note: 'Modular web system' },
  { title: 'Nukodes', tag: 'Bookkeeping', year: '2026', note: 'Coming soon' },
  { title: 'PostPaddy', tag: 'Social', year: '2022', note: '2K+ active users' },
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
  stack: [
    'Figma',
    'Paper',
    'Claude',
    'Claude Code',
    'Obsidian',
    'Notion',
    'Storybook',
    'Linear',
    'React / TypeScript',
    'Tailwind',
    'GSAP',
    'Framer Motion',
  ],
}

export const workHistory = [
  { period: '2026 — Present', company: 'RepliHaus', role: 'UX Designer — RepliKit & Inkwell DS' },
  { period: '2023 — 2025', company: 'Lithium Digital', role: 'Lead UX/UI Designer' },
  { period: '2024 — 2025', company: 'Vizible Labs', role: 'Product Designer (Design Systems)' },
  { period: '2022 — 2023', company: 'Tabulerasa Inc.', role: 'Product Designer' },
  { period: '2021 — 2022', company: 'Digital Figures Solutions', role: 'Designer' },
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

// Writing — personal essays from Substack (dedayo.substack.com)
export const substackUrl = 'https://dedayo.substack.com/'
export const writing = [
  {
    title: 'Channeling Your Inner Child: Chasing Your Dreams',
    date: 'May 27, 2026',
    readTime: '7 min',
    url: 'https://dedayo.substack.com/p/channeling-your-inner-child-chasing',
    excerpt:
      'Childhood dreams don’t expire — we just get tired of defending them. On taking up swimming, running and cooking as an adult, and why it’s never too late.',
    quote: 'We don’t give up on our dreams because we forget them. We give up because we get tired of defending them.',
  },
  {
    title: 'For my 27th, I write to my Mum.',
    date: 'Mar 28, 2026',
    readTime: '9 min',
    url: 'https://dedayo.substack.com/p/for-my-27th-i-write-to-my-mum',
    excerpt:
      'A birthday letter to my late mother, Aderonke — childhood memories, and how she prepared me for a life she knew she might not see.',
    quote: 'Maybe you knew you wouldn’t always be here… so you did everything you could while you were here.',
  },
  {
    title: 'You can just do things. I did.',
    date: 'Jan 1, 2026',
    readTime: '5 min',
    url: 'https://dedayo.substack.com/p/you-can-just-do-things-i-did',
    excerpt:
      '2025 as a year of intentional movement — 174km run, learning to swim, getting my licence, quitting my job — and doing fewer, better-aligned things in 2026.',
    quote: 'Movement creates clarity, not the other way around.',
  },
] as const

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

  tabulera: {
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
}

/** Returns the next case study in the list (wraps around). */
export function nextCaseStudy(slug: string): CaseStudy {
  const i = caseStudies.findIndex((c) => c.slug === slug)
  return caseStudies[(i + 1) % caseStudies.length]
}
