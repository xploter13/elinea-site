import document from '~/assets/legal/terms-1.1.md?raw'

export const TERMS_VERSION = '1.1'
export const TERMS_SHA256 = 'b6c5e432e879bfb0e6fd895cab787b7bcf24258fb46e636b2b1bee3b4f993fd3'
export const TERMS_CONTENT = document.replace(/\r\n?/g, '\n').trim() + '\n'

export const termsAcceptancePayload = (accepted: boolean, document: { version: string, sha256: string }) => ({
  terms_accepted: accepted,
  terms_version: document.version,
  terms_sha256: document.sha256,
})
