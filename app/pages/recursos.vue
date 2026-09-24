<script setup lang="ts">
import resourcesHeroUrl from '~/assets/images/elinea-resources-hero-2.png'
import operationMachineUrl from '~/assets/images/portrait-woman-arranging-flowers-shop.jpg'
import { MarketingButton } from '@elinea/ui/marketing'
import {
  ArrowRight,
  BarChart3,
  Bot,
  Boxes,
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
    stage: 'Receber',
    icon: CreditCard,
    eyebrow: 'Checkout e pagamentos',
    summary: 'Pix, cartão e gateways integrados ao fluxo do pedido.',
    title: 'Venda com os meios que fazem sentido para o cliente.',
    description: 'Pix, cartão e gateways entram no mesmo fluxo de pedidos. A configuração varia conforme o plano, o provedor escolhido e o escopo da implantação.',
    status: 'Conforme plano',
  },
  {
    id: 'logistica',
    stage: 'Entregar',
    icon: Truck,
    eyebrow: 'Frete e logística',
    summary: 'Regras de frete, etiquetas e rastreio organizados.',
    title: 'Do cálculo do frete ao acompanhamento da entrega.',
    description: 'Estruture regras de envio e conecte a operação a soluções como Melhor Envio e Correios conforme a necessidade e a validação técnica do projeto.',
    status: 'Sob configuração',
  },
  {
    id: 'gestao',
    stage: 'Sincronizar',
    icon: Boxes,
    eyebrow: 'ERP e documentos fiscais',
    summary: 'Estoque, faturamento e documentos compartilhando dados.',
    title: 'Pedido, estoque e faturamento falando a mesma língua.',
    description: 'Projetos personalizados podem conectar ERPs, como o Bling, e fluxos de emissão fiscal para reduzir digitação repetida e manter os dados consistentes.',
    status: 'Projeto personalizado',
  },
  {
    id: 'whatsapp',
    stage: 'Relacionar',
    icon: MessageCircle,
    eyebrow: 'Venda pelo WhatsApp',
    summary: 'Atendimento, histórico e automações na mesma rotina.',
    title: 'A conversa continua conectada à operação.',
    description: 'Centralize contatos, histórico, pedidos, campanhas e automações para transformar atendimento em uma rotina comercial organizada e mensurável.',
    status: 'Disponível',
  },
]

const insightCards = [
  {
    icon: BarChart3,
    kind: 'measurement',
    title: 'Medição e campanhas',
    text: 'Prepare eventos e conversões para ferramentas como Google Analytics e Meta Pixel, com implementação validada para cada operação.',
    tags: ['Google Analytics', 'Meta Pixel'],
    status: 'Em evolução',
  },
  {
    icon: Search,
    kind: 'seo',
    title: 'Base técnica para SEO',
    text: 'Organize títulos, descrições, URLs e conteúdo com uma estrutura rastreável, responsiva e pronta para evoluir com o catálogo.',
    tags: ['Metadados', 'URLs', 'Performance'],
    status: 'Estrutura da loja',
  },
  {
    icon: FileText,
    kind: 'reports',
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

      gsap.from('.operation-editorial__stage', {
        y: 36,
        opacity: 0,
        duration: .85,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.operation-editorial__stage', start: 'top 82%', once: true },
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
        <div class="site-container operation-editorial">
          <header class="operation-editorial__header" data-resource-reveal>
            <p class="operation-editorial__label"><span aria-hidden="true"></span>A operação por inteiro</p>
            <h2><span>Venda confirmada.</span><span>Operação conectada.</span></h2>
            <p class="operation-editorial__lead">O pedido é só o começo. A partir dele, cada parte da operação precisa saber o que fazer.</p>
          </header>

          <div class="operation-editorial__stage">
            <div class="operation-editorial__content">
              <div class="operation-editorial__intro">
                <p class="operation-editorial__overline"><PackageCheck :size="18" aria-hidden="true" />Depois da venda</p>
                <h3>Um pedido.<br>Várias frentes em movimento.</h3>
                <p>Pagamento, entrega, gestão e relacionamento seguem o mesmo contexto para a rotina avançar com clareza.</p>
              </div>

              <ul class="operation-features" aria-label="Frentes da operação">
                <li v-for="card in resourceCards" :id="card.id" :key="card.id" class="operation-feature">
                  <span class="operation-feature__icon"><component :is="card.icon" :size="20" :stroke-width="1.8" aria-hidden="true" /></span>
                  <div class="operation-feature__text"><strong>{{ card.stage }}</strong><p>{{ card.summary }}</p></div>
                  <small>{{ card.status }}</small>
                </li>
              </ul>

              <p class="operation-editorial__note">Recursos e conexões variam conforme plano, provedores e escopo de implantação.</p>
            </div>

            <figure class="operation-editorial__image">
              <img :src="operationMachineUrl" alt="Pedido central ligado visualmente a pagamento, expedição, gestão e atendimento" loading="lazy" width="1024" height="1536">
              <figcaption><span aria-hidden="true"></span>Uma venda ativa toda a estrutura ao redor.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section class="chapter resources-intelligence">
        <div class="site-container intelligence-layout">
          <header class="intelligence-heading" data-resource-reveal>
            <div class="intelligence-heading__top">
              <p class="site-label">Automação que entende o contexto</p>
              <span class="intelligence-status"><i aria-hidden="true"></i> Agente de IA em evolução</span>
            </div>
            <div class="intelligence-heading__body">
              <h2>O contexto vem antes da resposta.</h2>
              <p>O Agente de IA está em evolução para apoiar o atendimento com informações da operação, preparar respostas e reduzir tarefas repetitivas.</p>
            </div>
          </header>

          <div class="agent-flow" role="group" aria-label="Exemplo ilustrativo de atendimento com o Agente de IA" data-resource-reveal>
            <div class="agent-flow__question">
              <span class="agent-flow__step">01 <span aria-hidden="true">/</span> A pergunta</span>
              <div class="agent-flow__question-body">
                <MessageCircle :size="28" :stroke-width="1.6" aria-hidden="true" />
                <blockquote>Quando meu pedido chega?</blockquote>
              </div>
              <p>Uma dúvida simples, com uma resposta que depende do pedido certo.</p>
            </div>

            <div class="agent-flow__context">
              <span class="agent-flow__step">02 <span aria-hidden="true">/</span> O contexto</span>
              <p class="agent-flow__context-intro">A resposta considera informações ligadas à venda.</p>
              <ul>
                <li><PackageCheck :size="19" aria-hidden="true" /><span>Pedido localizado</span></li>
                <li><Truck :size="19" aria-hidden="true" /><span>Entrega consultada</span></li>
                <li><MessageCircle :size="19" aria-hidden="true" /><span>Conversa preservada</span></li>
              </ul>
            </div>

            <div class="agent-flow__response">
              <div class="agent-flow__response-top"><span class="agent-flow__step">03 <span aria-hidden="true">/</span> A sugestão</span><Bot :size="25" :stroke-width="1.6" aria-hidden="true" /></div>
              <p>Seu pedido está em transporte. Quer receber o link de acompanhamento?</p>
              <div class="agent-flow__review"><ShieldCheck :size="19" aria-hidden="true" /><span>Resposta preparada para revisão humana</span></div>
            </div>
            <p class="agent-flow__disclaimer">Fluxo ilustrativo. O Agente de IA ainda está em evolução.</p>
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
            <article v-for="item in insightCards" :key="item.title" class="insight-card" :class="`insight-card--${item.kind}`">
              <header class="insight-card__top">
                <span><component :is="item.icon" :size="22" aria-hidden="true" /></span>
                <small><i aria-hidden="true"></i>{{ item.status }}</small>
              </header>

              <div class="insight-card__visual" aria-hidden="true">
                <div v-if="item.kind === 'measurement'" class="measurement-signal">
                  <svg viewBox="0 0 520 240" preserveAspectRatio="none">
                    <path d="M8 184 C72 184 96 112 160 104 C224 96 252 154 314 150 C378 146 390 70 444 58 C474 51 492 70 512 78" />
                    <path class="is-soft" d="M8 210 C74 210 104 166 168 164 C232 162 264 199 330 196 C398 193 426 132 512 130" />
                  </svg>
                  <span class="signal-node signal-node--one"></span>
                  <span class="signal-node signal-node--two"></span>
                  <span class="signal-node signal-node--three"></span>
                  <div class="signal-caption"><span>Visita</span><span>Evento</span><span>Conversão</span></div>
                </div>

                <div v-else-if="item.kind === 'seo'" class="seo-preview">
                  <div class="seo-preview__bar"><i></i><i></i><i></i><span></span></div>
                  <small>sua-loja.com/produto</small>
                  <strong>Uma página clara para pessoas e buscas</strong>
                  <p>Informação organizada desde o título até a descrição.</p>
                </div>

                <div v-else class="report-preview">
                  <div><span>Vendas</span><i><b></b></i></div>
                  <div><span>Pedidos</span><i><b></b></i></div>
                  <div><span>Operação</span><i><b></b></i></div>
                </div>
              </div>

              <div class="insight-card__body"><h3>{{ item.title }}</h3><p>{{ item.text }}</p></div>
              <div class="insight-card__tags"><span v-for="tag in item.tags" :key="tag">{{ tag }}</span></div>
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
.resources-hero__eyebrow { display: inline-flex; align-items: center; gap: .65rem; color: rgba(255,255,255,.66); font-size: .8rem; font-weight: 500; }
.resources-hero__eyebrow span { width: 7px; height: 7px; border-radius: 50%; background: var(--green-bright); box-shadow: 0 0 16px rgba(92,221,164,.55); }
.resources-hero__title { margin-top: 1.6rem; color: white; font-size: clamp(4.4rem, 7.4vw, 8rem); font-weight: 700; line-height: .89; letter-spacing: -.04em; }
.resources-hero__title span { display: block; }
.resources-hero__copy { max-width: 39rem; margin-top: 1.7rem; color: rgba(255,255,255,.7); font-size: clamp(1rem, 1.18vw, 1.18rem); line-height: 1.7; }

.resources-core { padding-block: clamp(5.5rem, 9vw, 9rem); background: #f6f8f5; color: #10251d; }
.operation-editorial__header { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(240px, .5fr); column-gap: clamp(2rem, 8vw, 8rem); align-items: end; }
.operation-editorial__label { display: flex; grid-column: 1 / -1; align-items: center; gap: .65rem; margin-bottom: clamp(2.3rem, 4.5vw, 4.5rem); color: #426454; font-size: .78rem; font-weight: 500; }
.operation-editorial__label span { width: 18px; height: 2px; background: #148858; }
.operation-editorial__header h2 { font-size: clamp(3.4rem, 5.5vw, 6.7rem); font-weight: 700; line-height: .92; letter-spacing: -.055em; }
.operation-editorial__header h2 span { display: block; }
.operation-editorial__header h2 span:last-child { color: #178757; }
.operation-editorial__lead { max-width: 20rem; padding-bottom: .5rem; color: #526a5e; font-size: clamp(1rem, 1.17vw, 1.12rem); line-height: 1.65; }
.operation-editorial__stage { display: grid; overflow: hidden; margin-top: clamp(3rem, 5.5vw, 5.5rem); grid-template-columns: minmax(0, 1.08fr) minmax(0, .92fr); border-radius: 26px; background: #0d2119; color: #f8fbf7; }
.operation-editorial__content { display: flex; min-width: 0; padding: clamp(2rem, 4.2vw, 4.75rem); flex-direction: column; }
.operation-editorial__overline { display: inline-flex; align-items: center; gap: .7rem; color: #95d7b2; font-size: .8rem; font-weight: 500; }
.operation-editorial__intro h3 { max-width: 36rem; margin-top: 1.45rem; color: #f8fbf7; font-size: clamp(2rem, 3.25vw, 3.8rem); font-weight: 700; line-height: 1.04; letter-spacing: -.04em; }
.operation-editorial__intro > p:last-child { max-width: 31rem; margin-top: 1.3rem; color: #b6c9be; font-size: var(--description-size); line-height: 1.7; }
.operation-features { margin: clamp(2.5rem, 4vw, 4rem) 0 0; padding: 0; list-style: none; border-top: 1px solid rgba(216,244,225,.2); }
.operation-feature { display: grid; padding: 1rem 0; grid-template-columns: 42px minmax(0, 1fr) auto; gap: 1rem; align-items: center; border-bottom: 1px solid rgba(216,244,225,.2); }
.operation-feature__icon { display: grid; width: 42px; height: 42px; place-items: center; border: 1px solid rgba(132,219,167,.24); border-radius: 12px; color: #86dbac; }
.operation-feature__text strong { display: block; font-size: var(--aux-title-size); font-weight: 600; }
.operation-feature__text p { margin-top: .3rem; color: #aabeb2; font-size: var(--description-size); line-height: 1.55; }
.operation-feature > small { justify-self: end; color: #a7d6b8; font-size: .65rem; font-weight: 500; text-align: right; }
.operation-editorial__note { max-width: 34rem; margin-top: auto; padding-top: 2rem; color: #8da79a; font-size: var(--description-size); line-height: 1.6; }
.operation-editorial__image { position: relative; min-width: 0; min-height: 720px; margin: 0; overflow: hidden; background: #172f24; }
.operation-editorial__image::after { position: absolute; inset: 50% 0 0; background: linear-gradient(transparent, rgba(4,17,12,.78)); content: ''; pointer-events: none; }
.operation-editorial__image img { position: absolute; inset: 0; display: block; width: 100%; height: 100%; object-fit: cover; object-position: center 49%; }
.operation-editorial__image figcaption { position: absolute; z-index: 1; right: 2rem; bottom: 2rem; left: 2rem; display: flex; align-items: center; gap: .8rem; color: #f1f9f3; font-size: var(--description-size); font-weight: 500; line-height: 1.4; }
.operation-editorial__image figcaption span { width: 22px; height: 1px; flex: 0 0 auto; background: #9ee5b8; }
.resources-heading { display: grid; grid-template-columns: 1.15fr .65fr; gap: clamp(2rem, 6vw, 6rem); align-items: end; }
.resources-heading .site-copy { margin-bottom: .5rem; }

.resources-intelligence { color: white; background: linear-gradient(135deg, #034f36 0%, #078759 48%, #29b879 100%); }
.resources-intelligence::before { position: absolute; inset: 0; background: radial-gradient(circle at 75% 35%, rgba(255,255,255,.15), transparent 28%); content: ''; pointer-events: none; }
.intelligence-layout { position: relative; }
.intelligence-heading__top { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.intelligence-heading .site-label { margin: 0; color: #e0ffe8; }
.intelligence-status { display: inline-flex; padding: .62rem .8rem; align-items: center; gap: .55rem; border: 1px solid rgba(255,255,255,.24); border-radius: 999px; background: #064d36; color: white; font-size: .7rem; font-weight: 500; white-space: nowrap; }
.intelligence-status i { width: 7px; height: 7px; border-radius: 50%; background: #ddffe9; box-shadow: 0 0 0 4px rgba(221,255,233,.15); }
.intelligence-heading__body { display: grid; margin-top: clamp(2.3rem, 5vw, 5rem); grid-template-columns: minmax(0, 1.5fr) minmax(230px, .5fr); gap: clamp(2rem, 6vw, 6rem); align-items: end; }
.intelligence-heading h2 { max-width: 14ch; color: white; font-size: clamp(3.5rem, 6.4vw, 7rem); font-weight: 700; line-height: .94; letter-spacing: -.045em; text-wrap: balance; }
.intelligence-heading__body > p { max-width: 23rem; padding: 1.1rem 1.25rem; border-left: 2px solid #bbefcd; background: #075e40; color: #f0fff3; font-size: clamp(1rem, 1.15vw, 1.15rem); line-height: 1.7; }
.agent-flow { display: grid; overflow: hidden; margin-top: clamp(3.5rem, 6vw, 6rem); grid-template-columns: minmax(0, .9fr) minmax(0, .7fr) minmax(0, 1.1fr); border: 1px solid rgba(255,255,255,.28); border-radius: 26px; background: #f5faf5; box-shadow: 0 42px 90px -62px rgba(0,36,23,.55); color: #10291c; }
.agent-flow__question, .agent-flow__context, .agent-flow__response { display: flex; min-width: 0; min-height: 400px; padding: clamp(1.65rem, 3vw, 3.5rem); flex-direction: column; }
.agent-flow__step { color: #467b5d; font-size: .72rem; font-weight: 500; }
.agent-flow__step span { margin-inline: .3rem; opacity: .5; }
.agent-flow__question { justify-content: space-between; background: #073e2e; color: white; }
.agent-flow__question .agent-flow__step { color: #aee9c3; }
.agent-flow__question-body { margin-block: auto; padding-block: 2rem; }
.agent-flow__question-body svg { color: #aee9c3; }
.agent-flow__question blockquote { max-width: 10ch; margin: 1.5rem 0 0; font-family: var(--font-display); font-size: clamp(2.1rem, 3vw, 3.6rem); font-weight: 700; line-height: 1.04; letter-spacing: -.035em; }
.agent-flow__question > p { max-width: 21rem; color: #b5d9c2; font-size: var(--description-size); line-height: 1.6; }
.agent-flow__context { position: relative; background: #e8f3e8; }
.agent-flow__context-intro { max-width: 14rem; margin-top: auto; color: #345743; font-size: 1.15rem; font-weight: 600; line-height: 1.3; }
.agent-flow__context ul { margin: 1.4rem 0 0; padding: 0; list-style: none; }
.agent-flow__context li { display: flex; padding: .8rem 0; align-items: center; gap: .7rem; border-top: 1px solid #cbded0; color: #2f5941; font-size: .76rem; font-weight: 500; }
.agent-flow__context li svg { flex: 0 0 auto; color: #168353; }
.agent-flow__response { background: #f7fbf7; }
.agent-flow__response-top { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.agent-flow__response-top svg { color: #168353; }
.agent-flow__response > p { max-width: 27ch; margin-block: auto; padding-block: 2rem; color: #163725; font-family: var(--font-display); font-size: clamp(1.7rem, 1.95vw, 2.25rem); font-weight: 600; line-height: 1.2; letter-spacing: -.025em; }
.agent-flow__review { display: flex; padding-top: 1rem; align-items: center; gap: .65rem; border-top: 1px solid #d4e5d8; color: #3e6950; font-size: .78rem; font-weight: 500; }
.agent-flow__review svg { flex: 0 0 auto; color: #168353; }
.agent-flow__disclaimer { grid-column: 1 / -1; padding: .85rem clamp(1.65rem, 3vw, 3.5rem); background: #f7fbf7; color: #5d7666; font-size: var(--description-size); line-height: 1.5; }

.resources-insights { background: #f4f7f5; }
.insight-grid { display: grid; overflow: hidden; margin-top: clamp(3.5rem, 6vw, 6rem); padding: 1px; grid-template-columns: minmax(0, 1.08fr) minmax(320px, .92fr); grid-template-rows: repeat(2, minmax(280px, 1fr)); gap: 1px; border-radius: 28px; background: #cbd7d1; box-shadow: 0 36px 80px -62px rgba(13,35,28,.55); }
.insight-card { display: grid; min-width: 0; padding: clamp(1.5rem, 2.8vw, 2.5rem); grid-template-rows: auto minmax(0, 1fr) auto auto; background: white; color: var(--ink); }
.insight-card--measurement { grid-row: 1 / 3; min-height: 620px; background: #10251e; color: white; }
.insight-card:not(.insight-card--measurement) { grid-template-columns: minmax(0, 1fr) minmax(150px, .72fr); grid-template-rows: auto minmax(0, 1fr) auto; column-gap: clamp(1rem, 2.5vw, 2rem); }.insight-card:not(.insight-card--measurement) .insight-card__top { grid-column: 1 / -1; }.insight-card:not(.insight-card--measurement) .insight-card__visual { grid-row: 2 / 4; grid-column: 2; margin: 1.35rem 0 0; }.insight-card:not(.insight-card--measurement) .insight-card__body { grid-row: 2; grid-column: 1; align-self: end; }.insight-card:not(.insight-card--measurement) .insight-card__tags { grid-row: 3; grid-column: 1; }
.insight-card__top { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }.insight-card__top > span { display: grid; width: 48px; height: 48px; place-items: center; border-radius: 14px; background: #e5eee9; color: var(--green); }.insight-card__top small { display: inline-flex; padding: .48rem .64rem; align-items: center; gap: .45rem; border: 1px solid #d8e1dd; border-radius: 999px; color: #607169; font-size: .58rem; font-weight: 500; }.insight-card__top small i { width: 6px; height: 6px; border-radius: 50%; background: #8c9d95; }
.insight-card--measurement .insight-card__top > span { border: 1px solid rgba(92,221,164,.2); background: rgba(92,221,164,.1); color: var(--green-bright); }.insight-card--measurement .insight-card__top small { border-color: rgba(255,255,255,.18); color: rgba(255,255,255,.82); }.insight-card--measurement .insight-card__top small i { background: var(--green-bright); }
.insight-card__visual { position: relative; min-height: 128px; margin: 1.5rem 0; }
.insight-card__body h3 { font-size: clamp(1.55rem, 2.4vw, 2.45rem); line-height: 1.03; letter-spacing: -.025em; }.insight-card__body p { max-width: 40rem; margin-top: .85rem; color: #61726a; font-size: var(--description-size); line-height: 1.65; }.insight-card--measurement .insight-card__body h3 { color: white; }.insight-card--measurement .insight-card__body p { max-width: 34rem; color: rgba(255,255,255,.76); }
.insight-card__tags { display: flex; margin-top: 1.35rem; flex-wrap: wrap; gap: .42rem; }.insight-card__tags span { padding: .42rem .58rem; border: 1px solid #d9e2de; border-radius: 999px; background: #f7faf8; color: #52645c; font-size: .56rem; font-weight: 500; }.insight-card--measurement .insight-card__tags span { border-color: rgba(255,255,255,.18); background: rgba(255,255,255,.065); color: rgba(255,255,255,.82); }
.measurement-signal { position: absolute; inset: 0; overflow: hidden; border: 1px solid rgba(92,221,164,.13); border-radius: 19px; background-image: linear-gradient(rgba(92,221,164,.065) 1px, transparent 1px), linear-gradient(90deg, rgba(92,221,164,.065) 1px, transparent 1px); background-size: 44px 44px; }.measurement-signal svg { position: absolute; inset: 8% 4% 16%; width: 92%; height: 76%; overflow: visible; }.measurement-signal path { fill: none; stroke: var(--green-bright); stroke-linecap: round; stroke-width: 2; vector-effect: non-scaling-stroke; }.measurement-signal path.is-soft { opacity: .32; stroke-dasharray: 4 7; }.signal-node { position: absolute; width: 9px; height: 9px; border: 2px solid #15362b; border-radius: 50%; background: var(--green-bright); box-shadow: 0 0 0 6px rgba(92,221,164,.09); transform: translate(-50%, -50%); }.signal-node--one { top: 59.93%; left: 33.72%; }.signal-node--two { top: 55.5%; left: 59.55%; }.signal-node--three { top: 26.37%; left: 82.55%; }.signal-caption { position: absolute; right: 1rem; bottom: .75rem; left: 1rem; display: flex; justify-content: space-between; color: rgba(255,255,255,.62); font-size: .54rem; font-weight: 500; }
.seo-preview { min-height: 100%; padding: 1rem; border: 1px solid #dce4e0; border-radius: 15px; background: #f8faf9; box-shadow: 0 18px 35px -32px rgba(13,35,28,.4); }.seo-preview__bar { display: flex; padding-bottom: .65rem; align-items: center; gap: .28rem; border-bottom: 1px solid #e1e8e4; }.seo-preview__bar i { width: 5px; height: 5px; border-radius: 50%; background: #bcc9c3; }.seo-preview__bar span { width: 42%; height: 5px; margin-left: .35rem; border-radius: 999px; background: #e0e7e3; }.seo-preview > small { display: block; margin-top: .8rem; color: #4f7b67; font-size: .52rem; }.seo-preview > strong { display: block; max-width: 18rem; margin-top: .32rem; color: #214f3a; font-size: var(--aux-title-size); line-height: 1.35; }.seo-preview > p { max-width: 18rem; margin-top: .35rem; color: #7a8982; font-size: var(--description-size); line-height: 1.5; }
.report-preview { display: grid; min-height: 100%; padding: .9rem 1rem; align-content: center; gap: .9rem; border-radius: 15px; background: #e5f2eb; }.report-preview > div { display: grid; grid-template-columns: 4.6rem 1fr; gap: .6rem; align-items: center; }.report-preview span { color: #557067; font-size: .55rem; font-weight: 500; }.report-preview i { display: grid; height: 8px; grid-template-columns: 1fr .65fr .45fr; gap: 3px; }.report-preview i::before, .report-preview i::after, .report-preview b { display: block; border-radius: 999px; background: rgba(7,148,94,.22); content: ''; }.report-preview b { background: var(--green); }

.resources-integrations { padding: clamp(5rem, 9vw, 9rem) 0; overflow: hidden; background: #091713; color: white; }
.resources-integrations .site-label { color: var(--green-bright); }
.integrations-heading { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(280px, .55fr); gap: clamp(2rem, 7vw, 7rem); align-items: end; }
.integrations-heading h2 { max-width: 58rem; margin-top: 1rem; color: white; font-size: clamp(2.7rem, 5vw, 5.4rem); line-height: .94; letter-spacing: -.035em; }
.integrations-heading > p { max-width: 34rem; color: rgba(255,255,255,.62); font-size: var(--description-size); line-height: 1.75; }
.integrations-board { display: grid; margin-top: clamp(3rem, 6vw, 5.5rem); padding: .75rem; grid-template-columns: minmax(280px, .72fr) minmax(0, 1.28fr); gap: .75rem; border-radius: 32px; background: #091713; box-shadow: 0 42px 90px -62px rgba(3, 22, 15, .75); }
.integrations-hub { position: relative; display: flex; overflow: hidden; min-height: 650px; padding: clamp(1.5rem, 3vw, 2.5rem); flex-direction: column; border-radius: 24px; background: radial-gradient(circle at 50% 46%, rgba(92, 221, 164, .18), transparent 30%), #10271f; color: white; isolation: isolate; }
.integrations-hub::before { position: absolute; inset: 0; z-index: -1; background-image: linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px); background-size: 42px 42px; content: ''; mask-image: linear-gradient(to bottom, black, transparent 82%); }
.integrations-hub__identity { display: flex; align-items: center; gap: .85rem; }
.integrations-hub__identity > span { display: grid; width: 48px; height: 48px; flex: 0 0 auto; place-items: center; border: 1px solid rgba(92, 221, 164, .25); border-radius: 14px; background: rgba(92, 221, 164, .1); color: var(--green-bright); }
.integrations-hub__identity div { display: grid; gap: .12rem; }.integrations-hub__identity small { color: rgba(255,255,255,.46); font-size: .6rem; font-weight: 500; }.integrations-hub__identity strong { font-size: var(--aux-title-size); }
.integrations-hub__network { position: relative; width: min(78%, 280px); margin: auto; aspect-ratio: 1; border: 1px solid rgba(92, 221, 164, .18); border-radius: 50%; }
.integrations-hub__network::before, .integrations-hub__network::after { position: absolute; border: 1px solid rgba(92, 221, 164, .12); border-radius: 50%; content: ''; }.integrations-hub__network::before { inset: 14%; }.integrations-hub__network::after { inset: 29%; }
.integrations-hub__network > i { position: absolute; z-index: 2; inset: 50% auto auto 50%; display: grid; width: 72px; height: 72px; place-items: center; border-radius: 22px; background: var(--green); color: white; box-shadow: 0 18px 45px -20px rgba(92,221,164,.9); transform: translate(-50%, -50%); }
.integrations-hub__network > span { position: absolute; z-index: 2; inset: 0; border-radius: 50%; pointer-events: none; animation: integration-dot-orbit var(--orbit-duration) linear infinite; transform: rotate(var(--orbit-start)); }.integrations-hub__network > span::after { position: absolute; top: 0; left: 50%; width: 10px; height: 10px; border: 2px solid #17372c; border-radius: 50%; background: var(--green-bright); box-shadow: 0 0 0 5px rgba(92,221,164,.08); content: ''; transform: translate(-50%, -50%); }.integrations-hub__network > span:nth-child(1) { --orbit-start: -30deg; --orbit-turn: 360deg; --orbit-duration: 38s; }.integrations-hub__network > span:nth-child(2) { --orbit-start: 58deg; --orbit-turn: -360deg; --orbit-duration: 49s; }.integrations-hub__network > span:nth-child(3) { --orbit-start: 135deg; --orbit-turn: 360deg; --orbit-duration: 57s; }.integrations-hub__network > span:nth-child(4) { --orbit-start: 204deg; --orbit-turn: -360deg; --orbit-duration: 43s; }.integrations-hub__network > span:nth-child(5) { --orbit-start: -87deg; --orbit-turn: 360deg; --orbit-duration: 52s; }
.integrations-hub__network:hover > span { animation-play-state: paused; }
@keyframes integration-dot-orbit { from { transform: rotate(var(--orbit-start)); } to { transform: rotate(calc(var(--orbit-start) + var(--orbit-turn))); } }
.integrations-hub > p { max-width: 26rem; color: rgba(255,255,255,.58); font-size: var(--description-size); line-height: 1.7; }
.integration-cards { display: grid; gap: .5rem; }
.integration-card { position: relative; display: grid; min-height: 124px; padding: 1.25rem 1.4rem; grid-template-columns: 52px minmax(0, 1fr) auto; gap: 1.15rem; align-items: center; border: 1px solid rgba(255,255,255,.05); border-radius: 19px; background: #f7faf8; color: var(--ink); }
.integration-card__icon { display: grid; width: 52px; height: 52px; place-items: center; border-radius: 16px; background: #e7efeb; color: #385248; }
.integration-card__content h3 { font-size: var(--aux-title-size); letter-spacing: -.015em; }.integration-card__content p { max-width: 39rem; margin-top: .38rem; color: #60726a; font-size: var(--description-size); line-height: 1.55; }
.integration-card__status { display: inline-flex; min-width: max-content; padding: .58rem .72rem; align-items: center; gap: .5rem; border: 1px solid #d6e0db; border-radius: 999px; background: rgba(255,255,255,.72); color: #53645d; font-size: .61rem; font-weight: 500; }
.integration-card__status i { width: 7px; height: 7px; border-radius: 50%; background: #8a9b94; }
.integration-card--live { border-color: rgba(7,148,94,.2); background: #dcf6e9; }.integration-card--live .integration-card__icon { background: var(--green); color: white; }.integration-card--live .integration-card__status { border-color: rgba(7,148,94,.18); color: #066a46; }.integration-card--live .integration-card__status i { background: var(--green); box-shadow: 0 0 0 4px rgba(7,148,94,.1); }
.integration-card--plan .integration-card__icon { background: #e8efe9; color: #41634f; }.integration-card--setup .integration-card__icon { background: #e8edf2; color: #456078; }.integration-card--custom .integration-card__icon { background: #eeeae2; color: #6e5d43; }.integration-card--future { background: #eef1ef; }.integration-card--future .integration-card__icon { background: #e1e5e3; color: #68756f; }.integration-card--future .integration-card__status { border-style: dashed; }

.resources-migration { background: #f9fbfa; }
.migration-heading { max-width: 58rem; }.migration-heading .site-title { margin-top: 1.2rem; }.migration-heading .site-copy { max-width: 44rem; }
.migration-track { position: relative; display: grid; margin-top: clamp(3.5rem, 6vw, 6rem); grid-template-columns: repeat(4, 1fr); }
.migration-track__line { position: absolute; top: 25px; right: calc(25% - 25px); left: 25px; height: 1px; background: linear-gradient(90deg, var(--green), var(--green-bright)); }
.migration-track article { position: relative; padding-right: clamp(1rem, 3vw, 3rem); }.migration-track article > span { position: relative; z-index: 1; display: grid; width: 50px; height: 50px; place-items: center; border: 1px solid #bfd0c7; border-radius: 50%; background: #f9fbfa; color: var(--green); font-size: .67rem; font-weight: 500; }.migration-track article > svg { margin-top: 2rem; color: var(--green); }.migration-track h3 { margin-top: 1rem; font-size: var(--aux-title-size); }.migration-track p { max-width: 15rem; margin-top: .65rem; color: var(--muted); font-size: var(--description-size); line-height: 1.6; }
.migration-note { display: flex; max-width: 820px; margin-top: clamp(3rem, 5vw, 5rem); padding: 1.2rem 1.4rem; align-items: flex-start; gap: .8rem; border-left: 3px solid var(--green); background: #edf5f1; color: var(--muted); font-size: var(--description-size); line-height: 1.65; }.migration-note svg { flex: 0 0 auto; color: var(--green); }.migration-note strong { color: var(--ink); }
.resources-final { background: radial-gradient(circle at 68% 38%, rgba(92,221,164,.16), transparent 28%), #071713; }

@media (max-width: 1080px) {
  .resources-hero__content { width: min(67vw, 740px); }
  .resources-heading, .integrations-heading { grid-template-columns: 1fr; }
  .integrations-heading { gap: 1.2rem; }
  .operation-editorial__header { grid-template-columns: 1fr; }
  .operation-editorial__lead { max-width: 38rem; margin-top: 1.6rem; }
  .operation-editorial__stage { grid-template-columns: minmax(0, 1fr) minmax(0, .85fr); }
  .operation-feature { grid-template-columns: 42px minmax(0, 1fr); }
  .operation-feature > small { grid-column: 2; justify-self: start; text-align: left; }
  .operation-editorial__image { min-height: 680px; }
  .intelligence-heading__body { grid-template-columns: 1fr; gap: 1.5rem; }
  .intelligence-heading__body > p { max-width: 38rem; }
}

@media (max-width: 900px) {
  .operation-editorial__header h2 { font-size: clamp(3.5rem, 8vw, 5.7rem); }
  .operation-editorial__stage { grid-template-columns: 1fr; }
  .operation-editorial__content { padding: clamp(2rem, 5vw, 4rem); }
  .operation-editorial__image { min-height: 0; height: clamp(450px, 75vw, 680px); }
  .operation-editorial__image img { object-position: center 52%; }
  .agent-flow { grid-template-columns: 1fr 1fr; }
  .agent-flow__question, .agent-flow__context { min-height: 390px; }
  .agent-flow__response { grid-column: 1 / -1; min-height: 310px; }
  .agent-flow__response > p { max-width: 34ch; }
  .insight-grid { grid-template-columns: 1fr; grid-template-rows: auto; }
  .insight-card--measurement { grid-row: auto; min-height: 570px; }
  .insight-card { min-height: 360px; }
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
  .resources-core { padding-block: 5rem; }
  .operation-editorial__label { margin-bottom: 2.25rem; }
  .operation-editorial__header h2 { font-size: clamp(3rem, 11.5vw, 4.7rem); }
  .operation-editorial__lead { margin-top: 1.4rem; }
  .operation-editorial__stage { margin-top: 2.5rem; border-radius: 19px; }
  .operation-editorial__content { padding: 2rem 1.35rem; }
  .operation-editorial__intro h3 { font-size: clamp(2rem, 8vw, 3rem); }
  .operation-features { margin-top: 2.5rem; }
  .operation-feature { gap: .8rem; }
  .operation-editorial__image { height: clamp(390px, 110vw, 580px); }
  .operation-editorial__image figcaption { right: 1.35rem; bottom: 1.35rem; left: 1.35rem; }
  .intelligence-heading__top { align-items: flex-start; flex-direction: column; }
  .intelligence-heading__body { margin-top: 2.5rem; }
  .intelligence-heading h2 { font-size: clamp(3.1rem, 11vw, 5rem); }
  .agent-flow { margin-top: 3rem; grid-template-columns: 1fr; border-radius: 19px; }
  .agent-flow__question, .agent-flow__context, .agent-flow__response { min-height: 0; padding: 1.7rem; }
  .agent-flow__question-body { padding-block: 2.5rem; }
  .agent-flow__question blockquote { font-size: clamp(2.25rem, 8vw, 3.25rem); }
  .agent-flow__context { min-height: 330px; }
  .agent-flow__context-intro { margin-top: 2.5rem; }
  .agent-flow__response { grid-column: 1; min-height: 330px; }
  .agent-flow__response > p { padding-block: 2.5rem; font-size: clamp(1.7rem, 6.5vw, 2.35rem); }
  .agent-flow__disclaimer { padding-inline: 1.7rem; }
  .insight-grid { margin-inline: calc(var(--gutter) * -.35); border-radius: 22px; }
  .insight-card { min-height: 0; padding: 1.25rem; }.insight-card--measurement { min-height: 520px; }.insight-card:not(.insight-card--measurement) { grid-template-columns: 1fr; grid-template-rows: auto auto auto auto; }.insight-card:not(.insight-card--measurement) .insight-card__top, .insight-card:not(.insight-card--measurement) .insight-card__visual, .insight-card:not(.insight-card--measurement) .insight-card__body, .insight-card:not(.insight-card--measurement) .insight-card__tags { grid-row: auto; grid-column: 1; }.insight-card__visual, .insight-card:not(.insight-card--measurement) .insight-card__visual { min-height: 170px; margin-block: 1.35rem; }.insight-card__body h3 { font-size: 1.65rem; }
  .resources-integrations { padding-block: 5rem; }
  .integrations-heading h2 { font-size: clamp(2.6rem, 12vw, 4.1rem); }
  .integrations-board { margin-inline: calc(var(--gutter) * -.35); padding: .5rem; border-radius: 25px; }
  .integrations-hub { min-height: 340px; padding: 1.3rem; border-radius: 19px; }
  .integrations-hub__network { width: min(68%, 210px); }.integrations-hub__network > i { width: 62px; height: 62px; border-radius: 18px; }
  .integration-card { min-height: 0; padding: 1.15rem; grid-template-columns: 46px minmax(0, 1fr); gap: .8rem 1rem; border-radius: 17px; }.integration-card__icon { width: 46px; height: 46px; border-radius: 14px; }.integration-card__status { grid-column: 2; justify-self: start; }
  .migration-track { grid-template-columns: 1fr; }.migration-track article { display: grid; grid-template-columns: 50px 32px 1fr; column-gap: .8rem; align-items: center; }.migration-track article > svg, .migration-track h3 { margin-top: 0; }.migration-track p { max-width: none; margin: .7rem 0 0 82px; grid-column: 1 / -1; }
}

@media (prefers-reduced-motion: reduce) {
  .resources-page *, .resources-page *::before, .resources-page *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
  .resources-hero__photo { transform: none !important; }
  .integrations-hub__network > span { animation: none !important; transform: rotate(var(--orbit-start)); }
}
</style>
