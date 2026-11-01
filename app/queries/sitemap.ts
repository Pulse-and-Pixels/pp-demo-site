const routable = /* groq */ `defined(slug.current) && defined(language) && seo.noIndex != true`

/** Every public URL in every language, with its last modification date. */
export const sitemapQuery = /* groq */ `{
  "documents": *[_type in ["page", "newsArticle", "product"] && ${routable}]{_type, language, "slug": slug.current, _updatedAt},
  "siteUrl": *[_type == "siteSettings" && language == "en"][0].siteUrl
}`
