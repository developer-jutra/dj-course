import { useQuery } from '@tanstack/vue-query'
import type { TransportationRequest } from './transportation-request.model'
import type { PartialTransportationRequestFilters } from './transportation-requests-filter'

export async function getTransportationRequests(filters: PartialTransportationRequestFilters = {}): Promise<TransportationRequest[]> {
  const query = new URLSearchParams()
  
  if (filters.status) query.append('status', filters.status)
  if (filters.serviceType) query.append('serviceType', filters.serviceType)
  if (filters.dateFrom) query.append('dateFrom', filters.dateFrom)
  
  const queryString = query.toString()
  const url = `/api/transportation${queryString ? `?${queryString}` : ''}`
  
  return await $fetch(url)
}

// API function for creating transportation requests (moved from global API)
export async function createTransportationRequest(data: any) {
  return await $fetch('/api/transportation', {
    method: 'POST',
    body: data
  })
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
