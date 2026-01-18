import { useQuery } from '@tanstack/vue-query'
import { ref, readonly, onMounted, watchEffect, unref } from 'vue'
import type { Ref } from 'vue'
import { mockWarehousingRequests } from './warehousing-requests.mocks'
import type { WarehousingRequestsFilters, WarehousingRequestItem, PaginatedWarehousingRequests } from './warehousing-requests.model'
import type { WarehousingRequest } from '~/features/warehousing/warehousing-request-details/warehousing-request-details.model'
import { mockWarehousingRequests as detailedMockRequests } from '~/features/warehousing/warehousing-request-details/warehousing-request-details.mocks'

// API function for getting warehousing requests (moved from global API)
export async function getWarehousingRequestsForListing(filters: any = {}): Promise<WarehousingRequest[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700))
  
  let filteredRequests = [...detailedMockRequests]
  
  // Apply filters
  if (filters.status) {
    filteredRequests = filteredRequests.filter(req => req.status === filters.status)
  }
  if (filters.storageType) {
    filteredRequests = filteredRequests.filter(req => req.storageType === filters.storageType)
  }
  if (filters.dateFrom) {
    filteredRequests = filteredRequests.filter(req => 
      new Date(req.plannedStartDate) >= new Date(filters.dateFrom)
    )
  }
  
  return filteredRequests
}

// API function for creating warehousing requests (moved from global API)
export async function createWarehousingRequest(data: any) {
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const requestNumber = `WH-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
  
  return {
    id: requestNumber,
    requestNumber,
    ...data,
    status: 'SUBMITTED',
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

export async function getWarehousingRequests(filters: WarehousingRequestsFilters, page: number = 1, limit: number = 10): Promise<PaginatedWarehousingRequests> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600))
  
  let filteredRequests = [...mockWarehousingRequests]
  
  // Apply filters
  if (filters.status) {
    filteredRequests = filteredRequests.filter(req => req.status === filters.status)
  }
  if (filters.priority) {
    filteredRequests = filteredRequests.filter(req => req.priority === filters.priority)
  }
  if (filters.storageType) {
    filteredRequests = filteredRequests.filter(req => req.storageType === filters.storageType)
  }
  if (filters.securityLevel) {
    filteredRequests = filteredRequests.filter(req => req.securityLevel === filters.securityLevel)
  }
  if (filters.dateFrom) {
    filteredRequests = filteredRequests.filter(req => new Date(req.date) >= new Date(filters.dateFrom))
  }
  if (filters.dateTo) {
    filteredRequests = filteredRequests.filter(req => new Date(req.date) <= new Date(filters.dateTo))
  }
  
  // Apply pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedData = filteredRequests.slice(startIndex, endIndex)
  
  return {
    data: paginatedData,
    total: filteredRequests.length,
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
