const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]'])

export default defineNuxtRouteMiddleware(() => {
  const hostname = import.meta.server ? useRequestURL().hostname : window.location.hostname

  if (!LOCAL_HOSTS.has(hostname)) {
    return abortNavigation(createError({ statusCode: 404, message: 'Página não encontrada' }))
  }
})
