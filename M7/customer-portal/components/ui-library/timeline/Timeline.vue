<template>
  <div class="flow-root">
    <ul role="list" class="-mb-8">
      <li
        v-for="(item, idx) in reversedItems"
        :key="item.id"
      >
        <div class="relative pb-8">
          <span
            v-if="idx !== reversedItems.length - 1"
            class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
            aria-hidden="true"
          />
          <div class="relative flex space-x-3">
            <div>
              <span
                :class="[
                  'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-900',
                  getProgressColor(item.status)
                ]"
              >
                <CheckIcon class="h-5 w-5 text-white" aria-hidden="true" />
              </span>
            </div>
            <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
              <div>
                <p class="text-sm text-gray-900 dark:text-white">
                  {{ formatStatus(item.status) }}
                  <span v-if="item.location" class="font-medium">{{ prefix }} {{ item.location }}</span>
                </p>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ item.description }}
                </p>
                <div v-if="item.estimatedTime || item.actualTime" class="mt-2 space-y-1">
                  <div v-if="item.estimatedTime" class="text-xs text-gray-500 dark:text-gray-400">
                    <span class="font-medium">Estimated:</span> {{ formatDateTime(item.estimatedTime) }}
                  </div>
                  <div v-if="item.actualTime" class="text-xs">
                    <span class="font-medium text-gray-700 dark:text-gray-300">Actual:</span>
                    <span :class="getTimingColor(item.estimatedTime, item.actualTime)">
                      {{ formatDateTime(item.actualTime) }}
                      <span v-if="item.estimatedTime" class="ml-1">
                        {{ getTimingDifference(item.estimatedTime, item.actualTime) }}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div class="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                <time :datetime="item.timestamp.toISOString()">
                  {{ formatDateTime(item.timestamp) }}
                </time>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { CheckIcon } from '@heroicons/vue/24/outline'

interface TimelineItem {
  id: string
  timestamp: Date
  status: string
  location?: string
  description: string
  estimatedTime?: Date | string
  actualTime?: Date | string
}

interface Props {
  items: TimelineItem[]
  prefix?: string
}

const props = withDefaults(defineProps<Props>(), {
  prefix: 'in'
})

const reversedItems = computed(() => [...props.items].reverse())

const formatStatus = (status: string) =>
  status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())

const getProgressColor = (status: string) => {
  const colors: Record<string, string> = {
    'SUBMITTED': 'bg-yellow-500',
    'APPROVED': 'bg-blue-500',
    'RECEIVED': 'bg-purple-500',
    'STORED': 'bg-green-500',
    'COMPLETED': 'bg-gray-500',
    'PICKUP_SCHEDULED': 'bg-yellow-500',
    'PICKED_UP': 'bg-blue-500',
    'IN_TRANSIT': 'bg-purple-500',
    'DELIVERED': 'bg-green-500'
  }
  return colors[status] || 'bg-gray-500'
}

const formatDateTime = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj)
}

const getTimingColor = (estimatedTime?: Date | string, actualTime?: Date | string) => {
  if (!estimatedTime || !actualTime) {
    return 'text-gray-700 dark:text-gray-300'
  }
  const est = typeof estimatedTime === 'string' ? new Date(estimatedTime) : estimatedTime
  const act = typeof actualTime === 'string' ? new Date(actualTime) : actualTime
  const diff = act.getTime() - est.getTime()
  if (diff <= 0) return 'text-green-600 dark:text-green-400'
  if (diff <= 30 * 60 * 1000) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

const getTimingDifference = (estimatedTime?: Date | string, actualTime?: Date | string) => {
  if (!estimatedTime || !actualTime) return ''
  const est = typeof estimatedTime === 'string' ? new Date(estimatedTime) : estimatedTime
  const act = typeof actualTime === 'string' ? new Date(actualTime) : actualTime
  const minutes = Math.round((act.getTime() - est.getTime()) / 60000)
  if (minutes === 0) return '(On time)'
  return minutes > 0 ? `(+${minutes} min late)` : `(${Math.abs(minutes)} min early)`
}
</script> 