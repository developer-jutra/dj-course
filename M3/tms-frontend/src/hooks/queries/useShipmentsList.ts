import { useQuery } from '@tanstack/react-query';
import { getShipments as fetchShipments } from '../../http/shipments.http';
import { Shipment } from '../../model/shipments';

interface UseShipmentsListOptions {
  status?: Shipment['route']['status'];
  priority?: Shipment['priority'];
  customer?: string;
  search?: string;
}

export const useShipmentsList = (filters?: UseShipmentsListOptions) => {
  return useQuery({
    queryKey: ['shipments', 'list', filters],
    queryFn: () => fetchShipments(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent for active shipments)
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};