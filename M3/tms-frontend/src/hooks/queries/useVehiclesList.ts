import { useQuery } from '@tanstack/react-query';
import { fetchVehicles } from '../../api/vehicles.api';
import { Vehicle } from '../../model/vehicles';

interface UseVehiclesListOptions {
  status?: Vehicle['status'];
  type?: Vehicle['type'];
  search?: string;
}

export const useVehiclesList = (filters?: UseVehiclesListOptions) => {
  return useQuery({
    queryKey: ['vehicles', 'list', filters],
    queryFn: () => fetchVehicles(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};