/* PostHog analytics — production channel only, and only when a key
   is configured, so dev sessions and staging previews never pollute
   the numbers. Cookieless (memory persistence): no consent banner
   needed. The library is dynamically imported on first pageview so
   it never touches the main bundle.

   The default key is the project's publishable client key (it ships
   in the bundle by design); VITE_POSTHOG_KEY overrides it, and
   VITE_POSTHOG_HOST overrides the US cloud host. */
import { isProduction } from './release'

const KEY =
  (import.meta.env.VITE_POSTHOG_KEY as string | undefined) ??
  'phc_wCNLrFmsSfdRGp2hFwwgGSX5m6hvAsL5Ldnq5V7cb6tV'
const HOST = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ?? 'https://us.i.posthog.com'

/* Owner opt-out — visit once with ?ph_optout=1 to permanently exclude
   this browser from analytics (?ph_optout=0 re-includes it). Survives
   IP changes, which an IP filter can't (Private Relay/WARP rotate). */
const OPTOUT_KEY = 'ph_optout'
function ownerOptedOut(): boolean {
  try {
    const param = new URLSearchParams(window.location.search).get(OPTOUT_KEY)
    if (param === '1') localStorage.setItem(OPTOUT_KEY, '1')
    if (param === '0') localStorage.removeItem(OPTOUT_KEY)
    return localStorage.getItem(OPTOUT_KEY) === '1'
  } catch {
    return false
  }
}

export const analyticsEnabled = Boolean(KEY) && isProduction && !ownerOptedOut()

type PostHog = typeof import('posthog-js').default
let phPromise: Promise<PostHog> | null = null

function load(): Promise<PostHog> {
  return (phPromise ??= import('posthog-js').then(({ default: ph }) => {
    ph.init(KEY!, {
      api_host: HOST,
      persistence: 'memory', // cookieless
      capture_pageview: false, // SPA — we send route-aware pageviews below
      capture_pageleave: true, // powers bounce rate + session duration
      autocapture: true, // every click, retroactively queryable
    })
    return ph
  }))
}

/** Route-aware pageview — call on every location change. */
export function trackPageview() {
  if (!analyticsEnabled) return
  load().then((ph) => ph.capture('$pageview'))
}
