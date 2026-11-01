/** Slugs of every language version of the document shown on the current route. */
export const routeTranslationsQuery = /* groq */ `*[_type == $type && slug.current == $slug && language == $language][0]{
  "translations": *[_type == "translation.metadata" && references(^._id)][0].translations[]{
    language,
    "slug": value->slug.current
  }
}.translations`
