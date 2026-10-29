<script setup lang="ts">
import type {RouteLocationRaw} from 'vue-router'

/** Category filter rendered as links, so filtered views are shareable and crawlable. */
defineProps<{
  label: string
  items: {key: string; title: string; to: RouteLocationRaw; active: boolean}[]
}>()
</script>

<template>
  <nav :aria-label="label">
    <ul class="flex flex-wrap gap-2">
      <li v-for="item in items" :key="item.key">
        <NuxtLink
          :to="item.to"
          class="inline-flex rounded-full px-4 py-2 text-sm font-medium transition"
          :class="item.active ? 'bg-ink-950 text-white shadow-sm' : 'bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ink-300 hover:text-ink-950'"
          :aria-current="item.active ? 'page' : undefined"
        >
          {{ item.title }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
