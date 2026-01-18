import { Shipment } from '../shipments';
import { mockShipments } from './shipment-data';
import { simulateApiError } from '../../http/http-utils';
import { delay } from '../../http/mock-utils';
import { UIShipment } from '../../http/shipments.http'; // Assuming UIShipment is defined there

export async function getMockShipments(filters?: { driver?: string; status?: string; location?: string, priority?: Shipment['priority'], customer?: string, search?: string }): Promise<UIShipment[]> {
  await delay(300, 500);
  simulateApiError(0.02, 'Failed to fetch shipments');

  let shipments = [...mockShipments];
  
  if (filters) {
    if (filters.status) {
      shipments = shipments.filter(shipment => shipment.route.status === filters.status);
    }
    if (filters.priority) {
      shipments = shipments.filter(shipment => shipment.priority === filters.priority);
    }
    if (filters.customer) {
      shipments = shipments.filter(shipment => 
        shipment.customer.toLowerCase().includes(filters.customer!.toLowerCase())
      );
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      shipments = shipments.filter(shipment => 
        shipment.name.toLowerCase().includes(searchLower) ||
        shipment.customer.toLowerCase().includes(searchLower) ||
        shipment.route.vehicle.driver.toLowerCase().includes(searchLower)
      );
    }
  }
  
  const uiShipments: UIShipment[] = shipments.map(s => ({
    id: s.id,
    driver: s.route.vehicle.driver,
    status: s.route.status,
    origin: s.route.points[0]?.name || 'N/A',
    destination: s.route.points[s.route.points.length - 1]?.name || 'N/A',
    eta: s.route.estimatedCompletion.toLocaleString(),
    elapsedTime: "3h 15m",
    distanceCovered: "150km",
    totalDistance: "300km",
    delay: false,
    estimatedDelay: null
  }));

  // Apply filters to mock data
  let filteredShipments = [...uiShipments];
  
  if (filters?.driver) {
    filteredShipments = filteredShipments.filter(s => 
      s.driver.toLowerCase().includes(filters.driver!.toLowerCase())
    );
  }
  if (filters?.status) {
    filteredShipments = filteredShipments.filter(s => 
      s.status.toLowerCase().includes(filters.status!.toLowerCase())
    );
  }
  if (filters?.location) {
    filteredShipments = filteredShipments.filter(s => 
      s.origin.toLowerCase().includes(filters.location!.toLowerCase()) ||
      s.destination.toLowerCase().includes(filters.location!.toLowerCase())
    );
  }
  
  return filteredShipments;
}

export async function getMockShipmentDetails(id: string): Promise<UIShipment | undefined> {
  await delay(300, 500);

  const shipment = mockShipments.find(s => s.id === id);
  if (!shipment) return undefined;

  return {
    id: shipment.id,
    driver: shipment.route.vehicle.driver,
    status: shipment.route.status,
    origin: shipment.route.points[0]?.name || 'N/A',
    destination: shipment.route.points[shipment.route.points.length - 1]?.name || 'N/A',
    eta: shipment.route.estimatedCompletion.toLocaleString(),
    elapsedTime: "3h 15m",
    distanceCovered: "150km",
    totalDistance: "300km",
    delay: false,
    estimatedDelay: null
  };
}
