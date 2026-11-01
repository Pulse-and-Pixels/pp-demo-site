<script setup lang="ts">
import type {DocumentRef, PathSegment, ProductGridBlock} from '~/types/sanity'

const props = defineProps<{block: ProductGridBlock; doc?: DocumentRef; path?: PathSegment[]; index?: number}>()

const items = computed(() => {
  const all = props.block.items?.filter(Boolean) ?? []
  return clean(props.block.mode) === 'manual' ? all : all.slice(0, clean(props.block.limit) ?? 3)
})
const {t} = useI18n()
const compact = computed(() => clean(props.block.layout) === 'compact')
const columns = computed(() =>
  compact.value
    ? 'sm:grid-cols-2'
    : ({2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4'})[props.block.columns ?? 3],
)
</script>

<template>
  <UiSection :background="block.background" v-slot="{dark}">
    <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <UiSectionHeader :eyebrow="block.eyebrow" :heading="block.heading" :intro="block.intro" />
      <UiCtaButton v-if="block.cta?.link" :cta="block.cta" :tone="dark ? 'dark' : 'light'" class="shrink-0" />
    </div>
    <ul v-if="items.length" class="mt-12 grid gap-6" :class="columns">
      <li v-for="product in items" :key="product._id">
        <CardsProductCard :product="product" :compact="compact" />
      </li>
    </ul>
    <UiEmptyState v-else class="mt-12" :title="t('products.emptyBlockTitle')" :text="t('products.emptyBlockText')" />
  </UiSection>
</template>
