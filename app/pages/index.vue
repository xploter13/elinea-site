<script setup lang="ts">
import heroUrl from '~/assets/images/elinea-hero.png'
import SaleFlowSection from '~/components/home/SaleFlowSection.vue'
import EcosystemSection from '~/components/home/EcosystemSection.vue'
import OperationSection from '~/components/home/OperationSection.vue'
import ProductShotSection from '~/components/home/ProductShotSection.vue'
import SegmentsSection from '~/components/home/SegmentsSection.vue'
import IntegrationsSection from '~/components/home/IntegrationsSection.vue'
import PricingSection from '~/components/home/PricingSection.vue'
import {plans, type Plan} from '~/data/plans'
import {MarketingButton} from '@elinea/ui/marketing'
import {ArrowRight} from '@lucide/vue'

const pageRoot = ref<HTMLElement | null>(null)
const heroRoot = ref<HTMLElement | null>(null)
const openCheckout = (plan: Plan) => navigateTo({ path: '/criar-loja', query: { plano: plan.slug } })

const TYPED_PHRASES = ['negócios reais.', 'lojas de verdade.', 'vender mais.']
const typedWord = ref(TYPED_PHRASES[0])
const typedLineWrap = ref<HTMLElement | null>(null)
const typedLineEl = ref<HTMLElement | null>(null)

let destroyMotion: (() => void) | undefined
let typewriterTimer: ReturnType<typeof setTimeout> | undefined
let typewriterObserver: IntersectionObserver | undefined
let heroInView = false
let pageHidden = false

const canType = () => heroInView && !pageHidden

function fitTypedLine() {
  const wrap = typedLineWrap.value
  const el = typedLineEl.value
  if (!wrap || !el) return
  const style = getComputedStyle(el)
  const longest = TYPED_PHRASES.reduce((a, b) => (b.length > a.length ? b : a))
  const probe = document.createElement('span')
  probe.style.cssText = 'position:absolute; visibility:hidden; white-space:nowrap; left:-9999px; top:0;'
  probe.style.fontFamily = style.fontFamily
  probe.style.fontWeight = style.fontWeight
  probe.style.fontSize = style.fontSize
  probe.style.letterSpacing = style.letterSpacing
  probe.textContent = longest
  document.body.appendChild(probe)
  const natural = probe.scrollWidth
  document.body.removeChild(probe)
  const available = wrap.clientWidth
  el.style.fontSize = natural > available ? `${(parseFloat(style.fontSize) * available / natural) * .97}px` : ''
}

function typeLoop() {
  let phraseIndex = 0
  let phrase = TYPED_PHRASES[0] ?? ''
  let charIndex = phrase.length
  const step = (mode: 'hold' | 'deleting' | 'typing', delay: number) => {
    typewriterTimer = setTimeout(() => {
      if (!canType()) {
        step(mode, 300)
        return
      }
      if (mode === 'hold') {
        step('deleting', 35)
        return
      }
      if (mode === 'deleting') {
        charIndex--
        typedWord.value = phrase.slice(0, charIndex)
        if (charIndex === 0) {
          phraseIndex = (phraseIndex + 1) % TYPED_PHRASES.length
          phrase = TYPED_PHRASES[phraseIndex] ?? ''
          step('typing', 55)
        } else {
          step('deleting', 35)
        }
        return
      }
      charIndex++
      typedWord.value = phrase.slice(0, charIndex)
      const wordDone = charIndex === phrase.length
      step(wordDone ? 'hold' : 'typing', wordDone ? 2000 : 55)
    }, delay)
  }
  step('hold', 2000)
}

onMounted(async () => {
  const [{default: gsap}, {ScrollTrigger}] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
  gsap.registerPlugin(ScrollTrigger)
  await nextTick()
  if (!pageRoot.value) return
  const mm = gsap.matchMedia()
  const refreshSaleFlow = () => ScrollTrigger.refresh()
  window.addEventListener('sale-flow:layout', refreshSaleFlow)
  if ('IntersectionObserver' in window && heroRoot.value) {
    typewriterObserver = new IntersectionObserver(([entry]) => {
      heroInView = Boolean(entry?.isIntersecting)
    }, {threshold: 0})
    typewriterObserver.observe(heroRoot.value)
  } else {
    heroInView = true
  }
  const updatePageVisibility = () => {
    pageHidden = document.hidden
  }
  updatePageVisibility()
  document.addEventListener('visibilitychange', updatePageVisibility)
  const handleTypedResize = () => fitTypedLine()
  window.addEventListener('resize', handleTypedResize)
  const context = gsap.context(() => {
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({
        defaults: {ease: 'power3.out'},
        onComplete: () => {
          fitTypedLine()
          document.fonts?.ready?.then(fitTypedLine)
          typeLoop()
        }
      })
          .from('[data-header]', {y: -20, opacity: 0, duration: .65})
          .from('.hero-kicker', {y: 12, opacity: 0, duration: .5}, '-=.2')
          .from('.hero-line', {yPercent: 115, duration: .9, stagger: .09}, '-=.25')
          .from('.hero-support, .hero-action', {y: 15, opacity: 0, duration: .55, stagger: .07}, '-=.45')
          .from('.hero-photo', {opacity: 0, scale: 1.035, duration: 1.25}, '-=1.15')
      gsap.to('.hero-photo', {
        yPercent: 8,
        scale: 1.1,
        opacity: 0,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: {trigger: '#inicio', start: 'top top', end: '72% top', scrub: .8}
      })
      gsap.to('.hero-copy', {
        yPercent: -32,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {trigger: '#inicio', start: 'top top', end: '40% top', scrub: .7}
      })
      gsap.utils.toArray<HTMLElement>('.reveal-copy').forEach((block) => {
        const children = Array.from(block.children)
        gsap.from(children, {
          opacity: 0,
          y: 34,
          duration: .75,
          stagger: .09,
          ease: 'power3.out',
          scrollTrigger: {trigger: block, start: 'top 82%', once: true}
        })
      })
      gsap.from('.sale-step', {
        opacity: 0,
        y: 18,
        scale: .97,
        stagger: .16,
        duration: .5,
        scrollTrigger: {trigger: '.sale-map', start: 'top 72%', once: true}
      })
      gsap.from('.ecosystem-node', {
        opacity: 0,
        stagger: .08,
        duration: .55,
        ease: 'power2.out',
        scrollTrigger: {trigger: '.ecosystem-orbit', start: 'top 72%', once: true}
      })
      gsap.from('.control-card', {
        y: 70,
        opacity: 0,
        scale: .97,
        stagger: .2,
        ease: 'none',
        scrollTrigger: {trigger: '.control-stage', start: 'top 76%', end: 'bottom 58%', scrub: .65}
      })
      gsap.to('.control-stage__visual img', {
        yPercent: -3,
        scale: 1.06,
        ease: 'none',
        scrollTrigger: {trigger: '.control-stage', start: 'top bottom', end: 'bottom top', scrub: .8}
      })
    })
    mm.add({
      motionAllowed: '(prefers-reduced-motion: no-preference)',
      mobile: '(max-width: 767px)'
    }, (mediaContext) => {
      if (!mediaContext.conditions?.motionAllowed) return

      const pathSelector = mediaContext.conditions.mobile
          ? '.sale-path--mobile'
          : '.sale-path--desktop'
      const pathSvg = pageRoot.value?.querySelector<SVGSVGElement>(pathSelector)
      const paths = pathSvg?.querySelectorAll<SVGPathElement>('[data-sale-path]')
      if (!pathSvg || !paths?.length) return

      const lineTimeline = gsap.timeline({
        scrollTrigger: {trigger: '.sale-map', start: 'top 76%', end: 'bottom 58%', scrub: .7, invalidateOnRefresh: true}
      })
      paths.forEach((path) => {
        const getLength = () => path.getTotalLength()
        lineTimeline.fromTo(path, {
          strokeDasharray: getLength,
          strokeDashoffset: getLength
        }, {
          strokeDashoffset: 0,
          duration: 1,
          ease: 'none'
        })
      })

      const dots = pathSvg.querySelectorAll<SVGCircleElement>('[data-sale-dot]')
      gsap.fromTo(dots, {opacity: 0, scale: 0, transformOrigin: 'center'}, {
        opacity: 1,
        scale: 1,
        duration: .08,
        delay: .16,
        stagger: .22,
        ease: 'none',
        scrollTrigger: {trigger: '.sale-map', start: 'top 76%', end: 'bottom 58%', scrub: .7}
      })
    })
  }, pageRoot.value)
  destroyMotion = () => {
    window.removeEventListener('sale-flow:layout', refreshSaleFlow)
    document.removeEventListener('visibilitychange', updatePageVisibility)
    window.removeEventListener('resize', handleTypedResize)
    typewriterObserver?.disconnect()
    if (typewriterTimer) clearTimeout(typewriterTimer)
    mm.revert();
    context.revert()
  }
})
onBeforeUnmount(() => {
  destroyMotion?.()
})
</script>

<template>
  <div ref="pageRoot" class="page-shell">
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <SiteHeader/>
    <main id="conteudo">
      <section id="inicio" ref="heroRoot" class="hero-home"><img class="hero-photo" :src="heroUrl"
                                                                 alt="Empreendedora trabalhando ao lado de um notebook"
                                                                 fetchpriority="high">
        <div class="hero-overlay"></div>
        <div class="site-container hero-layout">
          <div class="hero-copy"><p class="hero-kicker"><span></span>Sua operação digital, bem resolvida</p>
            <h1 class="hero-title"><span class="sr-only">Ecommerce simples para negócios reais.</span><span
                aria-hidden="true"><i class="hero-line">Ecommerce</i></span><span aria-hidden="true"><i
                class="hero-line">simples para</i></span><span
                ref="typedLineWrap" aria-hidden="true"><i ref="typedLineEl"
                                                          class="hero-line hero-line--typed">{{ typedWord }}<span
                class="hero-cursor"></span></i></span></h1>
            <p class="hero-support">Uma plataforma completa para criar, gerenciar e fazer o seu negócio crescer, com
              mais vendas e menos complicação.</p>
            <div class="hero-actions">
              <MarketingButton class="hero-action" variant="primary" href="/criar-loja">Criar minha loja
                <template #icon>
                  <ArrowRight :size="17"/>
                </template>
              </MarketingButton>
              <a class="hero-action hero-secondary" href="#jornada">Conhecer a plataforma
                <ArrowRight :size="15"/>
              </a></div>
          </div>
        </div>
      </section>
      <SaleFlowSection/>
      <EcosystemSection/>
      <OperationSection/>
      <ProductShotSection/>
      <SegmentsSection/>
      <IntegrationsSection/>
      <PricingSection :plans="plans" @select="openCheckout"/>
      <section class="chapter final-cta">
        <div class="site-container final-cta__inner reveal-copy">
          <p class="site-label">
            Pronto para o próximo movimento?
          </p>
          <h2 class="site-title">Seu negócio<br>pode vender<br>melhor.</h2>
          <p>Comece com uma estrutura simples hoje e evolua sem trocar de plataforma amanhã.</p>
          <div>
            <MarketingButton variant="primary" href="/criar-loja">Criar minha loja
              <template #icon>
                <ArrowRight :size="18"/>
              </template>
            </MarketingButton>
            <a href="mailto:contato@elinea.com.br">Falar com especialista</a></div>
        </div>
      </section>
    </main>
    <SiteFooter/>
  </div>
</template>
