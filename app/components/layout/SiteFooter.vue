<script setup lang="ts">
import {ArrowUpRight, Mail, MapPin, Phone} from '@lucide/vue'
import type {SiteSettings} from '~/types/sanity'

const props = defineProps<{settings?: SiteSettings | null}>()

const editAttr = useEditAttr()
const year = new Date().getFullYear()
const settingsDoc = computed(() => (props.settings ? {_id: props.settings._id, _type: 'siteSettings'} : null))
const platformLabels: Record<string, string> = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  x: 'X',
  github: 'GitHub',
  youtube: 'YouTube',
  dribbble: 'Dribbble',
}
</script>

<template>
  <footer class="relative overflow-hidden bg-ink-950 text-ink-300">
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 bg-soft-gradient opacity-50" />
    <div class="container-page relative py-16 lg:py-20">
      <div class="grid gap-12 lg:grid-cols-12">
        <div class="lg:col-span-4">
          <NuxtLink to="/" class="inline-block rounded-lg">
            <LayoutSiteLogo :name="settings?.siteName" dark />
          </NuxtLink>
          <p v-if="settings?.tagline" class="mt-5 font-display text-lg text-white">{{ settings.tagline }}</p>
          <p v-if="settings?.footerText" class="mt-3 max-w-sm text-sm leading-relaxed text-ink-400">{{ settings.footerText }}</p>

          <address v-if="settings?.contact" class="mt-8 space-y-3 text-sm not-italic">
            <a v-if="settings.contact.email" :href="`mailto:${clean(settings.contact.email)}`" class="flex items-center gap-3 hover:text-white">
              <Mail class="size-4 text-accent-400" aria-hidden="true" />{{ settings.contact.email }}
            </a>
            <a v-if="settings.contact.phone" :href="`tel:${clean(settings.contact.phone)?.replace(/\s/g, '')}`" class="flex items-center gap-3 hover:text-white">
              <Phone class="size-4 text-accent-400" aria-hidden="true" />{{ settings.contact.phone }}
            </a>
            <p v-if="settings.contact.address" class="flex gap-3 whitespace-pre-line">
              <MapPin class="mt-0.5 size-4 shrink-0 text-accent-400" aria-hidden="true" />{{ settings.contact.address }}
            </p>
          </address>
        </div>

        <nav
          aria-label="Footer"
          class="grid gap-10 sm:grid-cols-3 lg:col-span-7 lg:col-start-6"
          :data-sanity="editAttr(settingsDoc, 'footerNavigation')"
        >
          <div v-for="column in settings?.footerNavigation" :key="column._key">
            <h2 class="font-display text-sm font-semibold tracking-wider text-white uppercase">{{ column.title }}</h2>
            <ul class="mt-5 space-y-3">
              <li v-for="link in column.links" :key="link._key">
                <UiSmartLink :link="link" class="text-sm transition hover:text-white" />
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div class="mt-16 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-ink-400">© {{ year }} {{ settings?.copyright }}</p>
        <ul v-if="settings?.socialLinks?.length" class="flex flex-wrap gap-2" :data-sanity="editAttr(settingsDoc, 'socialLinks')">
          <li v-for="social in settings.socialLinks" :key="social._key">
            <a
              :href="clean(social.url)"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-white/15 transition hover:bg-white/10 hover:text-white"
            >
              {{ platformLabels[clean(social.platform)] ?? social.platform }}
              <ArrowUpRight class="size-3.5" aria-hidden="true" />
              <span class="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
