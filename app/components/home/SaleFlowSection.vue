<script setup lang="ts">
import { Check, CreditCard, MessageCircle, Package, ShoppingBag } from '@lucide/vue'
import { MarketingTextButton } from '@elinea/ui/marketing'

const steps = [
  { icon: ShoppingBag, label: 'Pedido realizado', value: 'R$ 129,90', className: 'sale-step--order' },
  { icon: CreditCard, label: 'Pagamento aprovado', value: 'Pix', className: 'sale-step--payment' },
  { icon: Package, label: 'Estoque atualizado', value: '−1 unidade', className: 'sale-step--stock' },
  { icon: MessageCircle, label: 'Cliente notificado', value: 'Mensagem enviada', className: 'sale-step--message' },
  { icon: Check, label: 'Venda concluída', value: 'Tudo certo!', className: 'sale-step--done' },
]

type Point = { x: number, y: number }

const saleMap = ref<HTMLElement | null>(null)
const desktopViewBox = ref('0 0 720 650')
const desktopPaths = ref(['M208 55 H320 Q360 55 360 95 V124 Q360 162 322 162 H294 V236 H300 Q300 294 358 294 H468 Q510 294 510 316 H544 V353 H525 Q525 390 488 390 H342 Q286 390 248 422 H214 V496 H224 Q224 550 278 550 H456 Q496 550 496 590 V613 H620'])
const desktopDots = ref<Point[]>([
  { x: 360, y: 124 },
  { x: 468, y: 294 },
  { x: 488, y: 390 },
  { x: 278, y: 550 },
])
const mobileViewBox = ref('0 0 720 650')
const mobilePaths = ref(['M402 55 H500 Q540 55 540 95 V148 H560 V223 H540 V246 Q540 276 510 276 H430 Q392 276 392 314 H402 V354 H374 V382 Q374 414 406 414 H500 Q532 414 532 446 H560 V520 H532 V542 Q532 574 500 574 H250 Q214 574 214 610 V613 H112'])
const mobileDots = ref<Point[]>([
  { x: 540, y: 95 },
  { x: 510, y: 276 },
  { x: 406, y: 414 },
  { x: 500, y: 574 },
])

let resizeObserver: ResizeObserver | undefined
let layoutFrame = 0

const roundedPath = (points: Point[], radius: number) => {
  const first = points[0]
  if (!first) return ''

  let path = `M ${first.x} ${first.y}`
  for (let index = 1; index < points.length - 1; index += 1) {
    const previous = points[index - 1]!
    const current = points[index]!
    const next = points[index + 1]!
    const incoming = Math.hypot(current.x - previous.x, current.y - previous.y)
    const outgoing = Math.hypot(next.x - current.x, next.y - current.y)
    const cornerRadius = Math.min(radius, incoming / 2, outgoing / 2)
    const before = {
      x: current.x + (previous.x - current.x) * cornerRadius / incoming,
      y: current.y + (previous.y - current.y) * cornerRadius / incoming,
    }
    const after = {
      x: current.x + (next.x - current.x) * cornerRadius / outgoing,
      y: current.y + (next.y - current.y) * cornerRadius / outgoing,
    }
    path += ` L ${before.x} ${before.y} Q ${current.x} ${current.y} ${after.x} ${after.y}`
  }

  const last = points.at(-1)!
  return `${path} L ${last.x} ${last.y}`
}

const updateSalePaths = () => {
  const map = saleMap.value
  if (!map) return

  const cards = Array.from(map.querySelectorAll<HTMLElement>('.sale-step')).map(card => ({
    left: card.offsetLeft,
    right: card.offsetLeft + card.offsetWidth,
    top: card.offsetTop,
    bottom: card.offsetTop + card.offsetHeight,
    centerX: card.offsetLeft + card.offsetWidth / 2,
    centerY: card.offsetTop + card.offsetHeight / 2,
  }))
  const [order, payment, stock, message, done] = cards
  if (!order || !payment || !stock || !message || !done) return

  const curveRadius = Math.min(42, Math.max(26, map.clientWidth * .055))
  const viewBox = `0 0 ${map.clientWidth} ${map.clientHeight}`

  if (window.matchMedia('(max-width: 767px)').matches) {
    const finalApproachY = done.top - curveRadius * 1.5
    const connectors = [
      [
        { x: order.right, y: order.centerY },
        { x: payment.centerX, y: order.centerY },
        { x: payment.centerX, y: payment.top },
      ],
      [
        { x: payment.centerX, y: payment.bottom },
        { x: payment.centerX, y: stock.centerY },
        { x: stock.right, y: stock.centerY },
      ],
      [
        { x: stock.right, y: stock.centerY },
        { x: message.centerX, y: stock.centerY },
        { x: message.centerX, y: message.top },
      ],
      [
        { x: message.centerX, y: message.bottom },
        { x: message.centerX, y: finalApproachY },
        { x: done.centerX, y: finalApproachY },
        { x: done.centerX, y: done.top },
      ],
    ]

    mobileViewBox.value = viewBox
    mobilePaths.value = connectors.map(points => roundedPath(points, curveRadius))
    mobileDots.value = [
      { x: payment.centerX, y: (order.centerY + payment.top) / 2 },
      { x: (payment.centerX + stock.right) / 2, y: stock.centerY },
      { x: message.centerX, y: (stock.centerY + message.top) / 2 },
      { x: (message.centerX + done.centerX) / 2, y: finalApproachY },
    ]
  } else {
    const connectors = [
      [
        { x: order.right, y: order.centerY },
        { x: payment.centerX, y: order.centerY },
        { x: payment.centerX, y: payment.top },
      ],
      [
        { x: payment.right, y: payment.centerY },
        { x: stock.centerX, y: payment.centerY },
        { x: stock.centerX, y: stock.top },
      ],
      [
        { x: stock.left, y: stock.centerY },
        { x: message.centerX, y: stock.centerY },
        { x: message.centerX, y: message.top },
      ],
      [
        { x: message.right, y: message.centerY },
        { x: done.centerX, y: message.centerY },
        { x: done.centerX, y: done.top },
      ],
    ]

    desktopViewBox.value = viewBox
    desktopPaths.value = connectors.map(points => roundedPath(points, curveRadius))
    desktopDots.value = [
      { x: payment.centerX, y: (order.centerY + payment.top) / 2 },
      { x: stock.centerX, y: (payment.centerY + stock.top) / 2 },
      { x: message.centerX, y: (stock.centerY + message.top) / 2 },
      { x: done.centerX, y: (message.centerY + done.top) / 2 },
    ]
  }

  nextTick(() => window.dispatchEvent(new CustomEvent('sale-flow:layout')))
}

const scheduleSalePathsUpdate = () => {
  cancelAnimationFrame(layoutFrame)
  layoutFrame = requestAnimationFrame(updateSalePaths)
}

onMounted(() => {
  scheduleSalePathsUpdate()
  if ('ResizeObserver' in window && saleMap.value) {
    resizeObserver = new ResizeObserver(scheduleSalePathsUpdate)
    resizeObserver.observe(saleMap.value)
    saleMap.value.querySelectorAll('.sale-step').forEach(card => resizeObserver?.observe(card))
  }
})

onBeforeUnmount(() => {
  cancelAnimationFrame(layoutFrame)
  resizeObserver?.disconnect()
})
</script>

<template>
  <section id="jornada" class="chapter chapter--light sale-flow">
    <div class="site-container split-layout">
      <div class="chapter-copy reveal-copy">
        <p class="site-label">Do clique ao cliente fiel</p>
        <h2 class="site-title">Uma venda<br>movimenta<br>tudo.</h2>
        <p class="site-copy">Cada venda no Elínea ativa uma operação completa: pagamento, estoque, comunicação e muito mais. Tudo acontece em um único ecossistema.</p>
        <MarketingTextButton class="chapter-text-cta" href="#ecossistema">Ver como funciona</MarketingTextButton>
      </div>

      <div ref="saleMap" class="sale-map" aria-label="Fluxo integrado de uma venda">
        <svg class="sale-path sale-path--desktop" :viewBox="desktopViewBox" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path v-for="(path, index) in desktopPaths" :key="index" data-sale-path :d="path" />
          <circle v-for="(dot, index) in desktopDots" :key="index" data-sale-dot :cx="dot.x" :cy="dot.y" r="4" />
        </svg>
        <svg class="sale-path sale-path--mobile" :viewBox="mobileViewBox" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path v-for="(path, index) in mobilePaths" :key="index" data-sale-path :d="path" />
          <circle v-for="(dot, index) in mobileDots" :key="index" data-sale-dot :cx="dot.x" :cy="dot.y" r="4" />
        </svg>
        <article v-for="step in steps" :key="step.label" class="sale-step" :class="step.className">
          <span class="sale-step__icon"><component :is="step.icon" :size="20" aria-hidden="true" /></span>
          <span><small>{{ step.label }}</small><strong>{{ step.value }}</strong></span>
        </article>
      </div>
    </div>
  </section>
</template>
