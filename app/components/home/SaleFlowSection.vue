<script setup lang="ts">
import { Check, CreditCard, MessageCircle, Package, ShoppingBag } from '@lucide/vue'

const steps = [
  { icon: ShoppingBag, label: 'Pedido realizado', value: 'R$ 129,90', className: 'sale-step--order' },
  { icon: CreditCard, label: 'Pagamento aprovado', value: 'Pix', className: 'sale-step--payment' },
  { icon: Package, label: 'Estoque atualizado', value: '−1 unidade', className: 'sale-step--stock' },
  { icon: MessageCircle, label: 'Cliente notificado', value: 'Mensagem enviada', className: 'sale-step--message' },
  { icon: Check, label: 'Venda concluída', value: 'Tudo certo!', className: 'sale-step--done' },
]
</script>

<template>
  <section id="jornada" class="chapter chapter--light sale-flow">
    <div class="site-container split-layout">
      <div class="chapter-copy reveal-copy">
        <p class="site-label">Do clique ao cliente fiel</p>
        <h2 class="site-title">Uma venda<br>movimenta<br>tudo.</h2>
        <p class="site-copy">Cada venda no Elínea ativa uma operação completa: pagamento, estoque, comunicação e muito mais. Tudo acontece em um único ecossistema.</p>
        <a class="text-cta" href="#ecossistema">Ver como funciona <span aria-hidden="true">→</span></a>
      </div>

      <div class="sale-map" aria-label="Fluxo integrado de uma venda">
        <svg class="sale-path" viewBox="0 0 720 650" fill="none" aria-hidden="true">
          <path data-sale-path d="M88 76 C320 76 350 82 350 180 C350 245 165 216 165 310 C165 380 570 340 570 430 C570 490 350 485 350 570 C350 610 525 610 636 604" />
        </svg>
        <article v-for="step in steps" :key="step.label" class="sale-step" :class="step.className">
          <span class="sale-step__icon"><component :is="step.icon" :size="20" aria-hidden="true" /></span>
          <span><small>{{ step.label }}</small><strong>{{ step.value }}</strong></span>
        </article>
        <p class="sale-note" aria-hidden="true">Mais vendas.<br>Menos trabalho.</p>
      </div>
    </div>
  </section>
</template>
