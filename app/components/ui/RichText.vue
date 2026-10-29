<script setup lang="ts">
import {PortableText, type PortableTextComponents} from '@portabletext/vue'
import type {RichText} from '~/types/sanity'
import RichTextImage from './RichTextImage.vue'
import RichTextLink from './RichTextLink.vue'

withDefaults(defineProps<{value?: RichText | null; invert?: boolean}>(), {value: undefined})

const components: PortableTextComponents = {
  types: {image: RichTextImage},
  marks: {link: RichTextLink},
}
</script>

<template>
  <div v-if="value?.length" class="prose-northstar" :class="invert && 'prose-invert-northstar'">
    <PortableText :value="value" :components="components" :on-missing-component="false" />
  </div>
</template>
