import { useQuery } from '@tanstack/vue-query'
import { mockWarehousingRequestDetail } from './warehousing-request-details.mocks'

// API function for getting warehousing request details
export async function getWarehousingRequestDetails(id: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Return mock data for now
  return mockWarehousingRequestDetail
}

// Warehousing request details composable
export function useWarehousingRequestDetails(id: string) {
  return useQuery({
    queryKey: ['warehousing-requests', 'details', id],
    queryFn: async () => {
      if (!id) throw new Error('Warehousing request ID is required')
      return await getWarehousingRequestDetails(id)
    },
    enabled: !!id, // Only run query if ID is provided
  })
} 