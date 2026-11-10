<script setup lang="ts">
import { legalTextSegments } from '~/utils/legalDocument'
const props = defineProps<{ text: string }>()
const segments = computed(() => legalTextSegments(props.text))
</script>

<template>
  <template v-for="(segment, index) in segments" :key="index"><strong v-if="segment.bold">{{ segment.text }}</strong><template v-else>{{ segment.text }}</template></template>
</template>
