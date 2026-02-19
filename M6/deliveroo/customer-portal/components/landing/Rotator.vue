<template>
  <div :style="{ height: containerHeight }" class="relative overflow-hidden">
    <TransitionGroup name="rotator" tag="div" class="space-y-8">
      <div
        v-for="item in displayedItems"
        :key="item.name + rotationIndex"
        class="flex items-start space-x-4"
      >
        <div v-if="item.icon" class="flex-shrink-0">
          <div class="flex items-center justify-center w-12 h-12 bg-success-100 dark:bg-success-900 rounded-lg">
            <component :is="getIconComponent(item.icon)" class="w-6 h-6 text-success-600 dark:text-success-400" />
          </div>
        </div>
        <div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ item.name }}
          </h3>
          <p class="mt-2 text-gray-600 dark:text-gray-300">
            {{ item.description }}
          </p>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import {
  GlobeEuropeAfricaIcon,
  ClockIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  TruckIcon,
  BuildingStorefrontIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'

interface RotatorItem {
  name: string
  description: string
  icon?: string
}

const props = defineProps<{ items: RotatorItem[]; itemsToShow?: number; interval?: number }>()

const itemsToShow = props.itemsToShow ?? 3
const interval = props.interval ?? 4000

const rotationIndex = ref(0)
const containerHeight = `${itemsToShow * 96}px` // ~6rem per item

const displayedItems = computed(() =>
  Array.from({ length: itemsToShow }).map((_, i) => {
    const idx = (rotationIndex.value + i) % props.items.length
    return props.items[idx]
  })
)

let timer: ReturnType<typeof setInterval> | null = null

const getIconComponent = (iconName?: string) => {
  const iconMap = {
    GlobeEuropeAfricaIcon,
    ClockIcon,
    ShieldCheckIcon,
    CpuChipIcon,
    TruckIcon,
    BuildingStorefrontIcon,
    CheckIcon
  }
  if (!iconName) return CheckIcon
  return iconMap[iconName as keyof typeof iconMap] || CheckIcon
}

onMounted(() => {
  timer = setInterval(() => {
    rotationIndex.value = (rotationIndex.value + 1) % props.items.length
  }, interval)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.rotator-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.rotator-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.rotator-enter-active,
.rotator-leave-active,
.rotator-move {
  transition: transform 0.6s ease, opacity 0.6s ease;
}

.rotator-leave-active {
  position: absolute;
  width: 100%;
}
</style>
