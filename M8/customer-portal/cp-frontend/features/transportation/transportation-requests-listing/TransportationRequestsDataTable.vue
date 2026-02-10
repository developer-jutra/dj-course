<template>
  <DataTable
    title="Transportation Requests"
    description="Manage your road transportation requests across Europe"
    :data="query.data.value || []"
    :columns="columns"
    :headerActions="headerActions"
    :loading="query.isPending.value"
    :error="query.isError.value"
    :loadingText="'Loading transportation requests...'"
    :errorTitle="'Error Loading Requests'"
    :errorMessage="'There was a problem loading your transportation requests.'"
    :rowActions="rowActions"
    @retry="query.refetch"
  >
    <template #cell-request="{ item }">
      <div class="text-sm font-medium text-gray-900 dark:text-white">
        {{ item.requestNumber }}
      </div>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        {{ item.trackingNumber || 'Not assigned' }}
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
    <template #cell-requestedPickupDate="{ item }">
      <span class="text-sm text-gray-900 dark:text-white">
        {{ formatDate(item.requestedPickupDate) }}
      </span>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { 
  EyeIcon, 
  MapPinIcon,
  DocumentArrowDownIcon
} from '@heroicons/vue/24/outline'
import type { TransportationRequest } from './transportation-request.model'
import DataTable from '~/components/ui-library/datatable/DataTable.vue'
import TransportationServiceBadge from '~/components/badges/TransportationServiceBadge.vue'
import TransportationStatusBadge from '~/components/badges/TransportationStatusBadge.vue'
import { type PartialTransportationRequestFilters } from './transportation-requests-filter'
import { useTransportationRequestsQuery } from './transportation-requests-api'

interface Props {
  filters?: PartialTransportationRequestFilters
}

const props = withDefaults(defineProps<Props>(), {
  filters: () => ({})
})

// Use TanStack Query
const query = useTransportationRequestsQuery(toRef(props, 'filters'))

// Refetch on mount to ensure we have the latest data (especially after creating a new request)
onMounted(() => {
  query.refetch()
})

// Router
const router = useRouter()

// Formatting functions
const formatDate = (date: Date | string | undefined) => {
  if (!date) return 'N/A'
  const dateObj = typeof date === 'string' ? new Date(date) : date
  if (isNaN(dateObj.getTime())) return 'Invalid date'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(dateObj)
}

// Navigation functions
const trackShipment = (trackingNumber: string) => {
  router.push(`/dashboard/tracking?number=${trackingNumber}`)
}

// Header actions
const headerActions = [
  {
    label: 'New Transportation Request',
    handler: () => {
      router.push('/dashboard/transportation/new').catch(() => {})
    },
    variant: 'primary' as const
  }
]

// Table configuration
const columns = [
  {
    key: 'request',
    label: 'Request'
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
    key: 'requestedPickupDate',
    label: 'Pickup Date'
  }
]

const downloadPDF = async (item: TransportationRequest) => {
  // Only run on client side
  if (process.server) return
  
  try {
    // Dynamically import PDF generator only on client side
    const { generateTransportationRequestPDF } = await import('~/lib/pdf/transportationRequestPdfGenerator')
    
    // Convert TransportationRequest to form data structure
    const formData = {
      serviceType: item.serviceType,
      pickupLocation: {
        address: {
          street: item.pickupLocation.address.street || '',
          city: item.pickupLocation.address.city || '',
          country: item.pickupLocation.address.country || ''
        },
        contactPerson: item.pickupLocation.contactPerson || '',
        contactPhone: item.pickupLocation.contactPhone || '',
        contactEmail: item.pickupLocation.contactEmail || '',
        loadingType: item.pickupLocation.loadingType || 'DOCK'
      },
      deliveryLocation: {
        address: {
          street: item.deliveryLocation.address.street || '',
          city: item.deliveryLocation.address.city || '',
          country: item.deliveryLocation.address.country || ''
        },
        contactPerson: item.deliveryLocation.contactPerson || '',
        contactPhone: item.deliveryLocation.contactPhone || '',
        contactEmail: item.deliveryLocation.contactEmail || '',
        loadingType: item.deliveryLocation.loadingType || 'DOCK'
      },
      cargo: {
        description: item.cargo.description || '',
        cargoType: item.cargo.cargoType || 'GENERAL_CARGO',
        weight: item.cargo.weight || 0,
        packaging: item.cargo.packaging || 'PALLETS',
        quantity: item.cargo.quantity || 1,
        unitType: item.cargo.unitType || 'units',
        value: item.cargo.value || 0,
        currency: item.cargo.currency || 'EUR',
        fragile: item.cargo.fragile || false,
        stackable: item.cargo.stackable || true
      },
      requestedPickupDate: item.requestedPickupDate,
      requestedDeliveryDate: item.requestedDeliveryDate,
      specialInstructions: item.specialInstructions,
      requiresInsurance: item.requiresInsurance,
      requiresCustomsClearance: item.requiresCustomsClearance,
      priority: item.priority,
      currency: item.currency || 'EUR'
    }
    
    await generateTransportationRequestPDF(formData, {
      requestNumber: item.requestNumber,
      createdAt: item.createdAt
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Error generating PDF. Please try again.')
  }
}

const rowActions = [
  {
    label: 'View',
    icon: EyeIcon,
    handler: async (item: TransportationRequest) => {
      console.log('View clicked - navigating to:', `/dashboard/requests/transportation/${item.id}`)
      console.log('Item:', item)
      try {
        await navigateTo(`/dashboard/requests/transportation/${item.id}`)
        console.log('Navigation completed')
      } catch (error) {
        console.error('Navigation error:', error)
      }
    }
  },
  {
    label: 'Download PDF',
    icon: DocumentArrowDownIcon,
    handler: (item: TransportationRequest) => {
      downloadPDF(item)
    }
  },
  {
    label: 'Track',
    icon: MapPinIcon,
    handler: (item: TransportationRequest) => {
      if (item.trackingNumber) {
        trackShipment(item.trackingNumber)
      }
    },
    condition: (item: TransportationRequest) => !!item.trackingNumber
  }
]
</script>
