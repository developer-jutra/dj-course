import { sampleVehicles } from "../model/vehicles/vehicles.mocks";
import { Vehicle } from "../model/vehicles/vehicle.types";

export type FleetLocation = {
  truckId: string;
  coordinates: {
    latitude: number;
    longitude: number;
  }
  truck: Vehicle;
}

export const mockFleetLocation: FleetLocation[] = sampleVehicles.map(vehicle => {
  return {
    truckId: vehicle.id,
    coordinates: {
      latitude: vehicle.currentLocation?.lat ?? 0,
      longitude: vehicle.currentLocation?.lng ?? 0,
    },
    truck: vehicle,
  }
});
