<script setup lang="ts">
import { ArrowRight, Check, Layers3, Menu, PackageCheck, ShieldCheck, Sparkles, X } from '@lucide/vue'

type Plan = { id: number, name: string, slug: string, description: string | null, monthly_amount: number | string, implementation_amount: number | string, currency: string, product_limit: number | null, features: string[] }
type PlansResponse = { data: Plan[] }
type CheckoutResponse = { data: { public_id: string }, checkout_url: string }

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
const money = (value: number | string) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) / 100)

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

const submitCheckout = async () => {
  if (!selectedPlan.value) return
  submitting.value = true
  submitError.value = ''
  try {
    const origin = window.location.origin
    const response = await $fetch<CheckoutResponse>(`${config.public.apiBase}/implementation-checkouts`, { method: 'POST', body: {
      plan_id: selectedPlan.value.id, ...form, phone: form.phone || null,
      success_url: `${origin}/compra-concluida`, cancel_url: `${origin}/#planos`,
    } })
    window.location.assign(response.checkout_url)
  } catch (error) {
    const data = typeof error === 'object' && error && 'data' in error ? (error as { data?: { message?: string, errors?: Record<string, string[]> } }).data : undefined
    submitError.value = data?.errors ? Object.values(data.errors).flat()[0] || '' : data?.message || 'Não foi possível iniciar o pagamento.'
  } finally {
    submitting.value = false
  }
}

onMounted(loadPlans)
</script>

<template>
  <div>
    <header class="site-header"><div class="container header-inner">
      <a class="brand" href="#inicio" aria-label="Elínea — início"><span>e</span> elínea</a>
      <nav :class="{ open: mobileMenuOpen }" aria-label="Navegação principal"><a href="#recursos" @click="mobileMenuOpen = false">Recursos</a><a href="#como-funciona" @click="mobileMenuOpen = false">Como funciona</a><a href="#planos" @click="mobileMenuOpen = false">Planos</a><a class="login-link" href="https://admin.elinea.com.br">Entrar</a></nav>
      <a class="button button-small desktop-cta" href="#planos">Criar minha loja</a><button class="menu-button" type="button" aria-label="Abrir menu" @click="mobileMenuOpen = !mobileMenuOpen"><X v-if="mobileMenuOpen" :size="24" /><Menu v-else :size="24" /></button>
    </div></header>

    <main>
      <section id="inicio" class="hero"><div class="container hero-grid">
        <div class="hero-copy"><span class="eyebrow"><Sparkles :size="15" /> Ecommerce sem complicação</span><h1>Sua loja online pronta para <em>crescer com você.</em></h1><p>Catálogo, pedidos, pagamentos e gestão em uma plataforma feita para quem quer vender — sem precisar entender de tecnologia.</p><div class="hero-actions"><a class="button" href="#planos">Conhecer os planos <ArrowRight :size="18" /></a><a class="text-link" href="#como-funciona">Veja como funciona</a></div><div class="trust-row"><span><Check :size="16" /> Loja personalizada</span><span><Check :size="16" /> Suporte humano</span><span><Check :size="16" /> Ambiente seguro</span></div></div>
        <div class="hero-visual" aria-hidden="true"><div class="glow"></div><div class="dashboard-card"><div class="dashboard-top"><i></i><i></i><i></i><span>Visão geral</span></div><div class="metric-row"><div><small>Vendas do mês</small><strong>R$ 18.420</strong><b>+24%</b></div><div class="chart"><i v-for="height in [32,45,39,62,53,78,91]" :key="height" :style="{ height: `${height}%` }"></i></div></div><div class="order-list"><span>Pedidos recentes</span><div v-for="order in ['#1048 · Ana Clara','#1047 · Pedro Lima','#1046 · Carla Souza']" :key="order"><i></i>{{ order }}<b>Pago</b></div></div></div></div>
      </div></section>

      <section id="recursos" class="section"><div class="container"><div class="section-heading"><span>Uma plataforma completa</span><h2>Tudo o que sua operação precisa em um só lugar.</h2></div><div class="feature-grid"><article><div class="icon"><Layers3 /></div><h3>Gestão centralizada</h3><p>Produtos, clientes, pedidos e resultados organizados em um painel simples.</p></article><article><div class="icon"><PackageCheck /></div><h3>Loja com a sua marca</h3><p>Uma experiência de compra rápida, responsiva e personalizada para seu negócio.</p></article><article><div class="icon"><ShieldCheck /></div><h3>Venda com segurança</h3><p>Pagamentos integrados, isolamento por loja e uma infraestrutura preparada para crescer.</p></article></div></div></section>

      <section id="como-funciona" class="section steps-section"><div class="container steps-grid"><div class="section-heading left"><span>Comece sem dor de cabeça</span><h2>Da escolha do plano à primeira venda.</h2><p>Nossa implantação organiza as bases da sua loja para você começar com segurança.</p></div><ol class="steps"><li><b>01</b><div><h3>Escolha seu plano</h3><p>Selecione a capacidade ideal para a fase atual do negócio.</p></div></li><li><b>02</b><div><h3>Conte sobre sua loja</h3><p>Preencha os dados iniciais e conclua o pagamento da implantação.</p></div></li><li><b>03</b><div><h3>Acompanhe a implantação</h3><p>Nossa equipe prepara o ambiente e mantém você informado por e-mail.</p></div></li></ol></div></section>

      <section id="planos" class="section plans-section"><div class="container"><div class="section-heading"><span>Planos transparentes</span><h2>Escolha o próximo passo da sua loja.</h2><p>Os valores e recursos são carregados diretamente da plataforma Elínea.</p></div><p v-if="plansError" class="notice error">{{ plansError }} <button type="button" @click="loadPlans">Tentar novamente</button></p><div v-if="plansLoading" class="plans-grid"><div v-for="item in 3" :key="item" class="plan-card skeleton"></div></div><div v-else class="plans-grid"><article v-for="(plan,index) in plans" :key="plan.id" class="plan-card" :class="{ featured: index === 1 }"><span v-if="index === 1" class="popular">Mais escolhido</span><h3>{{ plan.name }}</h3><p>{{ plan.description }}</p><div class="price"><strong>{{ money(plan.monthly_amount) }}</strong><span>/mês</span></div><small>Implantação: {{ money(plan.implementation_amount) }}</small><ul><li><Check :size="17" /> {{ plan.product_limit ? `Até ${plan.product_limit} produtos` : 'Produtos sem limite definido' }}</li><li v-for="feature in plan.features" :key="feature"><Check :size="17" /> {{ feature }}</li></ul><button class="button" type="button" @click="openCheckout(plan)">Escolher {{ plan.name }} <ArrowRight :size="17" /></button></article></div></div></section>
      <section class="cta-section"><div class="container cta-card"><div><span>Pronto para começar?</span><h2>Transforme sua ideia em uma loja de verdade.</h2></div><a class="button light" href="#planos">Ver planos <ArrowRight :size="18" /></a></div></section>
    </main>

    <footer><div class="container footer-inner"><a class="brand inverse" href="#inicio"><span>e</span> elínea</a><p>Comércio digital simples para negócios reais.</p><div><a href="https://admin.elinea.com.br">Painel da loja</a><a href="https://gestao.elinea.com.br">Gestão da plataforma</a></div></div></footer>

    <div v-if="checkoutOpen" class="modal-backdrop" role="presentation" @click.self="closeCheckout"><section class="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title"><button class="close-button" type="button" aria-label="Fechar" @click="closeCheckout"><X :size="20" /></button><span class="eyebrow">Implantação Elínea</span><h2 id="checkout-title">Comece com o plano {{ selectedPlan?.name }}</h2><p>Preencha os dados do responsável. Na próxima etapa, o pagamento será processado com segurança pela Stripe.</p><form @submit.prevent="submitCheckout"><label>Seu nome<input v-model="form.owner_name" required maxlength="255" autocomplete="name" /></label><label>E-mail<input v-model="form.owner_email" required maxlength="255" type="email" autocomplete="email" /></label><div class="form-row"><label>Telefone<input v-model="form.phone" maxlength="30" autocomplete="tel" /></label><label>Segmento<input v-model="form.segment" required maxlength="100" placeholder="Moda, beleza..." /></label></div><label>Nome da loja<input v-model="form.store_name" required maxlength="255" autocomplete="organization" /></label><p v-if="submitError" class="notice error">{{ submitError }}</p><button class="button full" type="submit" :disabled="submitting">{{ submitting ? 'Abrindo pagamento...' : `Continuar — ${money(selectedPlan?.implementation_amount || 0)}` }} <ArrowRight :size="18" /></button></form></section></div>
  </div>
</template>
