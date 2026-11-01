<script setup lang="ts">
import type {NuxtError} from '#app'

const props = defineProps<{error: NuxtError}>()
const {t} = useI18n()
const localePath = useLocalePath()
const notFound = computed(() => props.error.statusCode === 404)

useHead({title: () => (notFound.value ? t('error.pageNotFound') : t('error.genericTitle'))})
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
          {{ notFound ? t('error.notFoundTitle') : t('error.genericTitle') }}
        </h1>
        <p class="mt-4 max-w-lg text-lg text-ink-300">
          {{ notFound ? t('error.notFoundText') : t('error.genericText') }}
        </p>
        <div class="mt-10 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            class="rounded-full bg-white px-6 py-3 font-semibold text-ink-950 transition hover:-translate-y-0.5 hover:bg-brand-50"
            @click="clearError({redirect: localePath('/')})"
          >
            {{ t('error.home') }}
          </button>
          <NuxtLink
            :to="localePath('news')"
            class="rounded-full bg-white/10 px-6 py-3 font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/15"
            @click="clearError()"
          >
            {{ t('error.news') }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>
