<script setup lang="ts">
import merchantUrl from '~/assets/images/elinea-merchant-operation.png'
import IntegrationsSection from '~/components/home/IntegrationsSection.vue'
import { MarketingButton, MarketingTextButton } from '@elinea/ui/marketing'
import { ArrowRight, BarChart3, Boxes, Check, CircleUserRound, MessageCircle, PackageCheck, PanelsTopLeft, ShoppingBag, Sparkles, Store, Workflow } from '@lucide/vue'

const pageRoot = ref<HTMLElement | null>(null)
let destroyMotion: (() => void) | undefined

const capabilities = [
  { icon: Store, title: 'Loja virtual', text: 'Uma vitrine própria, responsiva e preparada para apresentar sua marca com clareza em qualquer tela.', tag: 'Sua marca na frente' },
  { icon: Boxes, title: 'Catálogo e estoque', text: 'Produtos, categorias, variações e disponibilidade organizados para a venda não parar no operacional.', tag: 'Tudo no lugar' },
  { icon: ShoppingBag, title: 'Pedidos e pagamentos', text: 'Acompanhe o pedido da entrada à conclusão e mantenha cada etapa acessível para quem cuida da operação.', tag: 'Da venda ao pós-venda' },
  { icon: CircleUserRound, title: 'Clientes', text: 'Histórico e contexto comercial próximos da rotina para atender melhor e construir relacionamento.', tag: 'Proximidade com contexto' },
  { icon: MessageCircle, title: 'WhatsApp e automações', text: 'Conecte conversas, eventos de pedidos e jornadas automáticas sem separar atendimento e venda.', tag: 'Conversa que continua' },
]

const workflow = [
  { icon: ShoppingBag, label: 'A venda entra', text: 'O pedido chega com os dados necessários para a operação começar.' },
  { icon: PackageCheck, label: 'A rotina responde', text: 'Pagamento, estoque e status avançam em uma sequência organizada.' },
  { icon: MessageCircle, label: 'O cliente acompanha', text: 'A comunicação mantém cada pessoa informada ao longo da jornada.' },
  { icon: BarChart3, label: 'Você decide melhor', text: 'A operação reunida cria contexto para o próximo movimento.' },
]

useSeoMeta({
  title: 'Plataforma Elínea — Loja, pedidos e operação em um só lugar',
  description: 'Conheça a plataforma Elínea para criar sua loja virtual e centralizar catálogo, pedidos, clientes, pagamentos e WhatsApp.',
  ogTitle: 'Plataforma Elínea',
  ogDescription: 'Sua operação digital conectada do catálogo ao relacionamento com o cliente.',
})

onMounted(async () => {
  const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
  gsap.registerPlugin(ScrollTrigger)
  if (!pageRoot.value) return
  const mm = gsap.matchMedia()
  const context = gsap.context(() => {
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('[data-header]', { y: -20, opacity: 0, duration: .6 })
        .from('.platform-hero__eyebrow, .platform-hero__title span, .platform-hero__copy, .platform-hero__actions', { y: 28, opacity: 0, duration: .65, stagger: .08 }, '-=.2')
        .from('.platform-console', { y: 36, opacity: 0, scale: .975, duration: .85 }, '-=.75')

      gsap.utils.toArray<HTMLElement>('[data-platform-reveal]').forEach((block) => {
        gsap.from(block.children, { y: 30, opacity: 0, duration: .7, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: block, start: 'top 82%', once: true } })
      })
      gsap.from('.platform-workflow__line', { scaleX: 0, transformOrigin: 'left center', ease: 'none', scrollTrigger: { trigger: '.platform-workflow__track', start: 'top 78%', end: 'bottom 62%', scrub: .7 } })
      gsap.from('.platform-workflow__step', { y: 24, opacity: 0, stagger: .14, duration: .55, scrollTrigger: { trigger: '.platform-workflow__track', start: 'top 74%', once: true } })
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
          .fromTo(capabilitiesIntro.children, { y: 16, opacity: 0 }, { y: 0, opacity: 1, stagger: .035, ease: 'none' }, 0)
          .fromTo(firstCapability.children, { y: 32, opacity: 0 }, { y: 0, opacity: 1, stagger: .035, ease: 'none' }, 0)
      }
      gsap.to('.platform-console__float--orders', { y: -9, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      gsap.to('.platform-console__float--stock', { y: 8, duration: 3.8, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    })

  }, pageRoot.value)
  destroyMotion = () => { mm.revert(); context.revert() }
})

onBeforeUnmount(() => destroyMotion?.())
</script>

<template>
  <div ref="pageRoot" class="page-shell platform-page">
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <SiteHeader />

    <main id="conteudo">
      <section class="platform-hero">
        <div class="site-container platform-hero__layout">
          <div class="platform-hero__content">
            <p class="platform-hero__eyebrow"><span></span>Uma base para toda a sua operação</p>
            <h1 class="platform-hero__title"><span>Venda com</span><span>simplicidade.</span><span>Cresça com estrutura.</span></h1>
            <p class="platform-hero__copy">Crie sua loja, organize produtos, acompanhe pedidos e mantenha clientes e conversas no mesmo ecossistema.</p>
            <div class="platform-hero__actions">
              <MarketingButton variant="primary" href="/precos#planos">Criar minha loja<template #icon><ArrowRight :size="17" /></template></MarketingButton>
              <MarketingTextButton tone="light" href="#recursos">Conhecer os recursos</MarketingTextButton>
            </div>
          </div>

          <div class="platform-console" aria-label="Representação da operação centralizada na Elínea">
            <div class="platform-console__top"><span></span><span></span><span></span><small>Operação Elínea</small><i>Online</i></div>
            <div class="platform-console__body">
              <div class="platform-console__summary">
                <small>Visão da operação</small><strong>Tudo em movimento.</strong>
                <div><span><i></i> Loja ativa</span><span><i></i> Estoque sincronizado</span></div>
              </div>
              <div class="platform-console__orders">
                <header><span>Pedidos recentes</span><small>Agora</small></header>
                <div><b>#1482</b><span>Pagamento aprovado</span><em>Pix</em></div>
                <div><b>#1481</b><span>Separação iniciada</span><em>Pedido</em></div>
                <div><b>#1480</b><span>Cliente notificado</span><em>WhatsApp</em></div>
              </div>
              <div class="platform-console__chart"><small>Ritmo de vendas</small><div><i v-for="height in [32, 49, 42, 65, 55, 78, 70, 92]" :key="height" :style="{ height: `${height}%` }"></i></div></div>
            </div>
            <div class="platform-console__float platform-console__float--orders"><ShoppingBag :size="18" /><span><small>Novo pedido</small><strong>Recebido</strong></span></div>
            <div class="platform-console__float platform-console__float--stock"><Boxes :size="18" /><span><small>Catálogo</small><strong>Atualizado</strong></span></div>
          </div>
        </div>
        <div class="site-container platform-hero__rail" aria-label="Áreas da plataforma"><span>Loja virtual</span><span>Catálogo</span><span>Pedidos</span><span>Clientes</span><span>WhatsApp</span></div>
      </section>

      <section class="chapter platform-storefront">
        <div class="site-container platform-storefront__layout">
          <div class="platform-section-copy" data-platform-reveal>
            <p class="site-label">Uma presença digital que parece sua</p>
            <h2 class="site-title">Sua marca<br>na frente.<br><span>A estrutura<br>por trás.</span></h2>
            <p class="site-copy">A experiência de compra permanece simples para o cliente enquanto catálogo, estoque e pedidos trabalham juntos nos bastidores.</p>
            <MarketingTextButton class="chapter-text-cta" href="/precos#planos">Criar minha loja</MarketingTextButton>
          </div>
          <div class="storefront-scene" aria-label="Representação de uma loja virtual responsiva">
            <div class="storefront-window">
              <header><strong>SUA MARCA</strong><nav><span>Novidades</span><span>Produtos</span><span>Contato</span></nav><ShoppingBag :size="18" /></header>
              <div class="storefront-window__hero"><span>Nova coleção</span><strong>Feita para<br>o seu momento.</strong><i></i></div>
              <div class="storefront-products"><article v-for="tone in ['green', 'sand', 'ink']" :key="tone"><i :class="`is-${tone}`"></i><small>Produto selecionado</small><b>Pronto para vender</b></article></div>
            </div>
            <div class="storefront-phone"><span></span><div><i></i><strong>SUA MARCA</strong><small>Compre de onde estiver.</small></div></div>
            <p>Uma experiência consistente<br>em cada tela.</p>
          </div>
        </div>
      </section>

      <section class="chapter platform-workflow">
        <div class="site-container">
          <div class="platform-workflow__heading" data-platform-reveal>
            <div><p class="site-label">A operação continua depois do clique</p><h2 class="site-title">Um pedido entra.<br>O restante se organiza.</h2></div>
            <p class="site-copy">Cada etapa compartilha contexto com a próxima. Menos retrabalho para você, mais clareza para quem compra.</p>
          </div>
          <div class="platform-workflow__track">
            <span class="platform-workflow__line"></span>
            <article v-for="(item, index) in workflow" :key="item.label" class="platform-workflow__step">
              <span><component :is="item.icon" :size="22" aria-hidden="true" /></span><small>0{{ index + 1 }}</small><h3>{{ item.label }}</h3><p>{{ item.text }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="recursos" class="chapter platform-capabilities">
        <div class="site-container platform-capabilities__layout">
          <div class="platform-capabilities__intro">
            <p class="site-label">Recursos que formam uma operação</p>
            <h2 class="site-title">Uma plataforma.<br>Muitos movimentos.</h2>
            <p class="site-copy">Comece com o que o seu negócio precisa agora e mantenha uma base preparada para o próximo passo.</p>
          </div>
          <div class="platform-capabilities__list">
            <article v-for="(item, index) in capabilities" :key="item.title" class="platform-capabilities__card">
              <div><span><component :is="item.icon" :size="23" aria-hidden="true" /></span><small>0{{ index + 1 }}</small></div>
              <p>{{ item.tag }}</p><h3>{{ item.title }}</h3><strong>{{ item.text }}</strong>
            </article>
          </div>
        </div>
      </section>

      <section class="chapter platform-scale">
        <div class="site-container platform-scale__layout">
          <div class="platform-scale__image"><img :src="merchantUrl" alt="Comerciante acompanhando sua operação digital em um tablet" loading="lazy" width="1672" height="941"><span><Sparkles :size="18" /> Estrutura que acompanha o negócio</span></div>
          <div class="platform-section-copy" data-platform-reveal>
            <p class="site-label">Evolução sem recomeçar</p>
            <h2 class="site-title">Comece simples.<br>Evolua com<br>continuidade.</h2>
            <p class="site-copy">Da primeira organização do catálogo a uma operação com loja, pagamentos, automações e atendimento, a Elínea cresce junto com a sua rotina.</p>
            <ul><li><Check :size="17" /> Planos para diferentes momentos</li><li><Check :size="17" /> Processos conectados</li><li><Check :size="17" /> Suporte próximo</li></ul>
            <MarketingTextButton class="chapter-text-cta" href="/precos#planos">Conhecer os planos</MarketingTextButton>
          </div>
        </div>
      </section>

      <IntegrationsSection />

      <section class="chapter platform-start">
        <div class="site-container">
          <div class="platform-start__heading" data-platform-reveal><p class="site-label">Da ideia à operação</p><h2 class="site-title">Coloque seu negócio<br>em movimento.</h2></div>
          <div class="platform-start__steps">
            <article><span>01</span><PanelsTopLeft :size="25" /><h3>Escolha seu caminho</h3><p>Encontre o plano que acompanha o momento atual do negócio.</p></article>
            <article><span>02</span><Workflow :size="25" /><h3>Organize a estrutura</h3><p>Configure catálogo, identidade e os fluxos necessários para começar.</p></article>
            <article><span>03</span><Sparkles :size="25" /><h3>Venda e evolua</h3><p>Coloque a operação no ar e amplie os recursos quando fizer sentido.</p></article>
          </div>
        </div>
      </section>

      <section class="chapter final-cta platform-final">
        <div class="site-container final-cta__inner" data-platform-reveal>
          <p class="site-label">Sua próxima estrutura começa aqui</p><h2 class="site-title">Uma plataforma.<br>Seu negócio<br>em movimento.</h2>
          <p>Venda com uma base organizada hoje e continue evoluindo amanhã.</p>
          <div><MarketingButton variant="primary" href="/precos#planos">Criar minha loja<template #icon><ArrowRight :size="18" /></template></MarketingButton><a href="mailto:contato@elinea.com.br">Falar com especialista</a></div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.platform-page { overflow: visible; }
.platform-hero { position: relative; min-height: 100svh; overflow: hidden; padding: 8.5rem 0 2rem; background: radial-gradient(circle at 76% 42%, rgba(7,148,94,.18), transparent 27%), #071310; color: white; }
.platform-hero::before { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px); background-size: 72px 72px; mask-image: linear-gradient(to bottom, black, transparent 88%); content: ''; }
.platform-hero__layout { position: relative; display: grid; min-height: calc(100svh - 13rem); grid-template-columns: .88fr 1.12fr; gap: clamp(3rem, 7vw, 7rem); align-items: center; }
.platform-hero__content { position: relative; z-index: 2; }
.platform-hero__eyebrow { display: inline-flex; align-items: center; gap: .65rem; color: rgba(255,255,255,.66); font-size: .8rem; font-weight: 700; }.platform-hero__eyebrow span { width: 7px; height: 7px; border-radius: 50%; background: var(--green-bright); box-shadow: 0 0 16px rgba(92,221,164,.55); }
.platform-hero__title { margin-top: 1.75rem; color: white; font-size: clamp(3.8rem, 6.4vw, 7rem); font-weight: 600; line-height: .93; letter-spacing: -.068em; }.platform-hero__title span { display: block; }
.platform-hero__copy { max-width: 38rem; margin-top: 1.75rem; color: rgba(255,255,255,.64); font-size: clamp(1rem, 1.18vw, 1.18rem); line-height: 1.7; }
.platform-hero__actions { display: flex; margin-top: 2.2rem; flex-wrap: wrap; align-items: center; gap: 1.5rem; }
.platform-hero__rail { position: relative; display: flex; padding-top: 1.4rem; justify-content: space-between; border-top: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.4); font-size: .68rem; font-weight: 700; }
.platform-console { position: relative; min-height: 610px; border: 1px solid rgba(255,255,255,.1); border-radius: 24px; background: #f5f8f6; color: var(--ink); box-shadow: 0 55px 100px -45px rgba(0,0,0,.75); transform: perspective(1200px) rotateY(-3deg); }
.platform-console__top { display: flex; height: 58px; padding: 0 1.25rem; align-items: center; gap: .45rem; border-bottom: 1px solid var(--line); }.platform-console__top > span { width: 7px; height: 7px; border-radius: 50%; background: #c9d2ce; }.platform-console__top small { margin-left: .5rem; color: var(--muted); font-weight: 700; }.platform-console__top i { margin-left: auto; color: var(--green); font-size: .65rem; font-style: normal; font-weight: 800; }
.platform-console__body { display: grid; height: calc(100% - 58px); padding: clamp(1.25rem, 3vw, 2.4rem); grid-template-columns: 1fr .8fr; grid-template-rows: auto 1fr; gap: 1rem; }
.platform-console__summary { padding: clamp(1.4rem, 2.5vw, 2.2rem); grid-column: 1 / -1; border-radius: 18px; background: var(--ink); color: white; }.platform-console__summary > small { color: rgba(255,255,255,.45); }.platform-console__summary > strong { display: block; margin-top: .5rem; font-family: var(--font-display); font-size: clamp(1.6rem, 3vw, 2.6rem); letter-spacing: -.05em; }.platform-console__summary > div { display: flex; margin-top: 1.6rem; gap: 1rem; flex-wrap: wrap; }.platform-console__summary span { display: inline-flex; align-items: center; gap: .45rem; color: rgba(255,255,255,.65); font-size: .7rem; }.platform-console__summary i { width: 7px; height: 7px; border-radius: 50%; background: var(--green-bright); }
.platform-console__orders, .platform-console__chart { padding: 1.15rem; border: 1px solid var(--line); border-radius: 16px; background: white; }.platform-console__orders header { display: flex; justify-content: space-between; font-size: .7rem; }.platform-console__orders header small { color: var(--muted); }.platform-console__orders > div { display: grid; padding: .85rem 0; grid-template-columns: .55fr 1.3fr .6fr; gap: .5rem; border-bottom: 1px solid var(--line); font-size: .62rem; }.platform-console__orders > div:last-child { border-bottom: 0; }.platform-console__orders span { color: var(--muted); }.platform-console__orders em { color: var(--green); font-style: normal; text-align: right; }
.platform-console__chart { display: flex; flex-direction: column; }.platform-console__chart > small { color: var(--muted); font-size: .7rem; }.platform-console__chart > div { display: flex; min-height: 160px; margin-top: auto; align-items: end; gap: .35rem; }.platform-console__chart i { width: 100%; border-radius: 5px 5px 2px 2px; background: #bde8d2; }.platform-console__chart i:nth-child(n+6) { background: var(--green); }
.platform-console__float { position: absolute; z-index: 3; display: flex; min-width: 150px; padding: .8rem .9rem; align-items: center; gap: .65rem; border: 1px solid rgba(255,255,255,.8); border-radius: 13px; background: rgba(255,255,255,.96); box-shadow: var(--shadow); }.platform-console__float svg { color: var(--green); }.platform-console__float span { display: grid; }.platform-console__float small { color: var(--muted); font-size: .58rem; }.platform-console__float strong { font-size: .72rem; }.platform-console__float--orders { top: 17%; right: -7%; }.platform-console__float--stock { bottom: 12%; left: -8%; }
.platform-storefront { background: var(--paper); }.platform-storefront__layout, .platform-scale__layout { display: grid; grid-template-columns: .72fr 1.28fr; gap: clamp(3rem, 7vw, 8rem); align-items: center; }.platform-section-copy { max-width: 650px; }.platform-section-copy .site-title span { color: #65736e; font-weight: 450; }
.storefront-scene { position: relative; min-height: 690px; }.storefront-window { position: absolute; inset: 3% 5% 7% 0; overflow: hidden; border: 1px solid var(--line); border-radius: 22px; background: white; box-shadow: 0 45px 90px -55px rgba(0,0,0,.5); }.storefront-window header { display: flex; height: 66px; padding: 0 1.5rem; align-items: center; border-bottom: 1px solid var(--line); }.storefront-window header strong { font-family: var(--font-display); font-size: .8rem; }.storefront-window nav { display: flex; margin-left: auto; align-items: center; gap: 1.4rem; color: var(--muted); font-size: .62rem; }.storefront-window header svg { margin-left: 1.4rem; }
.storefront-window__hero { position: relative; min-height: 300px; padding: 3rem; overflow: hidden; background: #dceee5; }.storefront-window__hero span { color: var(--green); font-size: .7rem; font-weight: 800; }.storefront-window__hero strong { position: relative; z-index: 2; display: block; margin-top: .8rem; font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3.8rem); line-height: .97; letter-spacing: -.06em; }.storefront-window__hero i { position: absolute; right: 7%; bottom: -34%; width: 45%; aspect-ratio: 1; border: 45px solid rgba(7,148,94,.2); border-radius: 50%; }
.storefront-products { display: grid; padding: 1.25rem; grid-template-columns: repeat(3, 1fr); gap: .8rem; }.storefront-products article { display: grid; gap: .35rem; }.storefront-products article > i { height: 115px; border-radius: 12px; background: #dbece4; }.storefront-products article > i.is-sand { background: #e8e2d7; }.storefront-products article > i.is-ink { background: #1b2b27; }.storefront-products small { color: var(--muted); font-size: .52rem; }.storefront-products b { font-size: .65rem; }
.storefront-phone { position: absolute; right: 0; bottom: 0; width: 30%; min-width: 180px; padding: .6rem; border: 6px solid var(--ink); border-radius: 28px; background: white; box-shadow: 0 30px 70px -35px #000; }.storefront-phone > span { display: block; width: 30%; height: 4px; margin: 0 auto .5rem; border-radius: 10px; background: var(--ink); }.storefront-phone > div { display: grid; min-height: 250px; padding: 1rem; place-content: end start; border-radius: 18px; background: #dceee5; }.storefront-phone i { display: block; width: 70px; height: 70px; margin-bottom: 2rem; border: 16px solid rgba(7,148,94,.22); border-radius: 50%; }.storefront-phone strong { font-size: .72rem; }.storefront-phone small { margin-top: .4rem; color: var(--muted); font-size: .55rem; }.storefront-scene > p { position: absolute; top: 1%; right: 0; color: #819089; font-family: var(--font-display); font-size: 1rem; font-style: italic; transform: rotate(4deg); }
.platform-workflow { background: var(--ink); color: white; }.platform-workflow__heading { display: grid; grid-template-columns: 1.2fr .6fr; gap: 4rem; align-items: end; }.platform-workflow .site-title { color: white; }.platform-workflow .site-copy { color: rgba(255,255,255,.55); }.platform-workflow__track { position: relative; display: grid; margin-top: clamp(4rem, 8vw, 7rem); grid-template-columns: repeat(4, 1fr); gap: 1.25rem; }.platform-workflow__line { position: absolute; top: 30px; right: 8%; left: 8%; height: 1px; background: linear-gradient(90deg, var(--green), var(--green-bright)); }.platform-workflow__step { position: relative; z-index: 2; padding-right: 1rem; }.platform-workflow__step > span { display: grid; width: 60px; height: 60px; place-items: center; border: 1px solid rgba(92,221,164,.25); border-radius: 50%; background: var(--ink); color: var(--green-bright); }.platform-workflow__step > small { display: block; margin-top: 2rem; color: var(--green-bright); font-size: .65rem; font-weight: 800; }.platform-workflow__step h3 { margin-top: .65rem; color: white; font-size: 1.15rem; }.platform-workflow__step p { margin-top: .8rem; color: rgba(255,255,255,.52); font-size: .82rem; line-height: 1.65; }
.platform-capabilities { overflow: visible; align-items: flex-start; background: #f3f7f4; }
.platform-capabilities__layout { display: grid; grid-template-columns: .75fr 1.25fr; gap: clamp(4rem, 8vw, 9rem); }
.platform-capabilities__intro { position: sticky; top: calc(var(--section-space) + clamp(2.5rem, 5svh, 3.5rem)); align-self: start; }
.platform-capabilities__list { position: relative; padding-bottom: clamp(4rem, 10vh, 8rem); }
.platform-capabilities__card { position: sticky; top: calc(50svh - 155px); z-index: 1; display: grid; min-height: 310px; padding: clamp(2rem, 4vw, 3.5rem) 0; align-content: center; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); background: #f3f7f4; }
.platform-capabilities__card + .platform-capabilities__card { margin-top: -1px; }
.platform-capabilities__card:nth-child(2) { z-index: 2; }
.platform-capabilities__card:nth-child(3) { z-index: 3; }
.platform-capabilities__card:nth-child(4) { z-index: 4; }
.platform-capabilities__card:nth-child(5) { z-index: 5; }
.platform-capabilities__list article > div { display: flex; align-items: center; justify-content: space-between; }
.platform-capabilities__list article > div > span { display: grid; width: 48px; height: 48px; place-items: center; border-radius: 14px; background: var(--green-light); color: var(--green); }
.platform-capabilities__list article > div > small { color: #9aa7a2; font-size: .65rem; font-weight: 800; }
.platform-capabilities__list article > p { margin-top: 2rem; color: var(--green); font-size: .7rem; font-weight: 800; }
.platform-capabilities__list h3 { margin-top: .5rem; font-size: clamp(2rem, 4vw, 4.5rem); letter-spacing: -.055em; }
.platform-capabilities__list article > strong { max-width: 42rem; margin-top: 1.1rem; color: var(--muted); font-size: .95rem; font-weight: 500; line-height: 1.7; }
.platform-scale { background: white; }.platform-scale__layout { grid-template-columns: 1.18fr .82fr; }.platform-scale__image { position: relative; min-height: 680px; }.platform-scale__image img { width: 100%; height: 680px; border-radius: 30px; object-fit: cover; object-position: 60% center; }.platform-scale__image > span { position: absolute; right: 1.5rem; bottom: 1.5rem; display: inline-flex; padding: .8rem 1rem; align-items: center; gap: .5rem; border-radius: 12px; background: white; color: var(--green); font-size: .7rem; font-weight: 800; box-shadow: var(--shadow); }.platform-section-copy ul { display: grid; gap: .7rem; margin: 1.6rem 0 0; padding: 0; list-style: none; color: var(--muted); font-size: .88rem; font-weight: 650; }.platform-section-copy li { display: flex; align-items: center; gap: .6rem; }.platform-section-copy li svg { color: var(--green); }
.platform-start { background: #edf4f0; }.platform-start__heading { max-width: 900px; }.platform-start__steps { display: grid; margin-top: clamp(3.5rem, 7vw, 6rem); grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--line); }.platform-start__steps article { min-height: 330px; padding: 2rem clamp(1.25rem, 3vw, 3rem); border-right: 1px solid var(--line); }.platform-start__steps article:last-child { border-right: 0; }.platform-start__steps span { color: #97a49f; font-size: .65rem; font-weight: 800; }.platform-start__steps svg { display: block; margin-top: 4rem; color: var(--green); }.platform-start__steps h3 { margin-top: 1.5rem; font-size: 1.25rem; }.platform-start__steps p { margin-top: .8rem; color: var(--muted); font-size: .85rem; line-height: 1.65; }.platform-final { min-height: 100svh; }
@media (max-width: 1080px) { .platform-hero__layout { grid-template-columns: 1fr; padding-block: 3rem; }.platform-hero__content { max-width: 800px; }.platform-console { width: min(100%, 820px); margin-inline: auto; transform: none; }.platform-storefront__layout, .platform-scale__layout { grid-template-columns: 1fr; }.platform-section-copy { max-width: 780px; }.storefront-scene { width: min(100%, 820px); margin-inline: auto; }.platform-capabilities__layout { grid-template-columns: 1fr; }.platform-capabilities__intro { position: static; max-width: 800px; transform: none; }.platform-capabilities__list { display: grid; padding-bottom: 0; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--line); }.platform-capabilities__list .platform-capabilities__card { position: static; top: auto; z-index: auto; min-height: 310px; margin-top: 0; padding: 2rem; border: 0; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); border-radius: 0; background: transparent; box-shadow: none; }.platform-scale__image { order: 2; } }
@media (max-width: 767px) { .platform-hero { min-height: auto; padding-top: 8rem; }.platform-hero__layout { min-height: 0; gap: 4rem; }.platform-hero__title { font-size: clamp(3.1rem, 14vw, 4.7rem); }.platform-hero__actions { align-items: flex-start; flex-direction: column; }.platform-hero__rail { gap: 1rem; overflow: hidden; }.platform-hero__rail span:nth-child(even) { display: none; }.platform-console { min-height: 520px; border-radius: 18px; }.platform-console__body { padding: .8rem; grid-template-columns: 1fr; }.platform-console__orders { min-height: 220px; }.platform-console__chart { display: none; }.platform-console__float { display: none; }.platform-storefront__layout { gap: 3rem; }.storefront-scene { min-height: 520px; }.storefront-window { inset: 0 0 5% 0; }.storefront-window nav { display: none; }.storefront-window__hero { min-height: 230px; padding: 2rem 1.25rem; }.storefront-products { padding: .8rem; }.storefront-products article > i { height: 80px; }.storefront-products article:nth-child(3) { display: none; }.storefront-products { grid-template-columns: repeat(2, 1fr); }.storefront-phone { min-width: 135px; width: 38%; }.storefront-phone > div { min-height: 190px; }.storefront-scene > p { display: none; }.platform-workflow__heading { grid-template-columns: 1fr; gap: .5rem; }.platform-workflow__track { grid-template-columns: 1fr; gap: 2rem; }.platform-workflow__line { top: 5%; bottom: 5%; left: 30px; width: 1px; height: auto; transform: none !important; }.platform-workflow__step { min-height: 150px; padding-left: 85px; }.platform-workflow__step > span { position: absolute; left: 0; }.platform-workflow__step > small { margin-top: 0; }.platform-capabilities__list { grid-template-columns: 1fr; }.platform-capabilities__list article { min-height: 280px; padding: 2rem 0; border-right: 0; }.platform-scale__image, .platform-scale__image img { min-height: 480px; height: 480px; }.platform-start__steps { grid-template-columns: 1fr; }.platform-start__steps article { min-height: 250px; padding-inline: 0; border-right: 0; border-bottom: 1px solid var(--line); }.platform-start__steps svg { margin-top: 2.5rem; } }
@media (prefers-reduced-motion: reduce) { .platform-console { transform: none; } }
</style>
