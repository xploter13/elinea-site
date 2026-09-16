<script setup lang="ts">
import { Check, CreditCard, MessageCircle, Package, ShoppingBag } from '@lucide/vue'
import { MarketingTextButton } from '@elinea/ui/marketing'

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
        <MarketingTextButton class="chapter-text-cta" href="#ecossistema">Ver como funciona</MarketingTextButton>
      </div>

      <div class="sale-map" aria-label="Fluxo integrado de uma venda">
        <svg class="sale-path sale-path--desktop" viewBox="0 0 720 650" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path data-sale-path d="M208 55 H320 Q360 55 360 95 V124 Q360 162 322 162 H294 V236 H300 Q300 294 358 294 H468 Q510 294 510 316 H544 V353 H525 Q525 390 488 390 H342 Q286 390 248 422 H214 V496 H224 Q224 550 278 550 H456 Q496 550 496 590 V613 H620" />
          <circle data-sale-dot cx="360" cy="124" r="4" />
          <circle data-sale-dot cx="468" cy="294" r="4" />
          <circle data-sale-dot cx="488" cy="390" r="4" />
          <circle data-sale-dot cx="278" cy="550" r="4" />
        </svg>
        <svg class="sale-path sale-path--mobile" viewBox="0 0 720 650" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path data-sale-path d="M402 55 H500 Q540 55 540 95 V148 H560 V223 H540 V246 Q540 276 510 276 H430 Q392 276 392 314 H402 V354 H374 V382 Q374 414 406 414 H500 Q532 414 532 446 H560 V520 H532 V542 Q532 574 500 574 H250 Q214 574 214 610 V613 H112" />
          <circle data-sale-dot cx="540" cy="95" r="4" />
          <circle data-sale-dot cx="510" cy="276" r="4" />
          <circle data-sale-dot cx="406" cy="414" r="4" />
          <circle data-sale-dot cx="500" cy="574" r="4" />
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
