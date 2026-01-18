import { mockShipments, createMockRoute } from './shipment-data';

export const getMockShipments = (filters?: { driver?: string; status?: string; location?: string, priority?: Shipment['priority'], customer?: string, search?: string }): Shipment[] => {
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
    if (filters?.driver) {
      shipments = shipments.filter(s => 
        s.route.vehicle.driver.toLowerCase().includes(filters.driver!.toLowerCase())
      );
    }
    if (filters?.status) {
      shipments = shipments.filter(s => 
        s.route.status.toLowerCase().includes(filters.status!.toLowerCase())
      );
    }
    if (filters?.location) {
      shipments = shipments.filter(s => 
        (s.route.points[0]?.name.toLowerCase().includes(filters.location!.toLowerCase()) ||
        s.route.points[s.route.points.length - 1]?.name.toLowerCase().includes(filters.location!.toLowerCase()))
      );
    }
  }
  
  return shipments;
}

export const getMockShipmentDetails = (id: string): UIShipment | undefined => {
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

export const mockUpdateShipment = (id: string, updates: Partial<Shipment>): Shipment => {
  const existingShipment = mockShipments.find(s => s.id === id);
  if (!existingShipment) {
    throw new Error('Shipment not found');
  }
  
  const updatedShipment: Shipment = {
    ...existingShipment,
    ...updates
  };
  
  return updatedShipment;
}

export const mockUpdateShipmentStatus = (id: string, status: Shipment['route']['status']): Shipment => {
  const existingShipment = mockShipments.find(s => s.id === id);
  if (!existingShipment) {
    throw new Error('Shipment not found');
  }
  
  const updatedShipment: Shipment = {
    ...existingShipment,
    route: {
      ...existingShipment.route,
      status
    }
  };
  
  return updatedShipment;
}

export const mockCreateShipment = (shipmentData: Partial<Shipment>): Shipment => {
  const newShipment: Shipment = {
    id: `ship-${Date.now()}`,
    name: shipmentData.name!,
    customer: shipmentData.customer!,
    priority: shipmentData.priority || 'medium',
    route: shipmentData.route!,
    createdAt: new Date(),
    dueDate: shipmentData.dueDate
  };
  
  return newShipment;
}