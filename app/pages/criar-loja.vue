<script setup lang="ts">
import { ArrowLeft, ArrowRight, Check, LockKeyhole } from '@lucide/vue'
import { plans, type Plan } from '~/data/plans'

type Field = 'owner_name' | 'owner_email' | 'phone' | 'store_name' | 'segment'
type ApiPlan = { id: number, slug: string, monthly_amount: number | null, implementation_amount: number | null, is_active: boolean }
type CheckoutResponse = { checkout_url: string }

const route = useRoute()
const config = useRuntimeConfig()
const selectedSlug = ref('')
const selectedPlan = computed<Plan | undefined>(() => plans.find(plan => plan.slug === selectedSlug.value))
const canCheckout = computed(() => !!selectedPlan.value && (selectedPlan.value.implementation_amount ?? 0) > 0)
const form = reactive({ owner_name: '', owner_email: '', phone: '', store_name: '', segment: '' })
const errors = reactive<Partial<Record<Field, string>>>({})
const submitting = ref(false)
const submitError = ref('')
const errorSummary = ref<HTMLElement | null>(null)

onMounted(() => {
  const requestedPlan = typeof route.query.plano === 'string' ? route.query.plano : ''
  if (plans.some(plan => plan.slug === requestedPlan)) selectedSlug.value = requestedPlan
})

const money = (value: number) => new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL', maximumFractionDigits: 0,
}).format(value / 100)

const requiredMessages: Partial<Record<Field, string>> = {
  owner_name: 'Informe seu nome.', owner_email: 'Informe o e-mail.', store_name: 'Informe o nome da loja.', segment: 'Informe o segmento.',
}

function validateField(field: Field) {
  const value = form[field].trim()
  delete errors[field]
  if (field !== 'phone' && !value) errors[field] = requiredMessages[field]
  else if (field === 'owner_email' && !/^\S+@\S+\.\S+$/.test(value)) errors[field] = 'Informe um e-mail válido.'
  else if (value.length > (field === 'segment' ? 100 : field === 'phone' ? 30 : 255)) errors[field] = 'O texto é longo demais.'
  return !errors[field]
}

async function submitCheckout() {
  submitError.value = ''
  const plan = selectedPlan.value
  if (!plan || !canCheckout.value) return
  const valid = (Object.keys(form) as Field[]).map(validateField).every(Boolean)
  if (!valid) {
    await nextTick()
    errorSummary.value?.focus()
    return
  }

  submitting.value = true
  try {
    const response = await $fetch<{ data: ApiPlan[] }>(`${config.public.apiBase}/plans`, {
      query: { search: plan.slug },
    })
    const apiPlan = response.data.find(item => item.slug === plan.slug && item.is_active)
    if (!apiPlan || apiPlan.implementation_amount !== plan.implementation_amount || apiPlan.monthly_amount !== plan.monthly_amount) {
      submitError.value = 'Este plano não está disponível para contratação online agora. Confira os planos ou fale com a equipe Elínea.'
      return
    }

    const origin = window.location.origin
    const checkout = await $fetch<CheckoutResponse>(`${config.public.apiBase}/implementation-checkouts`, {
      method: 'POST',
      body: {
        plan_id: apiPlan.id,
        owner_name: form.owner_name.trim(),
        owner_email: form.owner_email.trim(),
        phone: form.phone.trim() || null,
        store_name: form.store_name.trim(),
        segment: form.segment.trim(),
        success_url: `${origin}/compra-concluida`,
        cancel_url: `${origin}/criar-loja?plano=${encodeURIComponent(plan.slug)}`,
      },
    })
    window.location.assign(checkout.checkout_url)
  } catch (error) {
    const data = typeof error === 'object' && error && 'data' in error ? (error as { data?: { message?: string, errors?: Record<string, string[]> } }).data : undefined
    submitError.value = data?.errors ? Object.values(data.errors).flat()[0] || 'Não foi possível iniciar o pagamento.' : data?.message || 'Não foi possível iniciar o pagamento. Tente novamente.'
  } finally {
    submitting.value = false
  }
}

useSeoMeta({
  title: 'Criar minha loja — Elínea',
  description: 'Escolha seu plano e informe os dados da sua loja para iniciar a implantação com a Elínea.',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="page-shell create-store-page">
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <SiteHeader light />
    <main id="conteudo" class="create-store-main">
      <div class="site-container create-store-layout">
        <div class="create-store-intro">
          <NuxtLink to="/precos#planos" class="create-store-back"><ArrowLeft :size="17" aria-hidden="true" /> Voltar aos planos</NuxtLink>
          <p class="create-store-kicker">Comece sua loja</p>
          <h1>Vamos criar sua loja.</h1>
          <p>Escolha o plano, confira os valores e conte um pouco sobre o seu negócio antes de continuar.</p>
        </div>

        <aside class="create-store-summary" aria-label="Resumo do plano">
          <div class="create-store-summary__top">
            <p>Seu plano</p>
            <label for="create-store-plan">Selecione o plano</label>
            <select id="create-store-plan" v-model="selectedSlug" @change="submitError = ''">
              <option value="">Escolha um plano</option>
              <option v-for="plan in plans" :key="plan.slug" :value="plan.slug">{{ plan.name }}</option>
            </select>
          </div>
          <template v-if="selectedPlan">
            <h2>{{ selectedPlan.name }}</h2>
            <p class="create-store-summary__description">{{ selectedPlan.description }}</p>
            <dl class="create-store-values">
              <div><dt>Mensalidade</dt><dd>{{ selectedPlan.monthly_amount === null ? 'Sob consulta' : `${money(selectedPlan.monthly_amount)} / mês` }}</dd></div>
              <div><dt>Implantação</dt><dd>{{ selectedPlan.implementation_label }}</dd></div>
            </dl>
            <p class="create-store-summary__includes">{{ selectedPlan.features_label || 'O plano inclui' }}</p>
            <ul>
              <li v-for="feature in selectedPlan.features.slice(0, 4)" :key="feature"><Check :size="16" aria-hidden="true" />{{ feature }}</li>
            </ul>
            <p v-if="selectedPlan.note" class="create-store-summary__note">{{ selectedPlan.note }}</p>
          </template>
          <p v-else class="create-store-summary__empty">Os valores e recursos do plano escolhido aparecem aqui.</p>
          <NuxtLink to="/precos#planos" class="create-store-compare">Comparar planos <ArrowRight :size="16" aria-hidden="true" /></NuxtLink>
        </aside>

        <section class="create-store-form-area" aria-labelledby="create-store-form-title">
          <div class="create-store-form-heading">
            <p class="create-store-step">Seus dados</p>
            <h2 id="create-store-form-title">Conte sobre a sua loja.</h2>
            <p v-if="canCheckout">Essas informações iniciam a solicitação de implantação. A loja é preparada após a confirmação do pagamento.</p>
            <p v-else>Escolha um plano para ver como dar o próximo passo.</p>
          </div>

          <div v-if="!selectedPlan" class="create-store-notice">Selecione um plano no resumo para continuar.</div>
          <div v-else-if="!canCheckout" class="create-store-notice">
            <h3>Vamos conversar sobre este plano.</h3>
            <p>Este plano não possui contratação online de implantação. Entre em contato para conhecer o próximo passo.</p>
            <a :href="`mailto:contato@elinea.com.br?subject=${encodeURIComponent(`Interesse no plano ${selectedPlan.name}`)}`" class="create-store-contact">Falar com a equipe <ArrowRight :size="17" aria-hidden="true" /></a>
          </div>
          <form v-else class="create-store-form" novalidate @submit.prevent="submitCheckout">
            <div v-if="Object.keys(errors).length" ref="errorSummary" class="create-store-error-summary" role="alert" tabindex="-1">
              <strong>Confira os campos indicados.</strong>
              <a v-for="field in (Object.keys(errors) as Field[])" :key="field" :href="`#create-store-${field}`">{{ errors[field] }}</a>
            </div>
            <div class="create-store-fields">
              <label for="create-store-owner_name"><span>Seu nome <b>*</b></span><input id="create-store-owner_name" v-model="form.owner_name" autocomplete="name" required :aria-invalid="!!errors.owner_name" :aria-describedby="errors.owner_name ? 'error-owner_name' : undefined" @blur="validateField('owner_name')" @input="delete errors.owner_name"><small v-if="errors.owner_name" id="error-owner_name">{{ errors.owner_name }}</small></label>
              <label for="create-store-owner_email"><span>E-mail <b>*</b></span><input id="create-store-owner_email" v-model="form.owner_email" type="email" autocomplete="email" required :aria-invalid="!!errors.owner_email" :aria-describedby="errors.owner_email ? 'error-owner_email' : undefined" @blur="validateField('owner_email')" @input="delete errors.owner_email"><small v-if="errors.owner_email" id="error-owner_email">{{ errors.owner_email }}</small></label>
              <label for="create-store-phone"><span>Telefone <em>opcional</em></span><input id="create-store-phone" v-model="form.phone" type="tel" autocomplete="tel" :aria-invalid="!!errors.phone" :aria-describedby="errors.phone ? 'error-phone' : undefined" @blur="validateField('phone')" @input="delete errors.phone"><small v-if="errors.phone" id="error-phone">{{ errors.phone }}</small></label>
              <label for="create-store-segment"><span>Segmento <b>*</b></span><input id="create-store-segment" v-model="form.segment" required placeholder="Ex.: moda, farmácia, papelaria" :aria-invalid="!!errors.segment" :aria-describedby="errors.segment ? 'error-segment' : undefined" @blur="validateField('segment')" @input="delete errors.segment"><small v-if="errors.segment" id="error-segment">{{ errors.segment }}</small></label>
              <label class="create-store-field-wide" for="create-store-store_name"><span>Nome da loja <b>*</b></span><input id="create-store-store_name" v-model="form.store_name" autocomplete="organization" required :aria-invalid="!!errors.store_name" :aria-describedby="errors.store_name ? 'error-store_name' : undefined" @blur="validateField('store_name')" @input="delete errors.store_name"><small v-if="errors.store_name" id="error-store_name">{{ errors.store_name }}</small></label>
            </div>
            <p v-if="submitError" class="create-store-submit-error" role="alert">{{ submitError }} <a href="mailto:contato@elinea.com.br">Falar com a equipe</a></p>
            <div class="create-store-submit">
              <button type="submit" :disabled="submitting" :aria-busy="submitting">
                {{ submitting ? 'Preparando pagamento...' : `Continuar para pagamento · ${money(selectedPlan.implementation_amount || 0)}` }}
                <ArrowRight v-if="!submitting" :size="19" aria-hidden="true" />
              </button>
              <p><LockKeyhole :size="15" aria-hidden="true" /> O pagamento é concluído em uma página segura da Stripe.</p>
            </div>
          </form>
        </section>
      </div>
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.create-store-page { background: var(--paper); color: var(--ink-2); }
.create-store-main { padding: clamp(8rem, 12vw, 11rem) 0 clamp(5rem, 8vw, 8rem); }
.create-store-layout { display: grid; grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr); column-gap: clamp(3rem, 7vw, 8rem); align-items: start; }
.create-store-intro { grid-column: 1 / -1; max-width: 780px; margin-bottom: clamp(3rem, 6vw, 5rem); }
.create-store-back { display: inline-flex; align-items: center; gap: .6rem; margin-bottom: 3rem; color: var(--muted); font-size: .9rem; text-decoration: none; }
.create-store-back:hover, .create-store-back:focus-visible { color: var(--green); }
.create-store-kicker, .create-store-step { margin-bottom: 1rem; color: var(--green); font-size: .85rem; font-weight: 600; }
.create-store-intro h1 { max-width: 760px; font-size: clamp(3.3rem, 7vw, 6.5rem); font-weight: 700; letter-spacing: -.055em; line-height: .98; }
.create-store-intro > p:last-child { max-width: 590px; margin-top: 1.5rem; color: var(--muted); font-size: 1.1rem; line-height: 1.65; }
.create-store-summary { position: sticky; top: 7rem; padding: clamp(1.6rem, 3vw, 2.6rem); border-radius: 22px; background: var(--ink); color: white; }
.create-store-summary__top { display: grid; gap: .65rem; }
.create-store-summary__top > p { margin-bottom: 1.25rem; color: var(--green-bright); font-size: .85rem; font-weight: 600; }
.create-store-summary label { color: rgba(255,255,255,.72); font-size: .85rem; }
.create-store-summary select { width: 100%; min-height: 48px; padding: .7rem 1rem; border: 1px solid rgba(255,255,255,.32); border-radius: 9px; background: #1b3029; color: white; font: inherit; }
.create-store-summary select:focus-visible { outline: 3px solid var(--green-bright); outline-offset: 2px; }
.create-store-summary h2 { margin-top: 2.5rem; font-size: clamp(2.2rem, 4vw, 3.6rem); letter-spacing: -.045em; line-height: 1; }
.create-store-summary__description { margin-top: 1rem; color: rgba(255,255,255,.7); font-size: .95rem; line-height: 1.6; }
.create-store-values { margin: 2rem 0; border-block: 1px solid rgba(255,255,255,.17); }
.create-store-values div { display: flex; justify-content: space-between; gap: 1rem; padding: 1rem 0; }
.create-store-values div + div { border-top: 1px solid rgba(255,255,255,.12); }
.create-store-values dt { color: rgba(255,255,255,.65); }
.create-store-values dd { margin: 0; font-weight: 600; text-align: right; }
.create-store-summary__includes { margin-bottom: 1rem; font-size: .85rem; font-weight: 600; }
.create-store-summary ul { display: grid; gap: .8rem; margin: 0; padding: 0; list-style: none; }
.create-store-summary li { display: flex; gap: .7rem; align-items: flex-start; color: rgba(255,255,255,.76); font-size: .88rem; line-height: 1.45; }
.create-store-summary li svg { flex: none; color: var(--green-bright); }
.create-store-summary__note { margin-top: 1.6rem; color: rgba(255,255,255,.65); font-size: .8rem; line-height: 1.5; }
.create-store-summary__empty { margin: 2rem 0; color: rgba(255,255,255,.7); }
.create-store-compare { display: inline-flex; align-items: center; gap: .4rem; margin-top: 2rem; color: var(--green-bright); font-size: .85rem; text-decoration: none; }
.create-store-compare:hover { text-decoration: underline; }
.create-store-form-area { padding-top: .35rem; }
.create-store-form-heading h2 { max-width: 540px; font-size: clamp(2rem, 3vw, 3rem); letter-spacing: -.04em; line-height: 1.08; }
.create-store-form-heading > p:last-child { max-width: 560px; margin-top: 1rem; color: var(--muted); line-height: 1.65; }
.create-store-form { margin-top: 2.5rem; }
.create-store-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.4rem 1.1rem; }
.create-store-fields label { display: grid; align-content: start; gap: .55rem; min-width: 0; color: var(--ink-2); font-size: .88rem; font-weight: 600; }
.create-store-fields label b { color: var(--green); }
.create-store-fields label em { color: var(--muted); font-size: .78rem; font-style: normal; font-weight: 400; }
.create-store-fields input { width: 100%; min-height: 52px; padding: .8rem 1rem; border: 1px solid #cbd7d0; border-radius: 9px; outline: none; background: white; color: var(--ink-2); font: inherit; font-size: 1rem; font-weight: 400; transition: border-color .2s, box-shadow .2s; }
.create-store-fields input::placeholder { color: #80918a; }
.create-store-fields input:focus-visible { border-color: var(--green); box-shadow: 0 0 0 3px rgba(7,148,94,.15); }
.create-store-fields input[aria-invalid="true"] { border-color: #b83c36; }
.create-store-fields small { color: #a02e29; font-size: .78rem; font-weight: 400; }
.create-store-field-wide { grid-column: 1 / -1; }
.create-store-error-summary, .create-store-submit-error { margin-bottom: 1.5rem; padding: 1rem 1.2rem; border-left: 3px solid #b83c36; background: #fff1ef; color: #762824; font-size: .9rem; line-height: 1.5; }
.create-store-error-summary { display: grid; gap: .35rem; }
.create-store-error-summary a, .create-store-submit-error a { color: inherit; text-decoration: underline; }
.create-store-submit { margin-top: 2rem; }
.create-store-submit button, .create-store-contact { display: inline-flex; align-items: center; justify-content: center; gap: 1rem; min-height: 54px; padding: .9rem 1.4rem; border: 0; border-radius: 9px; background: var(--green); color: white; cursor: pointer; font: inherit; font-weight: 600; text-decoration: none; transition: background .2s; }
.create-store-submit button:hover, .create-store-contact:hover { background: #067a4e; }
.create-store-submit button:focus-visible, .create-store-contact:focus-visible, .create-store-back:focus-visible, .create-store-compare:focus-visible { outline: 3px solid var(--green); outline-offset: 3px; }
.create-store-submit button:disabled { cursor: wait; opacity: .72; }
.create-store-submit p { display: flex; align-items: center; gap: .5rem; margin-top: 1rem; color: var(--muted); font-size: .8rem; }
.create-store-notice { margin-top: 2.5rem; padding: 1.5rem; border: 1px solid #d3dfd8; border-radius: 14px; background: white; color: var(--muted); line-height: 1.6; }
.create-store-notice h3 { margin-bottom: .5rem; color: var(--ink-2); font-size: 1.2rem; }
.create-store-contact { margin-top: 1.5rem; }
@media (max-width: 900px) { .create-store-layout { grid-template-columns: 1fr; }.create-store-intro { grid-column: auto; }.create-store-summary { position: static; }.create-store-form-area { margin-top: 3rem; } }
@media (max-width: 600px) { .create-store-main { padding-top: 7rem; }.create-store-back { margin-bottom: 2rem; }.create-store-intro { margin-bottom: 2.5rem; }.create-store-intro h1 { font-size: clamp(3rem, 13vw, 4.5rem); }.create-store-fields { grid-template-columns: 1fr; }.create-store-field-wide { grid-column: auto; }.create-store-submit button { width: 100%; }.create-store-submit p { align-items: flex-start; } }
</style>
