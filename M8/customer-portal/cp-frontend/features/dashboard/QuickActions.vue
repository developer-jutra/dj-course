<template>
  <div>
    <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
      Quick Actions
    </h2>
    <div v-if="pending" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="i in 3"
        :key="i"
        class="card p-6 animate-pulse"
      >
        <div class="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div class="mt-4 h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div class="mt-2 h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="action in quickActions"
        :key="action.name"
        :to="action.href"
        class="group relative card p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <component
              :is="action.icon"
              class="h-6 w-6 text-success-600 dark:text-success-400"
            />
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white">
              {{ action.name }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ action.description }}
            </p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuickAction } from './dashboard.model'
import {
  TruckIcon,
  BuildingStorefrontIcon,
  MapIcon
} from '@heroicons/vue/24/outline'

const iconMap: Record<string, any> = {
  TruckIcon,
  BuildingStorefrontIcon,
  MapIcon
}

// Fetch data from MongoDB
const { data: quickActionsData, pending } = await useFetch<any[]>('/api/dashboard/quick-actions')

// Map iconName strings to actual icon components
const quickActions = computed<QuickAction[]>(() => {
  if (!quickActionsData.value) return []
  return quickActionsData.value.map(action => ({
    ...action,
    icon: iconMap[action.iconName] || TruckIcon
  }))
})
</script>
