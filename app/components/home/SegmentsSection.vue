<script setup lang="ts">
import heroUrl from '~/assets/images/h3-slider-img-1.webp'
import merchantUrl from '~/assets/images/elinea-merchant-operation.png'
import productUrl from '~/assets/images/elinea-hero-studio.png'
import { Building2, LayoutTemplate, Pill, Store } from '@lucide/vue'

const active = ref(0)
const segments = [
  { icon: Pill, title: 'Farmácias de manipulação', note: 'Catálogo claro e atendimento conectado.', image: merchantUrl },
  { icon: Store, title: 'Lojas especializadas', note: 'Uma vitrine à altura da sua curadoria.', image: heroUrl },
  { icon: Building2, title: 'Pequenos varejistas', note: 'Estrutura digital sem pesar na rotina.', image: merchantUrl },
  { icon: LayoutTemplate, title: 'Marcas próprias', note: 'Sua identidade conduz toda a experiência.', image: productUrl },
]
</script>

<template>
  <section id="solucoes" class="chapter segments">
    <div class="site-container segments-layout">
      <div class="segments-copy reveal-copy">
        <p class="site-label">Feito para diferentes realidades</p>
        <h2 class="site-title">O mesmo núcleo.<br>Diferentes<br>negócios.</h2>
        <p class="site-copy">Do pequeno varejo às operações especializadas, o Elínea se adapta ao seu segmento e acompanha o crescimento.</p>
      </div>
      <div class="segment-panels" @mouseleave="active = 0">
        <article v-for="(segment, index) in segments" :key="segment.title" class="segment-panel" :class="{ 'is-active': active === index }" @mouseenter="active = index" @focusin="active = index">
          <img :src="segment.image" :alt="`Ambiente representativo de ${segment.title}`" loading="lazy">
          <span class="segment-panel__shade"></span>
          <div class="segment-panel__content"><component :is="segment.icon" :size="20" aria-hidden="true" /><h3>{{ segment.title }}</h3><p>{{ segment.note }}</p></div>
        </article>
      </div>
    </div>
  </section>
</template>
