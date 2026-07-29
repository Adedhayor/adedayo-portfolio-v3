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

/** Phase-2 location model — one OUTSIDE world plus three enterable
    building interiors. Replaces the retired zone-focus navigation:
    outside IS one place; buildings are entered, not focused. */
export type PlaceId = 'gallery' | 'workspace' | 'lab'
export type PlayLocation = 'outside' | PlaceId

export type HotspotAction =
  | { kind: 'route'; to: string } // react-router navigate
  | { kind: 'external'; href: string } // new tab (e.g. Effects Studio)
  | { kind: 'panel'; panelId: string } // open a DOM overlay panel
  | { kind: 'enter'; placeId: PlaceId } // door → veil → interior
  | { kind: 'exit' } // interior EXIT → veil → outside
  | { kind: 'lightbox'; screenId: string } // open the viewer modal (W5 owns the UI)

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

/** Clamped look-around inside a room — absolute CameraControls angles
    (radians) + dolly range. Tight ranges = turn your head, don't walk. */
export type InteriorOrbit = {
  minAzimuth: number
  maxAzimuth: number
  minPolar: number
  maxPolar: number
  minDistance: number
  maxDistance: number
}

/** A building: a façade you see OUTSIDE (anchor + door hotspot) and a
    distinct INTERIOR scene you enter (standing camera + clamped orbit +
    exit + screens). W2/W3/W4 flesh out the interiors behind this shape;
    W0 ships placeholder rooms that satisfy it. */
export type Place = {
  id: PlaceId
  title: string
  exterior: {
    /** Façade position in the outside world */
    anchor: [number, number, number]
    /** 'GO INSIDE' marker → { kind: 'enter', placeId } */
    door: Hotspot
  }
  interior: {
    /** Where you stand once inside */
    camera: CameraPose
    /** Clamped look-around */
    orbit: InteriorOrbit
    /** EXIT marker → { kind: 'exit' } */
    exit: Hotspot
    /** Framed/monitor/bench screens — same ScreenContent shape as zones */
    screens: ScreenContent[]
    /** Extra in-room hotspots (e.g. the lab's experiment stations →
        panels). Rendered by the shared Hotspots layer alongside exit. */
    hotspots?: Hotspot[]
  }
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
    case 'route':
    case 'external':
      return 'interaction.confirm'
    case 'panel':
    case 'lightbox':
      return 'overlay.open'
    case 'enter':
      return 'overlay.expand'
    case 'exit':
      return 'overlay.collapse'
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

// ------------------------------------------------------------
// Places — the Phase-2 buildings. Each maps existing zone content
// into an enterable interior. W1 rebuilds the outside façades; W2–W4
// replace the placeholder interiors. The exterior doors + interior
// cameras/orbits/screens are the stable contract they build against.
// ------------------------------------------------------------

/** Shared placeholder framing — the camera stands mid-room looking at
    the back wall; W2–W4 tune per room. Kept in sync with the geometry
    in scene/interiors/PlaceholderRoomShell.tsx. */
const INTERIOR_CAMERA: CameraPose = { position: [0, 1.6, 3.2], target: [0, 1.6, -4] }
const INTERIOR_ORBIT: InteriorOrbit = {
  minAzimuth: -0.55,
  maxAzimuth: 0.55,
  minPolar: 1.2,
  maxPolar: 1.68,
  minDistance: 2.4,
  maxDistance: 4.6,
}
const makeExit = (): Hotspot => ({
  id: 'exit',
  label: 'EXIT',
  kicker: 'Back outside',
  position: [2.6, 1.15, -1.4],
  action: { kind: 'exit' },
})

/** Wall of Arts ← the TV-wall screens, hung as framed pieces. */
const galleryPlace: Place = {
  id: 'gallery',
  title: 'Wall of Arts',
  exterior: {
    anchor: [-8, 0, -1],
    door: {
      id: 'door-gallery',
      label: 'WALL OF ARTS',
      kicker: 'Go inside →',
      position: [-8, 2.6, -1],
      action: { kind: 'enter', placeId: 'gallery' },
    },
  },
  interior: {
    camera: INTERIOR_CAMERA,
    orbit: INTERIOR_ORBIT,
    exit: makeExit(),
    screens: tvWall.screens,
  },
}

/** Workspace ← the desk's case-study covers, the hero monitor to come. */
const workspacePlace: Place = {
  id: 'workspace',
  title: 'Workspace',
  exterior: {
    anchor: [8, 0, -1],
    door: {
      id: 'door-workspace',
      label: 'WORKSPACE',
      kicker: 'Go inside →',
      position: [8, 2.4, -1],
      action: { kind: 'enter', placeId: 'workspace' },
    },
  },
  interior: {
    camera: INTERIOR_CAMERA,
    orbit: INTERIOR_ORBIT,
    exit: makeExit(),
    screens: desk.screens,
  },
}

/** Chemistry Lab ← the Effects Studio screen + the experiment stations.
    The stations keep their v1 panel actions (W4/W5 evolve them into
    lightbox cards); positioned for the placeholder bench. */
const labInteriorHotspots: Hotspot[] = labs.map((experiment, i) => ({
  id: slugify(experiment.title),
  label: experiment.title.toUpperCase(),
  kicker: experiment.tag,
  position: [(i - 1) * 2, 1.0, -2.4],
  action: { kind: 'panel', panelId: slugify(experiment.title) },
}))

const labPlace: Place = {
  id: 'lab',
  title: 'Chemistry Lab',
  exterior: {
    anchor: [0, 0, 0],
    door: {
      id: 'door-lab',
      label: 'CHEMISTRY LAB',
      kicker: 'Go inside →',
      position: [0, 2.4, 0],
      action: { kind: 'enter', placeId: 'lab' },
    },
  },
  interior: {
    camera: INTERIOR_CAMERA,
    orbit: INTERIOR_ORBIT,
    exit: makeExit(),
    screens: lab.screens,
    hotspots: labInteriorHotspots,
  },
}

export const places: Place[] = [galleryPlace, workspacePlace, labPlace]

export function getPlace(id: PlaceId): Place {
  return places.find((p) => p.id === id) ?? places[0]
}

/** Outside wayfinding — mailbox → /notes, signpost → /about, gate → home.
    Kept from v1; the outside stand-in still renders these props. */
export const yardHotspots: Hotspot[] = yard.hotspots

/** Building doors floating over the outside stand-in. W1 rebuilds the
    façades; the enter actions are the stable contract. */
export const doorHotspots: Hotspot[] = places.map((p) => p.exterior.door)

/** Everything clickable while outside. */
export const outsideHotspots: Hotspot[] = [...doorHotspots, ...yardHotspots]

/** Distant scenery billboards — OWNED BY W1 (Outside). Empty seam;
    W1 refines the shape and fills it. */
export type BackdropPanel = {
  id: string
  position: [number, number, number]
  size: [number, number]
  kind?: string
}
export const backdropPanels: BackdropPanel[] = []

/** Hotspots visible at a location — doors + yard outside, exit (+ any
    in-room hotspots) inside. Drives the Hotspots layer and sr-only nav. */
export function hotspotsForLocation(location: PlayLocation): Hotspot[] {
  if (location === 'outside') return outsideHotspots
  const place = getPlace(location)
  return [place.interior.exit, ...(place.interior.hotspots ?? [])]
}

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
