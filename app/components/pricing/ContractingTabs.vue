<script setup lang="ts">
import { contractingModes, type ContractingMode } from '~/data/contracting'

defineProps<{ modelValue: ContractingMode }>()
const emit = defineEmits<{ 'update:modelValue': [value: ContractingMode] }>()
const tablist = ref<HTMLElement | null>(null)
function onKeydown(event: KeyboardEvent, index: number) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? contractingModes.length - 1
    : (index + (event.key === 'ArrowRight' ? 1 : -1) + contractingModes.length) % contractingModes.length
  tablist.value?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus()
  emit('update:modelValue', contractingModes[next]!.id)
}
</script>

<template>
  <div class="contracting-tabs">
    <div ref="tablist" class="contracting-tabs__list" role="tablist" aria-label="Modalidade de contratação">
      <button v-for="(mode, index) in contractingModes" :id="`tab-${mode.id}`" :key="mode.id"
              type="button" role="tab" :aria-selected="modelValue === mode.id"
              :tabindex="modelValue === mode.id ? 0 : -1" aria-controls="contracting-plans"
              @click="emit('update:modelValue', mode.id)" @keydown="onKeydown($event, index)">
        {{ mode.label }}
      </button>
    </div>
    <div class="contracting-tabs__description">
      <p v-for="mode in contractingModes" :id="`description-${mode.id}`" :key="mode.id"
         :class="{ 'is-active': modelValue === mode.id }" :aria-hidden="modelValue !== mode.id">
        {{ mode.description }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.contracting-tabs { margin-top: clamp(2rem, 4vw, 3.5rem); }
.contracting-tabs__list { display: inline-flex; max-width: 100%; gap: .35rem; padding: .35rem; border: 1px solid var(--line); border-radius: 999px; background: white; }
.contracting-tabs button { min-height: 48px; padding: .65rem clamp(.85rem, 2vw, 1.6rem); border: 0; border-radius: 999px; background: transparent; color: var(--muted); font: inherit; font-size: .9rem; font-weight: 600; cursor: pointer; transition: background .18s ease, color .18s ease; }
.contracting-tabs button[aria-selected="true"] { background: var(--ink); color: white; }
.contracting-tabs button:hover:not([aria-selected="true"]) { color: var(--ink); background: var(--warm-white); }
.contracting-tabs button:focus-visible { outline: 3px solid var(--green); outline-offset: 3px; }
.contracting-tabs__description { display: grid; max-width: 49rem; margin-top: 1.25rem; }
.contracting-tabs__description p { grid-area: 1 / 1; margin: 0; color: var(--muted); font-size: 1rem; line-height: 1.65; opacity: 0; visibility: hidden; transition: opacity .18s ease; }
.contracting-tabs__description .is-active { opacity: 1; visibility: visible; }
@media (prefers-reduced-motion: reduce) { .contracting-tabs button, .contracting-tabs__description p { transition: none; } }
</style>
