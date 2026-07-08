// ============================================================
// Tool logos — real brand marks from Simple Icons (BRIEF §4.3).
// Rendered monochrome (currentColor); each carries its brand hex
// for an accent-on-hover. Paper has no Simple Icon → text-only chip.
// ============================================================
import {
  siFigma,
  siClaudecode,
  siObsidian,
  siNotion,
  siStorybook,
  siLinear,
  siFramer,
} from 'simple-icons'

export type ToolLogo = { name: string; path: string | null; hex?: string }

const mark = (name: string, icon: { path: string; hex: string }): ToolLogo => ({
  name,
  path: icon.path,
  hex: `#${icon.hex}`,
})

// Design/PM tools only. Paper has no Simple Icon (see app.paper.design) → text chip.
export const TOOL_LOGOS: ToolLogo[] = [
  mark('Figma', siFigma),
  { name: 'Paper', path: null },
  mark('Claude Code', siClaudecode),
  mark('Obsidian', siObsidian),
  mark('Notion', siNotion),
  mark('Storybook', siStorybook),
  mark('Linear', siLinear),
  mark('Framer', siFramer),
]
