// ============================================================
// Playground world data — THE SHARED CONTRACT for /play.
// Four zones (lab, tv-wall, desk, yard) the camera flies
// between; screens play demo loops as video textures; hotspots
// drive focus / routes / panels. Content is derived from
// src/data.ts (labs, moreWork, caseStudies) so the world never
// drifts from the rest of the site.
//
// Post-foundation, type changes here go through an integration
// PR — parallel workstreams only ADD entries/fields they own
// (media stream: video/poster values; art stream: nothing here).
// ============================================================
import type { SoundRole } from '@/lib/sensory-ui'
import { labs, moreWork, caseStudies } from '@/data'

export type ZoneId = 'lab' | 'tv-wall' | 'desk' | 'yard'

export type HotspotAction =
  | { kind: 'focus'; zoneId: ZoneId } // fly the camera into a zone
  | { kind: 'route'; to: string } // react-router navigate
  | { kind: 'external'; href: string } // new tab (e.g. Effects Studio)
  | { kind: 'panel'; panelId: string } // open a DOM overlay panel

export type ScreenContent = {
  /** Matches the media filename: /play-media/<id>.mp4 + <id>.poster.jpg */
  id: string
  title: string
  /** Absolute public path; undefined = poster-only (video not dropped yet) */
  video?: string
  /** Poster image — public path or bundled-asset URL. Optional until real
      posters are generated; screens without one render a placeholder plane. */
  poster?: string
  /** Plane aspect, default [16, 10] */
  aspect?: [number, number]
  /** Click-through on the screen itself */
  action?: HotspotAction
  /** Interactive-scenery workstream: renders via RiveScreen instead of
      VideoScreen when present. `hoverInput`/`clickInput` name specific
      state-machine inputs; omit to auto-detect by name ("hover", "click"). */
  rive?: { src: string; stateMachine?: string; hoverInput?: string; clickInput?: string }
}

export type Hotspot = {
  id: string
  /** Pulsing label text ("LAB", "TV WALL", …) */
  label: string
  kicker?: string
  position: [number, number, number]
  action: HotspotAction
  /** Override; defaults come from soundForAction() */
  sound?: SoundRole
}

export type PlayPanel = {
  heading: string
  kicker?: string
  body: string
  links?: { label: string; action: HotspotAction }[]
}

export type CameraPose = {
  position: [number, number, number]
  target: [number, number, number]
}

export type Zone = {
  id: ZoneId
  title: string
  /** Where the camera settles when this zone is focused */
  camera: CameraPose
  screens: ScreenContent[]
  /** Hotspots visible while focused in this zone */
  hotspots: Hotspot[]
}

/** Base URL for transcoded demo media. Escape hatch: point at an R2
    bucket by changing this one constant. */
export const PLAY_MEDIA_BASE = '/play-media'

/** Transcoded demo loops by screen id — OWNED BY THE MEDIA WORKSTREAM (C).
    A screen id listed here gets a live video texture; everything else
    stays on its poster. `lighthouse-ds-mobile.mp4` also exists in
    public/play-media (portrait Vizible notifications clip) — unwired
    until the world set grows a phone prop to play it on. */
const VIDEO_BY_ID: Record<string, string> = {
  emonie: `${PLAY_MEDIA_BASE}/emonie.mp4`,
  'ebank-group': `${PLAY_MEDIA_BASE}/ebank-group.mp4`,
  'lighthouse-ds': `${PLAY_MEDIA_BASE}/lighthouse-ds.mp4`,
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

/** Default sound role per action kind — single mapping shared by the
    interaction rig and HUD so the world sounds consistent. */
export function soundForAction(action: HotspotAction): SoundRole {
  switch (action.kind) {
    case 'focus':
      return 'navigation.forward'
    case 'route':
    case 'external':
      return 'interaction.confirm'
    case 'panel':
      return 'overlay.open'
  }
}

// ------------------------------------------------------------
// Cameras — dusk diorama viewed from a gentle crane height.
// The intro ends on overviewCamera, framed toward the Lab.
// ------------------------------------------------------------
export const overviewCamera: CameraPose = {
  position: [0, 5.5, 14],
  target: [0, 1, 0],
}

// ------------------------------------------------------------
// Zones
// ------------------------------------------------------------

/** Lab — the star. Three experiment plinths + the Effects Studio screen. */
const lab: Zone = {
  id: 'lab',
  title: 'The Lab',
  camera: { position: [0, 2.2, 6], target: [0, 1.2, 0] },
  screens: [
    {
      id: 'effects-studio',
      title: 'Effects Studio',
      video: VIDEO_BY_ID['effects-studio'],
      aspect: [16, 10],
      action: { kind: 'external', href: 'https://effects-studio-zeta.vercel.app' },
    },
  ],
  hotspots: labs.map((experiment, i) => ({
    id: slugify(experiment.title),
    label: experiment.title.toUpperCase(),
    kicker: experiment.tag,
    // Plinths line up in front of the Effects Studio screen
    position: [(i - 1) * 2, 1.4, 1.5],
    action: { kind: 'panel', panelId: slugify(experiment.title) },
  })),
}

/** TV wall — stacked CRTs looping the moreWork demo recordings. */
const tvWall: Zone = {
  id: 'tv-wall',
  title: 'The TV Wall',
  camera: { position: [-5.5, 2, 4], target: [-8, 1.6, -1] },
  screens: [
    ...moreWork.map((item) => ({
      id: slugify(item.title),
      title: item.title,
      video: VIDEO_BY_ID[slugify(item.title)],
      poster: item.cover,
      aspect: [16, 10] as [number, number],
      ...(item.url ? { action: { kind: 'external', href: item.url } as HotspotAction } : {}),
    })),
    // Side projects from GitHub — not deployed yet (owner, 2026-07-24);
    // covers/videos land later. spotifeed stays unlinked while private.
    // Prototyping interactive scenery here in the meantime — swap
    // `rive.src` for real artwork once designed in the Rive editor.
    {
      id: 'spotifeed',
      title: 'Spotifeed',
      aspect: [16, 10] as [number, number],
      rive: { src: `${PLAY_MEDIA_BASE}/rive/vehicles.riv` },
    },
    {
      id: 'family-tree',
      title: 'Family Tree',
      aspect: [16, 10] as [number, number],
      action: { kind: 'external', href: 'https://github.com/Adedhayor/family-tree' } as HotspotAction,
    },
  ],
  hotspots: [],
}

/** Desk — monitor + shelf of case-study covers, each into its study. */
const desk: Zone = {
  id: 'desk',
  title: 'The Desk',
  camera: { position: [5.5, 2, 3.5], target: [8, 1.2, -1] },
  screens: caseStudies.map((cs) => ({
    id: slugify(cs.slug),
    title: cs.title,
    video: VIDEO_BY_ID[slugify(cs.slug)],
    poster: cs.cover,
    aspect: [16, 10] as [number, number],
    action: { kind: 'route', to: `/case-study/${cs.slug}` } as HotspotAction,
  })),
  hotspots: [],
}

/** Yard — wayfinding props out to the rest of the site. */
const yard: Zone = {
  id: 'yard',
  title: 'The Yard',
  camera: { position: [0, 2.5, -3], target: [0, 1.2, -9] },
  screens: [],
  hotspots: [
    {
      id: 'notes-mailbox',
      label: 'NOTES',
      kicker: 'Mailbox',
      position: [-2, 1.2, -9],
      action: { kind: 'route', to: '/notes' },
    },
    {
      id: 'about-sign',
      label: 'ABOUT',
      kicker: 'Signpost',
      position: [0, 1.6, -10],
      action: { kind: 'route', to: '/about' },
    },
    {
      id: 'home-gate',
      label: 'LEAVE THE YARD',
      kicker: 'Home',
      position: [2, 1.2, -9],
      action: { kind: 'route', to: '/' },
    },
  ],
}

export const zones: Zone[] = [lab, tvWall, desk, yard]

export function getZone(id: ZoneId): Zone {
  return zones.find((z) => z.id === id) ?? zones[0]
}

/** Hotspots shown from the overview — one per zone, at its doorstep. */
export const overviewHotspots: Hotspot[] = [
  { id: 'to-lab', label: 'THE LAB', kicker: 'Experiments', position: [0, 2.4, 0], action: { kind: 'focus', zoneId: 'lab' } },
  { id: 'to-tv-wall', label: 'TV WALL', kicker: 'Projects', position: [-8, 3, -1], action: { kind: 'focus', zoneId: 'tv-wall' } },
  { id: 'to-desk', label: 'THE DESK', kicker: 'Case studies', position: [8, 2.6, -1], action: { kind: 'focus', zoneId: 'desk' } },
  { id: 'to-yard', label: 'THE YARD', kicker: 'Elsewhere', position: [0, 2.2, -9], action: { kind: 'focus', zoneId: 'yard' } },
]

// ------------------------------------------------------------
// Panels — DOM overlay content, keyed by panelId.
// ------------------------------------------------------------

/** Where each experiment panel points onward. */
const PANEL_LINKS: Record<string, PlayPanel['links']> = {
  'sound-study': [
    // The synthesized sound system powering this world was built there.
    { label: 'Effects Studio', action: { kind: 'external', href: 'https://effects-studio-zeta.vercel.app' } },
  ],
  'staking-motion': [
    { label: 'Lithium case study', action: { kind: 'route', to: '/case-study/lithium-staking' } },
  ],
}

export const panels: Record<string, PlayPanel> = Object.fromEntries(
  labs.map((experiment) => [
    slugify(experiment.title),
    {
      heading: experiment.title,
      kicker: `${experiment.tag} · ${experiment.year}`,
      body: experiment.blurb,
      links: PANEL_LINKS[slugify(experiment.title)],
    } satisfies PlayPanel,
  ]),
)
