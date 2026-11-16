<script setup lang="ts">
import ContractingTabs from '~/components/pricing/ContractingTabs.vue'
import type { ContractingMode } from '~/data/contracting'
import PlansCarousel from '~/components/pricing/PlansCarousel.vue'
import type { BillingInterval, Plan } from '~/data/plans'

const props = defineProps<{ plans: Plan[], loading?: boolean, error?: boolean, mode?: ContractingMode }>()
const emit = defineEmits<{ select: [plan: Plan, interval: BillingInterval], retry: [], 'update:mode': [mode: ContractingMode] }>()
const cycle = ref<BillingInterval>('monthly')
const hasAnnual = computed(() => props.plans.some(plan => plan.yearly_amount !== null))
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
      <ContractingTabs v-if="mode" :model-value="mode" @update:model-value="emit('update:mode', $event)" />
      <div :id="mode ? 'contracting-plans' : undefined" :role="mode ? 'tabpanel' : undefined"
           :aria-labelledby="mode ? `tab-${mode}` : undefined" :aria-describedby="mode ? `description-${mode}` : undefined"
           :tabindex="mode ? 0 : undefined">
      <PlansCarousel :plans="plans" :loading="loading" :error="error" :interval="cycle" :mode="mode"
                     @retry="emit('retry')" @select="(plan, interval) => emit('select', plan, interval)" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.plans-carousel { min-width: 0; }
</style>
