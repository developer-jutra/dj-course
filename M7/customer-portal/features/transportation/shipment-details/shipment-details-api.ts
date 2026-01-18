import { useQuery } from '@tanstack/vue-query'
import { mockShipments } from '~/features/transportation/shipment-listing/shipment.mocks'
import type { Shipment } from '~/features/transportation/shipment-listing/shipment.model'

export async function getShipmentDetails(id: string): Promise<Shipment> {
  await new Promise(resolve => setTimeout(resolve, 500))
  const shipment = mockShipments.find(s => s.id === id)
  if (!shipment) throw new Error('Shipment not found')
  return shipment
}

export function useShipmentDetails(id: string) {
  return useQuery({
    queryKey: ['shipments', 'details', id],
    queryFn: () => getShipmentDetails(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000
  })
} 