<script setup lang="ts">
import {
  BarChart3,
  Cloud,
  Code2,
  Compass,
  Cpu,
  Gauge,
  Globe,
  Headphones,
  Heart,
  Layers,
  Leaf,
  Lock,
  Palette,
  Rocket,
  Shield,
  Smartphone,
  Sparkles,
  Users,
  Wand2,
  Zap,
} from '@lucide/vue'

/** Maps the icon names editors can pick in the Studio to Lucide icons. */
const icons = {
  sparkles: Sparkles,
  zap: Zap,
  shield: Shield,
  layers: Layers,
  rocket: Rocket,
  palette: Palette,
  code: Code2,
  chart: BarChart3,
  globe: Globe,
  users: Users,
  heart: Heart,
  cpu: Cpu,
  lock: Lock,
  leaf: Leaf,
  compass: Compass,
  gauge: Gauge,
  wand: Wand2,
  cloud: Cloud,
  headphones: Headphones,
  smartphone: Smartphone,
}

const props = defineProps<{name?: string}>()
const icon = computed(() => icons[(clean(props.name) ?? 'sparkles') as keyof typeof icons] ?? Sparkles)
</script>

<template>
  <component :is="icon" aria-hidden="true" :stroke-width="1.75" />
</template>
