import tailwindcss from '@tailwindcss/vite'

const apiBase = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.NUXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000/api/v1'

export default defineNuxtConfig({
  compatibilityDate: '2026-06-10',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  runtimeConfig: { public: { apiBase } },
  app: { head: { htmlAttrs: { lang: 'pt-BR' }, title: 'Elínea — Sua loja online, simples de verdade', meta: [
    { name: 'description', content: 'Crie e gerencie sua loja online com catálogo, pedidos, pagamentos e suporte em uma única plataforma.' },
    { name: 'theme-color', content: '#079455' },
  ], link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap' },
  ] } },
  nitro: { preset: 'static' },
  typescript: { strict: true, typeCheck: true },
})
