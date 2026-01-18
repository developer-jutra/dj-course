import { useQuery } from '@tanstack/react-query';
import { getDriverDetails as fetchDriverById } from '../../http/drivers.http';

export const useDriverDetails = (id: string) => {
  return useQuery({
    queryKey: ['drivers', 'details', id],
    queryFn: () => fetchDriverById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};