import { useQuery } from '@tanstack/react-query';
import { getDrivers as fetchDrivers } from '../../http/drivers.http';
import { Driver } from '../../model/drivers';

interface UseDriversListOptions {
  status?: Driver['status'];
  contractType?: Driver['contractType'];
  search?: string;
}

export const useDriversList = (filters?: UseDriversListOptions) => {
  return useQuery({
    queryKey: ['drivers', 'list', filters],
    queryFn: () => fetchDrivers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};