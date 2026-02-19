import { useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import type { WarehousingRequestsFilters, PaginatedWarehousingRequests } from './warehousing-requests.model'

async function fetchFromApi(
  filters: WarehousingRequestsFilters,
  page: number,
  limit: number
): Promise<PaginatedWarehousingRequests> {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.priority) params.set('priority', filters.priority)
  if (filters.storageType) params.set('storageType', filters.storageType)
  if (filters.securityLevel) params.set('securityLevel', filters.securityLevel)
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom)
  if (filters.dateTo) params.set('dateTo', filters.dateTo)
  params.set('page', String(page))
  params.set('limit', String(limit))
  const url = `/api/warehousing-requests?${params.toString()}`
  const raw = await $fetch<PaginatedWarehousingRequests>(url)
  return {
    ...raw,
    data: raw.data.map((r) => ({
      ...r,
      date: r.date ? new Date(r.date as string) : new Date()
    }))
  }
}

export async function getWarehousingRequests(
  filters: WarehousingRequestsFilters,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedWarehousingRequests> {
  return await fetchFromApi(filters, page, limit)
}

export async function createWarehousingRequest(data: Record<string, unknown>): Promise<{ success: boolean; message: string; requestNumber: string }> {
  const response = await $fetch<{ success: boolean; message: string; requestNumber: string }>('/api/warehousing-requests', {
    method: 'POST',
    body: data
  })
  return response
}

export function useWarehousingRequestsPaginated(
  filters: Ref<WarehousingRequestsFilters>,
  page: Ref<number>,
  limit: number = 10
) {
  return useQuery({
    queryKey: ['warehousingRequests', filters, page, limit],
    queryFn: () => getWarehousingRequests(filters.value, page.value, limit),
    staleTime: 5 * 60 * 1000,
  })
}
