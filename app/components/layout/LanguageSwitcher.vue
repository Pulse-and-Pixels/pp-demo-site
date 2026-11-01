<script setup lang="ts">
/** Links to the current page in every language; falls back to that language's homepage when there is no translation. */
withDefaults(defineProps<{block?: boolean}>(), {block: false})

const {locale, locales, t} = useI18n()
const route = useRoute()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()
const missing = useMissingTranslations()

const items = computed(() =>
  locales.value.map((l) => {
    const unavailable = missing.value.includes(l.code)
    return {
      code: l.code,
      name: l.name ?? l.code,
      active: l.code === locale.value,
      unavailable,
      // Filters such as ?category= use translated slugs, so they are not carried over
      href:
        l.code === locale.value
          ? route.path
          : unavailable
            ? localePath('/', l.code)
            : switchLocalePath(l.code).split('?')[0] || '/',
    }
  }),
)
</script>

<template>
  <nav :aria-label="t('a11y.language')">
    <ul class="flex items-center gap-0.5 rounded-full p-0.5 ring-1 ring-ink-200" :class="block && 'w-fit'">
      <li v-for="item in items" :key="item.code">
        <NuxtLink
          :to="item.href"
          :hreflang="item.code"
          :lang="item.code"
          :aria-current="item.active ? 'true' : undefined"
          :title="item.unavailable ? t('language.unavailable', {language: item.name}) : t('language.switchTo', {language: item.name})"
          class="inline-flex min-w-9 items-center justify-center rounded-full px-2.5 py-1.5 text-xs font-semibold tracking-wide uppercase transition"
          :class="item.active ? 'bg-ink-950 text-white' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-950'"
        >
          <span aria-hidden="true">{{ item.code }}</span>
          <span class="sr-only">{{ item.name }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
