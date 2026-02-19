import { useQuery } from '@tanstack/vue-query'
import { mockShipments } from './shipment.mocks'
import type { Shipment } from './shipment.model'
import type { PartialShipmentFilters } from './shipment-filters'

export async function getShipments(filters: PartialShipmentFilters = {}): Promise<Shipment[]> {
  let filteredShipments = [...mockShipments]
  
  // Apply filters
  if (filters.status) {
    filteredShipments = filteredShipments.filter(shipment => shipment.status === filters.status)
  }
  if (filters.serviceType) {
    filteredShipments = filteredShipments.filter(shipment => shipment.serviceType === filters.serviceType)
  }
  if (filters.dateFrom) {
    filteredShipments = filteredShipments.filter(shipment => 
      new Date(shipment.scheduledPickupDate) >= new Date(filters.dateFrom!)
    )
  }
  
  return filteredShipments
}

// TanStack Query composable for shipments
export function useShipmentsQuery(filters: Ref<PartialShipmentFilters> | PartialShipmentFilters) {
  return useQuery({
    queryKey: ['shipments', 'listing', { filters: toRef(filters) }],
    queryFn: async () => {
      const filterValue = unref(filters)
      return await getShipments(filterValue)
    },
    // Keep previous data while loading new data
    placeholderData: (previousData) => previousData,
  })
} 