<script setup lang="ts">
import PricingSection from '~/components/home/PricingSection.vue'
import CheckoutModal from '~/components/pricing/CheckoutModal.vue'
import {plans, type Plan} from '~/data/plans'
import {MarketingButton} from '@elinea/ui/marketing'
import {ArrowRight, Check, Minus} from '@lucide/vue'

const pageRoot = ref<HTMLElement | null>(null)
const checkoutOpen = ref(false)
const selectedPlan = ref<Plan | null>(null)
let destroyMotion: (() => void) | undefined

const comparisonRows = [
  {label: 'Catálogo e estoque', plans: ['catalogo', 'whatsapp', 'e-commerce', 'completo', 'personalizado']},
  {label: 'Carrinho e checkout', plans: ['e-commerce', 'completo', 'personalizado']},
  {label: 'Pagamentos online', plans: ['e-commerce', 'completo', 'personalizado']},
  {label: 'Gestão de pedidos', plans: ['whatsapp', 'e-commerce', 'completo', 'personalizado']},
  {label: 'Atendimento pelo WhatsApp', plans: ['whatsapp', 'completo', 'personalizado']},
  {label: 'Automações comerciais', plans: ['whatsapp', 'completo', 'personalizado']},
  {label: 'Relatórios comerciais completos', plans: ['e-commerce', 'completo', 'personalizado']},
  {label: 'Integrações personalizadas', plans: ['personalizado']},
]

const faqs = [
  {
    question: 'Qual é a diferença entre mensalidade e implantação?',
    answer: 'A mensalidade corresponde ao uso recorrente da plataforma. A implantação cobre a preparação inicial indicada para cada plano e aparece separadamente nos cards.',
  },
  {
    question: 'O valor anual possui desconto?',
    answer: 'O seletor anual apresenta o equivalente a doze mensalidades. Nenhum desconto adicional é aplicado ou prometido nesta página.',
  },
  {
    question: 'Posso começar com um plano e evoluir depois?',
    answer: 'Os planos representam diferentes momentos da operação. Para definir a evolução mais adequada entre eles, a equipe Elínea pode avaliar sua estrutura e as necessidades do negócio.',
  },
  {
    question: 'Como funciona o plano Personalizado?',
    answer: 'Esse plano é analisado individualmente e pode envolver implantação, desenvolvimento e mensalidade. O escopo pode incluir integrações, automações e regras comerciais próprias.',
  },
  {
    question: 'O uso do WhatsApp pode gerar custos adicionais?',
    answer: 'Sim. O consumo de mensagens pode possuir franquia ou cobrança adicional, conforme o modelo adotado com o provedor oficial de WhatsApp.',
  },
]

const hasFeature = (row: typeof comparisonRows[number], plan: Plan) => row.plans.includes(plan.slug)
const openCheckout = (plan: Plan) => {
  selectedPlan.value = plan
  checkoutOpen.value = true
}

useSeoMeta({
  title: 'Planos e preços Elínea — Escolha a estrutura do seu negócio',
  description: 'Compare os planos Elínea para catálogo, WhatsApp, ecommerce e uma operação completa. Consulte mensalidades, implantação e recursos incluídos.',
  ogTitle: 'Planos e preços Elínea',
  ogDescription: 'Planos claros para começar com o que o seu negócio precisa e evoluir com estrutura.',
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
          .from('.pricing-hero__eyebrow', {y: 16, opacity: 0, duration: .5}, '-=.2')
          .from('.pricing-hero__title span', {yPercent: 110, duration: .8, stagger: .08}, '-=.15')
          .from('.pricing-hero__copy, .pricing-hero__guide', {
            y: 20,
            opacity: 0,
            duration: .55,
            stagger: .08
          }, '-=.45')

      gsap.utils.toArray<HTMLElement>('[data-pricing-reveal]').forEach((element) => {
        gsap.from(element.children, {
          y: 28,
          opacity: 0,
          duration: .65,
          stagger: .07,
          ease: 'power3.out',
          scrollTrigger: {trigger: element, start: 'top 82%', once: true},
        })
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
  <div ref="pageRoot" class="page-shell pricing-page">
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <SiteHeader/>

    <main id="conteudo">
      <section class="pricing-hero">
        <div class="site-container pricing-hero__layout">
          <div class="pricing-hero__content">
            <p class="pricing-hero__eyebrow">Planos Elínea</p>
            <h1 class="pricing-hero__title"><span><i>Para crescer</i></span><span><i>sem recomeçar.</i></span>
            </h1>
            <p class="pricing-hero__copy">Escolha a estrutura que acompanha o seu momento agora e mantenha espaço para a
              operação evoluir.</p>
          </div>
          <aside class="pricing-hero__guide" aria-label="O que observar ao comparar os planos">
            <p class="pricing-hero__guide-label">Sua escolha, com clareza</p>
            <h2>O que vale olhar<br>em cada plano.</h2>
            <dl>
              <div><dt>Mensalidade</dt><dd>O valor recorrente para usar a plataforma.</dd></div>
              <div><dt>Implantação</dt><dd>A preparação inicial para colocar sua operação no ar.</dd></div>
              <div><dt>Recursos</dt><dd>O que cada estrutura oferece para a sua rotina.</dd></div>
            </dl>
            <a href="#planos">Explorar os planos <ArrowRight :size="18" aria-hidden="true" /></a>
          </aside>
        </div>
      </section>

      <PricingSection :plans="plans" @select="openCheckout"/>

      <section id="comparacao" class="chapter pricing-comparison">
        <div class="site-container">
          <div class="pricing-comparison__heading" data-pricing-reveal>
            <div><p class="site-label">Compare os planos</p>
              <h2 class="site-title">O que cada<br>momento pede.</h2></div>
            <p class="site-copy">Compare os recursos principais de cada plano. Para ver a lista completa, consulte os
              detalhes dos planos acima.</p>
          </div>

          <div class="pricing-comparison__guide">
            <p class="pricing-comparison__scroll-hint">Deslize para ver todos os planos <ArrowRight :size="16" aria-hidden="true"/></p>
            <div class="pricing-comparison__legend" aria-label="Legenda da comparação">
              <span><span class="pricing-table__status pricing-table__status--included"><Check :size="15" aria-hidden="true"/></span>Incluído</span>
              <span><span class="pricing-table__status pricing-table__status--absent"><Minus :size="15" aria-hidden="true"/></span>Não incluído</span>
            </div>
          </div>

          <div class="pricing-table-wrap" role="region" tabindex="0"
               aria-label="Comparação dos recursos dos planos; deslize horizontalmente em telas menores">
            <table class="pricing-table">
              <caption class="sr-only">Recursos principais incluídos em cada plano Elínea</caption>
              <thead>
              <tr>
                <th scope="col">Recurso</th>
                <th v-for="plan in plans" :key="plan.id" scope="col" :class="{ featured: plan.featured }">
                  <span class="pricing-table__plan-name">{{ plan.name }}</span>
                  <span v-if="plan.featured" class="pricing-table__featured-label">Em destaque</span>
                </th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="row in comparisonRows" :key="row.label">
                <th scope="row">{{ row.label }}</th>
                <td v-for="plan in plans" :key="plan.id" :class="{ featured: plan.featured }">
                  <span class="pricing-table__status" :class="hasFeature(row, plan) ? 'pricing-table__status--included' : 'pricing-table__status--absent'">
                    <span class="sr-only">{{ hasFeature(row, plan) ? 'Incluído' : 'Não incluído' }}</span>
                    <Check v-if="hasFeature(row, plan)" :size="17" aria-hidden="true"/>
                    <Minus v-else :size="17" aria-hidden="true"/>
                  </span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section class="chapter chapter--dark pricing-value">
        <div class="site-container pricing-value__layout">
          <div class="pricing-value__intro" data-pricing-reveal>
            <p class="site-label">Clareza desde a escolha</p>
            <h2 class="site-title">Preço claro.<br>Estrutura de verdade.</h2>
            <p class="site-copy">Cada parte do investimento aparece no lugar certo para você entender o que entra agora
              e o que acompanha a operação.</p>
          </div>
          <div class="pricing-value__breakdown" data-pricing-reveal>
            <article>
              <h3>Mensalidade</h3>
              <p>O valor recorrente da plataforma é apresentado em cada plano, com visualização mensal ou anual.</p>
            </article>
            <article>
              <h3>Implantação</h3>
              <p>A preparação inicial aparece separada da mensalidade, inclusive quando a implantação é gratuita.</p>
            </article>
            <article>
              <h3>Evolução</h3>
              <p>Quando a operação exige regras próprias, o plano Personalizado é analisado de acordo com o escopo.</p>
            </article>
          </div>
        </div>
      </section>

      <section class="chapter pricing-faq">
        <div class="site-container pricing-faq__layout">
          <div class="pricing-faq__intro" data-pricing-reveal><p class="site-label">Antes de começar</p>
            <h2 class="site-title">Perguntas<br>frequentes.</h2>
            <p class="site-copy">Informações essenciais sobre valores, contratação e evolução dos planos.</p></div>
          <div class="pricing-faq__list">
            <details v-for="(item, index) in faqs" :key="item.question">
              <summary><span>0{{ index + 1 }}</span><strong>{{ item.question }}</strong><i aria-hidden="true"></i>
              </summary>
              <p>{{ item.answer }}</p>
            </details>
          </div>
        </div>
      </section>

      <section class="chapter final-cta pricing-final">
        <div class="site-container final-cta__inner" data-pricing-reveal>
          <p class="site-label">O próximo passo pode ser simples</p>
          <h2 class="site-title">Escolha seu plano.<br>Coloque a operação<br>em movimento.</h2>
          <p>Comece com a estrutura certa para hoje e evolua quando o seu negócio pedir.</p>
          <div>
            <MarketingButton variant="primary" href="#planos">Conhecer os planos
              <template #icon>
                <ArrowRight :size="18"/>
              </template>
            </MarketingButton>
            <a href="mailto:contato@elinea.com.br">Falar com especialista</a></div>
        </div>
      </section>
    </main>

    <SiteFooter/>
    <CheckoutModal v-model:open="checkoutOpen" :plan="selectedPlan"/>
  </div>
</template>

<style scoped>
.pricing-page {
  overflow: clip;
}

.pricing-hero {
  display: flex;
  min-height: 78svh;
  padding-block: clamp(9rem, 17vh, 12rem) clamp(5rem, 9vh, 7rem);
  background: #08764e;
  color: white;
}

.pricing-hero__layout {
  display: grid;
  width: min(100% - (var(--gutter) * 2), 1440px);
  grid-template-columns: minmax(0, 1.15fr) minmax(350px, .85fr);
  gap: clamp(3rem, 7vw, 8rem);
  align-items: center;
}

.pricing-hero__content {
  min-width: 0;
}

.pricing-hero__eyebrow {
  color: #d2f2df;
  font-size: .86rem;
  font-weight: 600;
}

.pricing-hero__title {
  margin-top: clamp(2rem, 4vw, 3.5rem);
  color: white;
  font-size: clamp(4.25rem, 6.4vw, 7.3rem);
  font-weight: 700;
  line-height: .96;
  letter-spacing: -.06em;
}

.pricing-hero__title span {
  display: block;
  overflow: hidden;
  padding-bottom: .08em;
}

.pricing-hero__title i {
  display: block;
  font-style: normal;
}

.pricing-hero__copy {
  max-width: 34rem;
  margin-top: clamp(2rem, 5vw, 4rem);
  color: #e0f4e9;
  font-size: clamp(1rem, 1.2vw, 1.2rem);
  line-height: 1.65;
}

.pricing-hero__guide {
  min-width: 0;
  padding: clamp(2rem, 3.2vw, 3.4rem);
  background: #f8fcf8;
  color: var(--ink);
}

.pricing-hero__guide-label { color: #287350; font-size: .8rem; font-weight: 600; }
.pricing-hero__guide h2 { margin-top: 1.5rem; color: var(--ink); font-size: clamp(2.15rem, 2.75vw, 3.25rem); font-weight: 700; line-height: 1.06; letter-spacing: -.05em; }
.pricing-hero__guide dl { margin: clamp(2rem, 4vw, 3.25rem) 0 0; }
.pricing-hero__guide dl > div { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); gap: 1rem; padding-block: 1.05rem; border-top: 1px solid #d4e5da; }
.pricing-hero__guide dt { color: #135f3e; font-size: .94rem; font-weight: 700; }
.pricing-hero__guide dd { margin: 0; color: #52675a; font-size: .88rem; line-height: 1.55; }
.pricing-hero__guide a { display: inline-flex; min-height: 48px; margin-top: 1.2rem; align-items: center; gap: .65rem; color: #075c3b; font-size: .9rem; font-weight: 700; }
.pricing-hero__guide a svg { transition: transform .2s ease; }
.pricing-hero__guide a:hover svg, .pricing-hero__guide a:focus-visible svg { transform: translateX(4px); }

@media (prefers-reduced-motion: reduce) {
  .pricing-hero__guide a svg { transition: none; }
}

.pricing-comparison {
  background: var(--paper);
}

.pricing-comparison__heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(17rem, .48fr);
  gap: clamp(2rem, 6vw, 7rem);
  align-items: end;
}

.pricing-comparison__heading .site-copy {
  max-width: 25rem;
  margin: 0 0 .6rem;
}

.pricing-comparison__guide {
  display: flex;
  justify-content: flex-end;
  margin-top: clamp(3.5rem, 6vw, 6rem);
  margin-bottom: 1rem;
}

.pricing-comparison__scroll-hint {
  display: none;
  align-items: center;
  gap: .5rem;
  color: var(--muted);
  font-size: .8rem;
  font-weight: 500;
}

.pricing-comparison__legend {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: var(--muted);
  font-size: .78rem;
  font-weight: 500;
}

.pricing-comparison__legend > span {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
}

.pricing-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--line);
  border-radius: 1.1rem;
  background: white;
  overscroll-behavior-inline: contain;
}

.pricing-table {
  width: 100%;
  min-width: 1010px;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  color: var(--ink);
}

.pricing-table th, .pricing-table td {
  height: 76px;
  padding: 1rem;
  border-bottom: 1px solid var(--line);
  text-align: center;
}

.pricing-table thead th {
  height: 104px;
  background: #f3f7f4;
  color: var(--ink);
  font-size: .85rem;
  font-weight: 500;
}

.pricing-table thead th:first-child, .pricing-table tbody th {
  position: sticky;
  left: 0;
  z-index: 2;
  width: 26%;
  padding-left: clamp(1.25rem, 2vw, 2rem);
  text-align: left;
  box-shadow: inset -1px 0 0 var(--line);
}

.pricing-table thead th:first-child {
  z-index: 3;
  color: var(--muted);
  font-size: .8rem;
}

.pricing-table tbody th {
  background: white;
  font-size: .9rem;
  font-weight: 500;
  line-height: 1.45;
}

.pricing-table__plan-name {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(1rem, 1.3vw, 1.2rem);
  font-weight: 600;
  letter-spacing: -.02em;
}

.pricing-table__featured-label {
  display: inline-block;
  margin-top: .4rem;
  color: #046b45;
  font-size: .67rem;
  font-weight: 500;
}

.pricing-table__status {
  display: inline-grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: 50%;
  vertical-align: middle;
}

.pricing-table__status--included {
  background: var(--green-light);
  color: #046b45;
}

.pricing-table__status--absent {
  background: #f0f3f1;
  color: #687771;
}

.pricing-table .featured {
  background: #eef8f2;
}

.pricing-table thead .featured {
  box-shadow: inset 0 3px 0 var(--green);
}

.pricing-table tr:last-child th, .pricing-table tr:last-child td {
  border-bottom: 0;
}

.pricing-value {
  background: linear-gradient(90deg, #05462f 0%, #07945e 50%, #055c3c 100%);
}

.pricing-value__layout {
  display: grid;
  grid-template-columns: minmax(0, .92fr) minmax(0, 1.08fr);
  gap: clamp(4rem, 8vw, 9rem);
  align-items: center;
}

.pricing-value__intro {
  max-width: 39rem;
}

.pricing-value__intro .site-label {
  color: var(--green-bright);
}

.pricing-value__intro .site-title {
  font-size: clamp(3.4rem, 5.5vw, 6rem);
}

.pricing-value__intro .site-copy {
  max-width: 30rem;
  margin-top: clamp(2rem, 4vw, 3.5rem);
  color: rgba(255, 255, 255, .9);
}

.pricing-value__breakdown {
  border-top: 1px solid rgba(255, 255, 255, .22);
}

.pricing-value__breakdown article {
  display: grid;
  grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr);
  gap: clamp(1.5rem, 3vw, 3rem);
  align-items: baseline;
  padding: clamp(2rem, 3.6vw, 3.5rem) 0;
  border-bottom: 1px solid rgba(255, 255, 255, .22);
}

.pricing-value__breakdown h3 {
  color: white;
  font-size: clamp(1.55rem, 2.15vw, 2.35rem);
  font-weight: 600;
  letter-spacing: -.03em;
}

.pricing-value__breakdown p {
  max-width: 25rem;
  color: rgba(255, 255, 255, .9);
  font-size: var(--description-size);
  line-height: 1.7;
}

.pricing-faq {
  background: #f3f7f4;
  overflow: visible;
}

.pricing-faq__layout {
  display: grid;
  grid-template-columns: .75fr 1.25fr;
  gap: clamp(4rem, 9vw, 9rem);
  align-items: start;
}

.pricing-faq__intro {
  position: sticky;
  top: 9rem;
}

.pricing-faq__list {
  border-top: 1px solid var(--line);
}

.pricing-faq details {
  border-bottom: 1px solid var(--line);
}

.pricing-faq summary {
  display: grid;
  min-height: 116px;
  padding: 1.5rem 0;
  grid-template-columns: 3rem 1fr 24px;
  gap: 1rem;
  align-items: center;
  cursor: pointer;
  list-style: none;
}

.pricing-faq summary::-webkit-details-marker {
  display: none;
}

.pricing-faq summary span {
  color: #99a7a1;
  font-size: .67rem;
  font-weight: 500;
}

.pricing-faq summary strong {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(1.05rem, 1.5vw, 1.35rem);
  font-weight: 600;
  letter-spacing: -.01em;
}

.pricing-faq summary i {
  position: relative;
  width: 20px;
  height: 20px;
}

.pricing-faq summary i::before, .pricing-faq summary i::after {
  position: absolute;
  top: 9px;
  left: 2px;
  width: 16px;
  height: 1px;
  background: var(--green);
  content: '';
  transition: transform .25s;
}

.pricing-faq summary i::after {
  transform: rotate(90deg);
}

.pricing-faq details[open] summary i::after {
  transform: rotate(0);
}

.pricing-faq details > p {
  max-width: 44rem;
  padding: 0 3rem 2rem 4rem;
  color: var(--muted);
  font-size: var(--description-size);
  line-height: 1.72;
}

.pricing-final {
  min-height: 100svh;
}

.pricing-final .site-title {
  font-size: clamp(3.7rem, 8vw, 8rem);
}

@media (max-width: 1080px) {
  .pricing-hero__layout {
    grid-template-columns: minmax(0, 1fr) minmax(320px, .85fr);
    gap: 3rem;
  }

  .pricing-hero__title {
    font-size: clamp(3.5rem, 6vw, 5.5rem);
  }

  .pricing-comparison__heading {
    grid-template-columns: 1fr .75fr;
  }

  .pricing-comparison__scroll-hint {
    display: inline-flex;
  }

  .pricing-comparison__guide {
    justify-content: space-between;
    gap: 1rem;
  }

  .pricing-value__layout {
    gap: clamp(2.5rem, 5vw, 4rem);
  }

  .pricing-value__breakdown article {
    grid-template-columns: 1fr;
    gap: .8rem;
  }

  .pricing-faq__layout {
    grid-template-columns: .8fr 1.2fr;
    gap: 4rem;
  }
}

@media (max-width: 900px) {
  .pricing-hero__layout { grid-template-columns: 1fr; }
  .pricing-hero__guide { width: min(100%, 720px); }

  .pricing-value {
    background: linear-gradient(180deg, #05462f 0%, #07945e 46%, #055c3c 100%);
  }

  .pricing-comparison__heading, .pricing-faq__layout {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .pricing-comparison__heading .site-copy {
    margin-top: 1rem;
  }

  .pricing-value__layout {
    grid-template-columns: 1fr;
    gap: clamp(3.5rem, 8vw, 5rem);
  }

  .pricing-faq__intro {
    position: static;
    max-width: 720px;
    margin-bottom: 3rem;
  }
}

@media (max-width: 767px) {
  .pricing-hero { min-height: 0; padding-block: 8.5rem 4.5rem; }
  .pricing-hero__layout { gap: 3.25rem; }

  .pricing-hero__title {
    font-size: clamp(3.35rem, 12vw, 5rem);
  }

  .pricing-hero__guide dl > div { grid-template-columns: 1fr; gap: .4rem; }

  .pricing-table-wrap {
    margin-right: calc(var(--gutter) * -1);
    border-right: 0;
    border-radius: 1rem 0 0 1rem;
  }

  .pricing-comparison__guide {
    align-items: flex-start;
    flex-direction: column;
    gap: 1.1rem;
    margin-top: 3rem;
  }

  .pricing-table thead th:first-child, .pricing-table tbody th {
    width: 188px;
    padding-left: 1.1rem;
  }

  .pricing-table th, .pricing-table td {
    padding-right: .75rem;
    padding-left: .75rem;
  }

  .pricing-value__breakdown article {
    padding: 1.65rem 0;
  }

  .pricing-faq summary {
    min-height: 100px;
    grid-template-columns: 2rem 1fr 20px;
    gap: .65rem;
  }

  .pricing-faq details > p {
    padding: 0 0 1.7rem 2.65rem;
  }
}

</style>
