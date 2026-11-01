import {
  imageFields,
  newsCardFields,
  newsCategoryFields,
  publishedNews,
  richTextFields,
  seoFields,
} from './fragments'

export const NEWS_PAGE_SIZE = 6

const inCategory = /* groq */ `($category == "" || $category in categories[]->slug.current)`
const latestFeaturedId = /* groq */ `*[${publishedNews} && featured == true] | order(publishedAt desc)[0]._id`

/**
 * News overview. Without a category filter, the latest featured article is
 * shown as a hero and left out of the paginated list.
 */
export const newsOverviewQuery = /* groq */ `{
  "settings": *[_type == "siteSettings" && language == $language][0]{_id, ...newsPage{title, intro, seo${seoFields}}},
  "categories": *[_type == "newsCategory" && language == $language && count(*[${publishedNews} && references(^._id)]) > 0] | order(title asc)${newsCategoryFields},
  "featured": select($category == "" => *[${publishedNews} && featured == true] | order(publishedAt desc)[0]${newsCardFields}),
  "total": count(*[${publishedNews} && ${inCategory} && !($category == "" && _id == ${latestFeaturedId})]),
  "items": *[${publishedNews} && ${inCategory} && !($category == "" && _id == ${latestFeaturedId})] | order(publishedAt desc)[$start...$end]${newsCardFields}
}`

export const newsArticleQuery = /* groq */ `*[${publishedNews} && slug.current == $slug][0]{
  _id,
  _type,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  featured,
  heroImage{${imageFields}},
  body[]${richTextFields},
  "categories": categories[]->${newsCategoryFields},
  "author": author->{_id, _type, name, role, bio, image{${imageFields}}},
  seo${seoFields},
  "related": *[${publishedNews} && _id != ^._id && references(^.categories[]._ref)] | order(publishedAt desc)[0...3]${newsCardFields},
  "latest": *[${publishedNews} && _id != ^._id] | order(publishedAt desc)[0...3]${newsCardFields}
}`
