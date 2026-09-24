<script setup lang="ts">
import { ArrowRight, Check } from '@lucide/vue'
import { MarketingButton, MarketingTextButton } from '@elinea/ui/marketing'
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
    <SiteHeader light />
    <main id="conteudo">
      <section class="detail-hero" :aria-labelledby="`${page.slug}-title`">
        <div class="site-container detail-hero__layout">
          <div class="detail-hero__rail">
            <p class="detail-hero__category">{{ sectionLabel }}</p>
            <p class="detail-hero__subject">{{ page.label }}</p>
            <div class="detail-hero__availability"><span>Disponibilidade</span><strong>{{ page.status }}</strong></div>
          </div>
          <div class="detail-hero__content">
            <h1 :id="`${page.slug}-title`">{{ page.title }}</h1>
            <p class="detail-lead">{{ page.intro }}</p>
            <div class="detail-hero__actions">
              <MarketingButton variant="primary" href="/precos#planos">Conhecer os planos<template #icon><ArrowRight :size="17" aria-hidden="true" /></template></MarketingButton>
              <MarketingTextButton tone="dark" href="#como-funciona">Entenda o fluxo</MarketingTextButton>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" class="detail-story" aria-labelledby="story-title">
        <div class="detail-wrap detail-story__grid">
          <div class="detail-story__intro">
            <p class="detail-section-name">Na prática <span class="detail-status">{{ page.status }}</span></p>
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
.detail-page { --detail-ink: var(--ink-2); --detail-line: #d4e3dd; color: var(--detail-ink); background: var(--paper); }
.detail-wrap { width: min(100% - 2 * var(--gutter), 1280px); margin-inline: auto; }
.detail-hero { display: flex; min-height: min(82svh, 800px); border-bottom: 1px solid #dce6e0; background: #fbfcfa; color: var(--detail-ink); }
.detail-hero__layout { display: grid; min-height: min(82svh, 800px); padding-block: clamp(10rem, 19vh, 13rem) clamp(5rem, 9vh, 7rem); grid-template-columns: minmax(160px, .23fr) minmax(0, 1fr); gap: clamp(3rem, 8vw, 9rem); align-items: start; }
.detail-hero__rail { padding-top: 1.2rem; border-top: 2px solid #157d54; }
.detail-hero__category { color: #13724e; font-size: .83rem; font-weight: 600; }
.detail-hero__subject { margin-top: .65rem; color: var(--ink); font-size: clamp(1.15rem, 1.5vw, 1.5rem); font-weight: 600; letter-spacing: -.025em; }
.detail-hero__availability { display: grid; gap: .35rem; margin-top: clamp(3rem, 8vh, 6rem); padding-top: 1rem; border-top: 1px solid #dce6e0; }
.detail-hero__availability span { color: #667a70; font-size: .76rem; }
.detail-hero__availability strong { color: #276b4c; font-size: .84rem; font-weight: 600; line-height: 1.45; }
.detail-hero__content { min-width: 0; }
.detail-hero h1 { max-width: 1000px; color: var(--ink); font-size: clamp(3.5rem, 5.4vw, 6.2rem); font-weight: 700; line-height: 1.03; letter-spacing: -.05em; text-wrap: balance; }
.detail-lead { max-width: 45rem; margin-top: clamp(2rem, 5vh, 3.5rem); padding-top: 1.5rem; border-top: 1px solid #cbdcd2; color: #496057; font-size: clamp(1rem, 1.18vw, 1.18rem); line-height: 1.7; }
.detail-hero__actions { display: flex; margin-top: 2rem; flex-wrap: wrap; align-items: center; gap: 1.5rem; }
.detail-story, .detail-focus, .detail-next { padding-block: clamp(5rem, 9vw, 9rem); }
.detail-story__grid, .detail-focus__grid { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1fr); gap: clamp(3rem, 9vw, 9rem); }
.detail-section-name { color: #217453; font-size: .82rem; font-weight: 500; }
.detail-status { display: inline-block; margin-left: .8rem; padding-left: .8rem; border-left: 1px solid var(--detail-line); color: var(--muted); font-weight: 500; }
.detail-story h2, .detail-focus h2, .detail-next h2 { margin-top: 1.1rem; font-size: clamp(2.6rem, 4vw, 4.3rem); font-weight: 700; line-height: 1.05; letter-spacing: -.045em; text-wrap: balance; }
.detail-story__intro > p:last-child, .detail-focus__copy { max-width: 570px; margin-top: 1.7rem; color: #49625a; font-size: 1rem; line-height: 1.8; }
.detail-steps { margin: 0; padding: 0; list-style: none; border-top: 1px solid var(--detail-line); }
.detail-steps li { display: grid; grid-template-columns: 44px 1fr; gap: 1.2rem; padding: 1.8rem 0; border-bottom: 1px solid var(--detail-line); }
.detail-steps li > span { padding-top: .2rem; color: #338466; font-size: .88rem; font-weight: 500; }
.detail-steps h3 { font-size: clamp(1.35rem, 2vw, 1.7rem); font-weight: 600; }
.detail-steps p { max-width: 470px; margin-top: .55rem; color: #536c63; line-height: 1.65; }
.detail-focus { background: #e5eee9; }
.detail-focus__grid { align-items: center; }
.detail-focus__panel { padding: clamp(1.5rem, 3.3vw, 3rem); border-radius: 18px; background: white; box-shadow: 0 24px 50px -42px #164b34aa; }
.detail-focus__panel ul { display: grid; gap: 1.3rem; margin: 0; padding: 0; list-style: none; }
.detail-focus__panel li { display: flex; align-items: flex-start; gap: .85rem; font-size: 1.02rem; font-weight: 600; line-height: 1.5; }
.detail-focus__panel li svg { flex: 0 0 auto; margin-top: .16rem; color: #16835a; }
.detail-focus__panel > p { margin-top: 2rem; padding-top: 1.4rem; border-top: 1px solid var(--detail-line); color: #566f65; font-size: .9rem; line-height: 1.65; }
.detail-next { background: #f9fbfa; }
.detail-next__heading { display: flex; align-items: end; justify-content: space-between; gap: 2rem; }
.detail-next h2 { margin-top: .5rem; }
.detail-next__heading > a { display: inline-flex; min-height: 44px; align-items: center; gap: .6rem; color: #176a4c; font-weight: 500; }
.detail-next__heading > a:hover { text-decoration: underline; text-underline-offset: 4px; }
.detail-next__links { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin-top: 2.8rem; }
.detail-next__links a { display: flex; min-height: 94px; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.3rem 1.5rem; border: 1px solid var(--detail-line); border-radius: 12px; background: white; font-size: 1.14rem; font-weight: 700; transition: border-color .2s, transform .2s; }
.detail-next__links a:hover { border-color: #25845e; transform: translateY(-2px); }
.detail-next__links svg { flex: 0 0 auto; color: #28815e; }
@media (max-width: 900px) {
  .detail-hero__layout { grid-template-columns: minmax(130px, .22fr) minmax(0, 1fr); gap: 2.5rem; }
  .detail-hero h1 { font-size: clamp(3.2rem, 6vw, 5rem); }
  .detail-story__grid, .detail-focus__grid { grid-template-columns: 1fr; gap: 3rem; }
}
@media (max-width: 600px) {
  .detail-hero, .detail-hero__layout { min-height: 0; }
  .detail-hero__layout { padding-block: 8.5rem 4.5rem; grid-template-columns: 1fr; gap: 3rem; }
  .detail-hero__rail { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; gap: .35rem 1rem; }
  .detail-hero__category { grid-column: 1 / -1; }
  .detail-hero__subject { margin-top: 0; }
  .detail-hero__availability { margin-top: 0; padding-top: 0; border-top: 0; text-align: right; }
  .detail-hero h1 { font-size: clamp(3rem, 11.5vw, 4.5rem); }
  .detail-hero__actions { align-items: flex-start; flex-direction: column; }
  .detail-lead { font-size: 1rem; }
  .detail-next__heading { align-items: flex-start; flex-direction: column; gap: 1rem; }
  .detail-next__links { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .detail-next__links a { transition: none; }
  .detail-next__links a:hover { transform: none; }
}
</style>
