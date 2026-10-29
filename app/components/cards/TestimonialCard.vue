<script setup lang="ts">
import type {Testimonial} from '~/types/sanity'

withDefaults(defineProps<{testimonial: Testimonial; size?: 'md' | 'lg'; dark?: boolean}>(), {size: 'md'})

const editAttr = useEditAttr()
</script>

<template>
  <figure
    class="flex h-full flex-col rounded-card p-7 transition duration-300"
    :class="[
      dark ? 'bg-white/5 ring-1 ring-white/10' : 'bg-white shadow-card ring-1 ring-ink-100',
      size === 'lg' && 'items-center p-0 text-center shadow-none ring-0 bg-transparent',
    ]"
  >
    <div v-if="testimonial.rating" class="flex gap-0.5 text-amber-400" :aria-label="`Rated ${clean(testimonial.rating)} out of 5`">
      <svg v-for="i in clean(testimonial.rating)" :key="i" class="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9l-5.3 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
      </svg>
    </div>
    <blockquote
      class="mt-4 flex-1 font-display text-balance"
      :class="[size === 'lg' ? 'text-2xl leading-snug font-medium sm:text-3xl' : 'text-lg leading-relaxed', dark ? 'text-white' : 'text-ink-900']"
    >
      <p>“{{ testimonial.quote }}”</p>
    </blockquote>
    <figcaption class="mt-6 flex items-center gap-3" :class="size === 'lg' && 'justify-center'">
      <div
        v-if="testimonial.avatar"
        class="size-12 shrink-0 overflow-hidden rounded-full ring-2 ring-white"
        :data-sanity="editAttr({_id: testimonial._id, _type: 'testimonial'}, 'avatar')"
      >
        <UiMediaImage :image="testimonial.avatar" :aspect="1" sizes="48px" img-class="size-full object-cover" />
      </div>
      <div class="text-left">
        <p class="font-semibold" :class="dark ? 'text-white' : 'text-ink-950'">{{ testimonial.name }}</p>
        <p class="text-sm" :class="dark ? 'text-ink-300' : 'text-ink-500'">
          {{ [testimonial.role, testimonial.company].filter(Boolean).join(', ') }}
        </p>
      </div>
    </figcaption>
  </figure>
</template>
