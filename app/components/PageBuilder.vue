<script setup lang="ts">
import type {Component} from 'vue'
import type {BlockType, DocumentRef, PageBuilderBlock} from '~/types/sanity'

/**
 * Renders page builder sections by mapping each Sanity `_type` to a block
 * component. Blocks are code-split, so a page only loads what it uses.
 */
const props = defineProps<{blocks?: PageBuilderBlock[] | null; doc: DocumentRef}>()

const blockComponents: Record<BlockType, Component> = {
  heroBlock: defineAsyncComponent(() => import('./blocks/HeroBlock.vue')),
  richTextBlock: defineAsyncComponent(() => import('./blocks/RichTextBlock.vue')),
  imageTextBlock: defineAsyncComponent(() => import('./blocks/ImageTextBlock.vue')),
  featureGridBlock: defineAsyncComponent(() => import('./blocks/FeatureGridBlock.vue')),
  statsBlock: defineAsyncComponent(() => import('./blocks/StatsBlock.vue')),
  productGridBlock: defineAsyncComponent(() => import('./blocks/ProductGridBlock.vue')),
  newsGridBlock: defineAsyncComponent(() => import('./blocks/NewsGridBlock.vue')),
  testimonialBlock: defineAsyncComponent(() => import('./blocks/TestimonialBlock.vue')),
  ctaBlock: defineAsyncComponent(() => import('./blocks/CtaBlock.vue')),
  faqBlock: defineAsyncComponent(() => import('./blocks/FaqBlock.vue')),
  spacerBlock: defineAsyncComponent(() => import('./blocks/SpacerBlock.vue')),
}

const editAttr = useEditAttr()
const preview = useIsPreview()

const sections = computed(() =>
  (props.blocks ?? []).map((block) => {
    const type = clean(block._type) as BlockType
    return {block, type, component: blockComponents[type], path: ['pageBuilder', {_key: block._key}]}
  }),
)

if (import.meta.dev) {
  for (const {type, component} of sections.value) {
    if (!component) console.warn(`[PageBuilder] No component registered for block type "${type}"`)
  }
}
</script>

<template>
  <div :data-sanity="editAttr(doc, 'pageBuilder')">
    <template v-for="(section, index) in sections" :key="section.block._key">
      <component
        :is="section.component"
        v-if="section.component"
        :block="section.block"
        :doc="doc"
        :path="section.path"
        :index="index"
        :data-sanity="editAttr(doc, section.path)"
      />
      <!-- Unknown block types are skipped for visitors and flagged for editors -->
      <div v-else-if="preview" class="container-page py-8" :data-sanity="editAttr(doc, section.path)">
        <p class="rounded-card border border-dashed border-amber-400 bg-amber-50 p-6 text-amber-900">
          Unknown section type <code>{{ section.type }}</code>. Add a component for it in <code>PageBuilder.vue</code>.
        </p>
      </div>
    </template>
  </div>
</template>
