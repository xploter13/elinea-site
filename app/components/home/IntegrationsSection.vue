<script setup lang="ts">
import { BarChart3, CreditCard, MessageCircle, Network, Radio, Share2 } from '@lucide/vue'

const integrations = [
  { icon: MessageCircle, name: 'WhatsApp', status: 'Disponível', available: true, pos: 'one' },
  { icon: CreditCard, name: 'Fiserv', status: 'Em evolução', available: false, pos: 'two' },
  { icon: BarChart3, name: 'Google Analytics', status: 'Em evolução', available: false, pos: 'three' },
  { icon: Share2, name: 'Meta', status: 'Em evolução', available: false, pos: 'four' },
  { icon: Radio, name: 'Gateways', status: 'Em evolução', available: false, pos: 'five' },
]
</script>

<template>
  <section id="integracoes" class="chapter integrations">
    <div class="site-container split-layout">
      <div class="chapter-copy reveal-copy">
        <p class="site-label">Integrações que acompanham o produto</p>
        <h2 class="site-title">Feito para vender.<br>Construído para<br>evoluir.</h2>
        <p class="site-copy">Uma base preparada para conectar canais, pagamentos e dados sem fragmentar a operação.</p>
        <div class="status-key"><span><i class="available"></i>Disponível</span><span><i></i>Em evolução</span></div>
      </div>
      <div class="integration-map" aria-label="Mapa de integrações e seus estados">
        <svg viewBox="0 0 700 620" aria-hidden="true"><path d="M350 310 L110 115 M350 310 L585 105 M350 310 L620 330 M350 310 L510 535 M350 310 L110 500" /></svg>
        <div class="integration-core"><Network :size="30" /><strong>ELÍNEA</strong><small>Núcleo preparado</small></div>
        <article v-for="item in integrations" :key="item.name" class="integration-node" :class="[`integration-node--${item.pos}`, { 'is-available': item.available }]">
          <component :is="item.icon" :size="20" aria-hidden="true" /><span><strong>{{ item.name }}</strong><small>{{ item.status }}</small></span>
        </article>
      </div>
    </div>
  </section>
</template>
