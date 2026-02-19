<template>
  <DataTable
    title="Shipments"
    description="Manage your active shipments across Europe"
    :data="query.data.value || []"
    :columns="columns"
    :loading="query.isPending.value"
    :error="query.isError.value"
    :loadingText="'Loading shipments...'"
    :errorTitle="'Error Loading Shipments'"
    :errorMessage="'There was a problem loading your shipments.'"
    :rowActions="rowActions"
    @retry="query.refetch"
  >
    <template #cell-shipment="{ item }">
      <div class="text-sm font-medium text-gray-900 dark:text-white">
        {{ item.shipmentNumber }}
      </div>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        {{ item.trackingNumber }}
      </div>
    </template>
    <template #cell-route="{ item }">
      <div class="text-sm text-gray-900 dark:text-white">
        {{ item.pickupLocation.address.city }} → {{ item.deliveryLocation.address.city }}
      </div>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        {{ item.pickupLocation.address.country }} → {{ item.deliveryLocation.address.country }}
      </div>
    </template>
    <template #cell-serviceType="{ item }">
      <TransportationServiceBadge :serviceType="item.serviceType" />
    </template>
    <template #cell-status="{ item }">
      <TransportationStatusBadge :status="item.status" />
    </template>
    <template #cell-scheduledPickupDate="{ item }">
      <span class="text-sm text-gray-900 dark:text-white">
        {{ formatDate(item.scheduledPickupDate) }}
      </span>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { 
  EyeIcon, 
  MapPinIcon
} from '@heroicons/vue/24/outline'
import type { Shipment } from './shipment.model'
import DataTable from '~/components/ui-library/datatable/DataTable.vue'
import { useShipmentsQuery } from './shipment-api'
import TransportationServiceBadge from '~/components/badges/TransportationServiceBadge.vue'
import TransportationStatusBadge from '~/components/badges/TransportationStatusBadge.vue'
import { inject, toRef } from 'vue'
import type { useShipmentsListingStore } from './shipments-listing.store'

// Use TanStack Query
const store = inject<ReturnType<typeof useShipmentsListingStore>>('shipmentsListing')
const query = useShipmentsQuery(toRef(store!, 'filters'))

// Formatting functions
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

// Navigation functions
const trackShipment = async (trackingNumber: string) => {
  await navigateTo(`/dashboard/tracking?number=${trackingNumber}`)
}

// Table configuration
const columns = [
  {
    key: 'shipment',
    label: 'Shipment'
  },
  {
    key: 'route',
    label: 'Route'
  },
  {
    key: 'serviceType',
    label: 'Service Type'
  },
  {
    key: 'status',
    label: 'Status'
  },
  {
    key: 'scheduledPickupDate',
    label: 'Pickup Date'
  }
]

const rowActions = [
  {
    label: 'View',
    icon: EyeIcon,
    handler: async (item: Shipment) => {
      console.log('View clicked - navigating to:', `/dashboard/transportation/${item.id}`)
      try {
        await navigateTo(`/dashboard/transportation/${item.id}`)
        console.log('Navigation completed')
      } catch (error) {
        console.error('Navigation error:', error)
      }
    }
  },
  {
    label: 'Track',
    icon: MapPinIcon,
    handler: async (item: Shipment) => {
      await trackShipment(item.trackingNumber)
    }
  }
]
</script> 