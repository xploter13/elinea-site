<script setup lang="ts">
import logoWhiteUrl from '~/assets/images/logo-elinea-white.svg'
import {ArrowRight} from '@lucide/vue'

const config = useRuntimeConfig()
</script>

<template>
  <footer id="rodape" class="site-footer">
    <div class="site-container footer-grid">
      <div class="footer-brand">
        <NuxtLink to="/" aria-label="Elínea — início"><img :src="logoWhiteUrl" alt="Elínea"></NuxtLink>
        <p>Ecommerce simples para negócios reais.</p>
        <div class="footer-social">
          <a :href="config.public.facebookUrl" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><span
              aria-hidden="true">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M13.7 21v-8h2.8l.4-3.1h-3.2V8c0-.9.3-1.5 1.6-1.5H17V3.7c-.8-.1-1.6-.2-2.4-.2-2.4 0-4.1 1.5-4.1 4.2v2.2H8v3.1h2.5v8h3.2Z"></path>
            </svg>
          </span>
          </a>
          <a :href="config.public.instagramUrl" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><span
              aria-hidden="true">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3.5" y="3.5" width="17" height="17" rx="5"></rect>
              <circle cx="12" cy="12" r="4"></circle>
              <circle cx="17.4" cy="6.8" r="1"></circle>
            </svg>
          </span>
          </a>
          <a href="mailto:contato@elinea.com.br" aria-label="E-mail"><span aria-hidden="true">@</span></a>
        </div>
      </div>
      <div class="footer-links">
        <div><b>Produto</b>
          <NuxtLink to="/#jornada">Como funciona</NuxtLink>
          <NuxtLink to="/recursos">Recursos</NuxtLink>
          <NuxtLink to="/precos">Preços</NuxtLink>
        </div>
        <div><b>Plataforma</b>
          <NuxtLink to="/recursos#integracoes">Integrações</NuxtLink>
          <NuxtLink to="/#solucoes">Segmentos</NuxtLink>
          <NuxtLink to="/#ecossistema">Ecossistema</NuxtLink>
        </div>
        <div><b>Empresa</b><a href="#">Sobre</a><a href="mailto:contato@elinea.com.br">Contato</a><a href="#">Privacidade</a>
        </div>
      </div>
      <div class="footer-news">
        <b>Receba novidades</b>
        <a href="mailto:contato@elinea.com.br">Seu e-mail
          <ArrowRight :size="16"/>
        </a>
      </div>
    </div>
    <div class="footer-wordmark" aria-hidden="true"><img :src="logoWhiteUrl" alt=""></div>
    <div class="site-container footer-bottom"><span>© 2026 Elínea. Todos os direitos reservados.</span><span>Feita para negócios reais.</span>
    </div>
  </footer>
</template>
