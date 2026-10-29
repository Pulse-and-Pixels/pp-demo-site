<script setup lang="ts">
import type {DocumentRef, PathSegment, FeatureGridBlock} from '~/types/sanity'

const props = defineProps<{block: FeatureGridBlock; doc?: DocumentRef; path?: PathSegment[]; index?: number}>()
const attr = useBlockAttr(props)

const columns = computed(
  () => ({2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4'})[props.block.columns ?? 3],
)
const style = computed(() => clean(props.block.cardStyle) ?? 'bordered')
</script>

<template>
  <UiSection :background="block.background" v-slot="{dark}">
    <UiSectionHeader :eyebrow="block.eyebrow" :heading="block.heading" :intro="block.intro" align="center" />
    <ul class="mt-14 grid gap-6" :class="columns">
      <li
        v-for="feature in block.features"
        :key="feature._key"
        class="group relative rounded-card p-7 transition duration-300 ease-out-soft"
        :class="{
          'ring-1 hover:-translate-y-1': style !== 'minimal',
          'ring-ink-100 hover:ring-brand-200 hover:shadow-card-hover': style === 'bordered' && !dark,
          'bg-white shadow-card ring-ink-100 hover:shadow-card-hover': style === 'elevated' && !dark,
          'bg-white/5 ring-white/10 hover:bg-white/10': style !== 'minimal' && dark,
          'px-0': style === 'minimal',
        }"
        :data-sanity="attr('features', {_key: feature._key})"
      >
        <span
          class="inline-flex size-12 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-110 [&_svg]:size-6"
          :class="dark ? 'bg-white/10 text-accent-300' : 'bg-brand-50 text-brand-600'"
        >
          <UiFeatureIcon :name="feature.icon" />
        </span>
        <h3 class="mt-5 text-lg font-semibold" :class="dark && 'text-white'">{{ feature.title }}</h3>
        <p v-if="feature.text" class="mt-2 leading-relaxed" :class="dark ? 'text-ink-300' : 'text-ink-500'">
          {{ feature.text }}
        </p>
        <UiSmartLink
          v-if="feature.link"
          :link="feature.link"
          class="mt-4 inline-flex text-sm font-semibold after:absolute after:inset-0"
          :class="dark ? 'text-accent-300' : 'text-brand-600'"
        />
      </li>
    </ul>
  </UiSection>
</template>
