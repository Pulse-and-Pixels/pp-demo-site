<script setup lang="ts">
import type {NodeRenderer} from '@portabletext/vue'
import type {InternalTarget} from '~/types/sanity'

const props = defineProps<{
  value?: {_type: string; href?: string; openInNewTab?: boolean; internal?: InternalTarget | null}
  text: string
  markKey?: string
  markType: string
  renderNode: NodeRenderer
}>()

const link = computed(() => {
  const value = clean(props.value)
  if (value?.internal) return {linkType: 'internal' as const, internal: value.internal, openInNewTab: value.openInNewTab}
  return {
    linkType: value?.href && isExternalHref(value.href) ? ('external' as const) : ('path' as const),
    url: value?.href,
    path: value?.href,
    openInNewTab: value?.openInNewTab,
  }
})
</script>

<template>
  <UiSmartLink :link="link"><slot /></UiSmartLink>
</template>
