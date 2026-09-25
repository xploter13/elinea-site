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
}

export type ApiPlan = Omit<Plan, 'tone' | 'featured'>

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
  features: plan.features.length ? plan.features : plan.modules.map(module => moduleLabels[module]).filter((label): label is string => Boolean(label)),
  tone: tones[plan.slug] ?? 'neutral',
  featured: plan.slug === 'e-commerce',
})

export const formatPlanMoney = (amount: number, currency = 'brl'): string => new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: currency.toUpperCase(),
}).format(amount / 100)
