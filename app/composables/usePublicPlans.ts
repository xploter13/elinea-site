import { presentPlan, type ApiPlan, type Plan } from '~/data/plans'

type PlansResponse = { data: ApiPlan[], meta: { current_page: number, last_page: number } }

export const usePublicPlans = () => {
  const config = useRuntimeConfig()

  return useAsyncData<Plan[]>('public-plans', async () => {
    const response = await $fetch<PlansResponse>(`${config.public.apiBase}/plans`, {
      query: { per_page: 100 },
    })

    if (response.meta.last_page > 1) {
      throw new Error('Há mais planos do que a consulta pública retornou.')
    }

    return response.data.filter(plan => plan.is_active).map(presentPlan)
  }, { server: false, default: () => [] })
}
