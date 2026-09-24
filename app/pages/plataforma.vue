<script setup lang="ts">
import merchantUrl from '~/assets/images/elinea-merchant-operation.png'
import pricingHeroUrl from '~/assets/images/elinea-pricing-hero-natural.webp'
import controlConceptUrl from '~/assets/images/elinea-control-concept.png'
import platformMerchantUrl from '~/assets/images/elinea-platform-merchant-v3.png'
import resourcesHeroUrl from '~/assets/images/elinea-resources-hero--.webp'
import IntegrationsSection from '~/components/home/IntegrationsSection.vue'
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

const startSteps = [
  {
    image: pricingHeroUrl,
    imageAlt: 'Comerciante avaliando o crescimento do negócio',
    title: 'Escolha seu caminho',
    text: 'Encontre o plano que acompanha o momento atual do negócio.',
    cta: {href: '/precos#planos'}
  },
  {
    image: controlConceptUrl,
    imageAlt: 'Composição conceitual representando a organização da operação',
    title: 'Organize a estrutura',
    text: 'Configure catálogo, identidade e os fluxos necessários para começar.',
    cta: {href: '/recursos'}
  },
  {
    image: resourcesHeroUrl,
    imageAlt: 'Comerciante preparando pedidos de uma loja virtual',
    title: 'Venda e evolua',
    text: 'Coloque a operação no ar e amplie os recursos quando fizer sentido.',
    cta: {href: 'mailto:contato@elinea.com.br'}
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
          .from('.platform-hero__eyebrow, .platform-hero__title span, .platform-hero__copy, .platform-hero__actions', {
            y: 28,
            opacity: 0,
            duration: .65,
            stagger: .08
          }, '-=.2')
          .from('.platform-console', {y: 36, opacity: 0, scale: .975, duration: .85}, '-=.75')

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
        <div class="site-container platform-hero__layout">
          <div class="platform-hero__content">
            <p class="platform-hero__eyebrow"><span></span>Uma base para toda a sua operação</p>
            <h1 class="platform-hero__title">
              <span>Venda com</span><span>simplicidade.</span><span>Cresça com estrutura.</span></h1>
            <p class="platform-hero__copy">Crie sua loja, organize produtos, acompanhe pedidos e mantenha clientes e
              conversas no mesmo ecossistema.</p>
            <div class="platform-hero__actions">
              <MarketingButton variant="primary" href="/precos#planos">Criar minha loja
                <template #icon>
                  <ArrowRight :size="17"/>
                </template>
              </MarketingButton>
              <MarketingTextButton tone="light" href="#recursos">Falar com consultores</MarketingTextButton>
            </div>
          </div>

          <figure class="platform-console">
            <img :src="platformMerchantUrl" width="1536" height="1024" loading="eager" fetchpriority="high"
                 decoding="async"
                 alt="Empreendedora conferindo pedidos no celular enquanto prepara uma embalagem em sua loja"/>
          </figure>
        </div>
      </section>

      <section class="chapter platform-storefront">
        <div class="site-container platform-storefront__layout">
          <div class="platform-section-copy" data-platform-reveal>
            <p class="site-label">Uma presença digital que parece sua</p>
            <h2 class="site-title">Sua marca<br>na frente.<br><span>A estrutura<br>por trás.</span></h2>
            <p class="site-copy">A experiência de compra permanece simples para o cliente enquanto catálogo, estoque e
              pedidos trabalham juntos nos bastidores.</p>
            <MarketingTextButton class="chapter-text-cta" href="/precos#planos">Criar minha loja</MarketingTextButton>
          </div>
          <div class="storefront-scene" aria-label="Representação de uma loja virtual responsiva">
            <div class="storefront-window">
              <header><strong>SUA MARCA</strong>
                <nav><span>Novidades</span><span>Produtos</span><span>Contato</span></nav>
                <ShoppingBag :size="18"/>
              </header>
              <div class="storefront-window__hero"><span>Nova coleção</span><strong>Feita para<br>o seu
                momento.</strong><i></i></div>
              <div class="storefront-products">
                <article v-for="tone in ['green', 'sand', 'ink']" :key="tone"><i :class="`is-${tone}`"></i><small>Produto
                  selecionado</small><b>Pronto para vender</b></article>
              </div>
            </div>
            <div class="storefront-phone"><span></span>
              <div><i></i><strong>SUA MARCA</strong><small>Compre de onde estiver.</small></div>
            </div>
          </div>
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
          <div class="platform-scale__image"><img :src="merchantUrl"
                                                  alt="Comerciante acompanhando sua operação digital em um tablet"
                                                  loading="lazy" width="1672" height="941"><span><Sparkles :size="18"/> Estrutura que acompanha o negócio</span>
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

      <section class="chapter platform-start">
        <div class="site-container">
          <div class="platform-start__heading" data-platform-reveal><p class="site-label">Da ideia à operação</p>
            <h2 class="site-title">Coloque seu negócio<br>em movimento.</h2></div>
          <div class="platform-start__steps">
            <a v-for="item in startSteps" :key="item.title" class="platform-start__card" :href="item.cta.href">
              <img class="platform-start__photo" :src="item.image" :alt="item.imageAlt" loading="lazy">
              <div class="platform-start__scrim" aria-hidden="true"></div>

              <div class="platform-start__body">
                <div class="platform-start__text">
                  <p>{{ item.text }}</p>
                  <h3>{{ item.title }}</h3>
                </div>
                <span class="platform-start__arrow" aria-hidden="true"><ArrowRight :size="18"/></span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section class="chapter final-cta platform-final">
        <div class="site-container final-cta__inner" data-platform-reveal>
          <p class="site-label">Sua próxima estrutura começa aqui</p>
          <h2 class="site-title">Uma plataforma.<br>Seu negócio<br>em movimento.</h2>
          <p>Venda com uma base organizada hoje e continue evoluindo amanhã.</p>
          <div>
            <MarketingButton variant="primary" href="/precos#planos">Criar minha loja
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
  padding: 8.5rem 0 2rem;
  background: radial-gradient(circle at 76% 42%, rgba(7, 148, 94, .18), transparent 27%), #071310;
  color: white;
}

.platform-hero::before {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, .025) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, .025) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, black, transparent 88%);
  content: '';
}

.platform-hero__layout {
  position: relative;
  display: grid;
  min-height: calc(100svh - 13rem);
  grid-template-columns: .88fr 1.12fr;
  gap: clamp(3rem, 7vw, 7rem);
  align-items: center;
}

.platform-hero__content {
  position: relative;
  z-index: 2;
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
  box-shadow: 0 0 16px rgba(92, 221, 164, .55);
}

.platform-hero__title {
  margin-top: 1.75rem;
  color: white;
  font-size: clamp(3.8rem, 6.4vw, 7rem);
  font-weight: 700;
  line-height: .93;
  letter-spacing: -.04em;
}

.platform-hero__title span {
  display: block;
}

.platform-hero__copy {
  max-width: 38rem;
  margin-top: 1.75rem;
  color: rgba(255, 255, 255, .64);
  font-size: clamp(1rem, 1.18vw, 1.18rem);
  line-height: 1.7;
}

.platform-hero__actions {
  display: flex;
  margin-top: 2.2rem;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
}

.platform-hero__rail {
  position: relative;
  display: flex;
  padding-top: 1.4rem;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, .1);
  color: rgba(255, 255, 255, .4);
  font-size: .68rem;
  font-weight: 500;
}

.platform-console {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 2;
  margin: 0;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, .1);
  border-radius: 26px;
  background: var(--ink);
  box-shadow: 0 55px 100px -45px rgba(0, 0, 0, .75);
  isolation: isolate;
}

.platform-console img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.platform-console::after {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(255, 255, 255, .08);
  border-radius: inherit;
  box-shadow: inset 0 0 55px rgba(4, 17, 14, .18);
  pointer-events: none;
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

.storefront-scene {
  position: relative;
  min-height: 690px;
}

.storefront-window {
  position: absolute;
  inset: 3% 5% 7% 0;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 22px;
  background: white;
  box-shadow: 0 45px 90px -55px rgba(0, 0, 0, .5);
}

.storefront-window header {
  display: flex;
  height: 66px;
  padding: 0 1.5rem;
  align-items: center;
  border-bottom: 1px solid var(--line);
}

.storefront-window header strong {
  font-family: var(--font-display);
  font-size: .8rem;
}

.storefront-window nav {
  display: flex;
  margin-left: auto;
  align-items: center;
  gap: 1.4rem;
  color: var(--muted);
  font-size: .62rem;
}

.storefront-window header svg {
  margin-left: 1.4rem;
}

.storefront-window__hero {
  position: relative;
  min-height: 300px;
  padding: 3rem;
  overflow: hidden;
  background: #dceee5;
}

.storefront-window__hero span {
  color: var(--green);
  font-size: .7rem;
  font-weight: 500;
}

.storefront-window__hero strong {
  position: relative;
  z-index: 2;
  display: block;
  margin-top: .8rem;
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3.8rem);
  line-height: .97;
  letter-spacing: -.03em;
}

.storefront-window__hero i {
  position: absolute;
  right: 7%;
  bottom: -34%;
  width: 45%;
  aspect-ratio: 1;
  border: 45px solid rgba(7, 148, 94, .2);
  border-radius: 50%;
}

.storefront-products {
  display: grid;
  padding: 1.25rem;
  grid-template-columns: repeat(3, 1fr);
  gap: .8rem;
}

.storefront-products article {
  display: grid;
  gap: .35rem;
}

.storefront-products article > i {
  height: 115px;
  border-radius: 12px;
  background: #dbece4;
}

.storefront-products article > i.is-sand {
  background: #e8e2d7;
}

.storefront-products article > i.is-ink {
  background: #1b2b27;
}

.storefront-products small {
  color: var(--muted);
  font-size: .52rem;
}

.storefront-products b {
  font-size: .65rem;
}

.storefront-phone {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 30%;
  min-width: 180px;
  padding: .6rem;
  border: 6px solid var(--ink);
  border-radius: 28px;
  background: white;
  box-shadow: 0 30px 70px -35px #000;
}

.storefront-phone > span {
  display: block;
  width: 30%;
  height: 4px;
  margin: 0 auto .5rem;
  border-radius: 10px;
  background: var(--ink);
}

.storefront-phone > div {
  display: grid;
  min-height: 250px;
  padding: 1rem;
  place-content: end start;
  border-radius: 18px;
  background: #dceee5;
}

.storefront-phone i {
  display: block;
  width: 70px;
  height: 70px;
  margin-bottom: 2rem;
  border: 16px solid rgba(7, 148, 94, .22);
  border-radius: 50%;
}

.storefront-phone strong {
  font-size: .72rem;
}

.storefront-phone small {
  margin-top: .4rem;
  color: var(--muted);
  font-size: .55rem;
}

.storefront-scene > p {
  position: absolute;
  top: 1%;
  right: 0;
  color: #819089;
  font-family: var(--font-display);
  font-size: 1rem;
  font-style: italic;
  transform: rotate(4deg);
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
  right: 1.5rem;
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
  .platform-hero__layout {
    grid-template-columns: 1fr;
    padding-block: 3rem;
  }

  .platform-hero__content {
    max-width: 800px;
  }

  .platform-console {
    width: min(100%, 820px);
    margin-inline: auto;
    transform: none;
  }

  .platform-storefront__layout, .platform-scale__layout {
    grid-template-columns: 1fr;
  }

  .platform-section-copy {
    max-width: 780px;
  }

  .storefront-scene {
    width: min(100%, 820px);
    margin-inline: auto;
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
    padding-top: 8rem;
  }

  .platform-hero__layout {
    min-height: 0;
    gap: 4rem;
  }

  .platform-hero__title {
    font-size: clamp(3.1rem, 14vw, 4.7rem);
  }

  .platform-hero__actions {
    align-items: flex-start;
    flex-direction: column;
  }

  .platform-hero__rail {
    gap: 1rem;
    overflow: hidden;
  }

  .platform-hero__rail span:nth-child(even) {
    display: none;
  }

  .platform-console {
    aspect-ratio: 4 / 3;
    border-radius: 18px;
  }

  .platform-storefront__layout {
    gap: 3rem;
  }

  .storefront-scene {
    min-height: 520px;
  }

  .storefront-window {
    inset: 0 0 5% 0;
  }

  .storefront-window nav {
    display: none;
  }

  .storefront-window__hero {
    min-height: 230px;
    padding: 2rem 1.25rem;
  }

  .storefront-products {
    padding: .8rem;
  }

  .storefront-products article > i {
    height: 80px;
  }

  .storefront-products article:nth-child(3) {
    display: none;
  }

  .storefront-products {
    grid-template-columns: repeat(2, 1fr);
  }

  .storefront-phone {
    min-width: 135px;
    width: 38%;
  }

  .storefront-phone > div {
    min-height: 190px;
  }

  .storefront-scene > p {
    display: none;
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
