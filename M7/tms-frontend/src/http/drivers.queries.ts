import { useQuery } from "@tanstack/react-query";
import { getDriverDetails, getDrivers, getDriverShipments } from "./drivers.http";

export const useDriversQuery = () => {
  return useQuery({
    queryKey: ['drivers'],
    queryFn: async () => {
      return await getDrivers();
    },
  });
};

export const useDriverDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: ['drivers', id],
    queryFn: () => getDriverDetails(id),
  });
};

export const useDriverShipmentsQuery = (driverId: string) => {
  return useQuery({
    queryKey: ['drivers', driverId, 'shipments'],
    queryFn: () => getDriverShipments(driverId),
  });
};
