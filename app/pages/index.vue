<script setup lang="ts">
import heroUrl from '~/assets/images/h3-slider-img-1.webp'
import logoUrl from '~/assets/images/elinea-logo.svg'
import logoWhiteUrl from '~/assets/images/elinea-logo-white.svg'
import SaleFlowSection from '~/components/home/SaleFlowSection.vue'
import EcosystemSection from '~/components/home/EcosystemSection.vue'
import OperationSection from '~/components/home/OperationSection.vue'
import ProductShotSection from '~/components/home/ProductShotSection.vue'
import SegmentsSection from '~/components/home/SegmentsSection.vue'
import IntegrationsSection from '~/components/home/IntegrationsSection.vue'
import PricingSection from '~/components/home/PricingSection.vue'
import {MarketingButton, MarketingSocialRail} from '@elinea/ui/marketing'
import {ArrowRight, Menu, X} from '@lucide/vue'

type Plan = {
  id: number; name: string; slug: string; description: string; monthly_amount: number | null;
  implementation_amount: number | null; implementation_label: string; features: string[];
  features_label?: string; note?: string; tone: 'neutral' | 'mint' | 'blue' | 'dark' | 'violet'; featured?: boolean;
}
type CheckoutResponse = { data: { public_id: string }, checkout_url: string }
type FormKey = 'owner_name' | 'owner_email' | 'segment' | 'store_name'

const config = useRuntimeConfig()
const pageRoot = ref<HTMLElement | null>(null)
const mobileMenuOpen = ref(false)
const headerScrolled = ref(false)
const checkoutOpen = ref(false)
const checkoutDialog = ref<HTMLDialogElement | null>(null)
const selectedPlan = ref<Plan | null>(null)
const submitting = ref(false)
const submitError = ref('')
const form = reactive({owner_name: '', owner_email: '', phone: '', store_name: '', segment: ''})
const formErrors = reactive<Partial<Record<FormKey, string>>>({})

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
  },
]

const money = (value: number) => new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0
}).format(value / 100)
const openCheckout = (plan: Plan) => {
  selectedPlan.value = plan;
  checkoutOpen.value = true;
  submitError.value = ''
}
const closeCheckout = () => {
  if (!submitting.value) checkoutOpen.value = false
}
const clearError = (field: FormKey) => {
  delete formErrors[field]
}
const validateForm = () => {
  Object.keys(formErrors).forEach(key => delete formErrors[key as FormKey])
  const required: Array<[FormKey, string]> = [['owner_name', 'Informe seu nome.'], ['owner_email', 'Informe seu e-mail.'], ['segment', 'Informe o segmento da loja.'], ['store_name', 'Informe o nome da loja.']]
  required.forEach(([field, message]) => {
    if (!form[field].trim()) formErrors[field] = message
  })
  if (form.owner_email && !/^\S+@\S+\.\S+$/.test(form.owner_email)) formErrors.owner_email = 'Informe um e-mail válido.'
  return Object.keys(formErrors).length === 0
}
const submitCheckout = async () => {
  if (!selectedPlan.value || !validateForm()) {
    await nextTick()
    document.querySelector<HTMLElement>('.checkout-modal [aria-invalid="true"]')?.focus()
    return
  }
  submitting.value = true;
  submitError.value = ''
  try {
    const origin = window.location.origin
    const response = await $fetch<CheckoutResponse>(`${config.public.apiBase}/implementation-checkouts`, {
      method: 'POST',
      body: {
        plan_id: selectedPlan.value.id, ...form,
        phone: form.phone || null,
        success_url: `${origin}/compra-concluida`,
        cancel_url: `${origin}/#planos`
      }
    })
    window.location.assign(response.checkout_url)
  } catch (error) {
    const data = typeof error === 'object' && error && 'data' in error ? (error as {
      data?: { message?: string, errors?: Record<string, string[]> }
    }).data : undefined
    submitError.value = data?.errors ? Object.values(data.errors).flat()[0] || '' : data?.message || 'Não foi possível iniciar o pagamento.'
  } finally {
    submitting.value = false
  }
}

let destroyMotion: (() => void) | undefined
const updateHeader = () => {
  headerScrolled.value = window.scrollY > 24
}

watch(checkoutOpen, async (isOpen) => {
  await nextTick()
  const dialog = checkoutDialog.value
  if (!dialog) return
  if (isOpen && !dialog.open) {
    dialog.showModal()
    dialog.querySelector<HTMLInputElement>('input')?.focus()
  } else if (!isOpen && dialog.open) dialog.close()
})

onMounted(async () => {
  updateHeader();
  window.addEventListener('scroll', updateHeader, {passive: true})
  const [{default: gsap}, {ScrollTrigger}] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
  gsap.registerPlugin(ScrollTrigger)
  if (!pageRoot.value) return
  const mm = gsap.matchMedia()
  const context = gsap.context(() => {
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({defaults: {ease: 'power3.out'}})
          .from('[data-header]', {y: -20, opacity: 0, duration: .65})
          .from('.hero-kicker', {y: 12, opacity: 0, duration: .5}, '-=.2')
          .from('.hero-line', {yPercent: 115, duration: .9, stagger: .09}, '-=.25')
          .from('.hero-support, .hero-action', {y: 15, opacity: 0, duration: .55, stagger: .07}, '-=.45')
          .from('.hero-photo', {opacity: 0, scale: 1.035, duration: 1.25}, '-=1.15')
      gsap.to('.hero-photo', {
        yPercent: 4,
        scale: 1.04,
        ease: 'none',
        scrollTrigger: {trigger: '#inicio', start: 'top top', end: 'bottom top', scrub: .8}
      })
      gsap.utils.toArray<HTMLElement>('.reveal-copy').forEach((block) => {
        const children = Array.from(block.children).filter(child => !child.matches('[data-operation-title]'))
        gsap.from(children, {
          opacity: 0,
          y: 34,
          duration: .75,
          stagger: .09,
          ease: 'power3.out',
          scrollTrigger: {trigger: block, start: 'top 82%', once: true}
        })
      })
      const operationTitle = document.querySelector<HTMLElement>('[data-operation-title]')
      if (operationTitle) {
        gsap.fromTo(operationTitle.querySelectorAll('[data-operation-char]'), {opacity: .14}, {
          opacity: 1,
          duration: 1,
          stagger: .035,
          ease: 'none',
          scrollTrigger: {trigger: operationTitle, start: 'top 88%', end: 'bottom 45%', scrub: .65}
        })
      }
      const path = document.querySelector<SVGPathElement>('[data-sale-path]')
      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, {strokeDasharray: length, strokeDashoffset: length});
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {trigger: '.sale-map', start: 'top 76%', end: 'bottom 58%', scrub: .7}
        })
      }
      gsap.from('.sale-step', {
        opacity: 0,
        y: 18,
        scale: .97,
        stagger: .16,
        duration: .5,
        scrollTrigger: {trigger: '.sale-map', start: 'top 72%', once: true}
      })
      gsap.from('.ecosystem-node', {
        opacity: 0,
        stagger: .08,
        duration: .55,
        ease: 'power2.out',
        scrollTrigger: {trigger: '.ecosystem-orbit', start: 'top 72%', once: true}
      })
      gsap.from('.control-card', {
        y: 70,
        opacity: 0,
        scale: .97,
        stagger: .2,
        ease: 'none',
        scrollTrigger: {trigger: '.control-stage', start: 'top 76%', end: 'bottom 58%', scrub: .65}
      })
      gsap.to('.control-stage__visual img', {
        yPercent: -3,
        scale: 1.06,
        ease: 'none',
        scrollTrigger: {trigger: '.control-stage', start: 'top bottom', end: 'bottom top', scrub: .8}
      })
    })
  }, pageRoot.value)
  destroyMotion = () => {
    mm.revert();
    context.revert()
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateHeader);
  checkoutDialog.value?.close();
  destroyMotion?.()
})
</script>

<template>
  <div ref="pageRoot" class="page-shell">
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <MarketingSocialRail :facebook-href="config.public.facebookUrl" :instagram-href="config.public.instagramUrl"/>
    <header data-header class="premium-header" :class="{ 'is-scrolled': headerScrolled }">
      <div class="site-container header-inner"><a href="#inicio" class="site-logo" aria-label="Elínea — início"><img
          class="logo-white" :src="logoWhiteUrl" alt=""><img class="logo-color" :src="logoUrl" alt=""></a>
        <nav class="desktop-nav" aria-label="Navegação principal"><a href="#inicio">Home</a><a href="#ecossistema">Plataforma</a><a
            href="#planos">Preços</a><a href="#produto">Recursos</a></nav>
        <a class="login-link" href="https://admin.elinea.com.br">Entrar</a>
        <MarketingButton class="header-cta" variant="solid" href="#planos">Criar minha loja
          <template #icon>
            <ArrowRight :size="15"/>
          </template>
        </MarketingButton>
        <button class="menu-toggle" type="button" aria-label="Alternar menu" :aria-expanded="mobileMenuOpen"
                aria-controls="menu-mobile" @click="mobileMenuOpen = !mobileMenuOpen">
          <X v-if="mobileMenuOpen" :size="23"/>
          <Menu v-else :size="23"/>
        </button>
      </div>
      <nav v-if="mobileMenuOpen" id="menu-mobile" class="mobile-nav" aria-label="Navegação móvel"><a
          v-for="item in [{ l: 'Home', h: '#inicio' }, { l: 'Plataforma', h: '#ecossistema' }, { l: 'Recursos', h: '#produto' }, { l: 'Soluções', h: '#solucoes' }, { l: 'Preços', h: '#planos' }]"
          :key="item.h" :href="item.h" @click="mobileMenuOpen = false">{{ item.l }}</a><a
          href="https://admin.elinea.com.br">Entrar</a></nav>
    </header>
    <main id="conteudo">
      <section id="inicio" class="hero-home"><img class="hero-photo" :src="heroUrl"
                                                  alt="Empreendedora trabalhando ao lado de um notebook"
                                                  fetchpriority="high">
        <div class="hero-overlay"></div>
        <div class="site-container hero-layout">
          <div class="hero-copy"><p class="hero-kicker"><span></span>Sua operação digital, bem resolvida</p>
            <h1 class="hero-title"><span><i class="hero-line">Ecommerce</i></span><span><i class="hero-line">simples para</i></span><span><i
                class="hero-line">negócios reais.</i></span></h1>
            <p class="hero-support">Uma plataforma completa para criar, gerenciar e fazer o seu negócio crescer, com
              mais vendas e menos complicação.</p>
            <div class="hero-actions">
              <MarketingButton class="hero-action" variant="primary" href="#planos">Criar minha loja
                <template #icon>
                  <ArrowRight :size="17"/>
                </template>
              </MarketingButton>
              <a class="hero-action hero-secondary" href="#jornada">Conhecer a plataforma
                <ArrowRight :size="15"/>
              </a></div>
          </div>
        </div>
      </section>
      <SaleFlowSection/>
      <EcosystemSection/>
      <OperationSection/>
      <ProductShotSection/>
      <SegmentsSection/>
      <IntegrationsSection/>
      <PricingSection :plans="plans" @select="openCheckout"/>
      <section class="chapter final-cta">
        <div class="site-container final-cta__inner reveal-copy"><p class="site-label">Pronto para o próximo
          movimento?</p>
          <h2 class="site-title">Seu negócio<br>pode vender<br>melhor.</h2>
          <p>Comece com uma estrutura simples hoje e evolua sem trocar de plataforma amanhã.</p>
          <div>
            <MarketingButton variant="primary" href="#planos">Criar minha loja
              <template #icon>
                <ArrowRight :size="18"/>
              </template>
            </MarketingButton>
            <a href="mailto:contato@elinea.com.br">Falar com especialista</a></div>
        </div>
      </section>
    </main>
    <footer id="rodape" class="site-footer">
      <div class="site-container footer-grid">
        <div class="footer-brand"><a href="#inicio" aria-label="Elínea — início"><img :src="logoWhiteUrl" alt="Elínea"></a>
          <p>Ecommerce simples para negócios reais.</p>
          <div class="footer-social"><a :href="config.public.facebookUrl" target="_blank" rel="noopener noreferrer"
                                        aria-label="Facebook"><span aria-hidden="true">f</span></a><a
              :href="config.public.instagramUrl" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><span
              aria-hidden="true">ig</span></a><a href="mailto:contato@elinea.com.br" aria-label="E-mail"><span
              aria-hidden="true">@</span></a></div>
        </div>
        <div class="footer-links">
          <div><b>Produto</b><a href="#jornada">Como funciona</a><a href="#produto">Recursos</a><a
              href="#planos">Preços</a></div>
          <div><b>Plataforma</b><a href="#integracoes">Integrações</a><a href="#solucoes">Segmentos</a><a
              href="#ecossistema">Ecossistema</a></div>
          <div><b>Empresa</b><a href="#">Sobre</a><a href="mailto:contato@elinea.com.br">Contato</a><a href="#">Privacidade</a>
          </div>
        </div>
        <div class="footer-news"><b>Receba novidades</b><a href="mailto:contato@elinea.com.br">Seu e-mail
          <ArrowRight :size="16"/>
        </a></div>
      </div>
      <div class="footer-wordmark" aria-hidden="true"><img :src="logoWhiteUrl" alt=""></div>
      <div class="site-container footer-bottom"><span>© 2026 Elínea. Todos os direitos reservados.</span><span>Feita para negócios reais.</span>
      </div>
    </footer>
    <dialog ref="checkoutDialog" class="modal" @close="checkoutOpen = false" @click.self="closeCheckout">
      <section class="modal-box checkout-modal">
        <button class="modal-close" type="button" aria-label="Fechar" @click="closeCheckout">
          <X :size="18"/>
        </button>
        <span class="site-label">Implantação Elínea</span>
        <h2>Comece com o plano {{ selectedPlan?.name }}</h2>
        <p>Preencha os dados do responsável. Na próxima etapa, o pagamento será processado com segurança pela
          Stripe.</p>
        <form novalidate @submit.prevent="submitCheckout"><label><span>Seu nome *</span><input v-model="form.owner_name"
                                                                                               :aria-invalid="!!formErrors.owner_name"
                                                                                               autocomplete="name"
                                                                                               @input="clearError('owner_name')"><small
            v-if="formErrors.owner_name" role="alert">{{
            formErrors.owner_name
          }}</small></label><label><span>E-mail *</span><input v-model="form.owner_email" type="email"
                                                               :aria-invalid="!!formErrors.owner_email"
                                                               autocomplete="email"
                                                               @input="clearError('owner_email')"><small
            v-if="formErrors.owner_email" role="alert">{{
            formErrors.owner_email
          }}</small></label><label><span>Telefone</span><input v-model="form.phone" type="tel"
                                                               autocomplete="tel"></label><label><span>Segmento *</span><input
            v-model="form.segment" :aria-invalid="!!formErrors.segment" @input="clearError('segment')"><small
            v-if="formErrors.segment" role="alert">{{ formErrors.segment }}</small></label><label class="full"><span>Nome da loja *</span><input
            v-model="form.store_name" :aria-invalid="!!formErrors.store_name" autocomplete="organization"
            @input="clearError('store_name')"><small v-if="formErrors.store_name" role="alert">{{
            formErrors.store_name
          }}</small></label>
          <p v-if="submitError" class="form-error full" role="alert">{{ submitError }}</p>
          <div class="modal-actions full">
            <MarketingButton variant="outline" type="button" @click="closeCheckout">Cancelar</MarketingButton>
            <MarketingButton variant="solid" type="submit" :disabled="submitting">{{
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
