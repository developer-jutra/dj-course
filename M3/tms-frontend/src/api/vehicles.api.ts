import { Vehicle, vehicles } from '../model/vehicles';
import { createApiResponse, simulateApiError } from './utils';

/**
 * Vehicles API - Simulates HTTP endpoints for vehicle management
 */

/**
 * GET /api/vehicles
 * Fetches all vehicles with optional filtering
 */
export const fetchVehicles = async (filters?: {
  status?: Vehicle['status'];
  type?: Vehicle['type'];
  search?: string;
}): Promise<Vehicle[]> => {
  simulateApiError(0.02, 'Failed to fetch vehicles');
  
  let allVehicles = [...vehicles];
  
  if (filters) {
    if (filters.status) {
      allVehicles = allVehicles.filter(vehicle => vehicle.status === filters.status);
    }
    if (filters.type) {
      allVehicles = allVehicles.filter(vehicle => vehicle.type === filters.type);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      allVehicles = allVehicles.filter(vehicle => 
        vehicle.plateNumber.toLowerCase().includes(searchLower) ||
        vehicle.make.toLowerCase().includes(searchLower) ||
        vehicle.model.toLowerCase().includes(searchLower) ||
        vehicle.currentDriver?.toLowerCase().includes(searchLower)
      );
    }
  }
  
  return createApiResponse(allVehicles);
};

/**
 * GET /api/vehicles/:id
 * Fetches a single vehicle by ID
 */
export const fetchVehicleById = async (id: string): Promise<Vehicle | null> => {
  simulateApiError(0.02, 'Failed to fetch vehicle');
  
  const vehicle = vehicles.find(v => v.id === id) || null;
  return createApiResponse(vehicle);
};

/**
 * GET /api/vehicles/:id/maintenance
 * Fetches maintenance data for a specific vehicle
 */
export const fetchVehicleMaintenance = async (id: string): Promise<{
  history: Vehicle['maintenanceHistory'];
  tasks: Vehicle['maintenanceTasks'];
}> => {
  simulateApiError(0.02, 'Failed to fetch vehicle maintenance');
  
  const vehicle = vehicles.find(v => v.id === id);
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }
  
  return createApiResponse({
    history: vehicle.maintenanceHistory,
    tasks: vehicle.maintenanceTasks
  });
};

/**
 * GET /api/vehicles/:id/routes
 * Fetches route history for a specific vehicle
 */
export const fetchVehicleRoutes = async (id: string): Promise<Array<{
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  distance: number;
  status: 'active' | 'completed';
}>> => {
  simulateApiError(0.02, 'Failed to fetch vehicle routes');
  
  const vehicle = vehicles.find(v => v.id === id);
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }
  
  // Generate mock route history
  const routes = [];
  const now = new Date();
  
  for (let i = 0; i < 15; i++) {
    const startDate = new Date(now.getTime() - (i * 5 + Math.random() * 3) * 24 * 60 * 60 * 1000);
    const endDate = new Date(startDate.getTime() + (1 + Math.random() * 2) * 24 * 60 * 60 * 1000);
    
    routes.push({
      id: `route-${id}-${i}`,
      name: `Route ${i + 1}`,
      startDate,
      endDate,
      distance: Math.floor(Math.random() * 800 + 200),
      status: i === 0 ? 'active' : 'completed'
    });
  }
  
  return createApiResponse(routes);
};

/**
 * PUT /api/vehicles/:id
 * Updates vehicle information
 */
export const updateVehicle = async (id: string, updates: Partial<Vehicle>): Promise<Vehicle> => {
  simulateApiError(0.03, 'Failed to update vehicle');
  
  const existingVehicle = vehicles.find(v => v.id === id);
  if (!existingVehicle) {
    throw new Error('Vehicle not found');
  }
  
  const updatedVehicle: Vehicle = {
    ...existingVehicle,
    ...updates
  };
  
  return createApiResponse(updatedVehicle);
};

/**
 * PUT /api/vehicles/:id/status
 * Updates vehicle status
 */
export const updateVehicleStatus = async (id: string, status: Vehicle['status']): Promise<Vehicle> => {
  simulateApiError(0.03, 'Failed to update vehicle status');
  
  const existingVehicle = vehicles.find(v => v.id === id);
  if (!existingVehicle) {
    throw new Error('Vehicle not found');
  }
  
  const updatedVehicle: Vehicle = {
    ...existingVehicle,
    status
  };
  
  return createApiResponse(updatedVehicle);
};