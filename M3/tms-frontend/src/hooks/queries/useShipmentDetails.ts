import { useQuery } from '@tanstack/react-query';
import { fetchShipmentById } from '../../api/shipments.api';

export const useShipmentDetails = (id: string) => {
  return useQuery({
    queryKey: ['shipments', 'details', id],
    queryFn: () => fetchShipmentById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};