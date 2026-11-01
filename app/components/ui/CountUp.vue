<script setup lang="ts">
/**
 * Counts up to `value` once scrolled into view. The server renders the final
 * number, so it is correct without JavaScript and for search engines.
 */
const props = withDefaults(
  defineProps<{value: number; decimals?: number; prefix?: string; suffix?: string; animate?: boolean}>(),
  {decimals: 0, prefix: '', suffix: '', animate: true},
)

const el = ref<HTMLElement>()
const {locale} = useI18n()
const current = ref(props.value)
const format = (n: number) =>
  n.toLocaleString(locale.value === 'nl' ? 'nl-NL' : 'en-GB', {minimumFractionDigits: props.decimals, maximumFractionDigits: props.decimals})

let observer: IntersectionObserver | undefined

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!props.animate || reduced || !el.value) return
  current.value = 0
  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return
      observer?.disconnect()
      const start = performance.now()
      const duration = 1600
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1)
        current.value = props.value * (1 - Math.pow(1 - t, 3))
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    },
    {threshold: 0.4},
  )
  observer.observe(el.value)
})

onBeforeUnmount(() => observer?.disconnect())

watch(() => props.value, (value) => (current.value = value))
</script>

<template>
  <span ref="el" class="tabular-nums">
    <span class="sr-only">{{ prefix }}{{ format(value) }}{{ suffix }}</span>
    <span aria-hidden="true">{{ prefix }}{{ format(current) }}{{ suffix }}</span>
  </span>
</template>
