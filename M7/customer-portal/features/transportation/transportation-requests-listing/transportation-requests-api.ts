import { useQuery } from '@tanstack/vue-query'
import { mockTransportationRequests } from './transportation-request.mocks'
import type { TransportationRequest } from './transportation-request.model'
import type { PartialTransportationRequestFilters } from './transportation-requests-filter'

export async function getTransportationRequests(filters: PartialTransportationRequestFilters = {}): Promise<TransportationRequest[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700))

  let filteredRequests = [...mockTransportationRequests]
  
  // Apply filters
  if (filters.status) {
    filteredRequests = filteredRequests.filter(req => req.status === filters.status)
  }
  if (filters.serviceType) {
    filteredRequests = filteredRequests.filter(req => req.serviceType === filters.serviceType)
  }
  if (filters.dateFrom) {
    filteredRequests = filteredRequests.filter(req => 
      new Date(req.requestedPickupDate) >= new Date(filters.dateFrom!)
    )
  }
  
  return filteredRequests
}

// API function for creating transportation requests (moved from global API)
export async function createTransportationRequest(data: any) {
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const requestNumber = `TR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
  
  return {
    id: requestNumber,
    requestNumber,
    ...data,
    status: 'SUBMITTED',
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

// TanStack Query composable for transportation requests
export function useTransportationRequestsQuery(filters: Ref<PartialTransportationRequestFilters> | PartialTransportationRequestFilters) {
  return useQuery({
    queryKey: ['transportationRequests', 'listing', { filters: toRef(filters) }],
    queryFn: async () => {
      const filterValue = unref(filters)
      return await getTransportationRequests(filterValue)
    },
    // Keep previous data while loading new data
    placeholderData: (previousData) => previousData,
  })
}
