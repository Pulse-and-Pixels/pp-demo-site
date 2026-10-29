import type {QueryParams} from '@sanity/client'
import {siteSettingsQuery} from '~/queries/settings'
import type {SiteSettings} from '~/types/sanity'

/**
 * Fetches Sanity content with SSR + hydration via `useSanityQuery`.
 *
 * - Public visitors: published perspective from the API CDN (apicdn.sanity.io).
 * - Preview mode (valid preview cookie only): drafts perspective, authenticated
 *   server-side and uncached, with live updates inside the Presentation tool.
 */
export function useContent<T>(query: string, params?: QueryParams) {
  const preview = useIsPreview()
  return useSanityQuery<T>(query, params, {
    queryOptions: preview.value ? {useCdn: false} : {},
  })
}

export function useSiteSettings() {
  return useContent<SiteSettings>(siteSettingsQuery)
}

/** Throws a Nuxt error page for missing documents or failed requests. */
export function assertContent<T>(data: T | null | undefined, error: unknown, what = 'Page'): asserts data is T {
  if (error) {
    throw createError({statusCode: 500, statusMessage: 'Content could not be loaded', fatal: true})
  }
  if (!data) {
    throw createError({statusCode: 404, statusMessage: `${what} not found`, fatal: true})
  }
}
