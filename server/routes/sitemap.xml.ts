import {sitemapQuery} from '../../app/queries/sitemap'

interface SitemapEntry {
  slug: string
  _updatedAt: string
}

interface SitemapData {
  pages: SitemapEntry[]
  news: SitemapEntry[]
  products: SitemapEntry[]
  siteUrl?: string
}

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (c) => ({'<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;'})[c]!)

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  // Always published content from the CDN, never drafts
  const data = await useSanity()
    .client.withConfig({perspective: 'published', useCdn: true, stega: false, token: undefined})
    .fetch<SitemapData>(sitemapQuery)

  const base = (data.siteUrl || config.public.siteUrl).replace(/\/$/, '')
  const entries = [
    ...data.pages.map((p) => ({loc: p.slug === 'home' ? '/' : `/${p.slug}`, lastmod: p._updatedAt})),
    {loc: '/news'},
    ...data.news.map((p) => ({loc: `/news/${p.slug}`, lastmod: p._updatedAt})),
    {loc: '/products'},
    ...data.products.map((p) => ({loc: `/products/${p.slug}`, lastmod: p._updatedAt})),
  ]

  const urls = entries
    .map(
      ({loc, lastmod}: {loc: string; lastmod?: string}) =>
        `  <url><loc>${escapeXml(base + loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`,
    )
    .join('\n')

  setResponseHeaders(event, {
    'content-type': 'application/xml; charset=utf-8',
    'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
  })
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
})
