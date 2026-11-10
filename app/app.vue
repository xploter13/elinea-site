<script setup lang="ts">
import faviconUrl from '~/assets/images/favicon.png'

useHead({
  link: [{ rel: 'icon', type: 'image/png', href: faviconUrl }],
})
</script>

<template><NuxtPage /><SiteCookieConsent /></template>
