<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <NuxtLink to="/dashboard/warehousing" class="text-success-600 hover:text-success-500 dark:text-success-400 flex items-center">
          <ArrowLeftIcon class="w-5 h-5 mr-1" />
          Back to Storage
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mt-4">Storage Item {{ id }}</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Detailed view of storage item</p>
      </div>
    </div>

    <div v-if="isLoading" class="card p-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p class="text-gray-500 dark:text-gray-400">Loading item details...</p>
    </div>

    <div v-else-if="isError" class="card p-8 text-center">
      <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
        <ExclamationTriangleIcon class="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Item</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">There was a problem loading the storage item details.</p>
      <button @click="refetch" class="btn-primary">Try Again</button>
    </div>

    <div v-else class="space-y-6">
      <div class="card p-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Cargo Type</dt>
          <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ item.cargoType }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Quantity</dt>
          <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ item.quantity }} {{ item.unitType }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Location</dt>
          <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ item.storageLocation }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
          <dd class="mt-1 text-sm text-gray-900 dark:text-white">
            <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusColor(item.status)]">
              {{ formatStatus(item.status) }}
            </span>
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Arrival Date</dt>
          <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(item.arrivalDate) }}</dd>
        </div>
        <div v-if="item.departureDate">
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Departure Date</dt>
          <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(item.departureDate) }}</dd>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, navigateTo } from '#app'
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { useStorageItemDetails } from './storage-details-api'
import type { StorageItem } from '~/features/warehousing/storage-listing/storage-listing.model'

const route = useRoute()
const id = route.params.id as string
const { data: item, isLoading, isError, refetch } = useStorageItemDetails(id) as unknown as { data: Ref<StorageItem>; isLoading: Ref<boolean>; isError: Ref<boolean>; refetch: () => void }

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

function formatStatus(status: string) {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

function getStatusColor(status: string) {
  const map: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    IN_STORAGE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    DISPATCHED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    REMOVED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return map[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}
</script>
