import { parseContractingMode, type ContractingMode } from '~/data/contracting'

export const useContractingMode = () => {
  const route = useRoute()
  const router = useRouter()
  const mode = computed(() => parseContractingMode(route.query.modalidade))
  const selectMode = (value: ContractingMode) => {
    if (value === mode.value) return
    return router.push({ path: route.path, query: { ...route.query, modalidade: value }, hash: route.hash })
  }

  return { mode, selectMode }
}
