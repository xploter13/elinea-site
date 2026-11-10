<script setup lang="ts">
import { X } from '@lucide/vue'
import { CONSENT_KEY } from '~/utils/cookieConsent'

const { consent, ready, preferencesOpen, storageError, restore, save, rejectOptional, acceptAll } = useCookieConsent()
const dialog = ref<HTMLDialogElement | null>(null)
const banner = ref<HTMLElement | null>(null)
const analytics = ref(false)
const marketing = ref(false)
const message = ref('')
let expiryTimer: ReturnType<typeof setTimeout> | undefined
let previousFocus: HTMLElement | null = null
let messageTimer: ReturnType<typeof setTimeout> | undefined
let bannerObserver: ResizeObserver | undefined

watch(banner, element => {
  bannerObserver?.disconnect()
  document.documentElement.style.removeProperty('--cookie-banner-height')
  if (!element) return
  const reserveSpace = () => document.documentElement.style.setProperty('--cookie-banner-height', `${element.getBoundingClientRect().height + 32}px`)
  bannerObserver = new ResizeObserver(reserveSpace)
  bannerObserver.observe(element)
  reserveSpace()
})

function revealFocus(event: FocusEvent) {
  const target = event.target
  if (!(target instanceof HTMLElement) || !banner.value || banner.value.contains(target) || dialog.value?.open) return
  const bounds = target.getBoundingClientRect()
  if (bounds.bottom > banner.value.getBoundingClientRect().top) target.scrollIntoView({ block: 'center', behavior: 'instant' })
}

function scheduleExpiry() {
  clearTimeout(expiryTimer)
  if (consent.value) {
    const remaining = consent.value.expiresAt - Date.now()
    // Browsers limit setTimeout to roughly 24 days.
    expiryTimer = setTimeout(() => { restore(); scheduleExpiry() }, Math.min(Math.max(remaining, 1), 2_147_483_647))
  }
}
function storageChanged(event: StorageEvent) {
  if (event.key === CONSENT_KEY || event.key === null) { restore(); scheduleExpiry() }
}
function recheck() {
  if (document.visibilityState === 'visible') {
    if (!storageError.value || !consent.value || consent.value.expiresAt <= Date.now()) restore()
    scheduleExpiry()
  }
}
function choose(action: 'accept' | 'reject' | 'custom') {
  if (action === 'accept') acceptAll()
  else if (action === 'reject') rejectOptional()
  else save({ analytics: analytics.value, marketing: marketing.value })
  message.value = storageError.value
    ? 'Sua escolha vale nesta visita. O navegador não permitiu salvá-la para as próximas visitas.'
    : 'Preferências salvas. Você pode alterá-las em Gerenciar cookies.'
  clearTimeout(messageTimer)
  messageTimer = setTimeout(() => { message.value = '' }, 6000)
  scheduleExpiry()
}
watch(preferencesOpen, async open => {
  if (open) {
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    analytics.value = consent.value?.analytics ?? false
    marketing.value = consent.value?.marketing ?? false
    await nextTick()
    dialog.value?.showModal()
  } else {
    dialog.value?.close()
    previousFocus?.focus()
  }
})
onMounted(() => {
  restore()
  scheduleExpiry()
  window.addEventListener('storage', storageChanged)
  document.addEventListener('visibilitychange', recheck)
  document.addEventListener('focusin', revealFocus)
})
onBeforeUnmount(() => {
  clearTimeout(expiryTimer)
  clearTimeout(messageTimer)
  bannerObserver?.disconnect()
  document.documentElement.style.removeProperty('--cookie-banner-height')
  window.removeEventListener('storage', storageChanged)
  document.removeEventListener('visibilitychange', recheck)
  document.removeEventListener('focusin', revealFocus)
})
</script>

<template>
  <aside v-if="ready && !consent && !preferencesOpen" ref="banner" class="cookie-banner" aria-labelledby="cookie-banner-title">
    <div class="cookie-banner__copy">
      <h2 id="cookie-banner-title">Sua privacidade, suas escolhas.</h2>
      <p>Salvamos suas preferências neste navegador. Este site não utiliza ferramentas de análise ou publicidade no momento.
        Você pode aceitar ou recusar usos opcionais e revisar sua escolha quando quiser.
        <NuxtLink to="/cookies">Saiba mais sobre cookies</NuxtLink>.
      </p>
    </div>
    <div class="cookie-actions">
      <button type="button" class="cookie-button" @click="choose('reject')">Rejeitar opcionais</button>
      <button type="button" class="cookie-button" @click="choose('accept')">Aceitar todos</button>
      <button type="button" class="cookie-manage" @click="preferencesOpen = true">Personalizar</button>
    </div>
  </aside>
  <p class="cookie-status" role="status">{{ message }}</p>
  <dialog ref="dialog" class="cookie-dialog" aria-labelledby="cookie-dialog-title" aria-describedby="cookie-dialog-description"
    @cancel="preferencesOpen = false" @close="preferencesOpen = false">
    <div class="cookie-dialog__heading">
      <h2 id="cookie-dialog-title">Preferências de cookies</h2>
      <button type="button" class="cookie-close" aria-label="Fechar preferências" @click="preferencesOpen = false"><X :size="20" /></button>
    </div>
    <p id="cookie-dialog-description">Escolha quais finalidades opcionais você permite. Recusar não impede a navegação ou a contratação.</p>
    <div class="cookie-category">
      <div><h3>Necessários</h3><p>Guardam sua escolha de privacidade por até 180 dias neste navegador, sem nome, e-mail ou CPF.</p></div>
      <span class="cookie-required">Sempre ativos</span>
    </div>
    <label class="cookie-category">
      <span><strong>Análise</strong><span class="cookie-description">Medição de visitas e uso do site. Nenhuma ferramenta ativa nesta versão.</span></span>
      <input v-model="analytics" type="checkbox" aria-label="Permitir análise">
    </label>
    <label class="cookie-category">
      <span><strong>Publicidade</strong><span class="cookie-description">Medição de campanhas e personalização de anúncios. Nenhuma ferramenta ativa nesta versão.</span></span>
      <input v-model="marketing" type="checkbox" aria-label="Permitir publicidade">
    </label>
    <p class="cookie-dialog__note">Suas escolhas se aplicam a este site. O checkout da Stripe e os sites acessados por links possuem suas próprias políticas.
      <NuxtLink to="/cookies" @click="preferencesOpen = false">Consultar a política de cookies</NuxtLink>.
    </p>
    <div class="cookie-actions">
      <button type="button" class="cookie-button" @click="choose('reject')">Rejeitar opcionais</button>
      <button type="button" class="cookie-button" @click="choose('accept')">Aceitar todos</button>
      <button type="button" class="cookie-button cookie-button--save" @click="choose('custom')">Salvar preferências</button>
    </div>
  </dialog>
</template>

<style scoped>
.cookie-banner { position: fixed; z-index: 100; bottom: max(1rem, env(safe-area-inset-bottom)); left: var(--gutter); right: var(--gutter); display: flex; gap: 2rem; align-items: center; max-width: 1320px; max-height: calc(100svh - 2rem); overflow-y: auto; margin: auto; padding: 1.5rem 1.75rem; border: 1px solid var(--line); border-radius: 1rem; background: var(--paper); color: var(--ink-2); box-shadow: var(--shadow); }
.cookie-banner__copy { flex: 1; }
.cookie-banner h2 { margin-bottom: .45rem; font-size: 1.1rem; letter-spacing: -.025em; }
.cookie-banner p, .cookie-dialog p, .cookie-description { font-size: .875rem; line-height: 1.65; color: var(--muted); }
.cookie-banner a, .cookie-dialog a { text-decoration: underline; text-underline-offset: 3px; color: var(--ink-2); }
.cookie-actions { display: flex; flex-wrap: wrap; align-items: center; gap: .6rem; }
.cookie-button, .cookie-manage, .cookie-close { min-height: 44px; cursor: pointer; font: inherit; font-size: .85rem; }
.cookie-button { padding: .7rem 1rem; border: 1px solid var(--ink-2); border-radius: .6rem; color: var(--ink-2); background: transparent; }
.cookie-button:hover { background: var(--green-light); }
.cookie-button--save { background: var(--ink); color: var(--paper); }
.cookie-button--save:hover { background: var(--ink-2); }
.cookie-manage { padding: .6rem; border: 0; background: none; text-decoration: underline; text-underline-offset: 3px; }
.cookie-dialog { position: fixed; inset: 0; margin: auto; width: min(620px, calc(100% - 2rem)); max-height: calc(100svh - 2rem); overflow-y: auto; padding: clamp(1.25rem, 4vw, 2rem); border: 1px solid var(--line); border-radius: 1rem; background: var(--paper); color: var(--ink-2); overscroll-behavior: contain; }
.cookie-dialog::backdrop { background: rgb(13 23 21 / 55%); }
.cookie-dialog__heading { display: flex; align-items: start; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
.cookie-dialog h2 { font-size: clamp(1.5rem, 4vw, 2rem); letter-spacing: -.04em; }
.cookie-close { display: grid; place-items: center; min-width: 44px; border: 0; border-radius: .5rem; background: var(--warm-white); }
.cookie-category { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; padding: 1.25rem 0; border-bottom: 1px solid var(--line); }
.cookie-category h3, .cookie-category strong { display: block; font-size: 1rem; margin-bottom: .35rem; font-weight: 600; }
.cookie-category input { flex-shrink: 0; width: 24px; height: 24px; accent-color: var(--green); cursor: pointer; }
.cookie-description { display: block; }
.cookie-required { flex-shrink: 0; color: var(--ink-2); font-size: .75rem; }
.cookie-dialog__note { margin: 1.25rem 0; }
.cookie-status { position: fixed; z-index: 101; bottom: 1rem; left: 1rem; max-width: min(30rem, calc(100% - 2rem)); background: var(--paper); color: var(--ink-2); border: 1px solid var(--line); border-radius: .6rem; padding: .8rem 1rem; font-size: .85rem; box-shadow: var(--shadow); }
.cookie-status:empty { display: none; }
:is(button, input, a):focus-visible { outline: 2px solid var(--green); outline-offset: 4px; }
@media (max-width: 1024px) { .cookie-banner { flex-direction: column; align-items: stretch; gap: 1rem; } }
@media (max-width: 767px) { .cookie-banner { left: .75rem; right: .75rem; padding: 1.25rem; } .cookie-actions { align-items: stretch; } .cookie-actions .cookie-button { flex: 1 1 auto; } }
</style>

<style>
html { scroll-padding-bottom: var(--cookie-banner-height, 0px); }
body { padding-bottom: var(--cookie-banner-height, 0px); }
body:has(.cookie-dialog[open]) { overflow: hidden; }
</style>
