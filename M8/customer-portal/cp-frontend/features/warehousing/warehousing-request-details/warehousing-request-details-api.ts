import { useQuery } from '@tanstack/vue-query'
import type { WarehousingRequest } from './warehousing-request-details.model'

// API function for getting warehousing request details
export async function getWarehousingRequestDetails(id: string): Promise<WarehousingRequest> {
  return await $fetch(`/api/warehousing/${id}`)
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