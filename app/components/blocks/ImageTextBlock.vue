<script setup lang="ts">
import type {DocumentRef, PathSegment, ImageTextBlock} from '~/types/sanity'

const props = defineProps<{block: ImageTextBlock; doc?: DocumentRef; path?: PathSegment[]; index?: number}>()
const attr = useBlockAttr(props)

const imageLeft = computed(() => clean(props.block.imagePosition) === 'left')
const align = computed(
  () => ({start: 'lg:items-start', center: 'lg:items-center', end: 'lg:items-end'})[clean(props.block.verticalAlignment) ?? 'center'],
)
</script>

<template>
  <UiSection :background="block.background" v-slot="{dark}">
    <div class="grid gap-12 lg:grid-cols-2 lg:gap-20" :class="align">
      <div class="relative" :class="imageLeft ? 'lg:order-first' : 'lg:order-last'" :data-sanity="attr('image')">
        <UiMediaImage
          :image="block.image"
          :aspect="5 / 4"
          sizes="100vw lg:50vw"
          img-class="w-full rounded-panel object-cover shadow-card"
        />
      </div>
      <div>
        <UiSectionHeader :eyebrow="block.eyebrow" :heading="block.heading" />
        <UiRichText :value="block.body" :invert="dark" class="mt-6 prose-base sm:prose-lg" />
        <div v-if="block.cta?.link" class="mt-8">
          <UiCtaButton :cta="block.cta" :tone="dark ? 'dark' : 'light'" />
        </div>
      </div>
    </div>
  </UiSection>
</template>
