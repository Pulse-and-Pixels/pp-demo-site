<script setup lang="ts">
import type {DocumentRef, PathSegment, FaqBlock} from '~/types/sanity'

const props = defineProps<{block: FaqBlock; doc?: DocumentRef; path?: PathSegment[]; index?: number}>()
const attr = useBlockAttr(props)

const split = computed(() => clean(props.block.layout) !== 'stacked')
const open = ref(new Set<string>(clean(props.block.openFirst) !== false && props.block.items?.[0] ? [props.block.items[0]._key] : []))
const toggle = (key: string) => {
  const next = new Set(open.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  open.value = next
}
const id = useId()
</script>

<template>
  <UiSection :background="block.background" v-slot="{dark}">
    <div :class="split ? 'grid gap-12 lg:grid-cols-12' : 'mx-auto max-w-3xl'">
      <div :class="split ? 'lg:col-span-5' : 'mb-12'">
        <UiSectionHeader
          :eyebrow="block.eyebrow"
          :heading="block.heading"
          :intro="block.intro"
          :align="split ? 'left' : 'center'"
          :class="split && 'lg:sticky lg:top-28'"
        />
      </div>
      <div :class="split && 'lg:col-span-7'">
        <div class="divide-y border-y" :class="dark ? 'divide-white/10 border-white/10' : 'divide-ink-100 border-ink-100'">
          <div v-for="item in block.items" :key="item._key" :data-sanity="attr('items', {_key: item._key})">
            <h3>
              <button
                :id="`${id}-q-${item._key}`"
                type="button"
                class="flex w-full items-center justify-between gap-6 py-6 text-left font-display text-lg font-semibold transition"
                :class="dark ? 'text-white hover:text-accent-300' : 'text-ink-950 hover:text-brand-600'"
                :aria-expanded="open.has(item._key)"
                :aria-controls="`${id}-a-${item._key}`"
                @click="toggle(item._key)"
              >
                {{ item.question }}
                <span
                  aria-hidden="true"
                  class="relative size-6 shrink-0 rounded-full ring-1 transition duration-300"
                  :class="[dark ? 'ring-white/20' : 'ring-ink-200', open.has(item._key) && 'rotate-45 bg-brand-600 ring-brand-600 text-white']"
                >
                  <span class="absolute inset-0 flex items-center justify-center text-base leading-none">+</span>
                </span>
              </button>
            </h3>
            <div
              :id="`${id}-a-${item._key}`"
              role="region"
              :aria-labelledby="`${id}-q-${item._key}`"
              class="grid transition-[grid-template-rows] duration-300 ease-out-soft"
              :class="open.has(item._key) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
              :inert="!open.has(item._key)"
            >
              <div class="overflow-hidden">
                <UiRichText :value="item.answer" :invert="dark" class="pb-6 prose-base" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UiSection>
</template>
