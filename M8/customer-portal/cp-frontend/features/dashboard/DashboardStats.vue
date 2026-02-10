<template>
  <div v-if="pending" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    <div
      v-for="i in 4"
      :key="i"
      class="card p-6 animate-pulse"
    >
      <div class="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div class="mt-4 h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div class="mt-2 h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
  <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    <div
      v-for="stat in stats"
      :key="stat.name"
      class="card p-6 hover:shadow-lg transition-shadow"
    >
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <component
            :is="stat.icon"
            :class="[
              'h-8 w-8',
              stat.color
            ]"
          />
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              {{ stat.name }}
            </dt>
            <dd class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ stat.value }}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DashboardStat } from './dashboard.model'
import {
  TruckIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

const iconMap: Record<string, any> = {
  TruckIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  CheckCircleIcon
}

// Fetch data from MongoDB
const { data: statsData, pending } = await useFetch<any[]>('/api/dashboard/stats')

// Map iconName strings to actual icon components
const stats = computed<DashboardStat[]>(() => {
  if (!statsData.value) return []
  return statsData.value.map(stat => ({
    ...stat,
    icon: iconMap[stat.iconName] || TruckIcon
  }))
})
</script>
