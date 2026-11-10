const { test } = require('node:test')
const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { resolve } = require('node:path')
const ts = require('typescript')
const code = ts.transpileModule(readFileSync(resolve(__dirname, '../app/utils/cookieConsent.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText
const compiled = { exports: {} }
new Function('module', 'exports', code)(compiled, compiled.exports)
const { createCookieConsent, parseCookieConsent, CONSENT_DURATION } = compiled.exports
const now = Date.UTC(2026, 10, 10)

test('retains a refusal and granular choices without collecting personal data', () => {
  for (const choices of [{ analytics: false, marketing: false }, { analytics: true, marketing: false }, { analytics: true, marketing: true }]) {
    const consent = createCookieConsent(choices, now)
    assert.deepEqual(parseCookieConsent(JSON.stringify(consent), now), consent)
    assert.equal(consent.expiresAt, now + CONSENT_DURATION)
    assert.deepEqual(Object.keys(consent).sort(), ['analytics', 'expiresAt', 'marketing', 'necessary', 'updatedAt', 'version'])
  }
})
test('never accepts corrupted, outdated, future or expired permission', () => {
  const valid = createCookieConsent({ analytics: true, marketing: true }, now)
  for (const raw of [null, '', '{', 'null', 'true', '[]', '{}',
    JSON.stringify({ ...valid, version: 0 }), JSON.stringify({ ...valid, necessary: false }),
    JSON.stringify({ ...valid, analytics: 'true' }), JSON.stringify({ ...valid, marketing: 1 }),
    JSON.stringify({ ...valid, expiresAt: valid.expiresAt + 1 }),
    JSON.stringify({ ...valid, updatedAt: '2026-11-10' })]) {
    assert.equal(parseCookieConsent(raw, now), null, raw)
  }
  assert.equal(parseCookieConsent(JSON.stringify(valid), now - 1), null)
  assert.equal(parseCookieConsent(JSON.stringify(valid), valid.expiresAt), null)
  assert.equal(parseCookieConsent(JSON.stringify(valid), valid.expiresAt + 1), null)
  assert.deepEqual(parseCookieConsent(JSON.stringify(valid), valid.expiresAt - 1), valid)
})
test('discards unexpected storage properties rather than retaining personal data', () => {
  const consent = createCookieConsent({ analytics: false, marketing: false }, now)
  assert.deepEqual(parseCookieConsent(JSON.stringify({ ...consent, email: 'should-not-survive@example.test' }), now), consent)
})
