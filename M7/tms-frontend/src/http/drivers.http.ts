import { Driver } from '../model/drivers/driver.types';
import {
  mockGetDrivers,
  mockGetDriverDetails,
  mockGetDriverShipments,
  mockFetchDriverRoutes,
  mockFetchDriverCalendar,
  mockUpdateDriver,
  mockUpdateDriverStatus,
} from '../model/drivers/drivers.mocks';
import { API_BASE_URL } from './http.config';
import { getAuthHeaders } from '../auth/session.token';
import { delay, MOCK_MODE } from './mock-utils';
import { UIShipment } from '../model/shipments/ui.types';
import { simulateApiError } from './http-utils';

export async function getDrivers(filters?: {
  status?: Driver['status'];
  contractType?: Driver['contractType'];
  search?: string;
}): Promise<Driver[]> {
  if (MOCK_MODE) {
    simulateApiError(0.02, 'Failed to fetch drivers');
    await delay(300, 500);
    return mockGetDrivers(filters);
  }

  const queryParams = new URLSearchParams();
  if (filters?.status) queryParams.append('status', filters.status);
  if (filters?.contractType) queryParams.append('contractType', filters.contractType);
  if (filters?.search) queryParams.append('search', filters.search);

  const response = await fetch(`${API_BASE_URL}/drivers?${queryParams.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function getDriverDetails(id: string): Promise<Driver | null> {
  if (MOCK_MODE) {
    simulateApiError(0.02, 'Failed to fetch driver');
    await delay(300, 500);
    return mockGetDriverDetails(id);
  }

  const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function getDriverShipments(id: Driver['id']): Promise<UIShipment[]> {
  if (MOCK_MODE) {
    await delay(300, 500);
    return mockGetDriverShipments(id);
  }

  const response = await fetch(`${API_BASE_URL}/drivers/${id}/shipments`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export const fetchDriverRoutes = async (id: string): Promise<Driver['routes']> => {
  if (MOCK_MODE) {
    simulateApiError(0.02, 'Failed to fetch driver routes');
    await delay(300, 500);
    return mockFetchDriverRoutes(id);
  }
  
  const response = await fetch(`${API_BASE_URL}/drivers/${id}/routes`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchDriverCalendar = async (id: string): Promise<Driver['calendarEvents']> => {
  if (MOCK_MODE) {
    simulateApiError(0.02, 'Failed to fetch driver calendar');
    await delay(300, 500);
    return mockFetchDriverCalendar(id);
  }

  const response = await fetch(`${API_BASE_URL}/drivers/${id}/calendar`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const updateDriver = async (id: string, updates: Partial<Driver>): Promise<Driver> => {
  if (MOCK_MODE) {
    simulateApiError(0.03, 'Failed to update driver');
    await delay(300, 500);
    return mockUpdateDriver(id, updates);
  }

  const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const updateDriverStatus = async (id: string, status: Driver['status']): Promise<Driver> => {
  if (MOCK_MODE) {
    simulateApiError(0.03, 'Failed to update driver status');
    await delay(300, 500);
    return mockUpdateDriverStatus(id, status);
  }
  
  const response = await fetch(`${API_BASE_URL}/drivers/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};
