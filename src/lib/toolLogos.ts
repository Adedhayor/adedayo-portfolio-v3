// ============================================================
// Tool logos — real brand marks from Simple Icons (BRIEF §4.3).
// Rendered monochrome (currentColor); each carries its brand hex
// for an accent-on-hover. Paper has no Simple Icon → text-only chip.
// ============================================================
import {
  siFigma,
  siClaude,
  siClaudecode,
  siObsidian,
  siNotion,
  siStorybook,
  siLinear,
  siReact,
  siTypescript,
  siTailwindcss,
  siGreensock,
  siFramer,
} from 'simple-icons'

export type ToolLogo = { name: string; path: string | null; hex?: string }

const mark = (name: string, icon: { path: string; hex: string }): ToolLogo => ({
  name,
  path: icon.path,
  hex: `#${icon.hex}`,
})

export const TOOL_LOGOS: ToolLogo[] = [
  mark('Figma', siFigma),
  { name: 'Paper', path: null }, // no Simple Icon — text chip
  mark('Claude', siClaude),
  mark('Claude Code', siClaudecode),
  mark('Obsidian', siObsidian),
  mark('Notion', siNotion),
  mark('Storybook', siStorybook),
  mark('Linear', siLinear),
  mark('React', siReact),
  mark('TypeScript', siTypescript),
  mark('Tailwind', siTailwindcss),
  mark('GSAP', siGreensock),
  mark('Framer Motion', siFramer),
]
