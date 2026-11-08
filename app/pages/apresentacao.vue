<script setup lang="ts">
definePageMeta({ middleware: 'local-only' })

useHead({
  title: 'Elínea — Apresentação comercial',
  meta: [
    { name: 'description', content: 'Apresentação comercial da plataforma Elínea, diagramada para exportação em PDF.' },
    { name: 'theme-color', content: '#0d1715' },
  ],
  link: [
    { rel: 'preload', href: '/apresentacao-assets/fonts/inter-400.ttf', as: 'font', type: 'font/ttf', crossorigin: 'anonymous' },
    { rel: 'preload', href: '/apresentacao-assets/fonts/inter-500.ttf', as: 'font', type: 'font/ttf', crossorigin: 'anonymous' },
    { rel: 'preload', href: '/apresentacao-assets/fonts/inter-600.ttf', as: 'font', type: 'font/ttf', crossorigin: 'anonymous' },
    { rel: 'preload', href: '/apresentacao-assets/fonts/inter-700.ttf', as: 'font', type: 'font/ttf', crossorigin: 'anonymous' },
  ],
  style: [{
    key: 'presentation-fonts',
    textContent: `
      @font-face { font-family: InterPresentation; src: url('/apresentacao-assets/fonts/inter-400.ttf') format('truetype'); font-weight: 400; font-display: block; }
      @font-face { font-family: InterPresentation; src: url('/apresentacao-assets/fonts/inter-500.ttf') format('truetype'); font-weight: 500; font-display: block; }
      @font-face { font-family: InterPresentation; src: url('/apresentacao-assets/fonts/inter-600.ttf') format('truetype'); font-weight: 600; font-display: block; }
      @font-face { font-family: InterPresentation; src: url('/apresentacao-assets/fonts/inter-700.ttf') format('truetype'); font-weight: 700; font-display: block; }
    `,
  }],
})

const documentRoot = ref<HTMLElement | null>(null)
const exporting = ref(false)
const exportLabel = ref('Exportar PDF')
const assetUrl = (path: string) => `/apresentacao-assets/${path}`

async function exportPdf() {
  if (exporting.value || !documentRoot.value) return

  exporting.value = true
  exportLabel.value = 'Preparando…'

  try {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ])

    await document.fonts.ready
    await Promise.all([...documentRoot.value.querySelectorAll('img')].map(image => image.decode().catch(() => undefined)))

    const pages = [...documentRoot.value.querySelectorAll<HTMLElement>('.page')]
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [1600, 900],
      compress: true,
      hotfixes: ['px_scaling'],
    })

    for (const [index, page] of pages.entries()) {
      exportLabel.value = `Gerando ${index + 1}/${pages.length}…`

      const canvas = await html2canvas(page, {
        backgroundColor: null,
        logging: false,
        scale: 1.25,
        useCORS: true,
        width: 1600,
        height: 900,
        windowWidth: 1664,
        windowHeight: 964,
        onclone: (clonedDocument: Document) => {
          clonedDocument.documentElement.style.background = '#dfe5e2'
          clonedDocument.body.style.background = '#dfe5e2'
          clonedDocument.body.style.color = '#0d1715'

          const clonedPage = clonedDocument.getElementById(page.id)
          if (!clonedPage) return
          clonedPage.style.width = '1600px'
          clonedPage.style.height = '900px'
          clonedPage.style.margin = '0'
          clonedPage.style.boxShadow = 'none'
        },
      })

      if (index > 0) pdf.addPage([1600, 900], 'landscape')
      pdf.addImage(canvas.toDataURL('image/jpeg', .94), 'JPEG', 0, 0, 1600, 900, undefined, 'FAST')
      await new Promise(resolve => window.setTimeout(resolve, 0))
    }

    pdf.save('apresentacao-comercial-elinea.pdf')
  } catch (error) {
    console.error(error)
    const message = error instanceof Error ? error.message : 'Recarregue a apresentação e tente novamente.'
    window.alert(`Não foi possível gerar o PDF. ${message}`)
  } finally {
    exporting.value = false
    exportLabel.value = 'Exportar PDF'
  }
}
</script>

<template>
  <div class="presentation-shell">
    <button class="pdf-export" type="button" :aria-busy="exporting" aria-label="Gerar apresentação em PDF" @click="exportPdf">
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </svg>
      <span>{{ exportLabel }}</span>
    </button>
    <main ref="documentRoot" class="presentation-document" aria-label="Apresentação comercial Elínea">
      <section id="page-01" class="page page--ink cover" aria-labelledby="page-01-title">
        <div class="cover__photo"><img :src="assetUrl('capa-exclusiva.png')" alt="Comerciante abrindo sua loja no início do dia"></div>
        <div class="cover__veil"></div>
        <div class="page__frame">
          <div class="cover__content">
            <div class="cover__brand"><img :src="assetUrl('logo-elinea-white.svg')" alt="Elínea"></div>
            <h1 id="page-01-title" class="cover__title">Novas oportunidades.</h1>
            <div class="cover__statement"><strong>Seu negócio conectado ao próximo cliente.</strong><p>Soluções inteligentes para vender online com simplicidade e estrutura.</p></div>
          </div>
        </div>
      </section>
    
      <section id="page-02" class="page market" aria-labelledby="page-02-title">
        <span class="connection-field" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        <div class="page__frame">
          <header class="page-meta"><span class="page-meta__chapter">O mercado mudou</span><span class="page-meta__folio">02 / 10</span></header>
          <div class="market__layout">
            <div class="market__copy">
              <h2 id="page-02-title" class="page-title page-title--wide">Seus clientes já estão no digital.</h2>
              <p class="page-copy market__intro">A jornada de compra começa muito antes da visita à loja.</p>
              <ul class="market__points">
                <li><b>01</b>Pesquisam produtos e preços pela internet.</li>
                <li><b>02</b>Escolhem também pela facilidade de comprar.</li>
                <li><b>03</b>Esperam encontrar negócios locais online.</li>
                <li><b>04</b>Podem desistir quando a compra depende só do presencial.</li>
              </ul>
            </div>
            <figure class="market__visual">
              <div class="market__image"><img :src="assetUrl('cliente-digital-documental.png')" alt="Cliente pesquisando produtos pelo celular em casa"></div>
              <figcaption class="market__caption">Quando alguém procurar o que sua empresa vende, encontrará o seu negócio?</figcaption>
            </figure>
          </div>
        </div>
      </section>
    
      <section id="page-03" class="page page--ink problem" aria-labelledby="page-03-title">
        <div class="page__frame">
          <header class="page-meta"><span class="page-meta__chapter">O problema</span><span class="page-meta__folio">03 / 10</span></header>
          <div class="problem__head">
            <h2 id="page-03-title" class="page-title page-title--wide">Vender online não deveria ser complicado.</h2>
            <p class="page-copy">A vontade de crescer existe. O que falta é uma tecnologia compatível com a rotina de quem toca o negócio todos os dias.</p>
          </div>
          <div class="problem__grid">
            <article class="problem__item"><small>01</small><h3>Tempo curto.</h3><p>A operação já exige atenção constante.</p></article>
            <article class="problem__item"><small>02</small><h3>Custo alto.</h3><p>Projetos sob medida nem sempre cabem no início.</p></article>
            <article class="problem__item"><small>03</small><h3>Ferramentas complexas.</h3><p>Tecnologia não pode virar mais uma barreira.</p></article>
            <article class="problem__item"><small>04</small><h3>Canais dispersos.</h3><p>Pedidos e informações se perdem no caminho.</p></article>
          </div>
        </div>
      </section>
    
      <section id="page-04" class="page solution" aria-labelledby="page-04-title">
        <div class="page__frame">
          <header class="page-meta"><span class="page-meta__chapter">A solução</span><span class="page-meta__folio">04 / 10</span></header>
          <div class="solution__layout">
            <div class="solution__copy">
              <h2 id="page-04-title" class="page-title">Conheça o Elínea.</h2>
              <p>Sua loja virtual, de forma simples e profissional. Produtos, pedidos e operação digital reunidos em um único ambiente.</p>
              <ul class="solution__features">
                <li>Identidade própria</li><li>Painel administrativo</li><li>Produtos e pedidos</li>
                <li>Compra responsiva</li><li>Pagamentos por plano</li><li>Pedidos via WhatsApp</li>
              </ul>
            </div>
            <div class="solution__map" aria-label="Representação conceitual dos recursos da plataforma">
              <div class="solution__map-logo"><img :src="assetUrl('logo-elinea-white.svg')" alt="Elínea"></div>
              <span class="solution__map-note">Visão funcional<br>Representação conceitual</span>
              <div class="solution__map-main"><small>Experiência de compra</small><strong>Uma loja com a identidade da sua marca.</strong></div>
              <div class="solution__nodes">
                <div class="solution__node"><small>Operação</small><strong>Produtos e pedidos organizados.</strong></div>
                <div class="solution__node"><small>Relacionamento</small><strong>WhatsApp próximo da venda.</strong></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    
      <section id="page-05" class="page page--green flow" aria-labelledby="page-05-title">
        <span class="mark-word" aria-hidden="true">04</span>
        <div class="page__frame">
          <header class="page-meta"><span class="page-meta__chapter">Como funciona</span><span class="page-meta__folio">05 / 10</span></header>
          <div class="flow__head">
            <h2 id="page-05-title" class="page-title page-title--wide">Do cadastro do produto à realização da venda.</h2>
            <p class="page-copy">A tecnologia trabalha a favor do negócio enquanto você acompanha o que realmente importa.</p>
          </div>
          <div class="flow__track">
            <article class="flow__step"><small>01</small><h3>Cadastre.</h3><p>Organize produtos, preço e disponibilidade.</p></article>
            <article class="flow__step"><small>02</small><h3>Publique.</h3><p>Sua loja fica disponível em qualquer tela.</p></article>
            <article class="flow__step"><small>03</small><h3>Venda.</h3><p>O cliente encontra e realiza o pedido.</p></article>
            <article class="flow__step"><small>04</small><h3>Acompanhe.</h3><p>Você administra a operação em um só lugar.</p></article>
          </div>
          <div class="flow__demo"><span>Ponto de transição da apresentação</span><strong>Demonstração real da plataforma</strong></div>
        </div>
      </section>
    
      <section id="page-06" class="page benefits" aria-labelledby="page-06-title">
        <span class="connection-field" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        <div class="page__frame">
          <header class="page-meta"><span class="page-meta__chapter">Benefícios</span><span class="page-meta__folio">06 / 10</span></header>
          <div class="benefits__head">
            <h2 id="page-06-title" class="page-title">Mais do que uma loja virtual.</h2>
            <p class="page-copy">Uma base que faz sentido agora e continua fazendo quando a operação crescer.</p>
          </div>
          <div class="benefits__body">
            <div class="benefits__number" aria-hidden="true">05</div>
            <ul class="benefits__list">
              <li><strong>Presença digital</strong><span>Um canal próprio para sua empresa vender.</span></li>
              <li><strong>Independência</strong><span>Sua marca além das redes sociais.</span></li>
              <li><strong>Organização</strong><span>Produtos e pedidos no mesmo ambiente.</span></li>
              <li><strong>Profissionalismo</strong><span>Uma experiência de compra estruturada.</span></li>
              <li><strong>Escalabilidade</strong><span>Recursos que acompanham a evolução.</span></li>
            </ul>
          </div>
        </div>
      </section>
    
      <section id="page-07" class="page segments" aria-labelledby="page-07-title">
        <div class="page__frame">
          <header class="page-meta"><span class="page-meta__chapter">Segmentos</span><span class="page-meta__folio">07 / 10</span></header>
          <div class="segments__head">
            <h2 id="page-07-title" class="page-title">O Elínea se adapta ao seu negócio.</h2>
            <p class="page-copy">Tecnologia próxima da rotina de pequenos e médios negócios reais.</p>
          </div>
          <div class="segments__grid">
            <figure class="segment"><img :src="assetUrl('segmento-farmacia-exclusiva.png')" alt="Farmacêutica organizando um pedido no balcão"><figcaption class="segment__label"><strong>Farmácias</strong><small>01</small></figcaption></figure>
            <figure class="segment"><img :src="assetUrl('segmento-boutique-exclusiva.png')" alt="Lojista organizando peças em uma boutique"><figcaption class="segment__label"><strong>Lojas e boutiques</strong><small>02</small></figcaption></figure>
            <figure class="segment"><img :src="assetUrl('segmento-especializados-exclusiva.png')" alt="Comerciante medindo materiais especializados"><figcaption class="segment__label"><strong>Especializados</strong><small>03</small></figcaption></figure>
            <figure class="segment"><img :src="assetUrl('segmento-comercio-local-paisagem.png')" alt="Comerciante organizando produtos frescos em sua loja"><figcaption class="segment__label"><strong>Comércio local</strong><small>04</small></figcaption></figure>
          </div>
        </div>
      </section>
    
      <section id="page-08" class="page page--mist plans" aria-labelledby="page-08-title">
        <span class="connection-field" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        <div class="page__frame">
          <header class="page-meta"><span class="page-meta__chapter">Planos</span><span class="page-meta__folio">08 / 10</span></header>
          <div class="plans__head">
            <h2 id="page-08-title" class="page-title">Comece com o que precisa.</h2>
            <p class="page-copy">Evolua quando quiser, sem carregar a operação com recursos antes da hora.</p>
          </div>
          <div class="plans__grid">
            <article class="plan"><span class="plan__tag">PARA COMEÇAR</span><h3>Essencial</h3><p class="plan__price"><strong>R$ 149</strong><span>/mês</span></p><ul><li>Até 500 produtos</li><li>Loja virtual e carrinho</li><li>Pedidos via WhatsApp</li><li>Painel administrativo</li><li>Relatórios básicos</li><li>SSL e suporte</li></ul></article>
            <article class="plan plan--featured"><span class="plan__tag">MAIS ESCOLHIDO</span><h3>Profissional</h3><p class="plan__price"><strong>R$ 249</strong><span>/mês</span></p><ul><li>Tudo do Essencial</li><li>Até 2.000 produtos</li><li>Pagamentos online</li><li>Cupons e banners</li><li>SEO básico</li><li>Relatórios</li></ul></article>
            <article class="plan"><span class="plan__tag">PARA EVOLUIR</span><h3>Premium</h3><p class="plan__price"><strong>R$ 399</strong><span>/mês</span></p><ul><li>Tudo do Profissional</li><li>Integrações específicas</li><li>Serviços de tráfego ADS</li><li>Suporte prioritário</li></ul></article>
            <article class="plan"><span class="plan__tag">SOB MEDIDA</span><h3>Personalizado</h3><p class="plan__price"><strong>Sob consulta</strong></p><ul><li>Layout personalizado</li><li>Funcionalidades sob demanda</li><li>Escopo definido com sua equipe</li></ul></article>
          </div>
          <div class="plans__foot"><span>Implantação prevista entre R$ 790 e R$ 1.490, conforme o escopo.</span><span>Valores do planejamento comercial inicial.</span></div>
        </div>
      </section>
    
      <section id="page-09" class="page support" aria-labelledby="page-09-title">
        <div class="page__frame">
          <header class="page-meta"><span class="page-meta__chapter">Implantação e suporte</span><span class="page-meta__folio">09 / 10</span></header>
          <div class="support__layout">
            <figure class="support__visual"><div class="support__image"><img :src="assetUrl('suporte-exclusiva.png')" alt="Comerciante recebendo orientação durante a implantação"></div></figure>
            <div class="support__copy">
              <h2 id="page-09-title" class="page-title">Você não precisa fazer tudo sozinho.</h2>
              <p class="page-copy">Acompanhamento próximo para simplificar a parte tecnológica desde o primeiro passo.</p>
              <ul class="support__list">
                <li><b>01</b>Configuração inicial</li><li><b>02</b>Personalização com a identidade da empresa</li>
                <li><b>03</b>Orientação para utilizar o painel</li><li><b>04</b>Apoio na publicação</li><li><b>05</b>Suporte conforme o plano</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    
      <section id="page-10" class="page page--ink closing" aria-labelledby="page-10-title">
        <div class="closing__photo"><img :src="assetUrl('encerramento-exclusiva.png')" alt="Comerciante finalizando um pedido para entrega"></div>
        <div class="closing__veil"></div>
        <div class="page__frame">
          <div class="closing__content">
            <div class="closing__logo"><img :src="assetUrl('logo-elinea-white.svg')" alt="Elínea"></div>
            <h2 id="page-10-title">Seu próximo cliente pode estar a um clique.</h2>
            <p>Leve seu negócio para o digital com uma solução feita para crescer com você.</p>
            <div class="closing__cta"><strong>Solicite uma demonstração</strong><span>contato@elinea.com.br</span></div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
    .presentation-shell {
      --ink: #0d1715;
      --ink-soft: #14221f;
      --paper: #fafcfb;
      --mist: #eef3f0;
      --green: #07945e;
      --green-deep: #047348;
      --green-light: #dff4e9;
      --green-bright: #5cdda4;
      --muted: #62716b;
      --line: rgba(13, 23, 21, .16);
      --white-line: rgba(255, 255, 255, .23);
      --page-width: min(calc(100vw - 64px), 1600px);
      --page-height: min(calc((100vw - 64px) * .5625), 900px);
      --gutter: clamp(38px, 4.5vw, 76px);
    }

    .presentation-shell, .presentation-shell * { box-sizing: border-box; }
    .presentation-shell {
      margin: 0;
      overflow-x: hidden;
      background: #dfe6e2;
      color: var(--ink);
      font: 400 16px/1.45 InterPresentation, Inter, "Segoe UI", sans-serif;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
    }
    .presentation-shell h1, .presentation-shell h2, .presentation-shell h3, .presentation-shell p, .presentation-shell ul, .presentation-shell ol, .presentation-shell figure { margin: 0; }
    .presentation-shell :where(h1, h2, h3) { color: inherit; font-family: inherit; }
    .presentation-shell ul, .presentation-shell ol { padding: 0; }
    .presentation-shell img { display: block; max-width: 100%; }

    .pdf-export {
      position: fixed;
      z-index: 100;
      top: 18px;
      right: 18px;
      display: inline-flex;
      align-items: center;
      gap: 9px;
      min-height: 44px;
      padding: 0 17px;
      border: 1px solid rgba(255,255,255,.2);
      border-radius: 999px;
      background: var(--ink);
      box-shadow: 0 12px 32px rgba(13,23,21,.24);
      color: white;
      font: 650 14px/1 InterPresentation, Inter, "Segoe UI", sans-serif;
      text-decoration: none;
      cursor: pointer;
    }
    .pdf-export svg { width: 17px; height: 17px; }
    .pdf-export:hover { background: var(--green-deep); }
    .pdf-export:focus-visible { outline: 3px solid var(--green-bright); outline-offset: 3px; }
    .pdf-export[aria-busy="true"] { pointer-events: none; opacity: .72; }

    .presentation-document { display: grid; gap: 32px; padding: 32px 0; }
    .page {
      position: relative;
      width: var(--page-width);
      height: var(--page-height);
      margin: 0 auto;
      overflow: hidden;
      background: var(--paper);
      box-shadow: 0 28px 80px -45px rgba(13, 23, 21, .48);
      isolation: isolate;
    }
    .page--ink { background: var(--ink); color: white; }
    .page--green { background: var(--green); color: white; }
    .page--mist { background: var(--mist); }
    .page__frame {
      position: relative;
      z-index: 3;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      padding: clamp(30px, 3.8vw, 62px) var(--gutter) clamp(34px, 4vw, 68px);
    }
    .page-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      min-height: 24px;
      color: var(--muted);
      font-size: clamp(14px, .9vw, 16px);
      font-weight: 600;
    }
    .page--ink .page-meta, .page--green .page-meta { color: rgba(255,255,255,.64); }
    .page-meta__chapter { display: flex; align-items: center; gap: 12px; }
    .page-meta__chapter::before { width: 28px; height: 2px; background: currentColor; content: ""; }
    .page-meta__folio { font-variant-numeric: tabular-nums; }
    .page-title {
      max-width: 12ch;
      font-size: clamp(42px, 5.55vw, 88px);
      font-weight: 700;
      line-height: .92;
      letter-spacing: -.068em;
      text-wrap: balance;
    }
    .page-title--wide { max-width: 17ch; }
    .page-copy { max-width: 52ch; color: var(--muted); font-size: clamp(14px, 1.05vw, 18px); }
    .page--ink .page-copy, .page--green .page-copy { color: rgba(255,255,255,.72); }
    .mark-word {
      position: absolute;
      z-index: -1;
      color: rgba(7,148,94,.07);
      font-size: clamp(320px, 43vw, 680px);
      font-weight: 700;
      line-height: .66;
      letter-spacing: -.15em;
      user-select: none;
    }
    .page--ink .mark-word { color: rgba(92,221,164,.055); }


    .connection-field {
      position: absolute;
      z-index: 0;
      width: min(45vw, 720px);
      aspect-ratio: 1;
      pointer-events: none;
      opacity: .78;
    }
    .connection-field::before,
    .connection-field::after,
    .connection-field i:not(:last-child) {
      position: absolute;
      border: 1px solid rgba(7, 148, 94, .2);
      border-radius: 50%;
      content: "";
    }
    .connection-field::before { inset: 0; border-color: rgba(7, 148, 94, .14); }
    .connection-field::after { inset: 17%; }
    .connection-field i:nth-child(1) { inset: 34%; }
    .connection-field i:nth-child(2) {
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      border: 0;
      border-radius: 0;
      background: linear-gradient(90deg, transparent, rgba(7, 148, 94, .24) 22%, rgba(7, 148, 94, .24) 78%, transparent);
    }
    .connection-field i:nth-child(3) {
      top: 0;
      bottom: 0;
      left: 50%;
      width: 1px;
      border: 0;
      border-radius: 0;
      background: linear-gradient(180deg, transparent, rgba(7, 148, 94, .18) 24%, rgba(7, 148, 94, .18) 76%, transparent);
    }
    .connection-field i:nth-child(4) {
      position: absolute;
      top: calc(50% - 7px);
      right: 15.5%;
      width: 14px;
      height: 14px;
      border: 4px solid var(--paper);
      border-radius: 50%;
      background: var(--green);
      box-shadow: 0 0 0 1px rgba(7, 148, 94, .38);
    }

    /* 01 — Capa */
    .cover::before {
      position: absolute; z-index: 2; width: 68%; aspect-ratio: 1; right: -26%; top: -57%;
      border: 3px solid var(--green-bright); border-radius: 50%; content: "";
    }
    .cover::after {
      position: absolute; z-index: 4; width: 40%; aspect-ratio: 1; right: -6%; bottom: -47%;
      border: 2px solid rgba(92,221,164,.7); border-radius: 50%; content: "";
    }
    .cover__photo {
      position: absolute; z-index: 0; inset: 0 0 0 55%; overflow: hidden;
      clip-path: ellipse(78% 78% at 78% 50%);
    }
    .cover__photo img { width: 100%; height: 100%; object-fit: cover; object-position: 58% center; filter: grayscale(1) contrast(1.08); }
    .cover__photo::after { position: absolute; inset: 0; background: rgba(0,150,91,.78); mix-blend-mode: multiply; content: ""; }
    .cover__veil { position: absolute; z-index: 1; inset: 0; background: linear-gradient(90deg, var(--ink) 0 49%, rgba(13,23,21,.97) 56%, transparent 78%); }
    .cover__brand { width: clamp(124px, 13vw, 205px); }
    .cover__brand img { width: 100%; }
    .cover__content { width: 61%; margin-top: auto; margin-bottom: auto; }
    .cover__title {
      max-width: 8ch; margin-top: clamp(38px, 6vh, 76px);
      font-size: clamp(58px, 8.6vw, 138px); font-weight: 700; line-height: .82; letter-spacing: -.085em;
    }
    .cover__statement {
      display: grid; grid-template-columns: 1.18fr .82fr; gap: clamp(20px, 3vw, 46px);
      align-items: end; margin-top: clamp(36px, 7vh, 78px); padding-top: 18px; border-top: 1px solid var(--white-line);
    }
    .cover__statement strong { max-width: 22ch; font-size: clamp(18px, 1.65vw, 27px); line-height: 1.18; letter-spacing: -.035em; }
    .cover__statement p { max-width: 30ch; color: rgba(255,255,255,.66); font-size: clamp(12px, .95vw, 16px); }

    /* 02 — Mercado */
    .market .connection-field { left: -16%; top: 9%; transform: rotate(-8deg); }
    .market__layout { display: grid; grid-template-columns: .94fr 1.06fr; gap: clamp(32px, 6vw, 92px); flex: 1; align-items: center; }
    .market__copy { position: relative; z-index: 2; }
    .market__copy .page-title { margin-top: clamp(28px, 4.5vh, 54px); }
    .market__intro { margin-top: 24px; }
    .market__points { display: grid; grid-template-columns: 1fr 1fr; margin-top: clamp(28px, 5vh, 54px); border-top: 1px solid var(--line); list-style: none; }
    .market__points li { min-height: clamp(64px, 8vh, 92px); padding: 14px 18px 12px 0; border-bottom: 1px solid var(--line); color: var(--muted); font-size: clamp(11px, .82vw, 14px); }
    .market__points li:nth-child(odd) { border-right: 1px solid var(--line); }
    .market__points li:nth-child(even) { padding-left: 18px; }
    .market__points b { display: block; margin-bottom: 7px; color: var(--green); font-size: 11px; }
    .market__visual { position: relative; height: 76%; min-height: 420px; }
    .market__visual::before {
      position: absolute; z-index: -1; width: 86%; aspect-ratio: 1; right: -12%; top: -25%;
      border: 2px solid var(--green); border-radius: 50%; content: "";
    }
    .market__image { position: absolute; inset: 0; overflow: hidden; border-radius: 48% 0 0 48% / 50% 0 0 50%; background: var(--green); }
    .market__image img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.08); }
    .market__image::after { position: absolute; inset: 0; background: rgba(7,148,94,.62); mix-blend-mode: multiply; content: ""; }
    .market__caption { position: absolute; z-index: 2; left: -42px; bottom: 28px; width: 210px; padding: 16px; background: var(--ink); color: white; font-size: 12px; line-height: 1.45; }

    /* 03 — Problema */
    .problem::before {
      position: absolute; width: 60%; aspect-ratio: 1; right: -22%; top: -60%;
      border: 2px solid rgba(92,221,164,.38); border-radius: 50%; content: "";
    }
    .problem__head { display: grid; grid-template-columns: 1.15fr .85fr; gap: 60px; align-items: end; margin-top: clamp(38px, 6vh, 72px); }
    .problem__head .page-title { max-width: 15ch; }
    .problem__head p { max-width: 40ch; padding-bottom: 8px; color: rgba(255,255,255,.62); }
    .problem__grid { display: grid; grid-template-columns: repeat(4, 1fr); margin-top: auto; border-top: 1px solid var(--white-line); }
    .problem__item { min-height: clamp(210px, 30vh, 294px); padding: 20px clamp(16px, 2vw, 30px) 16px 0; border-right: 1px solid var(--white-line); }
    .problem__item + .problem__item { padding-left: clamp(16px, 2vw, 30px); }
    .problem__item:last-child { border-right: 0; }
    .problem__item small { color: var(--green-bright); font-size: 11px; font-weight: 600; }
    .problem__item h3 { max-width: 12ch; margin-top: clamp(52px, 8vh, 88px); font-size: clamp(20px, 2.15vw, 34px); font-weight: 600; line-height: 1.05; letter-spacing: -.05em; }
    .problem__item p { max-width: 25ch; margin-top: 12px; color: rgba(255,255,255,.5); font-size: 11px; }

    /* 04 — Solução */
    .solution { background: var(--mist); }
    .solution::before { position: absolute; inset: 0 55% 0 0; background: var(--green); content: ""; }
    .solution::after {
      position: absolute; z-index: 1; width: 62%; aspect-ratio: 1; left: -28%; bottom: -67%;
      border: 2px solid rgba(255,255,255,.62); border-radius: 50%; content: "";
    }
    .solution .page-meta { color: rgba(255,255,255,.72); }
    .solution__layout { display: grid; grid-template-columns: 1fr .88fr; gap: clamp(48px, 8vw, 130px); flex: 1; align-items: center; }
    .solution__copy { color: white; }
    .solution__copy .page-title { max-width: 9ch; margin-top: 34px; }
    .solution__copy p { max-width: 43ch; margin-top: 22px; color: rgba(255,255,255,.74); font-size: clamp(13px, 1vw, 17px); }
    .solution__features { display: grid; grid-template-columns: 1fr 1fr; gap: 0 22px; margin-top: 28px; border-top: 1px solid rgba(255,255,255,.28); list-style: none; }
    .solution__features li { padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,.28); font-size: clamp(14px, .9vw, 16px); font-weight: 500; }
    .solution__map { position: relative; padding: clamp(26px, 3vw, 46px); background: var(--ink); color: white; }
    .solution__map-logo { width: 110px; }
    .solution__map-logo img { width: 100%; }
    .solution__map-note { position: absolute; right: 28px; top: 28px; color: rgba(255,255,255,.45); font-size: 12px; text-align: right; }
    .solution__map-main { margin-top: clamp(46px, 7vh, 78px); padding: 20px; background: var(--green); }
    .solution__map-main small, .solution__node small { color: rgba(255,255,255,.58); font-size: 12px; }
    .solution__map-main strong { display: block; max-width: 18ch; margin-top: 22px; font-size: clamp(18px, 1.6vw, 26px); line-height: 1.1; }
    .solution__nodes { display: grid; grid-template-columns: 1fr 1fr; }
    .solution__node { min-height: 118px; padding: 18px 0; border-bottom: 1px solid var(--white-line); }
    .solution__node:first-child { padding-right: 16px; border-right: 1px solid var(--white-line); }
    .solution__node:last-child { padding-left: 16px; }
    .solution__node strong { display: block; max-width: 14ch; margin-top: 24px; font-size: clamp(13px, 1vw, 17px); line-height: 1.15; }

    /* 05 — Fluxo */
    .flow .mark-word { right: -5%; top: 10%; color: rgba(255,255,255,.085); }
    .flow__head { display: grid; grid-template-columns: 1.15fr .85fr; gap: 56px; align-items: end; margin-top: clamp(32px, 5vh, 60px); }
    .flow__head .page-title { max-width: 14ch; }
    .flow__head p { max-width: 38ch; padding-bottom: 7px; }
    .flow__track { position: relative; display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; margin-top: auto; }
    .flow__track::before { position: absolute; top: 26px; left: 9px; right: calc(25% - 9px); height: 2px; background: rgba(255,255,255,.36); content: ""; }
    .flow__step { position: relative; min-height: clamp(205px, 28vh, 275px); padding: 64px clamp(20px, 2.4vw, 38px) 0 0; }
    .flow__step::before {
      position: absolute; top: 18px; left: 0; width: 18px; height: 18px; border: 6px solid var(--green);
      border-radius: 50%; background: white; box-shadow: 0 0 0 1px white; content: "";
    }
    .flow__step small { color: rgba(255,255,255,.68); font-size: clamp(12px, .85vw, 15px); font-weight: 650; }
    .flow__step h3 { max-width: 10ch; margin-top: 18px; font-size: clamp(20px, 2.1vw, 34px); line-height: 1.02; letter-spacing: -.05em; }
    .flow__step p { max-width: 24ch; margin-top: 12px; color: rgba(255,255,255,.72); font-size: clamp(13px, 1vw, 17px); line-height: 1.38; }
    .flow__demo { display: flex; justify-content: space-between; gap: 20px; padding: 14px 0; border-top: 1px solid rgba(255,255,255,.28); font-size: 11px; }
    .flow__demo strong { color: white; }

    /* 06 — Benefícios */
    .benefits .connection-field { left: -18%; top: 12%; transform: rotate(-12deg) scale(.9); }
    .benefits__head { display: flex; justify-content: space-between; gap: 50px; align-items: end; margin-top: clamp(34px, 5vh, 62px); }
    .benefits__head .page-title { max-width: 11ch; }
    .benefits__head p { max-width: 39ch; padding-bottom: 8px; }
    .benefits__body { display: grid; grid-template-columns: .53fr 1.47fr; gap: clamp(40px, 6vw, 92px); flex: 1; margin-top: 34px; }
    .benefits__number { display: flex; align-items: end; color: var(--green); font-size: clamp(150px, 19vw, 300px); font-weight: 700; line-height: .68; letter-spacing: -.12em; }
    .benefits__list { align-self: center; border-top: 1px solid var(--line); list-style: none; }
    .benefits__list li { display: grid; grid-template-columns: 160px 1fr; gap: 28px; padding: clamp(12px, 1.7vh, 18px) 0; border-bottom: 1px solid var(--line); }
    .benefits__list strong { font-size: clamp(13px, 1vw, 17px); }
    .benefits__list span { color: var(--muted); font-size: clamp(11px, .82vw, 14px); }

    /* 07 — Segmentos */
    .segments { background: var(--ink); color: white; }
    .segments__head { display: flex; justify-content: space-between; gap: 48px; align-items: end; margin-top: 30px; }
    .segments__head .page-title { max-width: 11ch; }
    .segments__head p { max-width: 38ch; padding-bottom: 7px; }
    .segments__grid { display: grid; grid-template-columns: 1.25fr .75fr .75fr; grid-template-rows: 1fr 1fr; gap: 7px; flex: 1; min-height: 0; margin-top: 30px; }
    .segment { position: relative; overflow: hidden; background: var(--green); }
    .segment:first-child { grid-row: 1 / 3; }
    .segment:last-child { grid-column: 2 / 4; }
    .segment img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.08); }
    .segment:nth-child(1) img { object-position: 50% 42%; }
    .segment:nth-child(2) img { object-position: 50% 22%; }
    .segment:nth-child(3) img { object-position: 50% 22%; }
    .segment:nth-child(4) img { object-position: 50% 10%; }
    .segment::after { position: absolute; inset: 0; background: linear-gradient(0deg, rgba(1,35,21,.9), rgba(7,148,94,.26) 72%); mix-blend-mode: multiply; content: ""; }
    .segment__label { position: absolute; z-index: 2; left: 18px; right: 18px; bottom: 14px; display: flex; justify-content: space-between; gap: 16px; align-items: end; }
    .segment__label strong { font-size: clamp(15px, 1.4vw, 23px); letter-spacing: -.035em; }
    .segment__label small { color: rgba(255,255,255,.58); font-size: 12px; }

    /* 08 — Planos */
    .plans .connection-field { right: -17%; bottom: -27%; transform: rotate(164deg) scale(.88); }
    .plans__head { display: flex; justify-content: space-between; gap: 40px; align-items: end; margin-top: clamp(24px, 4vh, 46px); }
    .plans__head .page-title { max-width: 13ch; font-size: clamp(38px, 4.7vw, 74px); }
    .plans__head p { max-width: 38ch; padding-bottom: 5px; }
    .plans__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; margin-top: clamp(22px, 3.6vh, 38px); border-top: 1px solid var(--line); border-left: 1px solid var(--line); }
    .plan { position: relative; min-height: clamp(330px, 47vh, 430px); padding: clamp(18px, 2vw, 30px); border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); background: rgba(250,252,251,.74); }
    .plan--featured { background: var(--ink); color: white; }
    .plan__tag { color: var(--green); font-size: 12px; font-weight: 700; }
    .plan--featured .plan__tag { color: var(--green-bright); }
    .plan h3 { margin-top: 12px; font-size: clamp(16px, 1.25vw, 21px); }
    .plan__price { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px; margin-top: 17px; }
    .plan__price strong { font-size: clamp(25px, 2.4vw, 39px); line-height: 1; letter-spacing: -.06em; font-variant-numeric: tabular-nums; }
    .plan__price span { color: var(--muted); font-size: 14px; }
    .plan--featured .plan__price span { color: rgba(255,255,255,.55); }
    .plan ul { margin-top: 23px; list-style: none; }
    .plan li { position: relative; padding: 4px 0 4px 14px; color: var(--muted); font-size: clamp(12px, .8vw, 14px); line-height: 1.3; }
    .plan li::before { position: absolute; left: 0; color: var(--green); content: "+"; }
    .plan--featured li { color: rgba(255,255,255,.67); }
    .plan--featured li::before { color: var(--green-bright); }
    .plans__foot { display: flex; justify-content: space-between; gap: 24px; margin-top: 14px; color: var(--muted); font-size: 12px; }

    /* 09 — Suporte */
    .support::before {
      position: absolute; width: 62%; aspect-ratio: 1; left: -28%; bottom: -69%;
      border: 2px solid var(--green); border-radius: 50%; content: "";
    }
    .support__layout { display: grid; grid-template-columns: 1.02fr .98fr; gap: clamp(42px, 7vw, 112px); flex: 1; align-items: center; }
    .support__visual { position: relative; height: 75%; min-height: 420px; }
    .support__image { position: absolute; inset: 0; overflow: hidden; border-radius: 0 48% 48% 0 / 0 50% 50% 0; background: var(--green); }
    .support__image img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.06); }
    .support__image::after { position: absolute; inset: 0; background: rgba(7,148,94,.55); mix-blend-mode: multiply; content: ""; }
    .support__visual::after { position: absolute; z-index: -1; width: 210px; aspect-ratio: 1; right: -55px; top: -42px; border-radius: 50%; background: var(--green-light); content: ""; }
    .support__copy .page-title { max-width: 12ch; }
    .support__copy > p { margin-top: 20px; }
    .support__list { margin-top: 30px; border-top: 1px solid var(--line); list-style: none; }
    .support__list li { display: grid; grid-template-columns: 32px 1fr; gap: 15px; align-items: center; min-height: clamp(45px, 6.6vh, 62px); border-bottom: 1px solid var(--line); font-size: clamp(11px, .85vw, 14px); font-weight: 500; }
    .support__list b { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; background: var(--green); color: white; font-size: 12px; }

    /* 10 — Encerramento */
    .closing::before {
      position: absolute; z-index: 4; width: 74%; aspect-ratio: 1; right: -33%; top: -62%;
      border: 3px solid var(--green-bright); border-radius: 50%; content: "";
    }
    .closing__photo { position: absolute; inset: 0 0 0 52%; overflow: hidden; clip-path: ellipse(82% 78% at 83% 52%); }
    .closing__photo img { width: 100%; height: 100%; object-fit: cover; object-position: 58% center; filter: grayscale(1) contrast(1.08); }
    .closing__photo::after { position: absolute; inset: 0; background: rgba(7,148,94,.68); mix-blend-mode: multiply; content: ""; }
    .closing__veil { position: absolute; z-index: 1; inset: 0; background: linear-gradient(90deg, var(--ink) 0 50%, rgba(13,23,21,.96) 58%, transparent 80%); }
    .closing__content { width: 68%; margin: auto 0; }
    .closing__logo { width: 144px; }
    .closing__logo img { width: 100%; }
    .closing__content h2 { max-width: 10ch; margin-top: clamp(36px, 6vh, 70px); font-size: clamp(52px, 7.15vw, 112px); line-height: .86; letter-spacing: -.075em; }
    .closing__content p { max-width: 43ch; margin-top: 25px; color: rgba(255,255,255,.68); font-size: clamp(13px, 1vw, 17px); }
    .closing__cta { display: flex; align-items: center; gap: 22px; margin-top: 30px; }
    .closing__cta strong { padding: 14px 18px; background: var(--green); font-size: 12px; }
    .closing__cta span { color: rgba(255,255,255,.62); font-size: 11px; }

    @media (max-width: 1200px) {
      :root { --gutter: clamp(28px, 4vw, 48px); }
      .page { width: calc(100vw - 40px); height: auto; min-height: 720px; }
      .problem__grid { margin-top: 48px; }
      .problem__item { min-height: 240px; }
      .plans__grid { grid-template-columns: repeat(2, 1fr); }
      .plan { min-height: 300px; }
    }

    @media (max-width: 767px) {
      .presentation-document { gap: 16px; padding: 16px 0; }
      .page { width: calc(100vw - 24px); min-height: 0; overflow: visible; }
      .page__frame { height: auto; min-height: 0; padding: 28px 24px 36px; }
      .page-title { font-size: clamp(42px, 13vw, 68px); }
      .page-meta { margin-bottom: 44px; }
      .mark-word { display: none; }
      .cover__photo, .closing__photo { position: relative; inset: auto; width: calc(100% + 48px); height: 380px; margin: 40px -24px -36px; clip-path: none; }
      .cover__veil, .closing__veil { display: none; }
      .cover__content, .closing__content { width: 100%; margin: 0; }
      .cover__statement { grid-template-columns: 1fr; }
      .market__layout, .solution__layout, .support__layout { grid-template-columns: 1fr; }
      .market__visual, .support__visual { min-height: 380px; order: -1; }
      .market__caption { left: 16px; }
      .market__points { grid-template-columns: 1fr; }
      .market__points li:nth-child(odd) { border-right: 0; }
      .market__points li:nth-child(even) { padding-left: 0; }
      .problem__head, .flow__head { grid-template-columns: 1fr; gap: 20px; }
      .problem__grid, .flow__track { grid-template-columns: 1fr; }
      .problem__item, .problem__item + .problem__item { min-height: 0; padding: 22px 0; border-right: 0; border-bottom: 1px solid var(--white-line); }
      .problem__item h3 { margin-top: 24px; }
      .solution::before { inset: 0; }
      .solution__map { margin-top: 24px; }
      .flow__track::before { display: none; }
      .flow__step { min-height: 0; padding: 24px 0; border-bottom: 1px solid rgba(255,255,255,.28); }
      .flow__step::before { display: none; }
      .benefits__head { align-items: start; flex-direction: column; }
      .benefits__body { grid-template-columns: 1fr; }
      .benefits__number { font-size: 130px; }
      .benefits__list li { grid-template-columns: 1fr; gap: 6px; }
      .segments__head { align-items: start; flex-direction: column; }
      .segments__grid { grid-template-columns: 1fr; grid-template-rows: repeat(4, 260px); }
      .segment:first-child, .segment:last-child { grid-row: auto; grid-column: auto; }
      .plans__head { align-items: start; flex-direction: column; }
      .plans__grid { grid-template-columns: 1fr; }
      .plan { min-height: 0; }
      .support__visual { min-height: 380px; }
      .support__image { border-radius: 0; }
      .closing__cta { align-items: start; flex-direction: column; }
    }

    @media print {
      @page { size: 13.333in 7.5in; margin: 0; }
      .presentation-shell { width: auto; height: auto; min-height: 0; margin: 0; overflow: visible; background: white; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .pdf-export { display: none !important; }
      .presentation-document { display: block; padding: 0; }
      .page {
        width: 13.333in;
        height: 7.5in;
        min-height: 0;
        margin: 0;
        overflow: hidden;
        box-shadow: none;
        break-after: page;
        page-break-after: always;
      }
      .page:last-child { break-after: auto; page-break-after: auto; }
      .page__frame { height: 100%; }
    }
</style>
