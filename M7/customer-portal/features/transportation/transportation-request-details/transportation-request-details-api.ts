import { useQuery } from '@tanstack/vue-query'
import { mockTransportationRequestDetail } from './transportation-request-details.mocks'

// API function for getting transportation request details
export async function getTransportationRequestDetails(id: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Return mock data for now
  return mockTransportationRequestDetail
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