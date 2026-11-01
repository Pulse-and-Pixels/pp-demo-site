<script setup lang="ts">
/**
 * Shown only in preview mode outside the Presentation tool, so editors who
 * opened a preview link in a normal tab can see they're looking at drafts.
 */
const preview = useIsPreview()
const inPresentation = useIsSanityPresentationTool()
const route = useRoute()
const {t} = useI18n()
const disableUrl = computed(() => `/preview/disable?redirect=${encodeURIComponent(route.fullPath)}`)
</script>

<template>
  <div
    v-if="preview && inPresentation === false"
    class="fixed inset-x-0 bottom-4 z-50 mx-auto flex w-fit items-center gap-4 rounded-full bg-ink-950 py-2 pr-2 pl-5 text-sm text-white shadow-2xl ring-1 ring-white/10"
    role="status"
  >
    <span class="flex items-center gap-2"><span class="size-2 animate-pulse rounded-full bg-amber-400" />{{ t('preview.active') }}</span>
    <a :href="disableUrl" class="rounded-full bg-white px-4 py-1.5 font-semibold text-ink-950 hover:bg-brand-50">{{ t('preview.exit') }}</a>
  </div>
</template>
