const { test } = require('node:test')
const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { resolve } = require('node:path')
const source = readFileSync(resolve(__dirname, '../app/utils/cpf.ts'), 'utf8')
let code
try { code = require('esbuild').transformSync(source, { loader: 'ts', format: 'cjs' }).code }
catch { const ts = require('typescript'); code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText }
const compiled = { exports: {} }
new Function('module', 'exports', code)(compiled, compiled.exports)
const { isValidCpf, normalizeCpf } = compiled.exports
test('validates both verification digits, masked input, and leading zeros', () => {
  for (const cpf of ['52998224725', '529.982.247-25', '11144477735', '01234567890']) assert.equal(isValidCpf(cpf), true, cpf)
})
test('rejects repeated digits, wrong checksums, incomplete input and letters', () => {
  for (const cpf of ['', '123', '12345678900', '52998224724', '00000000000', '11111111111', 'abc52998224725']) assert.equal(isValidCpf(cpf), false, cpf)
})
test('normalizes formatting without turning malformed input into a valid document', () => {
  assert.equal(normalizeCpf(' 529.982.247-25 '), '52998224725')
  assert.equal(normalizeCpf('012.345.678-90'), '01234567890')
  assert.equal(normalizeCpf(''), '')
  assert.equal(normalizeCpf('abc529.982.247-25'), 'abc52998224725')
})
