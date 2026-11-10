<script setup lang="ts">
const privacy = useRuntimeConfig().public.privacy
</script>

<template>
  <p class="privacy-notice full">
    Usamos os dados informados para receber sua solicitação, dar continuidade à contratação e preparar seu acesso.
    <span v-if="privacy.cpfPurpose">{{ privacy.cpfPurpose }}</span>
    O pagamento é realizado pela Stripe. Consulte os detalhes e saiba como exercer seus direitos na
    <NuxtLink to="/privacidade">Política de privacidade</NuxtLink>.
  </p>
</template>

<style scoped>
.privacy-notice { grid-column: 1 / -1; margin: 1rem 0; color: var(--muted); font-size: .85rem; line-height: 1.7; }
.privacy-notice a { color: var(--ink-2); text-decoration: underline; text-underline-offset: 3px; }
.privacy-notice a:focus-visible { outline: 2px solid var(--green); outline-offset: 3px; }
</style>
