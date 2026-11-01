import type {Translation} from '~/types/sanity'

/** Languages that have no version of the current page; the switcher sends those to their homepage. */
export const useMissingTranslations = () => useState<string[]>('missing-translations', () => [])

/**
 * Tells the language switcher where the current document lives in other languages,
 * e.g. /news/designing-for-calm ↔ /nl/nieuws/ontwerpen-voor-rust.
 */
export function useDocumentTranslations(translations: () => Translation[] | null | undefined) {
  const setI18nParams = useSetI18nParams()
  const {locales} = useI18n()
  const missing = useMissingTranslations()

  const apply = () => {
    const available = (clean(translations()) ?? []).filter((t) => t.slug)
    setI18nParams(Object.fromEntries(available.map((t) => [t.language, {slug: t.slug}])))
    missing.value = locales.value.map((l) => l.code).filter((code) => !available.some((t) => t.language === code))
  }
  apply()
  watch(translations, apply)

  // Other pages have all languages again
  onBeforeRouteLeave(() => {
    missing.value = []
  })
}
