<script setup lang="ts">
import {ArrowLeft, ArrowRight, Check, ChevronDown} from '@lucide/vue'
import {MarketingButton} from '@elinea/ui/marketing'
import {formatPlanMoney, type BillingInterval, type Plan} from '~/data/plans'

const props = defineProps<{ plans: Plan[], loading?: boolean, error?: boolean }>()
const emit = defineEmits<{ select: [plan: Plan, interval: BillingInterval], retry: [] }>()
const cycle = ref<BillingInterval>('monthly')
const expanded = ref<number[]>([])
const rail = ref<HTMLElement | null>(null)

const hasAnnual = computed(() => props.plans.some(plan => plan.yearly_amount !== null))
const amount = (plan: Plan) => cycle.value === 'yearly' ? plan.yearly_amount : plan.monthly_amount
const checkoutAvailable = (plan: Plan) => cycle.value === 'yearly' ? plan.can_checkout_yearly : plan.can_checkout_monthly
const implementationLabel = (plan: Plan) => plan.implementation_amount === null ? 'Sob consulta' : plan.implementation_amount === 0 ? 'Grátis' : formatPlanMoney(plan.implementation_amount, plan.currency)
const isExpanded = (id: number) => expanded.value.includes(id)
const toggle = (id: number) => expanded.value = isExpanded(id) ? expanded.value.filter(item => item !== id) : [...expanded.value, id]
const visible = (plan: Plan) => isExpanded(plan.id) ? plan.features : plan.features.slice(0, 6)
const scroll = (direction: -1 | 1) => rail.value?.scrollBy({
  left: direction * (rail.value.clientWidth * .72),
  behavior: 'smooth'
})
</script>

<template>
  <section id="planos" class="chapter pricing">
    <div class="site-container">
      <div class="pricing-heading reveal-copy">
        <div><p class="site-label">Planos para o seu momento</p>
          <h2 class="site-title">Encontre o <br> seu plano</h2></div>
        <div class="pricing-intro"><p class="site-copy">Planos claros para começar hoje e evoluir quando a operação
          pedir mais.</p>
          <div v-if="hasAnnual" class="billing-toggle" aria-label="Periodicidade dos preços">
            <button :class="{ active: cycle === 'monthly' }" type="button" @click="cycle = 'monthly'">Mensal</button>
            <button :class="{ active: cycle === 'yearly' }" type="button" @click="cycle = 'yearly'">Anual</button>
          </div>
        </div>
      </div>

      <div v-if="props.loading && !props.plans.length" class="pricing-state" role="status">Carregando planos e preços...</div>
      <div v-else-if="props.error" class="pricing-state" role="alert">
        <p>Não foi possível carregar os planos agora.</p>
        <button type="button" @click="emit('retry')">Tentar novamente</button>
      </div>
      <div v-else-if="!props.plans.length" class="pricing-state" role="status">Nenhum plano está disponível para contratação no momento.</div>
      <div v-else ref="rail" class="pricing-rail" tabindex="0" aria-label="Planos Elínea">
        <article v-for="plan in props.plans" :key="plan.id" class="plan-card"
                 :class="[{ 'is-featured': plan.featured }, `plan-card--${plan.tone}`]">
          <span v-if="plan.featured" class="plan-badge">Recomendado</span>
          <h3>{{ plan.name }}</h3>
          <p class="plan-description">{{ plan.description }}</p>
          <div class="plan-price" v-if="amount(plan) !== null"><small>{{ plan.currency === 'brl' ? 'R$' : plan.currency.toUpperCase() }}</small><strong>{{ formatPlanMoney(amount(plan)!, plan.currency).replace(/^[^\d]+/, '') }}</strong><span>/{{ cycle === 'yearly' ? 'ano' : 'mês' }}</span></div>
          <div v-else class="plan-price plan-price--custom"><strong>{{ cycle === 'yearly' && plan.monthly_amount !== null ? 'Anual indisponível' : 'Sob consulta' }}</strong></div>
          <p class="implementation">Implantação: <b>{{ implementationLabel(plan) }}</b></p>
          <MarketingButton class="plan-action" :variant="plan.featured ? 'primary' : 'outline'" type="button"
                           @click="emit('select', plan, cycle)">
            {{ checkoutAvailable(plan) ? 'Escolher plano' : 'Falar com especialista' }}
            <template #icon>
              <ArrowRight :size="16"/>
            </template>
          </MarketingButton>
          <p class="feature-label">Módulos e recursos cadastrados</p>
          <ul>
            <li v-for="feature in visible(plan)" :key="feature">
              <Check :size="15" aria-hidden="true"/>
              {{ feature }}
            </li>
          </ul>
          <button v-if="plan.features.length > 6" class="feature-toggle" type="button"
                  :aria-expanded="isExpanded(plan.id)" @click="toggle(plan.id)">
            {{ isExpanded(plan.id) ? 'Ver menos' : `Ver todos (${plan.features.length})` }}
            <ChevronDown :size="15"/>
          </button>
        </article>
      </div>
      <div v-if="props.plans.length" class="pricing-controls">
        <button type="button" aria-label="Planos anteriores" @click="scroll(-1)">
          <ArrowLeft :size="20"/>
        </button>
        <button type="button" aria-label="Próximos planos" @click="scroll(1)">
          <ArrowRight :size="20"/>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pricing-state { padding: 2rem; color: var(--muted); }
.pricing-state button { margin-top: .75rem; color: var(--green); font: inherit; font-weight: 600; text-decoration: underline; }
</style>
