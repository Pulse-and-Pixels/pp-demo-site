import {documentHref} from '../../app/utils/links'
import {sitemapQuery} from '../../app/queries/sitemap'

interface SitemapData {
  documents: {_type: string; language: string; slug: string; _updatedAt: string}[]
  siteUrl?: string
}

const languages = ['en', 'nl'] as const
const listings = {en: ['/news', '/products'], nl: ['/nl/nieuws', '/nl/producten']}

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
    ...data.documents.map((doc) => ({loc: documentHref(doc._type, doc.slug, doc.language), lastmod: doc._updatedAt})),
    ...languages.flatMap((lang) => listings[lang].map((loc) => ({loc, lastmod: undefined}))),
  ]

  const urls = entries
    .map(({loc, lastmod}) => `  <url><loc>${escapeXml(base + loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`)
    .join('\n')

  setResponseHeaders(event, {
    'content-type': 'application/xml; charset=utf-8',
    'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
  })
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
})
