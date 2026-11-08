export type BillingInterval = 'monthly' | 'yearly'

export type Plan = {
  id: number
  name: string
  slug: string
  description: string | null
  monthly_amount: number | null
  yearly_amount: number | null
  implementation_amount: number | null
  currency: string
  features: string[]
  modules: string[]
  is_active: boolean
  can_checkout_monthly: boolean
  can_checkout_yearly: boolean
  tone: 'neutral' | 'mint' | 'blue' | 'dark' | 'violet'
  featured: boolean
  feature_label?: 'Inclui' | 'Pode incluir'
  commercial_note?: string
  comparison_features?: string[]
}

export type ApiPlan = Omit<Plan, 'tone' | 'featured' | 'feature_label' | 'commercial_note' | 'comparison_features'>

const tones: Record<string, Plan['tone']> = {
  catalogo: 'neutral',
  whatsapp: 'mint',
  'e-commerce': 'blue',
  completo: 'dark',
  personalizado: 'violet',
}

export const moduleLabels: Record<string, string> = {
  orders: 'Vendas e pedidos',
  customers: 'Clientes',
  products: 'Produtos',
  categories: 'Categorias',
  brands: 'Marcas',
  inventory: 'Estoque',
  revenue: 'Faturamento',
  reports: 'Relatórios',
  coupons: 'Cupons',
  promotions: 'Promoções',
  marketing: 'Campanhas',
  automations: 'Automações',
  messaging: 'Atendimento por WhatsApp',
  tickets: 'Tickets de suporte',
  reviews: 'Avaliações',
  integrations: 'Integrações',
}

export const presentPlan = (plan: ApiPlan): Plan => ({
  ...plan,
  description: plan.description?.split(/\n\s*\n/)[0] ?? null,
  feature_label: plan.slug === 'personalizado' ? 'Pode incluir' : 'Inclui',
  commercial_note: plan.description?.split(/\n\s*\n/).slice(1).join('\n\n') || undefined,
  features: plan.features.length ? plan.features : plan.modules.map(module => moduleLabels[module]).filter((label): label is string => Boolean(label)),
  tone: tones[plan.slug] ?? 'neutral',
  featured: plan.slug === 'e-commerce',
})

export const formatPlanMoney = (amount: number, currency = 'brl'): string => new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: currency.toUpperCase(),
}).format(amount / 100)

const comparisonRequirements: Record<string, string[]> = {
  catalog: ['Catálogo de produtos', 'Categorias e marcas', 'Variações e imagens'],
  inventory: ['Controle de estoque'],
  administration: ['Painel administrativo'],
  whatsapp: ['Botão de contato pelo WhatsApp'],
  checkout: ['Carrinho de compras', 'Checkout'],
  orders: ['Gestão de pedidos'],
  payments: ['Pagamento online', 'Integração com gateways', 'Pix e cartão'],
  shipping: ['Cálculo de frete'],
  coupons: ['Cupons', 'Promoções'],
  reviews: ['Avaliações de produtos'],
  wishlist: ['Lista de desejos'],
  email: ['Newsletter', 'Campanhas por e-mail'],
  integrations: ['Integrações com serviços externos'],
  reports: ['Relatórios'],
  support: ['Suporte'],
}

const normalizeFeature = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()

function includedFeatures(plan: Plan, plans: Plan[], visited = new Set<string>()): string[] {
  if (visited.has(plan.slug)) return []
  visited.add(plan.slug)
  return plan.features.flatMap(feature => {
    const inheritedName = feature.match(/^Tudo do plano (.+)$/i)?.[1]
    const inherited = inheritedName && plans.find(candidate => normalizeFeature(candidate.name) === normalizeFeature(inheritedName))
    return inherited ? includedFeatures(inherited, plans, visited) : [normalizeFeature(feature)]
  })
}

export function presentPlans(apiPlans: ApiPlan[]): Plan[] {
  const plans = apiPlans.filter(plan => plan.is_active).map(presentPlan)
  return plans.map(plan => {
    const features = new Set(includedFeatures(plan, plans))
    return {
      ...plan,
      comparison_features: Object.entries(comparisonRequirements)
        .filter(([, requirements]) => requirements.every(feature => features.has(normalizeFeature(feature))))
        .map(([key]) => key),
    }
  })
}
