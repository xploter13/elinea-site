export type LegalBlock = { type: 'paragraph', text: string } | { type: 'list', items: string[] }
export type LegalSection = { title: string, blocks: LegalBlock[] }

// The local legal document uses only headings, paragraphs, lists and bold text.
// Rendering Vue text nodes keeps the document free from interpreted HTML.
export function parseLegalDocument(document: string): LegalSection[] {
  const sections: LegalSection[] = [{ title: '', blocks: [] }]
  for (const part of document.replace(/\r\n?/g, '\n').trim().split(/\n\s*\n/)) {
    if (part.startsWith('# ') || part.trim() === '---') continue
    if (part.startsWith('## ')) {
      sections.push({ title: part.slice(3).trim(), blocks: [] })
    } else if (part.startsWith('- ')) {
      sections.at(-1)!.blocks.push({ type: 'list', items: part.split('\n').map(line => line.replace(/^- /, '')) })
    } else {
      sections.at(-1)!.blocks.push({ type: 'paragraph', text: part })
    }
  }
  return sections
}

export const legalTextSegments = (text: string) => text.split(/(\*\*.*?\*\*)/g).filter(Boolean).map(part => ({
  bold: part.startsWith('**') && part.endsWith('**'),
  text: part.startsWith('**') && part.endsWith('**') ? part.slice(2, -2) : part,
}))
