import {ctaFields, imageFields, linkFields, seoFields} from './fragments'

/** Site settings: navigation, footer, contact details and default SEO. */
export const siteSettingsQuery = /* groq */ `*[_type == "siteSettings"][0]{
  _id,
  siteName,
  tagline,
  logo{${imageFields}},
  mainNavigation[]{_key, ${linkFields}},
  headerCta${ctaFields},
  footerNavigation[]{_key, title, links[]{_key, ${linkFields}}},
  footerText,
  copyright,
  contact,
  socialLinks[]{_key, platform, url},
  defaultSeo${seoFields},
  siteUrl,
  productCta${ctaFields}
}`
