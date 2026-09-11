<script setup lang="ts">
import {
  ArrowRight, BarChart3, Bell, Boxes, Building2, Check, CheckCircle2, ChevronRight,
  Camera, CircleUserRound, LayoutTemplate, Mail, Menu,
  MessageCircle, Package, Percent, Pill, Search, ShoppingBag, Store, Tag, Users, X
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
const plans = ref<Plan[]>([])
const plansLoading = ref(true)
const plansError = ref('')
const checkoutOpen = ref(false)
const selectedPlan = ref<Plan | null>(null)
const submitting = ref(false)
const submitError = ref('')
const mobileMenuOpen = ref(false)
const form = reactive({ owner_name: '', owner_email: '', phone: '', store_name: '', segment: '' })
const formErrors = reactive<Partial<Record<FormKey, string>>>({})

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

onMounted(loadPlans)
</script>

<template>
  <div class="overflow-x-hidden bg-white">
    <header class="fixed inset-x-0 top-0 z-40 border-b border-white/60 bg-white/90 backdrop-blur-xl">
      <div class="site-container flex h-[72px] items-center gap-8">
        <a href="#inicio" class="text-[21px] font-extrabold tracking-[.12em]" aria-label="Elínea — início"><span class="text-primary">.</span>ELÍNEA</a>
        <nav class="ml-auto hidden items-center gap-8 text-xs font-semibold text-muted-foreground lg:flex" aria-label="Navegação principal">
          <a class="transition hover:text-primary" href="#produto">Produto</a>
          <a class="transition hover:text-primary" href="#recursos">Recursos</a>
          <a class="transition hover:text-primary" href="#solucoes">Soluções</a>
          <a class="transition hover:text-primary" href="#planos">Preços</a>
          <a class="transition hover:text-primary" href="#rodape">Desenvolvedores</a>
        </nav>
        <a class="ml-auto hidden text-xs font-semibold text-muted-foreground hover:text-primary sm:block lg:ml-8" href="https://admin.elinea.com.br">Entrar</a>
        <a class="site-btn hidden sm:inline-flex" href="#planos">Criar minha loja <ArrowRight :size="15" /></a>
        <button class="btn btn-ghost btn-square ml-auto lg:hidden" type="button" aria-label="Alternar menu" @click="mobileMenuOpen = !mobileMenuOpen">
          <X v-if="mobileMenuOpen" :size="22" /><Menu v-else :size="22" />
        </button>
      </div>
      <nav v-if="mobileMenuOpen" class="grid gap-1 border-t border-border bg-white p-5 text-sm font-medium lg:hidden">
        <a v-for="item in [{l:'Produto',h:'#produto'},{l:'Recursos',h:'#recursos'},{l:'Soluções',h:'#solucoes'},{l:'Preços',h:'#planos'}]" :key="item.h" class="rounded-lg px-3 py-2 hover:bg-accent" :href="item.h" @click="mobileMenuOpen=false">{{ item.l }}</a>
        <a class="rounded-lg px-3 py-2 hover:bg-accent" href="https://admin.elinea.com.br">Entrar</a>
      </nav>
    </header>

    <main>
      <section id="inicio" class="hero-wash relative pt-[72px]">
        <div class="site-container grid min-h-[650px] items-center gap-14 py-20 lg:grid-cols-[.88fr_1.12fr] lg:py-24">
          <div class="relative z-10">
            <span class="site-label">Mais vendas. Menos complicação.</span>
            <h1 class="max-w-[580px] text-[2.65rem] leading-[1.02] font-bold tracking-[-.055em] sm:text-[4rem]">Ecommerce simples<br>para negócios reais.</h1>
            <p class="site-copy max-w-[510px] text-base">Crie sua loja, venda online e gerencie seu negócio em uma plataforma feita para simplificar o ecommerce.</p>
            <div class="mt-8 flex flex-wrap gap-3">
              <a class="site-btn" href="#planos">Criar minha loja <ArrowRight :size="16" /></a>
              <a class="site-btn-outline" href="#produto">Conhecer a plataforma</a>
            </div>
            <div class="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[12px] font-medium text-muted-foreground">
              <span class="flex items-center gap-2"><CheckCircle2 :size="15" class="text-primary" /> Sem fidelidade</span>
              <span class="flex items-center gap-2"><CheckCircle2 :size="15" class="text-primary" /> Suporte humanizado</span>
              <span class="flex items-center gap-2"><CheckCircle2 :size="15" class="text-primary" /> Setup rápido</span>
            </div>
          </div>

          <div class="relative mx-auto h-[420px] w-full max-w-[650px] lg:h-[485px]" aria-label="Prévia do painel Elínea">
            <div class="absolute inset-x-2 top-5 h-[350px] rounded-[42%] bg-cyan-200/30 blur-3xl"></div>
            <div class="mock-window absolute top-8 right-3 left-0 rotate-[2deg] sm:left-8">
              <div class="mock-nav"><b class="mr-auto text-[11px] tracking-widest"><span class="text-primary">.</span>ELÍNEA</b><Bell :size="12" class="text-muted-foreground" /><CircleUserRound :size="18" /></div>
              <div class="grid h-[315px] grid-cols-[105px_1fr] sm:grid-cols-[130px_1fr]">
                <aside class="border-r border-border p-3">
                  <div class="mock-side-item"><BarChart3 :size="12" /> Início</div><div class="mock-side-item active"><ShoppingBag :size="12" /> Pedidos</div><div class="mock-side-item"><Package :size="12" /> Produtos</div><div class="mock-side-item"><Users :size="12" /> Clientes</div><div class="mock-side-item"><Percent :size="12" /> Marketing</div>
                </aside>
                <div class="p-4 sm:p-6"><p class="text-[10px] text-muted-foreground">Olá, João!</p><h3 class="mt-1 text-base font-bold">Seu negócio hoje</h3>
                  <div class="mt-5 grid grid-cols-2 gap-3"><div class="rounded-lg border border-border p-3"><small class="text-[8px] text-muted-foreground">Faturamento</small><b class="mt-1 block text-base">R$ 4.280,90</b><span class="text-[8px] text-primary">↗ 12% este mês</span></div><div class="rounded-lg border border-border p-3"><small class="text-[8px] text-muted-foreground">Pedidos</small><b class="mt-1 block text-base">48</b><span class="text-[8px] text-primary">8 em andamento</span></div></div>
                  <div class="mt-4 rounded-lg border border-border p-3"><div class="flex items-center justify-between text-[8px]"><b>Vendas dos últimos 7 dias</b><span>R$ 4.280,90</span></div><svg class="mt-3 h-20 w-full" viewBox="0 0 300 70" fill="none"><path d="M0 61 C28 60 35 28 63 37 S102 62 126 38 S161 7 184 24 S218 58 241 40 S270 16 300 9" stroke="#079455" stroke-width="2"/><path d="M0 61 C28 60 35 28 63 37 S102 62 126 38 S161 7 184 24 S218 58 241 40 S270 16 300 9 V70 H0Z" fill="url(#heroChart)"/><defs><linearGradient id="heroChart" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#22c55e" stop-opacity=".22"/><stop offset="1" stop-color="#22c55e" stop-opacity="0"/></linearGradient></defs></svg></div>
                </div>
              </div>
            </div>
            <div class="phone-frame float-card absolute right-0 bottom-0 w-[170px] overflow-hidden bg-white sm:w-[190px]">
              <div class="flex items-center justify-between bg-white px-4 py-3 text-[8px] font-bold"><span>9:01</span><span class="h-2 w-12 rounded-full bg-slate-900"></span></div>
              <div class="border-y border-border p-3"><b class="text-[10px]">PharmaVida</b><p class="text-[7px] text-muted-foreground">Manipulação</p></div>
              <div class="h-28 bg-[radial-gradient(circle_at_60%_50%,#c9a57c_0_10%,transparent_11%),linear-gradient(135deg,#f5efe8,#e8ddd0)]"></div>
              <div class="p-3"><b class="text-[11px] leading-tight">Saúde personalizada para uma vida melhor.</b><button class="btn mt-3 h-8 min-h-8 w-full rounded-md border-0 bg-primary text-[8px] text-white">Comprar agora</button></div>
            </div>
          </div>
        </div>
      </section>

      <section class="border-y border-border bg-white py-9">
        <div class="site-container"><p class="text-center text-[9px] font-bold tracking-[.2em] text-muted-foreground uppercase">Negócios reais já vendem com a Elínea</p><div class="mt-7 grid grid-cols-2 gap-6 text-center text-sm font-bold text-slate-400 sm:grid-cols-3 lg:grid-cols-6"><span>✤ PharmaVida</span><span>✣ NUTRIMAX</span><span>◈ essência</span><span>◉ FórmulaCerta</span><span>⌘ BioAtiva</span><span>◍ DermaPlus</span></div></div>
      </section>

      <section id="produto" class="site-container grid items-center gap-14 py-24 lg:grid-cols-2 lg:py-32">
        <div class="mock-window order-2 lg:order-1">
          <div class="mock-nav"><span class="mock-dot bg-red-300"></span><span class="mock-dot bg-amber-300"></span><span class="mock-dot bg-emerald-300"></span><b class="ml-2 text-[10px] tracking-wider">.ELÍNEA</b><span class="ml-auto rounded-md bg-slate-800 px-3 py-1 text-[7px] text-white">Salvar</span></div>
          <div class="grid min-h-[330px] grid-cols-[120px_1fr] gap-4 p-4"><aside class="rounded-xl border border-border p-3"><p class="text-[9px] font-bold">Escolha um tema</p><div class="mt-3 grid grid-cols-2 gap-2"><div v-for="name in ['Clean','Minimal','Natural','Moderno']" :key="name"><div class="h-14 rounded-md bg-[linear-gradient(135deg,#f0e8dd,#d9c5aa)]"></div><span class="text-[7px]">{{ name }}</span></div></div></aside><div class="grid place-items-center rounded-xl bg-[#eee9df] p-6 text-center"><div><p class="text-2xl font-bold tracking-tight">Beleza que<br>cuida de você</p><button class="mt-4 rounded-md bg-[#5d4c40] px-4 py-2 text-[8px] text-white">Ver produtos</button></div></div></div>
        </div>
        <div class="order-1 lg:order-2 lg:pl-12"><span class="site-label">Sua loja, do seu jeito.</span><h2 class="site-title">Crie, personalize<br>e publique.</h2><p class="site-copy">Escolha um tema, personalize com a identidade do seu negócio e coloque sua loja no ar em poucos cliques. Sem precisar desenvolver nada.</p><div class="mt-6 grid gap-2"><span v-for="item in ['Temas prontos e personalizáveis','Domínio próprio','Editor visual intuitivo','Sua loja online em minutos']" :key="item" class="check-line"><CheckCircle2 :size="16" />{{ item }}</span></div><a class="site-btn-outline mt-7" href="#planos">Conhecer os temas <ArrowRight :size="15" /></a></div>
      </section>

      <section id="recursos" class="mint-wash py-24 lg:py-32">
        <div class="site-container grid items-center gap-14 lg:grid-cols-[.78fr_1.22fr]">
          <div><span class="site-label">Gestão sem complicação.</span><h2 class="site-title">Uma operação inteira<br>em um único painel.</h2><p class="site-copy">Gerencie produtos, pedidos, clientes, cupons, relatórios e muito mais. Tudo em um só lugar, de forma simples e organizada.</p><div class="mt-7 grid gap-4"><div v-for="item in [{i:Package,t:'Produtos',d:'Cadastre e organize seu catálogo.'},{i:ShoppingBag,t:'Pedidos',d:'Acompanhe todo o ciclo de venda.'},{i:Users,t:'Clientes',d:'Tenha seus clientes organizados.'},{i:Tag,t:'Cupons e promoções',d:'Crie campanhas sem depender de desenvolvedor.'}]" :key="item.t" class="flex gap-3"><span class="grid size-10 shrink-0 place-items-center rounded-xl border border-emerald-100 bg-white text-primary"><component :is="item.i" :size="18" /></span><p class="text-[13px]"><b class="block">{{ item.t }}</b><span class="text-muted-foreground">{{ item.d }}</span></p></div></div></div>
          <div class="mock-window">
            <div class="mock-nav"><b class="mr-auto text-[11px] tracking-wider">.ELÍNEA</b><Search :size="13"/><Bell :size="13"/><CircleUserRound :size="18"/></div>
            <div class="grid min-h-[390px] grid-cols-[115px_1fr]"><aside class="border-r border-border p-3"><div class="mock-side-item"><BarChart3 :size="12"/> Início</div><div class="mock-side-item active"><ShoppingBag :size="12"/> Pedidos</div><div class="mock-side-item"><Package :size="12"/> Produtos</div><div class="mock-side-item"><Users :size="12"/> Clientes</div><div class="mock-side-item"><Percent :size="12"/> Marketing</div></aside><div class="p-5"><div class="flex items-center"><h3 class="text-lg font-bold">Pedidos</h3><button class="ml-auto rounded-md bg-primary px-3 py-2 text-[8px] font-semibold text-white">+ Novo pedido</button></div><div class="mt-5 flex gap-4 border-b border-border pb-2 text-[8px]"><b class="text-primary">Todos</b><span>Aguardando</span><span>Pagos</span><span>Enviados</span></div><div class="mt-4 rounded-md border border-border p-2 text-[8px] text-muted-foreground">⌕ Buscar pedido, cliente ou produto...</div><div class="mt-3 overflow-hidden rounded-lg border border-border"><div v-for="(row,i) in [['#1052','Ana Clara Silva','Pago','R$ 349,90'],['#1051','Marcos Oliveira','Enviado','R$ 189,90'],['#1050','Juliana Costa','Pago','R$ 305,90'],['#1049','Rafael Lima','Aguardando','R$ 158,90'],['#1048','Fernanda Souza','Pago','R$ 279,90']]" :key="i" class="grid grid-cols-4 border-b border-border px-3 py-3 text-[7px] last:border-0"><b>{{ row[0] }}</b><span>{{ row[1] }}</span><span class="text-primary">{{ row[2] }}</span><span>{{ row[3] }}</span></div></div></div></div>
          </div>
        </div>
      </section>

      <section class="site-container grid items-center gap-14 py-24 lg:grid-cols-2 lg:py-32">
        <div class="relative mx-auto w-full max-w-[520px] pb-12">
          <div class="soft-card max-w-[310px] p-5"><h3 class="text-sm font-bold">Finalizar compra</h3><div class="mt-4 flex justify-between text-[8px] text-muted-foreground"><span class="text-primary">● Entrega</span><span>● Pagamento</span><span>● Revisão</span></div><label class="mt-5 block text-[8px] font-semibold">Número do cartão</label><div class="input mt-1 h-9 w-full rounded-lg border-border text-[9px]">1234 5678 9012 3456</div><div class="mt-3 grid grid-cols-2 gap-3"><div><label class="text-[8px]">Validade</label><div class="input mt-1 h-9 rounded-lg border-border text-[9px]">MM/AA</div></div><div><label class="text-[8px]">CVV</label><div class="input mt-1 h-9 rounded-lg border-border text-[9px]">123</div></div></div><button class="btn mt-5 h-9 min-h-9 w-full rounded-md border-0 bg-primary text-[9px] text-white">Pagar agora</button></div>
          <div class="float-card soft-card absolute right-0 bottom-0 grid w-[190px] place-items-center p-8 text-center"><CheckCircle2 :size="38" class="text-primary"/><b class="mt-3 text-xs">Pagamento aprovado!</b><span class="text-[8px] text-muted-foreground">Seu pedido foi confirmado.</span></div>
        </div>
        <div class="lg:pl-12"><span class="site-label">Venda. Receba. Acompanhe.</span><h2 class="site-title">Pagamentos online<br>sem complicação.</h2><p class="site-copy">Aceite pagamentos com segurança e ofereça uma experiência de compra completa para seus clientes.</p><div class="mt-6 grid gap-2"><span v-for="item in ['Checkout otimizado','Cartão, Pix e boleto','Integração com Fiserv','Acompanhamento em tempo real']" :key="item" class="check-line"><CheckCircle2 :size="16"/>{{ item }}</span></div><a class="site-btn-outline mt-7" href="#planos">Saiba mais sobre pagamentos <ArrowRight :size="15"/></a></div>
      </section>

      <section class="mint-wash overflow-hidden py-24 lg:py-28">
        <div class="site-container grid items-center gap-16 lg:grid-cols-[1fr_1.05fr]">
          <div><span class="site-label">Automações que geram resultados</span><h2 class="site-title">Sua loja continua<br>vendendo mesmo<br>depois que o cliente sai.</h2><p class="site-copy">Recupere carrinhos abandonados, envie lembretes, divulgue promoções e mantenha o relacionamento com seus clientes de forma automática.</p><div class="mt-6 grid gap-2"><span v-for="item in ['Recuperação de carrinho','Mensagens personalizadas','Campanhas e promoções','Integração com WhatsApp (via Twilio)']" :key="item" class="check-line"><CheckCircle2 :size="16"/>{{ item }}</span></div><a class="site-btn mt-7" href="#planos">Começar funciona <ArrowRight :size="15"/></a></div>
          <div class="relative mx-auto flex w-full max-w-[560px] items-center justify-center gap-5"><div class="phone-frame w-[230px] overflow-hidden bg-[#ecf3ed]"><div class="bg-[#087d59] px-4 py-4 text-[10px] font-semibold text-white">‹ &nbsp; Elínea <span class="block pl-4 text-[7px] font-normal text-white/70">online</span></div><div class="m-3 rounded-xl bg-white p-3 text-[9px]"><p>Olá, Ana! 👋</p><p>Você deixou alguns produtos no seu carrinho.</p><div class="mt-3 flex items-center gap-2 rounded-lg bg-stone-50 p-2"><div class="size-10 rounded bg-stone-200"></div><b>Vitamina C Manipulada<br>R$ 48,00</b></div><button class="btn mt-3 h-8 min-h-8 w-full rounded-md border-0 bg-primary text-[8px] text-white">Finalizar minha compra</button></div></div><div class="grid w-[215px] gap-4"><div v-for="item in [{i:ShoppingBag,t:'Carrinho abandonado'},{i:CheckCircle2,t:'Confirmação de pedido'},{i:Tag,t:'Promoções e novidades'},{i:Users,t:'Pós-venda'}]" :key="item.t" class="soft-card flex items-center gap-3 p-4 text-[10px] font-semibold"><component :is="item.i" :size="21" class="text-primary"/>{{ item.t }}</div></div></div>
        </div>
      </section>

      <section id="solucoes" class="site-container py-24">
        <div class="text-center"><span class="site-label">Planos para quem vende de verdade</span><h2 class="site-title">Soluções para diferentes tipos de negócios.</h2></div>
        <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><article v-for="item in [{i:Pill,t:'Farmácias de manipulação',d:'Venda seus produtos diretamente aos seus clientes.'},{i:Store,t:'Lojas físicas',d:'Leve seu catálogo para a internet.'},{i:Building2,t:'Pequenos negócios',d:'Comece a vender online rapidamente.'},{i:LayoutTemplate,t:'Marcas próprias',d:'Construa sua presença digital sem depender de marketplaces.'}]" :key="item.t" class="soft-card p-6"><component :is="item.i" :size="30" class="text-primary"/><h3 class="mt-5 text-sm font-bold">{{ item.t }}</h3><p class="mt-2 text-xs leading-5 text-muted-foreground">{{ item.d }}</p></article></div>
      </section>

      <section id="planos" class="bg-[#fbfcfc] py-24">
        <div class="site-container">
          <div class="flex flex-wrap items-end justify-between gap-5"><div><span class="site-label">Planos para o seu momento</span><h2 class="site-title">Escolha o plano ideal para o seu negócio.</h2></div><div class="join rounded-lg border border-border bg-white p-1 text-[10px] font-semibold"><button class="join-item rounded-md bg-primary px-5 py-2 text-white">Mensal</button><button class="join-item px-5 py-2">Anual <small class="ml-1 text-primary">Economize até 20%</small></button></div></div>
          <div v-if="plansError" class="alert alert-error mt-8 text-sm"><span>{{ plansError }}</span><button class="btn btn-sm" type="button" @click="loadPlans">Tentar novamente</button></div>
          <div v-if="plansLoading" class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div v-for="item in 4" :key="item" class="skeleton h-[430px] rounded-2xl"></div></div>
          <div v-else class="mt-10 grid gap-4 sm:grid-cols-2" :class="plans.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'">
            <article v-for="(plan,index) in plans" :key="plan.id" class="soft-card relative flex min-h-[430px] flex-col p-6" :class="index === 1 ? 'border-primary ring-1 ring-primary' : ''"><span v-if="index === 1" class="absolute -top-3 right-5 rounded-full bg-primary px-4 py-1 text-[9px] font-bold text-white">Mais escolhido</span><h3 class="text-base font-bold">{{ plan.name }}</h3><p class="mt-1 min-h-10 text-[10px] text-muted-foreground">{{ plan.description }}</p><div class="mt-5"><span class="text-xs">R$</span> <strong class="text-3xl tracking-tight">{{ money(plan.monthly_amount).replace('R$ ','') }}</strong><span class="text-[10px] text-muted-foreground">/mês</span></div><ul class="mt-6 grid gap-2 text-[11px]"><li class="flex gap-2"><Check :size="14" class="text-primary"/>{{ plan.product_limit ? `Até ${plan.product_limit.toLocaleString('pt-BR')} produtos` : 'Produtos ilimitados' }}</li><li v-for="feature in plan.features" :key="feature" class="flex gap-2"><Check :size="14" class="shrink-0 text-primary"/>{{ feature }}</li></ul><button class="btn mt-auto h-10 min-h-10 rounded-md text-xs" :class="index === 1 ? 'border-0 bg-primary text-white' : 'btn-outline border-primary text-primary hover:bg-primary hover:text-white'" type="button" @click="openCheckout(plan)">Começar agora</button></article>
          </div>
          <p v-if="plans.length" class="mt-5 text-center text-[9px] text-muted-foreground">Taxa de implantação informada no checkout, incluindo configuração, treinamento, personalização e publicação.</p>
        </div>
      </section>

      <section class="dark-cta py-12 text-white"><div class="site-container flex flex-col items-start justify-between gap-7 sm:flex-row sm:items-center"><div><h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Seu negócio já está pronto.<br>Agora falta sua loja.</h2><p class="mt-2 text-xs text-white/65">Crie sua loja com a Elínea e comece a vender online hoje mesmo.</p></div><div><a class="site-btn" href="#planos">Criar minha loja <ArrowRight :size="15"/></a><p class="mt-3 text-[9px] text-white/60">Sem fidelidade. Setup rápido. Suporte de verdade.</p></div></div></section>
    </main>

    <footer id="rodape" class="border-t border-border py-12"><div class="site-container grid gap-10 md:grid-cols-[1.2fr_2fr_auto]"><div><a href="#inicio" class="text-lg font-extrabold tracking-widest"><span class="text-primary">.</span>ELÍNEA</a><p class="mt-3 text-[10px] text-muted-foreground">Ecommerce simples para negócios reais.</p></div><div class="grid grid-cols-2 gap-8 text-[10px] sm:grid-cols-4"><div><b>Produto</b><a class="mt-3 block text-muted-foreground" href="#recursos">Recursos</a><a class="mt-2 block text-muted-foreground" href="#planos">Preços</a><a class="mt-2 block text-muted-foreground" href="#produto">Temas</a></div><div><b>Soluções</b><a class="mt-3 block text-muted-foreground" href="#solucoes">Farmácias</a><a class="mt-2 block text-muted-foreground" href="#solucoes">Lojas físicas</a><a class="mt-2 block text-muted-foreground" href="#solucoes">Pequenos negócios</a></div><div><b>Desenvolvedores</b><a class="mt-3 block text-muted-foreground" href="#">Documentação</a><a class="mt-2 block text-muted-foreground" href="#">API</a><a class="mt-2 block text-muted-foreground" href="#">Status</a></div><div><b>Empresa</b><a class="mt-3 block text-muted-foreground" href="#">Sobre</a><a class="mt-2 block text-muted-foreground" href="#">Contato</a><a class="mt-2 block text-muted-foreground" href="#">Privacidade</a></div></div><div class="flex gap-3 text-muted-foreground"><Camera :size="17"/><MessageCircle :size="17"/><Mail :size="17"/></div></div><div class="site-container mt-10 border-t border-border pt-6 text-right text-[9px] text-muted-foreground">© 2026 Elínea. Todos os direitos reservados.</div></footer>

    <dialog class="modal" :class="{ 'modal-open': checkoutOpen }" @click.self="closeCheckout">
      <section class="modal-box max-w-2xl border border-border bg-popover text-popover-foreground shadow-2xl">
        <button class="btn btn-ghost btn-sm btn-circle absolute top-4 right-4" type="button" aria-label="Fechar" @click="closeCheckout"><X :size="18"/></button>
        <span class="site-label">Implantação Elínea</span><h2 class="text-lg font-semibold">Comece com o plano {{ selectedPlan?.name }}</h2><p class="mt-1 text-sm text-muted-foreground">Preencha os dados do responsável. Na próxima etapa, o pagamento será processado com segurança pela Stripe.</p>
        <form class="mt-6 grid gap-4 sm:grid-cols-2" novalidate @submit.prevent="submitCheckout">
          <label class="grid gap-1.5 text-xs font-medium text-muted-foreground"><span>Seu nome <em class="text-error not-italic">*</em></span><input v-model="form.owner_name" class="input h-10 w-full rounded-lg border-border px-3 text-sm focus:outline-none" :class="formErrors.owner_name ? 'input-error' : ''" :aria-invalid="!!formErrors.owner_name" maxlength="255" autocomplete="name" @input="clearError('owner_name')"><small v-if="formErrors.owner_name" class="text-error">{{ formErrors.owner_name }}</small></label>
          <label class="grid gap-1.5 text-xs font-medium text-muted-foreground"><span>E-mail <em class="text-error not-italic">*</em></span><input v-model="form.owner_email" class="input h-10 w-full rounded-lg border-border px-3 text-sm focus:outline-none" :class="formErrors.owner_email ? 'input-error' : ''" :aria-invalid="!!formErrors.owner_email" type="email" maxlength="255" autocomplete="email" @input="clearError('owner_email')"><small v-if="formErrors.owner_email" class="text-error">{{ formErrors.owner_email }}</small></label>
          <label class="grid gap-1.5 text-xs font-medium text-muted-foreground">Telefone<input v-model="form.phone" class="input h-10 w-full rounded-lg border-border px-3 text-sm focus:outline-none" maxlength="30" autocomplete="tel"></label>
          <label class="grid gap-1.5 text-xs font-medium text-muted-foreground"><span>Segmento <em class="text-error not-italic">*</em></span><input v-model="form.segment" class="input h-10 w-full rounded-lg border-border px-3 text-sm focus:outline-none" :class="formErrors.segment ? 'input-error' : ''" :aria-invalid="!!formErrors.segment" maxlength="100" placeholder="Moda, beleza..." @input="clearError('segment')"><small v-if="formErrors.segment" class="text-error">{{ formErrors.segment }}</small></label>
          <label class="grid gap-1.5 text-xs font-medium text-muted-foreground sm:col-span-2"><span>Nome da loja <em class="text-error not-italic">*</em></span><input v-model="form.store_name" class="input h-10 w-full rounded-lg border-border px-3 text-sm focus:outline-none" :class="formErrors.store_name ? 'input-error' : ''" :aria-invalid="!!formErrors.store_name" maxlength="255" autocomplete="organization" @input="clearError('store_name')"><small v-if="formErrors.store_name" class="text-error">{{ formErrors.store_name }}</small></label>
          <div v-if="submitError" class="alert alert-error py-3 text-sm sm:col-span-2">{{ submitError }}</div>
          <div class="modal-action mt-2 sm:col-span-2"><button class="btn btn-outline rounded-lg" type="button" @click="closeCheckout">Cancelar</button><button class="btn rounded-lg border-0 bg-primary text-primary-foreground" type="submit" :disabled="submitting"><span v-if="submitting" class="loading loading-spinner loading-xs"></span>{{ submitting ? 'Abrindo pagamento...' : `Continuar — ${money(selectedPlan?.implementation_amount || 0)}` }}<ArrowRight v-if="!submitting" :size="16"/></button></div>
        </form>
      </section>
    </dialog>
  </div>
</template>
