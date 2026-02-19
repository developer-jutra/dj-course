import { useQuery } from '@tanstack/vue-query'

export async function getWarehousingRequestDetails(id: string) {
  const raw = await $fetch<Record<string, unknown>>(`/api/warehousing-requests/${id}`)
  return {
    ...raw,
    id: raw.id ?? raw.requestNumber,
    plannedStartDate: raw.plannedStartDate ? new Date(raw.plannedStartDate as string) : new Date(),
    plannedEndDate: raw.plannedEndDate ? new Date(raw.plannedEndDate as string) : undefined,
    createdAt: raw.createdAt ? new Date(raw.createdAt as string) : new Date(),
    updatedAt: raw.updatedAt ? new Date(raw.updatedAt as string) : new Date(),
    progressUpdates: (raw.progressUpdates as Array<Record<string, unknown>> || []).map((p) => ({
      ...p,
      timestamp: p.timestamp ? new Date(p.timestamp as string) : new Date()
    }))
  }
}

export function useWarehousingRequestDetails(id: string) {
  return useQuery({
    queryKey: ['warehousing-requests', 'details', id],
    queryFn: async () => {
      if (!id) throw new Error('Warehousing request ID is required')
      return await getWarehousingRequestDetails(id)
    },
    enabled: !!id,
  })
}
