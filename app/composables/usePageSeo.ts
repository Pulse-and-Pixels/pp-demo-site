import type {SanityImage, Seo} from '~/types/sanity'

interface PageSeoInput {
  title?: string
  description?: string
  seo?: Seo | null
  image?: SanityImage | null
  type?: 'website' | 'article' | 'product'
  publishedTime?: string
}

/**
 * Title, description, Open Graph, Twitter and canonical tags for a page.
 * Falls back to the default SEO in Site settings. All values are stega-cleaned:
 * invisible edit markers must never end up in <head>.
 */
export function usePageSeo(input: () => PageSeoInput | null | undefined) {
  const {data: settings} = useSiteSettings()
  const route = useRoute()
  const config = useRuntimeConfig()
  const {projectId, dataset} = useSanityConfig()

  const meta = computed(() => {
    const page = clean(input() ?? {}) as PageSeoInput
    const site = clean(settings.value)
    const defaults = site?.defaultSeo
    const siteUrl = (site?.siteUrl || config.public.siteUrl).replace(/\/$/, '')
    const image = page.seo?.ogImage ?? page.image ?? defaults?.ogImage
    return {
      title: page.seo?.metaTitle || page.title || defaults?.metaTitle || site?.siteName,
      description: page.seo?.metaDescription || page.description || defaults?.metaDescription,
      image: ogImageUrl(image ?? undefined, projectId, dataset),
      canonical: page.seo?.canonicalUrl || `${siteUrl}${route.path === '/' ? '' : route.path}`,
      noIndex: Boolean(page.seo?.noIndex),
      siteName: site?.siteName,
      type: page.type === 'article' ? 'article' : 'website',
      publishedTime: page.publishedTime,
    }
  })

  useSeoMeta({
    title: () => meta.value.title,
    description: () => meta.value.description,
    ogTitle: () => meta.value.title,
    ogDescription: () => meta.value.description,
    ogImage: () => meta.value.image,
    ogImageWidth: () => (meta.value.image ? 1200 : undefined),
    ogImageHeight: () => (meta.value.image ? 630 : undefined),
    ogUrl: () => meta.value.canonical,
    ogType: () => meta.value.type as 'website' | 'article',
    ogSiteName: () => meta.value.siteName,
    articlePublishedTime: () => meta.value.publishedTime,
    twitterCard: 'summary_large_image',
    robots: () => (meta.value.noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'),
  })

  useHead({link: [{rel: 'canonical', href: () => meta.value.canonical}]})
}
