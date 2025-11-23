import { Shipment, sampleShipments } from '../model/shipments';
import { createApiResponse, simulateApiError } from './utils';

/**
 * Shipments API - Simulates HTTP endpoints for shipment management
 */

/**
 * GET /api/shipments
 * Fetches all shipments with optional filtering
 */
export const fetchShipments = async (filters?: {
  status?: Shipment['route']['status'];
  priority?: Shipment['priority'];
  customer?: string;
  search?: string;
}): Promise<Shipment[]> => {
  simulateApiError(0.02, 'Failed to fetch shipments');
  
  let shipments = [...sampleShipments];
  
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
  
  return createApiResponse(shipments);
};

/**
 * GET /api/shipments/:id
 * Fetches a single shipment by ID
 */
export const fetchShipmentById = async (id: string): Promise<Shipment | null> => {
  simulateApiError(0.02, 'Failed to fetch shipment');
  
  const shipment = sampleShipments.find(s => s.id === id) || null;
  return createApiResponse(shipment);
};

/**
 * PUT /api/shipments/:id
 * Updates shipment information
 */
export const updateShipment = async (id: string, updates: Partial<Shipment>): Promise<Shipment> => {
  simulateApiError(0.03, 'Failed to update shipment');
  
  const existingShipment = sampleShipments.find(s => s.id === id);
  if (!existingShipment) {
    throw new Error('Shipment not found');
  }
  
  const updatedShipment: Shipment = {
    ...existingShipment,
    ...updates
  };
  
  return createApiResponse(updatedShipment);
};

/**
 * PUT /api/shipments/:id/status
 * Updates shipment status
 */
export const updateShipmentStatus = async (id: string, status: Shipment['route']['status']): Promise<Shipment> => {
  simulateApiError(0.03, 'Failed to update shipment status');
  
  const existingShipment = sampleShipments.find(s => s.id === id);
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
  
  return createApiResponse(updatedShipment);
};

/**
 * POST /api/shipments
 * Creates a new shipment
 */
export const createShipment = async (shipmentData: Partial<Shipment>): Promise<Shipment> => {
  simulateApiError(0.03, 'Failed to create shipment');
  
  const newShipment: Shipment = {
    id: `ship-${Date.now()}`,
    name: shipmentData.name!,
    customer: shipmentData.customer!,
    priority: shipmentData.priority || 'medium',
    route: shipmentData.route!,
    createdAt: new Date(),
    dueDate: shipmentData.dueDate
  };
  
  return createApiResponse(newShipment);
};