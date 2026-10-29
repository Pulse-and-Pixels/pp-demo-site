<script setup lang="ts">
import type {DocumentRef, PathSegment, SpacerBlock} from '~/types/sanity'

const props = defineProps<{block: SpacerBlock; doc?: DocumentRef; path?: PathSegment[]; index?: number}>()
const height = computed(() => ({sm: 'h-8', md: 'h-16', lg: 'h-24', xl: 'h-40'})[clean(props.block.size) ?? 'md'])
</script>

<template>
  <UiSection :background="block.background" :spacing="false" as="div" aria-hidden="true">
    <div class="flex items-center" :class="height">
      <hr v-if="clean(block.divider)" class="w-full border-ink-200" />
    </div>
  </UiSection>
</template>
