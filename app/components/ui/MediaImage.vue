<script setup lang="ts">
import type {SanityImage} from '~/types/sanity'

/**
 * Responsive image served by the Sanity image CDN through Nuxt Image.
 * Respects the editor's crop and hotspot, shows the LQIP blur while loading,
 * and lazy-loads unless `priority` is set (use it for above-the-fold images).
 */
const props = withDefaults(
  defineProps<{
    image?: SanityImage | null
    /** Width / height ratio to crop to, e.g. 16/9. Defaults to the image's own ratio. */
    aspect?: number
    sizes?: string
    priority?: boolean
    alt?: string
    imgClass?: string
  }>(),
  {sizes: '100vw sm:100vw md:50vw', aspect: undefined, alt: undefined, imgClass: undefined},
)

const img = computed(() => clean(props.image))
const src = computed(() => img.value?.asset?._ref)
const natural = computed(() => assetDimensions(src.value))

const dimensions = computed(() => {
  if (!natural.value) return undefined
  const width = Math.min(natural.value.width, 2400)
  const ratio = props.aspect ?? natural.value.width / natural.value.height
  return {width, height: Math.round(width / ratio)}
})

const modifiers = computed(() => {
  const mods: Record<string, string | number> = {}
  const {crop, hotspot} = img.value ?? {}
  const size = natural.value
  let rect = {left: 0, top: 0, width: 1, height: 1}
  if (crop && size) {
    rect = {left: crop.left, top: crop.top, width: 1 - crop.left - crop.right, height: 1 - crop.top - crop.bottom}
    mods.rect = [rect.left * size.width, rect.top * size.height, rect.width * size.width, rect.height * size.height]
      .map((n) => Math.round(n))
      .join(',')
  }
  if (props.aspect) {
    mods.fit = 'cover'
    if (hotspot) {
      // Focal point is relative to the (cropped) source image
      mods.crop = 'focalpoint'
      mods['fp-x'] = Number(((hotspot.x - rect.left) / rect.width).toFixed(3))
      mods['fp-y'] = Number(((hotspot.y - rect.top) / rect.height).toFixed(3))
    }
  }
  return mods
})

const placeholder = computed(() =>
  img.value?.lqip ? {backgroundImage: `url(${img.value.lqip})`, backgroundSize: 'cover', backgroundPosition: 'center'} : undefined,
)
</script>

<template>
  <NuxtImg
    v-if="src && dimensions"
    provider="sanity"
    :src="src"
    :width="dimensions.width"
    :height="dimensions.height"
    :sizes="sizes"
    :modifiers="modifiers"
    :alt="alt ?? img?.alt ?? ''"
    :loading="priority ? 'eager' : 'lazy'"
    :fetchpriority="priority ? 'high' : undefined"
    :preload="priority ? {fetchPriority: 'high'} : undefined"
    decoding="async"
    :style="placeholder"
    :class="imgClass"
  />
</template>
