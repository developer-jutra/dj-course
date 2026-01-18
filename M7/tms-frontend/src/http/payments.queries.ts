import { useQuery } from '@tanstack/react-query';
import { getPaymentDetails, getPayments } from './payments.http';

export const usePaymentsQuery = () => {
  return useQuery({
    queryKey: ['payments'],
    queryFn: () => getPayments(),
  });
};

export const usePaymentDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: () => getPaymentDetails(id),
  });
};
