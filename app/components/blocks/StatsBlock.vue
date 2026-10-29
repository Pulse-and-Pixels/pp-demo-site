<script setup lang="ts">
import type {DocumentRef, PathSegment, StatsBlock} from '~/types/sanity'

const props = defineProps<{block: StatsBlock; doc?: DocumentRef; path?: PathSegment[]; index?: number}>()
const columns = computed(() => {
  const count = props.block.stats?.length ?? 0
  return count >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : count === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
})
</script>

<template>
  <UiSection :background="block.background" v-slot="{dark}">
    <UiSectionHeader :eyebrow="block.eyebrow" :heading="block.heading" :intro="block.intro" align="center" />
    <dl class="mt-14 grid gap-px overflow-hidden rounded-card" :class="[columns, dark ? 'bg-white/10' : 'bg-ink-100']">
      <div
        v-for="stat in block.stats"
        :key="stat._key"
        class="flex flex-col-reverse gap-2 p-8 text-center"
        :class="dark ? 'bg-ink-950/60 backdrop-blur' : 'bg-white'"
      >
        <dt>
          <span class="block font-semibold" :class="dark ? 'text-white' : 'text-ink-900'">{{ stat.label }}</span>
          <span v-if="stat.description" class="mt-1 block text-sm" :class="dark ? 'text-ink-400' : 'text-ink-500'">
            {{ stat.description }}
          </span>
        </dt>
        <dd
          class="font-display text-5xl font-extrabold tracking-tight lg:text-6xl"
          :class="dark ? 'bg-gradient-to-br from-white to-accent-300 bg-clip-text text-transparent' : 'text-brand-600'"
        >
          <UiCountUp
            :value="clean(stat.value)"
            :decimals="clean(stat.decimals) ?? 0"
            :prefix="stat.prefix"
            :suffix="stat.suffix"
            :animate="clean(block.animate) !== false"
          />
        </dd>
      </div>
    </dl>
  </UiSection>
</template>
