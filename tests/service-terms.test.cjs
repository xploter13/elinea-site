const { test } = require('node:test')
const assert = require('node:assert/strict')
const { createHash } = require('node:crypto')
const { readFileSync, existsSync } = require('node:fs')
const { resolve } = require('node:path')
const ts = require('typescript')
const content = readFileSync(resolve(__dirname, '../app/assets/legal/terms-1.1.md'), 'utf8').replace(/\r\n?/g, '\n').trim() + '\n'
const metadata = readFileSync(resolve(__dirname, '../app/data/serviceTerms.ts'), 'utf8')
const code = ts.transpileModule(readFileSync(resolve(__dirname, '../app/utils/legalDocument.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText
const compiled = { exports: {} }
new Function('module', 'exports', code)(compiled, compiled.exports)
const { parseLegalDocument, legalTextSegments } = compiled.exports

test('the acceptance identifies exactly the published document and API copy', () => {
  assert.match(metadata, /TERMS_VERSION = '1\.1'/)
  const hash = metadata.match(/TERMS_SHA256 = '([a-f0-9]{64})'/)[1]
  assert.equal(createHash('sha256').update(content).digest('hex'), hash)
  const apiCopy = resolve(__dirname, '../../elinea-api/resources/legal/terms-1.1.md')
  if (existsSync(apiCopy)) assert.equal(readFileSync(apiCopy, 'utf8').replace(/\r\n?/g, '\n').trim() + '\n', content)
})

test('the reader includes all twenty sections, the declaration and every paragraph/list', () => {
  const sections = parseLegalDocument(content)
  assert.equal(sections.length, 22)
  for (let index = 1; index <= 20; index++) assert.ok(sections[index].title.startsWith(`${index}. `))
  assert.equal(sections.at(-1).title, 'DECLARAÇÃO DE ACEITE')
  const renderedText = sections.flatMap(section => [section.title, ...section.blocks.flatMap(block => block.type === 'list' ? block.items : [block.text])]).join('\n\n')
  for (const paragraph of content.trim().split(/\n\s*\n/)) {
    if (paragraph.startsWith('# ') || paragraph === '---') continue
    for (const line of paragraph.split('\n')) assert.ok(renderedText.includes(line.replace(/^(## |- )/, '')), line)
  }
  assert.match(renderedText, /primeira mensalidade ou anuidade será cobrada no momento da contratação/)
  assert.doesNotMatch(renderedText, /mensalidade ocorrerá somente após a ativação/)
})

test('bold text is represented as text segments without interpreting HTML', () => {
  assert.deepEqual(legalTextSegments('Leia **estes termos** <script>alert(1)</script>'), [
    { bold: false, text: 'Leia ' }, { bold: true, text: 'estes termos' }, { bold: false, text: ' <script>alert(1)</script>' },
  ])
})
