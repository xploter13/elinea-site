<script setup lang="ts">
import logoUrl from '~/assets/images/elinea-logo.svg'
import logoWhiteUrl from '~/assets/images/elinea-logo-white.svg'
import { MarketingButton, MarketingSocialRail } from '@elinea/ui/marketing'
import { ArrowRight, Menu, X } from '@lucide/vue'

const config = useRuntimeConfig()
const route = useRoute()
const mobileMenuOpen = ref(false)
const headerScrolled = ref(false)
const updateHeader = () => { headerScrolled.value = window.scrollY > 24 }

watch(() => route.fullPath, () => { mobileMenuOpen.value = false })
onMounted(() => {
  updateHeader()
  window.addEventListener('scroll', updateHeader, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', updateHeader))

const navigation = [
  { label: 'Home', to: '/' },
  { label: 'Plataforma', to: '/plataforma' },
  { label: 'Preços', to: '/#planos' },
  { label: 'Recursos', to: '/#produto' },
]
</script>

<template>
  <MarketingSocialRail :facebook-href="config.public.facebookUrl" :instagram-href="config.public.instagramUrl" />
  <header data-header class="premium-header" :class="{ 'is-scrolled': headerScrolled }">
    <div class="site-container header-inner">
      <NuxtLink to="/" class="site-logo" aria-label="Elínea — início">
        <img class="logo-white" :src="logoWhiteUrl" alt="">
        <img class="logo-color" :src="logoUrl" alt="">
      </NuxtLink>
      <nav class="desktop-nav" aria-label="Navegação principal">
        <NuxtLink v-for="item in navigation" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
      </nav>
      <a class="login-link" href="https://admin.elinea.com.br">Entrar</a>
      <MarketingButton class="header-cta" variant="solid" href="/#planos">Criar minha loja<template #icon><ArrowRight :size="15" /></template></MarketingButton>
      <button class="menu-toggle" type="button" aria-label="Alternar menu" :aria-expanded="mobileMenuOpen" aria-controls="menu-mobile" @click="mobileMenuOpen = !mobileMenuOpen">
        <X v-if="mobileMenuOpen" :size="23" /><Menu v-else :size="23" />
      </button>
    </div>
    <nav v-if="mobileMenuOpen" id="menu-mobile" class="mobile-nav" aria-label="Navegação móvel">
      <NuxtLink v-for="item in navigation" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
      <a href="https://admin.elinea.com.br">Entrar</a>
    </nav>
  </header>
</template>
