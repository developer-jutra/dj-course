import { useQuery } from '@tanstack/vue-query'
import { ref, readonly, onMounted, watchEffect, unref } from 'vue'
import type { Ref } from 'vue'
import type { WarehousingRequestsFilters, WarehousingRequestItem, PaginatedWarehousingRequests } from './warehousing-requests.model'
import type { WarehousingRequest } from '~/features/warehousing/warehousing-request-details/warehousing-request-details.model'

// API function for getting warehousing requests (moved from global API)
export async function getWarehousingRequestsForListing(filters: any = {}): Promise<WarehousingRequest[]> {
  const query = new URLSearchParams()
  
  if (filters.status) query.append('status', filters.status)
  if (filters.storageType) query.append('storageType', filters.storageType)
  if (filters.priority) query.append('priority', filters.priority)
  if (filters.securityLevel) query.append('securityLevel', filters.securityLevel)
  if (filters.dateFrom) query.append('dateFrom', filters.dateFrom)
  if (filters.dateTo) query.append('dateTo', filters.dateTo)
  
  const queryString = query.toString()
  const url = `/api/warehousing${queryString ? `?${queryString}` : ''}`
  
  return await $fetch(url)
}

// API function for creating warehousing requests (moved from global API)
export async function createWarehousingRequest(data: any) {
  return await $fetch('/api/warehousing', {
    method: 'POST',
    body: data
  })
}

export async function getWarehousingRequests(filters: WarehousingRequestsFilters, page: number = 1, limit: number = 10): Promise<PaginatedWarehousingRequests> {
  const query = new URLSearchParams()
  
  if (filters.status) query.append('status', filters.status)
  if (filters.priority) query.append('priority', filters.priority)
  if (filters.storageType) query.append('storageType', filters.storageType)
  if (filters.securityLevel) query.append('securityLevel', filters.securityLevel)
  if (filters.dateFrom) query.append('dateFrom', filters.dateFrom)
  if (filters.dateTo) query.append('dateTo', filters.dateTo)
  
  const queryString = query.toString()
  const url = `/api/service-requests/warehousing${queryString ? `?${queryString}` : ''}`
  
  const requests = await $fetch(url)
  
  // Transform MongoDB data to WarehousingRequestItem format
  const transformedRequests: WarehousingRequestItem[] = requests.map((req: any) => {
    const storageTypeLabel = req.storageType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())
    return {
      id: req.requestNumber,
      requestNumber: req.requestNumber,
      type: 'Warehousing',
      status: req.status,
      details: `${storageTypeLabel} Storage`,
      subDetails: `${req.cargo?.description || 'N/A'} - ${req.estimatedVolume} m³`,
      date: typeof req.createdAt === 'string' ? new Date(req.createdAt) : req.createdAt,
      priority: req.priority,
      storageType: req.storageType,
      securityLevel: req.securityLevel,
      volume: req.estimatedVolume
    }
  })
  
  // Apply pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedData = transformedRequests.slice(startIndex, endIndex)
  
  return {
    data: paginatedData,
    total: transformedRequests.length,
    page,
    limit
  }
}

// Vue Query composables for paginated requests
export const useWarehousingRequestsPaginated = (filters: Ref<WarehousingRequestsFilters>, page: Ref<number>, limit: number = 10) => {
  return useQuery({
    queryKey: ['warehousingRequests', filters, page, limit],
    queryFn: () => getWarehousingRequests(filters.value, page.value, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
