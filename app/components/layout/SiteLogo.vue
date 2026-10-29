<script setup lang="ts">
defineProps<{name?: string; dark?: boolean}>()
</script>

<template>
  <span class="inline-flex items-center gap-2.5">
    <svg viewBox="0 0 32 32" class="size-8 shrink-0" aria-hidden="true">
      <defs>
        <linearGradient id="ns-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#8279f9" />
          <stop offset="1" stop-color="#22d3ee" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" :fill="dark ? 'rgb(255 255 255 / 0.08)' : '#0b1026'" />
      <path d="M16 5l2.4 8.6L27 16l-8.6 2.4L16 27l-2.4-8.6L5 16l8.6-2.4z" fill="url(#ns-logo)" />
    </svg>
    <span class="font-display text-xl font-bold tracking-tight" :class="dark ? 'text-white' : 'text-ink-950'">{{ name }}</span>
  </span>
</template>
