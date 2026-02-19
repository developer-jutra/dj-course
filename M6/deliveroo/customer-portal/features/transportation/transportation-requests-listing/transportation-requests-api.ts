import { useQuery } from '@tanstack/vue-query'
import type { TransportationRequest } from './transportation-request.model'
import type { PartialTransportationRequestFilters } from './transportation-requests-filter'

async function fetchFromApi(filters: PartialTransportationRequestFilters): Promise<TransportationRequest[]> {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.serviceType) params.set('serviceType', filters.serviceType)
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom)
  const qs = params.toString()
  const url = `/api/transportation-requests${qs ? `?${qs}` : ''}`
  const raw = await $fetch<Array<Record<string, unknown>>>(url)
  if (!raw?.length) return []
  return raw.map((r) => ({
    ...r,
    id: r.id ?? r.requestNumber,
    requestedPickupDate: r.requestedPickupDate ? new Date(r.requestedPickupDate as string) : new Date(),
    requestedDeliveryDate: r.requestedDeliveryDate ? new Date(r.requestedDeliveryDate as string) : new Date(),
    createdAt: r.createdAt ? new Date(r.createdAt as string) : new Date(),
    updatedAt: r.updatedAt ? new Date(r.updatedAt as string) : new Date()
  })) as TransportationRequest[]
}

export async function getTransportationRequests(filters: PartialTransportationRequestFilters = {}): Promise<TransportationRequest[]> {
  return await fetchFromApi(filters)
}

export async function createTransportationRequest(data: Record<string, unknown>): Promise<{ success: boolean; message: string; requestNumber: string }> {
  const response = await $fetch<{ success: boolean; message: string; requestNumber: string }>('/api/transportation-requests', {
    method: 'POST',
    body: data
  })
  return response
}

export function useTransportationRequestsQuery(filters: Ref<PartialTransportationRequestFilters> | PartialTransportationRequestFilters) {
  return useQuery({
    queryKey: ['transportationRequests', 'listing', { filters: toRef(filters) }],
    queryFn: async () => {
      const filterValue = unref(filters)
      return await getTransportationRequests(filterValue)
    },
    placeholderData: (previousData) => previousData,
  })
}
