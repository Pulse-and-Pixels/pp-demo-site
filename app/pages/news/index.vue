<script setup lang="ts">
import {NEWS_PAGE_SIZE, newsOverviewQuery} from '~/queries/news'
import type {Category, ListingSettings, NewsCard} from '~/types/sanity'

interface NewsOverview {
  settings: ListingSettings | null
  categories: Category[]
  featured: NewsCard | null
  total: number
  items: NewsCard[]
}

const route = useRoute()
const {t} = useI18n()
const localePath = useLocalePath()

const currentPage = computed(() => Math.max(1, Number.parseInt(String(route.query.page ?? '1'), 10) || 1))
const category = computed(() => (typeof route.query.category === 'string' ? route.query.category : ''))

const params = reactive({category: '', start: 0, end: NEWS_PAGE_SIZE})
const syncParams = () => {
  params.category = category.value
  params.start = (currentPage.value - 1) * NEWS_PAGE_SIZE
  params.end = params.start + NEWS_PAGE_SIZE
}
syncParams()
watch(() => route.query, syncParams)

const {data, error, status} = await useContent<NewsOverview>(newsOverviewQuery, params)
if (error.value) throw createError({statusCode: 500, statusMessage: t('error.loadFailed'), fatal: true})

const pages = computed(() => Math.max(1, Math.ceil((data.value?.total ?? 0) / NEWS_PAGE_SIZE)))
const showFeatured = computed(() => currentPage.value === 1 && !category.value && data.value?.featured)
const activeCategory = computed(() => data.value?.categories.find((c) => clean(c.slug) === category.value))

const filters = computed(() => [
  {key: 'all', title: t('common.all'), to: {query: {}}, active: !category.value},
  ...(data.value?.categories ?? []).map((c) => ({
    key: c._id,
    title: c.title,
    to: {query: {category: clean(c.slug)}},
    active: clean(c.slug) === category.value,
  })),
])

usePageSeo(() => {
  const settings = data.value?.settings
  const base = clean(settings?.title) ?? t('news.fallbackTitle')
  const variant = Boolean(activeCategory.value) || currentPage.value > 1
  const title = [
    activeCategory.value ? `${clean(activeCategory.value.title)} – ${base}` : base,
    currentPage.value > 1 ? t('pagination.page', {page: currentPage.value}) : '',
  ]
    .filter(Boolean)
    .join(' · ')
  // Filtered and paginated views get their own title instead of the overview's meta title
  return {title, description: settings?.intro, seo: variant ? {...settings?.seo, metaTitle: undefined} : settings?.seo}
})
</script>

<template>
  <div>
    <UiPageIntro :title="data?.settings?.title ?? t('news.fallbackTitle')" :intro="data?.settings?.intro">
      <UiFilterPills v-if="data?.categories?.length" :label="t('common.filterByCategory')" :items="filters" class="mt-10" />
    </UiPageIntro>

    <div class="container-page py-14 lg:py-20">
      <div v-if="showFeatured && data?.featured" class="mb-12">
        <h2 class="sr-only">{{ t('news.featuredArticle') }}</h2>
        <CardsNewsCard :article="data.featured" variant="large" heading-level="h3" priority />
      </div>

      <section id="articles" aria-labelledby="articles-heading" class="scroll-mt-28">
        <h2 id="articles-heading" class="sr-only">
          {{ activeCategory ? t('news.articlesIn', {category: activeCategory.title}) : t('news.allArticles') }}
        </h2>
        <ul
          v-if="data?.items?.length"
          class="grid gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3"
          :class="status === 'pending' && 'opacity-50'"
          :aria-busy="status === 'pending'"
        >
          <li v-for="article in data.items" :key="article._id">
            <CardsNewsCard :article="article" />
          </li>
        </ul>
        <UiEmptyState v-else :title="t('news.noneTitle')" :text="t('news.noneText')">
          <NuxtLink :to="localePath('news')" class="font-semibold text-brand-600 hover:text-brand-700">{{ t('news.viewAll') }}</NuxtLink>
        </UiEmptyState>
      </section>

      <UiPagination :page="currentPage" :pages="pages" hash="#articles" class="mt-14" />
    </div>
  </div>
</template>
