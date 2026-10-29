import {createImageUrlBuilder} from '@sanity/image-url'
import {stegaClean} from '@sanity/client/stega'
import type {SanityImage} from '~/types/sanity'

/** Width and height encoded in a Sanity image asset id: image-<hash>-<w>x<h>-<ext> */
export function assetDimensions(ref?: string) {
  const match = ref?.match(/-(\d+)x(\d+)-[a-z]+$/)
  return match ? {width: Number(match[1]), height: Number(match[2])} : undefined
}

/** Absolute, hotspot-aware URL for social sharing images. */
export function ogImageUrl(image: SanityImage | undefined, projectId: string, dataset: string) {
  if (!image?.asset?._ref) return undefined
  return createImageUrlBuilder({projectId, dataset})
    .image(stegaClean(image))
    .width(1200)
    .height(630)
    .fit('crop')
    .auto('format')
    .url()
}
