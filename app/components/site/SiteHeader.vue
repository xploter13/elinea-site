<script setup lang="ts">
import logoUrl from '~/assets/images/logo-elinea-dark.svg'
import logoWhiteUrl from '~/assets/images/logo-elinea-white.svg'
import {MarketingButton} from '@elinea/ui/marketing'
import {ArrowRight, Menu, X, User} from '@lucide/vue'

const route = useRoute()
defineProps<{ light?: boolean }>()
const mobileMenuOpen = ref(false)
const headerScrolled = ref(false)
const updateHeader = () => {
  headerScrolled.value = window.scrollY > 24
}

watch(() => route.fullPath, () => {
  mobileMenuOpen.value = false
})
onMounted(() => {
  updateHeader()
  window.addEventListener('scroll', updateHeader, {passive: true})
})
onBeforeUnmount(() => window.removeEventListener('scroll', updateHeader))

const navigation = [
  {label: 'Home', to: '/'},
  {label: 'Plataforma', to: '/plataforma'},
  {label: 'Preços', to: '/precos'},
  {label: 'Recursos', to: '/recursos'},
]
</script>

<template>
  <header data-header class="premium-header" :class="{ 'is-scrolled': headerScrolled, 'is-light': light }">
    <div class="site-container header-inner">
      <NuxtLink to="/" class="site-logo" aria-label="Elínea — início">
        <img class="logo-white" :src="logoWhiteUrl" alt="">
        <img class="logo-color" :src="logoUrl" alt="">
      </NuxtLink>
      <nav class="desktop-nav" aria-label="Navegação principal">
        <NuxtLink v-for="item in navigation" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
      </nav>
      <a class="login-link" href="https://admin.elinea.com.br"><User :size="15"/>Entrar</a>
      <MarketingButton class="header-cta" variant="solid" href="/criar-loja">Criar minha loja
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
    <nav v-if="mobileMenuOpen" id="menu-mobile" class="mobile-nav" aria-label="Navegação móvel">
      <NuxtLink v-for="item in navigation" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
      <NuxtLink to="/criar-loja">Criar minha loja</NuxtLink>
      <a class="mobile-login-link" href="https://admin.elinea.com.br"><User :size="16"/>Entrar</a>
    </nav>
  </header>
</template>
