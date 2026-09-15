<script setup lang="ts">
import productShotUrl from '~/assets/images/elinea-control-concept.png'
import { CheckCircle2, MessageCircle, Package, ShoppingBag, Users } from '@lucide/vue'

const controls = [
  { id: 'orders', icon: ShoppingBag, label: 'Pedidos', title: 'Cada venda em movimento.', description: 'Status, pagamento e entrega acompanhados em uma única sequência.' },
  { id: 'catalog', icon: Package, label: 'Catálogo', title: 'Estoque que acompanha.', description: 'Produtos, variações e disponibilidade organizados para vender sem ruído.' },
  { id: 'clients', icon: Users, label: 'Clientes', title: 'Contexto para decidir.', description: 'Histórico e relacionamento próximos da rotina comercial.' },
  { id: 'whatsapp', icon: MessageCircle, label: 'WhatsApp', title: 'Conversa conectada.', description: 'Atendimento e operação trabalhando com a mesma informação.' },
]
</script>

<template>
  <section id="produto" class="chapter product-shot">
    <div class="site-container">
      <div class="product-shot__heading reveal-copy">
        <div><p class="site-label">Produto de verdade, rotina mais simples</p><h2 class="site-title">Tudo sob<br>controle.</h2></div>
        <p class="site-copy">Loja, pedidos, clientes e operação centralizados em uma experiência clara — para você decidir com contexto e trabalhar sem ruído.</p>
      </div>
      <div class="control-stage">
        <aside class="control-stage__intro">
          <span class="control-stage__brand">ELÍNEA<br>CONTROLE</span>
          <div>
            <h3>Tudo conversa.<br>Você decide.</h3>
            <p>Uma visão contínua da operação, do pedido ao relacionamento.</p>
            <span class="control-stage__status"><CheckCircle2 :size="17" aria-hidden="true" /> Operação sincronizada</span>
          </div>
        </aside>

        <div class="control-stage__visual">
          <img :src="productShotUrl" alt="Objetos de uma operação comercial conectados a um núcleo central verde" loading="lazy" width="1672" height="941">
        </div>

        <div class="control-cards">
          <article v-for="(control, index) in controls" :key="control.id" class="control-card" :class="`control-card--${control.id}`">
            <header>
              <span class="control-card__icon"><component :is="control.icon" :size="20" aria-hidden="true" /></span>
              <small>0{{ index + 1 }}</small>
            </header>

            <div class="control-card__illustration" aria-hidden="true">
              <template v-if="control.id === 'orders'">
                <span class="order-line"><i></i><b>#1482</b><em>Pago</em></span>
                <span class="order-line"><i></i><b>#1481</b><em>Envio</em></span>
                <span class="order-line"><i></i><b>#1480</b><em>Novo</em></span>
              </template>
              <template v-else-if="control.id === 'catalog'">
                <span class="catalog-item catalog-item--one"></span>
                <span class="catalog-item catalog-item--two"></span>
                <span class="catalog-item catalog-item--three"></span>
                <strong>356 <small>ativos</small></strong>
              </template>
              <template v-else-if="control.id === 'clients'">
                <span class="client-avatar">AM</span><span class="client-avatar">LS</span><span class="client-avatar">+24</span>
                <strong>+26 <small>esta semana</small></strong>
              </template>
              <template v-else>
                <span class="chat-bubble">Pedido confirmado</span>
                <span class="chat-bubble chat-bubble--reply">Tudo certo ✓</span>
              </template>
            </div>

            <div class="control-card__copy">
              <p>{{ control.label }}</p>
              <h3>{{ control.title }}</h3>
              <span>{{ control.description }}</span>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
