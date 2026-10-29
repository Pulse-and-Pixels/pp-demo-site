<script setup lang="ts">
import {HOME_SLUG} from '~/queries/pages'

const route = useRoute('slug')
const slug = String(route.params.slug)

// The homepage document lives at "/", never at "/home"
if (slug === HOME_SLUG) await navigateTo('/', {redirectCode: 301})
</script>

<template>
  <ContentPage :slug="slug" />
</template>
