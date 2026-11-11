<script setup lang="ts">
import { ArrowUpRight, BookOpen, Check, ChevronDown, Copy, Globe2 } from '@lucide/vue'
import { MarketingTextButton } from '@elinea/ui/marketing'

const sections = [
  { id: 'visao-geral', label: 'Seu endereço Elínea' },
  { id: 'antes-de-comecar', label: 'Antes de começar' },
  { id: 'nameservers', label: 'Onde alterar o DNS' },
  { id: 'registros-dns', label: 'Registros A e CNAME' },
  { id: 'cloudflare', label: 'Configurar na Cloudflare' },
  { id: 'https', label: 'Solicite a ativação' },
  { id: 'verificar', label: 'Verificar a configuração' },
  { id: 'duvidas', label: 'Resolver problemas' },
]
const records = [
  { type: 'A', name: '@', domain: 'exemplo.com', target: '193.160.119.94' },
  { type: 'CNAME', name: 'www', domain: 'www.exemplo.com', target: 'exemplo.elinea.com.br' },
]
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
  description: 'Sua loja já tem um endereço como exemplo.elinea.com.br. Saiba como apontar seu domínio próprio para a mesma loja com registros A e CNAME.',
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
          <p>Sua loja já tem um endereço na Elínea. Agora, veja como usar o seu próprio domínio para que seus clientes acessem essa mesma loja.</p>
          <span class="docs-updated">Atualizado em 11 de novembro de 2026</span>
        </header>

        <section id="visao-geral" class="docs-section" aria-labelledby="heading-visao-geral" tabindex="-1">
          <h2 id="heading-visao-geral">Sua loja começa com um endereço Elínea</h2>
          <p>Ao contratar a plataforma, você informa os dados do responsável e o nome da loja. A Elínea cria um endereço padrão para ela. Por exemplo, uma loja chamada <strong>Exemplo</strong> pode receber o endereço <code>exemplo.elinea.com.br</code>.</p>
          <p>Se você possui o domínio <code>exemplo.com</code>, pode conectá-lo à loja que já foi criada. Assim, seus clientes poderão acessar essa mesma loja pelo domínio próprio, conforme a configuração de ativação.</p>
          <div class="docs-note">
            <Globe2 :size="21" aria-hidden="true" />
            <div><strong>Use o endereço que foi criado para a sua loja.</strong><p>Neste exemplo, a loja é <code>exemplo.elinea.com.br</code> e o domínio do cliente é <code>exemplo.com</code>. No seu caso, substitua os exemplos pelo endereço gerado pela plataforma e pelo domínio que você possui.</p></div>
          </div>
        </section>

        <section id="antes-de-comecar" class="docs-section" aria-labelledby="heading-antes" tabindex="-1">
          <h2 id="heading-antes">O que você precisa ter em mãos</h2>
          <ul class="docs-checklist">
            <li><Check :size="17" aria-hidden="true" /><span>Um domínio registrado que você administra, como <code>exemplo.com</code>.</span></li>
            <li><Check :size="17" aria-hidden="true" /><span>Acesso ao painel do provedor que gerencia o DNS desse domínio.</span></li>
            <li><Check :size="17" aria-hidden="true" /><span>O endereço padrão gerado para sua loja na contratação, como <code>exemplo.elinea.com.br</code>. Ele será o destino do registro CNAME.</span></li>
            <li><Check :size="17" aria-hidden="true" /><span>Uma cópia ou captura dos registros atuais. Se você usa e-mail no domínio, preserve os registros desse serviço.</span></li>
          </ul>
          <p>O endereço <code>exemplo.elinea.com.br</code> é um exemplo: use o endereço exato que a plataforma criou para a sua loja. O domínio <code>exemplo.com</code> também deve ser substituído pelo seu.</p>
          <p>Se você não souber qual é o endereço padrão da sua loja, confirme com o atendimento antes de preencher o CNAME.</p>
        </section>

        <section id="nameservers" class="docs-section" aria-labelledby="heading-nameservers" tabindex="-1">
          <h2 id="heading-nameservers">Abra o painel de DNS do seu domínio</h2>
          <p>Acesse o provedor que gerencia o DNS do seu domínio e procure uma área chamada “Zona DNS”, “Gerenciar DNS” ou “Registros DNS”. Ela pode estar no serviço em que você registrou o domínio ou em outro provedor que você já utiliza.</p>
          <p><strong>Mantenha os servidores de nomes atuais.</strong> Para seguir este guia, você precisa alterar os registros A e CNAME; não é necessário transferir o domínio nem trocar os nameservers para os da Elínea.</p>
          <p>Se seu domínio já usa Cloudflare, faça as alterações no painel dela. Caso não saiba onde o DNS é gerenciado, peça essa informação ao seu provedor de domínio ou ao responsável que fez a configuração atual.</p>
        </section>

        <section id="registros-dns" class="docs-section" aria-labelledby="heading-registros" tabindex="-1">
          <h2 id="heading-registros">Configure os registros da loja</h2>
          <p>No painel de DNS de <code>exemplo.com</code>, selecione a opção de adicionar um registro e preencha os campos conforme a tabela. Crie um registro para o domínio principal e outro para o endereço com <code>www</code>.</p>
          <div class="docs-table-scroll" role="region" aria-label="Registros DNS da loja" tabindex="0">
            <table class="docs-table">
              <caption>Apontamentos para o domínio principal e o endereço com www</caption>
              <thead><tr><th scope="col">Tipo</th><th scope="col">Nome</th><th scope="col">Destino</th><th scope="col">Copiar</th></tr></thead>
              <tbody><tr v-for="record in records" :key="record.type"><td><span class="docs-record-type">{{ record.type }}</span></td><td><code>{{ record.name }}</code><small>{{ record.domain }}</small></td><td><code>{{ record.target }}</code><small v-if="record.type === 'CNAME'">Substitua pelo endereço gerado para sua loja.</small></td><td><button type="button" class="docs-copy" :aria-label="record.type === 'CNAME' ? 'Copiar exemplo de destino CNAME' : 'Copiar destino do registro A'" @click="copy(record.target, record.type === 'CNAME' ? 'Exemplo CNAME' : 'Destino A')"><Check v-if="copied === (record.type === 'CNAME' ? 'Exemplo CNAME' : 'Destino A')" :size="16" aria-hidden="true" /><Copy v-else :size="16" aria-hidden="true" /></button></td></tr></tbody>
            </table>
          </div>
          <p class="docs-table-hint">Deslize a tabela para ver os destinos e os botões de copiar.</p>
          <ul>
            <li><strong>Domínio principal:</strong> selecione o tipo A, preencha o nome com <code>@</code> e o destino com <code>193.160.119.94</code>. Alguns painéis pedem o domínio completo no lugar de <code>@</code>.</li>
            <li><strong>Endereço com www:</strong> selecione o tipo CNAME, preencha o nome com <code>www</code> e o destino com o endereço padrão da sua loja, como <code>exemplo.elinea.com.br</code>. Use apenas o nome, sem <code>https://</code>, barras ou caminhos.</li>
            <li>Deixe o TTL no padrão do seu provedor. Na Cloudflare, selecione “Auto”.</li>
            <li>Se já houver apontamentos de site para <code>@</code> ou <code>www</code>, ajuste os antigos para não manter destinos conflitantes. Isso pode incluir registros A, AAAA ou CNAME. Em caso de dúvida, envie uma captura ao atendimento antes de excluir algo.</li>
          </ul>
          <p>Na prática, o registro A faz <code>exemplo.com</code> resolver para o servidor da Elínea. O CNAME faz <code>www.exemplo.com</code> usar o destino DNS de <code>exemplo.elinea.com.br</code>. Depois da vinculação e da ativação, a plataforma entrega a sua loja quando esses domínios são acessados.</p>
          <p class="docs-detail">Preserve os registros de e-mail e de outros serviços. O apontamento leva as visitas até a Elínea; a associação do domínio próprio à sua loja é concluída na etapa de ativação abaixo.</p>
        </section>

        <section id="cloudflare" class="docs-section" aria-labelledby="heading-cloudflare" tabindex="-1">
          <h2 id="heading-cloudflare">Se o seu domínio já usa Cloudflare</h2>
          <p>Siga estes passos na sua própria conta Cloudflare. Se você usa outro provedor de DNS, faça a configuração equivalente no painel dele.</p>
          <ol class="docs-steps">
            <li><strong>Selecione o seu domínio.</strong><p>Abra o painel da Cloudflare e entre no domínio que deseja usar na loja.</p></li>
            <li><strong>Abra DNS → Registros.</strong><p>Localize os registros do site e crie ou edite os apontamentos A e CNAME conforme a tabela.</p></li>
            <li><strong>Selecione “Somente DNS”.</strong><p>Nos registros da loja, deixe o status do proxy como <strong>DNS only</strong>, com a nuvem cinza, para a configuração inicial. Mantenha o TTL em “Auto”.</p></li>
            <li><strong>Salve e avise a Elínea.</strong><p>Envie o domínio e uma captura dos registros para que a equipe confira a conexão com sua loja. Só altere a opção de proxy depois disso se houver orientação da Elínea.</p></li>
          </ol>
          <p>Os serviços usados internamente pela Elínea não exigem que você mova seu domínio para a nossa conta Cloudflare. Você continua administrando o domínio no seu provedor.</p>
          <p class="docs-reference">Ajuda do provedor: <a href="https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/" target="_blank" rel="noopener noreferrer">gerenciar registros DNS na Cloudflare <ArrowUpRight :size="14" aria-hidden="true" /></a>.</p>
        </section>

        <section id="https" class="docs-section" aria-labelledby="heading-https" tabindex="-1">
          <h2 id="heading-https">Solicite a conclusão da ativação</h2>
          <p>Depois de salvar os registros, informe à Elínea qual domínio próprio deve abrir a sua loja. Envie os dois endereços: por exemplo, <code>exemplo.elinea.com.br</code> (a loja criada na contratação) e <code>exemplo.com</code> (seu domínio próprio), além de uma captura dos apontamentos.</p>
          <p>Informe também se deseja usar o endereço com <code>www</code> e qual será o endereço principal. Por exemplo: <code>exemplo.com</code> como principal e <code>www.exemplo.com</code> como alternativa.</p>
          <div class="docs-note docs-note--plain"><div><strong>A vinculação da loja e o acesso seguro ficam com a Elínea.</strong><p>A equipe associa o domínio próprio à loja criada na contratação e confere o acesso por HTTPS. Como várias lojas usam a mesma plataforma, é essa associação que permite reconhecer qual loja atender em cada domínio.</p></div></div>
          <p>Aguarde a confirmação da Elínea antes de divulgar o novo endereço. Apenas salvar o registro DNS não confirma que a ativação está concluída.</p>
        </section>

        <section id="verificar" class="docs-section" aria-labelledby="heading-verificar" tabindex="-1">
          <h2 id="heading-verificar">Teste o acesso à sua loja</h2>
          <p>Após a confirmação da ativação, abra o seu domínio no navegador usando <code>https://</code>. Confira estes pontos:</p>
          <ul class="docs-checklist">
            <li><Check :size="17" aria-hidden="true" /><span>O endereço abre a sua loja, com o nome, a identidade e os produtos corretos.</span></li>
            <li><Check :size="17" aria-hidden="true" /><span>O navegador não mostra avisos de conexão insegura ou de certificado.</span></li>
            <li><Check :size="17" aria-hidden="true" /><span>O domínio principal e o endereço com <code>www</code> funcionam conforme o que foi combinado com a Elínea.</span></li>
          </ul>
          <p>As alterações de DNS podem levar algum tempo para aparecer em todas as redes, por causa do cache e do prazo de atualização do provedor. Se ainda aparecer o site antigo, aguarde a atualização e teste novamente. Evite alterar os registros repetidamente durante esse período.</p>
          <p>Se o endereço continuar sem abrir a loja correta, envie o domínio e uma captura do que aparece ao atendimento.</p>
        </section>

        <section id="duvidas" class="docs-section" aria-labelledby="heading-duvidas" tabindex="-1">
          <h2 id="heading-duvidas">Dúvidas frequentes</h2>
          <details><summary>Preciso trocar de provedor ou usar Cloudflare?</summary><p>Você pode manter o provedor de DNS que já utiliza. Para conectar a loja, configure os registros A e CNAME e informe o domínio à Elínea.</p></details>
          <details><summary>Outras lojas usam o mesmo IP. Como a minha é identificada?</summary><p>O IP leva o acesso até a plataforma. Quando alguém abre <code>exemplo.com</code>, a Elínea consulta a associação desse domínio e entrega a mesma loja criada com o endereço <code>exemplo.elinea.com.br</code>. Essa associação precisa estar concluída para o domínio próprio funcionar.</p></details>
          <details><summary>Qual endereço devo colocar no CNAME?</summary><p>Use o endereço padrão que a plataforma gerou para a sua loja na contratação. Por exemplo, se a sua loja foi criada como <code>exemplo.elinea.com.br</code>, esse será o destino do CNAME de <code>www.exemplo.com</code>. Não use o endereço de outra loja.</p></details>
          <details><summary>O domínio mostra “loja não encontrada” ou abre uma página diferente</summary><p>Confirme os registros DNS e informe o domínio ao atendimento. A equipe vai conferir se esse endereço está vinculado à sua loja. Se o domínio já apontava para outro site, a atualização do DNS também pode estar em andamento.</p></details>
          <details><summary>O domínio principal abre, mas o www não</summary><p>Confira o CNAME e avise a Elínea de que o endereço com www também será utilizado. Os dois endereços precisam estar contemplados na ativação; o registro DNS sozinho não cria essa configuração.</p></details>
          <details><summary>O apontamento da loja muda meu e-mail?</summary><p>Você deve manter os registros do serviço de e-mail, como MX e os TXT de SPF, DKIM e DMARC. Se o e-mail parar após uma alteração, compare os registros com a cópia anterior e procure o provedor do seu e-mail.</p></details>
          <details><summary>Aparece um erro da Cloudflare ou de conexão segura</summary><p>Envie o domínio e uma captura do erro ao atendimento da Elínea. Se você usa Cloudflare, confira se os registros da loja estão em “Somente DNS”. A equipe verifica o que precisa ser ajustado na plataforma.</p></details>
          <div class="docs-support"><h3>Precisa de ajuda com o seu domínio?</h3><p>Informe o endereço da loja e envie uma captura dos registros. Não envie senhas ou chaves de acesso.</p><MarketingTextButton class="docs-support-action" href="mailto:contato@elinea.com.br">Falar com a Elínea</MarketingTextButton></div>
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
.docs-section a:not(.docs-copy):not(.docs-support-action) { color: #08734b; text-decoration: underline; text-underline-offset: .2em; }
.docs-section a svg { display: inline; vertical-align: middle; }
.docs-note { display: flex; align-items: flex-start; gap: .9rem; margin-block: 1.7rem; padding: 1.3rem 1.5rem; border-left: 3px solid var(--green); background: var(--green-light); }
.docs-note > svg { flex-shrink: 0; margin-top: .15rem; color: #08734b; }
.docs-note strong { display: block; line-height: 1.5; }
.docs-note p { margin-top: .5rem; color: #365b4a; font-size: .9rem; }
.docs-note--plain { background: var(--warm-white); }
.docs-section > .docs-checklist { list-style: none; padding-left: 0; }
.docs-checklist li { display: flex; align-items: flex-start; gap: .7rem; }
.docs-checklist svg { flex-shrink: 0; margin-top: .35rem; color: var(--green); }
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
.docs-section details { border-bottom: 1px solid var(--line); }
.docs-section summary { display: flex; align-items: center; justify-content: space-between; min-height: 60px; gap: 1rem; padding: 1rem 0; color: var(--ink-2); font-size: 1rem; font-weight: 500; cursor: pointer; list-style: none; }
.docs-section summary::-webkit-details-marker { display: none; }
.docs-section summary::after { content: '+'; font-size: 1.3rem; font-weight: 400; }
.docs-section details[open] summary::after { content: '−'; }
.docs-section details > p { margin: 0 0 1.3rem; font-size: .9rem; }
.docs-support { margin-top: 2.5rem; }
.docs-support p { margin-block: .7rem 1rem; }
.docs-support-action { --elinea-marketing-text-button-color: #08734b; --elinea-marketing-text-button-line: transparent; }
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
}
@media (prefers-reduced-motion: reduce) { .docs-menu-toggle svg { transition: none; } }
</style>
