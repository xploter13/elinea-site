<script setup lang="ts">
import { ArrowUpRight, Headphones, Layers3, Store } from '@lucide/vue'

const essentials = [
  {
    icon: Store,
    title: 'Uma loja com a sua cara',
    description: 'Uma presença digital profissional para apresentar seus produtos e receber pedidos.',
  },
  {
    icon: Layers3,
    title: 'Uma rotina mais conectada',
    description: 'Catálogo, pedidos e clientes no mesmo lugar, com menos tarefas espalhadas.',
  },
  {
    icon: Headphones,
    title: 'Gente para contar junto',
    description: 'Suporte para ajudar você a seguir em frente quando precisar.',
  },
]
</script>

<template>
  <section id="operacao" class="chapter operation" aria-labelledby="operation-heading">
    <div class="site-container operation-layout">
      <div class="operation-intro reveal-copy">
        <p class="site-label">Tecnologia a favor de quem faz acontecer</p>
        <h2 id="operation-heading" class="operation-heading">Seu negócio<br>em primeiro<br>lugar.</h2>
        <div class="operation-intro__footer">
          <p>Você conhece o seu negócio. A Elínea reúne a estrutura digital para você vender e cuidar da operação com mais clareza.</p>
          <a class="operation-cta" href="#planos">Criar minha loja <ArrowUpRight :size="19" aria-hidden="true" /></a>
        </div>
      </div>

      <div class="operation-panel">
        <div class="operation-panel__top">
          <p>O digital trabalha<br>com você.</p>
        </div>
        <div class="operation-panel__list">
          <article v-for="item in essentials" :key="item.title" class="operation-essential">
            <span class="operation-essential__icon"><component :is="item.icon" :size="22" :stroke-width="1.8" aria-hidden="true" /></span>
            <div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
