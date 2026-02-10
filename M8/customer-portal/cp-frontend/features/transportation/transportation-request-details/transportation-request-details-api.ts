import { useQuery } from '@tanstack/vue-query'
import type { TransportationRequest } from './transportation-request-details.model'

// API function for getting transportation request details
export async function getTransportationRequestDetails(id: string): Promise<TransportationRequest> {
  return await $fetch(`/api/transportation/${id}`)
}

// Transportation request details composable
export function useTransportationRequestDetails(id: string) {
  return useQuery({
    queryKey: ['transportation-requests', 'details', id],
    queryFn: async () => {
      if (!id) throw new Error('Transportation request ID is required')
      return await getTransportationRequestDetails(id)
    },
    enabled: !!id, // Only run query if ID is provided
  })
} 