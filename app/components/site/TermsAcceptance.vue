<script setup lang="ts">
const accepted = defineModel<boolean>({ default: false })
withDefaults(defineProps<{ error?: string, id?: string }>(), { id: 'terms-accepted', error: '' })
const { document, pending, error: loadingError, refresh } = useServiceTerms()
watch(() => document.value?.sha256, () => { accepted.value = false })
</script>

<template>
  <div class="terms-acceptance full">
    <label :for="id" class="terms-acceptance__label">
      <input :id="id" v-model="accepted" type="checkbox" required :disabled="!document || pending || !!loadingError" :aria-invalid="!!error"
        :aria-describedby="`${id}-details${error ? ` ${id}-error` : ''}`">
      <span>Li e concordo com os <NuxtLink :to="document ? `/termos?versao=${encodeURIComponent(document.version)}` : '/termos'" target="_blank" rel="noopener noreferrer">Termos de Uso e Contratação</NuxtLink>.</span>
    </label>
    <p v-if="loadingError" role="alert">Não foi possível carregar os termos vigentes. <button type="button" class="terms-retry" @click="() => refresh()">Tentar novamente</button></p>
    <p v-else-if="pending || !document" role="status">Carregando os termos vigentes...</p>
    <p :id="`${id}-details`"><span v-if="document">Versão {{ document.version }}. </span>Declaro ter capacidade legal e, quando aplicável, autorização para representar a empresa. A assinatura é recorrente, com a primeira cobrança na contratação, conforme o plano escolhido.</p>
    <p v-if="error" :id="`${id}-error`" class="terms-acceptance__error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
.terms-acceptance { grid-column: 1 / -1; padding: 1.25rem 0; margin-bottom: .5rem; border-block: 1px solid var(--line); }
.terms-acceptance .terms-acceptance__label { display: flex; align-items: flex-start; gap: .8rem; min-height: 44px; cursor: pointer; color: var(--ink-2); font-size: .95rem; line-height: 1.6; }
.terms-acceptance input[type="checkbox"] { flex: 0 0 22px; width: 22px; height: 22px; min-height: 0; margin: .2rem 0 0; padding: 0; appearance: auto; accent-color: var(--green); cursor: pointer; }
.terms-acceptance a { text-decoration: underline; text-underline-offset: 3px; }
.terms-retry { background: none; border: 0; padding: .5rem; text-decoration: underline; cursor: pointer; }
.terms-acceptance p { margin-top: .5rem; font-size: .8rem; color: var(--muted); line-height: 1.7; }
.terms-acceptance .terms-acceptance__error { color: #a62d2d; }
.terms-acceptance :is(input, a):focus-visible { outline: 2px solid var(--green); outline-offset: 4px; }
</style>
