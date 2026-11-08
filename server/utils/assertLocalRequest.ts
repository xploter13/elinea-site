import { createError, getRequestHost, getRequestIP, type H3Event } from 'h3'

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]'])
const LOCAL_ADDRESSES = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1'])

export function assertLocalRequest(event: H3Event) {
  const host = getRequestHost(event, { xForwardedHost: false })
  const hostname = host.startsWith('[')
    ? host.slice(0, host.indexOf(']') + 1)
    : host.split(':')[0]
  const address = getRequestIP(event, { xForwardedFor: false })

  if (!hostname || !LOCAL_HOSTS.has(hostname) || !address || !LOCAL_ADDRESSES.has(address)) {
    throw createError({ statusCode: 404, statusMessage: 'Página não encontrada' })
  }
}
