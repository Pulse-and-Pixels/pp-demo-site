<script setup lang="ts">
import type {Background} from '~/types/sanity'

/** Section wrapper that applies the editor-selected background and vertical rhythm. */
const props = withDefaults(defineProps<{background?: Background; as?: string; spacing?: boolean}>(), {
  background: 'white',
  as: 'section',
  spacing: true,
})

const bg = computed(() => clean(props.background) ?? 'white')
const dark = computed(() => bg.value === 'dark' || bg.value === 'brand')

const backgrounds: Record<Background, string> = {
  white: 'bg-white',
  muted: 'bg-ink-50',
  brand: 'bg-brand-gradient text-ink-200',
  dark: 'bg-ink-950 text-ink-300',
}

provide('section-dark', dark)
</script>

<template>
  <component :is="as" class="relative overflow-hidden" :class="[backgrounds[bg], spacing && 'section-y']">
    <div v-if="bg === 'dark'" aria-hidden="true" class="pointer-events-none absolute inset-0 bg-soft-gradient opacity-60" />
    <div class="container-page relative">
      <slot :dark="dark" />
    </div>
  </component>
</template>
