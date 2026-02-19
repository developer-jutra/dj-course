<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
import {
  TruckIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  CheckCircleIcon,
  MapIcon
} from '@heroicons/vue/24/outline'
import { mockDashboardStats } from './dashboard.mocks'

const iconMap: Record<string, any> = {
  TruckIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  CheckCircleIcon,
  MapIcon,
}

const { data: rawStats } = await useAsyncData(
  'dashboard-stats',
  () => $fetch<Array<{ name: string; value: string; iconName: string; color: string }>>('/api/dashboard/stats'),
)

const stats = computed(() => {
  if (!rawStats.value?.length) return mockDashboardStats
  return rawStats.value.map((s) => ({
    ...s,
    icon: iconMap[s.iconName] ?? ClockIcon,
  }))
})
</script>
