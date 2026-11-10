<script setup lang="ts">
withDefaults(defineProps<{ title: string, intro: string, updatedAt?: string }>(), { updatedAt: '10 de novembro de 2026' })
</script>

<template>
  <div class="page-shell legal-page">
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <SiteHeader light />
    <main id="conteudo" class="site-container legal-main">
      <header class="legal-heading"><h1>{{ title }}</h1><p>{{ intro }}</p><span>Atualização: {{ updatedAt }}</span></header>
      <div class="legal-content"><slot /></div>
    </main>
    <SiteFooter />
  </div>
</template>

<style>
.legal-page { background: var(--paper); color: var(--ink-2); }
.legal-main { padding-top: clamp(8rem, 12vw, 11rem); padding-bottom: var(--section-space); }
.legal-heading { max-width: 950px; padding-bottom: clamp(2rem, 5vw, 4rem); border-bottom: 1px solid var(--line); }
.legal-heading h1 { font-size: clamp(2.6rem, 6.5vw, 5.5rem); letter-spacing: -.05em; line-height: 1.05; overflow-wrap: break-word; }
.legal-heading p { max-width: 65ch; margin: 1.5rem 0; font-size: 1.1rem; line-height: 1.7; color: var(--muted); }
.legal-heading > span { font-size: .85rem; color: var(--muted); }
.legal-content { max-width: 76ch; margin-top: 3rem; line-height: 1.8; overflow-wrap: anywhere; }
.legal-content section { margin-top: 2.75rem; scroll-margin-top: 7rem; }
.legal-content h2 { font-size: clamp(1.35rem, 3vw, 1.8rem); line-height: 1.3; letter-spacing: -.025em; margin-bottom: 1rem; }
.legal-content p + p { margin-top: 1rem; }
.legal-content ul { padding-left: 1.25rem; margin: 1rem 0; list-style: disc; }
.legal-content li + li { margin-top: .6rem; }
.legal-content a { text-decoration: underline; text-underline-offset: 3px; }
.legal-content :is(a, button):focus-visible { outline: 2px solid var(--green); outline-offset: 4px; }
.legal-content .legal-note { padding: 1.25rem; border-left: 3px solid var(--green); background: var(--warm-white); font-size: .9rem; }
.legal-content .legal-action { min-height: 44px; padding: .7rem 1.2rem; margin: 1rem 0; border: 1px solid var(--ink); border-radius: .6rem; background: var(--ink); color: var(--paper); font: inherit; cursor: pointer; }
.legal-content dl { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); gap: .8rem 1.5rem; margin: 1rem 0; }
.legal-content dt { font-weight: 600; }
.legal-content dd { margin: 0; }
@media (max-width: 767px) { .legal-content dl { grid-template-columns: 1fr; gap: .3rem; } .legal-content dd { margin-bottom: .8rem; } }
</style>
