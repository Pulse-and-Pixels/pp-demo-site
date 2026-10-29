<script setup lang="ts">
import type {ProductCard} from '~/types/sanity'

const props = withDefaults(defineProps<{product: ProductCard; compact?: boolean; headingLevel?: 'h2' | 'h3'}>(), {
  headingLevel: 'h3',
})

const editAttr = useEditAttr()
const href = computed(() => documentHref('product', props.product.slug))
</script>

<template>
  <article
    class="group relative flex h-full overflow-hidden rounded-card bg-white ring-1 ring-ink-100 transition duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-card-hover hover:ring-ink-200"
    :class="compact ? 'flex-row items-center gap-4 p-3' : 'flex-col'"
  >
    <div
      class="relative overflow-hidden bg-ink-50"
      :class="compact ? 'size-24 shrink-0 rounded-xl' : 'aspect-square'"
      :data-sanity="editAttr(product, 'images[0]')"
    >
      <UiMediaImage
        :image="product.image"
        :aspect="1"
        :sizes="compact ? '96px' : '100vw sm:50vw lg:33vw xl:25vw'"
        img-class="size-full object-cover transition duration-700 ease-out-soft group-hover:scale-105"
      />
      <span
        v-if="!compact && (product.badge || product.featured)"
        class="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink-900 shadow-sm backdrop-blur"
      >
        {{ product.badge || 'Featured' }}
      </span>
    </div>
    <div class="flex flex-1 flex-col" :class="compact ? 'py-1 pr-3' : 'p-5'">
      <p v-if="product.categories?.length" class="text-xs font-medium tracking-wide text-brand-600 uppercase">
        {{ product.categories.map((c) => c.title).join(' · ') }}
      </p>
      <component :is="headingLevel" class="mt-1 text-lg font-semibold">
        <NuxtLink :to="href" class="after:absolute after:inset-0 focus-visible:outline-none">
          {{ product.name }}
        </NuxtLink>
      </component>
      <p v-if="!compact && product.shortDescription" class="mt-2 line-clamp-2 text-sm text-ink-500">
        {{ product.shortDescription }}
      </p>
      <p class="mt-auto pt-4 font-display text-base font-semibold text-ink-950">
        {{ formatPrice(product.price, product.currency) }}
      </p>
    </div>
  </article>
</template>
