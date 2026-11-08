import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { defineEventHandler, setHeader } from 'h3'
import { assertLocalRequest } from '../utils/assertLocalRequest'

export default defineEventHandler(async (event) => {
  assertLocalRequest(event)

  const presentationPath = resolve(process.cwd(), 'docs/apresentacao-elinea.html')
  const presentation = await readFile(presentationPath, 'utf8')

  setHeader(event, 'content-type', 'text/html; charset=utf-8')
  setHeader(event, 'cache-control', 'no-store')

  return presentation.replaceAll('./assets/apresentacao/', '/apresentacao-assets/')
})
