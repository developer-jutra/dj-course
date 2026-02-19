import { Driver } from '../model/drivers/driver.types';
import { API_BASE_URL } from './http.config';
import { getAuthHeaders } from '../auth/session.token';
import { UIShipment } from '../model/shipments/ui.types';

/**
 * Drivers API - always uses TMS API (no MOCK_MODE)
 */

export async function getDrivers(filters?: {
  status?: Driver['status'];
  contractType?: Driver['contractType'];
  search?: string;
}): Promise<Driver[]> {
  const queryParams = new URLSearchParams();
  if (filters?.status) queryParams.append('status', filters.status);
  if (filters?.contractType) queryParams.append('contractType', filters.contractType);
  if (filters?.search) queryParams.append('search', filters.search);

  const response = await fetch(`${API_BASE_URL}drivers?${queryParams.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function getDriverDetails(id: string): Promise<Driver | null> {
  const response = await fetch(`${API_BASE_URL}drivers/${id}`, {
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
  const response = await fetch(`${API_BASE_URL}drivers/${id}/shipments`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export const fetchDriverRoutes = async (id: string): Promise<Driver['routes']> => {
  const response = await fetch(`${API_BASE_URL}drivers/${id}/routes`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchDriverCalendar = async (id: string): Promise<Driver['calendarEvents']> => {
  const response = await fetch(`${API_BASE_URL}drivers/${id}/calendar`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const updateDriver = async (id: string, updates: Partial<Driver>): Promise<Driver> => {
  const response = await fetch(`${API_BASE_URL}drivers/${id}`, {
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
  const response = await fetch(`${API_BASE_URL}drivers/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};
