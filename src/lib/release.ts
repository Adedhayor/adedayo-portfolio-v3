/* Release channel — pages still cooking stay visible on staging
   (and local dev) but are held back from production. The channel is
   stamped at build time in vite.config.ts from CF_PAGES_BRANCH:
   Cloudflare builds of `main` are 'production', everything else is
   'staging'. To release a page, remove it from the lists below. */

export const isProduction = import.meta.env.VITE_RELEASE_CHANNEL === 'production'

/** Case-study slugs held back from production. */
const STAGED_CASE_STUDIES = new Set(['property-panel'])

/** True when a case study should be hidden on this build. */
export function isHeldBack(slug: string): boolean {
  return isProduction && STAGED_CASE_STUDIES.has(slug)
}

/** The Playground is public in production and staging. */
export const showPlayground = true

/** Wordmark effect shuffle — released 2026-07-25 alongside Effects
    Studio going live; on in production and staging alike. */
export const showWordmarkShuffle = true
