export type Plan = {
  id: number
  name: string
  slug: string
  description: string
  monthly_amount: number | null
  implementation_amount: number | null
  implementation_label: string
  features: string[]
  features_label?: string
  note?: string
  tone: 'neutral' | 'mint' | 'blue' | 'dark' | 'violet'
  featured?: boolean
}

export const plans: Plan[] = [
  {
    id: 1,
    name: 'Catálogo',
    slug: 'catalogo',
    description: 'Indicado para negócios que querem apresentar seus produtos online com organização, domínio próprio e contato direto, sem checkout dentro do site.',
    monthly_amount: 9900,
    implementation_amount: 49000,
    implementation_label: 'R$ 490',
    features: ['Catálogo de produtos', 'Categorias e marcas', 'Variações e imagens', 'Controle de estoque', 'Painel administrativo', 'Domínio próprio', 'SSL', 'Botão de contato pelo WhatsApp', 'Relatórios básicos', 'Suporte'],
    tone: 'neutral',
  },
  {
    id: 2,
    name: 'WhatsApp',
    slug: 'whatsapp',
    description: 'Indicado para negócios que vendem pelo WhatsApp e querem transformar o atendimento manual em uma operação estruturada, automatizada e mensurável.',
    monthly_amount: 24900,
    implementation_amount: 0,
    implementation_label: 'Grátis',
    features: ['Catálogo de produtos', 'Controle de estoque', 'Gestão de contatos', 'Central de conversas', 'Atendimento pelo WhatsApp', 'Chatbot de vendas', 'Automações comerciais', 'Histórico de mensagens', 'Gestão de pedidos', 'Acompanhamento de vendas', 'Relatórios básicos', 'Campanhas pelo WhatsApp', 'Suporte'],
    note: 'O consumo de mensagens poderá possuir franquia ou cobrança adicional conforme o modelo adotado com o provedor oficial de WhatsApp.',
    tone: 'mint',
  },
  {
    id: 3,
    name: 'E-commerce',
    slug: 'e-commerce',
    description: 'Indicado para empresas que querem uma loja virtual completa, com uma jornada de compra online que reúne carrinho, checkout, pagamentos e pedidos.',
    monthly_amount: 24900,
    implementation_amount: 79000,
    implementation_label: 'R$ 790',
    features: ['Tudo do plano Catálogo', 'Carrinho de compras', 'Checkout', 'Gestão de pedidos', 'Pagamento online', 'Integração com gateways', 'Pix e cartão', 'Cálculo de frete', 'Cupons', 'Promoções', 'Avaliações de produtos', 'Lista de desejos', 'Newsletter', 'Campanhas por e-mail', 'E-mails transacionais', 'Relatórios comerciais completos', 'Integrações com serviços externos', 'Suporte'],
    tone: 'blue',
    featured: true,
  },
  {
    id: 4,
    name: 'Completo',
    slug: 'completo',
    description: 'Indicado para negócios que querem integrar e-commerce, atendimento, vendas e automações pelo WhatsApp em uma operação única, organizada e segura.',
    monthly_amount: 39900,
    implementation_amount: 99000,
    implementation_label: 'R$ 990',
    features: ['Tudo do plano E-commerce', 'Central de atendimento pelo WhatsApp', 'Gestão de contatos e conversas', 'Chatbot de vendas', 'Automações pelo WhatsApp', 'Automação baseada em eventos de pedidos', 'Recuperação de oportunidades', 'Recuperação de carrinho abandonado', 'Mensagens automáticas de pedidos', 'Campanhas pelo WhatsApp', 'Histórico das conversas', 'Integração entre atendimento e pedidos', 'Relatórios completos', 'Suporte'],
    note: 'O consumo de mensagens poderá possuir franquia ou cobrança adicional conforme o modelo adotado com o provedor oficial de WhatsApp.',
    tone: 'dark',
  },
  {
    id: 5,
    name: 'Personalizado',
    slug: 'personalizado',
    description: 'Indicado para empresas com regras próprias, que precisam adaptar a Elínea com integrações, automações e recursos desenvolvidos para sua operação.',
    monthly_amount: null,
    implementation_amount: null,
    implementation_label: 'Sob consulta',
    features_label: 'Pode incluir',
    features: ['Recursos do plano Completo', 'Layout exclusivo', 'Integrações personalizadas', 'Integração com ERP', 'Gateways específicos', 'Regras comerciais próprias', 'Funcionalidades sob demanda', 'Automações personalizadas', 'Relatórios personalizados', 'Acompanhamento técnico', 'Suporte prioritário'],
    note: 'O projeto é analisado individualmente e pode envolver cobrança de implantação, desenvolvimento e mensalidade.',
    tone: 'violet',
  },
]
