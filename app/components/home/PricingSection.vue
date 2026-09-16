<script setup lang="ts">
import { ArrowLeft, ArrowRight, Check, ChevronDown } from '@lucide/vue'
import { MarketingButton } from '@elinea/ui/marketing'
import type { Plan } from '~/data/plans'

const props = defineProps<{ plans: Plan[] }>()
const emit = defineEmits<{ select: [plan: Plan] }>()
const cycle = ref<'monthly' | 'annual'>('monthly')
const expanded = ref<number[]>([])
const rail = ref<HTMLElement | null>(null)

const money = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value / 100)
const amount = (plan: Plan) => (cycle.value === 'annual' ? (plan.monthly_amount || 0) * 12 : plan.monthly_amount || 0)
const isExpanded = (id: number) => expanded.value.includes(id)
const toggle = (id: number) => expanded.value = isExpanded(id) ? expanded.value.filter(item => item !== id) : [...expanded.value, id]
const visible = (plan: Plan) => isExpanded(plan.id) ? plan.features : plan.features.slice(0, 6)
const scroll = (direction: -1 | 1) => rail.value?.scrollBy({ left: direction * (rail.value.clientWidth * .72), behavior: 'smooth' })
</script>

<template>
  <section id="planos" class="chapter pricing">
    <div class="site-container">
      <div class="pricing-heading reveal-copy">
        <div><p class="site-label">Planos para o seu momento</p><h2 class="site-title">Cresça no<br>seu ritmo.</h2></div>
        <div class="pricing-intro"><p class="site-copy">Planos claros para começar hoje e evoluir quando a operação pedir mais.</p>
          <div class="billing-toggle" aria-label="Periodicidade dos preços">
            <button :class="{ active: cycle === 'monthly' }" type="button" @click="cycle = 'monthly'">Mensal</button>
            <button :class="{ active: cycle === 'annual' }" type="button" @click="cycle = 'annual'">Anual</button>
          </div>
        </div>
      </div>

      <div ref="rail" class="pricing-rail" tabindex="0" aria-label="Planos Elínea">
        <article v-for="plan in props.plans" :key="plan.id" class="plan-card" :class="[{ 'is-featured': plan.featured }, `plan-card--${plan.tone}`]">
          <span v-if="plan.featured" class="plan-badge">Recomendado</span>
          <h3>{{ plan.name }}</h3><p class="plan-description">{{ plan.description }}</p>
          <div class="plan-price" v-if="plan.monthly_amount !== null"><small>R$</small><strong>{{ money(amount(plan)).replace('R$', '').trim() }}</strong><span>/{{ cycle === 'annual' ? 'ano' : 'mês' }}</span></div>
          <div v-else class="plan-price plan-price--custom"><strong>Sob consulta</strong></div>
          <p class="implementation">Implantação: <b>{{ plan.implementation_label }}</b></p>
          <MarketingButton class="plan-action" :variant="plan.featured ? 'primary' : 'outline'" type="button" @click="emit('select', plan)">{{ plan.monthly_amount === null ? 'Falar com especialista' : 'Escolher plano' }}<template #icon><ArrowRight :size="16" /></template></MarketingButton>
          <p class="feature-label">{{ plan.features_label || 'Inclui' }}</p>
          <ul><li v-for="feature in visible(plan)" :key="feature"><Check :size="15" aria-hidden="true" />{{ feature }}</li></ul>
          <button v-if="plan.features.length > 6" class="feature-toggle" type="button" :aria-expanded="isExpanded(plan.id)" @click="toggle(plan.id)">{{ isExpanded(plan.id) ? 'Ver menos' : `Ver todos (${plan.features.length})` }}<ChevronDown :size="15" /></button>
          <p v-if="plan.note" class="plan-note">{{ plan.note }}</p>
        </article>
      </div>
      <div class="pricing-controls"><button type="button" aria-label="Planos anteriores" @click="scroll(-1)"><ArrowLeft :size="20" /></button><button type="button" aria-label="Próximos planos" @click="scroll(1)"><ArrowRight :size="20" /></button></div>
    </div>
  </section>
</template>
