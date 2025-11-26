import { Driver, sampleDrivers } from '../model/drivers';
import { createApiResponse, simulateApiError } from './utils';

/**
 * Drivers API - Simulates HTTP endpoints for driver management
 */

/**
 * GET /api/drivers
 * Fetches all drivers with optional filtering
 */
export const fetchDrivers = async (filters?: {
  status?: Driver['status'];
  contractType?: Driver['contractType'];
  search?: string;
}): Promise<Driver[]> => {
  simulateApiError(0.02, 'Failed to fetch drivers');
  
  let drivers = [...sampleDrivers];
  
  if (filters) {
    if (filters.status) {
      drivers = drivers.filter(driver => driver.status === filters.status);
    }
    if (filters.contractType) {
      drivers = drivers.filter(driver => driver.contractType === filters.contractType);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      drivers = drivers.filter(driver => 
        driver.name.toLowerCase().includes(searchLower) ||
        driver.email.toLowerCase().includes(searchLower) ||
        driver.phone.includes(filters.search!)
      );
    }
  }
  
  return createApiResponse(drivers);
};

/**
 * GET /api/drivers/:id
 * Fetches a single driver by ID
 */
export const fetchDriverById = async (id: string): Promise<Driver | null> => {
  simulateApiError(0.02, 'Failed to fetch driver');
  
  const driver = sampleDrivers.find(d => d.id === id) || null;
  return createApiResponse(driver);
};

/**
 * GET /api/drivers/:id/routes
 * Fetches routes for a specific driver
 */
export const fetchDriverRoutes = async (id: string): Promise<Driver['routes']> => {
  simulateApiError(0.02, 'Failed to fetch driver routes');
  
  const driver = sampleDrivers.find(d => d.id === id);
  if (!driver) {
    throw new Error('Driver not found');
  }
  
  return createApiResponse(driver.routes);
};

/**
 * GET /api/drivers/:id/calendar
 * Fetches calendar events for a specific driver
 */
export const fetchDriverCalendar = async (id: string): Promise<Driver['calendarEvents']> => {
  simulateApiError(0.02, 'Failed to fetch driver calendar');
  
  const driver = sampleDrivers.find(d => d.id === id);
  if (!driver) {
    throw new Error('Driver not found');
  }
  
  return createApiResponse(driver.calendarEvents);
};

/**
 * PUT /api/drivers/:id
 * Updates driver information
 */
export const updateDriver = async (id: string, updates: Partial<Driver>): Promise<Driver> => {
  simulateApiError(0.03, 'Failed to update driver');
  
  const existingDriver = sampleDrivers.find(d => d.id === id);
  if (!existingDriver) {
    throw new Error('Driver not found');
  }
  
  const updatedDriver: Driver = {
    ...existingDriver,
    ...updates
  };
  
  return createApiResponse(updatedDriver);
};

/**
 * PUT /api/drivers/:id/status
 * Updates driver status
 */
export const updateDriverStatus = async (id: string, status: Driver['status']): Promise<Driver> => {
  simulateApiError(0.03, 'Failed to update driver status');
  
  const existingDriver = sampleDrivers.find(d => d.id === id);
  if (!existingDriver) {
    throw new Error('Driver not found');
  }
  
  const updatedDriver: Driver = {
    ...existingDriver,
    status
  };
  
  return createApiResponse(updatedDriver);
};