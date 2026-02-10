<template>
  <div class="card">
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">
          Active Deliveries
        </h2>
        <NuxtLink
          to="/dashboard/tracking"
          class="text-sm text-success-600 hover:text-success-500 dark:text-success-400 font-medium"
        >
          Track all shipments
        </NuxtLink>
      </div>
    </div>
    
    <div v-if="loading" class="p-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p class="text-gray-500 dark:text-gray-400">Loading active deliveries...</p>
    </div>
    
    <div v-else-if="error" class="p-8 text-center">
      <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
        <ExclamationTriangleIcon class="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Error Loading Deliveries
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        There was a problem loading your active deliveries.
      </p>
      <button 
        @click="loadActiveDeliveries" 
        class="btn-primary"
      >
        Try Again
      </button>
    </div>
    
    <div v-else-if="activeDeliveries.length === 0" class="p-8 text-center">
      <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        <TruckIcon class="h-8 w-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        No Active Deliveries
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        You don't have any shipments in transit at the moment.
      </p>
      <NuxtLink
        to="/dashboard/transportation/new"
        class="btn-primary"
      >
        Create New Shipment
      </NuxtLink>
    </div>
    
    <div v-else class="overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Tracking #
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Route
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Service
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Current Location
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Est. Delivery
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="delivery in activeDeliveries"
            :key="delivery.trackingNumber"
            class="hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
              {{ delivery.trackingNumber }}
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              <div class="flex items-center space-x-1">
                <span class="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                <span class="truncate max-w-[80px]">{{ delivery.origin.split(',')[0] }}</span>
                <ArrowRightIcon class="w-3 h-3 text-gray-400 flex-shrink-0" />
                <span class="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                <span class="truncate max-w-[80px]">{{ delivery.destination.split(',')[0] }}</span>
              </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {{ formatServiceType(delivery.serviceType) }}
              </span>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              <div class="truncate max-w-[120px]">{{ getCurrentLocation(delivery) }}</div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ formatDateTime(delivery.estimatedDelivery) }}
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
              <button
                @click="trackShipment(delivery.trackingNumber)"
                class="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <MapPinIcon class="w-4 h-4 mr-1" />
                <span>Track</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  MapPinIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  TruckIcon
} from '@heroicons/vue/24/outline'
import { getAllTracking } from '~/features/tracking/tracking-api'
import type { TrackingData } from '~/features/tracking/tracking.model'

const activeDeliveries = ref<TrackingData[]>([])
const loading = ref(false)
const error = ref(false)

const loadActiveDeliveries = async () => {
  loading.value = true
  error.value = false
  
  try {
    const allTracking = await getAllTracking()
    // Filter for active deliveries (in transit and scheduled)
    activeDeliveries.value = Object.values(allTracking).filter(
      tracking => tracking.status === 'IN_TRANSIT' || tracking.status === 'PICKUP_SCHEDULED'
    )
  } catch (err) {
    error.value = true
    console.error('Error loading active deliveries:', err)
  } finally {
    loading.value = false
  }
}

const formatServiceType = (type: string) => {
  return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const formatDateTime = (dateString?: string) => {
  if (!dateString) return 'Not available'
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

const getCurrentLocation = (delivery: TrackingData) => {
  // Find the current location from tracking events
  const currentEvent = delivery.trackingEvents.find(event => event.type === 'current')
  if (currentEvent) {
    return currentEvent.name
  }
  
  // If no current event, find the last completed event
  const completedEvents = delivery.trackingEvents
    .filter(event => event.isCompleted)
    .sort((a, b) => {
      if (!a.actualTime || !b.actualTime) return 0
      return new Date(b.actualTime).getTime() - new Date(a.actualTime).getTime()
    })
  
  if (completedEvents.length > 0) {
    return completedEvents[0].name
  }
  
  return 'Unknown'
}

const trackShipment = (trackingNumber: string) => {
  navigateTo(`/dashboard/tracking?number=${trackingNumber}`)
}

// Load active deliveries on mount
onMounted(() => {
  loadActiveDeliveries()
})
</script>
