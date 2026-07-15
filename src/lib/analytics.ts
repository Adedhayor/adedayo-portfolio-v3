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

export const analyticsEnabled = Boolean(KEY) && isProduction

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
