<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    eyebrow?: string
    heading?: string
    intro?: string
    align?: 'left' | 'center'
    as?: 'h1' | 'h2'
    dark?: boolean
  }>(),
  {align: 'left', as: 'h2', eyebrow: undefined, heading: undefined, intro: undefined},
)

const sectionDark = inject<Ref<boolean> | undefined>('section-dark', undefined)
const isDark = computed(() => props.dark || Boolean(sectionDark?.value))
</script>

<template>
  <header
    v-if="eyebrow || heading || intro"
    class="max-w-3xl"
    :class="align === 'center' ? 'mx-auto text-center' : ''"
  >
    <p
      v-if="eyebrow"
      class="mb-3 text-sm font-semibold tracking-wider uppercase"
      :class="isDark ? 'text-accent-300' : 'text-brand-600'"
    >
      {{ eyebrow }}
    </p>
    <component
      :is="as"
      v-if="heading"
      class="text-3xl font-bold text-balance sm:text-4xl lg:text-5xl"
      :class="isDark && 'text-white'"
    >
      {{ heading }}
    </component>
    <p v-if="intro" class="mt-5 text-lg leading-relaxed" :class="isDark ? 'text-ink-300' : 'text-ink-500'">
      {{ intro }}
    </p>
  </header>
</template>
