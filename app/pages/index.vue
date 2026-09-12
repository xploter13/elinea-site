<script setup lang="ts">
import heroStudioUrl from '~/assets/images/h3-slider-img-1.webp'
import logoOfficialUrl from '~/assets/images/elinea-logo.svg'
import logoWhiteUrl from '~/assets/images/elinea-logo-white.svg'
import { MarketingButton, MarketingLogoCarousel, MarketingSocialRail } from '@elinea/ui/marketing'
import {
  ArrowRight, BarChart3, Bell, Bot, Building2, Check, CheckCircle2,
  CreditCard, LayoutTemplate, Mail, Menu, MessageCircle, Package,
  PackageCheck, Pill, Search, ShoppingBag, Store, Tag, X
} from '@lucide/vue'

type Plan = {
  id: number
  name: string
  slug: string
  description: string | null
  monthly_amount: number | string
  implementation_amount: number | string
  currency: string
  product_limit: number | null
  features: string[]
}
type PlansResponse = { data: Plan[] }
type CheckoutResponse = { data: { public_id: string }, checkout_url: string }
type FormKey = 'owner_name' | 'owner_email' | 'segment' | 'store_name'

const config = useRuntimeConfig()
const pageRoot = ref<HTMLElement | null>(null)
const plans = ref<Plan[]>([])
const plansLoading = ref(true)
const plansError = ref('')
const checkoutOpen = ref(false)
const selectedPlan = ref<Plan | null>(null)
const submitting = ref(false)
const submitError = ref('')
const mobileMenuOpen = ref(false)
const headerScrolled = ref(false)
const activeJourney = ref(0)
const form = reactive({ owner_name: '', owner_email: '', phone: '', store_name: '', segment: '' })
const formErrors = reactive<Partial<Record<FormKey, string>>>({})

const journeySteps = [
  { icon: Store, label: 'Loja virtual', title: 'O cliente encontra o produto certo.', description: 'Uma vitrine rápida, responsiva e com a identidade do seu negócio.' },
  { icon: CreditCard, label: 'Pagamento', title: 'A compra acontece sem atrito.', description: 'Checkout direto, com Pix, boleto e cartão em uma jornada segura.' },
  { icon: PackageCheck, label: 'Gestão', title: 'O pedido já chega organizado.', description: 'Pagamento, estoque e cliente atualizados no mesmo painel.' },
  { icon: MessageCircle, label: 'Relacionamento', title: 'A conversa continua no WhatsApp.', description: 'Confirmações, recuperação de carrinho e novas oportunidades de venda.' }
]

const brandLogos = [
  { name: 'PharmaVida' },
  { name: 'NUTRIMAX' },
  { name: 'essência' },
  { name: 'FórmulaCerta' },
  { name: 'BioAtiva' },
  { name: 'DermaPlus' },
]

const ecosystemModules = [
  { icon: Store, title: 'Loja virtual', detail: 'Sua marca no ar' },
  { icon: Package, title: 'Catálogo', detail: 'Produtos organizados' },
  { icon: CreditCard, title: 'Pagamentos', detail: 'Pix, boleto e cartão' },
  { icon: ShoppingBag, title: 'Pedidos', detail: 'Operação centralizada' },
  { icon: Tag, title: 'Promoções', detail: 'Cupons e campanhas' },
  { icon: BarChart3, title: 'Relatórios', detail: 'Decisões com contexto' },
  { icon: Bot, title: 'Automações', detail: 'Fluxos que trabalham' },
  { icon: MessageCircle, title: 'WhatsApp', detail: 'Venda e relacionamento' }
]

const money = (value: number | string) => new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL', maximumFractionDigits: 0
}).format(Number(value) / 100)

const loadPlans = async () => {
  plansLoading.value = true
  plansError.value = ''
  try {
    plans.value = (await $fetch<PlansResponse>(`${config.public.apiBase}/plans`)).data
  } catch {
    plansError.value = 'Não foi possível carregar os planos agora. Tente novamente em instantes.'
  } finally {
    plansLoading.value = false
  }
}

const openCheckout = (plan: Plan) => {
  selectedPlan.value = plan
  checkoutOpen.value = true
  submitError.value = ''
}

const closeCheckout = () => {
  if (!submitting.value) checkoutOpen.value = false
}

const clearError = (field: FormKey) => { delete formErrors[field] }

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
const updateHeaderState = () => { headerScrolled.value = window.scrollY > 24 }

onMounted(async () => {
  loadPlans()
  updateHeaderState()
  window.addEventListener('scroll', updateHeaderState, { passive: true })

  const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger')
  ])
  gsap.registerPlugin(ScrollTrigger)

  const root = pageRoot.value
  if (!root) return

  const media = gsap.matchMedia()
  const context = gsap.context(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
    intro
      .from('[data-header]', { y: -24, opacity: 0, duration: .7 })
      .from('.hero-kicker', { y: 14, opacity: 0, duration: .55 }, '-=.25')
      .from('.hero-line', { yPercent: 110, rotate: 1.5, duration: .95, stagger: .1 }, '-=.3')
      .from('.hero-support', { y: 18, opacity: 0, duration: .65 }, '-=.55')
      .from('.hero-action', { y: 12, opacity: 0, duration: .5, stagger: .08 }, '-=.45')
      .from('.hero-photo', { opacity: 0, scale: 1.045, duration: 1.35 }, '-=1.15')
      .from('.hero-feature-card', { opacity: 0, y: 24, duration: .65, stagger: .1 }, '-=.45')

    gsap.timeline({
      scrollTrigger: { trigger: '#inicio', start: 'top top', end: 'bottom top', scrub: 1 }
    })
      .to('.hero-copy', { y: -64, opacity: .28, ease: 'none' }, 0)
      .to('.hero-photo', { scale: 1.06, y: 30, ease: 'none' }, 0)
      .to('.hero-feature-dock', { y: 38, opacity: .35, ease: 'none' }, 0)

    root.querySelectorAll<HTMLElement>('.section-reveal').forEach((section) => {
      gsap.from(section.children, {
        opacity: 0, y: 18, duration: .55, stagger: .075, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 82%', toggleActions: 'play none none reverse' }
      })
    })

    media.add('(min-width: 1024px)', () => {
      ScrollTrigger.create({
        trigger: '.journey-scroll',
        start: 'top top',
        end: '+=2400',
        pin: '.journey-pin',
        scrub: .8,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          activeJourney.value = Math.min(journeySteps.length - 1, Math.floor(self.progress * journeySteps.length))
          gsap.set('.journey-progress-fill', { scaleY: self.progress, transformOrigin: 'top center' })
        }
      })

      gsap.to('.ecosystem-module', {
        y: (index) => index % 2 === 0 ? -18 : 18,
        ease: 'none',
        scrollTrigger: { trigger: '.ecosystem-map', start: 'top bottom', end: 'bottom top', scrub: 1.1 }
      })
    })

    gsap.fromTo('.ecosystem-line',
      { strokeDasharray: 340, strokeDashoffset: 340 },
      {
        strokeDashoffset: 0, duration: 1.15, stagger: .08, ease: 'power2.inOut',
        scrollTrigger: { trigger: '.ecosystem-map', start: 'top 72%', once: true }
      })

    gsap.from('.comparison-card', {
      opacity: 0,
      y: 36,
      scale: .94,
      duration: .85,
      stagger: .12,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.comparison-grid', start: 'top 78%', once: true }
    })

    ScrollTrigger.batch('.reveal-card', {
      start: 'top 88%',
      once: true,
      onEnter: (elements) => gsap.from(elements, {
        opacity: 0, y: 20, scale: .97, duration: .55,
        stagger: .07, ease: 'power2.out', overwrite: true
      })
    })

  }, root)

  destroyMotion = () => { media.revert(); context.revert() }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateHeaderState)
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
        <nav class="ml-auto hidden items-center gap-8 text-xs font-semibold text-muted-foreground lg:flex" aria-label="Navegação principal">
          <a class="transition hover:text-primary" href="#jornada">Produto</a>
          <a class="transition hover:text-primary" href="#solucoes">Soluções</a>
          <a class="transition hover:text-primary" href="#planos">Preços</a>
          <a class="transition hover:text-primary" href="#recursos">Recursos</a>
          <a class="transition hover:text-primary" href="#rodape">Conteúdo</a>
        </nav>
        <a class="ml-auto hidden text-xs font-semibold text-muted-foreground hover:text-primary sm:block lg:ml-8" href="https://admin.elinea.com.br">Entrar</a>
        <MarketingButton class="hidden sm:inline-flex" variant="solid" href="#planos">Criar minha loja<template #icon><ArrowRight :size="15" /></template></MarketingButton>
        <button class="btn btn-ghost btn-square ml-auto lg:hidden" type="button" aria-label="Alternar menu" :aria-expanded="mobileMenuOpen" aria-controls="menu-mobile" @click="mobileMenuOpen = !mobileMenuOpen">
          <X v-if="mobileMenuOpen" :size="22" /><Menu v-else :size="22" />
        </button>
      </div>
      <nav v-if="mobileMenuOpen" id="menu-mobile" class="grid gap-1 border-t border-border bg-white p-5 text-sm font-medium text-foreground lg:hidden">
        <a v-for="item in [{l:'Como funciona',h:'#jornada'},{l:'Ecossistema',h:'#recursos'},{l:'Soluções',h:'#solucoes'},{l:'Preços',h:'#planos'}]" :key="item.h" class="rounded-lg px-3 py-2 hover:bg-accent" :href="item.h" @click="mobileMenuOpen=false">{{ item.l }}</a>
        <a class="rounded-lg px-3 py-2 hover:bg-accent" href="https://admin.elinea.com.br">Entrar</a>
      </nav>
    </header>

    <main id="conteudo">
      <section id="inicio" class="hero-home relative isolate overflow-hidden">
        <img class="hero-photo absolute inset-0 -z-20 size-full object-cover" :src="heroStudioUrl" alt="" aria-hidden="true" fetchpriority="high">
        <div class="hero-photo-overlay absolute inset-0 -z-10"></div>
        <div class="site-container hero-layout flex items-center pt-[72px]">
          <div class="hero-copy max-w-[720px]">
            <span class="hero-kicker inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold text-white/75 shadow-sm backdrop-blur-md"><span class="size-2 rounded-full bg-[#5cdda4]"></span> Sua operação digital, bem resolvida</span>
            <h1 class="hero-title mt-7 text-[3.25rem] leading-[.96] font-semibold tracking-[-.065em] text-white sm:text-[4.25rem] lg:text-[5rem]">
              <span class="block overflow-hidden pb-1"><span class="hero-line block">Ecommerce<span class="hero-desktop-word"> simples</span></span></span>
              <span class="hero-mobile-line overflow-hidden pb-1"><span class="hero-line block">simples para</span></span>
              <span class="block overflow-hidden pb-2"><span class="hero-line block"><span class="hero-desktop-word">para </span>negócios reais.</span></span>
            </h1>
            <p class="hero-support mt-6 max-w-[520px] text-[17px] leading-7 text-white/75 sm:text-[18px] sm:leading-8">Uma plataforma completa para criar, gerenciar e fazer o seu negócio crescer, com mais vendas e menos complicação.</p>
            <div class="hero-actions mt-9 flex flex-wrap items-center gap-5">
              <MarketingButton class="hero-action" variant="primary" href="#planos">Criar minha loja<template #icon><ArrowRight :size="18" /></template></MarketingButton>
              <a class="hero-action hero-text-link inline-flex min-h-12 items-center gap-2 text-[13px] font-semibold text-white/85" href="#jornada">Conhecer a plataforma <ArrowRight :size="15" /></a>
            </div>
          </div>
        </div>
        <div class="hero-feature-dock" aria-label="Destaques da plataforma">
          <article class="hero-feature-card">
            <span class="hero-feature-icon"><Store :size="30" stroke-width="1.8" /></span>
            <div><h2>Loja pronta para vender</h2><p>Catálogo, carrinho e checkout na mesma experiência.</p></div>
          </article>
          <article class="hero-feature-card">
            <span class="hero-feature-icon"><BarChart3 :size="30" stroke-width="1.8" /></span>
            <div><h2>Gestão em um só lugar</h2><p>Pedidos, pagamentos e clientes no mesmo painel.</p></div>
          </article>
        </div>
      </section>

      <MarketingLogoCarousel :items="brandLogos">
        <template #label>Uma plataforma para <mark>negócios reais</mark></template>
      </MarketingLogoCarousel>

      <section id="jornada" class="journey-scroll bg-white">
        <div class="journey-pin flex min-h-screen items-center py-24 lg:py-12">
          <div class="site-container w-full">
            <div class="section-reveal mb-14 max-w-3xl"><span class="site-label">Uma venda movimenta tudo</span><h2 class="site-title">Da primeira visita<br>à próxima compra.</h2><p class="site-copy">Cada etapa conversa com a seguinte. Você acompanha a operação sem alternar entre ferramentas e planilhas.</p></div>
            <div class="hidden gap-14 lg:grid lg:grid-cols-[.72fr_1.28fr]">
              <div class="relative pl-8">
                <span class="journey-progress absolute inset-y-2 left-0 w-px bg-border"><span class="journey-progress-fill block h-full w-full origin-top scale-y-0 bg-primary"></span></span>
                <button v-for="(step,index) in journeySteps" :key="step.label" type="button" class="journey-step block w-full border-b border-border py-5 text-left" :class="{ active: activeJourney === index }" :aria-pressed="activeJourney === index" @click="activeJourney = index"><span class="text-[10px] font-semibold text-primary">0{{ index + 1 }} · {{ step.label }}</span><strong class="mt-2 block text-xl leading-tight">{{ step.title }}</strong><span class="mt-2 block max-w-sm text-xs leading-5 text-muted-foreground">{{ step.description }}</span></button>
              </div>
              <div class="journey-stage relative min-h-[450px] overflow-hidden rounded-[28px] border border-border bg-[#edf2f0] p-7">
                <Transition name="journey" mode="out-in">
                  <div :key="activeJourney" class="journey-scene h-full">
                    <div class="mb-7 flex items-center gap-2 text-[9px] font-semibold text-muted-foreground"><span class="size-2 rounded-full bg-primary"></span>{{ journeySteps[activeJourney]?.label }} em movimento</div>
                    <div v-if="activeJourney === 0" class="storefront-preview mx-auto max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"><div class="flex items-center justify-between border-b border-border px-5 py-4 text-[9px]"><b>CASA NATIVA</b><span>Produtos&nbsp;&nbsp; Sobre&nbsp;&nbsp; Carrinho</span></div><div class="grid grid-cols-[1.1fr_.9fr] items-center gap-5 p-7"><div><small class="text-[8px] text-primary">Novidades da semana</small><h3 class="mt-2 text-2xl font-semibold tracking-tight">Cuidado que faz parte da rotina.</h3><button class="mt-5 rounded-lg bg-primary px-4 py-2 text-[8px] font-semibold text-white">Comprar agora</button></div><div class="aspect-[4/5] rounded-xl bg-[linear-gradient(145deg,#dcebe4,#b7cfc3)] p-4"><div class="mx-auto mt-8 h-28 w-16 rounded-[14px_14px_8px_8px] bg-white shadow-lg"></div></div></div></div>
                    <div v-else-if="activeJourney === 1" class="checkout-preview mx-auto grid max-w-lg grid-cols-[1fr_.72fr] overflow-hidden rounded-2xl bg-white shadow-xl"><div class="p-7"><h3 class="text-sm font-bold">Finalizar compra</h3><div class="mt-5 grid gap-3"><div class="h-10 rounded-lg border border-border px-3 py-2 text-[9px] text-muted-foreground">Nome completo</div><div class="h-10 rounded-lg border border-border px-3 py-2 text-[9px] text-muted-foreground">Endereço de entrega</div><div class="grid grid-cols-2 gap-3"><div class="h-10 rounded-lg border border-primary bg-emerald-50 p-3 text-[8px] font-bold text-primary">Pix</div><div class="h-10 rounded-lg border border-border p-3 text-[8px]">Cartão</div></div><button class="mt-2 rounded-lg bg-primary p-3 text-[9px] font-bold text-white">Pagar com segurança</button></div></div><aside class="bg-[#f7f9f8] p-6 text-[9px]"><b>Seu pedido</b><div class="mt-5 flex gap-3"><div class="size-12 rounded-lg bg-[#dcebe4]"></div><span>Vitamina C<br><b>R$ 48,00</b></span></div><div class="mt-6 border-t border-border pt-4"><span class="flex justify-between"><span>Total</span><b>R$ 48,00</b></span></div></aside></div>
                    <div v-else-if="activeJourney === 2" class="orders-preview mock-window mx-auto max-w-xl"><div class="mock-nav"><b class="mr-auto text-[10px]">Pedidos</b><Search :size="12"/><Bell :size="12"/></div><div class="p-6"><div class="flex items-center"><h3 class="text-lg font-bold">Pedido #1052</h3><span class="ml-auto rounded-full bg-emerald-50 px-3 py-1 text-[8px] font-bold text-primary">Pagamento aprovado</span></div><div class="mt-6 grid grid-cols-3 gap-3"><div v-for="item in [['Cliente','Ana Clara'],['Entrega','Transportadora'],['Total','R$ 349,90']]" :key="item[0]" class="rounded-xl border border-border p-4 text-[8px]"><span class="text-muted-foreground">{{ item[0] }}</span><b class="mt-1 block">{{ item[1] }}</b></div></div><div class="mt-5 rounded-xl border border-border p-4"><div class="flex items-center gap-3 text-[9px]"><CheckCircle2 :size="16" class="text-primary"/><b>Estoque atualizado automaticamente</b></div><div class="mt-3 flex items-center gap-3 text-[9px]"><CheckCircle2 :size="16" class="text-primary"/><b>Cliente adicionado à base</b></div></div></div></div>
                    <div v-else class="whatsapp-preview mx-auto max-w-sm overflow-hidden rounded-[24px] border-[7px] border-[#173c30] bg-[#eef4f1] shadow-xl"><div class="bg-[#173c30] px-5 py-4 text-[10px] font-bold text-white">Elínea <span class="block text-[7px] font-normal text-white/60">automação ativa</span></div><div class="space-y-3 p-5 text-[9px]"><div class="mr-8 rounded-xl rounded-tl-sm bg-white p-3 shadow-sm">Olá, Ana! Seu pedido foi confirmado e já estamos preparando tudo.</div><div class="ml-12 rounded-xl rounded-tr-sm bg-[#d8f5e5] p-3 shadow-sm">Ótimo, obrigada!</div><div class="mr-5 rounded-xl rounded-tl-sm bg-white p-3 shadow-sm">Quando quiser comprar novamente, sua loja está a um toque de distância.</div></div></div>
                  </div>
                </Transition>
              </div>
            </div>
            <div class="grid gap-4 lg:hidden"><article v-for="(step,index) in journeySteps" :key="step.label" class="reveal-card rounded-2xl border border-border bg-[#f7f9f8] p-6"><span class="grid size-10 place-items-center rounded-xl bg-emerald-50 text-primary"><component :is="step.icon" :size="19"/></span><small class="mt-5 block font-semibold text-primary">0{{ index + 1 }} · {{ step.label }}</small><h3 class="mt-2 text-xl font-semibold tracking-tight">{{ step.title }}</h3><p class="mt-2 text-sm leading-6 text-muted-foreground">{{ step.description }}</p></article></div>
          </div>
        </div>
      </section>

      <section id="recursos" class="ecosystem-section py-24 lg:py-36">
        <div class="site-container">
          <div class="section-reveal mx-auto max-w-3xl text-center"><span class="site-label">Um ecossistema, não um quebra-cabeça</span><h2 class="site-title">Tudo o que vende<br>trabalhando junto.</h2><p class="site-copy mx-auto">O Elínea conecta as ferramentas essenciais da operação e continua preparado para receber novos módulos e integrações.</p></div>
          <div class="ecosystem-map relative mx-auto mt-16 max-w-5xl">
            <svg class="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" viewBox="0 0 1000 560" fill="none" aria-hidden="true"><path v-for="path in ['M500 280 L170 105','M500 280 L500 70','M500 280 L830 105','M500 280 L875 280','M500 280 L830 455','M500 280 L500 490','M500 280 L170 455','M500 280 L125 280']" :key="path" class="ecosystem-line" :d="path" stroke="#79b99e" stroke-width="1.4"/></svg>
            <div class="ecosystem-grid relative grid grid-cols-2 gap-3 lg:grid-cols-3 lg:grid-rows-3 lg:gap-10">
              <article v-for="(module,index) in ecosystemModules" :key="module.title" class="reveal-card ecosystem-module" :class="`module-${index + 1}`"><span class="grid size-10 place-items-center rounded-xl bg-emerald-50 text-primary"><component :is="module.icon" :size="18"/></span><div><h3 class="text-sm font-bold">{{ module.title }}</h3><p class="mt-1 text-[10px] text-muted-foreground">{{ module.detail }}</p></div></article>
              <div class="ecosystem-core col-span-2 grid min-h-36 place-items-center rounded-[26px] bg-[#173c30] p-7 text-center text-white lg:col-span-1 lg:col-start-2 lg:row-start-2"><div><span class="text-xl font-extrabold tracking-[.12em]"><i class="not-italic text-[#5cdda4]">.</i>ELÍNEA</span><p class="mt-2 text-[10px] text-white/60">Uma operação conectada</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <section class="complexity-section border-y border-border bg-white py-24 lg:py-32">
        <div class="site-container grid gap-14 lg:grid-cols-[.7fr_1.3fr]">
          <div class="section-reveal"><span class="site-label">Tecnologia sem peso</span><h2 class="site-title">Você cuida do negócio.<br>O Elínea organiza o digital.</h2><p class="site-copy">Uma estrutura profissional sem precisar contratar uma equipe técnica ou integrar várias ferramentas por conta própria.</p><MarketingButton class="mt-8" variant="solid" href="#planos">Começar com suporte<template #icon><ArrowRight :size="15"/></template></MarketingButton></div>
          <div class="comparison-grid grid gap-4 sm:grid-cols-2"><article class="comparison-card border border-border bg-[#f6f7f6] p-7"><span class="text-xs font-semibold text-muted-foreground">Montando sozinho</span><ul class="mt-7 grid gap-4 text-sm text-muted-foreground"><li v-for="item in ['Hospedagem e manutenção','Integrações manuais','Fornecedores separados','Atualizações e correções']" :key="item" class="flex items-center gap-3"><X :size="16" class="shrink-0 text-[#9ba49f]"/>{{ item }}</li></ul></article><article class="comparison-card integrated border border-[#b9decf] bg-[#edf8f2] p-7"><span class="text-xs font-semibold text-primary">Operando com Elínea</span><ul class="mt-7 grid gap-4 text-sm font-medium"><li v-for="item in ['Estrutura pronta para vender','Recursos trabalhando juntos','Uma operação centralizada','Evolução contínua da plataforma']" :key="item" class="flex items-center gap-3"><CheckCircle2 :size="16" class="shrink-0 text-primary"/>{{ item }}</li></ul></article></div>
        </div>
      </section>

      <section id="solucoes" class="site-container py-24 lg:py-32">
        <div class="section-reveal max-w-3xl"><span class="site-label">Feito para quem vende de verdade</span><h2 class="site-title">O mesmo núcleo.<br>Diferentes negócios.</h2><p class="site-copy">Começamos perto das farmácias de manipulação e construímos uma plataforma capaz de acompanhar muitos outros segmentos.</p></div>
        <div class="mt-12 grid gap-px overflow-hidden rounded-[24px] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4"><article v-for="item in [{i:Pill,t:'Farmácias de manipulação',d:'Catálogo especializado e venda direta.'},{i:Store,t:'Lojas especializadas',d:'Uma vitrine profissional para o seu nicho.'},{i:Building2,t:'Pequenos varejistas',d:'Comece no digital com estrutura.'},{i:LayoutTemplate,t:'Marcas próprias',d:'Presença digital sem depender de marketplaces.'}]" :key="item.t" class="reveal-card segment-card bg-white p-7"><component :is="item.i" :size="25" class="text-primary"/><h3 class="mt-8 text-sm font-bold">{{ item.t }}</h3><p class="mt-2 text-xs leading-5 text-muted-foreground">{{ item.d }}</p></article></div>
      </section>

      <section id="planos" class="plans-section py-24 lg:py-32"><div class="site-container"><div class="section-reveal flex flex-wrap items-end justify-between gap-5"><div><span class="site-label">Planos para o seu momento</span><h2 class="site-title">Comece com o que precisa.<br>Evolua quando fizer sentido.</h2></div><div class="join rounded-xl border border-border bg-white p-1 text-[10px] font-semibold"><button class="join-item rounded-lg bg-primary px-5 py-2 text-white">Mensal</button><button class="join-item px-5 py-2">Anual <small class="ml-1 text-primary">Economize até 20%</small></button></div></div><div v-if="plansError" class="alert alert-error mt-8 text-sm"><span>{{ plansError }}</span><MarketingButton variant="outline" type="button" @click="loadPlans">Tentar novamente</MarketingButton></div><div v-if="plansLoading" class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div v-for="item in 4" :key="item" class="skeleton h-[430px] rounded-2xl"></div></div><div v-else class="mt-10 grid gap-4 sm:grid-cols-2" :class="plans.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'"><article v-for="(plan,index) in plans" :key="plan.id" class="plan-card soft-card relative flex min-h-[430px] flex-col p-6" :class="index === 1 ? 'featured-plan border-primary ring-1 ring-primary' : ''"><span v-if="index === 1" class="absolute -top-3 right-5 rounded-full bg-primary px-4 py-1 text-[9px] font-bold text-white">Mais escolhido</span><h3 class="text-base font-bold">{{ plan.name }}</h3><p class="mt-1 min-h-10 text-[10px] text-muted-foreground">{{ plan.description }}</p><div class="mt-5"><span class="text-xs">R$</span> <strong class="text-3xl tracking-tight">{{ money(plan.monthly_amount).replace('R$ ','') }}</strong><span class="text-[10px] text-muted-foreground">/mês</span></div><ul class="mt-6 grid gap-2 text-[11px]"><li class="flex gap-2"><Check :size="14" class="text-primary"/>{{ plan.product_limit ? `Até ${plan.product_limit.toLocaleString('pt-BR')} produtos` : 'Produtos ilimitados' }}</li><li v-for="feature in plan.features" :key="feature" class="flex gap-2"><Check :size="14" class="shrink-0 text-primary"/>{{ feature }}</li></ul><MarketingButton class="mt-auto w-full" :variant="index === 1 ? 'solid' : 'outline'" type="button" @click="openCheckout(plan)">Começar agora</MarketingButton></article></div><p v-if="plans.length" class="mt-5 text-center text-[9px] text-muted-foreground">A implantação inclui configuração, treinamento, personalização e publicação.</p></div></section>

      <section class="closing-cta py-16"><div class="site-container flex flex-col items-start justify-between gap-8 md:flex-row md:items-center"><div><span class="text-xs font-semibold text-primary">Sua operação pode começar simples.</span><h2 class="mt-3 text-3xl font-semibold tracking-[-.045em] sm:text-4xl">Seu negócio já existe.<br>Agora ele pode vender online.</h2></div><div><MarketingButton variant="solid" href="#planos">Criar minha loja<template #icon><ArrowRight :size="15"/></template></MarketingButton><p class="mt-3 text-[10px] text-muted-foreground">Setup assistido e suporte de verdade.</p></div></div></section>
    </main>

    <footer id="rodape" class="site-footer border-t py-12"><div class="site-container grid gap-10 md:grid-cols-[1.2fr_2fr_auto]"><div><a href="#inicio" class="text-lg font-extrabold tracking-widest"><span class="text-primary">.</span>ELÍNEA</a><p class="mt-3 text-[10px] text-muted-foreground">Ecommerce simples para negócios reais.</p></div><div class="grid grid-cols-2 gap-8 text-[10px] sm:grid-cols-4"><div><b>Produto</b><a class="mt-3 block text-muted-foreground" href="#jornada">Como funciona</a><a class="mt-2 block text-muted-foreground" href="#recursos">Ecossistema</a><a class="mt-2 block text-muted-foreground" href="#planos">Preços</a></div><div><b>Soluções</b><a class="mt-3 block text-muted-foreground" href="#solucoes">Farmácias</a><a class="mt-2 block text-muted-foreground" href="#solucoes">Lojas especializadas</a><a class="mt-2 block text-muted-foreground" href="#solucoes">Pequenos negócios</a></div><div><b>Plataforma</b><a class="mt-3 block text-muted-foreground" href="#">Documentação</a><a class="mt-2 block text-muted-foreground" href="#">Integrações</a><a class="mt-2 block text-muted-foreground" href="#">Status</a></div><div><b>Empresa</b><a class="mt-3 block text-muted-foreground" href="#">Sobre</a><a class="mt-2 block text-muted-foreground" href="#">Contato</a><a class="mt-2 block text-muted-foreground" href="#">Privacidade</a></div></div><div class="flex gap-3 text-muted-foreground"><MessageCircle :size="17"/><Mail :size="17"/></div></div><div class="footer-wordmark mt-14 py-5 text-center" aria-hidden="true">ELÍNEA</div><div class="site-container mt-8 text-right text-[9px] text-muted-foreground">© 2026 Elínea. Todos os direitos reservados.</div></footer>

    <dialog class="modal" :class="{ 'modal-open': checkoutOpen }" @click.self="closeCheckout">
      <section class="modal-box max-w-2xl border border-border bg-popover text-popover-foreground shadow-2xl">
        <button class="btn btn-ghost btn-sm btn-circle absolute top-4 right-4" type="button" aria-label="Fechar" @click="closeCheckout"><X :size="18"/></button>
        <span class="site-label">Implantação Elínea</span><h2 class="text-lg font-semibold">Comece com o plano {{ selectedPlan?.name }}</h2><p class="mt-1 text-sm text-muted-foreground">Preencha os dados do responsável. Na próxima etapa, o pagamento será processado com segurança pela Stripe.</p>
        <form class="mt-6 grid gap-4 sm:grid-cols-2" novalidate @submit.prevent="submitCheckout">
          <label class="grid gap-1.5 text-xs font-medium text-muted-foreground"><span>Seu nome <em class="text-error not-italic">*</em></span><input v-model="form.owner_name" class="input h-11 w-full rounded-lg border-border px-3 text-sm focus:outline-none" :class="formErrors.owner_name ? 'input-error' : ''" :aria-invalid="!!formErrors.owner_name" maxlength="255" autocomplete="name" @input="clearError('owner_name')"><small v-if="formErrors.owner_name" class="text-error">{{ formErrors.owner_name }}</small></label>
          <label class="grid gap-1.5 text-xs font-medium text-muted-foreground"><span>E-mail <em class="text-error not-italic">*</em></span><input v-model="form.owner_email" class="input h-11 w-full rounded-lg border-border px-3 text-sm focus:outline-none" :class="formErrors.owner_email ? 'input-error' : ''" :aria-invalid="!!formErrors.owner_email" type="email" maxlength="255" autocomplete="email" @input="clearError('owner_email')"><small v-if="formErrors.owner_email" class="text-error">{{ formErrors.owner_email }}</small></label>
          <label class="grid gap-1.5 text-xs font-medium text-muted-foreground">Telefone<input v-model="form.phone" class="input h-11 w-full rounded-lg border-border px-3 text-sm focus:outline-none" maxlength="30" autocomplete="tel"></label>
          <label class="grid gap-1.5 text-xs font-medium text-muted-foreground"><span>Segmento <em class="text-error not-italic">*</em></span><input v-model="form.segment" class="input h-11 w-full rounded-lg border-border px-3 text-sm focus:outline-none" :class="formErrors.segment ? 'input-error' : ''" :aria-invalid="!!formErrors.segment" maxlength="100" placeholder="Moda, beleza..." @input="clearError('segment')"><small v-if="formErrors.segment" class="text-error">{{ formErrors.segment }}</small></label>
          <label class="grid gap-1.5 text-xs font-medium text-muted-foreground sm:col-span-2"><span>Nome da loja <em class="text-error not-italic">*</em></span><input v-model="form.store_name" class="input h-11 w-full rounded-lg border-border px-3 text-sm focus:outline-none" :class="formErrors.store_name ? 'input-error' : ''" :aria-invalid="!!formErrors.store_name" maxlength="255" autocomplete="organization" @input="clearError('store_name')"><small v-if="formErrors.store_name" class="text-error">{{ formErrors.store_name }}</small></label>
          <div v-if="submitError" class="alert alert-error py-3 text-sm sm:col-span-2">{{ submitError }}</div>
          <div class="modal-action mt-2 sm:col-span-2"><MarketingButton variant="outline" type="button" @click="closeCheckout">Cancelar</MarketingButton><MarketingButton variant="solid" type="submit" :disabled="submitting"><span v-if="submitting" class="loading loading-spinner loading-xs"></span>{{ submitting ? 'Abrindo pagamento...' : `Continuar — ${money(selectedPlan?.implementation_amount || 0)}` }}<template #icon><ArrowRight v-if="!submitting" :size="16"/></template></MarketingButton></div>
        </form>
      </section>
    </dialog>
  </div>
</template>
