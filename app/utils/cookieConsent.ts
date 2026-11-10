export const CONSENT_KEY = 'elinea:cookie-consent'
export const CONSENT_VERSION = 1
export const CONSENT_DURATION = 180 * 24 * 60 * 60 * 1000

export type CookieChoices = { analytics: boolean, marketing: boolean }
export type CookieConsent = CookieChoices & {
  version: number
  necessary: true
  updatedAt: number
  expiresAt: number
}

export function createCookieConsent(choices: CookieChoices, now = Date.now()): CookieConsent {
  return { version: CONSENT_VERSION, necessary: true, analytics: choices.analytics === true,
    marketing: choices.marketing === true, updatedAt: now, expiresAt: now + CONSENT_DURATION }
}

export function parseCookieConsent(raw: string | null, now = Date.now()): CookieConsent | null {
  if (!raw) return null
  try {
    const value = JSON.parse(raw)
    if (!value || value.version !== CONSENT_VERSION || value.necessary !== true
      || typeof value.analytics !== 'boolean' || typeof value.marketing !== 'boolean'
      || !Number.isFinite(value.updatedAt) || !Number.isFinite(value.expiresAt)
      || value.updatedAt > now || value.expiresAt <= now
      || value.expiresAt - value.updatedAt !== CONSENT_DURATION) return null
    // Recreate the record instead of retaining arbitrary properties from storage.
    return createCookieConsent(value, value.updatedAt)
  } catch { return null }
}
