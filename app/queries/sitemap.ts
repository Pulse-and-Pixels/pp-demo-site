/** Every public URL with its last modification date. */
export const sitemapQuery = /* groq */ `{
  "pages": *[_type == "page" && defined(slug.current) && seo.noIndex != true]{"slug": slug.current, _updatedAt},
  "news": *[_type == "newsArticle" && defined(slug.current) && seo.noIndex != true]{"slug": slug.current, _updatedAt},
  "products": *[_type == "product" && defined(slug.current) && seo.noIndex != true]{"slug": slug.current, _updatedAt},
  "siteUrl": *[_type == "siteSettings"][0].siteUrl
}`
