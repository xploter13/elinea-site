<script setup lang="ts">
import { footerPages } from '~/data/footerPages'
import FooterDetailPage from '~/components/site/FooterDetailPage.vue'

const route = useRoute()
const page = footerPages.find(item => item.section === 'ecossistema' && item.slug === route.params.slug)
if (!page) throw createError({ statusCode: 404, statusMessage: 'Página não encontrada' })
</script>

<template>
  <FooterDetailPage :page="page" />
</template>
