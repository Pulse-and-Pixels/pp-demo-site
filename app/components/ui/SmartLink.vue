<script setup lang="ts">
import type {Link} from '~/types/sanity'

/** Renders a Sanity link object as a NuxtLink, falling back to plain text when it has no target. */
const props = defineProps<{link?: Link | null}>()

const href = computed(() => resolveHref(props.link))
const newTab = computed(() => Boolean(clean(props.link?.openInNewTab)))
</script>

<template>
  <NuxtLink
    v-if="href"
    :to="href"
    :target="newTab ? '_blank' : undefined"
    :rel="newTab ? 'noopener noreferrer' : undefined"
  >
    <slot>{{ link?.label }}</slot>
  </NuxtLink>
  <span v-else><slot>{{ link?.label }}</slot></span>
</template>
