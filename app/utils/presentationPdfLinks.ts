import type { jsPDF } from 'jspdf'

export function addPresentationLinks(pdf: jsPDF, page: HTMLElement) {
  const bounds = page.getBoundingClientRect()
  const view = page.ownerDocument.defaultView!

  for (const anchor of page.querySelectorAll<HTMLAnchorElement>('a[href]')) {
    if (!/^(https?:|mailto:|tel:)/i.test(anchor.href) || view.getComputedStyle(anchor).visibility !== 'visible') continue

    for (const rect of anchor.getClientRects()) {
      const left = Math.max(rect.left, bounds.left)
      const top = Math.max(rect.top, bounds.top)
      const right = Math.min(rect.right, bounds.right)
      const bottom = Math.min(rect.bottom, bounds.bottom)
      if (right <= left || bottom <= top) continue

      pdf.link(left - bounds.left, top - bounds.top, right - left, bottom - top, { url: anchor.href })
    }
  }
}
