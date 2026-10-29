<script setup lang="ts">
import {pageBySlugQuery} from '~/queries/pages'
import type {Page} from '~/types/sanity'

/** A page assembled entirely from page builder sections in Sanity. */
const props = defineProps<{slug: string}>()

const {data: page, error} = await useContent<Page>(pageBySlugQuery, {slug: props.slug})
assertContent(page.value, error.value)

usePageSeo(() => page.value && {title: page.value.title, seo: page.value.seo})

// The first hero renders the page's <h1>; otherwise provide one for assistive tech
const needsHeading = computed(() => clean(page.value?.pageBuilder?.[0]?._type) !== 'heroBlock')
</script>

<template>
  <div v-if="page">
    <h1 v-if="needsHeading" class="sr-only">{{ page.title }}</h1>
    <PageBuilder :blocks="page.pageBuilder" :doc="page" />
    <div v-if="!page.pageBuilder?.length" class="container-page section-y">
      <UiEmptyState :title="page.title" text="This page doesn't have any sections yet. Add some in the Studio." />
    </div>
  </div>
</template>
