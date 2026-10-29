<script setup lang="ts">
import type {NuxtError} from '#app'

const props = defineProps<{error: NuxtError}>()
const notFound = computed(() => props.error.statusCode === 404)

useHead({title: () => (notFound.value ? 'Page not found' : 'Something went wrong')})
useSeoMeta({robots: 'noindex'})
</script>

<template>
  <NuxtLayout>
    <section class="bg-brand-gradient">
      <div class="container-page flex min-h-[70dvh] flex-col items-center justify-center py-24 text-center">
        <p class="font-display text-7xl font-extrabold text-transparent bg-gradient-to-br from-white to-accent-300 bg-clip-text sm:text-9xl">
          {{ error.statusCode }}
        </p>
        <h1 class="mt-6 text-3xl font-bold text-white sm:text-4xl">
          {{ notFound ? 'We couldn’t find that page' : 'Something went wrong' }}
        </h1>
        <p class="mt-4 max-w-lg text-lg text-ink-300">
          {{ notFound ? 'The page may have moved, or the link might be out of date.' : 'Please try again in a moment.' }}
        </p>
        <div class="mt-10 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            class="rounded-full bg-white px-6 py-3 font-semibold text-ink-950 transition hover:-translate-y-0.5 hover:bg-brand-50"
            @click="clearError({redirect: '/'})"
          >
            Back to home
          </button>
          <NuxtLink to="/news" class="rounded-full bg-white/10 px-6 py-3 font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/15" @click="clearError()">
            Read the news
          </NuxtLink>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>
