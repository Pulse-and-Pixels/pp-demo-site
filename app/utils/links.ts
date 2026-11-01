import {stegaClean} from '@sanity/client/stega'
import type {InternalTarget, Link} from '~/types/sanity'

const HOME_SLUG = 'home'
const DEFAULT_LANGUAGE = 'en'

/** Route segments per language. Keep in sync with `i18n.pages` in nuxt.config.ts and the Studio's languages.ts. */
const routes: Record<string, {prefix: string; news: string; products: string}> = {
  en: {prefix: '', news: 'news', products: 'products'},
  nl: {prefix: '/nl', news: 'nieuws', products: 'producten'},
}

const routesFor = (language?: string | null) => routes[stegaClean(language) ?? DEFAULT_LANGUAGE] ?? routes.en!

/** The site URL for a document of a given type and language. */
export function documentHref(type: InternalTarget['_type'] | string, slug?: string | null, language?: string | null): string {
  const r = routesFor(language)
  const clean = stegaClean(slug)
  if (!clean) return r.prefix || '/'
  switch (type) {
    case 'newsArticle':
      return `${r.prefix}/${r.news}/${clean}`
    case 'product':
      return `${r.prefix}/${r.products}/${clean}`
    default:
      return clean === HOME_SLUG ? r.prefix || '/' : `${r.prefix}/${clean}`
  }
}

/** Resolves a Sanity link object to an href. Values are stega-cleaned so they are safe in attributes. */
export function resolveHref(link?: Link | null): string | undefined {
  if (!link) return undefined
  const {linkType, internal, path, url} = stegaClean(link)
  if (linkType === 'external') return url || undefined
  if (linkType === 'path') return path || undefined
  return internal ? documentHref(internal._type, internal.slug, internal.language) : undefined
}

export const isExternalHref = (href: string) => /^(https?:|mailto:|tel:)/.test(href)
