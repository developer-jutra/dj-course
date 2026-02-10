<template>
  <div class="card">
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">
          Your Requests
        </h2>
        <NuxtLink
          to="/dashboard/requests"
          class="text-sm text-success-600 hover:text-success-500 dark:text-success-400 font-medium"
        >
          View all
        </NuxtLink>
      </div>
    </div>
    
    <div class="overflow-hidden">
      <div v-if="pending" class="p-6">
        <div class="animate-pulse space-y-4">
          <div v-for="i in 3" :key="i" class="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      <table v-else class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Request
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Type
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Date
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="request in recentRequests || []"
            :key="request.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ request.id }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ request.route }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getTypeColor(request.type)
                ]"
              >
                {{ request.type }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getStatusColor(request.status)
                ]"
              >
                {{ request.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(request.date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <NuxtLink
                :to="getRequestDetailUrl(request)"
                class="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <EyeIcon class="w-4 h-4 mr-1" />
                <span>View</span>
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EyeIcon } from '@heroicons/vue/24/outline'
import type { RecentRequest } from './dashboard.model'

// Fetch data from MongoDB
const { data: recentRequests, pending, error } = await useFetch('/api/dashboard/recent-requests')

const getTypeColor = (type: string) => {
  const colors = {
    'Transportation': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Warehousing': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const getStatusColor = (status: string) => {
  const colors = {
    'In Transit': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Stored': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Delivered': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const formatDate = (date: Date | string | undefined) => {
  if (!date) return 'N/A'
  
  // Convert string to Date if needed
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Validate date
  if (isNaN(dateObj.getTime())) {
    console.warn('[YourRequests] Invalid date:', date)
    return 'Invalid date'
  }
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(dateObj)
}

const getRequestDetailUrl = (request: RecentRequest) => {
  if (request.type === 'Transportation') {
    return `/dashboard/requests/transportation/${request.id}`
  } else if (request.type === 'Warehousing') {
    return `/dashboard/requests/warehousing/${request.id}`
  }
  return '/dashboard/requests'
}
</script>
