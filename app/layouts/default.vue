<script setup lang="ts">
const {data: settings} = await useSiteSettings()
await useRouteTranslations()
const {t} = useI18n()
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <a
      href="#main"
      class="sr-only z-50 rounded-full bg-ink-950 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
    >
      {{ t('a11y.skipToContent') }}
    </a>
    <LayoutSiteHeader :settings="settings" />
    <main id="main" class="flex-1">
      <slot />
    </main>
    <LayoutSiteFooter :settings="settings" />
    <LayoutPreviewBar />
  </div>
</template>
