<script setup lang="ts">
import merchantUrl from '~/assets/images/elinea-merchant-operation.png'
import { Check, Package, ShoppingBag, TrendingUp, Users } from '@lucide/vue'

const metrics = [
  { icon: ShoppingBag, label: 'Novos pedidos', value: '12 hoje' },
  { icon: Users, label: 'Clientes', value: '+26 esta semana' },
  { icon: Package, label: 'Produtos', value: '356 ativos' },
  { icon: TrendingUp, label: 'Conversões', value: '3,2%' },
]
</script>

<template>
  <section id="operacao" class="chapter chapter--light operation">
    <div class="site-container split-layout">
      <div class="chapter-copy reveal-copy">
        <p class="site-label">Tecnologia a favor de quem faz acontecer</p>
        <h2 class="site-title">Você cuida<br>do negócio.<br><span>O Elínea cuida<br>do digital.</span></h2>
        <p class="site-copy">Uma estrutura profissional sem precisar contratar uma equipe técnica ou integrar várias ferramentas por conta própria.</p>
        <ul class="benefit-list">
          <li><Check :size="16" />Mais tempo para o que importa</li>
          <li><Check :size="16" />Processos automatizados</li>
          <li><Check :size="16" />Suporte de verdade</li>
        </ul>
        <a class="solid-cta" href="#planos">Criar minha loja <span aria-hidden="true">→</span></a>
      </div>

      <div class="operation-scene">
        <img :src="merchantUrl" alt="Comerciante usando um tablet em sua loja" loading="lazy" width="1672" height="941">
        <article class="metric-card metric-card--total"><small>Total de vendas</small><strong>R$ 12.458,00</strong><span>Visão da operação</span></article>
        <div class="metric-stack">
          <article v-for="metric in metrics" :key="metric.label" class="metric-card">
            <component :is="metric.icon" :size="18" aria-hidden="true" />
            <span><small>{{ metric.label }}</small><strong>{{ metric.value }}</strong></span>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
