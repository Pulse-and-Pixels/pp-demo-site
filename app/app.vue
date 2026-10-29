<script setup lang="ts">
const {data: settings} = useSiteSettings()

useHead({
  titleTemplate: (title) => {
    const siteName = clean(settings.value?.siteName) ?? 'Northstar'
    if (!title) return siteName
    return title.includes(siteName) ? title : `${title} · ${siteName}`
  },
})
</script>

<template>
  <NuxtLoadingIndicator color="linear-gradient(to right, #6b57f2, #22d3ee)" :height="3" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
