import { useQuery } from '@tanstack/vue-query'

export async function getTransportationRequestDetails(id: string) {
  const raw = await $fetch<Record<string, unknown>>(`/api/transportation-requests/${id}`)
  return {
    ...raw,
    id: raw.id ?? raw.requestNumber,
    requestedPickupDate: raw.requestedPickupDate ? new Date(raw.requestedPickupDate as string) : new Date(),
    requestedDeliveryDate: raw.requestedDeliveryDate ? new Date(raw.requestedDeliveryDate as string) : new Date(),
    createdAt: raw.createdAt ? new Date(raw.createdAt as string) : new Date(),
    updatedAt: raw.updatedAt ? new Date(raw.updatedAt as string) : new Date(),
    progressUpdates: (raw.progressUpdates as Array<Record<string, unknown>> || []).map((p) => ({
      ...p,
      timestamp: p.timestamp ? new Date(p.timestamp as string) : new Date()
    }))
  }
}

export function useTransportationRequestDetails(id: string) {
  return useQuery({
    queryKey: ['transportation-requests', 'details', id],
    queryFn: async () => {
      if (!id) throw new Error('Transportation request ID is required')
      return await getTransportationRequestDetails(id)
    },
    enabled: !!id,
  })
}
