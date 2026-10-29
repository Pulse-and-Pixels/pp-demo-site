export default defineEventHandler((event) => {
  const base = useRuntimeConfig(event).public.siteUrl.replace(/\/$/, '')
  setResponseHeaders(event, {
    'content-type': 'text/plain; charset=utf-8',
    'cache-control': 'public, max-age=3600',
  })
  return ['User-agent: *', 'Allow: /', 'Disallow: /preview/', 'Disallow: /_sanity/', '', `Sitemap: ${base}/sitemap.xml`, ''].join('\n')
})
