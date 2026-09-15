<script setup lang="ts">
import { ArrowRight, BarChart3, Bot, CreditCard, MessageCircle, Package, ShoppingBag, Store, Users } from '@lucide/vue'

const outerModules = [
  { icon: Store, label: 'Loja virtual' },
  { icon: CreditCard, label: 'Pagamentos' },
  { icon: ShoppingBag, label: 'Pedidos' },
  { icon: Users, label: 'Clientes' },
  { icon: MessageCircle, label: 'WhatsApp' },
]

const innerModules = [
  { icon: Package, label: 'Catálogo' },
  { icon: BarChart3, label: 'Relatórios' },
  { icon: Bot, label: 'Automação' },
]

const orbitRoot = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const pageIsHidden = ref(false)
const orbitIsPaused = computed(() => !isVisible.value || pageIsHidden.value)

let observer: IntersectionObserver | undefined
const updatePageVisibility = () => { pageIsHidden.value = document.hidden }

onMounted(() => {
  updatePageVisibility()
  observer = new IntersectionObserver(([entry]) => { isVisible.value = Boolean(entry?.isIntersecting) }, { threshold: .12 })
  if (orbitRoot.value) observer.observe(orbitRoot.value)
  document.addEventListener('visibilitychange', updatePageVisibility)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  document.removeEventListener('visibilitychange', updatePageVisibility)
})
</script>

<template>
  <section id="ecossistema" class="chapter chapter--dark ecosystem">
    <div class="site-container split-layout">
      <div class="chapter-copy reveal-copy">
        <p class="site-label">Um ecossistema, sem limites</p>
        <h2 class="site-title">Tudo o que<br>você precisa,<br>trabalhando<br>junto.</h2>
        <p class="site-copy">Do catálogo ao pós-venda, o Elínea conecta as ferramentas essenciais da sua operação em um só lugar.</p>
        <a class="text-cta text-cta--light" href="#produto">
          Explorar a plataforma
          <span class="text-cta__icon" aria-hidden="true"><ArrowRight :size="16" /></span>
        </a>
      </div>

      <div ref="orbitRoot" class="ecosystem-orbit" :class="{ 'is-paused': orbitIsPaused }" aria-label="Módulos conectados à plataforma Elínea">
        <i class="orbit orbit--outer" aria-hidden="true"></i><i class="orbit orbit--inner" aria-hidden="true"></i>
        <div class="orbit-track orbit-track--outer">
          <div v-for="(module, index) in outerModules" :key="module.label" class="ecosystem-node" :style="{ '--angle': `${index * 72 - 90}deg`, '--angle-negative': `${(index * 72 - 90) * -1}deg` }">
            <div class="ecosystem-module"><component :is="module.icon" :size="18" aria-hidden="true" /><span>{{ module.label }}</span></div>
          </div>
        </div>
        <div class="orbit-track orbit-track--inner">
          <div v-for="(module, index) in innerModules" :key="module.label" class="ecosystem-node" :style="{ '--angle': `${index * 120 - 30}deg`, '--angle-negative': `${(index * 120 - 30) * -1}deg` }">
            <div class="ecosystem-module"><component :is="module.icon" :size="18" aria-hidden="true" /><span>{{ module.label }}</span></div>
          </div>
        </div>
        <div class="ecosystem-core"><span>ELÍNEA</span><small>Operação central</small></div>
      </div>
    </div>
  </section>
</template>
