import {
  ctaFields,
  imageFields,
  productCardFields,
  productCategoryFields,
  publishedProducts,
  richTextFields,
  seoFields,
} from './fragments'

/** Products overview with optional category filter and free-text search. */
export const productsOverviewQuery = /* groq */ `{
  "settings": *[_type == "siteSettings" && language == $language][0]{_id, ...productsPage{title, intro, seo${seoFields}}},
  "categories": *[_type == "productCategory" && language == $language && count(*[${publishedProducts} && references(^._id)]) > 0] | order(name asc)${productCategoryFields},
  "items": *[
    ${publishedProducts}
    && ($category == "" || $category in categories[]->slug.current)
    && ($search == "" || [name, tagline, shortDescription, categories[]->name] match $search)
  ] | order(featured desc, name asc)${productCardFields}
}`

export const productQuery = /* groq */ `*[${publishedProducts} && slug.current == $slug][0]{
  _id,
  _type,
  name,
  "slug": slug.current,
  tagline,
  shortDescription,
  description[]${richTextFields},
  images[]{_key, ${imageFields}},
  price,
  currency,
  featured,
  badge,
  "categories": categories[]->${productCategoryFields},
  specifications[]{_key, label, value},
  cta${ctaFields},
  seo${seoFields},
  "related": *[${publishedProducts} && _id != ^._id && references(^.categories[]._ref)] | order(featured desc, name asc)[0...4]${productCardFields},
  "others": *[${publishedProducts} && _id != ^._id] | order(featured desc, name asc)[0...4]${productCardFields}
}`
