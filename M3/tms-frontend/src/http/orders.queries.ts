import { useQuery } from '@tanstack/react-query';
import { getOrderDetails, getOrders } from './orders.http';

export const useOrdersQuery = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => getOrders(),
  });
};

export const useOrderDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderDetails(id),
  });
};
