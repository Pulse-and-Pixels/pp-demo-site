<script setup lang="ts">
import type {DocumentRef, PathSegment, TestimonialBlock} from '~/types/sanity'

const props = defineProps<{block: TestimonialBlock; doc?: DocumentRef; path?: PathSegment[]; index?: number}>()

const testimonials = computed(() => props.block.testimonials?.filter(Boolean) ?? [])
const spotlight = computed(() => clean(props.block.layout) === 'spotlight')
const {t} = useI18n()
const active = ref(0)
const current = computed(() => testimonials.value[active.value] ?? testimonials.value[0])
const go = (step: number) => {
  const count = testimonials.value.length
  active.value = (active.value + step + count) % count
}
</script>

<template>
  <UiSection :background="block.background" v-slot="{dark}">
    <UiSectionHeader :eyebrow="block.eyebrow" :heading="block.heading" :intro="block.intro" align="center" />

    <div v-if="spotlight && current" class="mx-auto mt-12 max-w-4xl">
      <div aria-live="polite">
        <Transition
          mode="out-in"
          enter-active-class="transition duration-500 ease-out-soft"
          enter-from-class="opacity-0 translate-y-3"
          leave-active-class="transition duration-200"
          leave-to-class="opacity-0"
        >
          <CardsTestimonialCard :key="current._id" :testimonial="current" size="lg" :dark="dark" />
        </Transition>
      </div>
      <div v-if="testimonials.length > 1" class="mt-10 flex items-center justify-center gap-4">
        <button
          type="button"
          class="inline-flex size-11 items-center justify-center rounded-full ring-1 transition hover:-translate-x-0.5"
          :class="dark ? 'text-white ring-white/20 hover:bg-white/10' : 'text-ink-900 ring-ink-200 hover:bg-ink-50'"
          :aria-label="t('testimonials.previous')"
          @click="go(-1)"
        >
          ←
        </button>
        <div class="flex gap-2">
          <button
            v-for="(item, i) in testimonials"
            :key="item._id"
            type="button"
            class="h-2 rounded-full transition-all"
            :class="[i === active ? 'w-8 bg-brand-500' : 'w-2', i !== active && (dark ? 'bg-white/25' : 'bg-ink-200')]"
            :aria-label="t('testimonials.show', {index: i + 1, total: testimonials.length})"
            :aria-current="i === active ? 'true' : undefined"
            @click="active = i"
          />
        </div>
        <button
          type="button"
          class="inline-flex size-11 items-center justify-center rounded-full ring-1 transition hover:translate-x-0.5"
          :class="dark ? 'text-white ring-white/20 hover:bg-white/10' : 'text-ink-900 ring-ink-200 hover:bg-ink-50'"
          :aria-label="t('testimonials.next')"
          @click="go(1)"
        >
          →
        </button>
      </div>
    </div>

    <ul v-else class="mt-14 columns-1 gap-6 md:columns-2 lg:columns-3">
      <li v-for="testimonial in testimonials" :key="testimonial._id" class="mb-6 break-inside-avoid">
        <CardsTestimonialCard :testimonial="testimonial" :dark="dark" />
      </li>
    </ul>
  </UiSection>
</template>
