<script setup lang="ts">
import type {NewsCard} from '~/types/sanity'

const props = withDefaults(
  defineProps<{article: NewsCard; variant?: 'card' | 'large' | 'list'; headingLevel?: 'h2' | 'h3'; priority?: boolean}>(),
  {variant: 'card', headingLevel: 'h3'},
)

const editAttr = useEditAttr()
const href = computed(() => documentHref('newsArticle', props.article.slug))
const date = computed(() => formatDate(props.article.publishedAt))
</script>

<template>
  <article
    class="group relative flex h-full overflow-hidden rounded-card bg-white ring-1 ring-ink-100 transition duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-card-hover"
    :class="{
      'flex-col': variant === 'card',
      'flex-col lg:grid lg:grid-cols-2': variant === 'large',
      'flex-row items-stretch': variant === 'list',
    }"
  >
    <div
      class="relative overflow-hidden bg-ink-100"
      :class="{
        'aspect-[16/10]': variant === 'card',
        'aspect-[16/10] lg:aspect-auto lg:min-h-80': variant === 'large',
        'w-32 shrink-0 sm:w-48': variant === 'list',
      }"
      :data-sanity="editAttr(article, 'heroImage')"
    >
      <UiMediaImage
        :image="article.heroImage"
        :aspect="variant === 'list' ? 4 / 3 : 16 / 10"
        :sizes="variant === 'large' ? '100vw lg:50vw' : variant === 'list' ? '200px' : '100vw sm:50vw lg:33vw'"
        :priority="priority"
        img-class="size-full object-cover transition duration-700 ease-out-soft group-hover:scale-105"
      />
    </div>
    <div class="flex flex-1 flex-col" :class="variant === 'large' ? 'p-6 sm:p-10 lg:justify-center' : 'p-5 sm:p-6'">
      <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-ink-500">
        <time v-if="article.publishedAt" :datetime="clean(article.publishedAt)">{{ date }}</time>
        <template v-for="category in article.categories" :key="category._id">
          <span aria-hidden="true" class="text-ink-300">•</span>
          <span class="text-brand-600">{{ category.title }}</span>
        </template>
      </div>
      <component
        :is="headingLevel"
        class="mt-3 font-semibold text-balance"
        :class="variant === 'large' ? 'text-2xl sm:text-3xl' : 'text-lg leading-snug'"
      >
        <NuxtLink :to="href" class="after:absolute after:inset-0 focus-visible:outline-none">{{ article.title }}</NuxtLink>
      </component>
      <p
        v-if="article.excerpt && variant !== 'list'"
        class="mt-3 text-ink-500"
        :class="variant === 'large' ? 'text-lg' : 'line-clamp-3 text-sm'"
      >
        {{ article.excerpt }}
      </p>
      <p v-if="article.author && variant !== 'list'" class="mt-auto pt-5 text-sm font-medium text-ink-700">
        {{ article.author.name }}
      </p>
    </div>
  </article>
</template>
