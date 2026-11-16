const { test } = require('node:test')
const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { resolve } = require('node:path')
const ts = require('typescript')
const compiled = { exports: {} }
const code = ts.transpileModule(readFileSync(resolve(__dirname, '../app/data/contracting.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText
new Function('module', 'exports', code)(compiled, compiled.exports)
const { parseContractingMode, productLimitLabel, implementationAmount, contractingCta } = compiled.exports

test('uses autonomy for absent, invalid, and repeated URL values', () => {
  for (const value of [undefined, null, '', 'autonomia', 'invalid', ['especialista']]) {
    assert.equal(parseContractingMode(value), 'autonomia')
  }
  assert.equal(parseContractingMode('especialista'), 'especialista')
})

test('changes only the optional service amount and action between modes', () => {
  for (const [limit, recurring, setup] of [[500, 9990, 29900], [2000, 24990, 59900]]) {
    const plan = { product_limit: limit, monthly_amount: recurring, implementation_amount: 0, specialist_implementation: { amount: setup, services: [] } }
    const original = structuredClone(plan)
    assert.equal(implementationAmount(plan, 'autonomia'), 0)
    assert.equal(implementationAmount(plan, 'especialista'), setup)
    assert.equal(contractingCta(plan, 'autonomia'), 'Contratar agora')
    assert.equal(contractingCta(plan, 'especialista'), 'Falar com especialista')
    assert.match(productLimitLabel(plan), /produtos ativos/)
    assert.deepEqual(plan, original)
  }
})

test('keeps custom quotes and unknown specialist offers under consultation', () => {
  const plan = { monthly_amount: null, implementation_amount: null, product_limit: null }
  for (const mode of ['autonomia', 'especialista']) {
    assert.equal(implementationAmount(plan, mode), null)
    assert.equal(contractingCta(plan, mode), 'Solicitar orçamento')
  }
  assert.equal(productLimitLabel(plan), 'Limite de produtos personalizado')
})
