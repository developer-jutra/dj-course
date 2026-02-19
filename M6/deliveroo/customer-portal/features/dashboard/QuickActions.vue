<template>
  <div>
    <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
      Quick Actions
    </h2>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
import {
  TruckIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  CheckCircleIcon,
  MapIcon
} from '@heroicons/vue/24/outline'
import { mockQuickActions } from './dashboard.mocks'

const iconMap: Record<string, any> = {
  TruckIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  CheckCircleIcon,
  MapIcon,
}

const { data: rawActions } = await useAsyncData(
  'dashboard-quick-actions',
  () => $fetch<Array<{ name: string; description: string; iconName: string; href: string }>>('/api/dashboard/quick-actions'),
)

const quickActions = computed(() => {
  if (!rawActions.value?.length) return mockQuickActions
  return rawActions.value.map((a) => ({
    ...a,
    icon: iconMap[a.iconName] ?? MapIcon,
  }))
})
</script>
