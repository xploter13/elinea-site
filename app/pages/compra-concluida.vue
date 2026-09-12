<script setup lang="ts">import {ArrowRight, CircleCheckBig} from '@lucide/vue';

useHead({title: 'Compra recebida — Elínea'})</script>
<template>
  <main class="result-page">
    <section>
      <CircleCheckBig :size="58"/>
      <span>Solicitação recebida</span>
      <h1>Seu pagamento está sendo confirmado.</h1>
      <p>Assim que a Stripe confirmar o pagamento, nossa equipe dará andamento à implantação. Você receberá cada
        atualização no e-mail informado.</p>
      <UiButton class="mt-6" variant="solid" to="/">Voltar ao site<template #icon><ArrowRight :size="18"/></template></UiButton>
    </section>
  </main>
</template>
