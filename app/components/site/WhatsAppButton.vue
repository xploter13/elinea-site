<script setup lang="ts">
import whatsappIconUrl from '~/assets/images/whatsapp.svg'
const route = useRoute()
const whatsappUrl = `https://wa.me/5524998164753?text=${encodeURIComponent('Olá! Gostaria de saber mais sobre a Elínea.')}`
</script>

<template>
  <a
    v-if="route.path !== '/apresentacao'"
    class="whatsapp-float"
    :href="whatsappUrl"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Falar com a Elínea pelo WhatsApp (abre em nova aba)"
    title="Fale com a Elínea pelo WhatsApp"
  >
    <img :src="whatsappIconUrl" width="28" height="28" alt="" aria-hidden="true">
  </a>
</template>

<style scoped>
.whatsapp-float {
  position: fixed;
  z-index: 40;
  right: max(1.5rem, env(safe-area-inset-right));
  bottom: max(1.5rem, calc(env(safe-area-inset-bottom) + 1rem), var(--cookie-banner-height, 0px));
  display: grid;
  width: 56px;
  height: 56px;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 20%);
  border-radius: 50%;
  background: var(--green);
  color: white;
  box-shadow: 0 6px 20px rgb(7 17 15 / 20%);
  transition: background-color .2s ease, transform .2s ease;
}
.whatsapp-float img { display: block; filter: brightness(0) invert(1); }
.whatsapp-float:hover { background: var(--ink-2); transform: translateY(-2px); }
.whatsapp-float:focus-visible { outline: 3px solid var(--green-bright); outline-offset: 4px; }
@media (max-width: 767px) {
  .whatsapp-float { right: max(1rem, env(safe-area-inset-right)); }
}
@media (prefers-reduced-motion: reduce) {
  .whatsapp-float { transition: none; }
  .whatsapp-float:hover { transform: none; }
}
@media print {
  .whatsapp-float { display: none; }
}
</style>
