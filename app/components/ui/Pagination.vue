<script setup lang="ts">
import {ChevronLeft, ChevronRight} from '@lucide/vue'

const props = defineProps<{page: number; pages: number; hash?: string}>()
const route = useRoute()
const {t} = useI18n()

const linkTo = (page: number) => ({
  query: {...route.query, page: page > 1 ? String(page) : undefined},
  hash: props.hash,
})
</script>

<template>
  <nav v-if="pages > 1" :aria-label="t('pagination.label')" class="flex items-center justify-center gap-2">
    <NuxtLink
      v-if="page > 1"
      :to="linkTo(page - 1)"
      class="inline-flex size-11 items-center justify-center rounded-full text-ink-700 ring-1 ring-ink-200 transition hover:bg-ink-50"
      rel="prev"
    >
      <ChevronLeft class="size-5" aria-hidden="true" /><span class="sr-only">{{ t('pagination.previous') }}</span>
    </NuxtLink>
    <ul class="flex items-center gap-2">
      <li v-for="n in pages" :key="n">
        <NuxtLink
          :to="linkTo(n)"
          class="inline-flex size-11 items-center justify-center rounded-full text-sm font-semibold transition"
          :class="n === page ? 'bg-ink-950 text-white' : 'text-ink-700 ring-1 ring-ink-200 hover:bg-ink-50'"
          :aria-current="n === page ? 'page' : undefined"
        >
          <span class="sr-only">{{ t('pagination.page', {page: n}) }}</span><span aria-hidden="true">{{ n }}</span>
        </NuxtLink>
      </li>
    </ul>
    <NuxtLink
      v-if="page < pages"
      :to="linkTo(page + 1)"
      class="inline-flex size-11 items-center justify-center rounded-full text-ink-700 ring-1 ring-ink-200 transition hover:bg-ink-50"
      rel="next"
    >
      <ChevronRight class="size-5" aria-hidden="true" /><span class="sr-only">{{ t('pagination.next') }}</span>
    </NuxtLink>
  </nav>
</template>
