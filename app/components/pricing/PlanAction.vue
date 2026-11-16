<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'
import { MarketingButton } from '@elinea/ui/marketing'
import { contractingCta, type ContractingMode } from '~/data/contracting'
import { whatsappContactUrl } from '~/data/contact'
import type { BillingInterval, Plan } from '~/data/plans'

const props = defineProps<{
  plan: Plan
  interval: BillingInterval
  mode?: ContractingMode
  compact?: boolean
  linkForPlan?: (plan: Plan, interval: BillingInterval) => string
}>()
const emit = defineEmits<{ select: [] }>()
const label = computed(() => {
  if (props.mode) return contractingCta(props.plan, props.mode)
  const available = props.interval === 'yearly' ? props.plan.can_checkout_yearly : props.plan.can_checkout_monthly
  return available ? 'Escolher plano' : 'Falar com especialista'
})
const href = computed(() => {
  const { plan, mode } = props
  if (mode && (mode === 'especialista' || plan.monthly_amount === null)) {
    return whatsappContactUrl(plan.monthly_amount === null
      ? `Olá! Gostaria de solicitar um orçamento para o plano ${plan.name} do Elínea na modalidade ${mode === 'especialista' ? 'Com especialista' : 'Autonomia'}.`
      : `Olá! Tenho interesse no plano ${plan.name} do Elínea com acompanhamento de um especialista. Gostaria de saber mais sobre a implantação.`)
  }
  return props.linkForPlan?.(plan, props.interval)
})
</script>

<template>
  <a v-if="linkForPlan && (!mode || compact)" :href="href" class="plan-action plan-action--link" target="_blank" rel="noopener noreferrer">
    {{ label }}<ArrowRight :size="16" aria-hidden="true" />
  </a>
  <MarketingButton v-else class="plan-action" :variant="plan.featured ? 'primary' : 'outline'"
                   :href="href" :target="href ? '_blank' : undefined" :rel="href ? 'noopener noreferrer' : undefined"
                   type="button" @click="!href && emit('select')">
    {{ label }}
    <template #icon><ArrowRight :size="16" /></template>
  </MarketingButton>
</template>
