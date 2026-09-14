import tailwindcss from '@tailwindcss/vite'
import { createResolver } from '@nuxt/kit'

const runtimeEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
const apiBase = runtimeEnv?.NUXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000/api/v1'
const facebookUrl = runtimeEnv?.NUXT_PUBLIC_FACEBOOK_URL || 'https://www.facebook.com/'
const instagramUrl = runtimeEnv?.NUXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/'
const { resolve } = createResolver(import.meta.url)
const localPackages = {
  '@elinea/ui/marketing': resolve('../elinea-ui/src/marketing.ts'),
  '@elinea/ui': resolve('../elinea-ui/src/index.ts'),
  '@elinea/sdk': resolve('../elinea-sdk/src/index.ts'),
}

export default defineNuxtConfig({
  compatibilityDate: '2026-06-10',
  devtools: { enabled: false },
  alias: localPackages,
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
    server: { fs: { allow: [resolve('..')] } },
  },
  runtimeConfig: { public: { apiBase, facebookUrl, instagramUrl } },
  app: { head: { htmlAttrs: { lang: 'pt-BR' }, title: 'Elínea — Sua loja online, simples de verdade', meta: [
    { name: 'description', content: 'Crie e gerencie sua loja online com catálogo, pedidos, pagamentos e suporte em uma única plataforma.' },
    { name: 'theme-color', content: '#079455' },
  ], link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Sora:wght@500;600;700&display=swap' },
  ] } },
  nitro: { preset: 'static' },
  typescript: {
    strict: true,
    typeCheck: true,
    tsConfig: {
      compilerOptions: {
        paths: Object.fromEntries(Object.entries(localPackages).map(([name, path]) => [name, [path]])),
      },
    },
  },
})
