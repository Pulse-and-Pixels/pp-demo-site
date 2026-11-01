<script setup lang="ts">
import {ChevronRight} from '@lucide/vue'
import {productQuery} from '~/queries/products'
import type {Product, ProductCard} from '~/types/sanity'

type ProductWithRelated = Product & {related: ProductCard[]; others: ProductCard[]}

const route = useRoute()
const {t, locale} = useI18n()
const localePath = useLocalePath()
const {data: product, error} = await useContent<ProductWithRelated>(productQuery, {slug: String(route.params.slug)})
assertContent(product.value, error.value, 'Product')

const {data: settings} = useSiteSettings()
const editAttr = useEditAttr()
useDocumentTranslations(() => product.value?.translations)

const images = computed(() => product.value?.images?.filter((image) => image.asset) ?? [])
const activeIndex = ref(0)
const activeImage = computed(() => images.value[activeIndex.value] ?? images.value[0])
const cta = computed(() => (product.value?.cta?.link ? product.value.cta : settings.value?.productCta))

const related = computed(() => {
  const seen = new Set<string>()
  return [...(product.value?.related ?? []), ...(product.value?.others ?? [])]
    .filter((item) => !seen.has(item._id) && seen.add(item._id))
    .slice(0, 4)
})

usePageSeo(() =>
  product.value
    ? {
        title: product.value.name,
        description: product.value.shortDescription,
        seo: product.value.seo,
        image: product.value.images?.[0],
        type: 'product',
      }
    : null,
)

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: () =>
        JSON.stringify(
          clean({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.value?.name,
            description: product.value?.shortDescription,
            offers: {
              '@type': 'Offer',
              price: product.value?.price,
              priceCurrency: product.value?.currency ?? 'EUR',
            },
          }),
        ),
    },
  ],
})
</script>

<template>
  <div v-if="product">
    <nav :aria-label="t('products.breadcrumb')" class="border-b border-ink-100">
      <ol class="container-page flex items-center gap-2 py-4 text-sm text-ink-500">
        <li><NuxtLink :to="localePath('products')" class="hover:text-brand-600">{{ t('products.fallbackTitle') }}</NuxtLink></li>
        <template v-if="product.categories?.[0]">
          <li aria-hidden="true"><ChevronRight class="size-4" /></li>
          <li>
            <NuxtLink :to="localePath({name: 'products', query: {category: clean(product.categories[0].slug)}})" class="hover:text-brand-600">
              {{ product.categories[0].title }}
            </NuxtLink>
          </li>
        </template>
        <li aria-hidden="true"><ChevronRight class="size-4" /></li>
        <li aria-current="page" class="truncate font-medium text-ink-900">{{ product.name }}</li>
      </ol>
    </nav>

    <section class="container-page grid gap-12 py-12 lg:grid-cols-2 lg:gap-16 lg:py-16">
      <!-- Gallery -->
      <div class="lg:sticky lg:top-28 lg:self-start">
        <div
          v-if="activeImage"
          class="relative overflow-hidden rounded-panel bg-ink-50"
          :data-sanity="editAttr(product, ['images', {_key: activeImage._key}])"
        >
          <UiMediaImage
            :key="activeImage._key"
            :image="activeImage"
            :aspect="1"
            :priority="activeIndex === 0"
            sizes="100vw lg:50vw"
            img-class="aspect-square w-full animate-[fade-up_0.4s_ease-out] object-cover"
          />
          <span
            v-if="product.badge || product.featured"
            class="absolute top-5 left-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink-900 shadow-sm backdrop-blur"
          >
            {{ product.badge || t('common.featured') }}
          </span>
        </div>
        <ul v-if="images.length > 1" class="mt-4 grid grid-cols-4 gap-3" :aria-label="t('products.images')">
          <li v-for="(image, index) in images" :key="image._key">
            <button
              type="button"
              class="block w-full overflow-hidden rounded-xl ring-2 transition"
              :class="index === activeIndex ? 'ring-brand-500' : 'ring-transparent opacity-70 hover:opacity-100'"
              :aria-label="t('products.showImage', {index: index + 1, total: images.length})"
              :aria-pressed="index === activeIndex"
              @click="activeIndex = index"
            >
              <UiMediaImage :image="image" :aspect="1" sizes="120px" alt="" img-class="aspect-square w-full object-cover" />
            </button>
          </li>
        </ul>
      </div>

      <!-- Details -->
      <div>
        <p v-if="product.categories?.length" class="text-sm font-semibold tracking-wider text-brand-600 uppercase">
          {{ product.categories.map((c) => c.title).join(' · ') }}
        </p>
        <h1 class="mt-3 text-4xl font-extrabold text-balance sm:text-5xl">{{ product.name }}</h1>
        <p v-if="product.tagline" class="mt-3 font-display text-xl text-ink-500">{{ product.tagline }}</p>
        <p class="mt-8 font-display text-3xl font-bold text-ink-950">{{ formatPrice(product.price, product.currency, locale) }}</p>
        <p v-if="product.shortDescription" class="mt-6 text-lg leading-relaxed text-ink-600">{{ product.shortDescription }}</p>
        <div v-if="cta?.link" class="mt-8">
          <UiCtaButton :cta="cta" size="lg" />
        </div>

        <div v-if="product.specifications?.length" class="mt-12">
          <h2 class="text-xl font-bold">{{ t('products.specifications') }}</h2>
          <dl class="mt-4 divide-y divide-ink-100 border-y border-ink-100">
            <div v-for="spec in product.specifications" :key="spec._key" class="grid grid-cols-5 gap-4 py-3.5 text-sm">
              <dt class="col-span-2 font-medium text-ink-500">{{ spec.label }}</dt>
              <dd class="col-span-3 text-ink-900">{{ spec.value }}</dd>
            </div>
          </dl>
        </div>

        <div v-if="product.description?.length" class="mt-12">
          <h2 class="text-xl font-bold">{{ t('products.about', {name: product.name}) }}</h2>
          <UiRichText :value="product.description" class="mt-4 prose-base" />
        </div>
      </div>
    </section>

    <section v-if="related.length" class="bg-ink-50 section-y" aria-labelledby="related-heading">
      <div class="container-page">
        <h2 id="related-heading" class="text-3xl font-bold sm:text-4xl">{{ t('products.related') }}</h2>
        <ul class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <li v-for="item in related" :key="item._id"><CardsProductCard :product="item" /></li>
        </ul>
      </div>
    </section>
  </div>
</template>
