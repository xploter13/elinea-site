<script setup lang="ts">
import { ArrowLeft, ArrowRight, Check, ChevronDown } from '@lucide/vue'
import PlanAction from '~/components/pricing/PlanAction.vue'
import { implementationAmount, productLimitLabel, type ContractingMode } from '~/data/contracting'
import { formatPlanMoney, type BillingInterval, type Plan } from '~/data/plans'

const props = withDefaults(defineProps<{
  plans: Plan[]
  loading?: boolean
  error?: boolean
  interval?: BillingInterval
  presentation?: boolean
  mode?: ContractingMode
  linkForPlan?: (plan: Plan, interval: BillingInterval) => string
}>(), { interval: 'monthly' })
const emit = defineEmits<{ select: [plan: Plan, interval: BillingInterval], retry: [] }>()
const expanded = ref<string[]>([])
const rail = ref<HTMLElement | null>(null)
const hydrated = ref(false)
onMounted(() => hydrated.value = true)

const amount = (plan: Plan) => props.interval === 'yearly' ? plan.yearly_amount : plan.monthly_amount
const implementationValue = (plan: Plan) => props.mode ? implementationAmount(plan, props.mode) : plan.implementation_amount
const implementationLabel = (plan: Plan) => implementationValue(plan) === null ? 'Sob consulta' : implementationValue(plan) === 0 ? 'Grátis' : formatPlanMoney(implementationValue(plan)!, plan.currency)
const isExpanded = (slug: string) => expanded.value.includes(slug)
const toggle = (slug: string) => expanded.value = isExpanded(slug) ? expanded.value.filter(item => item !== slug) : [...expanded.value, slug]
const visible = (plan: Plan) => props.presentation || isExpanded(plan.slug) ? plan.features : plan.features.slice(0, 6)
const featureId = (slug: string) => `${props.presentation ? 'presentation' : 'pricing'}-features-${slug}`
const scroll = (direction: -1 | 1) => rail.value?.scrollBy({
  left: direction * (rail.value.clientWidth * .72),
  behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
})
</script>

<template>
  <div class="plans-carousel" :class="{ 'plans-carousel--presentation': presentation, 'plans-carousel--modalities': Boolean(mode) }">
    <div v-if="(!hydrated || loading) && !plans.length" class="pricing-state" role="status">Carregando planos e preços...</div>
    <div v-else-if="error && !plans.length" class="pricing-state" role="alert">
      <p>Não foi possível carregar os planos agora.</p>
      <button type="button" @click="emit('retry')">Tentar novamente</button>
    </div>
    <div v-else-if="!plans.length" class="pricing-state" role="status">Nenhum plano está disponível para contratação no momento.</div>
    <div v-else ref="rail" class="pricing-rail" tabindex="0" aria-label="Planos Elínea">
      <article v-for="plan in plans" :key="plan.slug" class="plan-card" :class="[{ 'is-featured': plan.featured }, `plan-card--${plan.tone}`]">
        <span v-if="plan.featured" class="plan-badge">Recomendado</span>
        <h3>{{ plan.name }}</h3>
        <p v-if="!mode" class="plan-description">{{ plan.description }}</p>
        <div v-if="amount(plan) !== null" class="plan-price"><small>{{ plan.currency === 'brl' ? 'R$' : plan.currency.toUpperCase() }}</small><strong>{{ formatPlanMoney(amount(plan)!, plan.currency).replace(/^[^\d]+/, '') }}</strong><span>/{{ interval === 'yearly' ? 'ano' : 'mês' }}</span></div>
        <div v-else class="plan-price plan-price--custom"><strong>{{ interval === 'yearly' && plan.monthly_amount !== null ? 'Anual indisponível' : 'Sob consulta' }}</strong></div>
        <p v-if="mode" class="plan-limit">{{ productLimitLabel(plan) }}</p>
        <p class="implementation" :class="{ 'implementation--free': mode && implementationValue(plan) === 0 }">
          <template v-if="mode && implementationValue(plan) === 0"><b>Implantação grátis</b></template>
          <template v-else>{{ mode === 'especialista' && plan.specialist_implementation ? 'Implantação com especialista' : 'Implantação' }}: <b>{{ implementationLabel(plan) }}</b></template>
          <small v-if="mode">{{ implementationValue(plan) === null ? 'Escopo e valores definidos individualmente' : implementationValue(plan) === 0 ? 'Configure sua loja no seu ritmo' : 'Pagamento único' }}</small>
        </p>
        <p v-if="mode" class="plan-description">{{ mode === 'especialista' && plan.slug === 'personalizado' ? 'Uma solução sob medida para sua empresa, com acompanhamento especializado desde o planejamento até a implementação dos recursos necessários.' : plan.description }}</p>
        <PlanAction v-if="!mode" :plan="plan" :interval="interval" :link-for-plan="linkForPlan"
                    @select="emit('select', plan, interval)" />
        <p class="feature-label">{{ plan.feature_label ?? 'Inclui' }}</p>
        <ul :id="featureId(plan.slug)">
          <li v-for="feature in visible(plan)" :key="feature"><Check :size="15" aria-hidden="true" />{{ feature }}</li>
        </ul>
        <button v-if="!presentation && plan.features.length > 6" class="feature-toggle" type="button" :aria-expanded="isExpanded(plan.slug)" :aria-controls="featureId(plan.slug)" @click="toggle(plan.slug)">
          {{ isExpanded(plan.slug) ? 'Ver menos' : `Ver todos (${plan.features.length})` }}<ChevronDown :size="15" />
        </button>
        <div v-if="mode" class="implementation-details">
          <h4 class="implementation-details__title">Sobre a implantação</h4>
          <div class="implementation-details__content">
            <div :class="{ 'is-active': mode === 'autonomia' }" :aria-hidden="mode !== 'autonomia'">
              <p>{{ plan.monthly_amount === null ? 'O escopo de implantação e os valores serão definidos individualmente após análise das necessidades do negócio.' : 'Configure sua loja por conta própria. Você não precisa contratar um especialista para utilizar a plataforma.' }}</p>
            </div>
            <div :class="{ 'is-active': mode === 'especialista' }" :aria-hidden="mode !== 'especialista'">
              <ul v-if="plan.specialist_implementation">
                <li v-for="service in plan.specialist_implementation.services" :key="service"><Check :size="15" aria-hidden="true" />{{ service }}</li>
              </ul>
              <p v-else>Os serviços, o escopo de implantação e os valores serão definidos individualmente após análise das necessidades do negócio.</p>
            </div>
          </div>
        </div>
        <p v-if="plan.commercial_note" class="plan-commercial-note">{{ plan.commercial_note }}</p>
        <PlanAction v-if="mode" :plan="plan" :interval="interval" :mode="mode"
                    @select="emit('select', plan, interval)" />
      </article>
    </div>
    <div v-if="plans.length > 3" class="pricing-controls">
      <button type="button" aria-label="Planos anteriores" @click="scroll(-1)"><ArrowLeft :size="20" /></button>
      <button type="button" aria-label="Próximos planos" @click="scroll(1)"><ArrowRight :size="20" /></button>
    </div>
  </div>
</template>

<style scoped>

.plans-carousel--modalities .pricing-rail { margin-top: 2rem; }
.plans-carousel--modalities .plan-card { display: flex; flex-direction: column; }
.plans-carousel--modalities h3 { order: 0; }
.plans-carousel--modalities .plan-price { order: 1; margin-top: 1rem; }
.plan-limit { order: 2; margin-top: 1rem; font-size: .9rem; font-weight: 600; }
.plans-carousel--modalities .implementation { order: 3; min-height: 5.4rem; margin-top: 1rem; padding-block: .75rem; border-block: 1px solid var(--line); line-height: 1.5; }
.plans-carousel--modalities .implementation small { display: block; margin-top: .25rem; font-size: .8rem; }
.plans-carousel--modalities .implementation--free b { color: var(--green); }
.plans-carousel--modalities .is-featured .feature-toggle { color: var(--green-bright); }
.plans-carousel--modalities .is-featured .plan-price > span { color: rgba(255,255,255,.8); }
.plans-carousel--modalities .is-featured .implementation { color: rgba(255,255,255,.8); border-color: rgba(255,255,255,.18); }
.plans-carousel--modalities .is-featured .implementation--free b { color: var(--green-bright); }
.plans-carousel--modalities .plan-description { order: 4; min-height: 7rem; margin-top: 1.25rem; }
.plans-carousel--modalities .feature-label { order: 5; margin-top: 1rem; }
.plans-carousel--modalities .plan-card > ul { order: 6; }
.plans-carousel--modalities .feature-toggle { order: 7; align-self: start; min-height: 44px; font-size: .85rem; }
.implementation-details { order: 8; margin-top: 1.25rem; margin-bottom: 1.25rem; font-size: .85rem; line-height: 1.55; }
.implementation-details__title { margin: 0 0 .75rem; color: inherit; font-size: inherit; font-weight: 600; }
.implementation-details__content { display: grid; }
.implementation-details__content > div { grid-area: 1 / 1; visibility: hidden; }
.implementation-details__content > .is-active { visibility: visible; }
.plans-carousel--modalities .plan-commercial-note { order: 9; margin-bottom: 1.25rem; }
.plans-carousel--modalities .plan-action { order: 10; margin-top: auto; min-height: 60px; }
.plans-carousel--modalities :is(a, button, summary):focus-visible { outline: 3px solid var(--green); outline-offset: 4px; }
.plans-carousel--modalities .is-featured :is(a, button, summary):focus-visible { outline-color: var(--green-bright); }

.plan-action.marketing-button { min-height: 60px; }
.plan-action :deep(.marketing-button__label) { flex: 1; min-width: 0; }
.plan-action :deep(.marketing-button__icon) { flex-shrink: 0; margin-left: auto; }
.pricing-state { padding: 2rem; color: var(--muted); }
.pricing-state button { margin-top: .75rem; color: var(--green); font: inherit; font-weight: 600; text-decoration: underline; }
.plan-commercial-note { margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--line); color: var(--muted); font-size: .85rem; line-height: 1.6; }
.plan-action--link { display: flex; min-height: 40px; align-items: center; justify-content: space-between; gap: 14px; padding: 10px 14px; border: 1px solid var(--line); border-radius: 7px; color: var(--ink); font-size: 14px; font-weight: 500; text-decoration: none; }
.is-featured .plan-action--link { border-color: var(--green); background: var(--green); color: white; }
.plans-carousel--presentation { min-width: 0; min-height: 0; }
.plans-carousel--presentation .pricing-rail { grid-auto-columns: minmax(290px, 1fr); gap: 1cqw; max-height: 100%; margin: 0; padding: 12px 0 0; }
.plans-carousel--presentation .plan-card { display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: 'name price' 'description description' 'implementation label' 'features features' 'note note' 'action action'; grid-template-rows: auto auto auto auto 1fr auto; gap: 10px 8px; min-height: 0; padding: 1.25cqw; border-radius: 12px; box-shadow: none; }
.plans-carousel--presentation h3 { grid-area: name; align-self: center; color: inherit; font-family: inherit; font-size: clamp(22px, 1.7cqw, 28px); font-weight: 600; letter-spacing: -.035em; }
.plans-carousel--presentation .is-featured h3 { color: white; }
.plans-carousel--presentation .is-featured .feature-toggle { color: var(--green-bright); }
.plans-carousel--presentation .is-featured .implementation, .plans-carousel--presentation .is-featured .plan-price > span { color: rgba(255,255,255,.8); }
.plans-carousel--presentation .plan-badge { top: -10px; right: 18px; padding: 4px 10px; font-size: 12px; }
.plans-carousel--presentation .plan-description { grid-area: description; min-height: 4.35em; margin: 0; font-size: 14px; line-height: 1.45; }
.plans-carousel--presentation .plan-price { grid-area: price; min-height: 0; align-items: baseline; margin: 0; }
.plans-carousel--presentation .plan-price strong { font-family: inherit; font-size: clamp(30px, 2.45cqw, 40px); }
.plans-carousel--presentation .plan-price--custom strong { font-size: clamp(25px, 2.1cqw, 34px); }
.plans-carousel--presentation .plan-price small, .plans-carousel--presentation .plan-price > span { margin-bottom: 3px; font-size: 14px; }
.plans-carousel--presentation .implementation { grid-area: implementation; margin: 0; font-size: 14px; }
.plans-carousel--presentation .plan-action { grid-area: action; min-height: 36px; margin: 0; padding: 8px 12px; }
.plans-carousel--presentation .feature-label { grid-area: label; align-self: center; margin: 0; font-size: 14px; }
.plans-carousel--presentation ul { grid-area: features; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 5px 14px; margin: 0; }
.plans-carousel--presentation li { font-size: 14px; line-height: 1.3; }
.plans-carousel--presentation li svg { display: none; }
.plans-carousel--presentation .feature-toggle { min-height: 30px; margin-top: 8px; font-size: 14px; }
.plans-carousel--presentation .plan-commercial-note { grid-area: note; align-self: start; margin: 0; padding-top: 8px; font-size: 14px; line-height: 1.35; }
.plans-carousel--presentation .pricing-controls { margin-top: 12px; }
@media (min-width: 1101px) and (max-width: 1400px) {
  .plans-carousel--presentation .plan-card { row-gap: 8px; }
  .plans-carousel--presentation .plan-description { line-height: 1.4; }
}
@media (max-width: 1100px) {
  .plans-carousel--presentation .pricing-rail { gap: 16px; }
  .plans-carousel--presentation .plan-card { padding: 22px; }
  .plans-carousel--presentation .plan-card { grid-template-columns: 1fr; grid-template-areas: 'name' 'price' 'description' 'implementation' 'label' 'features' 'note' 'action'; grid-template-rows: auto auto auto auto auto auto 1fr auto; }
  .plans-carousel--presentation ul { grid-template-columns: 1fr; }
}
@media print {
  .plans-carousel--presentation .pricing-controls, .plans-carousel--presentation .feature-toggle { display: none; }
  .plans-carousel--presentation .pricing-rail { grid-auto-columns: minmax(0, 1fr); overflow: visible; }
}
</style>
