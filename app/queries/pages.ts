import {pageBuilderFields, seoFields, translationsField} from './fragments'

export const HOME_SLUG = 'home'

/** A page and its page builder sections. The homepage is the page with slug "home". */
export const pageBySlugQuery = /* groq */ `*[_type == "page" && slug.current == $slug && language == $language][0]{
  _id,
  _type,
  language,
  title,
  "slug": slug.current,
  seo${seoFields},
  ${pageBuilderFields},
  ${translationsField}
}`
