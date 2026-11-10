import { toValue, type MaybeRefOrGetter } from 'vue'

export type ServiceTermsDocument = {
  id: number
  version: string
  title: string
  content: string
  sha256: string
  published_at: string
}

export const useServiceTerms = (version: MaybeRefOrGetter<string> = '') => {
  const config = useRuntimeConfig()
  const selectedVersion = computed(() => toValue(version))
  const result = useAsyncData<{ data: ServiceTermsDocument }>(
    () => `service-terms:${selectedVersion.value || 'current'}`,
    () => $fetch(`${config.public.apiBase}/service-terms${selectedVersion.value ? `/${encodeURIComponent(selectedVersion.value)}` : ''}`, { cache: 'no-store' }),
    { server: false },
  )
  return { document: computed(() => result.data.value?.data ?? null), pending: result.pending, error: result.error, refresh: result.refresh }
}
