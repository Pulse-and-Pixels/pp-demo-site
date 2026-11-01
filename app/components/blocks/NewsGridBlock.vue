<script setup lang="ts">
import type {DocumentRef, PathSegment, NewsGridBlock} from '~/types/sanity'

const props = defineProps<{block: NewsGridBlock; doc?: DocumentRef; path?: PathSegment[]; index?: number}>()

const items = computed(() => {
  const all = props.block.items?.filter(Boolean) ?? []
  return clean(props.block.mode) === 'manual' ? all : all.slice(0, clean(props.block.limit) ?? 3)
})
const {t} = useI18n()
const layout = computed(() => clean(props.block.layout) ?? 'grid')
const [lead, rest] = [computed(() => items.value[0]), computed(() => items.value.slice(1))]
</script>

<template>
  <UiSection :background="block.background" v-slot="{dark}">
    <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <UiSectionHeader :eyebrow="block.eyebrow" :heading="block.heading" :intro="block.intro" />
      <UiCtaButton v-if="block.cta?.link" :cta="block.cta" :tone="dark ? 'dark' : 'light'" class="shrink-0" />
    </div>

    <UiEmptyState v-if="!items.length" class="mt-12" :title="t('news.emptyBlockTitle')" :text="t('news.emptyBlockText')" />

    <div v-else-if="layout === 'featured' && lead" class="mt-12 space-y-6">
      <CardsNewsCard :article="lead" variant="large" />
      <!-- Remaining articles fill whole rows: 3 columns when they divide evenly, otherwise 2 -->
      <ul v-if="rest.length" class="grid gap-6 sm:grid-cols-2" :class="rest.length % 3 === 0 && 'lg:grid-cols-3'">
        <li v-for="article in rest" :key="article._id"><CardsNewsCard :article="article" /></li>
      </ul>
    </div>

    <ul v-else-if="layout === 'list'" class="mt-12 grid gap-4 lg:grid-cols-2">
      <li v-for="article in items" :key="article._id"><CardsNewsCard :article="article" variant="list" /></li>
    </ul>

    <ul v-else class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="article in items" :key="article._id"><CardsNewsCard :article="article" /></li>
    </ul>
  </UiSection>
</template>
