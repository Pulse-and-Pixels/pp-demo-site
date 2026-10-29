import {stegaClean} from '@sanity/client/stega'

const dateFormatter = new Intl.DateTimeFormat('en-GB', {day: 'numeric', month: 'long', year: 'numeric'})

export function formatDate(value?: string | null) {
  const clean = stegaClean(value)
  return clean ? dateFormatter.format(new Date(clean)) : ''
}

export function formatPrice(amount?: number | null, currency?: string | null) {
  if (typeof amount !== 'number') return ''
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: stegaClean(currency) || 'EUR',
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount)
}

/** Strips stega so values can safely drive logic, classes and attributes. */
export function clean<T>(value: T) {
  return stegaClean(value)
}
