<script setup lang="ts">
import PlansCarousel from '~/components/pricing/PlansCarousel.vue'
import { Mail } from '@lucide/vue'
import type { Plan } from '~/data/plans'
import { drawPresentationText, hidePresentationText, measurePresentationText } from '~/utils/presentationPdfText'
import { addPresentationLinks } from '~/utils/presentationPdfLinks'

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
const { data: plans, pending: plansPending, error: plansError, refresh: refreshPlans } = usePublicPlans()
const presentationContact = {
  email: 'contato@elinea.com.br',
  whatsapp: '5524998164753',
  message: 'Olá! Gostaria de agendar uma demonstração do Elínea.',
}
const demonstrationUrl = `https://wa.me/${presentationContact.whatsapp}?text=${encodeURIComponent(presentationContact.message)}`
const presentationPlanUrl = (plan: Plan) => `https://wa.me/${presentationContact.whatsapp}?text=${encodeURIComponent(`Olá! Tenho interesse no plano ${plan.name} do Elínea e gostaria de saber mais.`)}`

async function embeddedAsset(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Não foi possível carregar um recurso da apresentação.')
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Não foi possível preparar um recurso para o PDF.'))
    reader.readAsDataURL(blob)
  })
}

async function exportPdf() {
  if (exporting.value || !documentRoot.value) return

  exporting.value = true
  exportLabel.value = 'Preparando…'
  let exportFrame: HTMLIFrameElement | undefined

  try {
    await refreshPlans()
    if (plansError.value || !plans.value.length) throw new Error('Não foi possível carregar os planos atualizados. Tente novamente.')
    await nextTick()

    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ])

    await document.fonts.ready
    await Promise.all([...documentRoot.value.querySelectorAll('img')].map(image => image.decode().catch(() => undefined)))

    const fonts = await Promise.all([400, 500, 600, 700].map(async weight => {
      const source = await embeddedAsset(assetUrl(`fonts/inter-${weight}.ttf`))
      return { weight, source }
    }))
    const fontRules = fonts.map(font => `@font-face { font-family: InterPresentation; src: url('${font.source}') format('truetype'); font-weight: ${font.weight}; }`).join('\n')
    const embeddedImages = new Map(await Promise.all(
      [...new Set([...documentRoot.value.querySelectorAll('img')].map(image => image.src))]
        .map(async source => [source, await embeddedAsset(source)] as const),
    ))

    exportFrame = document.createElement('iframe')
    exportFrame.title = 'Preparação da apresentação para PDF'
    exportFrame.setAttribute('aria-hidden', 'true')
    exportFrame.style.cssText = 'position:fixed;left:-20000px;top:0;width:1664px;height:964px;border:0;pointer-events:none;'
    document.body.append(exportFrame)
    const exportDocument = exportFrame.contentDocument
    if (!exportDocument) throw new Error('Não foi possível preparar o documento de exportação.')

    const exportStyles = exportDocument.createElement('style')
    exportStyles.textContent = [...document.styleSheets].map(sheet => {
      try {
        return [...sheet.cssRules].map(rule => rule.cssText).join('\n')
      } catch {
        return ''
      }
    }).join('\n') + `\n${fontRules}\nhtml, body { margin: 0; background: #dfe5e2; } .page { width: 1600px; height: 900px; margin: 0; box-shadow: none; } .page * { font-variant-ligatures: none; }`
    exportDocument.head.append(exportStyles)
    const exportShell = documentRoot.value.parentElement!.cloneNode(false) as HTMLElement
    exportDocument.body.append(exportShell)

    const pages = [...documentRoot.value.querySelectorAll<HTMLElement>('.page')].flatMap(page => {
      const cards = [...page.querySelectorAll('.plan-card')]
      if (cards.length <= 3) return [page]
      return Array.from({ length: Math.ceil(cards.length / 3) }, (_, batch) => {
        const clone = page.cloneNode(true) as HTMLElement
        clone.querySelectorAll('.plan-card').forEach((card, cardIndex) => {
          if (Math.floor(cardIndex / 3) !== batch) card.remove()
        })
        return clone
      })
    })
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [1600, 900],
      compress: true,
      hotfixes: ['px_scaling'],
      putOnlyUsedFonts: true,
    })
    for (const font of fonts) {
      const filename = `inter-${font.weight}.ttf`
      pdf.addFileToVFS(filename, font.source.split(',')[1]!)
      pdf.addFont(filename, 'InterPresentation', 'normal', font.weight)
    }

    for (const [index, page] of pages.entries()) {
      exportLabel.value = `Gerando ${index + 1}/${pages.length}…`

      const exportPage = page.cloneNode(true) as HTMLElement
      exportShell.replaceChildren(exportPage)
      const exportRail = exportPage.querySelector<HTMLElement>('.pricing-rail')
      if (exportRail) {
        exportRail.style.gridAutoFlow = 'row'
        exportRail.style.gridTemplateColumns = `repeat(${exportRail.querySelectorAll('.plan-card').length}, minmax(0, 1fr))`
        exportRail.style.overflow = 'visible'
        exportRail.scrollLeft = 0
        exportPage.querySelectorAll<HTMLElement>('.pricing-controls, .feature-toggle').forEach(control => control.style.display = 'none')
      }
      for (const image of exportPage.querySelectorAll('img')) {
        image.src = embeddedImages.get(image.src)!
        image.removeAttribute('srcset')
      }
      await Promise.all([...exportPage.querySelectorAll('img')].map(image => image.decode()))
      await exportDocument.fonts.ready
      const text = measurePresentationText(exportPage)

      const canvas = await html2canvas(exportPage, {
        backgroundColor: null,
        foreignObjectRendering: true,
        logging: false,
        scale: 1.25,
        useCORS: true,
        width: 1600,
        height: 900,
        x: 0,
        y: 0,
        windowWidth: 1664,
        windowHeight: 964,
        onclone: (clonedDocument: Document) => {
          clonedDocument.documentElement.style.background = '#dfe5e2'
          clonedDocument.body.style.background = '#dfe5e2'
          clonedDocument.body.style.color = '#0d1715'

          const clonedPage = clonedDocument.getElementById(page.id)
          if (!clonedPage) return
          const fonts = clonedDocument.createElement('style')
          fonts.textContent = fontRules
          clonedPage.prepend(fonts)
          clonedPage.style.width = '1600px'
          clonedPage.style.height = '900px'
          clonedPage.style.margin = '0'
          clonedPage.style.boxShadow = 'none'
          hidePresentationText(clonedPage)
        },
      })

      if (index > 0) pdf.addPage([1600, 900], 'landscape')
      pdf.addImage(canvas.toDataURL('image/jpeg', .94), 'JPEG', 0, 0, 1600, 900, undefined, 'FAST')
      drawPresentationText(pdf, text)
      addPresentationLinks(pdf, exportPage)
      await new Promise(resolve => window.setTimeout(resolve, 0))
    }

    pdf.save('apresentacao-comercial-elinea.pdf')
  } catch (error) {
    console.error(error)
    const message = error instanceof Error ? error.message : 'Recarregue a apresentação e tente novamente.'
    window.alert(`Não foi possível gerar o PDF. ${message}`)
  } finally {
    exportFrame?.remove()
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
        <span class="connection-field" aria-hidden="true"></span>
        <div class="page__frame">
          <header class="page-meta"><span class="page-meta__chapter">O mercado mudou</span><span class="page-meta__folio">02 / 10</span></header>
          <div class="market__layout">
            <div class="market__copy">
              <h2 id="page-02-title" class="page-title page-title--wide">Seus clientes já estão no digital.</h2>
              <p class="page-copy market__intro">A jornada de compra começa muito antes da visita à loja.</p>
              <ul class="market__points">
                <li><b>Descoberta</b>Pesquisam produtos e preços pela internet.</li>
                <li><b>Conveniência</b>Escolhem também pela facilidade de comprar.</li>
                <li><b>Presença</b>Esperam encontrar negócios locais online.</li>
                <li><b>Oportunidade</b>Podem desistir quando a compra depende só do presencial.</li>
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
            <article class="problem__item"><h3>Tempo curto.</h3><p>A operação já exige atenção constante.</p></article>
            <article class="problem__item"><h3>Custo alto.</h3><p>Projetos sob medida nem sempre cabem no início.</p></article>
            <article class="problem__item"><h3>Ferramentas complexas.</h3><p>Tecnologia não pode virar mais uma barreira.</p></article>
            <article class="problem__item"><h3>Canais dispersos.</h3><p>Pedidos e informações se perdem no caminho.</p></article>
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
              <p class="solution__map-foot">Uma estrutura. Sua operação conectada.</p>
            </div>
          </div>
        </div>
      </section>
    
      <section id="page-05" class="page page--green flow" aria-labelledby="page-05-title">
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
          <div class="flow__demo"><span>Da ideia à prática.</span><a :href="demonstrationUrl" target="_blank" rel="noopener noreferrer">Conheça a plataforma em uma demonstração real <span aria-hidden="true">↗</span></a></div>
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
            <div class="benefits__statement"><span>Sua marca.</span><span>Seu canal.</span><span>Seu ritmo.</span><p>O Elínea simplifica a tecnologia para você focar no seu negócio.</p></div>
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
          <PlansCarousel class="plans__carousel" :plans="plans" :loading="plansPending" :error="Boolean(plansError)"
                         :link-for-plan="presentationPlanUrl" presentation @retry="refreshPlans" />
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
          <header class="page-meta"><span class="page-meta__chapter">Vamos construir sua presença digital?</span><span class="page-meta__folio">10 / 10</span></header>
          <div class="closing__content">
            <div class="closing__logo"><img :src="assetUrl('logo-elinea-white.svg')" alt="Elínea"></div>
            <h2 id="page-10-title">Seu próximo cliente pode estar a um clique de distância.</h2>
            <p>Leve seu negócio para o digital com uma solução feita para crescer com você.</p>
            <div class="closing__cta">
              <a class="closing__button" :href="demonstrationUrl" target="_blank" rel="noopener noreferrer">Solicite uma demonstração <span aria-hidden="true">↗</span></a>
              <div class="closing__contacts">
                <a :href="`mailto:${presentationContact.email}`"><Mail :size="18" aria-hidden="true" />{{ presentationContact.email }}</a>
              </div>
            </div>
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
  --white-line: rgba(255, 255, 255, .22);
  margin: 0;
  overflow-x: hidden;
  background: #dce3df;
  color: var(--ink);
  font: 400 16px/1.5 InterPresentation, Inter, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
}
.presentation-shell, .presentation-shell * { box-sizing: border-box; }
.presentation-shell :where(h1, h2, h3, p, ul, ol, figure) { margin: 0; }
.presentation-shell :where(h1, h2, h3) { color: inherit; font-family: inherit; }
.presentation-shell :where(ul, ol) { padding: 0; list-style: none; }
.presentation-shell img { display: block; max-width: 100%; }
.presentation-shell a { color: inherit; text-decoration: none; }
.presentation-shell a:focus-visible { outline: 2px solid var(--green-bright); outline-offset: 5px; }
.pdf-export {
  position: fixed; z-index: 100; top: 18px; right: 18px;
  display: inline-flex; align-items: center; gap: 10px;
  min-height: 46px; padding: 0 20px; border: 1px solid rgba(255,255,255,.25);
  border-radius: 28px; background: var(--ink); color: white;
  font: 600 14px/1.2 InterPresentation, Inter, sans-serif; cursor: pointer;
  box-shadow: 0 6px 24px rgba(13,23,21,.16);
}
.pdf-export svg { width: 18px; height: 18px; }
.pdf-export:hover { background: var(--green-deep); }
.pdf-export:focus-visible { outline: 3px solid var(--green-bright); outline-offset: 4px; }
.pdf-export[aria-busy="true"] { pointer-events: none; opacity: .75; }
.presentation-document { display: grid; gap: 36px; padding: 36px 0; }
.page {
  position: relative; container-type: inline-size; isolation: isolate;
  width: min(calc(100vw - 64px), 1600px);
  height: min(calc((100vw - 64px) * .5625), 900px);
  margin: 0 auto; overflow: hidden;
  background: var(--paper); color: var(--ink);
  box-shadow: 0 16px 48px -30px rgba(13,23,21,.3);
}
.page--ink { background: var(--ink); color: var(--paper); }
.page--green { background: var(--green); color: white; }
.page--mist { background: var(--mist); }
.page__frame {
  position: relative; z-index: 2; display: flex; flex-direction: column;
  width: 100%; height: 100%; padding: 3.5cqw 4.5cqw;
}
.page-meta {
  display: flex; align-items: center; justify-content: space-between; gap: 24px;
  flex: 0 0 auto; color: var(--muted); font-size: clamp(12px, 1cqw, 16px); line-height: 1.2;
}
.page-meta__chapter { display: flex; align-items: center; gap: 12px; font-weight: 500; }
.page-meta__chapter::before { width: 7px; height: 7px; border-radius: 50%; background: var(--green); content: ""; }
.page-meta__folio { font-variant-numeric: tabular-nums; letter-spacing: .02em; }
.page--ink .page-meta, .page--green .page-meta, .segments .page-meta { color: rgba(250,252,251,.65); }
.page--ink .page-meta__chapter::before, .page--green .page-meta__chapter::before, .segments .page-meta__chapter::before { background: var(--green-bright); }
.page-title {
  max-width: 13ch; font-size: clamp(38px, 4.8cqw, 77px); font-weight: 600;
  line-height: 1.02; letter-spacing: -.065em; text-wrap: balance;
}
.page-copy { color: var(--muted); font-size: clamp(15px, 1.25cqw, 20px); line-height: 1.55; }
.page--ink .page-copy, .page--green .page-copy, .segments .page-copy { color: rgba(250,252,251,.72); }
.connection-field {
  position: absolute; z-index: 0; width: 45%; aspect-ratio: 1;
  color: var(--green); pointer-events: none; opacity: .15;
}
.connection-field::before, .connection-field::after, .connection-field i {
  position: absolute; border: 1px solid currentColor; border-radius: 50%; content: "";
}
.connection-field::before { inset: 0; }
.connection-field::after { inset: 18%; }
.connection-field i:nth-child(1) { inset: 36%; }
.connection-field i:nth-child(2) { top: 50%; left: 0; width: 100%; height: 1px; border: 0; background: currentColor; }
.connection-field i:nth-child(3) { display: none; }
.connection-field i:nth-child(4) { top: calc(50% - 5px); right: 17%; width: 10px; height: 10px; background: currentColor; }

.cover::before { position: absolute; z-index: 2; width: 68%; aspect-ratio: 1; right: -26%; top: -57%; border: 3px solid var(--green-bright); border-radius: 50%; content: ""; }
.cover::after { position: absolute; z-index: 4; width: 40%; aspect-ratio: 1; right: -6%; bottom: -47%; border: 2px solid rgba(92,221,164,.7); border-radius: 50%; content: ""; }
.cover .page__frame { z-index: 3; padding: clamp(30px, 3.8vw, 62px) clamp(38px, 4.5vw, 76px) clamp(34px, 4vw, 68px); }
.cover__photo { position: absolute; z-index: 0; inset: 0 0 0 55%; overflow: hidden; clip-path: ellipse(78% 78% at 78% 50%); }
.closing__photo img { width: 100%; height: 100%; object-fit: cover; object-position: 56% center; filter: grayscale(1) contrast(1.06); }
.cover__photo img { width: 100%; height: 100%; object-fit: cover; object-position: 58% center; filter: grayscale(1) contrast(1.08); }
.cover__photo::after { position: absolute; inset: 0; background: rgba(0,150,91,.78); mix-blend-mode: multiply; content: ""; }
.cover__veil { position: absolute; z-index: 1; inset: 0; background: linear-gradient(90deg, var(--ink) 0 49%, rgba(13,23,21,.97) 56%, transparent 78%); }
.cover__content { width: 61%; margin: auto 0; }
.cover__brand { width: clamp(124px, 13vw, 205px); }
.cover__title { max-width: 8ch; margin-top: clamp(38px, 6vh, 76px); font-size: clamp(58px, 8.6vw, 138px); font-weight: 700; line-height: .82; letter-spacing: -.085em; }
.cover__statement { display: grid; grid-template-columns: 1.18fr .82fr; gap: clamp(20px, 3vw, 46px); align-items: end; margin-top: clamp(36px, 7vh, 78px); padding-top: 18px; border-top: 1px solid var(--white-line); }
.cover__statement strong { max-width: 22ch; font-size: clamp(18px, 1.65vw, 27px); line-height: 1.18; letter-spacing: -.035em; }
.cover__statement p { max-width: 30ch; color: rgba(255,255,255,.66); font-size: clamp(12px, .95vw, 16px); }

.market .connection-field { left: -34%; top: 30%; }
.market__layout { flex: 1; min-height: 0; display: grid; grid-template-columns: 1.05fr 1fr; gap: 5cqw; padding-top: 3.5cqw; }
.market__copy { align-self: center; }
.market__copy .page-title { font-size: clamp(38px, 4.4cqw, 71px); max-width: 12ch; }
.market__copy .market__intro { max-width: 38ch; margin-top: 1.8cqw; }
.market__copy .market__points { display: grid; grid-template-columns: 1fr 1fr; gap: 1.7cqw 2cqw; margin-top: 2.5cqw; }
.market__points li { padding-top: 1cqw; border-top: 1px solid var(--line); color: var(--muted); font-size: clamp(14px, 1.02cqw, 17px); line-height: 1.5; }
.market__points b { display: block; margin-bottom: 8px; color: var(--green-deep); font-size: clamp(14px, 1.06cqw, 17px); font-weight: 600; }
.market__visual { position: relative; min-height: 0; }
.market__image { position: absolute; inset: 0; border-radius: 11cqw 0 0 0; overflow: hidden; background: var(--green); }
.market__image img { width: 100%; height: 100%; object-fit: cover; object-position: right center; filter: grayscale(1) contrast(1.06); }
.market__image::after { position: absolute; inset: 0; background: rgba(7,148,94,.54); mix-blend-mode: multiply; content: ""; }
.market__caption { position: absolute; bottom: 0; left: 0; width: 82%; padding: 1.6cqw 2cqw; background: var(--ink); color: white; font-size: clamp(15px, 1.2cqw, 20px); line-height: 1.45; }

.problem .page__frame { display: grid; grid-template-columns: 1.05fr 1fr; grid-template-rows: auto 1fr; column-gap: 6cqw; row-gap: 5cqw; }
.problem .page-meta { grid-column: 1 / -1; }
.problem__head { display: flex; flex-direction: column; justify-content: space-between; align-items: flex-start; padding-bottom: 1cqw; }
.problem__head .page-title { max-width: 11ch; font-size: clamp(40px, 5.1cqw, 82px); }
.problem__head p { max-width: 35ch; margin-top: 2cqw; }
.problem__grid { display: grid; grid-template-columns: 1fr 1fr; align-content: center; gap: 3.8cqw 2.8cqw; }
.problem__item { padding-top: 1.5cqw; border-top: 1px solid var(--white-line); }
.problem__item::before { display: block; width: 25px; height: 3px; margin-bottom: 1.8cqw; background: var(--green-bright); content: ""; }
.problem__item h3 { max-width: 12ch; font-size: clamp(24px, 2.05cqw, 33px); font-weight: 500; line-height: 1.1; letter-spacing: -.045em; }
.problem__item p { margin-top: 1cqw; color: rgba(250,252,251,.65); font-size: clamp(15px, 1.1cqw, 18px); line-height: 1.5; }

.solution { background: var(--green-light); }
.solution__layout { display: grid; grid-template-columns: 1fr 1.05fr; gap: 7cqw; flex: 1; min-height: 0; align-items: center; padding-top: 3cqw; }
.solution__copy .page-title { max-width: 9ch; font-size: clamp(44px, 5.6cqw, 90px); }
.solution__copy > p { margin-top: 1.7cqw; max-width: 38ch; font-size: clamp(16px, 1.3cqw, 21px); line-height: 1.5; color: #40594d; }
.solution__features { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1cqw 1.5cqw; margin-top: 2.4cqw; }
.solution__features li { display: flex; gap: 9px; align-items: baseline; font-size: clamp(14px, 1cqw, 16px); }
.solution__features li::before { color: var(--green-deep); content: "↗"; }
.solution__map { position: relative; display: flex; flex-direction: column; min-height: 33cqw; padding: 3cqw; border-radius: 0 7cqw 0 0; background: var(--ink); color: white; }
.solution__map-logo { width: 10cqw; }
.solution__map-note { position: absolute; top: 3cqw; right: 3cqw; text-align: right; color: rgba(250,252,251,.6); font-size: 12px; line-height: 1.5; }
.solution__map-main { margin-top: 3.5cqw; padding-left: 1.4cqw; border-left: 2px solid var(--green-bright); }
.solution__map-main small, .solution__node small { font-size: clamp(13px, .9cqw, 15px); color: var(--green-bright); }
.solution__map-main strong { display: block; max-width: 19ch; margin-top: .8cqw; font-size: clamp(24px, 2.25cqw, 36px); line-height: 1.15; font-weight: 500; letter-spacing: -.04em; }
.solution__nodes { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 2cqw; margin-top: 2.5cqw; padding-top: 1.5cqw; border-top: 1px solid var(--white-line); }
.solution__node strong { display: block; max-width: 17ch; margin-top: .8cqw; font-size: clamp(16px, 1.2cqw, 20px); line-height: 1.35; font-weight: 500; }
.solution__map-foot { margin-top: auto; padding-top: 2cqw; color: rgba(250,252,251,.6); font-size: clamp(12px, .9cqw, 14px); }

.flow__head { display: grid; grid-template-columns: 1.25fr .75fr; gap: 8cqw; align-items: end; margin-top: 3.5cqw; }
.flow__head .page-title { max-width: 18ch; font-size: clamp(40px, 4.5cqw, 72px); }
.flow__head p { max-width: 31ch; padding-bottom: .25cqw; }
.flow__track { position: relative; display: grid; grid-template-columns: repeat(4, 1fr); gap: 2.4cqw; margin-top: auto; margin-bottom: 3cqw; }
.flow__track::before { position: absolute; top: 2cqw; left: 2cqw; right: calc(25% - 1.4cqw); height: 1px; background: rgba(255,255,255,.5); content: ""; }
.flow__step { position: relative; padding-top: 5.5cqw; }
.flow__step::before { position: absolute; top: 0; left: 0; width: 4cqw; height: 4cqw; border: 1px solid rgba(255,255,255,.65); border-radius: 50%; background: var(--green); content: ""; }
.flow__step small { position: absolute; top: 0; left: 0; display: grid; place-items: center; width: 4cqw; height: 4cqw; font-size: clamp(15px, 1.2cqw, 20px); color: white; }
.flow__step h3 { font-size: clamp(25px, 2.2cqw, 36px); font-weight: 500; line-height: 1.1; letter-spacing: -.045em; }
.flow__step p { max-width: 23ch; margin-top: 1cqw; font-size: clamp(15px, 1.1cqw, 18px); line-height: 1.5; color: rgba(250,252,251,.8); }
.flow__demo { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding-top: 1.5cqw; border-top: 1px solid rgba(255,255,255,.35); font-size: clamp(14px, 1cqw, 16px); }
.flow__demo > span { color: rgba(250,252,251,.75); }
.flow__demo a { display: flex; align-items: center; gap: 2cqw; font-weight: 500; }
.flow__demo a span { font-size: 26px; }

.benefits .connection-field { left: -21%; bottom: -26%; opacity: .1; }
.benefits__head { display: flex; justify-content: space-between; gap: 6cqw; align-items: end; margin-top: 3.5cqw; }
.benefits__head .page-title { max-width: 15ch; }
.benefits__head p { max-width: 32ch; padding-bottom: .3cqw; }
.benefits__body { display: grid; grid-template-columns: 1fr 1.25fr; gap: 7cqw; flex: 1; align-items: center; padding-top: 3.5cqw; }
.benefits__statement > span { display: block; color: var(--green-deep); font-size: clamp(42px, 4.6cqw, 74px); line-height: 1.1; font-weight: 500; letter-spacing: -.065em; }
.benefits__statement p { max-width: 30ch; margin-top: 1.8cqw; color: var(--muted); font-size: clamp(15px, 1.15cqw, 19px); line-height: 1.5; }
.benefits__list li { display: grid; grid-template-columns: .9fr 1.1fr; gap: 1.8cqw; align-items: center; padding: 1.35cqw 0; border-top: 1px solid var(--line); }
.benefits__list li:last-child { border-bottom: 1px solid var(--line); }
.benefits__list strong { font-size: clamp(16px, 1.35cqw, 22px); font-weight: 500; letter-spacing: -.025em; }
.benefits__list span { color: var(--muted); font-size: clamp(14px, 1.05cqw, 17px); line-height: 1.45; }

.segments { background: var(--ink); color: var(--paper); }
.segments__head { display: flex; justify-content: space-between; align-items: end; gap: 5cqw; margin-top: 3cqw; }
.segments__head .page-title { max-width: 17ch; font-size: clamp(38px, 4.2cqw, 68px); }
.segments__head p { max-width: 32ch; padding-bottom: .25cqw; }
.segments__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.2cqw; flex: 1; min-height: 0; margin-top: 3cqw; }
.segment { position: relative; min-width: 0; min-height: 0; overflow: hidden; background: var(--green); }
.segment img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.05); }
.segment:nth-child(1) img { object-position: 44% 36%; }
.segment:nth-child(2) img { object-position: 50% 26%; }
.segment:nth-child(3) img { object-position: 50% 28%; }
.segment:nth-child(4) img { object-position: 65% 15%; }
.segment::after { position: absolute; inset: 0; background: linear-gradient(0deg, rgba(1,35,21,.9), rgba(7,148,94,.25) 65%); mix-blend-mode: multiply; content: ""; }
.segment__label { position: absolute; z-index: 2; left: 1.3cqw; right: 1.3cqw; bottom: 1.4cqw; padding-top: 1.2cqw; border-top: 1px solid rgba(255,255,255,.45); }
.segment__label strong { display: block; max-width: 13ch; font-size: clamp(19px, 1.65cqw, 27px); line-height: 1.2; font-weight: 500; letter-spacing: -.035em; }
.segment__label small { display: none; }

.plans .page__frame { padding: 3cqw 4.5cqw; }
.plans .connection-field { right: -25%; bottom: -35%; opacity: .1; }
.plans__head { display: flex; justify-content: space-between; align-items: end; gap: 5cqw; margin-top: 1.8cqw; }
.plans__head .page-title { max-width: 18ch; font-size: clamp(38px, 3.8cqw, 61px); }
.plans__head p { max-width: 31ch; padding-bottom: .2cqw; }
.plans__carousel { display: flex; flex-direction: column; justify-content: center; flex: 1; min-height: 0; margin-top: 1.8cqw; }

@media (min-width: 1101px) and (max-width: 1500px) {
  .plans .page__frame { padding-block: 2cqw; }
  .plans__head { gap: 2cqw; margin-top: 1cqw; }
  .plans__head .page-title { max-width: none; font-size: 3.2cqw; }
  .plans__head p { font-size: 15px; line-height: 1.4; }
  .plans__carousel { margin-top: 1cqw; }
}

.support__layout { display: grid; grid-template-columns: .94fr 1.06fr; gap: 6cqw; flex: 1; min-height: 0; padding-top: 3.8cqw; }
.support__visual { position: relative; min-height: 0; }
.support__image { position: absolute; inset: 0; overflow: hidden; border-radius: 0 0 10cqw 0; background: var(--green); }
.support__image img { width: 100%; height: 100%; object-fit: cover; object-position: right center; filter: grayscale(1) contrast(1.06); }
.support__image::after { position: absolute; inset: 0; background: rgba(7,148,94,.48); mix-blend-mode: multiply; content: ""; }
.support__copy { align-self: center; }
.support__copy .page-title { max-width: 13ch; font-size: clamp(38px, 4.2cqw, 68px); }
.support__copy > p { margin-top: 1.5cqw; max-width: 40ch; }
.support__list { margin-top: 2cqw; }
.support__list li { display: grid; grid-template-columns: 32px 1fr; gap: 16px; align-items: center; padding: .85cqw 0; border-top: 1px solid var(--line); font-size: clamp(14px, 1.05cqw, 17px); line-height: 1.4; }
.support__list li:last-child { border-bottom: 1px solid var(--line); }
.support__list b { font-size: 14px; font-weight: 500; color: var(--green-deep); }

.closing { background: var(--green-deep); }
.closing__photo { position: absolute; inset: 0 0 0 62%; overflow: hidden; }
.closing__photo img { object-position: 25% center; }
.closing__photo::after { position: absolute; inset: 0; background: rgba(7,148,94,.55); mix-blend-mode: multiply; content: ""; }
.closing__veil { position: absolute; z-index: 1; width: 13cqw; height: 13cqw; top: 50%; left: calc(62% - 6.5cqw); border: 1px solid var(--green-bright); border-radius: 50%; }
.closing__veil::after { position: absolute; inset: 24%; border: 1px solid var(--green-bright); border-radius: 50%; content: ""; }
.closing .page-meta { color: rgba(250,252,251,.7); }
.closing__content { width: 57%; margin: auto 0; }
.closing__logo { width: 10cqw; }
.closing__content h2 { max-width: 14ch; margin-top: 2.8cqw; font-size: clamp(46px, 5cqw, 80px); line-height: 1.02; font-weight: 500; letter-spacing: -.065em; }
.closing__content > p { max-width: 39ch; margin-top: 1.7cqw; font-size: clamp(16px, 1.25cqw, 20px); color: rgba(250,252,251,.8); }
.closing__cta { display: flex; flex-direction: column; align-items: flex-start; gap: 1.2cqw; margin-top: 2cqw; }
.closing__cta .closing__button { display: inline-flex; align-items: center; gap: 2cqw; padding: 1cqw 1.5cqw; border-radius: 3px; background: var(--paper); color: var(--green-deep); font-size: clamp(16px, 1.2cqw, 20px); font-weight: 500; }
.closing__button span { font-size: 25px; }
.closing__contacts { display: flex; flex-wrap: wrap; gap: 12px 24px; color: rgba(250,252,251,.75); font-size: clamp(14px, 1cqw, 16px); }
.closing__contacts a { display: inline-flex; align-items: center; gap: 10px; }
.closing__contacts svg { flex-shrink: 0; }

@media (max-width: 1100px) {
  .plans .page__frame { padding: 36px; }
  .plans__carousel { margin-top: 30px; }
  .presentation-document { gap: 24px; padding: 24px 0; }
  .page { width: calc(100vw - 32px); height: auto; min-height: 680px; }
  .page__frame { height: auto; min-height: inherit; padding: 36px; }
  .page-meta { font-size: 14px; }
  .page-title { font-size: clamp(40px, 5.3cqw, 60px); }
  .market__layout, .solution__layout, .support__layout { padding-top: 40px; gap: 36px; }
  .market__visual, .support__visual { min-height: 520px; }
  .problem .page__frame { gap: 40px; }
  .problem__grid { gap: 32px 24px; }
  .problem__head p { margin-top: 32px; }
  .solution__map { padding: 28px; }
  .solution__map-note { position: static; margin-top: 16px; text-align: left; }
  .solution__map-logo { width: 130px; }
  .solution__map-main { margin-top: 28px; }
  .solution__map-main strong { font-size: 27px; }
  .solution__map-foot { padding-top: 28px; }
  .solution__features { grid-template-columns: 1fr; gap: 12px; margin-top: 24px; }
  .flow__head { margin-top: 36px; gap: 36px; }
  .flow__track { margin-top: 64px; margin-bottom: 40px; gap: 20px; }
  .flow__step h3 { font-size: 25px; }
  .flow__step small { font-size: 14px; }
  .flow__demo { padding-top: 20px; }
  .benefits__head, .segments__head, .plans__head { margin-top: 36px; }
  .benefits__body { padding-top: 40px; gap: 36px; }
  .benefits__list li { grid-template-columns: 1fr; gap: 5px; padding: 15px 0; }
  .segments__grid { min-height: 360px; margin-top: 36px; }
  .segment__label { left: 14px; right: 14px; bottom: 18px; }
  .segment__label strong { font-size: 20px; }
  .support__list { margin-top: 24px; }
  .support__list li { padding: 12px 0; }
  .closing__content { padding: 40px 0; }
  .closing__content h2 { font-size: 5.6cqw; }
  .closing__content > p { margin-top: 24px; }
  .closing__cta { gap: 18px; margin-top: 30px; }
  .closing__cta .closing__button { padding: 14px 20px; }
}
@media (max-width: 700px) {
  .plans .page__frame { padding: 28px 24px; }
  .pdf-export { top: 10px; right: 10px; min-height: 42px; padding: 0 14px; font-size: 12px; }
  .presentation-document { gap: 16px; padding: 68px 0 16px; }
  .page { width: calc(100vw - 24px); min-height: 0; }
  .page__frame { min-height: 0; padding: 28px 24px; }
  .page-meta { gap: 16px; font-size: 12px; }
  .page-meta__chapter { gap: 8px; }
  .page-meta__folio { white-space: nowrap; }
  .page-title { font-size: clamp(38px, 10cqw, 60px); line-height: 1.04; max-width: 15ch; }
  .page-copy { font-size: 16px; }
  .connection-field { display: none; }
  .cover, .closing { display: flex; flex-direction: column; }
  .cover .page__frame, .closing .page__frame { order: -1; }
  .cover__photo { position: relative; inset: auto; height: 380px; clip-path: none; }
  .cover__veil { display: none; }
  .cover .page__frame { min-height: 0; padding: 28px 24px 36px; }
  .cover__content { width: 100%; margin: 0; }
  .cover__statement { grid-template-columns: 1fr; }
  .market__layout, .solution__layout, .support__layout { grid-template-columns: 1fr; gap: 32px; padding-top: 36px; }
  .market__copy .page-title, .solution__copy .page-title, .support__copy .page-title { font-size: 11cqw; max-width: 14ch; }
  .market__copy .market__intro { margin-top: 24px; }
  .market__copy .market__points { gap: 22px 20px; margin-top: 30px; }
  .market__points li { padding-top: 14px; font-size: 14px; }
  .market__points b { font-size: 14px; }
  .market__visual { min-height: 390px; }
  .market__image { border-radius: 100px 0 0; }
  .market__caption { width: 90%; padding: 20px; font-size: 16px; }
  .problem .page__frame { display: flex; gap: 36px; }
  .problem__head .page-title { font-size: 11cqw; max-width: 14ch; }
  .problem__head p { margin-top: 24px; }
  .problem__grid { gap: 28px 22px; }
  .problem__item { padding-top: 18px; }
  .problem__item::before { margin-bottom: 20px; }
  .problem__item h3 { font-size: 25px; }
  .problem__item p { margin-top: 12px; font-size: 15px; }
  .solution__copy > p { margin-top: 24px; font-size: 17px; }
  .solution__features { grid-template-columns: 1fr 1fr; font-size: 14px; gap: 14px; }
  .solution__map { border-radius: 0 70px 0 0; }
  .solution__map-note { font-size: 12px; }
  .solution__map-main { padding-left: 16px; }
  .solution__map-main small, .solution__node small { font-size: 13px; }
  .solution__map-main strong { margin-top: 14px; font-size: 29px; }
  .solution__nodes { margin-top: 28px; padding-top: 20px; gap: 20px; }
  .solution__node strong { margin-top: 10px; font-size: 16px; }
  .flow__head { grid-template-columns: 1fr; gap: 24px; }
  .flow__head .page-title { font-size: 10.5cqw; }
  .flow__head p { max-width: none; }
  .flow__track { grid-template-columns: 1fr; gap: 0; margin-top: 36px; margin-bottom: 24px; }
  .flow__track::before { top: 20px; bottom: 60px; left: 20px; right: auto; width: 1px; height: auto; }
  .flow__step { min-height: 130px; padding: 0 0 28px 66px; }
  .flow__step::before, .flow__step small { width: 40px; height: 40px; }
  .flow__step h3 { padding-top: 5px; font-size: 28px; }
  .flow__step p { margin-top: 12px; font-size: 16px; max-width: none; }
  .flow__demo { flex-direction: column; align-items: flex-start; gap: 12px; font-size: 14px; }
  .flow__demo a { gap: 18px; }
  .benefits__head, .segments__head, .plans__head { flex-direction: column; align-items: flex-start; gap: 24px; }
  .benefits__head p, .segments__head p, .plans__head p { max-width: none; }
  .benefits__body { grid-template-columns: 1fr; padding-top: 36px; }
  .benefits__statement > span { font-size: 12cqw; }
  .benefits__statement p { margin-top: 22px; font-size: 16px; }
  .benefits__list li { grid-template-columns: 1fr; padding: 20px 0; }
  .benefits__list strong { font-size: 20px; }
  .benefits__list span { font-size: 16px; }
  .segments__head .page-title, .plans__head .page-title { font-size: 10.5cqw; }
  .segments__grid { grid-template-columns: 1fr 1fr; grid-template-rows: repeat(2, 290px); gap: 12px; min-height: 0; margin-top: 30px; }
  .segment__label { left: 12px; right: 12px; bottom: 18px; padding-top: 14px; }
  .segment__label strong { font-size: 20px; }
  .support__visual { min-height: 390px; }
  .support__image { border-radius: 0 0 100px 0; }
  .support__copy > p { margin-top: 24px; }
  .support__list li { font-size: 15px; gap: 12px; padding: 16px 0; }
  .closing__photo { position: relative; inset: auto; height: 320px; margin-right: 24px; border-bottom-right-radius: 100px; }
  .closing__veil { display: none; }
  .closing__content { width: 100%; padding: 36px 0 8px; }
  .closing__logo { width: 130px; }
  .closing__content h2 { max-width: 14ch; margin-top: 32px; font-size: 11cqw; }
  .closing__content > p { font-size: 17px; }
  .closing__cta .closing__button { font-size: 16px; gap: 20px; }
  .closing__contacts { font-size: 15px; }
}
@media print {
  @page { size: 13.333in 7.5in; margin: 0; }
  .presentation-shell { margin: 0; background: white; print-color-adjust: exact; -webkit-print-color-adjust: exact; overflow: visible; }
  .pdf-export { display: none !important; }
  .presentation-document { display: block; padding: 0; }
  .page { width: 13.333in; height: 7.5in; min-height: 0; margin: 0; box-shadow: none; break-after: page; }
  .page:last-child { break-after: auto; }
  .page__frame { height: 100%; }
}
</style>
