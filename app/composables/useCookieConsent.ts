import { CONSENT_KEY, createCookieConsent, parseCookieConsent, type CookieChoices, type CookieConsent } from '~/utils/cookieConsent'

export const useCookieConsent = () => {
  const consent = useState<CookieConsent | null>('cookie-consent', () => null)
  const ready = useState('cookie-consent-ready', () => false)
  const preferencesOpen = useState('cookie-preferences-open', () => false)
  const storageError = useState('cookie-storage-error', () => false)

  function restore() {
    if (!import.meta.client) return
    try {
      consent.value = parseCookieConsent(localStorage.getItem(CONSENT_KEY))
      storageError.value = false
    } catch {
      consent.value = null
      storageError.value = true
    }
    ready.value = true
  }

  function save(choices: CookieChoices) {
    if (!import.meta.client) return
    consent.value = createCookieConsent(choices)
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(consent.value))
      storageError.value = false
    } catch { storageError.value = true }
    preferencesOpen.value = false
  }

  function isAllowed(category: keyof CookieChoices) {
    const current = consent.value
    return ready.value && !!current && !!parseCookieConsent(JSON.stringify(current)) && current[category]
  }

  return { consent: readonly(consent), ready: readonly(ready), preferencesOpen,
    storageError: readonly(storageError), restore, save, isAllowed,
    openPreferences: () => { preferencesOpen.value = true },
    rejectOptional: () => save({ analytics: false, marketing: false }),
    acceptAll: () => save({ analytics: true, marketing: true }) }
}
