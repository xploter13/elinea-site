import type { Plan } from './plans'

export type ContractingMode = 'autonomia' | 'especialista'
export const contractingModes: { id: ContractingMode, label: string, description: string }[] = [
  {
    id: 'autonomia', label: 'Autonomia',
    description: 'Você no controle, desde o início. Escolha seu plano, configure sua loja no seu ritmo e aproveite todos os recursos da plataforma sem taxa de implantação.',
  },
  {
    id: 'especialista', label: 'Com especialista',
    description: 'Conte com a experiência da nossa equipe para configurar sua loja, preparar sua operação e começar a vender com mais tranquilidade.',
  },
]
export const parseContractingMode = (value: unknown): ContractingMode => value === 'especialista' ? 'especialista' : 'autonomia'
export const productLimitLabel = (plan: Plan) => plan.product_limit == null
  ? 'Limite de produtos personalizado'
  : `Até ${plan.product_limit.toLocaleString('pt-BR')} produtos ativos`
export const implementationAmount = (plan: Plan, mode: ContractingMode) => mode === 'especialista'
  ? plan.specialist_implementation?.amount ?? null
  : plan.implementation_amount
export const contractingCta = (plan: Plan, mode: ContractingMode) => plan.monthly_amount === null
  ? 'Solicitar orçamento'
  : mode === 'especialista' ? 'Falar com especialista' : 'Contratar agora'
