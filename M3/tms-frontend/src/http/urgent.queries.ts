import { useQuery } from '@tanstack/react-query';
import { delay } from '@/http/mock.http';
import { urgentMocks } from './urgent.mocks';

export const useUrgentItems = () => {
  return useQuery({
    queryKey: ['urgent-items'],
    queryFn: async () => {
      await delay(400);
      return urgentMocks;
    },
  });
};
