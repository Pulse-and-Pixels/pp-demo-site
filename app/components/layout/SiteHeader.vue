<script setup lang="ts">
import {Menu, X} from '@lucide/vue'
import type {SiteSettings} from '~/types/sanity'

const props = defineProps<{settings?: SiteSettings | null}>()

const route = useRoute()
const {t} = useI18n()
const localePath = useLocalePath()
const editAttr = useEditAttr()
const open = ref(false)
const scrolled = ref(false)
const settingsDoc = computed(() => (props.settings ? {_id: props.settings._id, _type: 'siteSettings'} : null))

const isActive = (href?: string) => {
  if (!href || href === '/' || href === localePath('/')) return route.path === href
  return route.path === href || route.path.startsWith(`${href.split('?')[0]}/`)
}

watch(() => route.fullPath, () => (open.value = false))

const onScroll = () => (scrolled.value = window.scrollY > 8)
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, {passive: true})
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') open.value = false
}
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b transition duration-300"
    :class="scrolled || open ? 'border-ink-100 bg-white/85 backdrop-blur-xl' : 'border-transparent bg-white'"
    @keydown="onKeydown"
  >
    <div class="container-page flex h-18 items-center justify-between gap-6">
      <NuxtLink :to="localePath('/')" class="rounded-lg" :aria-label="t('a11y.home', {site: clean(settings?.siteName) ?? 'Northstar'})">
        <LayoutSiteLogo :name="settings?.siteName" />
      </NuxtLink>

      <nav :aria-label="t('a11y.mainNav')" class="hidden lg:block" :data-sanity="editAttr(settingsDoc, 'mainNavigation')">
        <ul class="flex items-center gap-1">
          <li v-for="item in settings?.mainNavigation" :key="item._key">
            <UiSmartLink
              :link="item"
              class="rounded-full px-4 py-2 text-sm font-medium transition"
              :class="isActive(resolveHref(item)) ? 'bg-ink-50 text-ink-950' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-950'"
              :aria-current="isActive(resolveHref(item)) ? 'page' : undefined"
            />
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-3">
        <LayoutLanguageSwitcher class="hidden sm:block" />
        <div v-if="settings?.headerCta?.link" class="hidden sm:block">
          <UiCtaButton :cta="settings.headerCta" />
        </div>
        <button
          type="button"
          class="inline-flex size-11 items-center justify-center rounded-full text-ink-900 ring-1 ring-ink-200 lg:hidden"
          :aria-expanded="open"
          aria-controls="mobile-menu"
          @click="open = !open"
        >
          <span class="sr-only">{{ open ? t('a11y.closeMenu') : t('a11y.openMenu') }}</span>
          <X v-if="open" class="size-5" aria-hidden="true" />
          <Menu v-else class="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-300 ease-out-soft"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0"
    >
      <nav v-show="open" id="mobile-menu" :aria-label="t('a11y.mobileNav')" class="border-t border-ink-100 bg-white lg:hidden">
        <ul class="container-page flex flex-col gap-1 py-4">
          <li v-for="item in settings?.mainNavigation" :key="item._key">
            <UiSmartLink
              :link="item"
              class="block rounded-xl px-4 py-3 text-base font-medium"
              :class="isActive(resolveHref(item)) ? 'bg-ink-50 text-ink-950' : 'text-ink-700 hover:bg-ink-50'"
              :aria-current="isActive(resolveHref(item)) ? 'page' : undefined"
            />
          </li>
          <li class="mt-2 px-4 sm:hidden"><LayoutLanguageSwitcher block /></li>
          <li v-if="settings?.headerCta?.link" class="mt-2 px-4 sm:hidden">
            <UiCtaButton :cta="settings.headerCta" class="w-full" />
          </li>
        </ul>
      </nav>
    </Transition>
  </header>
</template>
