import tailwindcss from '@tailwindcss/vite'

const projectId = process.env.NUXT_PUBLIC_SANITY_PROJECT_ID || '40bhay7m'
const dataset = process.env.NUXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NUXT_PUBLIC_SANITY_API_VERSION || '2025-02-19'
const studioUrl = process.env.NUXT_SANITY_STUDIO_URL || 'http://localhost:3333'
// Server-side only. Without it, the site is built without preview routes or overlays.
const visualEditingToken = process.env.NUXT_SANITY_VISUAL_EDITING_TOKEN

export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: {enabled: true},

  modules: ['@nuxtjs/sanity', '@nuxt/image', '@nuxtjs/i18n'],

  css: ['~/assets/css/main.css'],
  vite: {plugins: [tailwindcss()]},

  app: {
    head: {
      meta: [{name: 'theme-color', content: '#0b1026'}],
      link: [
        {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'},
        {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
        {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: ''},
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400..700&family=Plus+Jakarta+Sans:wght@500..800&display=swap',
        },
        {rel: 'preconnect', href: 'https://cdn.sanity.io'},
      ],
    },
  },

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },

  sanity: {
    projectId,
    dataset,
    apiVersion,
    // Published content is always read from the Sanity API CDN (apicdn.sanity.io)
    useCdn: true,
    perspective: 'published',
    visualEditing: visualEditingToken
      ? {
          token: visualEditingToken,
          studioUrl,
          stega: true,
          mode: 'live-visual-editing',
          previewMode: {enable: '/preview/enable', disable: '/preview/disable'},
        }
      : undefined,
  },

  i18n: {
    // English at /, Dutch at /nl with translated route segments
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      {code: 'en', language: 'en-GB', name: 'English', file: 'en.json'},
      {code: 'nl', language: 'nl-NL', name: 'Nederlands', file: 'nl.json'},
    ],
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    detectBrowserLanguage: false,
    customRoutes: 'config',
    pages: {
      'news': {en: '/news', nl: '/nieuws'},
      'news-slug': {en: '/news/[slug]', nl: '/nieuws/[slug]'},
      'products': {en: '/products', nl: '/producten'},
      'products-slug': {en: '/products/[slug]', nl: '/producten/[slug]'},
    },
  },

  image: {
    provider: 'sanity',
    sanity: {projectId, dataset},
    quality: 80,
    format: ['avif', 'webp'],
    screens: {xs: 360, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536, '2xl': 1920},
  },

  routeRules: {
    // Preview endpoints and the draft proxy must never be cached
    '/preview/**': {headers: {'cache-control': 'private, no-store'}},
    '/_sanity/**': {headers: {'cache-control': 'private, no-store'}},
  },

  nitro: {
    // Two @sanity/client majors are installed (v7 for @nuxtjs/sanity, v8 for @sanity/core-loader).
    // Bundling it avoids Nitro's dependency tracing mixing up files from both versions.
    externals: {inline: ['@sanity/client']},
  },

  typescript: {strict: true},
})
