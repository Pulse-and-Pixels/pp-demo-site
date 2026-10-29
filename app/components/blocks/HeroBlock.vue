<script setup lang="ts">
import type {DocumentRef, PathSegment, HeroBlock} from '~/types/sanity'

const props = defineProps<{block: HeroBlock; doc?: DocumentRef; path?: PathSegment[]; index?: number}>()
const attr = useBlockAttr(props)

const layout = computed(() => clean(props.block.layout) ?? 'split')
const theme = computed(() => clean(props.block.theme) ?? 'gradient')
const isFirst = computed(() => !props.index)
const dark = computed(() => theme.value !== 'light' || layout.value === 'background')
const headingTag = computed(() => (isFirst.value ? 'h1' : 'h2'))

const themes = {
  gradient: 'bg-brand-gradient',
  dark: 'bg-ink-950',
  light: 'bg-white bg-soft-gradient',
}
</script>

<template>
  <section class="relative isolate overflow-hidden" :class="themes[theme]">
    <!-- Full-bleed background image -->
    <div v-if="layout === 'background' && block.image" class="absolute inset-0 -z-10" :data-sanity="attr('image')">
      <UiMediaImage :image="block.image" :priority="isFirst" sizes="100vw" img-class="size-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/70 to-ink-950/30" />
    </div>
    <div v-else-if="theme !== 'light'" aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 opacity-50 [background-image:radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1px)] [background-size:28px_28px]" />

    <div
      class="container-page grid items-center gap-12 py-20 sm:py-24 lg:py-32"
      :class="{
        'lg:grid-cols-2 lg:gap-16': layout === 'split' && block.image,
        'text-center': layout === 'centered',
        'lg:min-h-[36rem]': layout === 'background',
      }"
    >
      <div class="animate-fade-up" :class="{'mx-auto max-w-3xl': layout === 'centered', 'max-w-2xl': layout === 'background'}">
        <p
          v-if="block.eyebrow"
          class="mb-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium"
          :class="dark ? 'bg-white/10 text-accent-300 ring-1 ring-white/15' : 'bg-brand-50 text-brand-700 ring-1 ring-brand-100'"
        >
          <span class="size-1.5 rounded-full" :class="dark ? 'bg-accent-400' : 'bg-brand-500'" aria-hidden="true" />
          {{ block.eyebrow }}
        </p>
        <component
          :is="headingTag"
          class="text-4xl leading-[1.05] font-extrabold text-balance sm:text-5xl lg:text-6xl xl:text-7xl"
          :class="dark ? 'text-white' : 'text-ink-950'"
        >
          {{ block.heading }}
        </component>
        <p
          v-if="block.text"
          class="mt-6 text-lg leading-relaxed sm:text-xl"
          :class="[dark ? 'text-ink-200' : 'text-ink-500', layout === 'centered' && 'mx-auto max-w-2xl']"
        >
          {{ block.text }}
        </p>
        <div
          v-if="block.ctas?.length"
          class="mt-10 flex flex-wrap items-center gap-4"
          :class="layout === 'centered' && 'justify-center'"
        >
          <UiCtaButton v-for="cta in block.ctas" :key="cta._key" :cta="cta" :tone="dark ? 'dark' : 'light'" size="lg" />
        </div>
      </div>

      <div
        v-if="block.image && layout !== 'background'"
        class="relative animate-fade-up [animation-delay:150ms]"
        :class="layout === 'centered' && 'mx-auto mt-4 w-full max-w-5xl'"
        :data-sanity="attr('image')"
      >
        <div aria-hidden="true" class="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-brand-500/30 via-accent-400/20 to-transparent blur-2xl" />
        <UiMediaImage
          :image="block.image"
          :aspect="layout === 'centered' ? 16 / 8 : 4 / 3"
          :priority="isFirst"
          :sizes="layout === 'centered' ? '100vw lg:1024px' : '100vw lg:50vw'"
          img-class="w-full rounded-panel shadow-2xl ring-1 ring-white/10"
        />
      </div>
    </div>
  </section>
</template>
