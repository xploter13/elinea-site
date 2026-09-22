<script setup lang="ts">
import { ArrowDown, ArrowRight, Check, ChevronRight } from '@lucide/vue'
import { footerPages, footerPagePath, type FooterPage } from '~/data/footerPages'

const props = defineProps<{ page: FooterPage }>()
const sectionLabel = computed(() => props.page.section === 'operacao' ? 'Operação' : 'Ecossistema')
const related = computed(() => footerPages.filter(item => item.section === props.page.section && item.slug !== props.page.slug))

useSeoMeta({
  title: () => `${props.page.label} | ${sectionLabel.value} Elínea`,
  description: () => props.page.intro,
  ogTitle: () => `${props.page.label} | Elínea`,
  ogDescription: () => props.page.intro,
})
</script>

<template>
  <div class="page-shell detail-page" :class="`detail-page--${page.section}`">
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <SiteHeader />
    <main id="conteudo">
      <section class="detail-hero" :aria-labelledby="`${page.slug}-title`">
        <div class="detail-wrap detail-hero__inner">
          <nav class="detail-breadcrumb" aria-label="Caminho da página">
            <NuxtLink to="/">Início</NuxtLink><ChevronRight :size="14" aria-hidden="true" />
            <span>{{ sectionLabel }}</span><ChevronRight :size="14" aria-hidden="true" />
            <span aria-current="page">{{ page.label }}</span>
          </nav>
          <div class="detail-hero__grid">
            <div class="detail-hero__copy">
              <p class="detail-kicker"><span class="detail-kicker__mark" aria-hidden="true"></span>{{ sectionLabel }} / {{ page.label }}</p>
              <h1 :id="`${page.slug}-title`">{{ page.title }}</h1>
              <p class="detail-lead">{{ page.intro }}</p>
              <div class="detail-hero__actions">
                <NuxtLink class="detail-button detail-button--light" to="/precos#planos">Conhecer os planos <ArrowRight :size="18" aria-hidden="true" /></NuxtLink>
                <a class="detail-text-link" href="#como-funciona">Entenda o fluxo <ArrowDown :size="17" aria-hidden="true" /></a>
              </div>
            </div>
            <div class="detail-visual" aria-hidden="true">
              <div class="detail-visual__header"><span>Fluxo da operação</span><span>Elínea / {{ page.label }}</span></div>
              <div class="detail-visual__track">
                <div v-for="(step, index) in page.flow" :key="step" class="detail-visual__step">
                  <span class="detail-visual__number">{{ String(index + 1).padStart(2, '0') }}</span>
                  <strong>{{ step }}</strong>
                  <span class="detail-visual__check"><Check :size="17" /></span>
                </div>
              </div>
              <div class="detail-visual__footer"><span class="detail-visual__pulse"></span>{{ page.status }}</div>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" class="detail-story" aria-labelledby="story-title">
        <div class="detail-wrap detail-story__grid">
          <div class="detail-story__intro">
            <p class="detail-section-name">Na prática</p>
            <h2 id="story-title">Uma rotina mais clara em cada etapa.</h2>
            <p>{{ page.context }}</p>
          </div>
          <ol class="detail-steps">
            <li v-for="(step, index) in page.flow" :key="step">
              <span>{{ String(index + 1).padStart(2, '0') }}</span>
              <div><h3>{{ step }}</h3><p>{{ page.flowText[index] }}</p></div>
            </li>
          </ol>
        </div>
      </section>

      <section class="detail-focus" aria-labelledby="focus-title">
        <div class="detail-wrap detail-focus__grid">
          <div>
            <p class="detail-section-name">O que considerar</p>
            <h2 id="focus-title">{{ page.detailTitle }}</h2>
            <p class="detail-focus__copy">{{ page.detail }}</p>
          </div>
          <div class="detail-focus__panel">
            <ul><li v-for="point in page.points" :key="point"><Check :size="18" aria-hidden="true" /><span>{{ point }}</span></li></ul>
            <p>{{ page.note }}</p>
          </div>
        </div>
      </section>

      <section class="detail-next" aria-labelledby="next-title">
        <div class="detail-wrap">
          <div class="detail-next__heading"><div><p class="detail-section-name">Continue explorando</p><h2 id="next-title">{{ sectionLabel }}</h2></div><NuxtLink to="/recursos">Ver todos os recursos <ArrowRight :size="17" aria-hidden="true" /></NuxtLink></div>
          <div class="detail-next__links">
            <NuxtLink v-for="item in related" :key="item.slug" :to="footerPagePath(item)"><span>{{ item.label }}</span><ArrowRight :size="20" aria-hidden="true" /></NuxtLink>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.detail-page { --detail-ink: #0d2927; --detail-green: #82ddb6; --detail-line: #d4e3dd; color: var(--detail-ink); background: #f4f8f6; }
.detail-wrap { width: min(100% - 2 * var(--gutter), 1280px); margin-inline: auto; }
.detail-hero { min-height: 740px; padding: 120px 0 clamp(5rem, 8vw, 8rem); background: #0d2927; color: #f8fffa; overflow: hidden; }
.detail-page--ecossistema .detail-hero { background: #142735; }
.detail-hero__inner { position: relative; }
.detail-breadcrumb { display: flex; flex-wrap: wrap; align-items: center; gap: .55rem; color: #acc8bf; font-size: .78rem; }
.detail-breadcrumb a:hover { color: white; text-decoration: underline; text-underline-offset: 4px; }
.detail-breadcrumb [aria-current] { color: white; }
.detail-hero__grid { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(360px, .82fr); align-items: center; gap: clamp(3rem, 7vw, 8rem); margin-top: clamp(4rem, 7vw, 7rem); }
.detail-kicker { display: flex; align-items: center; gap: .7rem; color: #a9d9c5; font-size: .82rem; font-weight: 700; }
.detail-kicker__mark { width: 9px; height: 9px; border-radius: 50%; background: var(--detail-green); box-shadow: 0 0 0 5px #82ddb625; }
.detail-hero h1 { max-width: 750px; margin-top: 1.4rem; color: white; font-size: clamp(3.3rem, 5.8vw, 6.2rem); font-weight: 600; line-height: .99; letter-spacing: -.055em; text-wrap: balance; }
.detail-lead { max-width: 560px; margin-top: 2rem; color: #c5d8d1; font-size: clamp(1.05rem, 1.4vw, 1.25rem); line-height: 1.65; }
.detail-hero__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem 1.6rem; margin-top: 2.4rem; }
.detail-button { display: inline-flex; min-height: 50px; align-items: center; justify-content: center; gap: 1.2rem; padding: .8rem 1.2rem; border-radius: 8px; font-weight: 750; transition: transform .2s, background .2s; }
.detail-button:hover { transform: translateY(-2px); }
.detail-button--light { background: #dcf6e8; color: #10392c; }
.detail-button--light:hover { background: white; }
.detail-text-link { display: inline-flex; min-height: 44px; align-items: center; gap: .6rem; color: #e4f5ed; font-size: .9rem; font-weight: 700; text-decoration: underline; text-underline-offset: 5px; }
.detail-text-link:hover { color: var(--detail-green); }
.detail-visual { position: relative; padding: 1.25rem; border: 1px solid #ffffff2e; border-radius: 20px; background: #ffffff0d; box-shadow: 0 40px 80px -50px #000b; transform: rotate(2deg); }
.detail-visual::before { position: absolute; inset: 12px -12px -12px 12px; z-index: -1; border: 1px solid #ffffff16; border-radius: 20px; content: ''; }
.detail-visual__header, .detail-visual__footer { display: flex; align-items: center; justify-content: space-between; gap: 1rem; color: #a9c6bb; font-size: .71rem; font-weight: 700; }
.detail-visual__header { padding: .35rem .4rem 1.3rem; border-bottom: 1px solid #ffffff2b; }
.detail-visual__header span:last-child { text-align: right; }
.detail-visual__track { padding: .6rem 0; }
.detail-visual__step { display: grid; min-height: 86px; grid-template-columns: 38px 1fr 32px; align-items: center; gap: 1rem; padding: .7rem .8rem; border-bottom: 1px solid #ffffff1e; }
.detail-visual__step:last-child { border-bottom: 0; }
.detail-visual__number { color: var(--detail-green); font-size: .8rem; font-weight: 800; }
.detail-visual__step strong { color: white; font-size: clamp(1rem, 1.4vw, 1.2rem); font-weight: 600; }
.detail-visual__check { display: grid; width: 30px; height: 30px; place-items: center; border: 1px solid #82ddb669; border-radius: 50%; color: var(--detail-green); }
.detail-visual__footer { justify-content: flex-start; padding: 1rem .4rem .25rem; border-top: 1px solid #ffffff2b; }
.detail-visual__pulse { width: 8px; height: 8px; border-radius: 50%; background: var(--detail-green); }
.detail-story, .detail-focus, .detail-next { padding-block: clamp(5rem, 9vw, 9rem); }
.detail-story__grid, .detail-focus__grid { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1fr); gap: clamp(3rem, 9vw, 9rem); }
.detail-section-name { color: #217453; font-size: .82rem; font-weight: 800; }
.detail-story h2, .detail-focus h2, .detail-next h2 { margin-top: 1.1rem; font-size: clamp(2.6rem, 4vw, 4.3rem); font-weight: 600; line-height: 1.05; letter-spacing: -.045em; text-wrap: balance; }
.detail-story__intro > p:last-child, .detail-focus__copy { max-width: 570px; margin-top: 1.7rem; color: #49625a; font-size: 1rem; line-height: 1.8; }
.detail-steps { margin: 0; padding: 0; list-style: none; border-top: 1px solid var(--detail-line); }
.detail-steps li { display: grid; grid-template-columns: 44px 1fr; gap: 1.2rem; padding: 1.8rem 0; border-bottom: 1px solid var(--detail-line); }
.detail-steps li > span { padding-top: .2rem; color: #338466; font-size: .88rem; font-weight: 800; }
.detail-steps h3 { font-size: clamp(1.35rem, 2vw, 1.7rem); font-weight: 600; }
.detail-steps p { max-width: 470px; margin-top: .55rem; color: #536c63; line-height: 1.65; }
.detail-focus { background: #e5eee9; }
.detail-focus__grid { align-items: center; }
.detail-focus__panel { padding: clamp(1.5rem, 3.3vw, 3rem); border-radius: 18px; background: white; box-shadow: 0 24px 50px -42px #164b34aa; }
.detail-focus__panel ul { display: grid; gap: 1.3rem; margin: 0; padding: 0; list-style: none; }
.detail-focus__panel li { display: flex; align-items: flex-start; gap: .85rem; font-size: 1.02rem; font-weight: 650; line-height: 1.5; }
.detail-focus__panel li svg { flex: 0 0 auto; margin-top: .16rem; color: #16835a; }
.detail-focus__panel > p { margin-top: 2rem; padding-top: 1.4rem; border-top: 1px solid var(--detail-line); color: #566f65; font-size: .9rem; line-height: 1.65; }
.detail-next { background: #f9fbfa; }
.detail-next__heading { display: flex; align-items: end; justify-content: space-between; gap: 2rem; }
.detail-next h2 { margin-top: .5rem; }
.detail-next__heading > a { display: inline-flex; min-height: 44px; align-items: center; gap: .6rem; color: #176a4c; font-weight: 750; }
.detail-next__heading > a:hover { text-decoration: underline; text-underline-offset: 4px; }
.detail-next__links { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin-top: 2.8rem; }
.detail-next__links a { display: flex; min-height: 94px; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.3rem 1.5rem; border: 1px solid var(--detail-line); border-radius: 12px; background: white; font-size: 1.14rem; font-weight: 700; transition: border-color .2s, transform .2s; }
.detail-next__links a:hover { border-color: #25845e; transform: translateY(-2px); }
.detail-next__links svg { flex: 0 0 auto; color: #28815e; }
@media (max-width: 900px) {
  .detail-hero__grid { grid-template-columns: 1fr; gap: 4rem; }
  .detail-visual { max-width: 640px; transform: none; }
  .detail-story__grid, .detail-focus__grid { grid-template-columns: 1fr; gap: 3rem; }
}
@media (max-width: 600px) {
  .detail-hero { min-height: 0; padding-top: 104px; }
  .detail-breadcrumb { font-size: .7rem; }
  .detail-hero__grid { margin-top: 3.5rem; }
  .detail-hero h1 { font-size: clamp(2.85rem, 12vw, 4.3rem); }
  .detail-lead { font-size: 1rem; }
  .detail-visual { padding: .8rem; }
  .detail-visual__step { gap: .5rem; }
  .detail-next__heading { align-items: flex-start; flex-direction: column; gap: 1rem; }
  .detail-next__links { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .detail-button, .detail-next__links a { transition: none; }
  .detail-button:hover, .detail-next__links a:hover { transform: none; }
}
</style>
