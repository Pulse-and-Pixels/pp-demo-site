<script setup lang="ts">
import type {DocumentRef, PathSegment, RichTextBlock} from '~/types/sanity'

const props = defineProps<{block: RichTextBlock; doc?: DocumentRef; path?: PathSegment[]; index?: number}>()
const center = computed(() => clean(props.block.alignment) === 'center')
const wide = computed(() => clean(props.block.width) === 'wide')
</script>

<template>
  <UiSection :background="block.background" v-slot="{dark}">
    <div :class="[wide ? 'max-w-5xl' : 'max-w-3xl', center && 'mx-auto text-center']">
      <UiSectionHeader :eyebrow="block.eyebrow" :heading="block.heading" :align="center ? 'center' : 'left'" />
      <UiRichText :value="block.body" :invert="dark" :class="[block.heading && 'mt-8', center && '[&_ul]:text-left [&_ol]:text-left']" />
    </div>
  </UiSection>
</template>
