<script setup lang="ts">
import heroStudioUrl from '~/assets/images/h3-slider-img-1.webp'
import logoOfficialUrl from '~/assets/images/elinea-logo.svg'
import logoWhiteUrl from '~/assets/images/elinea-logo-white.svg'
import {MarketingButton, MarketingLogoCarousel, MarketingSocialRail} from '@elinea/ui/marketing'
import {
  ArrowLeft, ArrowRight, BarChart3, Bell, Bot, Boxes, Building2, Check, CheckCircle2, ChevronDown,
  CreditCard, LayoutTemplate, Mail, Menu, MessageCircle, Package,
  PackageCheck, Pill, Search, ServerCog, ShoppingBag, Store, Tag, Unplug, Wrench, X
} from '@lucide/vue'

type Plan = {
  id: number
  name: string
  slug: string
  description: string
  monthly_amount: number | null
  implementation_amount: number | null
  implementation_label: string
  features: string[]
  features_label?: string
  note?: string
  tone: 'neutral' | 'mint' | 'blue' | 'dark' | 'violet'
  featured?: boolean
}
type CheckoutResponse = { data: { public_id: string }, checkout_url: string }
type FormKey = 'owner_name' | 'owner_email' | 'segment' | 'store_name'

const config = useRuntimeConfig()
const pageRoot = ref<HTMLElement | null>(null)
const plansCarousel = ref<HTMLElement | null>(null)
const canScrollPlansBack = ref(false)
const canScrollPlansForward = ref(true)
const expandedPlanIds = ref<number[]>([])
const billingCycle = ref<'monthly' | 'annual'>('monthly')
const checkoutOpen = ref(false)
const selectedPlan = ref<Plan | null>(null)
const submitting = ref(false)
const submitError = ref('')
const mobileMenuOpen = ref(false)
const headerScrolled = ref(false)
const activeJourney = ref(0)
const activeSegment = ref(0)
const form = reactive({owner_name: '', owner_email: '', phone: '', store_name: '', segment: ''})
const formErrors = reactive<Partial<Record<FormKey, string>>>({})

const journeySteps = [
  {
    icon: Store,
    label: 'Loja virtual',
    title: 'O cliente encontra o produto certo.',
    description: 'Uma vitrine rápida, responsiva e com a identidade do seu negócio.'
  },
  {
    icon: CreditCard,
    label: 'Pagamento',
    title: 'A compra acontece sem atrito.',
    description: 'Checkout direto, com Pix, boleto e cartão em uma jornada segura.'
  },
  {
    icon: PackageCheck,
    label: 'Gestão',
    title: 'O pedido já chega organizado.',
    description: 'Pagamento, estoque e cliente atualizados no mesmo painel.'
  },
  {
    icon: MessageCircle,
    label: 'Relacionamento',
    title: 'A conversa continua no WhatsApp.',
    description: 'Confirmações, recuperação de carrinho e novas oportunidades de venda.'
  }
]

const selectJourneyStep = (index: number) => {
  activeJourney.value = index
}

const handleJourneyKeydown = async (event: KeyboardEvent, index: number) => {
  let nextIndex = index
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % journeySteps.length
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + journeySteps.length) % journeySteps.length
  else if (event.key === 'Home') nextIndex = 0
  else if (event.key === 'End') nextIndex = journeySteps.length - 1
  else return

  event.preventDefault()
  selectJourneyStep(nextIndex)
  await nextTick()
  document.getElementById(`journey-tab-${nextIndex}`)?.focus()
}

const segments = [
  {
    icon: Pill,
    label: 'Farmácias de manipulação',
    title: 'Uma experiência à altura do cuidado da sua farmácia.',
    description: 'Apresente seu catálogo com clareza e transforme a procura do cliente em uma jornada de compra direta, profissional e bem acompanhada.',
    emphasis: 'Catálogo especializado',
    highlights: ['Produtos organizados', 'Compra direta', 'Atendimento conectado']
  },
  {
    icon: Store,
    label: 'Lojas especializadas',
    title: 'Seu nicho ganha uma vitrine com identidade própria.',
    description: 'Organize produtos, destaque o que torna sua curadoria diferente e ofereça uma compra simples sem perder a personalidade do negócio.',
    emphasis: 'Vitrine de nicho',
    highlights: ['Curadoria em destaque', 'Promoções', 'Checkout integrado']
  },
  {
    icon: Building2,
    label: 'Pequenos varejistas',
    title: 'Uma estrutura digital que não pesa na rotina.',
    description: 'Comece com o essencial para vender online e mantenha catálogo, pagamentos e pedidos reunidos enquanto a operação evolui.',
    emphasis: 'Operação organizada',
    highlights: ['Loja online', 'Pagamentos', 'Gestão de pedidos']
  },
  {
    icon: LayoutTemplate,
    label: 'Marcas próprias',
    title: 'Sua marca conduz a experiência do começo ao fim.',
    description: 'Construa presença digital em um espaço próprio, apresente seus produtos com consistência e reduza a dependência de marketplaces.',
    emphasis: 'Marca em primeiro plano',
    highlights: ['Identidade própria', 'Domínio próprio', 'Venda direta']
  }
]

const selectedSegment = computed(() => segments[activeSegment.value]!)

const selectSegment = (index: number) => {
  activeSegment.value = index
}

const handleSegmentKeydown = async (event: KeyboardEvent, index: number) => {
  let nextIndex = index
  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (index + 1) % segments.length
  else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (index - 1 + segments.length) % segments.length
  else if (event.key === 'Home') nextIndex = 0
  else if (event.key === 'End') nextIndex = segments.length - 1
  else return

  event.preventDefault()
  selectSegment(nextIndex)
  await nextTick()
  document.getElementById(`segment-tab-${nextIndex}`)?.focus()
}

const brandLogos = [
  {name: 'PharmaVida'},
  {name: 'NUTRIMAX'},
  {name: 'essência'},
  {name: 'FórmulaCerta'},
  {name: 'BioAtiva'},
  {name: 'DermaPlus'},
]

const ecosystemModules = [
  {icon: Store, title: 'Loja virtual', detail: 'Sua marca no ar', tone: 'emerald'},
  {icon: Package, title: 'Catálogo', detail: 'Produtos organizados', tone: 'blue'},
  {icon: CreditCard, title: 'Pagamentos', detail: 'Pix, boleto e cartão', tone: 'amber'},
  {icon: ShoppingBag, title: 'Pedidos', detail: 'Operação centralizada', tone: 'amber'},
  {icon: Tag, title: 'Promoções', detail: 'Cupons e campanhas', tone: 'violet'},
  {icon: BarChart3, title: 'Relatórios', detail: 'Decisões com contexto', tone: 'blue'},
  {icon: Bot, title: 'Automações', detail: 'Fluxos que trabalham', tone: 'violet'},
  {icon: MessageCircle, title: 'WhatsApp', detail: 'Venda e relacionamento', tone: 'emerald'}
]

const manualOperationItems = [
  {icon: ServerCog, label: 'Hospedagem e manutenção'},
  {icon: Unplug, label: 'Integrações manuais'},
  {icon: Boxes, label: 'Fornecedores separados'},
  {icon: Wrench, label: 'Atualizações e correções'}
]

const connectedOperationItems = [
  'Estrutura pronta para vender',
  'Recursos trabalhando juntos',
  'Uma operação centralizada',
  'Evolução contínua da plataforma'
]

const plans: Plan[] = [
  {
    id: 1,
    name: 'Catálogo',
    slug: 'catalogo',
    description: 'Indicado para negócios que querem apresentar seus produtos online com organização, domínio próprio e contato direto, sem checkout dentro do site.',
    monthly_amount: 9900,
    implementation_amount: 49000,
    implementation_label: 'R$ 490',
    features: ['Catálogo de produtos', 'Categorias e marcas', 'Variações e imagens', 'Controle de estoque', 'Painel administrativo', 'Domínio próprio', 'SSL', 'Botão de contato pelo WhatsApp', 'Relatórios básicos', 'Suporte'],
    tone: 'neutral'
  },
  {
    id: 2,
    name: 'WhatsApp',
    slug: 'whatsapp',
    description: 'Indicado para negócios que vendem pelo WhatsApp e querem transformar o atendimento manual em uma operação estruturada, automatizada e mensurável.',
    monthly_amount: 24900,
    implementation_amount: 0,
    implementation_label: 'Grátis',
    features: ['Catálogo de produtos', 'Controle de estoque', 'Gestão de contatos', 'Central de conversas', 'Atendimento pelo WhatsApp', 'Chatbot de vendas', 'Automações comerciais', 'Histórico de mensagens', 'Gestão de pedidos', 'Acompanhamento de vendas', 'Relatórios básicos', 'Campanhas pelo WhatsApp', 'Suporte'],
    note: 'O consumo de mensagens poderá possuir franquia ou cobrança adicional conforme o modelo adotado com o provedor oficial de WhatsApp.',
    tone: 'mint'
  },
  {
    id: 3,
    name: 'E-commerce',
    slug: 'e-commerce',
    description: 'Indicado para empresas que querem uma loja virtual completa, com uma jornada de compra online que reúne carrinho, checkout, pagamentos e pedidos.',
    monthly_amount: 24900,
    implementation_amount: 79000,
    implementation_label: 'R$ 790',
    features: ['Tudo do plano Catálogo', 'Carrinho de compras', 'Checkout', 'Gestão de pedidos', 'Pagamento online', 'Integração com gateways', 'Pix e cartão', 'Cálculo de frete', 'Cupons', 'Promoções', 'Avaliações de produtos', 'Lista de desejos', 'Newsletter', 'Campanhas por e-mail', 'E-mails transacionais', 'Relatórios comerciais completos', 'Integrações com serviços externos', 'Suporte'],
    tone: 'blue',
    featured: true
  },
  {
    id: 4,
    name: 'Completo',
    slug: 'completo',
    description: 'Indicado para negócios que querem integrar e-commerce, atendimento, vendas e automações pelo WhatsApp em uma operação única, organizada e segura.',
    monthly_amount: 39900,
    implementation_amount: 99000,
    implementation_label: 'R$ 990',
    features: ['Tudo do plano E-commerce', 'Central de atendimento pelo WhatsApp', 'Gestão de contatos e conversas', 'Chatbot de vendas', 'Automações pelo WhatsApp', 'Automação baseada em eventos de pedidos', 'Recuperação de oportunidades', 'Recuperação de carrinho abandonado', 'Mensagens automáticas de pedidos', 'Campanhas pelo WhatsApp', 'Histórico das conversas', 'Integração entre atendimento e pedidos', 'Relatórios completos', 'Suporte'],
    note: 'O consumo de mensagens poderá possuir franquia ou cobrança adicional conforme o modelo adotado com o provedor oficial de WhatsApp.',
    tone: 'dark'
  },
  {
    id: 5,
    name: 'Personalizado',
    slug: 'personalizado',
    description: 'Indicado para empresas com regras próprias, que precisam adaptar a Elínea com integrações, automações e recursos desenvolvidos para sua operação.',
    monthly_amount: null,
    implementation_amount: null,
    implementation_label: 'Sob consulta',
    features_label: 'Pode incluir',
    features: ['Recursos do plano Completo', 'Layout exclusivo', 'Integrações personalizadas', 'Integração com ERP', 'Gateways específicos', 'Regras comerciais próprias', 'Funcionalidades sob demanda', 'Automações personalizadas', 'Relatórios personalizados', 'Acompanhamento técnico', 'Suporte prioritário'],
    note: 'O projeto é analisado individualmente e pode envolver cobrança de implantação, desenvolvimento e mensalidade.',
    tone: 'violet'
  }
]

const money = (value: number | string) => new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL', maximumFractionDigits: 0
}).format(Number(value) / 100)

const scrollPlans = (direction: -1 | 1) => {
  const carousel = plansCarousel.value
  if (!carousel) return
  const card = carousel.querySelector<HTMLElement>('.plan-card')
  if (!card) return
  const gap = Number.parseFloat(getComputedStyle(carousel).columnGap) || 16
  carousel.scrollBy({left: direction * (card.offsetWidth + gap), behavior: 'smooth'})
}

const updatePlanControls = () => {
  const carousel = plansCarousel.value
  if (!carousel) return
  canScrollPlansBack.value = carousel.scrollLeft > 2
  canScrollPlansForward.value = carousel.scrollLeft < carousel.scrollWidth - carousel.clientWidth - 2
}

const planBillingAmount = (plan: Plan) => billingCycle.value === 'annual'
    ? (plan.monthly_amount || 0) * 12
    : plan.monthly_amount || 0

const isPlanExpanded = (planId: number) => expandedPlanIds.value.includes(planId)

const togglePlanFeatures = (planId: number) => {
  expandedPlanIds.value = isPlanExpanded(planId)
      ? expandedPlanIds.value.filter(id => id !== planId)
      : [...expandedPlanIds.value, planId]
}

const visiblePlanFeatures = (plan: Plan) => isPlanExpanded(plan.id) ? plan.features : plan.features.slice(0, 6)

const openCheckout = (plan: Plan) => {
  selectedPlan.value = plan
  checkoutOpen.value = true
  submitError.value = ''
}

const closeCheckout = () => {
  if (!submitting.value) checkoutOpen.value = false
}

const clearError = (field: FormKey) => {
  delete formErrors[field]
}

const validateForm = () => {
  const required: Array<[FormKey, string]> = [
    ['owner_name', 'Informe seu nome.'], ['owner_email', 'Informe seu e-mail.'],
    ['segment', 'Informe o segmento da loja.'], ['store_name', 'Informe o nome da loja.']
  ]
  required.forEach(([field, message]) => {
    if (!form[field].trim()) formErrors[field] = message
  })
  if (form.owner_email && !/^\S+@\S+\.\S+$/.test(form.owner_email)) formErrors.owner_email = 'Informe um e-mail válido.'
  return Object.keys(formErrors).length === 0
}

const submitCheckout = async () => {
  if (!selectedPlan.value || !validateForm()) return
  submitting.value = true
  submitError.value = ''
  try {
    const origin = window.location.origin
    const response = await $fetch<CheckoutResponse>(`${config.public.apiBase}/implementation-checkouts`, {
      method: 'POST', body: {
        plan_id: selectedPlan.value.id, ...form, phone: form.phone || null,
        success_url: `${origin}/compra-concluida`, cancel_url: `${origin}/#planos`
      }
    })
    window.location.assign(response.checkout_url)
  } catch (error) {
    const data = typeof error === 'object' && error && 'data' in error
        ? (error as { data?: { message?: string, errors?: Record<string, string[]> } }).data : undefined
    submitError.value = data?.errors ? Object.values(data.errors).flat()[0] || '' : data?.message || 'Não foi possível iniciar o pagamento.'
  } finally {
    submitting.value = false
  }
}

let destroyMotion: (() => void) | undefined
const updateHeaderState = () => {
  headerScrolled.value = window.scrollY > 24
}

onMounted(async () => {
  updateHeaderState()
  await nextTick()
  updatePlanControls()
  window.addEventListener('scroll', updateHeaderState, {passive: true})
  window.addEventListener('resize', updatePlanControls, {passive: true})

  const [{default: gsap}, {ScrollTrigger}, {SplitText}] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('gsap/SplitText')
  ])
  gsap.registerPlugin(ScrollTrigger, SplitText)

  const root = pageRoot.value
  if (!root) return

  const media = gsap.matchMedia()
  const textSplits: Array<{ revert: () => void }> = []
  const context = gsap.context(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const intro = gsap.timeline({defaults: {ease: 'power3.out'}})
    intro
        .from('[data-header]', {y: -24, opacity: 0, duration: .7})
        .from('.hero-kicker', {y: 14, opacity: 0, duration: .55}, '-=.25')
        .from('.hero-line', {yPercent: 110, rotate: 1.5, duration: .95, stagger: .1}, '-=.3')
        .from('.hero-support', {y: 18, opacity: 0, duration: .65}, '-=.55')
        .from('.hero-action', {y: 12, opacity: 0, duration: .5, stagger: .08}, '-=.45')
        .from('.hero-photo', {opacity: 0, scale: 1.045, duration: 1.35}, '-=1.15')
        .from('.hero-feature-card', {opacity: 0, y: 24, duration: .65, stagger: .1}, '-=.45')

    gsap.timeline({
      scrollTrigger: {trigger: '#inicio', start: 'top top', end: 'bottom top', scrub: 1}
    })
        .to('.hero-copy', {y: -64, opacity: .28, ease: 'none'}, 0)
        .to('.hero-photo', {scale: 1.06, y: 30, ease: 'none'}, 0)

    root.querySelectorAll<HTMLElement>('main .site-title').forEach((title) => {
      const split = SplitText.create(title, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'text-reveal-line text-reveal-line--title',
        aria: 'auto'
      })
      textSplits.push(split)

      gsap.from(split.lines, {
        yPercent: 108,
        rotate: .8,
        transformOrigin: 'left bottom',
        duration: .9,
        stagger: .1,
        ease: 'power4.out',
        scrollTrigger: {trigger: title, start: 'top 86%', once: true}
      })
    })

    root.querySelectorAll<HTMLElement>('main .section-reveal .site-label').forEach((label) => {
      const split = SplitText.create(label, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'text-reveal-line text-reveal-line--label',
        aria: 'auto'
      })
      textSplits.push(split)

      gsap.from(split.lines, {
        yPercent: 105,
        opacity: 0,
        duration: .55,
        ease: 'power3.out',
        scrollTrigger: {trigger: label, start: 'top 90%', once: true}
      })
    })

    root.querySelectorAll<HTMLElement>(
        'main .section-reveal .site-copy, main .plans-heading__aside > p, main .complexity-principle p'
    ).forEach((copy) => {
      const split = SplitText.create(copy, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'text-reveal-line text-reveal-line--copy',
        aria: 'auto'
      })
      textSplits.push(split)

      gsap.from(split.lines, {
        opacity: 0,
        yPercent: 70,
        duration: .62,
        stagger: .075,
        ease: 'power2.out',
        scrollTrigger: {trigger: copy, start: 'top 90%', once: true}
      })
    })

    root.querySelectorAll<HTMLElement>(
        '.journey-heading__action, .complexity-intro > .marketing-button'
    ).forEach((action) => {
      gsap.from(action, {
        opacity: 0,
        y: 14,
        duration: .5,
        ease: 'power2.out',
        scrollTrigger: {trigger: action, start: 'top 92%', once: true}
      })
    })

    const ecosystemIntro = gsap.timeline({
      scrollTrigger: {
        trigger: '.ecosystem-stage',
        start: 'top 88%',
        end: 'top 32%',
        scrub: .8
      }
    })
    ecosystemIntro
        .from('.ecosystem-core-card', {opacity: .25, scale: .93, duration: .7, ease: 'power2.out'})
        .from('.ecosystem-module', {
          opacity: 0,
          x: (index) => index < 4 ? -48 : 48,
          duration: .65,
          stagger: .045,
          ease: 'power2.out'
        }, '-=.52')
        .fromTo('.ecosystem-line',
            {strokeDasharray: 360, strokeDashoffset: 360},
            {strokeDashoffset: 0, duration: .72, stagger: .035, ease: 'power1.inOut'},
            '-=.58')

    const comparisonIntro = gsap.timeline({
      scrollTrigger: {
        trigger: '.comparison-stage',
        start: 'top 90%',
        end: 'top 38%',
        scrub: .75
      }
    })
    comparisonIntro
        .from('.comparison-stage', {opacity: .35, y: 70, scale: .96, duration: .9, ease: 'power3.out'})
        .from('.comparison-card--manual', {opacity: 0, x: -34, duration: .55, ease: 'power2.out'}, '-=.65')
        .from('.comparison-card--connected', {opacity: 0, x: 42, duration: .65, ease: 'power2.out'}, '-=.48')
        .from('.comparison-direction', {
          opacity: 0,
          rotate: -55,
          scale: .6,
          duration: .35,
          ease: 'back.out(1.4)'
        }, '-=.35')

    gsap.from('.plan-card', {
      opacity: 0,
      y: 72,
      rotate: (index) => [-1.6, .8, -0.6, 1.2, -.8][index] ?? 0,
      duration: 1,
      stagger: .09,
      ease: 'power4.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {trigger: '.plans-carousel-shell', start: 'top 84%', once: true}
    })

    gsap.from('.segments-stage', {
      opacity: .25,
      y: 42,
      clipPath: 'inset(0 0 100% 0 round 32px)',
      duration: 1.1,
      ease: 'power4.out',
      clearProps: 'transform,opacity,clipPath',
      scrollTrigger: {trigger: '.segments-stage', start: 'top 86%', once: true}
    })

    const closingIntro = gsap.timeline({
      scrollTrigger: {
        trigger: '.closing-cta',
        start: 'top 92%',
        end: 'top 48%',
        scrub: .75
      }
    })
    closingIntro
        .from('.closing-cta__copy', {opacity: .2, y: 54, duration: .8, ease: 'power3.out'})
        .from('.closing-cta__action', {opacity: 0, y: 28, duration: .5, ease: 'power2.out'}, '-=.42')
        .from('.closing-cta__rule', {scaleX: 0, duration: .7, ease: 'power2.inOut'}, '-=.6')

    gsap.fromTo('.footer-wordmark img',
        {opacity: .015, scale: .86, y: 34},
        {
          opacity: .075,
          scale: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {trigger: '.site-footer', start: 'top bottom', end: 'bottom bottom', scrub: .8}
        })

    media.add('(min-width: 1024px)', () => {
      gsap.fromTo('.ecosystem-rail--left',
          {y: 34},
          {
            y: -30,
            ease: 'none',
            scrollTrigger: {trigger: '.ecosystem-section', start: 'top bottom', end: 'bottom top', scrub: .8}
          })
      gsap.fromTo('.ecosystem-rail--right',
          {y: -28},
          {
            y: 34,
            ease: 'none',
            scrollTrigger: {trigger: '.ecosystem-section', start: 'top bottom', end: 'bottom top', scrub: .8}
          })
      gsap.fromTo('.ecosystem-core-card',
          {y: 18},
          {
            y: -18,
            ease: 'none',
            scrollTrigger: {trigger: '.ecosystem-section', start: 'top bottom', end: 'bottom top', scrub: .8}
          })
    })

  }, root)

  destroyMotion = () => {
    media.revert();
    context.revert()
    textSplits.forEach((split) => split.revert())
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateHeaderState)
  window.removeEventListener('resize', updatePlanControls)
  destroyMotion?.()
})
</script>

<template>
  <div ref="pageRoot" class="overflow-x-hidden bg-white">
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <MarketingSocialRail
        :facebook-href="config.public.facebookUrl"
        :instagram-href="config.public.instagramUrl"
    />
    <header data-header class="premium-header fixed inset-x-0 top-0 z-40" :class="{ 'is-scrolled': headerScrolled }">
      <div class="site-container flex h-[72px] items-center gap-8">
        <a href="#inicio" class="site-logo" aria-label="Elínea — início">
          <img class="site-logo__image site-logo__image--white" :src="logoWhiteUrl" alt="" aria-hidden="true">
          <img class="site-logo__image site-logo__image--official" :src="logoOfficialUrl" alt="" aria-hidden="true">
        </a>
        <nav class="ml-auto hidden items-center gap-8 text-xs font-semibold text-muted-foreground lg:flex"
             aria-label="Navegação principal">
          <a class="transition hover:text-primary" href="#jornada">Produto</a>
          <a class="transition hover:text-primary" href="#solucoes">Soluções</a>
          <a class="transition hover:text-primary" href="#planos">Preços</a>
          <a class="transition hover:text-primary" href="#recursos">Recursos</a>
          <a class="transition hover:text-primary" href="#rodape">Conteúdo</a>
        </nav>
        <a class="ml-auto hidden text-xs font-semibold text-muted-foreground hover:text-primary sm:block lg:ml-8"
           href="https://admin.elinea.com.br">Entrar</a>
        <MarketingButton class="hidden sm:inline-flex" variant="solid" href="#planos">Criar minha loja
          <template #icon>
            <ArrowRight :size="15"/>
          </template>
        </MarketingButton>
        <button class="btn btn-ghost btn-square ml-auto lg:hidden" type="button" aria-label="Alternar menu"
                :aria-expanded="mobileMenuOpen" aria-controls="menu-mobile" @click="mobileMenuOpen = !mobileMenuOpen">
          <X v-if="mobileMenuOpen" :size="22"/>
          <Menu v-else :size="22"/>
        </button>
      </div>
      <nav v-if="mobileMenuOpen" id="menu-mobile"
           class="grid gap-1 border-t border-border bg-white p-5 text-sm font-medium text-foreground lg:hidden">
        <a v-for="item in [{l:'Como funciona',h:'#jornada'},{l:'Ecossistema',h:'#recursos'},{l:'Soluções',h:'#solucoes'},{l:'Preços',h:'#planos'}]"
           :key="item.h" class="rounded-lg px-3 py-2 hover:bg-accent" :href="item.h"
           @click="mobileMenuOpen=false">{{ item.l }}</a>
        <a class="rounded-lg px-3 py-2 hover:bg-accent" href="https://admin.elinea.com.br">Entrar</a>
      </nav>
    </header>

    <main id="conteudo">
      <section id="inicio" class="hero-home relative isolate overflow-hidden">
        <img class="hero-photo absolute inset-0 -z-20 size-full object-cover" :src="heroStudioUrl" alt=""
             aria-hidden="true" fetchpriority="high">
        <div class="hero-photo-overlay absolute inset-0 -z-10"></div>
        <div class="site-container hero-layout flex items-center pt-[72px]">
          <div class="hero-copy max-w-[720px]">
            <span
                class="hero-kicker inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold text-white/75 shadow-sm backdrop-blur-md"><span
                class="size-2 rounded-full bg-[#5cdda4]"></span> Sua operação digital, bem resolvida</span>
            <h1 class="hero-title mt-7 text-[3.25rem] leading-[.96] font-semibold tracking-[-.065em] text-white sm:text-[4.25rem] lg:text-[5rem]">
              <span class="block overflow-hidden pb-1"><span class="hero-line block">Ecommerce<span
                  class="hero-desktop-word"> simples</span></span></span>
              <span class="hero-mobile-line overflow-hidden pb-1"><span
                  class="hero-line block">simples para</span></span>
              <span class="block overflow-hidden pb-2"><span class="hero-line block"><span class="hero-desktop-word">para </span>negócios reais.</span></span>
            </h1>
            <p class="hero-support mt-6 max-w-[520px] text-[17px] leading-7 text-white/75 sm:text-[18px] sm:leading-8">
              Uma plataforma completa para criar, gerenciar e fazer o seu negócio crescer, com mais vendas e menos
              complicação.</p>
            <div class="hero-actions mt-9 flex flex-wrap items-center gap-5">
              <MarketingButton class="hero-action" variant="primary" href="#planos">Criar minha loja
                <template #icon>
                  <ArrowRight :size="18"/>
                </template>
              </MarketingButton>
              <a class="hero-action hero-text-link inline-flex min-h-12 items-center gap-2 text-[13px] font-semibold text-white/85"
                 href="#jornada">Conhecer a plataforma
                <ArrowRight :size="15"/>
              </a>
            </div>
          </div>
        </div>
      </section>

      <MarketingLogoCarousel :items="brandLogos">
        <template #label>Uma plataforma para
          <mark>negócios reais</mark>
        </template>
      </MarketingLogoCarousel>

      <section id="jornada" class="journey-section">
        <div class="site-container py-24 lg:py-32">
          <div class="section-reveal journey-heading">
            <div class="journey-heading__title">
              <span class="site-label">Uma venda movimenta tudo</span>
              <h2 class="site-title journey-title">Da primeira visita<br>à próxima compra.</h2>
            </div>
            <div class="journey-heading__support">
              <p class="site-copy">Cada etapa conversa com a seguinte. Você acompanha a operação sem alternar entre
                ferramentas e planilhas.</p>
              <MarketingButton class="journey-heading__action" variant="solid" href="#recursos">Explorar recursos
                <template #icon>
                  <ArrowRight :size="16"/>
                </template>
              </MarketingButton>
            </div>
          </div>

          <div
              class="journey-shell"
              :style="{ '--journey-progress': `${((activeJourney + 1) / journeySteps.length) * 100}%` }"
          >
            <div class="journey-tabs" role="tablist" aria-label="Etapas de uma venda">
              <div class="journey-tabs__intro" aria-hidden="true">
                <span>Fluxo da venda</span>
                <strong>0{{ activeJourney + 1 }} / 04</strong>
                <i><b></b></i>
              </div>
              <button
                  v-for="(step,index) in journeySteps"
                  :id="`journey-tab-${index}`"
                  :key="step.label"
                  type="button"
                  role="tab"
                  class="journey-tab"
                  :class="{ active: activeJourney === index }"
                  :aria-selected="activeJourney === index"
                  aria-controls="journey-panel"
                  :tabindex="activeJourney === index ? 0 : -1"
                  @click="selectJourneyStep(index)"
                  @keydown="handleJourneyKeydown($event, index)"
              >
                <span class="journey-tab__number">0{{ index + 1 }}</span>
                <span>{{ step.label }}</span>
              </button>
            </div>

            <div
                id="journey-panel"
                class="journey-panel"
                role="tabpanel"
                :aria-labelledby="`journey-tab-${activeJourney}`"
                tabindex="0"
            >
              <div class="journey-panel__counter" aria-hidden="true">0{{ activeJourney + 1 }}</div>
              <Transition name="journey" mode="out-in">
                <div :key="activeJourney" class="journey-panel__inner">
                  <div class="journey-detail">
                    <span class="journey-detail__icon" aria-hidden="true"><component
                        :is="journeySteps[activeJourney]?.icon" :size="30" stroke-width="1.8"/></span>
                    <span class="journey-detail__step">Etapa 0{{ activeJourney + 1 }}</span>
                    <h3>{{ journeySteps[activeJourney]?.title }}</h3>
                    <p>{{ journeySteps[activeJourney]?.description }}</p>
                    <a class="journey-detail__link" href="#recursos">Ver como tudo se conecta
                      <ArrowRight :size="16" aria-hidden="true"/>
                    </a>
                  </div>

                  <div class="journey-stage" aria-hidden="true">
                    <div v-if="activeJourney === 0"
                         class="storefront-preview mx-auto max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
                      <div class="flex items-center justify-between border-b border-border px-5 py-4 text-[9px]"><b>CASA
                        NATIVA</b><span>Produtos&nbsp;&nbsp; Sobre&nbsp;&nbsp; Carrinho</span></div>
                      <div class="grid grid-cols-[1.1fr_.9fr] items-center gap-5 p-7">
                        <div><small class="text-[8px] text-primary">Novidades da semana</small>
                          <h3 class="mt-2 text-2xl font-semibold tracking-tight">Cuidado que faz parte da rotina.</h3>
                          <span
                              class="mt-5 inline-block rounded-lg bg-primary px-4 py-2 text-[8px] font-semibold text-white">Comprar agora</span>
                        </div>
                        <div class="aspect-[4/5] rounded-xl bg-[linear-gradient(145deg,#dcebe4,#b7cfc3)] p-4">
                          <div class="mx-auto mt-8 h-28 w-16 rounded-[14px_14px_8px_8px] bg-white shadow-lg"></div>
                        </div>
                      </div>
                    </div>
                    <div v-else-if="activeJourney === 1"
                         class="checkout-preview mx-auto grid max-w-lg grid-cols-[1fr_.72fr] overflow-hidden rounded-2xl bg-white shadow-xl">
                      <div class="p-7"><h3 class="text-sm font-bold">Finalizar compra</h3>
                        <div class="mt-5 grid gap-3">
                          <div class="h-10 rounded-lg border border-border px-3 py-2 text-[9px] text-muted-foreground">
                            Nome completo
                          </div>
                          <div class="h-10 rounded-lg border border-border px-3 py-2 text-[9px] text-muted-foreground">
                            Endereço de entrega
                          </div>
                          <div class="grid grid-cols-2 gap-3">
                            <div
                                class="h-10 rounded-lg border border-primary bg-emerald-50 p-3 text-[8px] font-bold text-primary">
                              Pix
                            </div>
                            <div class="h-10 rounded-lg border border-border p-3 text-[8px]">Cartão</div>
                          </div>
                          <span class="mt-2 rounded-lg bg-primary p-3 text-center text-[9px] font-bold text-white">Pagar com segurança</span>
                        </div>
                      </div>
                      <aside class="bg-[#f7f9f8] p-6 text-[9px]"><b>Seu pedido</b>
                        <div class="mt-5 flex gap-3">
                          <div class="size-12 rounded-lg bg-[#dcebe4]"></div>
                          <span>Vitamina C<br><b>R$ 48,00</b></span></div>
                        <div class="mt-6 border-t border-border pt-4"><span
                            class="flex justify-between"><span>Total</span><b>R$ 48,00</b></span></div>
                      </aside>
                    </div>
                    <div v-else-if="activeJourney === 2" class="orders-preview mock-window mx-auto max-w-xl">
                      <div class="mock-nav"><b class="mr-auto text-[10px]">Pedidos</b>
                        <Search :size="12"/>
                        <Bell :size="12"/>
                      </div>
                      <div class="p-6">
                        <div class="flex items-center"><h3 class="text-lg font-bold">Pedido #1052</h3><span
                            class="ml-auto rounded-full bg-emerald-50 px-3 py-1 text-[8px] font-bold text-primary">Pagamento aprovado</span>
                        </div>
                        <div class="mt-6 grid grid-cols-3 gap-3">
                          <div
                              v-for="item in [['Cliente','Ana Clara'],['Entrega','Transportadora'],['Total','R$ 349,90']]"
                              :key="item[0]" class="rounded-xl border border-border p-4 text-[8px]"><span
                              class="text-muted-foreground">{{ item[0] }}</span><b class="mt-1 block">{{ item[1] }}</b>
                          </div>
                        </div>
                        <div class="mt-5 rounded-xl border border-border p-4">
                          <div class="flex items-center gap-3 text-[9px]">
                            <CheckCircle2 :size="16" class="text-primary"/>
                            <b>Estoque atualizado automaticamente</b></div>
                          <div class="mt-3 flex items-center gap-3 text-[9px]">
                            <CheckCircle2 :size="16" class="text-primary"/>
                            <b>Cliente adicionado à base</b></div>
                        </div>
                      </div>
                    </div>
                    <div v-else
                         class="whatsapp-preview mx-auto max-w-sm overflow-hidden rounded-[24px] border-[7px] border-dark-200 bg-[#eef4f1] shadow-xl">
                      <div class="bg-dark-200 px-5 py-4 text-[10px] font-bold text-white">Elínea <span
                          class="block text-[7px] font-normal text-white/60">automação ativa</span></div>
                      <div class="space-y-3 p-5 text-[9px]">
                        <div class="mr-8 rounded-xl rounded-tl-sm bg-white p-3 shadow-sm">Olá, Ana! Seu pedido foi
                          confirmado e já estamos preparando tudo.
                        </div>
                        <div class="ml-12 rounded-xl rounded-tr-sm bg-[#d8f5e5] p-3 shadow-sm">Ótimo, obrigada!</div>
                        <div class="mr-5 rounded-xl rounded-tl-sm bg-white p-3 shadow-sm">Quando quiser comprar
                          novamente, sua loja está a um toque de distância.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </section>

      <section id="recursos" class="ecosystem-section py-24 lg:py-36">
        <div class="site-container">
          <div class="section-reveal ecosystem-heading">
            <div class="max-w-[760px]">
              <span class="site-label">Um ecossistema, não um quebra-cabeça</span>
              <h2 class="site-title motion-title">Tudo o que vende<br>trabalhando junto.</h2>
            </div>
            <p class="site-copy">O Elínea conecta as ferramentas essenciais da operação e continua preparado para
              receber novos módulos e integrações.</p>
          </div>

          <div class="ecosystem-stage">
            <svg class="ecosystem-connections" viewBox="0 0 1200 680" fill="none" preserveAspectRatio="none"
                 aria-hidden="true">
              <path
                  v-for="(path,index) in ['M250 98 C330 98 340 238 420 238','M250 254 C330 254 345 292 420 292','M250 410 C330 410 345 346 420 346','M250 566 C330 566 340 400 420 400','M950 98 C870 98 860 238 780 238','M950 254 C870 254 855 292 780 292','M950 410 C870 410 855 346 780 346','M950 566 C870 566 860 400 780 400']"
                  :key="path" class="ecosystem-line" :class="`tone-${ecosystemModules[index]?.tone}`" :d="path"/>
            </svg>

            <div class="ecosystem-rail ecosystem-rail--left">
              <article v-for="module in ecosystemModules.slice(0, 4)" :key="module.title" class="ecosystem-module"
                       :class="`tone-${module.tone}`">
                <span class="ecosystem-module__icon" aria-hidden="true"><component :is="module.icon" :size="20"
                                                                                   stroke-width="1.8"/></span>
                <div><h3>{{ module.title }}</h3>
                  <p>{{ module.detail }}</p></div>
              </article>
            </div>

            <article class="ecosystem-core-card">
              <div class="ecosystem-core-card__top">
                <img :src="logoWhiteUrl" alt="Elínea">
                <span><i></i> Operação conectada</span>
              </div>
              <div class="ecosystem-core-card__copy">
                <span>O centro da sua operação</span>
                <h3>Toda a operação, no mesmo núcleo.</h3>
                <p>Loja, pedidos e relacionamento compartilham o mesmo contexto, do primeiro acesso à próxima
                  compra.</p>
              </div>
              <div class="ecosystem-core-flow" role="list" aria-label="Fluxo conectado da plataforma">
                <div role="listitem">
                  <Store :size="19" aria-hidden="true"/>
                  <span><small>Venda</small><strong>Loja e checkout</strong></span></div>
                <div role="listitem">
                  <PackageCheck :size="19" aria-hidden="true"/>
                  <span><small>Operação</small><strong>Pedidos</strong></span></div>
                <div role="listitem">
                  <MessageCircle :size="19" aria-hidden="true"/>
                  <span><small>Relacionamento</small><strong>Clientes</strong></span></div>
              </div>
            </article>

            <div class="ecosystem-rail ecosystem-rail--right">
              <article v-for="module in ecosystemModules.slice(4)" :key="module.title" class="ecosystem-module"
                       :class="`tone-${module.tone}`">
                <span class="ecosystem-module__icon" aria-hidden="true"><component :is="module.icon" :size="20"
                                                                                   stroke-width="1.8"/></span>
                <div><h3>{{ module.title }}</h3>
                  <p>{{ module.detail }}</p></div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section class="complexity-section py-24 lg:py-32">
        <div class="site-container complexity-layout">
          <div class="section-reveal complexity-intro">
            <span class="site-label">Tecnologia sem peso</span>
            <h2 class="site-title motion-title">Você cuida do negócio.<br>O Elínea organiza o digital.</h2>
            <p class="site-copy">Uma estrutura profissional sem precisar contratar uma equipe técnica ou integrar várias
              ferramentas por conta própria.</p>
            <div class="complexity-principle"><i aria-hidden="true"></i>
              <p>A tecnologia trabalha nos bastidores. Você segue no controle.</p></div>
            <MarketingButton class="mt-8" variant="solid" href="#planos">Começar com suporte
              <template #icon>
                <ArrowRight :size="15"/>
              </template>
            </MarketingButton>
          </div>

          <div class="comparison-stage">
            <header class="comparison-stage__header">
              <div><span>Uma operação, dois cenários</span>
                <h3>Menos peças soltas. Mais negócio andando.</h3></div>
              <span class="comparison-status"><i aria-hidden="true"></i> Estrutura conectada</span>
            </header>

            <div class="comparison-grid">
              <article class="comparison-card comparison-card--manual">
                <header><span>Montando sozinho</span><small>Mais pontos para coordenar</small></header>
                <ul>
                  <li v-for="item in manualOperationItems" :key="item.label">
                    <component :is="item.icon" :size="18" stroke-width="1.8" aria-hidden="true"/>
                    {{ item.label }}
                  </li>
                </ul>
              </article>

              <span class="comparison-direction" aria-hidden="true"><ArrowRight :size="20"/></span>

              <article class="comparison-card comparison-card--connected">
                <header><img :src="logoWhiteUrl" alt=""><span>Operando com Elínea</span></header>
                <div class="comparison-card__body">
                  <span>Uma base para operar</span>
                  <h3>O digital trabalha junto.</h3>
                  <ul>
                    <li v-for="item in connectedOperationItems" :key="item">
                      <CheckCircle2 :size="18" aria-hidden="true"/>
                      {{ item }}
                    </li>
                  </ul>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="planos" class="plans-section py-24 lg:py-32">
        <div class="site-container">
          <div class="plans-heading section-reveal">
            <div>
              <span class="site-label">Planos para o seu momento</span>
              <h2 class="site-title motion-title">Uma estrutura que<br>acompanha o seu negócio.</h2>
            </div>
            <div class="plans-heading__aside">
              <p>Do catálogo essencial a uma operação feita sob medida. Escolha o ponto de partida e evolua dentro do
                mesmo ecossistema.</p>
              <div class="plans-billing" aria-label="Periodicidade dos planos">
                <span :class="{'is-active': billingCycle === 'monthly'}">Mensal</span>
                <button type="button" role="switch" :aria-checked="billingCycle === 'annual'"
                        :aria-label="billingCycle === 'monthly' ? 'Exibir valores anuais' : 'Exibir valores mensais'"
                        @click="billingCycle = billingCycle === 'monthly' ? 'annual' : 'monthly'">
                  <span aria-hidden="true"></span>
                </button>
                <span :class="{'is-active': billingCycle === 'annual'}">Anual</span>
              </div>
            </div>
          </div>
          <div class="plans-carousel-shell">
            <button class="plans-carousel-control plans-carousel-control--previous" type="button"
                    aria-label="Ver plano anterior" :disabled="!canScrollPlansBack" @click="scrollPlans(-1)">
              <ArrowLeft :size="21" aria-hidden="true"/>
            </button>
            <div ref="plansCarousel" class="plans-carousel" tabindex="0" role="region" aria-label="Planos disponíveis"
                 @scroll.passive="updatePlanControls" @keydown.left.prevent="scrollPlans(-1)"
                 @keydown.right.prevent="scrollPlans(1)">
              <article v-for="plan in plans" :key="plan.id" class="plan-card"
                       :class="[`plan-card--${plan.tone}`, {'plan-card--featured': plan.featured, 'plan-card--expanded': isPlanExpanded(plan.id)}]"
                       :aria-label="`Plano ${plan.name}`">
                <div class="plan-card__summary">
                  <div class="plan-card__name">
                    <h3>{{ plan.name }}</h3>
                    <span v-if="plan.featured">Recomendado</span>
                  </div>
                  <div class="plan-card__price">
                    <template v-if="plan.monthly_amount !== null">
                      <small>R$</small><strong>{{
                        money(planBillingAmount(plan)).replace('R$ ', '')
                      }}</strong><span>/{{ billingCycle === 'monthly' ? 'mês' : 'ano' }}</span>
                    </template>
                    <strong v-else>Sob consulta</strong>
                  </div>
                  <p>{{ plan.description }}</p>
                  <dl>
                    <div>
                      <dt>Implantação</dt>
                      <dd>{{ plan.implementation_label }}</dd>
                    </div>
                    <div>
                      <dt>{{ billingCycle === 'monthly' ? 'Mensalidade' : 'Plano anual' }}</dt>
                      <dd>{{ plan.monthly_amount === null ? 'Sob consulta' : money(planBillingAmount(plan)) }}</dd>
                    </div>
                  </dl>
                  <MarketingButton class="plan-card__action"
                                   :variant="plan.featured || plan.tone === 'dark' ? 'solid' : 'outline'" type="button"
                                   @click="openCheckout(plan)">
                    {{ plan.slug === 'personalizado' ? 'Conversar sobre o projeto' : 'Escolher este plano' }}
                    <template #icon>
                      <ArrowRight :size="16" aria-hidden="true"/>
                    </template>
                  </MarketingButton>
                </div>
                <div class="plan-card__features">
                  <h4>{{ plan.features_label || 'Inclui' }}</h4>
                  <ul :id="`plan-features-${plan.id}`">
                    <li v-for="feature in visiblePlanFeatures(plan)" :key="feature">
                      <Check :size="15" aria-hidden="true"/>
                      {{ feature }}
                    </li>
                  </ul>
                  <button v-if="plan.features.length > 6" class="plan-card__features-toggle" type="button"
                          :aria-expanded="isPlanExpanded(plan.id)" :aria-controls="`plan-features-${plan.id}`"
                          @click="togglePlanFeatures(plan.id)">
                    {{ isPlanExpanded(plan.id) ? 'Mostrar menos' : `Ver mais ${plan.features.length - 6} recursos` }}
                    <ChevronDown :size="17" aria-hidden="true"/>
                  </button>
                  <p v-if="plan.note" class="plan-card__note">{{ plan.note }}</p>
                </div>
              </article>
            </div>
            <button class="plans-carousel-control plans-carousel-control--next" type="button"
                    aria-label="Ver próximo plano" :disabled="!canScrollPlansForward" @click="scrollPlans(1)">
              <ArrowRight :size="21" aria-hidden="true"/>
            </button>
          </div>
        </div>
      </section>

      <section id="solucoes" class="segments-section py-24 lg:py-32">
        <div class="site-container">
          <div class="section-reveal segments-heading">
            <div>
              <span class="site-label">Feito para quem vende de verdade</span>
              <h2 class="site-title motion-title">O mesmo núcleo.<br>Diferentes negócios.</h2>
            </div>
            <p class="site-copy">Começamos perto das farmácias de manipulação e construímos uma plataforma capaz de
              acompanhar muitos outros segmentos.</p>
          </div>

          <div class="segments-stage">
            <div class="segments-index" role="tablist" aria-label="Escolha um segmento" aria-orientation="vertical">
              <p class="segments-index__label">Encontre o seu negócio</p>
              <button
                  v-for="(item, index) in segments"
                  :id="`segment-tab-${index}`"
                  :key="item.label"
                  class="segments-index__item"
                  :class="{'is-active': activeSegment === index}"
                  type="button"
                  role="tab"
                  :aria-selected="activeSegment === index"
                  :aria-controls="`segment-panel-${index}`"
                  :tabindex="activeSegment === index ? 0 : -1"
                  @click="selectSegment(index)"
                  @keydown="handleSegmentKeydown($event, index)"
              >
                <span class="segments-index__icon"><component :is="item.icon" :size="21" aria-hidden="true"/></span>
                <span>{{ item.label }}</span>
                <ArrowRight :size="18" aria-hidden="true"/>
              </button>
            </div>

            <div class="segments-panel-shell">
              <div class="segments-panel-shell__topbar" aria-hidden="true">
                <span><i></i> Estrutura Elínea</span>
                <span>{{ selectedSegment.emphasis }}</span>
              </div>
              <Transition name="segment-panel" mode="out-in">
                <article
                    :id="`segment-panel-${activeSegment}`"
                    :key="activeSegment"
                    class="segments-panel"
                    role="tabpanel"
                    :aria-labelledby="`segment-tab-${activeSegment}`"
                    tabindex="0"
                >
                  <div class="segments-panel__intro">
                    <span class="segments-panel__icon"><component :is="selectedSegment.icon" :size="27"
                                                                  aria-hidden="true"/></span>
                    <p>{{ selectedSegment.label }}</p>
                  </div>
                  <h3>{{ selectedSegment.title }}</h3>
                  <p class="segments-panel__description">{{ selectedSegment.description }}</p>
                  <div class="segments-panel__highlights" role="list" aria-label="Destaques para este segmento">
                    <div v-for="highlight in selectedSegment.highlights" :key="highlight" role="listitem">
                      <CheckCircle2 :size="18" aria-hidden="true"/>
                      <span>{{ highlight }}</span>
                    </div>
                  </div>
                </article>
              </Transition>
              <div class="segments-core">
                <span>Núcleo compartilhado</span>
                <div>
                  <Store :size="17" aria-hidden="true"/>
                  Loja
                </div>
                <div>
                  <PackageCheck :size="17" aria-hidden="true"/>
                  Gestão
                </div>
                <div>
                  <MessageCircle :size="17" aria-hidden="true"/>
                  Relacionamento
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer id="rodape" class="site-footer py-12">
      <div class="site-container footer-grid grid gap-10 md:grid-cols-[1.2fr_2fr_auto]">
        <div><a href="#inicio" class="footer-logo" aria-label="Elínea — início"><img :src="logoWhiteUrl" alt=""></a>
          <p class="mt-3 text-[10px] text-muted-foreground">Ecommerce simples para negócios reais.</p></div>
        <div class="grid grid-cols-2 gap-8 text-[10px] sm:grid-cols-4">
          <div><b>Produto</b><a class="mt-3 block text-muted-foreground" href="#jornada">Como funciona</a><a
              class="mt-2 block text-muted-foreground" href="#recursos">Ecossistema</a><a
              class="mt-2 block text-muted-foreground" href="#planos">Preços</a></div>
          <div><b>Soluções</b><a class="mt-3 block text-muted-foreground" href="#solucoes">Farmácias</a><a
              class="mt-2 block text-muted-foreground" href="#solucoes">Lojas especializadas</a><a
              class="mt-2 block text-muted-foreground" href="#solucoes">Pequenos negócios</a></div>
          <div><b>Plataforma</b><a class="mt-3 block text-muted-foreground" href="#">Documentação</a><a
              class="mt-2 block text-muted-foreground" href="#">Integrações</a><a
              class="mt-2 block text-muted-foreground" href="#">Status</a></div>
          <div><b>Empresa</b><a class="mt-3 block text-muted-foreground" href="#">Sobre</a><a
              class="mt-2 block text-muted-foreground" href="#">Contato</a><a class="mt-2 block text-muted-foreground"
                                                                              href="#">Privacidade</a></div>
        </div>
        <div class="flex gap-3 text-muted-foreground" aria-hidden="true">
          <MessageCircle :size="17"/>
          <Mail :size="17"/>
        </div>
      </div>
      <div class="footer-wordmark mt-14 py-5" aria-hidden="true"><img :src="logoWhiteUrl" alt=""></div>
      <div class="site-container mt-8 text-right text-[9px] text-muted-foreground">© 2026 Elínea. Todos os direitos
        reservados.
      </div>
    </footer>

    <dialog class="modal" :class="{ 'modal-open': checkoutOpen }" @click.self="closeCheckout">
      <section class="modal-box max-w-2xl border border-border bg-popover text-popover-foreground shadow-2xl">
        <button class="btn btn-ghost btn-sm btn-circle absolute top-4 right-4" type="button" aria-label="Fechar"
                @click="closeCheckout">
          <X :size="18"/>
        </button>
        <span class="site-label">Implantação Elínea</span>
        <h2 class="text-lg font-semibold">Comece com o plano {{ selectedPlan?.name }}</h2>
        <p class="mt-1 text-sm text-muted-foreground">Preencha os dados do responsável. Na próxima etapa, o pagamento
          será processado com segurança pela Stripe.</p>
        <form class="mt-6 grid gap-4 sm:grid-cols-2" novalidate @submit.prevent="submitCheckout">
          <label class="grid gap-1.5 text-xs font-medium text-muted-foreground"><span>Seu nome <em
              class="text-error not-italic">*</em></span><input v-model="form.owner_name"
                                                                class="input h-11 w-full rounded-lg border-border px-3 text-sm focus:outline-none"
                                                                :class="formErrors.owner_name ? 'input-error' : ''"
                                                                :aria-invalid="!!formErrors.owner_name" maxlength="255"
                                                                autocomplete="name"
                                                                @input="clearError('owner_name')"><small
              v-if="formErrors.owner_name" class="text-error">{{ formErrors.owner_name }}</small></label>
          <label class="grid gap-1.5 text-xs font-medium text-muted-foreground"><span>E-mail <em
              class="text-error not-italic">*</em></span><input v-model="form.owner_email"
                                                                class="input h-11 w-full rounded-lg border-border px-3 text-sm focus:outline-none"
                                                                :class="formErrors.owner_email ? 'input-error' : ''"
                                                                :aria-invalid="!!formErrors.owner_email" type="email"
                                                                maxlength="255" autocomplete="email"
                                                                @input="clearError('owner_email')"><small
              v-if="formErrors.owner_email" class="text-error">{{ formErrors.owner_email }}</small></label>
          <label class="grid gap-1.5 text-xs font-medium text-muted-foreground">Telefone<input v-model="form.phone"
                                                                                               class="input h-11 w-full rounded-lg border-border px-3 text-sm focus:outline-none"
                                                                                               maxlength="30"
                                                                                               autocomplete="tel"></label>
          <label class="grid gap-1.5 text-xs font-medium text-muted-foreground"><span>Segmento <em
              class="text-error not-italic">*</em></span><input v-model="form.segment"
                                                                class="input h-11 w-full rounded-lg border-border px-3 text-sm focus:outline-none"
                                                                :class="formErrors.segment ? 'input-error' : ''"
                                                                :aria-invalid="!!formErrors.segment" maxlength="100"
                                                                placeholder="Moda, beleza..."
                                                                @input="clearError('segment')"><small
              v-if="formErrors.segment" class="text-error">{{ formErrors.segment }}</small></label>
          <label class="grid gap-1.5 text-xs font-medium text-muted-foreground sm:col-span-2"><span>Nome da loja <em
              class="text-error not-italic">*</em></span><input v-model="form.store_name"
                                                                class="input h-11 w-full rounded-lg border-border px-3 text-sm focus:outline-none"
                                                                :class="formErrors.store_name ? 'input-error' : ''"
                                                                :aria-invalid="!!formErrors.store_name" maxlength="255"
                                                                autocomplete="organization"
                                                                @input="clearError('store_name')"><small
              v-if="formErrors.store_name" class="text-error">{{ formErrors.store_name }}</small></label>
          <div v-if="submitError" class="alert alert-error py-3 text-sm sm:col-span-2">{{ submitError }}</div>
          <div class="modal-action mt-2 sm:col-span-2">
            <MarketingButton variant="outline" type="button" @click="closeCheckout">Cancelar</MarketingButton>
            <MarketingButton variant="solid" type="submit" :disabled="submitting"><span v-if="submitting"
                                                                                        class="loading loading-spinner loading-xs"></span>{{
                submitting ? 'Abrindo pagamento...' : selectedPlan?.implementation_amount === null ? 'Enviar interesse' : `Continuar — ${money(selectedPlan?.implementation_amount || 0)}`
              }}
              <template #icon>
                <ArrowRight v-if="!submitting" :size="16"/>
              </template>
            </MarketingButton>
          </div>
        </form>
      </section>
    </dialog>
  </div>
</template>
