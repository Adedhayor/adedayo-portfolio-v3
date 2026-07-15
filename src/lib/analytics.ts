/* PostHog analytics — production channel only, and only when a key
   is configured, so dev sessions and staging previews never pollute
   the numbers. Cookieless (memory persistence): no consent banner
   needed. The library is dynamically imported on first pageview so
   it never touches the main bundle.

   Setup: set VITE_POSTHOG_KEY (and VITE_POSTHOG_HOST for the EU
   cloud) in the Cloudflare Pages project's production environment
   variables. No key -> everything here is a no-op. */
import { isProduction } from './release'

const KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined
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
