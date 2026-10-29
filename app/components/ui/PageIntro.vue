<script setup lang="ts">
/** Heading area for overview pages (news, products). */
defineProps<{eyebrow?: string; title?: string; intro?: string}>()
</script>

<template>
  <section class="relative overflow-hidden border-b border-ink-100 bg-ink-50/60 bg-soft-gradient">
    <div class="container-page py-16 sm:py-20 lg:py-24">
      <div class="max-w-3xl animate-fade-up">
        <p v-if="eyebrow" class="mb-3 text-sm font-semibold tracking-wider text-brand-600 uppercase">{{ eyebrow }}</p>
        <h1 class="text-4xl font-extrabold text-balance sm:text-5xl lg:text-6xl">{{ title }}</h1>
        <p v-if="intro" class="mt-5 text-lg leading-relaxed text-ink-500 sm:text-xl">{{ intro }}</p>
      </div>
      <slot />
    </div>
  </section>
</template>
