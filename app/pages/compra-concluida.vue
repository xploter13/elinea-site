<script setup lang="ts">
import { ArrowRight, CircleCheckBig } from '@lucide/vue'
import { MarketingButton } from '@elinea/ui/marketing'

type ApplicationStatus = 'pending_payment' | 'paid' | 'provisioned' | 'canceled'
type ApplicationResponse = { data: { status: ApplicationStatus, store_name: string } }

const route = useRoute()
const config = useRuntimeConfig()
const status = ref<ApplicationStatus | 'checking' | 'unknown'>('checking')
const storeName = ref('')
let pollTimer: ReturnType<typeof setTimeout> | undefined
let attempts = 0

async function checkStatus() {
  const publicId = typeof route.query.solicitacao === 'string' ? route.query.solicitacao : ''
  if (!/^[0-9a-f-]{36}$/i.test(publicId)) {
    status.value = 'unknown'
    return
  }

  try {
    const response = await $fetch<ApplicationResponse>(`${config.public.apiBase}/implementation-checkouts/${encodeURIComponent(publicId)}`)
    status.value = response.data.status
    storeName.value = response.data.store_name
  } catch {
    status.value = 'unknown'
  }

  if (status.value !== 'provisioned' && status.value !== 'canceled' && attempts++ < 24) {
    pollTimer = setTimeout(checkStatus, 5000)
  }
}

onMounted(checkStatus)
onBeforeUnmount(() => clearTimeout(pollTimer))

useSeoMeta({ title: 'Acompanhe sua contratação — Elínea', robots: 'noindex, nofollow' })
</script>

<template>
  <main class="result-page">
    <section aria-live="polite">
      <CircleCheckBig :size="58" aria-hidden="true" />
      <span>Contratação da Elínea</span>
      <template v-if="status === 'provisioned'">
        <h1>Sua loja foi criada.</h1>
        <p>{{ storeName }} está em preparação. Você receberá no e-mail informado um link para criar sua senha e acessar o painel. Confira também a pasta de spam.</p>
      </template>
      <template v-else-if="status === 'canceled'">
        <h1>Essa contratação foi cancelada.</h1>
        <p>Você pode escolher outro plano ou falar com a equipe Elínea.</p>
      </template>
      <template v-else-if="status === 'unknown'">
        <h1>Não conseguimos consultar sua solicitação.</h1>
        <p>Se você concluiu o pagamento, a confirmação será enviada ao e-mail informado. Em caso de dúvida, fale com a equipe Elínea.</p>
      </template>
      <template v-else>
        <h1>Estamos confirmando seu pagamento.</h1>
        <p>A confirmação pode levar alguns instantes. Quando o pagamento for aprovado, criaremos sua loja e enviaremos as instruções de acesso por e-mail.</p>
      </template>
      <MarketingButton class="mt-6" variant="solid" to="/">Voltar ao site<template #icon><ArrowRight :size="18" /></template></MarketingButton>
    </section>
  </main>
</template>
