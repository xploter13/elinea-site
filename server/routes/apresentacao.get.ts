import { createError, defineEventHandler, setHeader } from 'h3'
import { assertLocalRequest } from '../utils/assertLocalRequest'

export default defineEventHandler(async (event) => {
  assertLocalRequest(event)

  const presentationStorage = useStorage('/assets')
  const presentation = await presentationStorage.getItem<string>('presentation:apresentacao-elinea.html')
  if (!presentation) {
    throw createError({ statusCode: 404, message: 'Apresentação não encontrada' })
  }

  setHeader(event, 'content-type', 'text/html; charset=utf-8')
  setHeader(event, 'cache-control', 'no-store')

  return presentation.replaceAll('./assets/apresentacao/', '/apresentacao-assets/')
})
