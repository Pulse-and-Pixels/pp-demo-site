import type {QueryParams} from '@sanity/client'
import {siteSettingsQuery} from '~/queries/settings'
import type {SiteSettings} from '~/types/sanity'

/**
 * Fetches Sanity content with SSR + hydration via `useSanityQuery`.
 * Every query gets a `$language` parameter that follows the current locale.
 *
 * - Public visitors: published perspective from the API CDN (apicdn.sanity.io).
 * - Preview mode (valid preview cookie only): drafts perspective, authenticated
 *   server-side and uncached, with live updates inside the Presentation tool.
 */
export function useContent<T>(query: string, params: QueryParams = {}) {
  const preview = useIsPreview()
  const {locale} = useI18n()

  const merged = reactive<QueryParams>({...params, language: locale.value})
  watch([locale, () => ({...params})], ([language, current]) => Object.assign(merged, current, {language}), {deep: true})

  return useSanityQuery<T>(query, merged, {
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
