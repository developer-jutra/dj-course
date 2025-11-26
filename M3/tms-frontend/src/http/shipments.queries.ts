import { useQuery } from '@tanstack/react-query';
import { getShipments, getShipmentDetails } from '@/http/shipments.http';

export const useShipmentsQuery = (filters?: { driver?: string; status?: string; location?: string }) => {
  return useQuery({
    queryKey: ['shipments', filters],
    queryFn: () => getShipments(filters),
  });
};

export const useShipmentDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: ['shipment', id],
    queryFn: () => getShipmentDetails(id),
  });
};
