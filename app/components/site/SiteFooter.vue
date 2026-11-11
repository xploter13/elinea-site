<script setup lang="ts">
import logoWhiteUrl from '~/assets/images/logo-elinea-white.svg'
import { Mail } from '@lucide/vue'

const config = useRuntimeConfig()
const { openPreferences } = useCookieConsent()
</script>

<template>
  <footer id="rodape" class="site-footer">
    <div class="footer-container">
      <NuxtLink to="/" class="footer-logo" aria-label="Elínea — início">
        <img :src="logoWhiteUrl" alt="">
      </NuxtLink>

      <nav class="footer-links" aria-label="Navegação do rodapé">
        <div class="footer-links__group">
          <h2>Loja online</h2>
          <NuxtLink to="/plataforma">Plataforma</NuxtLink>
          <NuxtLink to="/recursos">Recursos</NuxtLink>
          <NuxtLink to="/precos">Preços</NuxtLink>
        </div>
        <div class="footer-links__group">
          <h2>Operação</h2>
          <NuxtLink to="/operacao/pagamentos">Pagamentos</NuxtLink>
          <NuxtLink to="/operacao/frete-e-logistica">Frete e logística</NuxtLink>
          <NuxtLink to="/operacao/gestao-e-erp">Gestão e ERP</NuxtLink>
          <NuxtLink to="/operacao/whatsapp">WhatsApp</NuxtLink>
          <NuxtLink to="/operacao/dados-e-crescimento">Dados e crescimento</NuxtLink>
        </div>
        <div class="footer-links__group">
          <h2>Ecossistema</h2>
          <NuxtLink to="/ecossistema/visao-geral">Visão geral</NuxtLink>
          <NuxtLink to="/ecossistema/integracoes">Integrações</NuxtLink>
          <NuxtLink to="/ecossistema/migracao">Migração</NuxtLink>
        </div>
        <div class="footer-links__group">
          <h2>Atendimento</h2>
          <NuxtLink to="/documentacao">Documentação</NuxtLink>
          <a href="mailto:contato@elinea.com.br">Fale com a Elínea</a>
        </div>
      </nav>

      <div class="footer-meta">
        <div class="footer-meta__brand">
          <strong>Ecommerce simples para negócios reais.</strong>
          <a href="mailto:contato@elinea.com.br">contato@elinea.com.br</a>
        </div>
        <div class="footer-meta__social">
          <h2>Siga-nos</h2>
          <div>
            <a :href="config.public.instagramUrl" target="_blank" rel="noopener noreferrer" aria-label="Instagram da Elínea">
              <svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a :href="config.public.facebookUrl" target="_blank" rel="noopener noreferrer" aria-label="Facebook da Elínea">
              <svg viewBox="0 0 24 24" width="23" height="23" fill="currentColor" aria-hidden="true">
                <path d="M14.2 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.8-.1-1.6-.2-2.4-.2-2.4 0-4.1 1.5-4.1 4.2v2.2H8.5V13H11v8h3.2Z" />
              </svg>
            </a>
            <a href="mailto:contato@elinea.com.br" aria-label="E-mail da Elínea">
              <Mail :size="23" :stroke-width="1.8" aria-hidden="true" />
            </a>
          </div>
        </div>
        <p class="footer-meta__legal">© 2026 Elínea. Todos os direitos reservados.</p>
      </div>
      <div class="footer-bottom">
        <nav class="footer-privacy" aria-label="Privacidade e cookies">
          <NuxtLink to="/termos">Termos de uso e contratação</NuxtLink>
          <NuxtLink to="/privacidade">Política de privacidade</NuxtLink>
          <NuxtLink to="/cookies">Política de cookies</NuxtLink>
          <button class="footer-privacy-button" type="button" @click="openPreferences">Gerenciar cookies</button>
        </nav>
        <p class="footer-meta__owner">Um produto da <strong>Gênios Mídia Soluções Digitais</strong>.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-bottom { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem 2rem; margin-top: 2rem; padding-top: 1.25rem; border-top: 1px solid rgb(255 255 255 / 12%); }
.footer-meta__owner { margin: 0 0 0 auto; color: #d6dce9; font-size: .85rem; line-height: 1.55; text-align: right; }
.footer-meta__owner strong { color: #f1f3f8; font-weight: 500; }
.footer-privacy { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem 2rem; }
.footer-privacy a, .footer-privacy-button { display: inline-flex; align-items: center; min-height: 44px; padding: 0; border: 0; background: none; color: #d6dce9; font: inherit; font-size: .9rem; line-height: 1.45; text-align: left; cursor: pointer; }
.footer-privacy a:hover, .footer-privacy-button:hover { color: #9ee2c0; text-decoration: underline; text-underline-offset: .25em; }
.footer-privacy :is(a, button):focus-visible { outline: 2px solid var(--green-bright); outline-offset: 4px; }
</style>
