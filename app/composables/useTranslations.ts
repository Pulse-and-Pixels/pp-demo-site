import {routeTranslationsQuery} from '~/queries/translations'
import type {Translation} from '~/types/sanity'

/** Route names (without locale suffix) that show a single document, and that document's type. */
const documentRoutes: Record<string, string> = {
  'index': 'page',
  'slug': 'page',
  'news-slug': 'newsArticle',
  'products-slug': 'product',
}

/** Languages that have no version of the current page; the switcher sends those to their homepage. */
export const useMissingTranslations = () => useState<string[]>('missing-translations', () => [])

/**
 * Looks up the translations of the document on the current route and hands their
 * slugs to @nuxtjs/i18n, so the language switcher and hreflang links point at
 * e.g. /news/designing-for-calm ↔ /nl/nieuws/ontwerpen-voor-rust.
 *
 * Called from the layout, so it resolves before the header renders on the server.
 */
export async function useRouteTranslations() {
  const route = useRoute()
  const getRouteBaseName = useRouteBaseName()
  const setI18nParams = useSetI18nParams()
  const {locales} = useI18n()
  const missing = useMissingTranslations()

  const target = () => {
    const name = String(getRouteBaseName(route) ?? '')
    return {type: documentRoutes[name] ?? '', slug: name === 'index' ? 'home' : String(route.params.slug ?? '')}
  }
  const params = reactive(target())
  watch(() => route.fullPath, () => Object.assign(params, target()))

  const {data} = await useContent<Translation[] | null>(routeTranslationsQuery, params)

  const apply = () => {
    if (!params.type) {
      missing.value = []
      return
    }
    const available = (clean(data.value) ?? []).filter((t) => t.slug)
    if (params.slug !== 'home') setI18nParams(Object.fromEntries(available.map((t) => [t.language, {slug: t.slug}])))
    missing.value = locales.value.map((l) => l.code).filter((code) => !available.some((t) => t.language === code))
  }
  apply()
  watch(data, apply)
}
