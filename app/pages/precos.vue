<script setup lang="ts">
import pricingHeroUrl from '~/assets/images/elinea-pricing-hero-natural.webp'
import PricingSection from '~/components/home/PricingSection.vue'
import CheckoutModal from '~/components/pricing/CheckoutModal.vue'
import {plans, type Plan} from '~/data/plans'
import {MarketingButton, MarketingTextButton} from '@elinea/ui/marketing'
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
          .from('.pricing-hero__copy, .pricing-hero__actions', {
            y: 20,
            opacity: 0,
            duration: .55,
            stagger: .08
          }, '-=.45')
          .from('.pricing-hero__photo', {opacity: 0, scale: 1.035, duration: 1.2}, '-=1.15')

      gsap.to('.pricing-hero__photo', {
        yPercent: 4,
        scale: 1.04,
        ease: 'none',
        scrollTrigger: {trigger: '.pricing-hero', start: 'top top', end: 'bottom top', scrub: true},
      })

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
        <img class="pricing-hero__photo" :src="pricingHeroUrl" alt="Comerciante analisando sua operação no notebook"
             fetchpriority="high">
        <div class="pricing-hero__overlay"></div>
        <div class="site-container pricing-hero__layout">
          <div class="pricing-hero__content">
            <p class="pricing-hero__eyebrow"><span></span>Planos Elínea</p>
            <h1 class="pricing-hero__title"><span><i>Para crescer</i></span><span><i>sem recomeçar.</i></span>
            </h1>
            <p class="pricing-hero__copy">Escolha a estrutura que acompanha o seu momento agora e mantenha espaço para a
              operação evoluir.</p>
          </div>
        </div>
      </section>

      <PricingSection :plans="plans" @select="openCheckout"/>

      <section id="comparacao" class="chapter pricing-comparison">
        <div class="site-container">
          <div class="pricing-comparison__heading" data-pricing-reveal>
            <div><p class="site-label">Compare os planos</p>
              <h2 class="site-title">O que cada<br>momento pede.</h2></div>
            <p class="site-copy">Uma leitura direta dos recursos centrais. Abra os detalhes de cada plano acima para
              consultar a lista completa.</p>
          </div>

          <div class="pricing-table-wrap" tabindex="0"
               aria-label="Tabela comparativa de planos; deslize horizontalmente em telas menores">
            <table class="pricing-table">
              <thead>
              <tr>
                <th scope="col">Recurso</th>
                <th v-for="plan in plans" :key="plan.id" scope="col" :class="{ featured: plan.featured }">{{
                    plan.name
                  }}
                </th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="row in comparisonRows" :key="row.label">
                <th scope="row">{{ row.label }}</th>
                <td v-for="plan in plans" :key="plan.id" :class="{ featured: plan.featured }">
                  <span class="sr-only">{{ hasFeature(row, plan) ? 'Incluído' : 'Não incluído' }}</span>
                  <Check v-if="hasFeature(row, plan)" class="is-included" :size="19" aria-hidden="true"/>
                  <Minus v-else :size="17" aria-hidden="true"/>
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
  position: relative;
  min-height: 50svh;
  overflow: hidden;
  background: #071310;
  color: white;
  isolation: isolate;
  padding-top: 50px;
  padding-bottom: 60px;
}

.pricing-hero__photo {
  position: absolute;
  z-index: -2;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  will-change: transform;
}

.pricing-hero__overlay {
  position: absolute;
  z-index: -1;
  inset: 0;
  background: linear-gradient(90deg, rgba(4, 17, 14, .96) 0%, rgba(5, 22, 17, .84) 37%, rgba(4, 17, 14, .31) 64%, rgba(3, 10, 9, .08) 100%);
}

.pricing-hero__layout {
  display: flex;
  min-height: calc(50svh - 5rem);
  align-items: center;
  padding-top: 5rem;
}

.pricing-hero__content {
  min-width: 0;
  width: min(55vw, 800px);
}

.pricing-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: .65rem;
  color: rgba(255, 255, 255, .66);
  font-size: .8rem;
  font-weight: 700;
}

.pricing-hero__eyebrow span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--green-bright);
  box-shadow: 0 0 16px rgba(92, 221, 164, .55);
}

.pricing-hero__title {
  margin-top: 1.75rem;
  color: white;
  font-size: clamp(3.7rem, 5.7vw, 6.5rem);
  font-weight: 600;
  line-height: .93;
  letter-spacing: -.04em;
}

.pricing-hero__title span {
  display: block;
  overflow: hidden;
  padding-bottom: .07em;
}

.pricing-hero__title i {
  display: block;
  font-style: normal;
}

.pricing-hero__copy {
  max-width: 42rem;
  margin-top: 1.8rem;
  color: rgba(255, 255, 255, .63);
  font-size: clamp(1rem, 1.2vw, 1.2rem);
  line-height: 1.7;
}

.pricing-hero__actions {
  display: flex;
  margin-top: 2.25rem;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
}

.pricing-hero__marquee {
  display: flex;
  min-height: 5rem;
  align-items: center;
  justify-content: center;
  gap: clamp(1rem, 3vw, 3.5rem);
  border-top: 1px solid rgba(255, 255, 255, .08);
  color: rgba(255, 255, 255, .34);
  font-size: clamp(.72rem, 1vw, .9rem);
  font-weight: 650;
  letter-spacing: .03em;
}

.pricing-hero__marquee i {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--green);
}

.pricing-comparison {
  background: #fbfcfb;
}

.pricing-comparison__heading {
  display: grid;
  grid-template-columns: 1.05fr .55fr;
  gap: 4rem;
  align-items: end;
}

.pricing-comparison__heading .site-copy {
  margin-bottom: .7rem;
}

.pricing-table-wrap {
  margin-top: clamp(3.5rem, 7vw, 6.5rem);
  overflow-x: auto;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  overscroll-behavior-inline: contain;
}

.pricing-table {
  width: 100%;
  min-width: 960px;
  border-collapse: collapse;
  color: var(--ink);
}

.pricing-table th, .pricing-table td {
  height: 72px;
  padding: 0 1rem;
  border-bottom: 1px solid var(--line);
  text-align: center;
}

.pricing-table thead th {
  height: 82px;
  color: var(--muted);
  font-size: .74rem;
  font-weight: 800;
}

.pricing-table thead th:first-child, .pricing-table tbody th {
  width: 28%;
  padding-left: 0;
  text-align: left;
}

.pricing-table tbody th {
  font-size: .82rem;
  font-weight: 650;
}

.pricing-table td svg {
  margin-inline: auto;
  color: #a9b4b0;
}

.pricing-table td svg.is-included {
  color: var(--green);
}

.pricing-table .featured {
  background: rgba(7, 148, 94, .045);
}

.pricing-table thead .featured {
  color: var(--green);
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
  font-weight: 500;
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
  font-weight: 800;
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
  .pricing-hero__content {
    width: min(62vw, 780px);
  }

  .pricing-comparison__heading {
    grid-template-columns: 1fr .75fr;
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
  .pricing-value {
    background: linear-gradient(180deg, #05462f 0%, #07945e 46%, #055c3c 100%);
  }

  .pricing-comparison__heading, .pricing-faq__layout {
    grid-template-columns: 1fr;
    gap: 1rem;
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
  .pricing-hero__photo {
    object-position: 66% center;
  }

  .pricing-hero__overlay {
    background: linear-gradient(180deg, rgba(4, 17, 14, .91) 0%, rgba(4, 17, 14, .77) 57%, rgba(4, 17, 14, .57) 100%);
  }

  .pricing-hero__layout {
    min-height: max(380px, calc(50svh - 5rem));
    align-items: flex-start;
    padding-top: clamp(9.5rem, 23vh, 12rem);
    padding-bottom: 6rem;
  }

  .pricing-hero__content {
    width: 100%;
  }

  .pricing-hero__title {
    font-size: clamp(3.35rem, 14.5vw, 5rem);
  }

  .pricing-hero__actions {
    align-items: flex-start;
    flex-direction: column;
  }

  .pricing-hero__marquee {
    padding: 1.25rem;
    justify-content: flex-start;
    overflow: hidden;
    white-space: nowrap;
  }

  .pricing-hero__marquee span:last-child, .pricing-hero__marquee i:last-of-type {
    display: none;
  }

  .pricing-table-wrap {
    margin-right: calc(var(--gutter) * -1);
    padding-right: var(--gutter);
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

@media (prefers-reduced-motion: reduce) {
  .pricing-hero__photo {
    transform: none !important;
  }
}
</style>
