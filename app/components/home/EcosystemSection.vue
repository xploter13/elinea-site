<script setup lang="ts">
import { BarChart3, Bot, CreditCard, MessageCircle, Package, ShoppingBag, Store, Users } from '@lucide/vue'

const modules = [
  { icon: Store, label: 'Loja virtual', pos: 'one' },
  { icon: Package, label: 'Catálogo', pos: 'two' },
  { icon: CreditCard, label: 'Pagamentos', pos: 'three' },
  { icon: ShoppingBag, label: 'Pedidos', pos: 'four' },
  { icon: Users, label: 'Clientes', pos: 'five' },
  { icon: BarChart3, label: 'Relatórios', pos: 'six' },
  { icon: Bot, label: 'Automação', pos: 'seven' },
  { icon: MessageCircle, label: 'WhatsApp', pos: 'eight' },
]
</script>

<template>
  <section id="ecossistema" class="chapter chapter--dark ecosystem">
    <div class="site-container split-layout">
      <div class="chapter-copy reveal-copy">
        <p class="site-label">Um ecossistema, sem limites</p>
        <h2 class="site-title">Tudo o que<br>você precisa,<br>trabalhando<br>junto.</h2>
        <p class="site-copy">Do catálogo ao pós-venda, o Elínea conecta as ferramentas essenciais da sua operação em um só lugar.</p>
        <a class="text-cta text-cta--light" href="#produto">Explorar a plataforma <span aria-hidden="true">→</span></a>
      </div>

      <div class="ecosystem-orbit" aria-label="Módulos conectados à plataforma Elínea">
        <i class="orbit orbit--outer" aria-hidden="true"></i><i class="orbit orbit--inner" aria-hidden="true"></i>
        <div class="ecosystem-core"><span>ELÍNEA</span><small>Operação central</small></div>
        <div v-for="module in modules" :key="module.label" class="ecosystem-module" :class="`ecosystem-module--${module.pos}`">
          <component :is="module.icon" :size="18" aria-hidden="true" /><span>{{ module.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
