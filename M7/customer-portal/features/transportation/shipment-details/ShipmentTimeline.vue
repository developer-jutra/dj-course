<template>
  <div class="w-full max-w-6xl mx-auto p-6">
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Shipment #{{ shipmentData.id }}
      </h2>
      <p class="text-gray-600 dark:text-gray-400">Tracking ID: {{ shipmentData.trackingId }}</p>
    </div>

    <!-- Timeline Container - Fixed height with constrained width -->
    <div class="w-4/5 mx-auto relative mb-8 h-32">
      <!-- Background Line - Aligned with icons -->
      <div 
        class="absolute top-8 h-0.5 bg-gray-200 dark:bg-gray-700 z-0" 
        :style="{ 
          left: linePosition.left, 
          right: linePosition.right 
        }"
      />
      
      <!-- Progress Line - Aligned with icons -->
      <div 
        class="absolute top-8 h-0.5 bg-green-600 z-0 transition-all duration-500 ease-in-out"
        :style="{ 
          left: linePosition.left,
          width: `${(progressPercentage / 100) * (100 - parseFloat(linePosition.left) - parseFloat(linePosition.right))}%`
        }"
      />

      <!-- Timeline Steps -->
      <div class="relative h-full">
        <div 
          v-for="(status, index) in shipmentData.statuses"
          :key="status.id"
          class="absolute flex flex-col items-center group cursor-pointer"
          :style="{ left: getStepPosition(index), transform: 'translateX(-50%)' }"
          @click="!isFuture(index) ? handleStatusClick(index) : undefined"
        >
          <!-- Icon Container - Fixed height container -->
          <div class="h-16 flex items-center justify-center">
            <div :class="getIconContainerClasses(index)">
              <component :is="getIconComponent(status.icon)" :class="getIconClasses(index)" />
            </div>
          </div>

          <!-- Status Label - Fixed height container -->
          <div class="mt-4 text-center h-16 flex flex-col justify-start min-w-24">
            <div :class="getStatusLabelClasses(index)">
              {{ status.name }}
            </div>
            <div :class="getTimestampClasses(index)">
              {{ status.timestamp }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { TruckIcon, CheckIcon, CubeIcon, ArchiveBoxIcon } from '@heroicons/vue/24/outline'
import type { ShipmentTimelineData, ShipmentStatus } from './shipment-timeline.model'

interface Props {
  shipmentData: ShipmentTimelineData
  disabledSteps?: number[]
}

interface Emits {
  (event: 'statusChange', statusIndex: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isStepDisabled = (index: number) => {
  return props.disabledSteps?.includes(index) || false
}

// State
const activeStatusIndex = ref(props.shipmentData.currentStatusIndex)
const windowWidth = ref(0)

// Icon mapping
const iconMap = {
  package: ArchiveBoxIcon,
  truck: TruckIcon,
  check: CheckIcon,
  box: CubeIcon,
}

// Computed properties
const activeStatus = computed(() => props.shipmentData.statuses[activeStatusIndex.value])

const progressPercentage = computed(() => {
  return props.shipmentData.statuses.length > 1 
    ? (props.shipmentData.currentStatusIndex / (props.shipmentData.statuses.length - 1)) * 100 
    : 0
})

const linePosition = computed(() => {
  const totalSteps = props.shipmentData.statuses.length
  if (totalSteps === 1) return { left: '50%', right: '50%' }
  
  const maxSpacing = 200
  const minSpacing = 80
  const availableSpace = Math.min(maxSpacing * (totalSteps - 1), windowWidth.value * 0.6)
  const actualSpacing = Math.max(minSpacing, availableSpace / (totalSteps - 1))
  const totalWidth = actualSpacing * (totalSteps - 1)
  const startOffset = (100 - (totalWidth / (windowWidth.value * 0.8)) * 100) / 2
  const endOffset = startOffset + (totalWidth / (windowWidth.value * 0.8)) * 100
  
  return { 
    left: `${startOffset}%`, 
    right: `${100 - endOffset}%` 
  }
})

// Methods
const handleStatusClick = (index: number) => {
  // Allow clicking if the step is not disabled
  if (!isStepDisabled(index)) {
    activeStatusIndex.value = index
    emit('statusChange', index)
  }
}

const getIconComponent = (icon: string) => {
  return iconMap[icon as keyof typeof iconMap] || ArchiveBoxIcon
}

const getStepPosition = (index: number): string => {
  const totalSteps = props.shipmentData.statuses.length
  
  if (totalSteps === 1) {
    return '50%'
  }
  
  const maxSpacing = 200
  const minSpacing = 80
  const availableSpace = Math.min(maxSpacing * (totalSteps - 1), windowWidth.value * 0.6)
  const actualSpacing = Math.max(minSpacing, availableSpace / (totalSteps - 1))
  const totalWidth = actualSpacing * (totalSteps - 1)
  const startOffset = (100 - (totalWidth / (windowWidth.value * 0.8)) * 100) / 2
  return `${startOffset + (index * actualSpacing / (windowWidth.value * 0.8)) * 100}%`
}

const isActive = (index: number) => index === activeStatusIndex.value
const isCompleted = (index: number) => index < props.shipmentData.currentStatusIndex
const isCurrent = (index: number) => index === props.shipmentData.currentStatusIndex
const isFuture = (index: number) => isStepDisabled(index)

const getIconContainerClasses = (index: number) => {
  const classes = [
    'relative z-10 flex items-center justify-center rounded-full border-2 transition-all duration-300 ease-in-out',
    'w-12 h-12'
  ]
  
  if (isActive(index)) {
    classes.push('bg-green-600 border-green-600 shadow-lg scale-110')
  } else if (isCurrent(index)) {
    classes.push('bg-white dark:bg-gray-800 border-green-600 shadow-md')
  } else if (isCompleted(index)) {
    classes.push('bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-800')
  } else if (isFuture(index)) {
    classes.push('bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-not-allowed opacity-60')
  } else {
    classes.push('hover:scale-105')
  }
  
  return classes.join(' ')
}

const getIconClasses = (index: number) => {
  const classes = ['w-6 h-6 transition-all duration-300']
  
  if (isActive(index)) {
    classes.push('text-white')
  } else if (isCurrent(index)) {
    classes.push('text-green-600')
  } else if (isCompleted(index)) {
    classes.push('text-green-600')
  } else if (isFuture(index)) {
    classes.push('text-gray-400')
  }
  
  return classes.join(' ')
}

const getStatusLabelClasses = (index: number) => {
  const classes = ['font-medium transition-colors duration-300 text-sm']
  
  if (isActive(index)) {
    classes.push('text-green-600 dark:text-green-400 font-semibold')
  } else if (isCurrent(index)) {
    classes.push('text-green-600 dark:text-green-400 font-semibold')
  } else if (isCompleted(index)) {
    classes.push('text-gray-700 dark:text-gray-300')
  } else if (isFuture(index)) {
    classes.push('text-gray-400 dark:text-gray-500')
  }
  
  return classes.join(' ')
}

const getTimestampClasses = (index: number) => {
  const classes = ['text-xs mt-1 transition-colors duration-300']
  
  if (isActive(index)) {
    classes.push('text-green-500 dark:text-green-400')
  } else if (isCurrent(index)) {
    classes.push('text-green-500 dark:text-green-400')
  } else if (isCompleted(index)) {
    classes.push('text-gray-500 dark:text-gray-400')
  } else if (isFuture(index)) {
    classes.push('text-gray-400 dark:text-gray-500')
  }
  
  return classes.join(' ')
}

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  updateWindowWidth()
  window.addEventListener('resize', updateWindowWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})
</script>
