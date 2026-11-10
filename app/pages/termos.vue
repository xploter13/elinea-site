<script setup lang="ts">
import { TERMS_CONTENT } from '~/data/serviceTerms'
import { parseLegalDocument } from '~/utils/legalDocument'

const route = useRoute()
const requestedVersion = computed(() => typeof route.query.versao === 'string' ? route.query.versao : '')
const { document, pending, error, refresh } = useServiceTerms(requestedVersion)
const sections = computed(() => parseLegalDocument(document.value?.content ?? TERMS_CONTENT))
const hasPlaceholders = computed(() => /\[(RAZÃO SOCIAL|CNPJ|ENDEREÇO|E-MAIL OFICIAL DE ATENDIMENTO)\]/u.test(document.value?.content ?? TERMS_CONTENT))
const updatedAt = computed(() => document.value ? new Date(document.value.published_at).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', day: 'numeric', month: 'long', year: 'numeric' }) : '10 de novembro de 2026')
useSeoMeta({ title: 'Termos de Uso e Contratação — Elínea',
  description: 'Condições de contratação, pagamentos, suporte, cancelamento e uso da plataforma Elínea.',
  robots: () => hasPlaceholders.value || !document.value ? 'noindex, follow' : 'index, follow' })
</script>

<template>
  <SiteLegalPage :title="document?.title || 'Termos de Uso e Contratação'" intro="Conheça as condições para contratar e utilizar a plataforma Elínea." :updated-at="updatedAt">
    <p v-if="error" class="legal-note" role="alert">Não foi possível consultar esta versão dos termos. <button type="button" class="legal-action" @click="() => refresh()">Tentar novamente</button></p>
    <p v-else-if="pending || !document" class="legal-note" role="status">Consultando a versão publicada. A cópia de referência abaixo corresponde à versão 1.1.</p>
    <p v-if="hasPlaceholders" class="legal-note">Os campos de identificação empresarial e de atendimento indicados entre colchetes ainda precisam ser preenchidos pelo responsável pela Elínea.</p>
    <section v-for="(section, index) in (error && requestedVersion ? [] : sections)" :id="`secao-${index}`" :key="index" class="terms-section">
      <h2 v-if="section.title">{{ section.title }}</h2>
      <template v-for="(block, blockIndex) in section.blocks" :key="blockIndex">
        <p v-if="block.type === 'paragraph'" class="terms-paragraph"><SiteLegalText :text="block.text" /></p>
        <ul v-else><li v-for="(item, itemIndex) in block.items" :key="itemIndex"><SiteLegalText :text="item" /></li></ul>
      </template>
    </section>
  </SiteLegalPage>
</template>

<style scoped>
.terms-paragraph { white-space: pre-line; }
.terms-section h2 { font-size: clamp(1.2rem, 2.5vw, 1.5rem); }
</style>
