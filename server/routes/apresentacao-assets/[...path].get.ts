import { createError, defineEventHandler, getRouterParam, setHeader } from 'h3'
import { assertLocalRequest } from '../../utils/assertLocalRequest'

const CONTENT_TYPES: Record<string, string> = {
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp',
}

export default defineEventHandler(async (event) => {
  assertLocalRequest(event)

  const assetPath = getRouterParam(event, 'path')
  if (!assetPath || !/^[a-zA-Z0-9._/-]+$/.test(assetPath) || assetPath.includes('..')) {
    throw createError({ statusCode: 404, message: 'Arquivo não encontrado' })
  }

  const extensionStart = assetPath.lastIndexOf('.')
  const extension = extensionStart >= 0 ? assetPath.slice(extensionStart).toLowerCase() : ''
  const contentType = CONTENT_TYPES[extension]
  if (!contentType) {
    throw createError({ statusCode: 404, message: 'Arquivo não encontrado' })
  }

  const asset = await useStorage('/assets').getItemRaw(`presentation:assets/apresentacao/${assetPath}`)
  if (!asset) {
    throw createError({ statusCode: 404, message: 'Arquivo não encontrado' })
  }

  setHeader(event, 'content-type', contentType)
  setHeader(event, 'cache-control', 'no-store')
  return asset
})
