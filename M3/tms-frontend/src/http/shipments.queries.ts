import { useQuery } from '@tanstack/react-query';
import { getShipments, getShipmentDetails, getShipmentTrackingEvents } from '@/http/shipments.http';

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
    enabled: !!id,
  });
};

export const useShipmentTrackingEventsQuery = (shipmentId: string) => {
  return useQuery({
    queryKey: ['shipments', shipmentId, 'tracking-events'],
    queryFn: () => getShipmentTrackingEvents(shipmentId),
    enabled: !!shipmentId,
  });
};
