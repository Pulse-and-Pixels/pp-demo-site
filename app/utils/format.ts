import {stegaClean} from '@sanity/client/stega'

/** BCP 47 locale per site language, used for dates and prices. */
const intlLocales: Record<string, string> = {en: 'en-GB', nl: 'nl-NL'}
const intlLocale = (language?: string) => intlLocales[language ?? 'en'] ?? 'en-GB'

export function formatDate(value?: string | null, language?: string) {
  const clean = stegaClean(value)
  return clean
    ? new Intl.DateTimeFormat(intlLocale(language), {day: 'numeric', month: 'long', year: 'numeric'}).format(new Date(clean))
    : ''
}

export function formatPrice(amount?: number | null, currency?: string | null, language?: string) {
  if (typeof amount !== 'number') return ''
  return new Intl.NumberFormat(intlLocale(language), {
    style: 'currency',
    currency: stegaClean(currency) || 'EUR',
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount)
}

/** Strips stega so values can safely drive logic, classes and attributes. */
export function clean<T>(value: T) {
  return stegaClean(value)
}
