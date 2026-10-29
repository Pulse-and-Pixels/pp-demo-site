<script setup lang="ts">
defineProps<{title: string; text?: string}>()
</script>

<template>
  <div class="rounded-card border border-dashed border-ink-200 bg-ink-50/60 px-6 py-16 text-center">
    <p class="font-display text-lg font-semibold text-ink-900">{{ title }}</p>
    <p v-if="text" class="mx-auto mt-2 max-w-md text-ink-500">{{ text }}</p>
    <div v-if="$slots.default" class="mt-6"><slot /></div>
  </div>
</template>
