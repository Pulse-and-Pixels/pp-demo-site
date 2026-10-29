/** Name of the httpOnly cookie set by @nuxtjs/sanity's /preview/enable route. */
const PREVIEW_COOKIE = 'sanity-preview-id'

const skip = /^\/(?:_nuxt|_ipx|_sanity|preview|__nuxt|api)\b|\.(?:xml|txt|ico|svg|png|jpg|js|css)$/

/**
 * Edge caching for server-rendered HTML. Published pages may be cached by a
 * CDN for a minute and served stale while revalidating. Preview sessions are
 * never cached, so drafts cannot leak into shared caches.
 */
export default defineEventHandler((event) => {
  if (import.meta.dev || event.method !== 'GET' || skip.test(event.path)) return

  if (getCookie(event, PREVIEW_COOKIE)) {
    setResponseHeader(event, 'cache-control', 'private, no-store')
  } else {
    setResponseHeader(event, 'cache-control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=600')
  }
  // Responses differ for editors with a preview cookie
  appendResponseHeader(event, 'vary', 'cookie')
})
