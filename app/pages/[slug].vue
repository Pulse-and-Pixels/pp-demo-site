<script setup lang="ts">
import {HOME_SLUG} from '~/queries/pages'

const route = useRoute()
const localePath = useLocalePath()
const slug = String(route.params.slug)

// The homepage document lives at "/" (or "/nl"), never at "/home"
if (slug === HOME_SLUG) await navigateTo(localePath('/'), {redirectCode: 301})
</script>

<template>
  <ContentPage :slug="slug" />
</template>
