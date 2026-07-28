// ============================================================
// screenMeta — caption metadata for the Lightbox, derived from
// the site's single source of truth (src/data.ts). ScreenContent
// carries only id/title/media; the human-readable kicker (tag ·
// year) and blurb live on the source records. We match a screen
// back to its record by TITLE (screens copy the source title
// verbatim), so no slug convention is re-implemented here.
//
// "Where derivable" per the plan: screens with no source record
// (Effects Studio, the Rive prototype) simply get no kicker/blurb
// and the Lightbox falls back to the title alone.
// ============================================================
import { labs, moreWork, caseStudies } from '@/data'

export type ScreenMeta = { kicker?: string; blurb?: string }

const byTitle = new Map<string, ScreenMeta>()
for (const w of moreWork) byTitle.set(w.title, { kicker: `${w.tag} · ${w.year}`, blurb: w.note })
for (const cs of caseStudies) byTitle.set(cs.title, { kicker: `${cs.tag} · ${cs.year}`, blurb: cs.blurb })
for (const l of labs) byTitle.set(l.title, { kicker: `${l.tag} · ${l.year}`, blurb: l.blurb })

/** Kicker + blurb for a screen title, or `{}` when nothing is derivable. */
export function screenMeta(title: string): ScreenMeta {
  return byTitle.get(title) ?? {}
}
