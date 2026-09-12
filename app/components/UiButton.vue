<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue'

type ButtonVariant = 'primary' | 'outline' | 'solid'
type ButtonType = NonNullable<ButtonHTMLAttributes['type']>

const props = withDefaults(defineProps<{
    variant?: ButtonVariant
    href?: string
    to?: string
    type?: ButtonType
    disabled?: boolean
}>(), {
    variant: 'solid',
    href: undefined,
    to: undefined,
    type: 'button',
    disabled: false,
})

const tag = computed(() => props.to ? resolveComponent('NuxtLink') : props.href ? 'a' : 'button')
const isNativeButton = computed(() => !props.to && !props.href)

const handleClick = (event: MouseEvent) => {
    if (!props.disabled || isNativeButton.value) return
    event.preventDefault()
    event.stopImmediatePropagation()
}
</script>

<template>
    <component
        :is="tag"
        class="ui-button"
        :class="`ui-button--${variant}`"
        :href="href"
        :to="to"
        :type="isNativeButton ? type : undefined"
        :disabled="isNativeButton ? disabled : undefined"
        :aria-disabled="disabled ? 'true' : undefined"
        :tabindex="disabled && !isNativeButton ? -1 : undefined"
        @click="handleClick"
    >
        <span class="ui-button__label"><slot /></span>
        <span v-if="$slots.icon" class="ui-button__icon" aria-hidden="true"><slot name="icon" /></span>
    </component>
</template>
