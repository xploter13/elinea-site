import type { jsPDF } from 'jspdf'

interface TextGlyph {
  text: string
  left: number
  baseline: number
}

interface TextRun {
  glyphs: TextGlyph[]
  size: number
  weight: number
  color: [number, number, number]
  opacity: number
}

export function measurePresentationText(page: HTMLElement): TextRun[] {
  const owner = page.ownerDocument
  const view = owner.defaultView!
  const measurement = owner.createElement('canvas').getContext('2d')!
  const bounds = page.getBoundingClientRect()
  const walker = owner.createTreeWalker(page, NodeFilter.SHOW_TEXT)
  const segmenter = new Intl.Segmenter('pt-BR', { granularity: 'grapheme' })
  const runs: TextRun[] = []

  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    const parent = node.parentElement
    if (!parent || !node.textContent?.trim() || parent.closest('style, script, svg')) continue

    const style = view.getComputedStyle(parent)
    if (style.visibility !== 'visible' || parent.getClientRects().length === 0) continue

    const size = Number.parseFloat(style.fontSize)
    const weight = [400, 500, 600, 700].reduce((closest, available) =>
      Math.abs(available - Number(style.fontWeight)) < Math.abs(closest - Number(style.fontWeight)) ? available : closest,
    )
    const channels = style.color.match(/[\d.]+/g)?.map(Number)
    if (!channels || channels.length < 3) continue

    let opacity = channels[3] ?? 1
    let ancestor: HTMLElement | null = parent
    while (ancestor) {
      opacity *= Number(view.getComputedStyle(ancestor).opacity)
      if (ancestor === page) break
      ancestor = ancestor.parentElement
    }
    if (opacity === 0) continue

    measurement.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
    const metrics = measurement.measureText('Hg')
    const descent = metrics.fontBoundingBoxDescent
    const glyphs: TextGlyph[] = []
    const range = owner.createRange()

    for (const segment of segmenter.segment(node.textContent)) {
      range.setStart(node, segment.index)
      range.setEnd(node, segment.index + segment.segment.length)
      const rect = range.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) continue
      glyphs.push({ text: segment.segment, left: rect.left - bounds.left, baseline: rect.bottom - bounds.top - descent })
    }

    runs.push({ glyphs, size, weight, color: [channels[0]!, channels[1]!, channels[2]!], opacity })
  }

  return runs
}

export function drawPresentationText(pdf: jsPDF, runs: TextRun[]) {
  pdf.saveGraphicsState()
  for (const run of runs) {
    pdf.setFont('InterPresentation', 'normal', run.weight)
    pdf.setFontSize(run.size * .75)
    pdf.setTextColor(...run.color)
    pdf.setGState(pdf.GState({ opacity: run.opacity }))
    for (const glyph of run.glyphs) {
      pdf.text(glyph.text, glyph.left, glyph.baseline, { baseline: 'alphabetic' })
    }
  }
  pdf.restoreGraphicsState()
}

export function hidePresentationText(page: HTMLElement) {
  const walker = page.ownerDocument.createTreeWalker(page, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const parent = walker.currentNode.parentElement
    if (parent && !parent.closest('style, script, svg, html2canvaspseudoelement')) {
      parent.style.webkitTextFillColor = 'transparent'
    }
  }
}
