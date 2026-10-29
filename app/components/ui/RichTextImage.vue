<script setup lang="ts">
import type {NodeRenderer} from '@portabletext/vue'
import type {SanityImage} from '~/types/sanity'

defineProps<{value: SanityImage; index: number; isInline: boolean; renderNode: NodeRenderer}>()
</script>

<template>
  <figure class="not-prose my-10">
    <UiMediaImage :image="value" sizes="100vw md:768px" img-class="w-full rounded-card" />
    <figcaption v-if="value.caption" class="mt-3 text-center text-sm text-ink-500">{{ value.caption }}</figcaption>
  </figure>
</template>
