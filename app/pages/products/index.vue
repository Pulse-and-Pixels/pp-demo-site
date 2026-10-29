<script setup lang="ts">
import {Search, X} from '@lucide/vue'
import {productsOverviewQuery} from '~/queries/products'
import type {Category, ListingSettings, ProductCard} from '~/types/sanity'

interface ProductsOverview {
  settings: ListingSettings | null
  categories: Category[]
  items: ProductCard[]
}

const route = useRoute()
const router = useRouter()

const category = computed(() => (typeof route.query.category === 'string' ? route.query.category : ''))
const searchTerm = computed(() => (typeof route.query.q === 'string' ? route.query.q.trim() : ''))

/** GROQ `match` works on whole words; a trailing wildcard gives search-as-you-type behaviour. */
const toMatch = (term: string) =>
  term
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => `${word.replace(/[*"]/g, '')}*`)
    .join(' ')

const params = reactive({category: '', search: ''})
const syncParams = () => {
  params.category = category.value
  params.search = toMatch(searchTerm.value)
}
syncParams()
watch(() => route.query, syncParams)

const {data, error, status} = await useContent<ProductsOverview>(productsOverviewQuery, params)
if (error.value) throw createError({statusCode: 500, statusMessage: 'Products could not be loaded', fatal: true})

// Search input updates the URL (debounced) so results are shareable
const input = ref(searchTerm.value)
let timer: ReturnType<typeof setTimeout> | undefined
watch(input, (value) => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    router.replace({query: {...route.query, q: value.trim() || undefined}})
  }, 250)
})
watch(searchTerm, (value) => {
  if (value !== input.value.trim()) input.value = value
})
onBeforeUnmount(() => clearTimeout(timer))

const activeCategory = computed(() => data.value?.categories.find((c) => clean(c.slug) === category.value))
const filters = computed(() => [
  {key: 'all', title: 'All products', to: {query: {q: route.query.q}}, active: !category.value},
  ...(data.value?.categories ?? []).map((c) => ({
    key: c._id,
    title: c.title,
    to: {query: {q: route.query.q, category: clean(c.slug)}},
    active: clean(c.slug) === category.value,
  })),
])

const resultLabel = computed(() => {
  const count = data.value?.items.length ?? 0
  const noun = count === 1 ? 'product' : 'products'
  return searchTerm.value ? `${count} ${noun} matching “${searchTerm.value}”` : `${count} ${noun}`
})

usePageSeo(() => {
  const settings = data.value?.settings
  const base = clean(settings?.title) ?? 'Products'
  return activeCategory.value
    ? {title: `${clean(activeCategory.value.title)} – ${base}`, description: settings?.intro, seo: {...settings?.seo, metaTitle: undefined}}
    : {title: base, description: settings?.intro, seo: settings?.seo}
})
</script>

<template>
  <div>
    <UiPageIntro :title="data?.settings?.title ?? 'Products'" :intro="data?.settings?.intro">
      <div class="mt-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <UiFilterPills v-if="data?.categories?.length" label="Filter by category" :items="filters" />
        <form role="search" class="relative w-full lg:max-w-xs" action="/products" @submit.prevent>
          <label for="product-search" class="sr-only">Search products</label>
          <Search class="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
          <input
            id="product-search"
            v-model="input"
            name="q"
            type="search"
            autocomplete="off"
            placeholder="Search products"
            class="w-full rounded-full border-0 bg-white py-2.5 pr-10 pl-10 text-sm text-ink-900 ring-1 ring-ink-200 transition placeholder:text-ink-400 focus:ring-2 focus:ring-brand-500 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          <input v-if="category" type="hidden" name="category" :value="category" />
          <button
            v-if="input"
            type="button"
            class="absolute top-1/2 right-2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-500 hover:bg-ink-100"
            @click="input = ''"
          >
            <X class="size-4" aria-hidden="true" /><span class="sr-only">Clear search</span>
          </button>
        </form>
      </div>
    </UiPageIntro>

    <section class="container-page py-14 lg:py-20" aria-labelledby="results-heading">
      <h2 id="results-heading" class="text-sm font-medium text-ink-500" aria-live="polite">{{ resultLabel }}</h2>
      <ul
        v-if="data?.items?.length"
        class="mt-6 grid gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        :class="status === 'pending' && 'opacity-50'"
        :aria-busy="status === 'pending'"
      >
        <li v-for="product in data.items" :key="product._id">
          <CardsProductCard :product="product" />
        </li>
      </ul>
      <UiEmptyState v-else class="mt-6" title="No products found" text="Try another search term or category.">
        <NuxtLink to="/products" class="font-semibold text-brand-600 hover:text-brand-700">Clear filters →</NuxtLink>
      </UiEmptyState>
    </section>
  </div>
</template>
