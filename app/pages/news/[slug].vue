<script setup lang="ts">
import {ArrowLeft} from '@lucide/vue'
import {newsArticleQuery} from '~/queries/news'
import type {NewsArticle, NewsCard} from '~/types/sanity'

type ArticleWithRelated = NewsArticle & {related: NewsCard[]; latest: NewsCard[]}

const route = useRoute()
const {t, locale} = useI18n()
const localePath = useLocalePath()
const {data: article, error} = await useContent<ArticleWithRelated>(newsArticleQuery, {slug: String(route.params.slug)})
assertContent(article.value, error.value, 'Article')

const editAttr = useEditAttr()
useDocumentTranslations(() => article.value?.translations)

// Same-category articles first, topped up with the latest ones
const related = computed(() => {
  const seen = new Set<string>()
  return [...(article.value?.related ?? []), ...(article.value?.latest ?? [])]
    .filter((item) => !seen.has(item._id) && seen.add(item._id))
    .slice(0, 3)
})

usePageSeo(() =>
  article.value
    ? {
        title: article.value.title,
        description: article.value.excerpt,
        seo: article.value.seo,
        image: article.value.heroImage,
        type: 'article',
        publishedTime: article.value.publishedAt,
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
            '@type': 'Article',
            headline: article.value?.title,
            description: article.value?.excerpt,
            datePublished: article.value?.publishedAt,
            author: article.value?.author ? {'@type': 'Person', name: article.value.author.name} : undefined,
          }),
        ),
    },
  ],
})
</script>

<template>
  <article v-if="article">
    <header class="relative overflow-hidden bg-soft-gradient">
      <div class="container-page pt-12 pb-10 sm:pt-16 lg:pt-20">
        <div class="mx-auto max-w-3xl animate-fade-up text-center">
          <NuxtLink :to="localePath('news')" class="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 transition hover:text-brand-600">
            <ArrowLeft class="size-4" aria-hidden="true" /> {{ t('news.back') }}
          </NuxtLink>
          <ul v-if="article.categories?.length" class="mt-8 flex flex-wrap justify-center gap-2">
            <li v-for="category in article.categories" :key="category._id">
              <NuxtLink
                :to="localePath({name: 'news', query: {category: clean(category.slug)}})"
                class="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100 transition hover:bg-brand-100"
              >
                {{ category.title }}
              </NuxtLink>
            </li>
          </ul>
          <h1 class="mt-5 text-4xl leading-tight font-extrabold text-balance sm:text-5xl lg:text-6xl">{{ article.title }}</h1>
          <p v-if="article.excerpt" class="mt-6 text-lg leading-relaxed text-ink-500 sm:text-xl">{{ article.excerpt }}</p>
          <div class="mt-8 flex items-center justify-center gap-3 text-sm text-ink-500">
            <div v-if="article.author?.image" class="size-10 overflow-hidden rounded-full" :data-sanity="editAttr(article.author, 'image')">
              <UiMediaImage :image="article.author.image" :aspect="1" sizes="40px" img-class="size-full object-cover" />
            </div>
            <p class="text-left">
              <span v-if="article.author" class="block font-semibold text-ink-900">{{ article.author.name }}</span>
              <time v-if="article.publishedAt" :datetime="clean(article.publishedAt)">{{ formatDate(article.publishedAt, locale) }}</time>
            </p>
          </div>
        </div>
      </div>
      <div class="container-page" :data-sanity="editAttr(article, 'heroImage')">
        <UiMediaImage
          :image="article.heroImage"
          :aspect="16 / 8"
          priority
          sizes="100vw xl:1280px"
          img-class="mx-auto w-full max-w-6xl rounded-panel shadow-card"
        />
      </div>
    </header>

    <div class="container-page py-14 lg:py-20">
      <UiRichText :value="article.body" class="mx-auto max-w-3xl" />

      <aside v-if="article.author?.bio" class="mx-auto mt-16 flex max-w-3xl gap-5 rounded-card bg-ink-50 p-6 sm:p-8" :aria-label="t('news.aboutAuthor')">
        <div v-if="article.author.image" class="size-16 shrink-0 overflow-hidden rounded-full">
          <UiMediaImage :image="article.author.image" :aspect="1" sizes="64px" img-class="size-full object-cover" />
        </div>
        <div>
          <p class="text-sm font-semibold tracking-wider text-brand-600 uppercase">{{ t('news.writtenBy') }}</p>
          <p class="mt-1 font-display text-lg font-semibold text-ink-950">{{ article.author.name }}</p>
          <p v-if="article.author.role" class="text-sm text-ink-500">{{ article.author.role }}</p>
          <p class="mt-3 leading-relaxed text-ink-600">{{ article.author.bio }}</p>
        </div>
      </aside>
    </div>

    <section v-if="related.length" class="bg-ink-50 section-y" aria-labelledby="related-heading">
      <div class="container-page">
        <h2 id="related-heading" class="text-3xl font-bold sm:text-4xl">{{ t('news.keepReading') }}</h2>
        <ul class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="item in related" :key="item._id"><CardsNewsCard :article="item" /></li>
        </ul>
      </div>
    </section>
  </article>
</template>
