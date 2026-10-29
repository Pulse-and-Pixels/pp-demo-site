<script setup lang="ts">
import type {Cta} from '~/types/sanity'

const props = withDefaults(defineProps<{cta?: Cta | null; tone?: 'light' | 'dark'; size?: 'md' | 'lg'}>(), {
  tone: 'light',
  size: 'md',
})

const variant = computed(() => clean(props.cta?.variant) || 'primary')

const variants = {
  light: {
    primary: 'bg-brand-600 text-white shadow-lg shadow-brand-600/25 hover:bg-brand-500 hover:shadow-brand-500/30',
    secondary: 'bg-white text-ink-900 ring-1 ring-ink-200 hover:ring-ink-300 hover:bg-ink-50',
    ghost: 'text-brand-600 hover:text-brand-700',
  },
  dark: {
    primary: 'bg-white text-ink-950 shadow-lg shadow-black/20 hover:bg-brand-50',
    secondary: 'bg-white/10 text-white ring-1 ring-white/25 backdrop-blur hover:bg-white/15',
    ghost: 'text-white hover:text-accent-300',
  },
} as const
</script>

<template>
  <UiSmartLink
    v-if="cta?.link"
    :link="cta.link"
    class="group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-300 ease-out-soft focus-visible:outline-offset-4"
    :class="[
      variants[tone][variant],
      variant === 'ghost' ? 'px-0' : size === 'lg' ? 'px-7 py-3.5 text-base' : 'px-5 py-2.5 text-sm',
      variant !== 'ghost' && 'hover:-translate-y-0.5',
    ]"
  >
    {{ cta.link.label }}
    <span
      v-if="variant === 'ghost'"
      aria-hidden="true"
      class="transition-transform duration-300 group-hover:translate-x-1"
      >→</span
    >
  </UiSmartLink>
</template>
