<script setup lang="ts">
import { ArrowUpRight, BookOpen, Check, ChevronDown, Copy, Globe2 } from '@lucide/vue'
import { MarketingTextButton } from '@elinea/ui/marketing'

const sections = [
  { id: 'visao-geral', label: 'Entenda o apontamento' },
  { id: 'antes-de-comecar', label: 'Antes de começar' },
  { id: 'nameservers', label: 'Servidores de nomes' },
  { id: 'registros-dns', label: 'Registros A e CNAME' },
  { id: 'cloudflare', label: 'Configurar na Cloudflare' },
  { id: 'https', label: 'Domínio e HTTPS' },
  { id: 'verificar', label: 'Verificar a configuração' },
  { id: 'duvidas', label: 'Resolver problemas' },
]
const records = [
  { type: 'A', name: '@', domain: 'exemplo.com', target: '193.160.119.94' },
  { type: 'CNAME', name: 'www', domain: 'www.exemplo.com', target: 'sualoja.elinea.com.br' },
]
const commands = 'dig +short NS exemplo.com\ndig +short A exemplo.com\ndig +short CNAME www.exemplo.com'
const windowsCommands = 'nslookup -type=ns exemplo.com\nnslookup exemplo.com\nnslookup -type=cname www.exemplo.com'
const activeSection = ref('visao-geral')
const menuOpen = ref(false)
const menuToggle = ref<HTMLButtonElement | null>(null)
const copied = ref('')
const copyNotice = ref('')
let copyTimer: ReturnType<typeof setTimeout> | undefined
let scrollFrame = 0
let headings: HTMLElement[] = []

async function copy(value: string, label: string) {
  clearTimeout(copyTimer)
  try {
    await navigator.clipboard.writeText(value)
    copied.value = label
    copyNotice.value = `${label} copiado.`
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => { copied.value = ''; copyNotice.value = '' }, 2500)
  } catch {
    copied.value = ''
    copyNotice.value = 'Não foi possível copiar. Selecione o texto e copie manualmente.'
  }
}
function updateSection() {
  scrollFrame = 0
  const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
  const margin = headings[0] ? parseFloat(getComputedStyle(headings[0]).scrollMarginTop) || 0 : 0
  const offset = padding + margin + 8
  activeSection.value = headings.filter(el => el.getBoundingClientRect().top <= offset).at(-1)?.id ?? sections[0]!.id
}
function onScroll() { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateSection) }
function selectSection(id: string) { activeSection.value = id; menuOpen.value = false }
function closeMenu() { menuOpen.value = false; menuToggle.value?.focus() }
onMounted(() => {
  headings = sections.map(section => document.getElementById(section.id)).filter((el): el is HTMLElement => !!el)
  updateSection()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  cancelAnimationFrame(scrollFrame)
  clearTimeout(copyTimer)
})
useSeoMeta({
  title: 'Documentação de domínios e DNS — Elínea',
  description: 'Configure o domínio da sua loja Elínea: registros A e CNAME, nameservers, Cloudflare, HTTPS e verificação do apontamento.',
})
</script>

<template>
  <div class="page-shell docs-page">
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <SiteHeader light />
    <main id="conteudo" class="site-container docs-layout">
      <aside class="docs-sidebar" aria-label="Índice da documentação">
        <div class="docs-sidebar-heading"><BookOpen :size="18" aria-hidden="true" /><span>Documentação</span></div>
        <button ref="menuToggle" class="docs-menu-toggle" type="button" :aria-expanded="menuOpen" aria-controls="docs-navigation" @click="menuOpen = !menuOpen">
          Neste guia <ChevronDown :size="18" :class="{ 'is-open': menuOpen }" aria-hidden="true" />
        </button>
        <nav id="docs-navigation" class="docs-navigation" :class="{ 'is-open': menuOpen }" aria-label="Nesta página" @keydown.esc="closeMenu">
          <p>Domínios e DNS</p>
          <a v-for="section in sections" :key="section.id" :href="`#${section.id}`" :aria-current="activeSection === section.id ? 'location' : undefined" @click="selectSection(section.id)">{{ section.label }}</a>
          <a class="docs-sidebar-contact" href="mailto:contato@elinea.com.br">Precisa de ajuda? <ArrowUpRight :size="15" aria-hidden="true" /></a>
        </nav>
      </aside>

      <article class="docs-article">
        <header class="docs-heading">
          <p class="docs-breadcrumb">Documentação <span aria-hidden="true">/</span> Domínios e DNS</p>
          <h1>Seu domínio.<br>Conectado à Elínea.</h1>
          <p>Um guia para apontar o endereço da sua loja, configurar o DNS e conferir o acesso seguro.</p>
          <span class="docs-updated">Atualizado em 11 de novembro de 2026</span>
        </header>

        <section id="visao-geral" class="docs-section" aria-labelledby="heading-visao-geral" tabindex="-1">
          <h2 id="heading-visao-geral">Cloudflare ou VPS?</h2>
          <p>São duas partes da mesma configuração. Os <strong>nameservers</strong> definem quem gerencia o DNS do domínio. Os registros <strong>A e CNAME</strong>, criados nesse provedor, indicam o destino da loja.</p>
          <div class="docs-note">
            <Globe2 :size="21" aria-hidden="true" />
            <div><strong>Você pode usar a Cloudflare e hospedar a loja na VPS.</strong><p>Nesse caso, o domínio usa os nameservers atribuídos pela Cloudflare, e os registros DNS são configurados no painel dela com os destinos da Elínea.</p></div>
          </div>
          <p>Se você já gerencia o DNS em outro provedor, pode manter os nameservers atuais e editar os registros lá. Não é necessário mudar para a Cloudflare só para conectar a loja.</p>
          <ol class="docs-flow" aria-label="Como as partes se conectam">
            <li><span>01</span><strong>Registro do domínio</strong><p>É onde você escolhe os nameservers.</p></li>
            <li><span>02</span><strong>Provedor de DNS</strong><p>É onde você cria os registros A e CNAME.</p></li>
            <li><span>03</span><strong>Servidor Elínea</strong><p>Recebe o domínio e entrega a sua loja.</p></li>
          </ol>
        </section>

        <section id="antes-de-comecar" class="docs-section" aria-labelledby="heading-antes" tabindex="-1">
          <h2 id="heading-antes">Antes de começar</h2>
          <ul class="docs-checklist">
            <li><Check :size="17" aria-hidden="true" /><span>Tenha acesso ao painel de registro do domínio e ao provedor de DNS que está ativo.</span></li>
            <li><Check :size="17" aria-hidden="true" /><span>Confirme com a Elínea o domínio da loja e o subdomínio de destino. <code>exemplo.com</code> e <code>sualoja.elinea.com.br</code> são exemplos neste guia.</span></li>
            <li><Check :size="17" aria-hidden="true" /><span>Salve os registros existentes antes de editar, principalmente os de e-mail: MX, SPF, DKIM e DMARC.</span></li>
            <li><Check :size="17" aria-hidden="true" /><span>Combine a liberação do domínio e do HTTPS com a Elínea. O DNS sozinho não conclui essa etapa.</span></li>
          </ul>
        </section>

        <section id="nameservers" class="docs-section" aria-labelledby="heading-nameservers" tabindex="-1">
          <h2 id="heading-nameservers">Escolha onde gerenciar o DNS</h2>
          <p>No painel em que o domínio foi registrado, procure por “Servidores DNS” ou “Nameservers”. Use o conjunto indicado pelo provedor que vai gerenciar a zona DNS; não misture os dois pares abaixo.</p>
          <div class="docs-nameservers">
            <div><h3>Cloudflare</h3><p>Par informado para referência:</p><code>daisy.ns.cloudflare.com</code><code>weston.ns.cloudflare.com</code><p><strong>Confirme no painel do próprio domínio.</strong> A Cloudflare atribui um par a cada zona; os nomes acima não servem automaticamente para todos os clientes.</p></div>
            <div><h3>Provedor de hospedagem</h3><p>Alternativa de DNS informada:</p><code>lunar.dns-parking.com</code><code>solar.dns-parking.com</code><p>Use somente se esse for o serviço que gerencia o DNS do domínio. Esses nomes não substituem o IP da VPS no registro A.</p></div>
          </div>
          <p>Quando a Cloudflare for o DNS ativo, faça as alterações nela. Editar registros no painel antigo da hospedagem não muda a zona que está respondendo pelo domínio.</p>
          <p class="docs-reference">Referência: <a href="https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/" target="_blank" rel="noopener noreferrer">configuração de nameservers na Cloudflare <ArrowUpRight :size="14" aria-hidden="true" /></a>.</p>
        </section>

        <section id="registros-dns" class="docs-section" aria-labelledby="heading-registros" tabindex="-1">
          <h2 id="heading-registros">Configure os registros da loja</h2>
          <p>Crie os registros abaixo no <strong>provedor de DNS ativo</strong>. O IP informado para a VPS da Elínea é <code>193.160.119.94</code>. Antes de publicar, confirme que ele continua sendo o destino da sua implantação.</p>
          <div class="docs-table-scroll" role="region" aria-label="Registros DNS da loja" tabindex="0">
            <table class="docs-table">
              <caption>Apontamentos para o domínio principal e o endereço com www</caption>
              <thead><tr><th scope="col">Tipo</th><th scope="col">Nome</th><th scope="col">Destino</th><th scope="col">Copiar</th></tr></thead>
              <tbody><tr v-for="record in records" :key="record.type"><td><span class="docs-record-type">{{ record.type }}</span></td><td><code>{{ record.name }}</code><small>{{ record.domain }}</small></td><td><code>{{ record.target }}</code></td><td><button type="button" class="docs-copy" :aria-label="`Copiar destino do registro ${record.type}`" @click="copy(record.target, `Destino ${record.type}`)"><Check v-if="copied === `Destino ${record.type}`" :size="16" aria-hidden="true" /><Copy v-else :size="16" aria-hidden="true" /></button></td></tr></tbody>
            </table>
          </div>
          <p class="docs-table-hint">Deslize a tabela para ver os destinos e os botões de copiar.</p>
          <ul>
            <li><code>@</code> representa o domínio principal, como <code>exemplo.com</code>. Alguns painéis pedem o domínio completo no lugar de <code>@</code>.</li>
            <li>No CNAME, substitua <code>sualoja.elinea.com.br</code> pelo endereço confirmado pela Elínea, sem <code>https://</code>, portas ou caminhos.</li>
            <li>Na Cloudflare, use TTL automático. Em outro provedor, mantenha o padrão ou o valor combinado para a implantação.</li>
            <li>Revise registros A, AAAA ou CNAME antigos para <code>@</code> e <code>www</code> que apontem para outra hospedagem. Não apague registros de e-mail ou verificações de outros serviços.</li>
          </ul>
          <p class="docs-detail">Um CNAME é um apelido DNS: ele não muda o endereço exibido no navegador e não cria um redirecionamento entre www e o domínio principal.</p>
        </section>

        <section id="cloudflare" class="docs-section" aria-labelledby="heading-cloudflare" tabindex="-1">
          <h2 id="heading-cloudflare">Passo a passo na Cloudflare</h2>
          <ol class="docs-steps">
            <li><strong>Abra o domínio certo.</strong><p>Se ele já estiver ativo na Cloudflare, vá à área de registros DNS. Se estiver migrando, adicione o domínio e confira os registros importados, incluindo os de e-mail.</p></li>
            <li><strong>Se necessário, altere os nameservers no registrador.</strong><p>Copie o par exibido para esse domínio. Se houver DNSSEC ativo, desative a configuração anterior no registrador antes de trocar os nameservers. Após a ativação do domínio, configure novamente o DNSSEC na Cloudflare.</p></li>
            <li><strong>Cadastre os registros A e CNAME.</strong><p>Use os destinos da tabela. Para a conexão inicial, mantenha os registros da loja em <strong>Somente DNS (DNS only)</strong>, com a nuvem cinza, até a validação com a Elínea.</p></li>
            <li><strong>Combine a ativação do proxy.</strong><p>A nuvem laranja adiciona a Cloudflare ao tráfego da loja. Ative apenas depois de confirmar a compatibilidade do destino e do HTTPS com a Elínea.</p></li>
          </ol>
          <p><strong>Atenção ao destino do CNAME:</strong> a nuvem cinza no domínio do cliente não garante acesso direto à VPS se o destino também estiver com proxy. Um destino em outra conta Cloudflare pode exigir Cloudflare for SaaS; não basta copiar o CNAME para liberar o domínio.</p>
          <p class="docs-reference">Leia sobre <a href="https://developers.cloudflare.com/dns/proxy-status/" target="_blank" rel="noopener noreferrer">status do proxy <ArrowUpRight :size="14" aria-hidden="true" /></a> e <a href="https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/getting-started/" target="_blank" rel="noopener noreferrer">domínios de clientes com Cloudflare for SaaS <ArrowUpRight :size="14" aria-hidden="true" /></a>.</p>
        </section>

        <section id="https" class="docs-section" aria-labelledby="heading-https" tabindex="-1">
          <h2 id="heading-https">Libere o domínio e o HTTPS</h2>
          <p>Envie à Elínea os endereços que serão usados, como <code>exemplo.com</code> e <code>www.exemplo.com</code>. A equipe precisa preparar o reconhecimento desses endereços, o roteamento para a loja e os certificados correspondentes.</p>
          <p>O certificado de <code>*.elinea.com.br</code> não cobre o domínio personalizado do cliente. Confirme também qual será o endereço principal e como o outro endereço será redirecionado.</p>
          <div class="docs-note docs-note--plain"><div><strong>Com proxy Cloudflare, use Full (strict) após validar o certificado de origem.</strong><p>O servidor deve aceitar HTTPS e apresentar um certificado válido para o domínio solicitado. Um certificado Cloudflare Origin CA, sozinho, não é confiável para acesso direto pelo navegador quando o proxy está desligado.</p></div></div>
          <p class="docs-reference">Referências: <a href="https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/" target="_blank" rel="noopener noreferrer">modo Full (strict) <ArrowUpRight :size="14" aria-hidden="true" /></a> e <a href="https://developers.cloudflare.com/ssl/origin-configuration/origin-ca/" target="_blank" rel="noopener noreferrer">certificados Origin CA <ArrowUpRight :size="14" aria-hidden="true" /></a>.</p>
        </section>

        <section id="verificar" class="docs-section" aria-labelledby="heading-verificar" tabindex="-1">
          <h2 id="heading-verificar">Confira o apontamento</h2>
          <p>Troque <code>exemplo.com</code> pelo domínio da loja. Estes comandos apenas consultam o DNS; não alteram a configuração.</p>
          <div class="docs-code"><div><span>macOS / Linux · com dig instalado</span><button type="button" class="docs-copy" aria-label="Copiar comandos dig" @click="copy(commands, 'Comandos dig')"><Check v-if="copied === 'Comandos dig'" :size="16" aria-hidden="true" /><Copy v-else :size="16" aria-hidden="true" /></button></div><pre><code>{{ commands }}</code></pre></div>
          <div class="docs-code"><div><span>Windows · Prompt de Comando</span><button type="button" class="docs-copy" aria-label="Copiar comandos nslookup" @click="copy(windowsCommands, 'Comandos nslookup')"><Check v-if="copied === 'Comandos nslookup'" :size="16" aria-hidden="true" /><Copy v-else :size="16" aria-hidden="true" /></button></div><pre><code>{{ windowsCommands }}</code></pre></div>
          <p>Confira os nameservers do provedor escolhido. No acesso direto, o A deve retornar o IP combinado. Com proxy ativo, é esperado receber IPs da Cloudflare, e a resposta CNAME pode não ser exibida da mesma forma.</p>
          <p>Depois, abra o domínio principal e o endereço com www usando HTTPS. Verifique se ambos chegam à loja correta, sem erro de certificado. A atualização do DNS depende do TTL e dos caches; nem todos os visitantes recebem a mudança ao mesmo tempo.</p>
        </section>

        <section id="duvidas" class="docs-section" aria-labelledby="heading-duvidas" tabindex="-1">
          <h2 id="heading-duvidas">Se algo não funcionar</h2>
          <details><summary>Ainda aparece o site antigo</summary><p>Confirme os nameservers ativos e o painel onde os registros foram alterados. Revise os destinos A e AAAA do domínio e aguarde os caches expirarem. Se o destino estiver correto, envie os resultados das consultas à Elínea.</p></details>
          <details><summary>O domínio abre, mas o www não</summary><p>Confira o CNAME e confirme com a Elínea o cadastro, o roteamento e o certificado do endereço com www. Apontar o DNS para o mesmo servidor não configura essas etapas automaticamente.</p></details>
          <details><summary>O e-mail parou depois da troca de DNS</summary><p>Compare a zona atual com a cópia anterior e restaure os registros MX e TXT exigidos pelo serviço de e-mail. O apontamento da loja não exige remover esses registros.</p></details>
          <details><summary>A Cloudflare mostra erro 1014</summary><p>Pode haver um CNAME entre contas Cloudflare sem a configuração necessária no destino. Envie o domínio e o erro à Elínea para validar a configuração; alternar o proxy do cliente não resolve necessariamente o problema. <a href="https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1014/" target="_blank" rel="noopener noreferrer">Entenda o erro 1014 <ArrowUpRight :size="14" aria-hidden="true" /></a>.</p></details>
          <details><summary>Há erro de certificado ou redirecionamento</summary><p>Confirme a emissão do certificado para os endereços usados e a configuração do proxy. Em Full (strict), o erro 526 pode indicar um certificado de origem incompatível. Peça à Elínea a verificação do HTTPS antes de alterar o modo de criptografia.</p></details>
          <div class="docs-support"><h3>Vamos conferir juntos?</h3><p>Envie o domínio da loja, uma captura dos registros e o erro encontrado. Não envie senhas ou chaves de acesso.</p><MarketingTextButton href="mailto:contato@elinea.com.br">Falar com a Elínea</MarketingTextButton></div>
        </section>
        <p class="docs-copy-notice" role="status" aria-live="polite">{{ copyNotice }}</p>
      </article>
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.docs-page { background: var(--paper); color: var(--ink-2); }
.docs-layout { display: grid; grid-template-columns: 240px minmax(0, 850px); gap: clamp(2.5rem, 6vw, 7rem); align-items: start; padding-block: clamp(8rem, 11vw, 10rem) 6rem; }
.docs-sidebar { position: sticky; top: 108px; max-height: calc(100dvh - 132px); overflow-y: auto; padding-right: 1rem; scrollbar-width: thin; }
.docs-sidebar-heading { display: flex; align-items: center; gap: .7rem; margin-bottom: 1.7rem; font-size: 1rem; font-weight: 600; }
.docs-sidebar-heading svg { color: var(--green); }
.docs-navigation > p { margin-bottom: .8rem; color: var(--muted); font-size: .8rem; }
.docs-navigation > a { display: flex; align-items: center; min-height: 44px; padding: .6rem 1rem; border-left: 2px solid var(--line); color: var(--muted); font-size: .87rem; line-height: 1.45; text-decoration: none; }
.docs-navigation > a:hover { color: var(--ink); background: var(--warm-white); }
.docs-navigation > a[aria-current] { border-left-color: var(--green); background: var(--green-light); color: #08633f; font-weight: 600; }
.docs-navigation > .docs-sidebar-contact { gap: .5rem; margin-top: 1.5rem; border: 0; padding-inline: 0; color: var(--ink-2); }
.docs-menu-toggle { display: none; }
.docs-heading { margin-bottom: 3.5rem; }
.docs-breadcrumb { display: flex; flex-wrap: wrap; gap: .65rem; margin-bottom: 1.8rem; color: var(--muted); font-size: .85rem; }
.docs-breadcrumb span { opacity: .5; }
.docs-heading h1 { max-width: 800px; font-size: clamp(2.5rem, 4.5vw, 4.1rem); font-weight: 600; line-height: 1.05; letter-spacing: -.045em; }
.docs-heading > p:not(.docs-breadcrumb) { max-width: 620px; margin-top: 1.5rem; color: var(--muted); font-size: 1.08rem; line-height: 1.75; }
.docs-updated { display: block; margin-top: 1.2rem; color: var(--muted); font-size: .8rem; }
.docs-section { scroll-margin-top: 32px; padding-block: 2.8rem; border-top: 1px solid var(--line); outline: none; }
.docs-section h2 { margin-bottom: 1.25rem; font-size: clamp(1.5rem, 2.4vw, 2rem); font-weight: 600; letter-spacing: -.025em; line-height: 1.2; }
.docs-section h3 { font-size: 1rem; font-weight: 600; }
.docs-section p, .docs-section > ul, .docs-steps { color: var(--muted); font-size: .97rem; line-height: 1.8; }
.docs-section p + p, .docs-section > ul { margin-top: 1rem; }
.docs-section strong { color: var(--ink-2); font-weight: 600; }
.docs-section > ul { padding-left: 1.2rem; list-style: disc; }
.docs-section > ul > li + li { margin-top: .65rem; }
.docs-section code { overflow-wrap: anywhere; border-radius: 4px; padding: .12rem .3rem; background: #edf2ef; color: var(--ink-2); font-size: .85em; }
.docs-section a:not(.docs-copy) { color: #08734b; text-decoration: underline; text-underline-offset: .2em; }
.docs-section a svg { display: inline; vertical-align: middle; }
.docs-note { display: flex; align-items: flex-start; gap: .9rem; margin-block: 1.7rem; padding: 1.3rem 1.5rem; border-left: 3px solid var(--green); background: var(--green-light); }
.docs-note > svg { flex-shrink: 0; margin-top: .15rem; color: #08734b; }
.docs-note strong { display: block; line-height: 1.5; }
.docs-note p { margin-top: .5rem; color: #365b4a; font-size: .9rem; }
.docs-note--plain { background: var(--warm-white); }
.docs-flow { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.6rem; margin-top: 2rem; padding: 1.4rem 0; border-block: 1px solid var(--line); }
.docs-flow li { min-width: 0; }
.docs-flow span { display: block; margin-bottom: .7rem; color: #08734b; font-size: .8rem; }
.docs-flow strong { display: block; font-size: .9rem; }
.docs-flow p { margin-top: .4rem; font-size: .85rem; line-height: 1.6; }
.docs-section > .docs-checklist { list-style: none; padding-left: 0; }
.docs-checklist li { display: flex; align-items: flex-start; gap: .7rem; }
.docs-checklist svg { flex-shrink: 0; margin-top: .35rem; color: var(--green); }
.docs-nameservers { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2rem; margin-block: 1.7rem; }
.docs-nameservers > div { min-width: 0; padding-top: 1.2rem; border-top: 2px solid var(--line); }
.docs-nameservers p { margin-block: .6rem; font-size: .87rem; }
.docs-nameservers code { display: block; margin-block: .4rem; padding: .4rem .55rem; font-size: .85rem; }
.docs-section .docs-reference { margin-top: 1.2rem; font-size: .8rem; }
.docs-table-scroll { max-width: 100%; overflow-x: auto; margin-block: 1.5rem; border: 1px solid var(--line); border-radius: 10px; }
.docs-table-hint { display: none; }
.docs-table { width: 100%; min-width: 620px; border-collapse: collapse; text-align: left; font-size: .9rem; }
.docs-table caption { padding: 1rem 1.2rem; background: var(--warm-white); color: var(--muted); font-size: .8rem; text-align: left; }
.docs-table th, .docs-table td { padding: 1rem 1.2rem; border-top: 1px solid var(--line); }
.docs-table th { color: var(--muted); font-size: .8rem; font-weight: 500; }
.docs-table code { padding: 0; background: none; font-size: .87rem; }
.docs-record-type { color: #08734b; font-size: .8rem; font-weight: 600; }
.docs-table small { display: block; margin-top: .3rem; color: var(--muted); font-size: .75rem; }
.docs-copy { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border: 1px solid var(--line); border-radius: 6px; background: transparent; color: var(--muted); cursor: pointer; }
.docs-copy:hover { color: var(--ink); background: var(--warm-white); }
.docs-steps { margin-block: 1.5rem; padding-left: 1.35rem; list-style: decimal; }
.docs-steps > li { padding-left: .4rem; }
.docs-steps > li + li { margin-top: 1.3rem; }
.docs-steps p { margin-top: .35rem; }
.docs-section .docs-detail { padding-left: 1rem; border-left: 2px solid var(--line); font-size: .87rem; }
.docs-code { min-width: 0; margin-block: 1.2rem; overflow: hidden; border: 1px solid var(--line); border-radius: 9px; }
.docs-code > div { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .5rem .8rem .5rem 1.2rem; border-bottom: 1px solid var(--line); background: var(--warm-white); color: var(--muted); font-size: .8rem; }
.docs-code .docs-copy { border-color: transparent; }
.docs-code pre { overflow-x: auto; padding: 1.3rem; }
.docs-code code { background: none; padding: 0; font-size: .84rem; line-height: 1.9; white-space: pre; }
.docs-section details { border-bottom: 1px solid var(--line); }
.docs-section summary { display: flex; align-items: center; justify-content: space-between; min-height: 60px; gap: 1rem; padding: 1rem 0; color: var(--ink-2); font-size: 1rem; font-weight: 500; cursor: pointer; list-style: none; }
.docs-section summary::-webkit-details-marker { display: none; }
.docs-section summary::after { content: '+'; font-size: 1.3rem; font-weight: 400; }
.docs-section details[open] summary::after { content: '−'; }
.docs-section details > p { margin: 0 0 1.3rem; font-size: .9rem; }
.docs-support { margin-top: 2.5rem; }
.docs-support p { margin-block: .7rem 1rem; }
.docs-copy-notice { position: fixed; z-index: 70; right: 1.5rem; bottom: 1.5rem; max-width: min(340px, calc(100vw - 3rem)); border-radius: 8px; background: var(--ink); color: white; font-size: .85rem; line-height: 1.5; }
.docs-copy-notice:not(:empty) { padding: .9rem 1.2rem; box-shadow: 0 6px 24px rgb(0 0 0 / 12%); }
.docs-page :is(a, button, summary, [tabindex="0"]):focus-visible { outline: 2px solid var(--green); outline-offset: 4px; }
@media (max-width: 1023px) {
  .docs-layout { display: block; padding-top: 6rem; }
  .docs-sidebar { z-index: 30; top: 76px; max-height: none; overflow: visible; padding: .5rem 0; margin-bottom: 2rem; border-block: 1px solid var(--line); background: var(--paper); }
  .docs-sidebar-heading { display: none; }
  .docs-menu-toggle { display: flex; align-items: center; justify-content: space-between; width: 100%; min-height: 44px; border: 0; background: transparent; color: var(--ink-2); font: inherit; font-size: .9rem; font-weight: 500; text-align: left; cursor: pointer; }
  .docs-menu-toggle svg { transition: transform .15s; }
  .docs-menu-toggle svg.is-open { transform: rotate(180deg); }
  .docs-navigation { display: none; position: absolute; top: 100%; right: 0; left: 0; max-height: min(60dvh, 520px); overflow-y: auto; padding: 1rem; border: 1px solid var(--line); background: var(--paper); box-shadow: 0 12px 24px rgb(13 23 21 / 8%); }
  .docs-navigation.is-open { display: block; }
  .docs-navigation > p { display: none; }
  .docs-heading h1 { font-size: clamp(2.3rem, 6vw, 3.6rem); }
  .docs-section { scroll-margin-top: 72px; }
}
@media (max-width: 767px) { .docs-sidebar { top: 68px; } .docs-section .docs-table-hint { display: block; margin-top: -.5rem; font-size: .8rem; } }
@media (max-width: 600px) {
  .docs-layout { padding-bottom: 3.5rem; }
  .docs-heading { margin-bottom: 2rem; }
  .docs-heading > p:not(.docs-breadcrumb) { font-size: 1rem; }
  .docs-section { padding-block: 2rem; }
  .docs-note { padding: 1rem; }
  .docs-flow { grid-template-columns: 1fr; gap: 1.2rem; }
  .docs-flow li { display: grid; grid-template-columns: 24px 1fr; column-gap: .6rem; }
  .docs-flow span { grid-row: span 2; margin: .1rem 0 0; }
  .docs-nameservers { grid-template-columns: 1fr; gap: 1.3rem; }
}
@media (prefers-reduced-motion: reduce) { .docs-menu-toggle svg { transition: none; } }
</style>
