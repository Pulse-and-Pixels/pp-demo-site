/**
 * Reusable GROQ projections. Queries only ask for what components render,
 * and references are resolved here so Content Source Maps point clicks in
 * visual editing at the referenced document rather than the parent.
 */

export const imageFields = /* groq */ `asset, alt, caption, crop, hotspot, "lqip": asset->metadata.lqip`

export const linkFields = /* groq */ `
  label,
  linkType,
  path,
  url,
  openInNewTab,
  "internal": internal->{_type, "slug": slug.current}
`

export const ctaFields = /* groq */ `{_key, variant, link{${linkFields}}}`

export const richTextFields = /* groq */ `{
  ...,
  _type == "image" => {_type, _key, ${imageFields}},
  markDefs[]{
    ...,
    _type == "link" => {..., "internal": internal->{_type, "slug": slug.current}}
  }
}`

export const seoFields = /* groq */ `{metaTitle, metaDescription, canonicalUrl, noIndex, ogImage{${imageFields}}}`

export const newsCategoryFields = /* groq */ `{_id, title, "slug": slug.current}`
export const productCategoryFields = /* groq */ `{_id, "title": name, "slug": slug.current}`

export const newsCardFields = /* groq */ `{
  _id,
  _type,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  featured,
  heroImage{${imageFields}},
  "categories": categories[]->${newsCategoryFields},
  "author": author->{_id, name}
}`

export const productCardFields = /* groq */ `{
  _id,
  _type,
  name,
  "slug": slug.current,
  tagline,
  shortDescription,
  price,
  currency,
  featured,
  badge,
  "image": images[0]{${imageFields}},
  "categories": categories[]->${productCategoryFields}
}`

export const testimonialFields = /* groq */ `{_id, quote, name, role, company, rating, avatar{${imageFields}}}`

const publishedNews = /* groq */ `_type == "newsArticle" && defined(slug.current)`
const publishedProducts = /* groq */ `_type == "product" && defined(slug.current)`

/** Items for collection blocks: manual selection, featured, by category or latest. Trimmed to `limit` in the component. */
const productItems = /* groq */ `select(
  mode == "manual" => items[]->${productCardFields},
  mode == "featured" => *[${publishedProducts} && featured == true] | order(name asc)[0...12]${productCardFields},
  mode == "category" => *[${publishedProducts} && references(^.category._ref)] | order(name asc)[0...12]${productCardFields},
  *[${publishedProducts}] | order(_createdAt desc)[0...12]${productCardFields}
)`

const newsItems = /* groq */ `select(
  mode == "manual" => items[]->${newsCardFields},
  mode == "featured" => *[${publishedNews} && featured == true] | order(publishedAt desc)[0...12]${newsCardFields},
  mode == "category" => *[${publishedNews} && references(^.category._ref)] | order(publishedAt desc)[0...12]${newsCardFields},
  *[${publishedNews}] | order(publishedAt desc)[0...12]${newsCardFields}
)`

export const pageBuilderFields = /* groq */ `pageBuilder[]{
  ...,
  _type == "heroBlock" => {image{${imageFields}}, ctas[]${ctaFields}},
  _type == "richTextBlock" => {body[]${richTextFields}},
  _type == "imageTextBlock" => {body[]${richTextFields}, image{${imageFields}}, cta${ctaFields}},
  _type == "featureGridBlock" => {features[]{..., link{${linkFields}}}},
  _type == "productGridBlock" => {cta${ctaFields}, "items": ${productItems}},
  _type == "newsGridBlock" => {cta${ctaFields}, "items": ${newsItems}},
  _type == "testimonialBlock" => {"testimonials": testimonials[]->${testimonialFields}},
  _type == "ctaBlock" => {image{${imageFields}}, ctas[]${ctaFields}},
  _type == "faqBlock" => {items[]{_key, question, answer[]${richTextFields}}}
}`

export {publishedNews, publishedProducts}
