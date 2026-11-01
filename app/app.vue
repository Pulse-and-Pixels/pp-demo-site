<script setup lang="ts">
const {data: settings} = useSiteSettings()

// <html lang>, hreflang alternates, og:locale and the canonical URL for the current language
const i18nHead = useLocaleHead({dir: true, lang: true, seo: true})

useHead({
  htmlAttrs: {lang: () => i18nHead.value.htmlAttrs.lang},
  link: () => i18nHead.value.link,
  meta: () => i18nHead.value.meta,
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
