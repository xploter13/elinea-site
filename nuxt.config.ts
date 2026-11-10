import tailwindcss from '@tailwindcss/vite'
import { createResolver, useNuxt } from '@nuxt/kit'

const runtimeEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
const apiBase = runtimeEnv?.NUXT_PUBLIC_API_BASE || (runtimeEnv?.NODE_ENV === 'development' ? 'http://127.0.0.1:8000/api/v1' : 'https://api.elinea.com.br/api/v1')
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
  hooks: {
    'build:before': () => {
      if (useNuxt().options._prepare) return
      const apiUrl = new URL(apiBase)
      const loopback = /^(localhost|.*\.localhost|127\..*|0\.0\.0\.0|\[::1\])$/i.test(apiUrl.hostname)
      if (runtimeEnv?.NODE_ENV === 'production' && (apiUrl.protocol !== 'https:' || loopback)) {
        throw new Error('A API de produção deve usar HTTPS e um endereço público.')
      }
    },
  },
  alias: localPackages,
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
    server: { fs: { allow: [resolve('..')] } },
  },
  runtimeConfig: { public: {
    apiBase, facebookUrl, instagramUrl,
    privacy: {
      companyName: '', cnpj: '', address: '',
      contactEmail: 'contato@elinea.com.br', officerName: '',
      cpfPurpose: '', providers: '', retention: '', internationalTransfers: '',
    },
  } },
  routeRules: {
    '/apresentacao': { prerender: false },
    '/apresentacao-assets/**': { prerender: false },
  },
  app: { head: { htmlAttrs: { lang: 'pt-BR' }, title: 'Elínea — Sua loja online, simples de verdade', meta: [
    { name: 'description', content: 'Crie e gerencie sua loja online com catálogo, pedidos, pagamentos e suporte em uma única plataforma.' },
    { name: 'theme-color', content: '#079455' },
    { name: 'referrer', content: 'strict-origin-when-cross-origin' },
  ] } },
  nitro: {
    preset: 'static',
    serverAssets: [{ baseName: 'presentation', dir: resolve('docs/assets/apresentacao') }],
  },
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
