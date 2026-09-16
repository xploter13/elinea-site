<script setup lang="ts">
import { MarketingButton, MarketingTextButton } from '@elinea/ui/marketing'
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
        .from('.resources-hero__eyebrow, .resources-hero__title span, .resources-hero__copy, .resources-hero__actions', { y: 26, opacity: 0, duration: .65, stagger: .07 }, '-=.2')
        .from('.resources-overview', { y: 34, opacity: 0, scale: .98, duration: .8 }, '-=.7')

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
        <div class="site-container resources-hero__layout">
          <div class="resources-hero__content">
            <p class="resources-hero__eyebrow"><span></span>Recursos para uma operação conectada</p>
            <h1 class="resources-hero__title"><span>Venda.</span><span>Organize.</span><span>Evolua.</span></h1>
            <p class="resources-hero__copy">Da primeira visita ao pós-venda, a Elínea reúne recursos para sua loja trabalhar com menos fragmentação e mais contexto.</p>
            <div class="resources-hero__actions">
              <MarketingButton variant="primary" href="/precos#planos">Criar minha loja<template #icon><ArrowRight :size="17" /></template></MarketingButton>
              <MarketingTextButton tone="light" href="#operacao">Explorar recursos</MarketingTextButton>
            </div>
          </div>

          <div class="resources-overview" aria-label="Visão das áreas conectadas pela plataforma Elínea">
            <div class="resources-overview__top"><span></span><span></span><span></span><small>Operação conectada</small><i>Online</i></div>
            <div class="resources-overview__body">
              <div class="overview-core"><strong>ELÍNEA</strong><small>Loja + operação</small></div>
              <div class="overview-flow" aria-hidden="true"><i></i><i></i><i></i></div>
              <div class="overview-modules">
                <span><CreditCard :size="18" />Pagamento</span>
                <span><Truck :size="18" />Entrega</span>
                <span><Boxes :size="18" />Gestão</span>
                <span><MessageCircle :size="18" />WhatsApp</span>
              </div>
              <div class="overview-event"><PackageCheck :size="18" /><span><small>Pedido #1482</small><strong>Fluxo atualizado</strong></span><Check :size="16" /></div>
            </div>
          </div>
        </div>
        <div class="site-container resources-hero__rail" aria-label="Áreas de recursos"><span>Pagamentos</span><span>Logística</span><span>Gestão</span><span>Atendimento</span><span>Dados</span></div>
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
                <div v-if="card.id === 'pagamentos'" class="payment-scene">
                  <div class="payment-order"><small>Resumo do pedido</small><span><i></i><b>Produto selecionado</b><em>R$ 129,90</em></span><strong>Total <b>R$ 129,90</b></strong></div>
                  <div class="payment-method"><span><CreditCard :size="17" />Forma de pagamento</span><span class="payment-option is-active">Pix <Check :size="14" /></span><span class="payment-option">Cartão</span><small>Gateway definido na implantação</small></div>
                </div>

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

      <section id="integracoes" class="resources-integrations">
        <div class="site-container integrations-band" data-resource-reveal>
          <div><p class="site-label">Integrações com estado claro</p><h2>Uma base preparada para conectar o que sua operação usa.</h2></div>
          <p>WhatsApp já faz parte da oferta. Gateways, ERP, logística, Analytics e Meta dependem de plano, configuração ou evolução do produto.</p>
          <div class="integration-statuses" aria-label="Estado das integrações citadas">
            <span><i class="is-live"></i>WhatsApp <small>Disponível</small></span>
            <span><i></i>Gateways <small>Conforme plano</small></span>
            <span><i></i>ERP e fiscal <small>Personalizado</small></span>
            <span><i class="is-future"></i>Analytics e Meta <small>Em evolução</small></span>
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
          <div class="migration-track" data-resource-reveal>
            <article v-for="(step, index) in migrationSteps" :key="step.title">
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
.resources-hero { position: relative; min-height: 100svh; overflow: hidden; padding: 8.5rem 0 2rem; background: radial-gradient(circle at 76% 38%, rgba(7,148,94,.2), transparent 28%), #071310; color: white; isolation: isolate; }
.resources-hero::before { position: absolute; z-index: -1; inset: 0; background-image: linear-gradient(rgba(255,255,255,.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.022) 1px, transparent 1px); background-size: 72px 72px; mask-image: linear-gradient(to bottom, black, transparent 90%); content: ''; }
.resources-hero__layout { display: grid; min-height: calc(100svh - 13rem); grid-template-columns: .82fr 1.18fr; gap: clamp(3rem, 7vw, 7rem); align-items: center; }
.resources-hero__content { position: relative; z-index: 2; }
.resources-hero__eyebrow { display: inline-flex; align-items: center; gap: .65rem; color: rgba(255,255,255,.66); font-size: .8rem; font-weight: 700; }
.resources-hero__eyebrow span { width: 7px; height: 7px; border-radius: 50%; background: var(--green-bright); box-shadow: 0 0 16px rgba(92,221,164,.55); }
.resources-hero__title { margin-top: 1.6rem; color: white; font-size: clamp(4rem, 7.1vw, 7.6rem); font-weight: 600; line-height: .89; letter-spacing: -.07em; }
.resources-hero__title span { display: block; }
.resources-hero__copy { max-width: 38rem; margin-top: 1.7rem; color: rgba(255,255,255,.64); font-size: clamp(1rem, 1.18vw, 1.18rem); line-height: 1.7; }
.resources-hero__actions { display: flex; margin-top: 2.1rem; flex-wrap: wrap; align-items: center; gap: 1.5rem; }
.resources-hero__rail { position: relative; display: grid; padding-top: 1.5rem; grid-template-columns: repeat(5, 1fr); border-top: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.42); font-size: .7rem; font-weight: 700; }

.resources-overview { position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,.11); border-radius: 24px; background: #0d211c; box-shadow: 0 42px 90px -50px #000; }
.resources-overview__top { display: flex; min-height: 52px; padding: 0 1.2rem; align-items: center; gap: .45rem; border-bottom: 1px solid rgba(255,255,255,.08); }
.resources-overview__top > span { width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,.17); }
.resources-overview__top small { margin-left: .55rem; color: rgba(255,255,255,.54); font-size: .68rem; }
.resources-overview__top i { margin-left: auto; color: var(--green-bright); font-size: .62rem; font-style: normal; font-weight: 700; }
.resources-overview__body { position: relative; min-height: 520px; padding: 2rem; background: radial-gradient(circle at center, rgba(7,148,94,.17), transparent 34%); }
.overview-core { position: absolute; z-index: 2; inset: 38% 35%; display: grid; place-content: center; border: 1px solid rgba(92,221,164,.35); border-radius: 20px; background: #071713; text-align: center; box-shadow: 0 0 70px rgba(7,148,94,.14); }
.overview-core strong { font-family: var(--font-display); font-size: 1.5rem; letter-spacing: -.05em; }
.overview-core small { margin-top: .25rem; color: rgba(255,255,255,.42); font-size: .6rem; }
.overview-flow { position: absolute; inset: 14% 13%; border: 1px solid rgba(92,221,164,.13); border-radius: 50%; }
.overview-flow::before { position: absolute; inset: 18%; border: 1px solid rgba(92,221,164,.12); border-radius: inherit; content: ''; }
.overview-flow i { position: absolute; width: 7px; height: 7px; border-radius: 50%; background: var(--green-bright); box-shadow: 0 0 16px rgba(92,221,164,.7); }
.overview-flow i:nth-child(1) { left: 16%; top: 10%; }.overview-flow i:nth-child(2) { right: 5%; top: 46%; }.overview-flow i:nth-child(3) { bottom: 4%; left: 34%; }
.overview-modules span { position: absolute; z-index: 2; display: flex; min-width: 132px; min-height: 66px; padding: .75rem; align-items: center; gap: .65rem; border: 1px solid rgba(255,255,255,.09); border-radius: 13px; background: #142b25; color: rgba(255,255,255,.75); font-size: .68rem; font-weight: 700; box-shadow: 0 20px 45px -32px #000; }
.overview-modules svg { color: var(--green-bright); }
.overview-modules span:nth-child(1) { left: 5%; top: 13%; }.overview-modules span:nth-child(2) { right: 4%; top: 18%; }.overview-modules span:nth-child(3) { right: 7%; bottom: 14%; }.overview-modules span:nth-child(4) { left: 4%; bottom: 18%; }
.overview-event { position: absolute; z-index: 3; right: 4%; bottom: 4%; display: flex; min-width: 210px; padding: .85rem 1rem; align-items: center; gap: .7rem; border-radius: 13px; background: white; color: var(--ink); box-shadow: 0 20px 55px -30px #000; }
.overview-event > svg { color: var(--green); }.overview-event > svg:last-child { margin-left: auto; }
.overview-event span { display: grid; gap: .1rem; }.overview-event small { color: var(--muted); font-size: .62rem; }.overview-event strong { font-size: .74rem; }

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
.resource-card h3 { max-width: 32rem; margin-top: 1.3rem; font-size: clamp(1.7rem, 2.5vw, 2.55rem); line-height: 1.03; letter-spacing: -.05em; }
.resource-card__content > p { max-width: 37rem; margin-top: 1rem; color: var(--muted); font-size: .9rem; line-height: 1.7; }

.payment-scene { position: absolute; inset: 10% 7%; display: grid; grid-template-columns: .92fr 1.08fr; align-items: center; }
.payment-order, .payment-method { position: relative; padding: 1.4rem; border-radius: 16px; background: white; box-shadow: 0 25px 55px -38px rgba(0,0,0,.5); }
.payment-order { z-index: 1; transform: translateX(8%); }.payment-order > small, .payment-method > span { color: var(--muted); font-size: .68rem; font-weight: 700; }
.payment-order > span { display: grid; margin-top: 1rem; padding: .8rem 0 .9rem 3.2rem; border-block: 1px solid var(--line); }.payment-order > span i { position: absolute; width: 38px; height: 46px; margin-left: -3.2rem; border-radius: 8px; background: linear-gradient(145deg, #dff4e9, #96d8b9); }.payment-order b { font-size: .72rem; }.payment-order em { margin-top: .18rem; color: var(--muted); font-size: .63rem; font-style: normal; }.payment-order > strong { display: flex; margin-top: 1rem; justify-content: space-between; font-size: .75rem; }.payment-order > strong b { font-size: .9rem; }
.payment-method { z-index: 2; transform: translateX(-2%); }.payment-method > span:first-child { display: flex; align-items: center; gap: .45rem; }.payment-option { display: flex; width: 100%; min-height: 44px; margin-top: .65rem; padding: 0 .85rem; align-items: center; justify-content: space-between; border: 1px solid var(--line); border-radius: 9px; background: white; color: var(--ink); font-size: .72rem; font-weight: 750; }.payment-option.is-active { border-color: rgba(7,148,94,.35); background: #effaf4; color: var(--green); }.payment-method > small { display: block; margin-top: .8rem; color: var(--muted); font-size: .55rem; }

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
.insight-card h3 { margin-top: 3.5rem; font-size: clamp(1.4rem, 2vw, 2rem); letter-spacing: -.04em; }.insight-card > p { margin-top: 1rem; color: var(--muted); font-size: .82rem; line-height: 1.65; }.insight-card > div:last-child { display: flex; margin-top: 1.5rem; flex-wrap: wrap; gap: .45rem; }.insight-card > div:last-child span { padding: .42rem .55rem; border: 1px solid var(--line); border-radius: 999px; background: white; color: #53645e; font-size: .57rem; font-weight: 700; }

.resources-integrations { padding: clamp(3.5rem, 7vw, 7rem) 0; background: #eef4f1; }
.integrations-band { display: grid; grid-template-columns: 1fr .75fr; gap: clamp(2rem, 6vw, 6rem); align-items: end; }
.integrations-band h2 { max-width: 52rem; margin-top: .9rem; font-size: clamp(2.3rem, 4.5vw, 4.8rem); line-height: .98; letter-spacing: -.055em; }.integrations-band > p { color: var(--muted); line-height: 1.7; }
.integration-statuses { grid-column: 1 / -1; display: grid; margin-top: 1.5rem; grid-template-columns: repeat(4, 1fr); border-block: 1px solid #cad8d1; }.integration-statuses > span { display: grid; min-height: 105px; padding: 1.2rem; grid-template-columns: auto 1fr; align-content: center; column-gap: .55rem; border-right: 1px solid #cad8d1; font-size: .78rem; font-weight: 800; }.integration-statuses > span:last-child { border-right: 0; }.integration-statuses i { width: 8px; height: 8px; margin-top: .2rem; border-radius: 50%; background: #92a39c; }.integration-statuses i.is-live { background: var(--green); }.integration-statuses i.is-future { background: #b2bcb8; }.integration-statuses small { grid-column: 2; margin-top: .2rem; color: var(--muted); font-size: .57rem; font-weight: 650; }

.resources-migration { background: #f9fbfa; }
.migration-heading { max-width: 58rem; }.migration-heading .site-title { margin-top: 1.2rem; }.migration-heading .site-copy { max-width: 44rem; }
.migration-track { position: relative; display: grid; margin-top: clamp(3.5rem, 6vw, 6rem); grid-template-columns: repeat(4, 1fr); }
.migration-track::before { position: absolute; top: 25px; right: 10%; left: 10%; height: 1px; background: #bfd0c7; content: ''; }
.migration-track article { position: relative; padding-right: clamp(1rem, 3vw, 3rem); }.migration-track article > span { position: relative; z-index: 1; display: grid; width: 50px; height: 50px; place-items: center; border: 1px solid #bfd0c7; border-radius: 50%; background: #f9fbfa; color: var(--green); font-size: .67rem; font-weight: 800; }.migration-track article > svg { margin-top: 2rem; color: var(--green); }.migration-track h3 { margin-top: 1rem; font-size: 1.1rem; }.migration-track p { max-width: 15rem; margin-top: .65rem; color: var(--muted); font-size: .76rem; line-height: 1.6; }
.migration-note { display: flex; max-width: 820px; margin-top: clamp(3rem, 5vw, 5rem); padding: 1.2rem 1.4rem; align-items: flex-start; gap: .8rem; border-left: 3px solid var(--green); background: #edf5f1; color: var(--muted); font-size: .76rem; line-height: 1.65; }.migration-note svg { flex: 0 0 auto; color: var(--green); }.migration-note strong { color: var(--ink); }
.resources-final { background: radial-gradient(circle at 68% 38%, rgba(92,221,164,.16), transparent 28%), #071713; }

@media (max-width: 1080px) {
  .resources-hero__layout { grid-template-columns: 1fr; padding-top: 3rem; }
  .resources-hero__content { max-width: 780px; }
  .resources-overview { width: min(100%, 780px); margin-inline: auto; }
  .resources-heading, .integrations-band { grid-template-columns: 1fr; }
}

@media (max-width: 900px) {
  .resources-hero { min-height: auto; padding-bottom: 2.5rem; }
  .resources-hero__layout { min-height: auto; padding-block: 3rem 4rem; }
  .resources-grid, .intelligence-layout { grid-template-columns: 1fr; }
  .resource-card__visual { min-height: 430px; }
  .insight-grid { grid-template-columns: 1fr; }
  .insight-card { min-height: 0; }.insight-card h3 { margin-top: 2.2rem; }
  .integration-statuses, .migration-track { grid-template-columns: repeat(2, 1fr); }
  .integration-statuses > span:nth-child(2) { border-right: 0; }
  .migration-track::before { display: none; }.migration-track { gap: 2.5rem 1rem; }
}

@media (max-width: 767px) {
  .resources-hero { padding-top: 6.5rem; }
  .resources-hero__layout { gap: 3rem; padding-top: 1rem; }
  .resources-hero__title { font-size: clamp(3.7rem, 18vw, 5.2rem); }
  .resources-hero__rail { grid-template-columns: repeat(2, 1fr); gap: .8rem; }
  .resources-overview__body { min-height: 430px; padding: 1rem; }
  .overview-core { inset: 37% 29%; }.overview-flow { inset: 15% 7%; }
  .overview-modules span { min-width: 106px; min-height: 56px; padding: .6rem; font-size: .58rem; }.overview-modules span:nth-child(1) { left: 1%; }.overview-modules span:nth-child(2) { right: 0; }.overview-modules span:nth-child(3) { right: 0; }.overview-modules span:nth-child(4) { left: 0; }
  .overview-event { right: 2%; bottom: 2%; min-width: 180px; }
  .resources-heading { gap: 1rem; }
  .resource-card__visual { min-height: 360px; }.resource-card__meta { align-items: flex-start; flex-direction: column; }.resource-card h3 { font-size: 1.8rem; }
  .resource-card--pagamentos .resource-card__visual { min-height: 430px; }
  .payment-scene { inset: 7%; grid-template-columns: 1fr; }.payment-order { width: 78%; transform: none; }.payment-method { width: 76%; margin: -1rem 0 0 auto; transform: none; }
  .shipping-package { top: 10%; right: 4%; min-width: 185px; }.shipping-providers { bottom: 7%; left: 4%; }
  .erp-scene { padding: 1.2rem; grid-template-columns: 1fr; gap: .5rem; }.erp-connector { min-width: 0; min-height: 30px; margin-inline: auto; transform: rotate(90deg); }.erp-order, .erp-stack { width: 82%; }.erp-stack { margin-left: auto; }
  .whatsapp-scene { inset: 7%; }
  .agent-context { grid-template-columns: 1fr; }.agent-prompt { width: 82%; }
  .integration-statuses { grid-template-columns: 1fr; }.integration-statuses > span { min-height: 82px; border-right: 0; border-bottom: 1px solid #cad8d1; }.integration-statuses > span:last-child { border-bottom: 0; }
  .migration-track { grid-template-columns: 1fr; }.migration-track article { display: grid; grid-template-columns: 50px 32px 1fr; column-gap: .8rem; align-items: center; }.migration-track article > svg, .migration-track h3 { margin-top: 0; }.migration-track p { max-width: none; margin: .7rem 0 0 82px; grid-column: 1 / -1; }
}

@media (max-width: 420px) {
  .resources-overview__body { min-height: 400px; }
  .overview-event { min-width: 166px; padding: .7rem; }.overview-event strong { font-size: .67rem; }
  .resource-card__visual { min-height: 340px; }
  .payment-order { width: 86%; }.payment-method { width: 84%; }
  .whatsapp-scene { inset: 6%; }
}

@media (prefers-reduced-motion: reduce) {
  .resources-page *, .resources-page *::before, .resources-page *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
</style>
