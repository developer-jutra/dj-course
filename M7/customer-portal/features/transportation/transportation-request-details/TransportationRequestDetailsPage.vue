<template>
  <div>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <div class="flex items-center space-x-4 mb-2">
          <NuxtLink
            to="/dashboard/requests"
            class="text-success-600 hover:text-success-500 dark:text-success-400 flex items-center"
          >
            <ArrowLeftIcon class="w-5 h-5 mr-1" />
            Back to Requests
          </NuxtLink>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Transportation Request {{ requestId }}
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Detailed view of your transportation request
        </p>
      </div>
      <div class="flex space-x-3">
        <button
          v-if="request?.trackingNumber"
          @click="trackShipment"
          class="btn-outline"
        >
          <MapIcon class="w-5 h-5 mr-2" />
          Track Shipment
        </button>
        <button
          v-if="request"
          @click="downloadPDF"
          :disabled="pdfLoading"
          class="btn-primary"
        >
          <DocumentArrowDownIcon class="w-5 h-5 mr-2" />
          <span v-if="!pdfLoading">Download PDF</span>
          <span v-else>Generating PDF...</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="card p-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p class="text-gray-500 dark:text-gray-400">Loading request details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="card p-8 text-center">
      <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
        <ExclamationTriangleIcon class="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Error Loading Request
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        There was a problem loading the transportation request details.
      </p>
      <button 
        @click="() => refetch()" 
        class="btn-primary"
      >
        Try Again
      </button>
    </div>

    <div v-else-if="request" class="space-y-8">
      <!-- Request Overview -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            Request Overview
          </h2>
          <span
            :class="[
              'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
              getStatusColor(request.status)
            ]"
          >
            {{ formatStatus(request.status) }}
          </span>
        </div>
        
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Request Number</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ request.requestNumber }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Service Type</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatServiceType(request.serviceType) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Priority</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatStatus(request.priority) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Tracking Number</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ request.trackingNumber || 'Not assigned' }}</dd>
          </div>
        </div>
      </div>

      <!-- Route Information -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Route Information
        </h3>
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Pickup Location
            </h4>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div class="space-y-2 text-sm">
                <p class="font-medium text-gray-900 dark:text-white">{{ request.pickupLocation.address.street }}</p>
                <p class="text-gray-600 dark:text-gray-300">{{ request.pickupLocation.address.city }}, {{ request.pickupLocation.address.country }}</p>
                <div class="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                  <p class="text-gray-600 dark:text-gray-300">Contact: {{ request.pickupLocation.contactPerson }}</p>
                  <p class="text-gray-600 dark:text-gray-300">Phone: {{ request.pickupLocation.contactPhone }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              Delivery Location
            </h4>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div class="space-y-2 text-sm">
                <p class="font-medium text-gray-900 dark:text-white">{{ request.deliveryLocation.address.street }}</p>
                <p class="text-gray-600 dark:text-gray-300">{{ request.deliveryLocation.address.city }}, {{ request.deliveryLocation.address.country }}</p>
                <div class="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                  <p class="text-gray-600 dark:text-gray-300">Contact: {{ request.deliveryLocation.contactPerson }}</p>
                  <p class="text-gray-600 dark:text-gray-300">Phone: {{ request.deliveryLocation.contactPhone }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cargo Information -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Cargo Information
        </h3>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Description</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ request.cargo.description }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Weight</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ request.cargo.weight }} kg</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Packaging</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatPackaging(request.cargo.packaging) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Quantity</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ request.cargo.quantity }} {{ request.cargo.unitType }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Value</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">€{{ request.cargo.value?.toLocaleString() || 'Not specified' }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Special Handling</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              <div class="flex flex-wrap gap-2">
                <span v-if="request.cargo.fragile" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  Fragile
                </span>
                <span v-if="request.requiresInsurance" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Insured
                </span>
                <span v-if="!request.cargo.fragile && !request.requiresInsurance" class="text-gray-500 dark:text-gray-400">
                  None
                </span>
              </div>
            </dd>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Request Timeline
        </h3>
        <Timeline :items="request.progressUpdates" />
      </div>

      <!-- Pricing Information -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Pricing Information
        </h3>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Estimated Cost</dt>
            <dd class="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
              <span v-if="request.estimatedCost">€{{ request.estimatedCost.toLocaleString() }}</span>
              <span v-else>Pending quote</span>
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Final Cost</dt>
            <dd class="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
              <span v-if="request.finalCost">€{{ request.finalCost.toLocaleString() }}</span>
              <span v-else>Not finalized</span>
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Currency</dt>
            <dd class="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{{ request.currency }}</dd>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!isLoading" class="card p-8 text-center">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Request Not Found
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        The transportation request you're looking for doesn't exist or you don't have permission to view it.
      </p>
      <NuxtLink
        to="/dashboard/requests"
        class="btn-primary"
      >
        Back to Requests
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeftIcon,
  MapIcon,
  DocumentArrowDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import { useTransportationRequestDetails } from '~/features/transportation/transportation-request-details/transportation-request-details-api'
import type { TransportationRequest } from '~/features/transportation/transportation-request-details/transportation-request-details.model'
import Timeline from '~/components/ui-library/timeline/Timeline.vue'

const route = useRoute()
const requestId = route.params.id as string
const pdfLoading = ref(false)

// Use TanStack Query composable
const { data: request, isLoading, isError, refetch } = useTransportationRequestDetails(requestId)

const loadTransportationRequest = async () => {
  if (!requestId) return
  
  isLoading.value = true
  isError.value = false
  
  try {
    await refetch()
  } catch (error) {
    isError.value = true
    console.error('Error fetching transportation request details:', error)
  } finally {
    isLoading.value = false
  }
}

const formatServiceType = (type: string) => {
  return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const formatPackaging = (packaging: string) => {
  return packaging.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const formatStatus = (status: string) => {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const getStatusColor = (status: string) => {
  const colors = {
    'SUBMITTED': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'IN_PROGRESS': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'IN_TRANSIT': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'DELIVERED': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const trackShipment = () => {
  if (request.value?.trackingNumber) {
    navigateTo(`/dashboard/tracking?number=${request.value.trackingNumber}`)
  }
}

const downloadPDF = async () => {
  if (!request.value) return
  
  // Only run on client side
  if (process.server) return
  
  pdfLoading.value = true
  
  try {
    // Dynamically import PDF generator only on client side
    const { PDFGenerator } = await import('~/lib/pdf/pdfGenerator')
    
    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 500))
    
    await PDFGenerator.generateTransportationRequestPDF(request.value)
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Error generating PDF. Please try again.')
  } finally {
    pdfLoading.value = false
  }
}
</script>