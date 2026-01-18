import { useQuery } from '@tanstack/react-query';
import { getOrderDetails, getOrders, getOrderEvents } from './orders.http';

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
    // enabled: !!id,
  });
};

export const useOrderEventsQuery = (orderId: string) => {
  return useQuery({
    queryKey: ['orders', orderId, 'events'],
    queryFn: () => getOrderEvents(orderId),
    // enabled: !!orderId,
  });
};

