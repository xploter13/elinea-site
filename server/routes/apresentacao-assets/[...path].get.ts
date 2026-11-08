import { readFile } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'
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
  if (!assetPath || assetPath.includes('\0')) {
    throw createError({ statusCode: 404, statusMessage: 'Arquivo não encontrado' })
  }

  const assetsRoot = resolve(process.cwd(), 'docs/assets/apresentacao')
  const requestedFile = resolve(assetsRoot, assetPath)
  if (!requestedFile.startsWith(`${assetsRoot}${sep}`)) {
    throw createError({ statusCode: 404, statusMessage: 'Arquivo não encontrado' })
  }

  const contentType = CONTENT_TYPES[extname(requestedFile).toLowerCase()]
  if (!contentType) {
    throw createError({ statusCode: 404, statusMessage: 'Arquivo não encontrado' })
  }

  try {
    const asset = await readFile(requestedFile)
    setHeader(event, 'content-type', contentType)
    setHeader(event, 'cache-control', 'no-store')
    return asset
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Arquivo não encontrado' })
  }
})
