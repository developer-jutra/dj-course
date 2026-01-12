<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Tracking
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Track your shipments in real-time across Europe
      </p>
    </div>

    <!-- Search Section -->
    <TrackingSearch 
      @search="handleTracking" 
      :loading="isLoading"
      :initial-tracking-number="initialTrackingNumber"
    />

    <!-- Loading State -->
    <div v-if="isLoading" class="card p-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p class="text-gray-500 dark:text-gray-400">Loading tracking details...</p>
    </div>

    <!-- Tracking Results -->
    <div v-else-if="currentTracking" class="space-y-8">
      <!-- Tracking Details -->
      <TrackingDetails :tracking-data="currentTracking" />

      <!-- Map -->
      <TrackingMap :tracking-data="currentTracking" />

      <!-- Progress Timeline -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Tracking Progress
        </h3>
        <Timeline :items="currentTracking.updates" />
      </div>
    </div>

    <!-- No Results -->
    <div v-else-if="searchAttempted && (!currentTracking || isError)" class="card p-8 text-center">
      <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        <ExclamationTriangleIcon class="h-8 w-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        <span v-if="isError">Error Loading Tracking</span>
        <span v-else>Tracking Not Found</span>
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        <span v-if="isError">There was an error loading the tracking details. Please try again.</span>
        <span v-else>We couldn't find tracking information for the number provided.</span>
      </p>
      <p class="text-sm text-gray-400 dark:text-gray-500">
        Please check the tracking number and try again.
      </p>
    </div>

    <!-- Initial State -->
    <div v-else class="card p-8 text-center">
      <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900 mb-4">
        <MapIcon class="h-8 w-8 text-primary-600 dark:text-primary-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Track Your Shipment
      </h3>
      <p class="text-gray-500 dark:text-gray-400">
        Enter a tracking number above to see real-time shipment information and location.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  MapIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import type { TrackingData } from './tracking.model'
import { getTrackingByNumber } from './tracking-api'
import Timeline from '~/components/ui-library/timeline/Timeline.vue'
import TrackingSearch from './TrackingSearch.vue'
import TrackingMap from './TrackingMap.vue'
import TrackingDetails from './TrackingDetails.vue'

const route = useRoute()
const initialTrackingNumber = ref('')
const searchAttempted = ref(false)
const isLoading = ref(false)
const isError = ref(false)
const currentTracking = ref<TrackingData | null>(null)

// Initialize from URL parameter
onMounted(() => {
  const trackingParam = route.query.number as string
  if (trackingParam) {
    initialTrackingNumber.value = trackingParam
    handleTracking(trackingParam)
  }
})

const handleTracking = async (trackingNumber: string) => {
  if (!trackingNumber || !trackingNumber.trim()) return
  
  searchAttempted.value = true
  isLoading.value = true
  isError.value = false
  currentTracking.value = null
  
  try {
    const result = await getTrackingByNumber(trackingNumber.trim())
    currentTracking.value = result
  } catch (error) {
    isError.value = true
    console.error('Error fetching tracking:', error)
  } finally {
    isLoading.value = false
  }
}

const formatServiceType = (type: string) => {
  return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const formatStatus = (status: string) => {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const getStatusColor = (status: string) => {
  const colors = {
    'PICKUP_SCHEDULED': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'PICKED_UP': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'IN_TRANSIT': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'DELIVERED': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const formatDateTime = (dateString: string) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(dateString))
}
</script>
