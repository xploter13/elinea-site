<script setup lang="ts">
import logoWhiteUrl from '~/assets/images/elinea-logo-white.svg'
import { ArrowRight } from '@lucide/vue'

const config = useRuntimeConfig()
</script>

<template>
  <footer id="rodape" class="site-footer">
    <div class="site-container footer-grid">
      <div class="footer-brand">
        <NuxtLink to="/" aria-label="Elínea — início"><img :src="logoWhiteUrl" alt="Elínea"></NuxtLink>
        <p>Ecommerce simples para negócios reais.</p>
        <div class="footer-social">
          <a :href="config.public.facebookUrl" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><span aria-hidden="true">f</span></a>
          <a :href="config.public.instagramUrl" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><span aria-hidden="true">ig</span></a>
          <a href="mailto:contato@elinea.com.br" aria-label="E-mail"><span aria-hidden="true">@</span></a>
        </div>
      </div>
      <div class="footer-links">
        <div><b>Produto</b><NuxtLink to="/#jornada">Como funciona</NuxtLink><NuxtLink to="/plataforma">Recursos</NuxtLink><NuxtLink to="/#planos">Preços</NuxtLink></div>
        <div><b>Plataforma</b><NuxtLink to="/plataforma#integracoes">Integrações</NuxtLink><NuxtLink to="/#solucoes">Segmentos</NuxtLink><NuxtLink to="/#ecossistema">Ecossistema</NuxtLink></div>
        <div><b>Empresa</b><a href="#">Sobre</a><a href="mailto:contato@elinea.com.br">Contato</a><a href="#">Privacidade</a></div>
      </div>
      <div class="footer-news"><b>Receba novidades</b><a href="mailto:contato@elinea.com.br">Seu e-mail <ArrowRight :size="16" /></a></div>
    </div>
    <div class="footer-wordmark" aria-hidden="true"><img :src="logoWhiteUrl" alt=""></div>
    <div class="site-container footer-bottom"><span>© 2026 Elínea. Todos os direitos reservados.</span><span>Feita para negócios reais.</span></div>
  </footer>
</template>
