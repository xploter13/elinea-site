const { test } = require('node:test')
const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { resolve } = require('node:path')
const ts = require('typescript')
const source = readFileSync(resolve(__dirname, '../app/data/plans.ts'), 'utf8')
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
const compiled = { exports: {} }
new Function('module', 'exports', code)(compiled, compiled.exports)
const { presentPlans } = compiled.exports

function apiPlan(overrides = {}) {
  return {
    id: 12, name: 'Catálogo', slug: 'catalogo', description: 'Descrição da API.',
    monthly_amount: 9990, yearly_amount: null, implementation_amount: 0, currency: 'brl',
    features: ['Catálogo de produtos', 'Categorias e marcas', 'Variações e imagens', 'Controle de estoque'],
    modules: ['products'], is_active: true, can_checkout_monthly: true, can_checkout_yearly: false,
    ...overrides,
  }
}

test('uses the API as the only source of plans, prices, features, and checkout availability', () => {
  assert.deepEqual(presentPlans([]), [])
  const response = apiPlan({
    name: 'Nome atualizado na Gestão', monthly_amount: 12345, yearly_amount: 123450,
    implementation_amount: 6789, features: ['Um recurso cadastrado na API'], can_checkout_monthly: false,
  })
  const [plan] = presentPlans([response, apiPlan({ id: 15, slug: 'inativo', is_active: false })])
  for (const field of ['id', 'name', 'slug', 'monthly_amount', 'yearly_amount', 'implementation_amount', 'features', 'modules', 'can_checkout_monthly']) {
    assert.deepEqual(plan[field], response[field], field)
  }
  assert.equal(presentPlans([response]).length, 1)
})

test('compares inherited resources from the actual API feature lists', () => {
  const plans = presentPlans([
    apiPlan(),
    apiPlan({
      id: 13, name: 'E-commerce', slug: 'e-commerce',
      features: ['Tudo do plano Catálogo', 'Carrinho de compras', 'Checkout', 'Gestão de pedidos'],
    }),
  ])
  assert.equal(plans[0].comparison_features.includes('catalog'), true)
  assert.equal(plans[0].comparison_features.includes('checkout'), false)
  assert.equal(plans[1].comparison_features.includes('catalog'), true)
  assert.equal(plans[1].comparison_features.includes('checkout'), true)
  assert.equal(plans[1].comparison_features.includes('orders'), true)
  assert.equal(plans[1].comparison_features.includes('payments'), false)
})

test('displays customized work as optional and reads its commercial note from the API description', () => {
  const [custom] = presentPlans([apiPlan({
    name: 'Personalizado', slug: 'personalizado', monthly_amount: null, implementation_amount: null,
    description: 'Descrição enviada pela API.\n\nCondições comerciais cadastradas na API.',
    can_checkout_monthly: false,
  })])
  assert.equal(custom.feature_label, 'Pode incluir')
  assert.equal(custom.description, 'Descrição enviada pela API.')
  assert.equal(custom.commercial_note, 'Condições comerciais cadastradas na API.')
  assert.equal(custom.monthly_amount, null)
  assert.equal(custom.can_checkout_monthly, false)
})

test('handles cyclic inheritance without inventing absent resources', () => {
  const plans = presentPlans([
    apiPlan({ features: ['Tudo do plano E-commerce'] }),
    apiPlan({ id: 13, name: 'E-commerce', slug: 'e-commerce', features: ['Tudo do plano Catálogo'] }),
  ])
  assert.ok(plans.every(plan => plan.comparison_features.length === 0))
})
