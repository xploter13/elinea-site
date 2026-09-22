<script setup lang="ts">
import resourcesHeroUrl from '~/assets/images/elinea-resources-hero.webp'
import paymentSceneUrl from '~/assets/images/elinea-payment-scene.jpg'
import { MarketingButton } from '@elinea/ui/marketing'
import {
  ArrowRight,
  BarChart3,
  Bot,
  Boxes,
  Check,
  CreditCard,
  FileText,
  MessageCircle,
  PackageCheck,
  Search,
  ShieldCheck,
  Store,
  Truck,
  Workflow,
} from '@lucide/vue'

const pageRoot = ref<HTMLElement | null>(null)
let destroyMotion: (() => void) | undefined

const resourceCards = [
  {
    id: 'pagamentos',
    icon: CreditCard,
    eyebrow: 'Checkout e pagamentos',
    title: 'Venda com os meios que fazem sentido para o cliente.',
    description: 'Pix, cartão e gateways entram no mesmo fluxo de pedidos. A configuração varia conforme o plano, o provedor escolhido e o escopo da implantação.',
    status: 'Conforme plano',
  },
  {
    id: 'logistica',
    icon: Truck,
    eyebrow: 'Frete e logística',
    title: 'Do cálculo do frete ao acompanhamento da entrega.',
    description: 'Estruture regras de envio e conecte a operação a soluções como Melhor Envio e Correios conforme a necessidade e a validação técnica do projeto.',
    status: 'Sob configuração',
  },
  {
    id: 'gestao',
    icon: Boxes,
    eyebrow: 'ERP e documentos fiscais',
    title: 'Pedido, estoque e faturamento falando a mesma língua.',
    description: 'Projetos personalizados podem conectar ERPs, como o Bling, e fluxos de emissão fiscal para reduzir digitação repetida e manter os dados consistentes.',
    status: 'Projeto personalizado',
  },
  {
    id: 'whatsapp',
    icon: MessageCircle,
    eyebrow: 'Venda pelo WhatsApp',
    title: 'A conversa continua conectada à operação.',
    description: 'Centralize contatos, histórico, pedidos, campanhas e automações para transformar atendimento em uma rotina comercial organizada e mensurável.',
    status: 'Disponível',
  },
]

const insightCards = [
  {
    icon: BarChart3,
    title: 'Medição e campanhas',
    text: 'Prepare eventos e conversões para ferramentas como Google Analytics e Meta Pixel, com implementação validada para cada operação.',
    tags: ['Google Analytics', 'Meta Pixel'],
    status: 'Em evolução',
  },
  {
    icon: Search,
    title: 'Base técnica para SEO',
    text: 'Organize títulos, descrições, URLs e conteúdo com uma estrutura rastreável, responsiva e pronta para evoluir com o catálogo.',
    tags: ['Metadados', 'URLs', 'Performance'],
    status: 'Estrutura da loja',
  },
  {
    icon: FileText,
    title: 'Relatórios para agir',
    text: 'Acompanhe vendas, pedidos e operação com relatórios compatíveis com o plano e amplie a leitura em projetos personalizados.',
    tags: ['Vendas', 'Pedidos', 'Operação'],
    status: 'Conforme plano',
  },
]

const migrationSteps = [
  { icon: Search, title: 'Diagnóstico', text: 'Mapeamos catálogo, dados, integrações e regras que não podem se perder no caminho.' },
  { icon: Boxes, title: 'Preparação', text: 'Organizamos produtos, clientes e pedidos para a estrutura de destino.' },
  { icon: Workflow, title: 'Conexões', text: 'Configuramos os serviços definidos no escopo e validamos os fluxos críticos.' },
  { icon: Store, title: 'Entrada no ar', text: 'Revisamos domínio, redirecionamentos e jornada de compra antes da publicação.' },
]

const integrationCards = [
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    description: 'Atendimento, histórico, campanhas e automações conectados à rotina comercial.',
    status: 'Disponível',
    state: 'live',
  },
  {
    icon: CreditCard,
    title: 'Gateways de pagamento',
    description: 'Meios de pagamento ativados de acordo com o plano, o provedor e a configuração escolhida.',
    status: 'Conforme plano',
    state: 'plan',
  },
  {
    icon: Truck,
    title: 'Frete e logística',
    description: 'Serviços de envio conectados conforme a necessidade e a validação técnica da operação.',
    status: 'Sob configuração',
    state: 'setup',
  },
  {
    icon: Boxes,
    title: 'ERP e fiscal',
    description: 'Conexões avaliadas de acordo com os sistemas e os fluxos específicos de cada negócio.',
    status: 'Projeto personalizado',
    state: 'custom',
  },
  {
    icon: BarChart3,
    title: 'Analytics e Meta',
    description: 'Uma camada de medição planejada para acompanhar campanhas, eventos e conversões.',
    status: 'Em evolução',
    state: 'future',
  },
]

useSeoMeta({
  title: 'Recursos Elínea — Pagamentos, logística, WhatsApp e integrações',
  description: 'Conheça os recursos da Elínea para pagamentos, frete, ERP, emissão fiscal, WhatsApp, automações, dados, SEO e migração de loja virtual.',
  ogTitle: 'Recursos da plataforma Elínea',
  ogDescription: 'Uma operação de ecommerce conectada do checkout ao relacionamento com o cliente.',
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
        .from('.resources-hero__eyebrow, .resources-hero__title span, .resources-hero__copy', { y: 26, opacity: 0, duration: .65, stagger: .07 }, '-=.2')
        .from('.resources-hero__photo', { opacity: 0, scale: 1.035, duration: 1.2 }, '-=1.1')

      gsap.to('.resources-hero__photo', {
        yPercent: 4,
        scale: 1.04,
        ease: 'none',
        scrollTrigger: { trigger: '.resources-hero', start: 'top top', end: 'bottom top', scrub: true },
      })

      gsap.utils.toArray<HTMLElement>('[data-resource-reveal]').forEach((block) => {
        gsap.from(block.children, {
          y: 24,
          opacity: 0,
          duration: .65,
          stagger: .07,
          ease: 'power3.out',
          scrollTrigger: { trigger: block, start: 'top 84%', once: true },
        })
      })

      gsap.from('.resource-card', {
        y: 32,
        opacity: 0,
        duration: .7,
        stagger: .1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.resources-grid', start: 'top 78%', once: true },
      })

      gsap.from('.migration-track__line', {
        scaleX: 0,
        transformOrigin: 'left center',
        ease: 'none',
        scrollTrigger: { trigger: '.migration-track', start: 'top 78%', end: 'bottom 62%', scrub: .7 },
      })

      gsap.from('.migration-step', {
        y: 24,
        opacity: 0,
        stagger: .14,
        duration: .55,
        scrollTrigger: { trigger: '.migration-track', start: 'top 74%', once: true },
      })
    })
  }, pageRoot.value)

  destroyMotion = () => {
    mm.revert()
    context.revert()
  }
})

onBeforeUnmount(() => destroyMotion?.())
</script>

<template>
  <div ref="pageRoot" class="page-shell resources-page">
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <SiteHeader />

    <main id="conteudo">
      <section class="resources-hero">
        <img class="resources-hero__photo" :src="resourcesHeroUrl" alt="Comerciante preparando pedidos de uma loja virtual" fetchpriority="high">
        <div class="resources-hero__overlay"></div>
        <div class="site-container resources-hero__layout">
          <div class="resources-hero__content">
            <p class="resources-hero__eyebrow"><span></span>Recursos para uma operação conectada</p>
            <h1 class="resources-hero__title"><span>Venda.</span><span>Organize.</span><span>Evolua.</span></h1>
            <p class="resources-hero__copy">Da primeira visita ao pós-venda, a Elínea reúne recursos para sua loja trabalhar com menos fragmentação e mais contexto.</p>
          </div>
        </div>
      </section>

      <section id="operacao" class="chapter resources-core">
        <div class="site-container">
          <div class="resources-heading" data-resource-reveal>
            <div><p class="site-label">A operação por inteiro</p><h2 class="site-title">Recursos que trabalham<br>depois do clique.</h2></div>
            <p class="site-copy">Cada bloco representa uma parte real da rotina. O que entra em cada projeto depende do plano, dos provedores e das necessidades da operação.</p>
          </div>

          <div class="resources-grid">
            <article v-for="card in resourceCards" :id="card.id" :key="card.id" class="resource-card" :class="`resource-card--${card.id}`">
              <div class="resource-card__visual" aria-hidden="true">
                <img v-if="card.id === 'pagamentos'" class="payment-scene" :src="paymentSceneUrl" alt="" loading="lazy">

                <div v-else-if="card.id === 'logistica'" class="shipping-scene">
                  <div class="shipping-route"><i></i><span class="route-dot route-dot--start"><Store :size="15" /></span><span class="route-dot route-dot--end"><PackageCheck :size="15" /></span></div>
                  <div class="shipping-package"><Boxes :size="30" /><span><small>Pedido pronto</small><strong>Etiqueta e rastreio</strong></span></div>
                  <div class="shipping-providers"><span>Melhor Envio</span><span>Correios</span><small>conforme escopo</small></div>
                </div>

                <div v-else-if="card.id === 'gestao'" class="erp-scene">
                  <div class="erp-order"><small>Pedido #1482</small><strong>Pagamento aprovado</strong><span><i></i> Pronto para sincronizar</span></div>
                  <div class="erp-connector"><i></i><span><ArrowRight :size="17" /></span><i></i></div>
                  <div class="erp-stack"><div><Boxes :size="18" /><span><small>ERP</small><strong>Bling</strong></span></div><div><FileText :size="18" /><span><small>Documento</small><strong>NF-e</strong></span></div><em>Sob configuração</em></div>
                </div>

                <div v-else class="whatsapp-scene">
                  <div class="whatsapp-head"><MessageCircle :size="18" /><span><strong>Atendimento</strong><small>online</small></span><i></i></div>
                  <p>Olá! Meu pedido já foi enviado?</p><p class="is-reply">Sim. Acabamos de atualizar o rastreio para você.</p>
                  <div class="whatsapp-order"><PackageCheck :size="17" /><span><small>Pedido #1482</small><strong>Em transporte</strong></span><Check :size="15" /></div>
                </div>
              </div>

              <div class="resource-card__content">
                <div class="resource-card__meta"><span><component :is="card.icon" :size="19" aria-hidden="true" />{{ card.eyebrow }}</span><small>{{ card.status }}</small></div>
                <h3>{{ card.title }}</h3>
                <p>{{ card.description }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="chapter resources-intelligence">
        <div class="site-container intelligence-layout">
          <div class="intelligence-copy" data-resource-reveal>
            <p class="site-label">Automação que entende o contexto</p>
            <h2 class="site-title">Uma operação que aprende a responder.</h2>
            <p>O Agente de IA está em evolução para apoiar atendimento, consulta de pedidos e tarefas repetitivas usando o contexto real da operação.</p>
            <span class="intelligence-status"><i></i> Recurso em evolução</span>
          </div>

          <div class="agent-console" aria-label="Conceito do Agente de IA da Elínea">
            <header><span><Bot :size="20" />Agente Elínea</span><small>Contexto da operação</small></header>
            <div class="agent-prompt"><small>Cliente</small><p>Quando meu pedido chega?</p></div>
            <div class="agent-thinking"><i></i><i></i><i></i><span>Consultando pedido e rastreio</span></div>
            <div class="agent-answer"><span><Bot :size="17" /></span><p>O pedido #1482 já está em transporte. A previsão atual pode ser enviada junto com o link de acompanhamento.</p></div>
            <div class="agent-context"><span><PackageCheck :size="17" />Pedido localizado</span><span><MessageCircle :size="17" />Resposta preparada</span><span><ShieldCheck :size="17" />Revisão humana</span></div>
          </div>
        </div>
      </section>

      <section id="dados" class="chapter resources-insights">
        <div class="site-container">
          <div class="resources-heading" data-resource-reveal>
            <div><p class="site-label">Dados e crescimento</p><h2 class="site-title">Entenda o que acontece.<br>Melhore o que vem depois.</h2></div>
            <p class="site-copy">Medição, presença orgânica e leitura operacional entram como camadas da mesma estrutura — com disponibilidade definida por plano e implantação.</p>
          </div>

          <div class="insight-grid" data-resource-reveal>
            <article v-for="item in insightCards" :key="item.title" class="insight-card">
              <div class="insight-card__top"><span><component :is="item.icon" :size="22" aria-hidden="true" /></span><small>{{ item.status }}</small></div>
              <h3>{{ item.title }}</h3><p>{{ item.text }}</p>
              <div><span v-for="tag in item.tags" :key="tag">{{ tag }}</span></div>
            </article>
          </div>
        </div>
      </section>

      <section id="integracoes" class="resources-integrations" aria-labelledby="integrations-title">
        <div class="site-container">
          <header class="integrations-heading" data-resource-reveal>
            <div>
              <p class="site-label">Integrações com estado claro</p>
              <h2 id="integrations-title">Conexões diferentes.<br>Uma operação central.</h2>
            </div>
            <p>Veja o que já faz parte da plataforma e o que depende de plano, configuração, projeto ou evolução do produto.</p>
          </header>

          <div class="integrations-board" data-resource-reveal>
            <aside class="integrations-hub" aria-label="Núcleo da operação Elínea">
              <div class="integrations-hub__identity">
                <span><Workflow :size="22" aria-hidden="true" /></span>
                <div><small>Núcleo central</small><strong>Operação Elínea</strong></div>
              </div>

              <div class="integrations-hub__network" aria-hidden="true">
                <span></span><span></span><span></span><span></span><span></span>
                <i><Store :size="30" /></i>
              </div>

              <p>Uma base comum distribui contexto entre venda, atendimento, gestão, entrega e leitura de resultados.</p>
            </aside>

            <div class="integration-cards" aria-label="Disponibilidade das integrações">
              <article v-for="item in integrationCards" :key="item.title" class="integration-card" :class="`integration-card--${item.state}`">
                <span class="integration-card__icon"><component :is="item.icon" :size="22" aria-hidden="true" /></span>
                <div class="integration-card__content"><h3>{{ item.title }}</h3><p>{{ item.description }}</p></div>
                <div class="integration-card__status"><i aria-hidden="true"></i><span>{{ item.status }}</span></div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="migracao" class="chapter resources-migration">
        <div class="site-container">
          <div class="migration-heading" data-resource-reveal>
            <p class="site-label">Migração com método</p>
            <h2 class="site-title">Mudar de plataforma<br>sem improvisar o caminho.</h2>
            <p class="site-copy">Cada migração começa pelo que já existe. O escopo é validado antes da execução para proteger dados, integrações e decisões de SEO.</p>
          </div>
          <div class="migration-track">
            <span class="migration-track__line" aria-hidden="true"></span>
            <article v-for="(step, index) in migrationSteps" :key="step.title" class="migration-step">
              <span>0{{ index + 1 }}</span><component :is="step.icon" :size="23" aria-hidden="true" /><h3>{{ step.title }}</h3><p>{{ step.text }}</p>
            </article>
          </div>
          <div class="migration-note"><ShieldCheck :size="20" /><p><strong>Escopo antes da promessa.</strong> Volumes, formatos de dados, redirecionamentos e serviços externos são analisados antes da definição de prazo e investimento.</p></div>
        </div>
      </section>

      <section class="chapter final-cta resources-final">
        <div class="site-container final-cta__inner" data-resource-reveal>
          <p class="site-label">A estrutura certa para o próximo movimento</p>
          <h2 class="site-title">Sua loja.<br>Sua operação.<br>Mais conectadas.</h2>
          <p>Escolha uma base pronta para vender agora e preparada para incorporar novos recursos conforme o negócio evolui.</p>
          <div><MarketingButton variant="primary" href="/precos#planos">Conhecer os planos<template #icon><ArrowRight :size="18" /></template></MarketingButton><a href="mailto:contato@elinea.com.br">Falar sobre meu projeto</a></div>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

<style scoped>
.resources-page { overflow: hidden; background: var(--paper); }
.resources-hero { position: relative; min-height: 100svh; overflow: hidden; background: #071310; color: white; isolation: isolate; }
.resources-hero__photo { position: absolute; z-index: -2; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; will-change: transform; }
.resources-hero__overlay { position: absolute; z-index: -1; inset: 0; background: linear-gradient(90deg, rgba(4,17,14,.96) 0%, rgba(5,22,17,.87) 35%, rgba(4,17,14,.36) 62%, rgba(3,10,9,.08) 100%); }
.resources-hero__layout { display: flex; min-height: 100svh; align-items: center; padding-top: 5rem; }
.resources-hero__content { position: relative; z-index: 2; width: min(58vw, 810px); }
.resources-hero__eyebrow { display: inline-flex; align-items: center; gap: .65rem; color: rgba(255,255,255,.66); font-size: .8rem; font-weight: 700; }
.resources-hero__eyebrow span { width: 7px; height: 7px; border-radius: 50%; background: var(--green-bright); box-shadow: 0 0 16px rgba(92,221,164,.55); }
.resources-hero__title { margin-top: 1.6rem; color: white; font-size: clamp(4.4rem, 7.4vw, 8rem); font-weight: 600; line-height: .89; letter-spacing: -.04em; }
.resources-hero__title span { display: block; }
.resources-hero__copy { max-width: 39rem; margin-top: 1.7rem; color: rgba(255,255,255,.7); font-size: clamp(1rem, 1.18vw, 1.18rem); line-height: 1.7; }

.resources-core { background: #f6f9f7; }
.resources-heading { display: grid; grid-template-columns: 1.15fr .65fr; gap: clamp(2rem, 6vw, 6rem); align-items: end; }
.resources-heading .site-copy { margin-bottom: .5rem; }
.resources-grid { display: grid; margin-top: clamp(3rem, 6vw, 5.5rem); grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.25rem; }
.resource-card { overflow: hidden; border: 1px solid rgba(13,23,21,.08); border-radius: 22px; background: white; box-shadow: 0 28px 65px -52px rgba(0,0,0,.55); }
.resource-card__visual { position: relative; min-height: 390px; overflow: hidden; background: #eaf2ed; }
.resource-card__content { padding: clamp(1.5rem, 2.6vw, 2.4rem); }
.resource-card__meta { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.resource-card__meta > span { display: flex; align-items: center; gap: .55rem; color: var(--green); font-size: .72rem; font-weight: 800; }
.resource-card__meta > small { padding: .38rem .58rem; border-radius: 999px; background: var(--warm-white); color: var(--muted); font-size: .58rem; font-weight: 800; }
.resource-card h3 { max-width: 32rem; margin-top: 1.3rem; font-size: clamp(1.7rem, 2.5vw, 2.55rem); line-height: 1.03; letter-spacing: -.025em; }
.resource-card__content > p { max-width: 37rem; margin-top: 1rem; color: var(--muted); font-size: .9rem; line-height: 1.7; }

.payment-scene { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; }

.shipping-scene { position: absolute; inset: 0; background: linear-gradient(145deg, #e6f0eb, #f7faf8); }
.shipping-route { position: absolute; inset: 16% 10%; border-radius: 46% 54% 50% 42%; border: 2px dashed rgba(7,148,94,.28); transform: rotate(-8deg); }.shipping-route i { position: absolute; top: 45%; left: 16%; width: 68%; height: 2px; background: var(--green); transform: rotate(14deg); transform-origin: left; }
.route-dot { position: absolute; display: grid; width: 42px; height: 42px; place-items: center; border: 5px solid rgba(223,244,233,.9); border-radius: 50%; background: var(--green); color: white; }.route-dot--start { top: 29%; left: 9%; }.route-dot--end { right: 8%; bottom: 22%; }
.shipping-package { position: absolute; z-index: 2; top: 13%; right: 9%; display: flex; min-width: 205px; padding: 1rem; align-items: center; gap: .8rem; border-radius: 14px; background: white; color: var(--green); box-shadow: 0 22px 50px -35px #000; }.shipping-package span { display: grid; }.shipping-package small { color: var(--muted); font-size: .6rem; }.shipping-package strong { color: var(--ink); font-size: .76rem; }
.shipping-providers { position: absolute; z-index: 2; bottom: 10%; left: 8%; display: flex; padding: .65rem; flex-wrap: wrap; gap: .45rem; border-radius: 12px; background: white; box-shadow: 0 22px 50px -35px #000; }.shipping-providers span { padding: .5rem .65rem; border-radius: 8px; background: var(--warm-white); color: var(--ink); font-size: .63rem; font-weight: 800; }.shipping-providers small { width: 100%; padding-left: .15rem; color: var(--muted); font-size: .53rem; }

.erp-scene { position: absolute; inset: 0; display: grid; padding: 2rem; grid-template-columns: 1fr auto 1fr; align-items: center; background: #12241f; }
.erp-order, .erp-stack { padding: 1.25rem; border: 1px solid rgba(255,255,255,.08); border-radius: 15px; background: #1a3029; color: white; box-shadow: 0 28px 60px -40px #000; }.erp-order { display: grid; gap: .7rem; }.erp-order small { color: rgba(255,255,255,.42); font-size: .62rem; }.erp-order strong { font-size: .86rem; }.erp-order span { color: var(--green-bright); font-size: .62rem; }.erp-order span i { display: inline-block; width: 7px; height: 7px; margin-right: .35rem; border-radius: 50%; background: var(--green-bright); }
.erp-connector { display: flex; min-width: 74px; align-items: center; color: var(--green-bright); }.erp-connector i { height: 1px; flex: 1; background: rgba(92,221,164,.35); }.erp-connector span { display: grid; width: 32px; height: 32px; place-items: center; border: 1px solid rgba(92,221,164,.3); border-radius: 50%; }
.erp-stack { display: grid; gap: .65rem; }.erp-stack > div { display: flex; padding: .75rem; align-items: center; gap: .7rem; border-radius: 10px; background: rgba(255,255,255,.05); }.erp-stack svg { color: var(--green-bright); }.erp-stack span { display: grid; }.erp-stack small { color: rgba(255,255,255,.42); font-size: .55rem; }.erp-stack strong { font-size: .72rem; }.erp-stack em { color: rgba(255,255,255,.45); font-size: .55rem; font-style: normal; }

.whatsapp-scene { position: absolute; inset: 9% 17%; padding: 1.1rem; border-radius: 17px; background: white; box-shadow: 0 28px 65px -45px #000; }
.whatsapp-head { display: flex; padding-bottom: .8rem; align-items: center; gap: .65rem; border-bottom: 1px solid var(--line); color: var(--green); }.whatsapp-head span { display: grid; }.whatsapp-head strong { color: var(--ink); font-size: .72rem; }.whatsapp-head small { color: var(--green); font-size: .55rem; }.whatsapp-head i { width: 7px; height: 7px; margin-left: auto; border-radius: 50%; background: var(--green); }
.whatsapp-scene > p { width: 73%; margin-top: .8rem; padding: .65rem .75rem; border-radius: 10px 10px 10px 2px; background: #f0f3f2; color: #52615c; font-size: .62rem; line-height: 1.45; }.whatsapp-scene > p.is-reply { margin-left: auto; border-radius: 10px 10px 2px 10px; background: var(--green-light); color: #076b47; }
.whatsapp-order { display: flex; margin-top: .9rem; padding: .75rem; align-items: center; gap: .65rem; border: 1px solid rgba(7,148,94,.15); border-radius: 11px; color: var(--green); }.whatsapp-order span { display: grid; }.whatsapp-order small { color: var(--muted); font-size: .55rem; }.whatsapp-order strong { color: var(--ink); font-size: .68rem; }.whatsapp-order > svg:last-child { margin-left: auto; }

.resources-intelligence { color: white; background: linear-gradient(135deg, #034f36 0%, #078759 48%, #29b879 100%); }
.resources-intelligence::before { position: absolute; inset: 0; background: radial-gradient(circle at 75% 35%, rgba(255,255,255,.15), transparent 28%); content: ''; pointer-events: none; }
.intelligence-layout { position: relative; display: grid; grid-template-columns: .8fr 1.2fr; gap: clamp(3rem, 8vw, 8rem); align-items: center; }
.intelligence-copy .site-label, .intelligence-copy .site-title { color: white; }.intelligence-copy .site-title { margin-top: 1.3rem; }.intelligence-copy > p:last-of-type { max-width: 35rem; margin-top: 1.5rem; color: rgba(255,255,255,.72); line-height: 1.7; }
.intelligence-status { display: inline-flex; margin-top: 1.7rem; padding: .55rem .75rem; align-items: center; gap: .5rem; border: 1px solid rgba(255,255,255,.18); border-radius: 999px; color: rgba(255,255,255,.78); font-size: .68rem; font-weight: 750; }.intelligence-status i { width: 7px; height: 7px; border-radius: 50%; background: #c8ffe5; }
.agent-console { position: relative; padding: clamp(1.2rem, 2vw, 2rem); border: 1px solid rgba(255,255,255,.17); border-radius: 24px; background: #f8fbf9; color: var(--ink); box-shadow: 0 45px 100px -55px rgba(2,39,25,.8); }
.agent-console header { display: flex; padding-bottom: 1rem; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); }.agent-console header span { display: flex; align-items: center; gap: .6rem; font-weight: 800; }.agent-console header span svg { color: var(--green); }.agent-console header small { color: var(--muted); font-size: .62rem; }
.agent-prompt { width: 64%; margin: 1.2rem 0 0 auto; padding: .85rem 1rem; border-radius: 13px 13px 3px 13px; background: var(--ink); color: white; }.agent-prompt small { color: rgba(255,255,255,.46); font-size: .55rem; }.agent-prompt p { margin-top: .2rem; font-size: .72rem; }
.agent-thinking { display: flex; margin-top: 1rem; align-items: center; gap: .3rem; color: var(--muted); font-size: .58rem; }.agent-thinking i { width: 5px; height: 5px; border-radius: 50%; background: var(--green); }.agent-thinking span { margin-left: .35rem; }
.agent-answer { display: flex; max-width: 86%; margin-top: .8rem; padding: 1rem; align-items: flex-start; gap: .75rem; border: 1px solid rgba(7,148,94,.14); border-radius: 3px 14px 14px 14px; background: white; }.agent-answer span { display: grid; width: 32px; height: 32px; flex: 0 0 auto; place-items: center; border-radius: 9px; background: var(--green-light); color: var(--green); }.agent-answer p { color: #44554f; font-size: .7rem; line-height: 1.55; }
.agent-context { display: grid; margin-top: 1rem; grid-template-columns: repeat(3, 1fr); gap: .6rem; }.agent-context span { display: flex; min-height: 54px; padding: .65rem; align-items: center; gap: .45rem; border-radius: 9px; background: #edf4f0; color: #52615c; font-size: .57rem; font-weight: 750; }.agent-context svg { color: var(--green); }

.resources-insights { background: white; }
.insight-grid { display: grid; margin-top: clamp(3rem, 5vw, 5rem); grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.insight-card { min-height: 350px; padding: clamp(1.4rem, 2.5vw, 2.2rem); border-top: 1px solid var(--ink); background: #f5f8f6; }
.insight-card__top { display: flex; align-items: center; justify-content: space-between; }.insight-card__top > span { display: grid; width: 48px; height: 48px; place-items: center; border-radius: 12px; background: white; color: var(--green); }.insight-card__top small { color: var(--muted); font-size: .6rem; font-weight: 750; }
.insight-card h3 { margin-top: 3.5rem; font-size: clamp(1.4rem, 2vw, 2rem); letter-spacing: -.02em; }.insight-card > p { margin-top: 1rem; color: var(--muted); font-size: .82rem; line-height: 1.65; }.insight-card > div:last-child { display: flex; margin-top: 1.5rem; flex-wrap: wrap; gap: .45rem; }.insight-card > div:last-child span { padding: .42rem .55rem; border: 1px solid var(--line); border-radius: 999px; background: white; color: #53645e; font-size: .57rem; font-weight: 700; }

.resources-integrations { padding: clamp(5rem, 9vw, 9rem) 0; overflow: hidden; background: #dfe9e4; }
.integrations-heading { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(280px, .55fr); gap: clamp(2rem, 7vw, 7rem); align-items: end; }
.integrations-heading h2 { max-width: 58rem; margin-top: 1rem; font-size: clamp(2.7rem, 5vw, 5.4rem); line-height: .94; letter-spacing: -.035em; }
.integrations-heading > p { max-width: 34rem; color: #4f625a; font-size: .92rem; line-height: 1.75; }
.integrations-board { display: grid; margin-top: clamp(3rem, 6vw, 5.5rem); padding: .75rem; grid-template-columns: minmax(280px, .72fr) minmax(0, 1.28fr); gap: .75rem; border-radius: 32px; background: #091713; box-shadow: 0 42px 90px -62px rgba(3, 22, 15, .75); }
.integrations-hub { position: relative; display: flex; overflow: hidden; min-height: 650px; padding: clamp(1.5rem, 3vw, 2.5rem); flex-direction: column; border-radius: 24px; background: radial-gradient(circle at 50% 46%, rgba(92, 221, 164, .18), transparent 30%), #10271f; color: white; isolation: isolate; }
.integrations-hub::before { position: absolute; inset: 0; z-index: -1; background-image: linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px); background-size: 42px 42px; content: ''; mask-image: linear-gradient(to bottom, black, transparent 82%); }
.integrations-hub__identity { display: flex; align-items: center; gap: .85rem; }
.integrations-hub__identity > span { display: grid; width: 48px; height: 48px; flex: 0 0 auto; place-items: center; border: 1px solid rgba(92, 221, 164, .25); border-radius: 14px; background: rgba(92, 221, 164, .1); color: var(--green-bright); }
.integrations-hub__identity div { display: grid; gap: .12rem; }.integrations-hub__identity small { color: rgba(255,255,255,.46); font-size: .6rem; font-weight: 700; }.integrations-hub__identity strong { font-size: .9rem; }
.integrations-hub__network { position: relative; width: min(78%, 280px); margin: auto; aspect-ratio: 1; border: 1px solid rgba(92, 221, 164, .18); border-radius: 50%; }
.integrations-hub__network::before, .integrations-hub__network::after { position: absolute; border: 1px solid rgba(92, 221, 164, .12); border-radius: 50%; content: ''; }.integrations-hub__network::before { inset: 14%; }.integrations-hub__network::after { inset: 29%; }
.integrations-hub__network > i { position: absolute; z-index: 2; inset: 50% auto auto 50%; display: grid; width: 72px; height: 72px; place-items: center; border-radius: 22px; background: var(--green); color: white; box-shadow: 0 18px 45px -20px rgba(92,221,164,.9); transform: translate(-50%, -50%); }
.integrations-hub__network > span { position: absolute; z-index: 2; width: 10px; height: 10px; border: 2px solid #17372c; border-radius: 50%; background: var(--green-bright); box-shadow: 0 0 0 5px rgba(92,221,164,.08); }.integrations-hub__network > span:nth-child(1) { top: 9%; left: 26%; }.integrations-hub__network > span:nth-child(2) { top: 24%; right: 9%; }.integrations-hub__network > span:nth-child(3) { right: 16%; bottom: 16%; }.integrations-hub__network > span:nth-child(4) { bottom: 7%; left: 31%; }.integrations-hub__network > span:nth-child(5) { top: 47%; left: -5px; }
.integrations-hub > p { max-width: 26rem; color: rgba(255,255,255,.58); font-size: .78rem; line-height: 1.7; }
.integration-cards { display: grid; gap: .5rem; }
.integration-card { position: relative; display: grid; min-height: 124px; padding: 1.25rem 1.4rem; grid-template-columns: 52px minmax(0, 1fr) auto; gap: 1.15rem; align-items: center; border: 1px solid rgba(255,255,255,.05); border-radius: 19px; background: #f7faf8; color: var(--ink); }
.integration-card__icon { display: grid; width: 52px; height: 52px; place-items: center; border-radius: 16px; background: #e7efeb; color: #385248; }
.integration-card__content h3 { font-size: clamp(1.05rem, 1.5vw, 1.25rem); letter-spacing: -.015em; }.integration-card__content p { max-width: 39rem; margin-top: .38rem; color: #60726a; font-size: .76rem; line-height: 1.55; }
.integration-card__status { display: inline-flex; min-width: max-content; padding: .58rem .72rem; align-items: center; gap: .5rem; border: 1px solid #d6e0db; border-radius: 999px; background: rgba(255,255,255,.72); color: #53645d; font-size: .61rem; font-weight: 800; }
.integration-card__status i { width: 7px; height: 7px; border-radius: 50%; background: #8a9b94; }
.integration-card--live { border-color: rgba(7,148,94,.2); background: #dcf6e9; }.integration-card--live .integration-card__icon { background: var(--green); color: white; }.integration-card--live .integration-card__status { border-color: rgba(7,148,94,.18); color: #066a46; }.integration-card--live .integration-card__status i { background: var(--green); box-shadow: 0 0 0 4px rgba(7,148,94,.1); }
.integration-card--plan .integration-card__icon { background: #e8efe9; color: #41634f; }.integration-card--setup .integration-card__icon { background: #e8edf2; color: #456078; }.integration-card--custom .integration-card__icon { background: #eeeae2; color: #6e5d43; }.integration-card--future { background: #eef1ef; }.integration-card--future .integration-card__icon { background: #e1e5e3; color: #68756f; }.integration-card--future .integration-card__status { border-style: dashed; }

.resources-migration { background: #f9fbfa; }
.migration-heading { max-width: 58rem; }.migration-heading .site-title { margin-top: 1.2rem; }.migration-heading .site-copy { max-width: 44rem; }
.migration-track { position: relative; display: grid; margin-top: clamp(3.5rem, 6vw, 6rem); grid-template-columns: repeat(4, 1fr); }
.migration-track__line { position: absolute; top: 25px; right: calc(25% - 25px); left: 25px; height: 1px; background: linear-gradient(90deg, var(--green), var(--green-bright)); }
.migration-track article { position: relative; padding-right: clamp(1rem, 3vw, 3rem); }.migration-track article > span { position: relative; z-index: 1; display: grid; width: 50px; height: 50px; place-items: center; border: 1px solid #bfd0c7; border-radius: 50%; background: #f9fbfa; color: var(--green); font-size: .67rem; font-weight: 800; }.migration-track article > svg { margin-top: 2rem; color: var(--green); }.migration-track h3 { margin-top: 1rem; font-size: 1.1rem; }.migration-track p { max-width: 15rem; margin-top: .65rem; color: var(--muted); font-size: .76rem; line-height: 1.6; }
.migration-note { display: flex; max-width: 820px; margin-top: clamp(3rem, 5vw, 5rem); padding: 1.2rem 1.4rem; align-items: flex-start; gap: .8rem; border-left: 3px solid var(--green); background: #edf5f1; color: var(--muted); font-size: .76rem; line-height: 1.65; }.migration-note svg { flex: 0 0 auto; color: var(--green); }.migration-note strong { color: var(--ink); }
.resources-final { background: radial-gradient(circle at 68% 38%, rgba(92,221,164,.16), transparent 28%), #071713; }

@media (max-width: 1080px) {
  .resources-hero__content { width: min(67vw, 740px); }
  .resources-heading, .integrations-heading { grid-template-columns: 1fr; }
  .integrations-heading { gap: 1.2rem; }
}

@media (max-width: 900px) {
  .resources-grid, .intelligence-layout { grid-template-columns: 1fr; }
  .resource-card__visual { min-height: 430px; }
  .insight-grid { grid-template-columns: 1fr; }
  .insight-card { min-height: 0; }.insight-card h3 { margin-top: 2.2rem; }
  .integrations-board { grid-template-columns: 1fr; }
  .integrations-hub { min-height: 390px; }
  .integrations-hub__network { width: min(55%, 235px); }
  .migration-track { grid-template-columns: repeat(2, 1fr); }
  .migration-track__line { display: none; }.migration-track { gap: 2.5rem 1rem; }
}

@media (max-width: 767px) {
  .resources-hero, .resources-hero__layout { min-height: max(760px, 100svh); }
  .resources-hero__photo { object-position: 65% center; }
  .resources-hero__overlay { background: linear-gradient(180deg, rgba(4,17,14,.9) 0%, rgba(4,17,14,.76) 52%, rgba(4,17,14,.56) 100%); }
  .resources-hero__layout { align-items: flex-start; padding-top: clamp(9.5rem, 23vh, 12rem); }
  .resources-hero__content { width: 100%; }
  .resources-hero__title { font-size: clamp(3.65rem, 17.5vw, 5.1rem); }
  .resources-hero__copy { max-width: 31rem; font-size: 1rem; }
  .resources-heading { gap: 1rem; }
  .resource-card__visual { min-height: 360px; }.resource-card__meta { align-items: flex-start; flex-direction: column; }.resource-card h3 { font-size: 1.8rem; }
  .resource-card--pagamentos .resource-card__visual { min-height: 430px; }
  .shipping-package { top: 10%; right: 4%; min-width: 185px; }.shipping-providers { bottom: 7%; left: 4%; }
  .erp-scene { padding: 1.2rem; grid-template-columns: 1fr; gap: .5rem; }.erp-connector { min-width: 0; min-height: 30px; margin-inline: auto; transform: rotate(90deg); }.erp-order, .erp-stack { width: 82%; }.erp-stack { margin-left: auto; }
  .whatsapp-scene { inset: 7%; }
  .agent-context { grid-template-columns: 1fr; }.agent-prompt { width: 82%; }
  .resources-integrations { padding-block: 5rem; }
  .integrations-heading h2 { font-size: clamp(2.6rem, 12vw, 4.1rem); }
  .integrations-board { margin-inline: calc(var(--gutter) * -.35); padding: .5rem; border-radius: 25px; }
  .integrations-hub { min-height: 340px; padding: 1.3rem; border-radius: 19px; }
  .integrations-hub__network { width: min(68%, 210px); }.integrations-hub__network > i { width: 62px; height: 62px; border-radius: 18px; }
  .integration-card { min-height: 0; padding: 1.15rem; grid-template-columns: 46px minmax(0, 1fr); gap: .8rem 1rem; border-radius: 17px; }.integration-card__icon { width: 46px; height: 46px; border-radius: 14px; }.integration-card__status { grid-column: 2; justify-self: start; }.integration-card__content p { font-size: .73rem; }
  .migration-track { grid-template-columns: 1fr; }.migration-track article { display: grid; grid-template-columns: 50px 32px 1fr; column-gap: .8rem; align-items: center; }.migration-track article > svg, .migration-track h3 { margin-top: 0; }.migration-track p { max-width: none; margin: .7rem 0 0 82px; grid-column: 1 / -1; }
}

@media (max-width: 420px) {
  .resource-card__visual { min-height: 340px; }
  .whatsapp-scene { inset: 6%; }
}

@media (prefers-reduced-motion: reduce) {
  .resources-page *, .resources-page *::before, .resources-page *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
  .resources-hero__photo { transform: none !important; }
}
</style>
