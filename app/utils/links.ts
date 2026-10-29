import {stegaClean} from '@sanity/client/stega'
import type {InternalTarget, Link} from '~/types/sanity'

const HOME_SLUG = 'home'

/** The site URL for a document of a given type. */
export function documentHref(type: InternalTarget['_type'] | string, slug?: string | null): string {
  const clean = stegaClean(slug)
  if (!clean) return '/'
  switch (type) {
    case 'newsArticle':
      return `/news/${clean}`
    case 'product':
      return `/products/${clean}`
    default:
      return clean === HOME_SLUG ? '/' : `/${clean}`
  }
}

/** Resolves a Sanity link object to an href. Values are stega-cleaned so they are safe in attributes. */
export function resolveHref(link?: Link | null): string | undefined {
  if (!link) return undefined
  const {linkType, internal, path, url} = stegaClean(link)
  if (linkType === 'external') return url || undefined
  if (linkType === 'path') return path || undefined
  return internal ? documentHref(internal._type, internal.slug) : undefined
}

export const isExternalHref = (href: string) => /^(https?:|mailto:|tel:)/.test(href)
