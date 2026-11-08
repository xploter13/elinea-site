<script setup lang="ts">
import PlansCarousel from '~/components/pricing/PlansCarousel.vue'
import type { BillingInterval, Plan } from '~/data/plans'

const props = defineProps<{ plans: Plan[], loading?: boolean, error?: boolean }>()
const emit = defineEmits<{ select: [plan: Plan, interval: BillingInterval], retry: [] }>()
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
      <PlansCarousel :plans="plans" :loading="loading" :error="error" :interval="cycle"
                     @retry="emit('retry')" @select="(plan, interval) => emit('select', plan, interval)" />
    </div>
  </section>
</template>

<style scoped>
.plans-carousel { min-width: 0; }
</style>
