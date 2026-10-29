<script setup lang="ts">
import type {CtaBlock, DocumentRef, PathSegment} from '~/types/sanity'

const props = defineProps<{block: CtaBlock; doc?: DocumentRef; path?: PathSegment[]; index?: number}>()
const attr = useBlockAttr(props)

const theme = computed(() => clean(props.block.theme) ?? 'gradient')
const center = computed(() => clean(props.block.alignment) !== 'left')
const dark = computed(() => theme.value !== 'light' || Boolean(props.block.image))
const themes = {
  gradient: 'bg-brand-gradient',
  dark: 'bg-ink-950',
  light: 'bg-brand-50 ring-1 ring-brand-100',
}
</script>

<template>
  <section class="py-12 sm:py-16">
    <div class="container-page">
      <div class="relative isolate overflow-hidden rounded-panel px-6 py-16 sm:px-12 sm:py-20 lg:px-20" :class="themes[theme]">
        <div v-if="block.image" class="absolute inset-0 -z-10" :data-sanity="attr('image')">
          <UiMediaImage :image="block.image" sizes="100vw lg:1280px" img-class="size-full object-cover" />
          <div class="absolute inset-0 bg-ink-950/60" />
        </div>
        <div aria-hidden="true" class="absolute -top-24 -right-24 -z-10 size-72 rounded-full bg-accent-400/30 blur-3xl" />
        <div
          class="flex flex-col gap-8"
          :class="center ? 'mx-auto max-w-3xl items-center text-center' : 'lg:flex-row lg:items-center lg:justify-between'"
        >
          <div :class="!center && 'max-w-2xl'">
            <p v-if="block.eyebrow" class="mb-3 text-sm font-semibold tracking-wider uppercase" :class="dark ? 'text-accent-300' : 'text-brand-600'">
              {{ block.eyebrow }}
            </p>
            <h2 class="text-3xl font-bold text-balance sm:text-4xl lg:text-5xl" :class="dark && 'text-white'">{{ block.heading }}</h2>
            <p v-if="block.text" class="mt-5 text-lg" :class="dark ? 'text-ink-200' : 'text-ink-600'">{{ block.text }}</p>
          </div>
          <div v-if="block.ctas?.length" class="flex shrink-0 flex-wrap gap-4" :class="center && 'justify-center'">
            <UiCtaButton v-for="cta in block.ctas" :key="cta._key" :cta="cta" :tone="dark ? 'dark' : 'light'" size="lg" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
