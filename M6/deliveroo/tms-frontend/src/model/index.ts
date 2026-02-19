// Main model index file that sets up cross-references and exports everything
import { mockVehicles } from './vehicles';
import { mockDrivers } from './drivers';
import { setVehicleEntities, setDriverEntities, getDocumentEntities } from './documents';
import { DocumentEntity } from './documents';

// Convert vehicles to document entities
const vehicleEntities: DocumentEntity[] = mockVehicles.map(vehicle => ({
  id: vehicle.id,
  name: `${vehicle.make} ${vehicle.model} (${vehicle.plateNumber})`,
  type: 'vehicle' as const
}));

// Convert drivers to document entities
const driverEntities: DocumentEntity[] = mockDrivers.map(driver => ({
  id: driver.id,
  name: driver.name,
  type: 'driver' as const
}));

// Set up cross-references
setVehicleEntities(vehicleEntities);
setDriverEntities(driverEntities);

// Export everything
export * from './documents';
export * from './drivers';
export * from './vehicles';
export * from './shipments';

// Export the combined document entities
export const documentEntities = getDocumentEntities();