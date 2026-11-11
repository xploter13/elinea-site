<script setup lang="ts">
import { termsAcceptancePayload } from '~/data/serviceTerms'
import type { Plan } from '~/data/plans'
import { MarketingButton } from '@elinea/ui/marketing'
import { ArrowRight, X } from '@lucide/vue'

type CheckoutResponse = { data: { public_id: string }, checkout_url: string }
type DataKey = 'owner_name' | 'owner_email' | 'phone' | 'segment' | 'store_name'

type FormKey = DataKey | 'terms_accepted'

const props = defineProps<{ open: boolean, plan: Plan | null }>()
const emit = defineEmits<{ 'update:open': [open: boolean] }>()
const config = useRuntimeConfig()
const route = useRoute()
const { document: serviceTerms, refresh: refreshTerms, error: termsLoadingError } = useServiceTerms()
const checkoutDialog = ref<HTMLDialogElement | null>(null)
const termsAccepted = ref(false)
const submitting = ref(false)
const submitError = ref('')
const form = reactive({ owner_name: '', owner_email: '', phone: '', store_name: '', segment: '' })
const formErrors = reactive<Partial<Record<FormKey, string>>>({})

const money = (value: number) => new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
}).format(value / 100)

const close = () => {
  if (!submitting.value) emit('update:open', false)
}
const clearError = (field: FormKey) => delete formErrors[field]
const validateForm = () => {
  Object.keys(formErrors).forEach(key => delete formErrors[key as FormKey])
  const required: Array<[DataKey, string]> = [
    ['owner_name', 'Informe seu nome.'],
    ['owner_email', 'Informe seu e-mail.'],
    ['segment', 'Informe o segmento da loja.'],
    ['store_name', 'Informe o nome da loja.'],
  ]
  required.forEach(([field, message]) => {
    if (!form[field].trim()) formErrors[field] = message
  })
  if (form.owner_email && !/^\S+@\S+\.\S+$/.test(form.owner_email)) formErrors.owner_email = 'Informe um e-mail válido.'
  if (!termsAccepted.value || !serviceTerms.value || termsLoadingError.value) formErrors.terms_accepted = 'Para continuar, leia e aceite os Termos de Uso e Contratação.'
  return Object.keys(formErrors).length === 0
}

const submitCheckout = async () => {
  submitError.value = ''
  if (!props.plan || !validateForm()) {
    await nextTick()
    checkoutDialog.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    return
  }
  submitting.value = true
  try {
    const acceptedDocument = serviceTerms.value!
    await refreshTerms()
    if (termsLoadingError.value || !serviceTerms.value || serviceTerms.value.sha256 !== acceptedDocument.sha256 || !termsAccepted.value) {
      termsAccepted.value = false
      formErrors.terms_accepted = 'Os termos foram atualizados ou estão indisponíveis. Confira a versão vigente antes de continuar.'
      await nextTick()
      checkoutDialog.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    const origin = window.location.origin
    const cancelPath = route.path === '/' ? '/#planos' : `${route.path}#planos`
    const response = await $fetch<CheckoutResponse>(`${config.public.apiBase}/implementation-checkouts`, {
      method: 'POST',
      body: {
        ...termsAcceptancePayload(termsAccepted.value, acceptedDocument),
        plan_id: props.plan.id,
        ...form,
        phone: form.phone || null,
        success_url: `${origin}/compra-concluida`,
        cancel_url: `${origin}${cancelPath}`,
      },
    })
    window.location.assign(response.checkout_url)
  } catch (error) {
    const data = typeof error === 'object' && error && 'data' in error ? (error as {
      data?: { message?: string, errors?: Record<string, string[]> }
    }).data : undefined
    const generalErrors: string[] = []
    let hasFieldErrors = false
    if (data?.errors) {
      for (const [field, messages] of Object.entries(data.errors)) {
        if (field in form) {
          formErrors[field as DataKey] = messages[0] ?? 'Revise este campo.'
          hasFieldErrors = true
        } else if (field.startsWith('terms_')) {
          termsAccepted.value = false
          formErrors.terms_accepted = messages[0] ?? 'Revise os termos e confirme o aceite.'
          hasFieldErrors = true
        } else generalErrors.push(...messages)
      }
      if (Object.keys(data.errors).some(field => field.startsWith('terms_'))) await refreshTerms()
      await nextTick()
      checkoutDialog.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    }
    submitError.value = generalErrors[0] || (hasFieldErrors ? '' : data?.message || 'Não foi possível iniciar o pagamento.')
  } finally {
    submitting.value = false
  }
}

watch(() => props.plan?.id, () => { termsAccepted.value = false; delete formErrors.terms_accepted })

watch(() => props.open, async (isOpen) => {
  await nextTick()
  const dialog = checkoutDialog.value
  if (!dialog) return
  if (isOpen && !dialog.open) {
    dialog.showModal()
    dialog.querySelector<HTMLInputElement>('input')?.focus()
  } else if (!isOpen && dialog.open) dialog.close()
})

onBeforeUnmount(() => checkoutDialog.value?.close())
</script>

<template>
  <dialog ref="checkoutDialog" class="modal" @close="emit('update:open', false)" @click.self="close">
    <section class="modal-box checkout-modal">
      <button class="modal-close" type="button" aria-label="Fechar" @click="close"><X :size="18" /></button>
      <span class="site-label">Implantação Elínea</span>
      <h2>Comece com o plano {{ plan?.name }}</h2>
      <p>Preencha os dados do responsável. Na próxima etapa, o pagamento será processado com segurança pela Stripe.</p>
      <form novalidate @submit.prevent="submitCheckout">
        <label><span>Seu nome *</span><input v-model="form.owner_name" :aria-invalid="!!formErrors.owner_name" :aria-describedby="formErrors.owner_name ? 'modal-checkout-owner_name-error' : undefined" autocomplete="name" @input="clearError('owner_name')"><small v-if="formErrors.owner_name" id="modal-checkout-owner_name-error" role="alert">{{ formErrors.owner_name }}</small></label>
        <label><span>E-mail *</span><input v-model="form.owner_email" type="email" :aria-invalid="!!formErrors.owner_email" :aria-describedby="formErrors.owner_email ? 'modal-checkout-owner_email-error' : undefined" autocomplete="email" @input="clearError('owner_email')"><small v-if="formErrors.owner_email" id="modal-checkout-owner_email-error" role="alert">{{ formErrors.owner_email }}</small></label>
        <label><span>Telefone</span><input v-model="form.phone" type="tel" autocomplete="tel" :aria-invalid="!!formErrors.phone" :aria-describedby="formErrors.phone ? 'modal-checkout-phone-error' : undefined" @input="clearError('phone')"><small v-if="formErrors.phone" id="modal-checkout-phone-error" role="alert">{{ formErrors.phone }}</small></label>
        <label><span>Segmento *</span><input v-model="form.segment" :aria-invalid="!!formErrors.segment" :aria-describedby="formErrors.segment ? 'modal-checkout-segment-error' : undefined" @input="clearError('segment')"><small v-if="formErrors.segment" id="modal-checkout-segment-error" role="alert">{{ formErrors.segment }}</small></label>
        <label class="full"><span>Nome da loja *</span><input v-model="form.store_name" :aria-invalid="!!formErrors.store_name" :aria-describedby="formErrors.store_name ? 'modal-checkout-store_name-error' : undefined" autocomplete="organization" @input="clearError('store_name')"><small v-if="formErrors.store_name" id="modal-checkout-store_name-error" role="alert">{{ formErrors.store_name }}</small></label>
        <p v-if="submitError" class="form-error full" role="alert">{{ submitError }}</p>
        <SitePrivacyNotice />
        <SiteTermsAcceptance id="modal-terms-accepted" v-model="termsAccepted" :error="formErrors.terms_accepted" @update:model-value="clearError('terms_accepted')" />
        <div class="modal-actions full">
          <MarketingButton variant="outline" type="button" @click="close">Cancelar</MarketingButton>
          <MarketingButton variant="solid" type="submit" :disabled="submitting">
            {{ submitting ? 'Abrindo pagamento...' : plan?.implementation_amount === null ? 'Enviar interesse' : `Continuar — ${money(plan?.implementation_amount || 0)}` }}
            <template #icon><ArrowRight v-if="!submitting" :size="16" /></template>
          </MarketingButton>
        </div>
      </form>
    </section>
  </dialog>
</template>
