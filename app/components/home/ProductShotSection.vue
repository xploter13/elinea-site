<script setup lang="ts">
import productShotUrl from '~/assets/images/elinea-hero-studio.png'
import { MessageCircle, Package, ShoppingBag, Users } from '@lucide/vue'
</script>

<template>
  <section id="produto" class="chapter product-shot">
    <div class="site-container">
      <div class="product-shot__heading reveal-copy">
        <div><p class="site-label">Produto de verdade, rotina mais simples</p><h2 class="site-title">Tudo sob<br>controle.</h2></div>
        <p class="site-copy">Loja, pedidos, clientes e operação centralizados em uma experiência clara — para você decidir com contexto e trabalhar sem ruído.</p>
      </div>
      <div class="product-frame">
        <img :src="productShotUrl" alt="Visão ilustrativa do painel Elínea com indicadores comerciais" loading="lazy" width="1672" height="941">
        <div class="product-chip product-chip--orders"><ShoppingBag :size="17" /><span><small>Pedidos</small><b>Organizados</b></span></div>
        <div class="product-chip product-chip--catalog"><Package :size="17" /><span><small>Catálogo</small><b>Atualizado</b></span></div>
        <div class="product-chip product-chip--clients"><Users :size="17" /><span><small>Clientes</small><b>Em contexto</b></span></div>
        <div class="product-chip product-chip--whatsapp"><MessageCircle :size="17" /><span><small>WhatsApp</small><b>Conectado</b></span></div>
      </div>
    </div>
  </section>
</template>
