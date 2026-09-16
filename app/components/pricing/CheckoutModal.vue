<script setup lang="ts">
import type { Plan } from '~/data/plans'
import { MarketingButton } from '@elinea/ui/marketing'
import { ArrowRight, X } from '@lucide/vue'

type CheckoutResponse = { data: { public_id: string }, checkout_url: string }
type FormKey = 'owner_name' | 'owner_email' | 'segment' | 'store_name'

const props = defineProps<{ open: boolean, plan: Plan | null }>()
const emit = defineEmits<{ 'update:open': [open: boolean] }>()
const config = useRuntimeConfig()
const route = useRoute()
const checkoutDialog = ref<HTMLDialogElement | null>(null)
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
  const required: Array<[FormKey, string]> = [
    ['owner_name', 'Informe seu nome.'],
    ['owner_email', 'Informe seu e-mail.'],
    ['segment', 'Informe o segmento da loja.'],
    ['store_name', 'Informe o nome da loja.'],
  ]
  required.forEach(([field, message]) => {
    if (!form[field].trim()) formErrors[field] = message
  })
  if (form.owner_email && !/^\S+@\S+\.\S+$/.test(form.owner_email)) formErrors.owner_email = 'Informe um e-mail válido.'
  return Object.keys(formErrors).length === 0
}

const submitCheckout = async () => {
  if (!props.plan || !validateForm()) {
    await nextTick()
    checkoutDialog.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    return
  }
  submitting.value = true
  submitError.value = ''
  try {
    const origin = window.location.origin
    const cancelPath = route.path === '/' ? '/#planos' : `${route.path}#planos`
    const response = await $fetch<CheckoutResponse>(`${config.public.apiBase}/implementation-checkouts`, {
      method: 'POST',
      body: {
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
    submitError.value = data?.errors ? Object.values(data.errors).flat()[0] || '' : data?.message || 'Não foi possível iniciar o pagamento.'
  } finally {
    submitting.value = false
  }
}

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
        <label><span>Seu nome *</span><input v-model="form.owner_name" :aria-invalid="!!formErrors.owner_name" autocomplete="name" @input="clearError('owner_name')"><small v-if="formErrors.owner_name" role="alert">{{ formErrors.owner_name }}</small></label>
        <label><span>E-mail *</span><input v-model="form.owner_email" type="email" :aria-invalid="!!formErrors.owner_email" autocomplete="email" @input="clearError('owner_email')"><small v-if="formErrors.owner_email" role="alert">{{ formErrors.owner_email }}</small></label>
        <label><span>Telefone</span><input v-model="form.phone" type="tel" autocomplete="tel"></label>
        <label><span>Segmento *</span><input v-model="form.segment" :aria-invalid="!!formErrors.segment" @input="clearError('segment')"><small v-if="formErrors.segment" role="alert">{{ formErrors.segment }}</small></label>
        <label class="full"><span>Nome da loja *</span><input v-model="form.store_name" :aria-invalid="!!formErrors.store_name" autocomplete="organization" @input="clearError('store_name')"><small v-if="formErrors.store_name" role="alert">{{ formErrors.store_name }}</small></label>
        <p v-if="submitError" class="form-error full" role="alert">{{ submitError }}</p>
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
