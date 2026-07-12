// ============================================================
// NDA gate — one shared password for the fenced case studies
// (Inkwell, Property Panel), asked for inline on the detail page
// (round F: modal dropped). The unlock EXPIRES after 3.5 minutes
// (round F #10) — after that the gate resets and asks again.
// Password note also lives in the vault (Portfolio.md).
// ============================================================
export const NDA_PASSWORD = 'pool-ocean-1'

/** How long an unlock lasts before the gate re-arms (round G: 90s). */
export const NDA_UNLOCK_TTL_MS = 90_000

const UNLOCK_KEY = 'nda-unlocked-at'

export const isNdaUnlocked = () => {
  const at = Number(sessionStorage.getItem(UNLOCK_KEY) ?? 0)
  return at > 0 && Date.now() - at < NDA_UNLOCK_TTL_MS
}

export const unlockNda = () => sessionStorage.setItem(UNLOCK_KEY, String(Date.now()))

export const checkNdaPassword = (value: string) => value.trim() === NDA_PASSWORD

/* The fun front-door copy — keep the tone playful, not corporate. */
export const NDA_HINT = 'psst… no password? Text me — I hand out keys.'
export const NDA_ERROR = 'Close, but the vault stays shut. Try again — or just ask me.'
