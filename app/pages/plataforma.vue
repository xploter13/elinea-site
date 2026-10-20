<script setup lang="ts">
import merchantUrl from '~/assets/images/elinea-merchant-operation.webp'
import platformHeroUrl from '~/assets/images/elinea-platform-hero-documental.webp'
import IntegrationsSection from '~/components/site/IntegrationsSection.vue'
import {MarketingButton, MarketingTextButton} from '@elinea/ui/marketing'
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Check,
  CircleUserRound,
  MessageCircle,
  PackageCheck,
  ShoppingBag,
  Sparkles,
  Store
} from '@lucide/vue'

const pageRoot = ref<HTMLElement | null>(null)
let destroyMotion: (() => void) | undefined

const capabilities = [
  {
    icon: Store,
    title: 'Loja virtual',
    text: 'Uma vitrine própria, responsiva e preparada para apresentar sua marca com clareza em qualquer tela.',
    tag: 'Sua marca na frente'
  },
  {
    icon: Boxes,
    title: 'Catálogo e estoque',
    text: 'Produtos, categorias, variações e disponibilidade organizados para a venda não parar no operacional.',
    tag: 'Tudo no lugar'
  },
  {
    icon: ShoppingBag,
    title: 'Pedidos e pagamentos',
    text: 'Acompanhe o pedido da entrada à conclusão e mantenha cada etapa acessível para quem cuida da operação.',
    tag: 'Da venda ao pós-venda'
  },
  {
    icon: CircleUserRound,
    title: 'Clientes',
    text: 'Histórico e contexto comercial próximos da rotina para atender melhor e construir relacionamento.',
    tag: 'Proximidade com contexto'
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp e automações',
    text: 'Conecte conversas, eventos de pedidos e jornadas automáticas sem separar atendimento e venda.',
    tag: 'Conversa que continua'
  },
]

const workflow = [
  {icon: ShoppingBag, label: 'A venda entra', text: 'O pedido chega com os dados necessários para a operação começar.'},
  {
    icon: PackageCheck,
    label: 'A rotina responde',
    text: 'Pagamento, estoque e status avançam em uma sequência organizada.'
  },
  {
    icon: MessageCircle,
    label: 'O cliente acompanha',
    text: 'A comunicação mantém cada pessoa informada ao longo da jornada.'
  },
  {icon: BarChart3, label: 'Você decide melhor', text: 'A operação reunida cria contexto para o próximo movimento.'},
]

const storefrontStatement = 'A experiência de compra permanece simples para o cliente enquanto catálogo, estoque e pedidos trabalham juntos nos bastidores.'

const storefrontPillars = [
  {label: 'Vitrine', text: 'Responsiva e com a identidade da sua marca, em qualquer tela.'},
  {label: 'Catálogo e estoque', text: 'Produtos, variações e disponibilidade organizados no mesmo lugar.'},
  {label: 'Pedidos', text: 'Cada venda acompanhada da entrada à conclusão.'},
]

useSeoMeta({
  title: 'Plataforma Elínea — Loja, pedidos e operação em um só lugar',
  description: 'Conheça a plataforma Elínea para criar sua loja virtual e centralizar catálogo, pedidos, clientes, pagamentos e WhatsApp.',
  ogTitle: 'Plataforma Elínea',
  ogDescription: 'Sua operação digital conectada do catálogo ao relacionamento com o cliente.',
})

onMounted(async () => {
  const [{default: gsap}, {ScrollTrigger}] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
  gsap.registerPlugin(ScrollTrigger)
  if (!pageRoot.value) return
  const mm = gsap.matchMedia()
  const context = gsap.context(() => {
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({defaults: {ease: 'power3.out'}})
          .from('[data-header]', {y: -20, opacity: 0, duration: .6})
          .from('.platform-hero__eyebrow, .platform-hero__title span, .platform-hero__bottom, .platform-hero__scope', {
            y: 28,
            opacity: 0,
            duration: .65,
            stagger: .08
          }, '-=.2')

      gsap.utils.toArray<HTMLElement>('[data-platform-reveal]').forEach((block) => {
        gsap.from(block.children, {
          y: 30,
          opacity: 0,
          duration: .7,
          stagger: .08,
          ease: 'power3.out',
          scrollTrigger: {trigger: block, start: 'top 82%', once: true}
        })
      })
      gsap.fromTo('.platform-storefront__word', {opacity: .16}, {
        opacity: 1,
        stagger: .12,
        ease: 'none',
        scrollTrigger: {trigger: '.platform-storefront__statement', start: 'top 82%', end: 'bottom 48%', scrub: .6}
      })
      gsap.utils.toArray<HTMLElement>('.platform-storefront__pillars li').forEach((row) => {
        gsap.from(row.querySelectorAll('small, p'), {
          y: 28,
          opacity: 0,
          duration: .8,
          stagger: .12,
          ease: 'power3.out',
          scrollTrigger: {trigger: row, start: 'top 88%', once: true}
        })
        gsap.from(row.querySelector('b'), {
          y: 28,
          duration: .8,
          ease: 'power3.out',
          scrollTrigger: {trigger: row, start: 'top 88%', once: true}
        })
        gsap.fromTo(row.querySelector('b'), {opacity: .25}, {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {trigger: row, start: 'top 85%', end: 'top 55%', scrub: .5}
        })
      })
      gsap.from('.platform-workflow__line', {
        scaleX: 0,
        transformOrigin: 'left center',
        ease: 'none',
        scrollTrigger: {trigger: '.platform-workflow__track', start: 'top 78%', end: 'bottom 62%', scrub: .7}
      })
      gsap.from('.platform-workflow__step', {
        y: 24,
        opacity: 0,
        stagger: .14,
        duration: .55,
        scrollTrigger: {trigger: '.platform-workflow__track', start: 'top 74%', once: true}
      })
      gsap.from('.platform-start__card', {
        y: 28,
        opacity: 0,
        stagger: .12,
        duration: .6,
        scrollTrigger: {trigger: '.platform-start__steps', start: 'top 80%', once: true}
      })

      const capabilitiesSection = pageRoot.value?.querySelector<HTMLElement>('.platform-capabilities')
      const capabilitiesIntro = capabilitiesSection?.querySelector<HTMLElement>('.platform-capabilities__intro')
      const firstCapability = capabilitiesSection?.querySelector<HTMLElement>('.platform-capabilities__card')
      if (capabilitiesSection && capabilitiesIntro && firstCapability) {
        gsap.timeline({
          scrollTrigger: {
            trigger: capabilitiesSection,
            start: 'top 88%',
            end: 'top 34%',
            scrub: .55,
          },
        })
            .fromTo(capabilitiesIntro.children, {y: 16, opacity: 0}, {y: 0, opacity: 1, stagger: .035, ease: 'none'}, 0)
            .fromTo(firstCapability.children, {y: 32, opacity: 0}, {y: 0, opacity: 1, stagger: .035, ease: 'none'}, 0)
      }
    })

  }, pageRoot.value)
  destroyMotion = () => {
    mm.revert();
    context.revert()
  }
})

onBeforeUnmount(() => destroyMotion?.())
</script>

<template>
  <div ref="pageRoot" class="page-shell platform-page">
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <SiteHeader/>

    <main id="conteudo">
      <section class="platform-hero">
        <img class="platform-hero__photo" :src="platformHeroUrl" alt="Comerciante conferindo pedidos no celular enquanto prepara uma encomenda" fetchpriority="high" width="1672" height="941">
        <div class="platform-hero__overlay"></div>
        <div class="site-container platform-hero__layout">
          <div class="platform-hero__content">
            <p class="platform-hero__eyebrow"><span></span>Uma base para toda a sua operação</p>
            <h1 class="platform-hero__title">
              <span>Venda com simplicidade.</span><span>Cresça com estrutura.</span></h1>
            <div class="platform-hero__bottom">
              <p class="platform-hero__copy">Crie sua loja, organize produtos, acompanhe pedidos e mantenha clientes e
                conversas no mesmo ecossistema.</p>
              <div class="platform-hero__actions">
                <MarketingButton variant="primary" href="/criar-loja">Criar minha loja
                  <template #icon>
                    <ArrowRight :size="17"/>
                  </template>
                </MarketingButton>
                <MarketingTextButton tone="light" href="mailto:contato@elinea.com.br">Falar com consultores</MarketingTextButton>
              </div>
            </div>
          </div>
          <ul class="platform-hero__scope" aria-label="Áreas da plataforma">
            <li>Loja virtual</li><li>Operação</li><li>Relacionamento</li>
          </ul>
        </div>
      </section>

      <section class="chapter platform-storefront">
        <div class="site-container platform-storefront__inner">
          <div class="platform-storefront__head" data-platform-reveal>
            <p class="site-label">Uma presença digital que parece sua</p>
            <h2 class="site-title">Sua marca na frente.<br><span>A estrutura por trás.</span></h2>
          </div>
          <p class="platform-storefront__statement" :aria-label="storefrontStatement">
            <span v-for="(word, index) in storefrontStatement.split(' ')" :key="index" class="platform-storefront__word" aria-hidden="true">{{ word }}</span>
          </p>
          <ul class="platform-storefront__pillars">
            <li v-for="(pillar, index) in storefrontPillars" :key="pillar.label">
              <i class="platform-storefront__rule"></i>
              <small>0{{ index + 1 }}</small>
              <b>{{ pillar.label }}</b>
              <p>{{ pillar.text }}</p>
            </li>
          </ul>
          <MarketingTextButton class="chapter-text-cta" href="/criar-loja">Criar minha loja</MarketingTextButton>
        </div>
      </section>

      <section class="chapter platform-workflow">
        <div class="site-container">
          <div class="platform-workflow__heading" data-platform-reveal>
            <div><p class="site-label">A operação continua depois do clique</p>
              <h2 class="site-title">Um pedido entra.<br>O restante se organiza.</h2></div>
            <p class="site-copy">Cada etapa compartilha contexto com a próxima. Menos retrabalho para você, mais clareza
              para quem compra.</p>
          </div>
          <div class="platform-workflow__track">
            <span class="platform-workflow__line"></span>
            <article v-for="(item, index) in workflow" :key="item.label" class="platform-workflow__step">
              <span><component :is="item.icon" :size="22" aria-hidden="true"/></span><small>0{{ index + 1 }}</small>
              <h3>{{ item.label }}</h3>
              <p>{{ item.text }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="recursos" class="chapter platform-capabilities">
        <div class="site-container platform-capabilities__layout">
          <div class="platform-capabilities__intro">
            <p class="site-label">Recursos que formam uma operação</p>
            <h2 class="site-title">Uma plataforma.<br>Muitos movimentos.</h2>
            <p class="site-copy">Comece com o que o seu negócio precisa agora e mantenha uma base preparada para o
              próximo passo.</p>
          </div>
          <div class="platform-capabilities__list">
            <article v-for="(item, index) in capabilities" :key="item.title" class="platform-capabilities__card">
              <div><span><component :is="item.icon" :size="23" aria-hidden="true"/></span><small>0{{
                  index + 1
                }}</small></div>
              <p>{{ item.tag }}</p>
              <h3>{{ item.title }}</h3><strong>{{ item.text }}</strong>
            </article>
          </div>
        </div>
      </section>

      <section class="chapter platform-scale">
        <div class="site-container platform-scale__layout">
          <div class="platform-scale__image">
            <img :src="merchantUrl" alt="Comerciante conferindo pedidos em um tablet entre as embalagens da loja" loading="lazy" width="2400" height="1602">
            <span><Sparkles :size="18"/> Estrutura que acompanha o negócio</span>
          </div>
          <div class="platform-section-copy" data-platform-reveal>
            <p class="site-label">Evolução sem recomeçar</p>
            <h2 class="site-title">Comece simples.<br>Evolua com<br>continuidade.</h2>
            <p class="site-copy">Da primeira organização do catálogo a uma operação com loja, pagamentos, automações e
              atendimento, a Elínea cresce junto com a sua rotina.</p>
            <ul>
              <li>
                <Check :size="17"/>
                Planos para diferentes momentos
              </li>
              <li>
                <Check :size="17"/>
                Processos conectados
              </li>
              <li>
                <Check :size="17"/>
                Suporte próximo
              </li>
            </ul>
            <MarketingTextButton class="chapter-text-cta" href="/precos#planos">Conhecer os planos</MarketingTextButton>
          </div>
        </div>
      </section>

      <IntegrationsSection/>

      <section class="chapter final-cta platform-final">
        <div class="site-container final-cta__inner" data-platform-reveal>
          <p class="site-label">Sua próxima estrutura começa aqui</p>
          <h2 class="site-title">Uma plataforma.<br>Seu negócio<br>em movimento.</h2>
          <p>Venda com uma base organizada hoje e continue evoluindo amanhã.</p>
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

<style scoped>
.platform-page {
  overflow: visible;
}

.platform-hero {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  padding: clamp(8rem, 15vh, 11rem) 0 2.25rem;
  background: #071310;
  color: white;
  isolation: isolate;
}

.platform-hero__photo {
  position: absolute;
  z-index: -2;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.platform-hero__overlay {
  position: absolute;
  z-index: -1;
  inset: 0;
  background: linear-gradient(90deg, rgba(4,17,14,.94) 0%, rgba(4,17,14,.77) 37%, rgba(4,17,14,.28) 68%, rgba(4,17,14,.08) 100%);
}

.platform-hero__layout {
  position: relative;
  display: flex;
  min-height: calc(100svh - clamp(8rem, 15vh, 11rem) - 2.25rem);
  flex-direction: column;
  justify-content: space-between;
}

.platform-hero__content {
  position: relative;
  z-index: 2;
  display: flex;
  min-height: 0;
  padding-block: clamp(2rem, 8vh, 6rem);
  flex: 1;
  flex-direction: column;
  justify-content: center;
}

.platform-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: .65rem;
  color: rgba(255, 255, 255, .66);
  font-size: .8rem;
  font-weight: 500;
}

.platform-hero__eyebrow span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--green-bright);
}

.platform-hero__title {
  max-width: min(64vw, 940px);
  margin-top: clamp(2rem, 4.5vh, 3.75rem);
  color: white;
  font-size: clamp(4rem, 5.8vw, 6.4rem);
  font-weight: 700;
  line-height: .98;
  letter-spacing: -.055em;
}

.platform-hero__title span {
  display: block;
  text-wrap: balance;
}

.platform-hero__title span:last-child {
  color: #a8edc4;
}

.platform-hero__bottom {
  display: grid;
  max-width: min(60vw, 780px);
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(1.25rem, 2vw, 2rem);
  align-items: start;
  margin-top: clamp(2.5rem, 6vh, 4.5rem);
}

.platform-hero__copy {
  max-width: 36rem;
  color: rgba(255, 255, 255, .72);
  font-size: clamp(1rem, 1.18vw, 1.18rem);
  line-height: 1.65;
}

.platform-hero__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: clamp(1rem, 2vw, 2rem);
}

.platform-hero__scope {
  position: relative;
  display: flex;
  margin: 0;
  padding: 1.35rem 0 0;
  flex-wrap: wrap;
  gap: .65rem clamp(1.5rem, 5vw, 5rem);
  border-top: 1px solid rgba(255, 255, 255, .22);
  color: rgba(255, 255, 255, .62);
  font-size: .78rem;
  font-weight: 500;
  list-style: none;
}

.platform-hero__scope li::before {
  display: inline-block;
  width: 5px;
  height: 5px;
  margin-right: .7rem;
  border-radius: 50%;
  background: var(--green-bright);
  vertical-align: middle;
  content: '';
}

.platform-storefront {
  background: var(--paper);
}

.platform-storefront__layout, .platform-scale__layout {
  display: grid;
  grid-template-columns: .72fr 1.28fr;
  gap: clamp(3rem, 7vw, 8rem);
  align-items: center;
}

.platform-section-copy {
  max-width: 650px;
}

.platform-section-copy .site-title span {
  color: #65736e;
  font-weight: 700;
}

.platform-storefront__inner {
  display: grid;
  width: min(100% - (var(--gutter) * 2), 1440px);
  grid-template-columns: minmax(0, 1fr);
  justify-items: center;
  text-align: center;
}

.platform-storefront__head .site-title {
  max-width: 14ch;
  margin-inline: auto;
}

.platform-storefront__head .site-title span {
  color: #65736e;
}

.platform-storefront__word {
  display: inline-block;
  margin-right: .26em;
}

.platform-storefront__word:last-child {
  margin-right: 0;
}

.platform-storefront__statement {
  max-width: 1040px;
  margin: clamp(3rem, 6vw, 5.5rem) 0 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3.1vw, 3rem);
  font-weight: 600;
  line-height: 1.18;
  letter-spacing: -.025em;
  text-wrap: balance;
}

.platform-storefront__pillars {
  width: 100%;
  max-width: 1180px;
  margin: clamp(3.5rem, 7vw, 6.5rem) 0 0;
  padding: 0;
  list-style: none;
  text-align: left;
}

.platform-storefront__pillars li {
  position: relative;
  display: grid;
  padding: clamp(1.6rem, 3vw, 2.6rem) 0;
  grid-template-columns: clamp(3.5rem, 7vw, 6rem) minmax(0, 1.15fr) minmax(0, .85fr);
  align-items: baseline;
  gap: clamp(1rem, 3vw, 3rem);
  border-bottom: 1px solid rgba(13, 23, 21, .12);
}

.platform-storefront__rule {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--green);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform .6s cubic-bezier(.22, 1, .36, 1);
}

.platform-storefront__pillars li:hover .platform-storefront__rule {
  transform: scaleX(1);
}

.platform-storefront__pillars small {
  color: var(--green);
  font-size: .8rem;
  font-weight: 600;
  letter-spacing: .1em;
}

.platform-storefront__pillars b {
  font-family: var(--font-display);
  font-size: clamp(1.7rem, 3.4vw, 3.2rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -.035em;
  transition: transform .5s cubic-bezier(.22, 1, .36, 1);
}

.platform-storefront__pillars li:hover b {
  transform: translateX(.6rem);
}

.platform-storefront__pillars p {
  max-width: 24rem;
  margin: 0;
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.6;
}

.platform-storefront .chapter-text-cta {
  margin-top: clamp(3rem, 6vw, 5rem);
}

.platform-workflow {
  background: var(--ink);
  color: white;
}

.platform-workflow__heading {
  display: grid;
  grid-template-columns: 1.2fr .6fr;
  gap: 4rem;
  align-items: end;
}

.platform-workflow .site-title {
  color: white;
}

.platform-workflow .site-copy {
  color: rgba(255, 255, 255, .55);
}

.platform-workflow__track {
  position: relative;
  display: grid;
  margin-top: clamp(4rem, 8vw, 7rem);
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.platform-workflow__line {
  position: absolute;
  top: 30px;
  left: 30px;
  right: calc(25% - 30px - .9375rem);
  height: 1px;
  background: linear-gradient(90deg, var(--green), var(--green-bright));
}

.platform-workflow__step {
  position: relative;
  z-index: 2;
  padding-right: 1rem;
}

.platform-workflow__step > span {
  display: grid;
  width: 60px;
  height: 60px;
  place-items: center;
  border: 1px solid rgba(92, 221, 164, .25);
  border-radius: 50%;
  background: var(--ink);
  color: var(--green-bright);
}

.platform-workflow__step > small {
  display: block;
  margin-top: 2rem;
  color: var(--green-bright);
  font-size: .65rem;
  font-weight: 500;
}

.platform-workflow__step h3 {
  margin-top: .65rem;
  color: white;
  font-size: var(--aux-title-size);
}

.platform-workflow__step p {
  margin-top: .8rem;
  color: rgba(255, 255, 255, .52);
  font-size: var(--description-size);
  line-height: 1.65;
}

.platform-capabilities {
  overflow: visible;
  align-items: flex-start;
  background: #f3f7f4;
}

.platform-capabilities__layout {
  display: grid;
  grid-template-columns: .75fr 1.25fr;
  gap: clamp(4rem, 8vw, 9rem);
}

.platform-capabilities__intro {
  position: sticky;
  top: calc(var(--section-space) + clamp(2.5rem, 5svh, 3.5rem));
  align-self: start;
}

.platform-capabilities__list {
  position: relative;
  padding-bottom: clamp(4rem, 10vh, 8rem);
}

.platform-capabilities__card {
  position: sticky;
  top: calc(50svh - 155px);
  z-index: 1;
  display: grid;
  min-height: 310px;
  padding: clamp(2rem, 4vw, 3.5rem) 0;
  align-content: center;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background: #f3f7f4;
}

.platform-capabilities__card + .platform-capabilities__card {
  margin-top: -1px;
}

.platform-capabilities__card:nth-child(2) {
  z-index: 2;
}

.platform-capabilities__card:nth-child(3) {
  z-index: 3;
}

.platform-capabilities__card:nth-child(4) {
  z-index: 4;
}

.platform-capabilities__card:nth-child(5) {
  z-index: 5;
}

.platform-capabilities__list article > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.platform-capabilities__list article > div > span {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 14px;
  background: var(--green-light);
  color: var(--green);
}

.platform-capabilities__list article > div > small {
  color: #9aa7a2;
  font-size: .65rem;
  font-weight: 500;
}

.platform-capabilities__list article > p {
  margin-top: 2rem;
  color: var(--green);
  font-size: .7rem;
  font-weight: 500;
}

.platform-capabilities__list h3 {
  margin-top: .5rem;
  font-size: clamp(2rem, 4vw, 4.5rem);
  letter-spacing: -.03em;
}

.platform-capabilities__list article > strong {
  max-width: 42rem;
  margin-top: 1.1rem;
  color: var(--muted);
  font-size: var(--description-size);
  font-weight: 600;
  line-height: 1.7;
}

.platform-scale {
  background: white;
}

.platform-scale__layout {
  grid-template-columns: 1.18fr .82fr;
}

.platform-scale__image {
  position: relative;
  min-height: 680px;
}

.platform-scale__image img {
  width: 100%;
  height: 680px;
  border-radius: 30px;
  object-fit: cover;
  object-position: 60% center;
}

.platform-scale__image > span {
  position: absolute;
  left: 1.5rem;
  bottom: 1.5rem;
  display: inline-flex;
  padding: .8rem 1rem;
  align-items: center;
  gap: .5rem;
  border-radius: 12px;
  background: white;
  color: var(--green);
  font-size: .7rem;
  font-weight: 500;
  box-shadow: var(--shadow);
}

.platform-section-copy ul {
  display: grid;
  gap: .7rem;
  margin: 1.6rem 0 0;
  padding: 0;
  list-style: none;
  color: var(--muted);
  font-size: var(--description-size);
  font-weight: 500;
}

.platform-section-copy li {
  display: flex;
  align-items: center;
  gap: .6rem;
}

.platform-section-copy li svg {
  color: var(--green);
}

.platform-start {
  background: #edf4f0;
}

.platform-start__heading {
  max-width: 900px;
}

.platform-start__steps {
  display: grid;
  margin-top: clamp(3.5rem, 7vw, 6rem);
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
}

.platform-start__card {
  position: relative;
  display: block;
  overflow: hidden;
  min-height: 460px;
  border-radius: 20px;
  isolation: isolate;
  color: white;
}

.platform-start__photo {
  position: absolute;
  z-index: -2;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform .5s ease;
}

.platform-start__card:hover .platform-start__photo,
.platform-start__card:focus-visible .platform-start__photo {
  transform: scale(1.05);
}

.platform-start__scrim {
  position: absolute;
  z-index: -1;
  inset: 0;
  background: linear-gradient(180deg, rgba(4, 17, 14, .1) 0%, rgba(4, 17, 14, .18) 45%, rgba(4, 17, 14, .88) 100%);
  transition: background .35s ease;
}

.platform-start__card:hover .platform-start__scrim,
.platform-start__card:focus-visible .platform-start__scrim {
  background: linear-gradient(180deg, rgba(4, 17, 14, .22) 0%, rgba(4, 17, 14, .3) 40%, rgba(4, 17, 14, .93) 100%);
}

.platform-start__body {
  position: absolute;
  right: 1.25rem;
  bottom: 1.25rem;
  left: 1.25rem;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
}

.platform-start__text p {
  max-height: 0;
  margin-bottom: 0;
  overflow: hidden;
  opacity: 0;
  color: rgba(255, 255, 255, .78);
  font-size: var(--description-size);
  line-height: 1.55;
  transition: max-height .35s ease, opacity .3s ease, margin-bottom .35s ease;
}

.platform-start__card:hover .platform-start__text p,
.platform-start__card:focus-visible .platform-start__text p {
  max-height: 9rem;
  margin-bottom: .6rem;
  opacity: 1;
}

.platform-start__text h3 {
  color: white;
  font-size: var(--aux-title-size);
  letter-spacing: -.005em;
}

.platform-start__arrow {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  background: white;
  color: var(--ink);
  opacity: 0;
  transform: translateY(6px) scale(.85);
  transition: opacity .3s ease, transform .3s ease;
}

.platform-start__card:hover .platform-start__arrow,
.platform-start__card:focus-visible .platform-start__arrow {
  opacity: 1;
  transform: translateY(0) scale(1);
}

@media (hover: none) {
  .platform-start__text p {
    max-height: none;
    margin-bottom: .6rem;
    opacity: 1;
  }

  .platform-start__arrow {
    opacity: 1;
    transform: none;
  }
}

.platform-final {
  min-height: 100svh;
}

@media (max-width: 1080px) {
  .platform-hero__title {
    max-width: 68vw;
    font-size: clamp(3.8rem, 7.2vw, 6rem);
  }

  .platform-hero__bottom {
    max-width: 68vw;
  }

  .platform-storefront__layout, .platform-scale__layout {
    grid-template-columns: 1fr;
  }

  .platform-section-copy {
    max-width: 780px;
  }

  .platform-capabilities__layout {
    grid-template-columns: 1fr;
  }

  .platform-capabilities__intro {
    position: static;
    max-width: 800px;
    transform: none;
  }

  .platform-capabilities__list {
    display: grid;
    padding-bottom: 0;
    grid-template-columns: 1fr 1fr;
    border-top: 1px solid var(--line);
  }

  .platform-capabilities__list .platform-capabilities__card {
    position: static;
    top: auto;
    z-index: auto;
    min-height: 310px;
    margin-top: 0;
    padding: 2rem;
    border: 0;
    border-right: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    border-radius: 0;
    background: transparent;
    box-shadow: none;
  }

  .platform-scale__image {
    order: 2;
  }
}

@media (max-width: 767px) {
  .platform-hero {
    min-height: auto;
    padding: 7.75rem 0 2.4rem;
  }

  .platform-hero__photo { object-position: 78% center; }
  .platform-hero__overlay { background: linear-gradient(180deg, rgba(4,17,14,.9) 0%, rgba(4,17,14,.78) 58%, rgba(4,17,14,.55) 100%); }

  .platform-hero__layout {
    min-height: 0;
  }

  .platform-hero__content {
    padding: 2rem 0 3.5rem;
  }

  .platform-hero__title {
    max-width: 100%;
    margin-top: 2.2rem;
    font-size: clamp(3.1rem, 13.5vw, 5.5rem);
    line-height: .98;
  }

  .platform-hero__bottom {
    max-width: 100%;
    margin-top: 2.5rem;
    gap: 1.7rem;
  }

  .platform-hero__actions {
    align-items: flex-start;
    flex-direction: column;
  }

  .platform-hero__scope {
    gap: .8rem 1.2rem;
  }

  .platform-storefront__pillars li {
    grid-template-columns: 2.4rem 1fr;
    gap: .6rem 1rem;
  }

  .platform-storefront__pillars p {
    grid-column: 2;
  }

  .platform-workflow__heading {
    grid-template-columns: 1fr;
    gap: .5rem;
  }

  .platform-workflow__track {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .platform-workflow__line {
    top: 5%;
    bottom: 5%;
    left: 30px;
    width: 1px;
    height: auto;
    transform: none !important;
  }

  .platform-workflow__step {
    min-height: 150px;
    padding-left: 85px;
  }

  .platform-workflow__step > span {
    position: absolute;
    left: 0;
  }

  .platform-workflow__step > small {
    margin-top: 0;
  }

  .platform-capabilities__list {
    grid-template-columns: 1fr;
  }

  .platform-capabilities__list article {
    min-height: 280px;
    padding: 2rem 0;
    border-right: 0;
  }

  .platform-scale__image, .platform-scale__image img {
    min-height: 480px;
    height: 480px;
  }

  .platform-start__steps {
    grid-template-columns: 1fr;
  }

  .platform-start__card {
    min-height: 380px;
  }
}

</style>
