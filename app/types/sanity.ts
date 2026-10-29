import type {PortableTextBlock} from '@portabletext/types'

export type Background = 'white' | 'muted' | 'brand' | 'dark'

export interface SanityImage {
  _type?: 'image'
  asset?: {_ref: string}
  alt?: string
  caption?: string
  crop?: {top: number; bottom: number; left: number; right: number}
  hotspot?: {x: number; y: number; height: number; width: number}
  /** Low-quality blurred placeholder from asset metadata */
  lqip?: string
}

/** Rich text as stored in Sanity: text blocks plus inline images. */
export type RichText = (PortableTextBlock | (SanityImage & {_type: 'image'; _key: string}))[]

export interface InternalTarget {
  _type: 'page' | 'newsArticle' | 'product'
  slug?: string
}

export interface Link {
  label?: string
  linkType?: 'internal' | 'path' | 'external'
  internal?: InternalTarget | null
  path?: string
  url?: string
  openInNewTab?: boolean
}

export interface Cta {
  _key?: string
  link?: Link
  variant?: 'primary' | 'secondary' | 'ghost'
}

export interface Seo {
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImage
  canonicalUrl?: string
  noIndex?: boolean
}

export interface Category {
  _id: string
  title: string
  slug: string
}

export interface Author {
  _id: string
  _type: 'author'
  name: string
  role?: string
  bio?: string
  image?: SanityImage
}

export interface NewsCard {
  _id: string
  _type: 'newsArticle'
  title: string
  slug: string
  excerpt?: string
  publishedAt?: string
  featured?: boolean
  heroImage?: SanityImage
  categories?: Category[]
  author?: Pick<Author, '_id' | 'name'> | null
}

export interface NewsArticle extends NewsCard {
  body?: RichText
  author?: Author | null
  seo?: Seo
}

export interface ProductCard {
  _id: string
  _type: 'product'
  name: string
  slug: string
  tagline?: string
  shortDescription?: string
  price?: number
  currency?: string
  featured?: boolean
  badge?: string
  image?: SanityImage
  categories?: Category[]
}

export interface Product extends Omit<ProductCard, 'image'> {
  description?: RichText
  images?: (SanityImage & {_key: string})[]
  specifications?: {_key: string; label: string; value: string}[]
  cta?: Cta | null
  seo?: Seo
}

export interface Testimonial {
  _id: string
  quote: string
  name: string
  role?: string
  company?: string
  rating?: number
  avatar?: SanityImage
}

/* ------------------------------------------------------------------
 * Page builder blocks
 * ------------------------------------------------------------------ */

interface BlockBase<T extends string> {
  _key: string
  _type: T
}

interface SectionHeader {
  eyebrow?: string
  heading?: string
  intro?: string
}

export interface HeroBlock extends BlockBase<'heroBlock'> {
  eyebrow?: string
  heading?: string
  text?: string
  ctas?: Cta[]
  image?: SanityImage
  layout?: 'split' | 'centered' | 'background'
  theme?: 'light' | 'dark' | 'gradient'
}

export interface RichTextBlock extends BlockBase<'richTextBlock'> {
  eyebrow?: string
  heading?: string
  body?: RichText
  alignment?: 'left' | 'center'
  width?: 'narrow' | 'wide'
  background?: Background
}

export interface ImageTextBlock extends BlockBase<'imageTextBlock'> {
  eyebrow?: string
  heading?: string
  body?: RichText
  cta?: Cta | null
  image?: SanityImage
  imagePosition?: 'left' | 'right'
  verticalAlignment?: 'start' | 'center' | 'end'
  background?: Background
}

export interface FeatureGridBlock extends BlockBase<'featureGridBlock'>, SectionHeader {
  features?: {_key: string; icon?: string; title: string; text?: string; link?: Link | null}[]
  columns?: 2 | 3 | 4
  cardStyle?: 'bordered' | 'elevated' | 'minimal'
  background?: Background
}

export interface StatsBlock extends BlockBase<'statsBlock'>, SectionHeader {
  stats?: {
    _key: string
    value: number
    prefix?: string
    suffix?: string
    decimals?: number
    label: string
    description?: string
  }[]
  animate?: boolean
  background?: Background
}

type CollectionMode = 'latest' | 'featured' | 'category' | 'manual'

export interface ProductGridBlock extends BlockBase<'productGridBlock'>, SectionHeader {
  mode?: CollectionMode
  limit?: number
  items?: ProductCard[]
  cta?: Cta | null
  layout?: 'grid' | 'compact'
  columns?: 2 | 3 | 4
  background?: Background
}

export interface NewsGridBlock extends BlockBase<'newsGridBlock'>, SectionHeader {
  mode?: CollectionMode
  limit?: number
  items?: NewsCard[]
  cta?: Cta | null
  layout?: 'grid' | 'featured' | 'list'
  background?: Background
}

export interface TestimonialBlock extends BlockBase<'testimonialBlock'>, SectionHeader {
  testimonials?: Testimonial[]
  layout?: 'grid' | 'spotlight'
  background?: Background
}

export interface CtaBlock extends BlockBase<'ctaBlock'> {
  eyebrow?: string
  heading?: string
  text?: string
  ctas?: Cta[]
  image?: SanityImage
  theme?: 'gradient' | 'dark' | 'light'
  alignment?: 'center' | 'left'
}

export interface FaqBlock extends BlockBase<'faqBlock'>, SectionHeader {
  items?: {_key: string; question: string; answer?: RichText}[]
  layout?: 'split' | 'stacked'
  openFirst?: boolean
  background?: Background
}

export interface SpacerBlock extends BlockBase<'spacerBlock'> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  divider?: boolean
  background?: Background
}

export type PageBuilderBlock =
  | HeroBlock
  | RichTextBlock
  | ImageTextBlock
  | FeatureGridBlock
  | StatsBlock
  | ProductGridBlock
  | NewsGridBlock
  | TestimonialBlock
  | CtaBlock
  | FaqBlock
  | SpacerBlock

export type BlockType = PageBuilderBlock['_type']

export interface Page {
  _id: string
  _type: 'page'
  title: string
  slug: string
  seo?: Seo
  pageBuilder?: PageBuilderBlock[]
}

export interface SiteSettings {
  _id: string
  siteName?: string
  tagline?: string
  logo?: SanityImage
  mainNavigation?: (Link & {_key: string})[]
  headerCta?: Cta | null
  footerNavigation?: {_key: string; title: string; links?: (Link & {_key: string})[]}[]
  footerText?: string
  copyright?: string
  contact?: {email?: string; phone?: string; address?: string}
  socialLinks?: {_key: string; platform: string; url: string}[]
  defaultSeo?: Seo
  siteUrl?: string
  productCta?: Cta | null
}

export interface ListingSettings {
  _id: string
  title?: string
  intro?: string
  seo?: Seo
}

/** Minimal document identity used to build visual editing attributes. */
export interface DocumentRef {
  _id: string
  _type: string
}

/** A segment of a Sanity field path, e.g. ['pageBuilder', {_key: 'abc'}, 'image']. */
export type PathSegment = string | number | {_key: string}
