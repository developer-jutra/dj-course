import { useQuery } from '@tanstack/react-query';
import { fetchVehicleById } from '../../api/vehicles.api';

export const useVehicleDetails = (id: string) => {
  return useQuery({
    queryKey: ['vehicles', 'details', id],
    queryFn: () => fetchVehicleById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};