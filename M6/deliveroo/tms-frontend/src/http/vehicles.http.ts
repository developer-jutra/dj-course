import { Vehicle } from '../model/vehicles';
import { API_BASE_URL } from './http.config';
import { getAuthHeaders } from '../auth/session.token';

/**
 * Normalize API vehicle response - ensure dates and nested objects are properly typed
 */
function normalizeVehicle(raw: Record<string, unknown>): Vehicle {
  return raw as Vehicle;
}

/**
 * GET /api/vehicles
 * Fetches all vehicles with optional filtering (always from TMS API)
 */
export const fetchVehicles = async (filters?: {
  status?: Vehicle['status'];
  type?: Vehicle['type'];
  search?: string;
}): Promise<Vehicle[]> => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.type) params.append('type', filters.type);
  if (filters?.search) params.append('search', filters.search);
  const qs = params.toString();
  const url = `${API_BASE_URL}vehicles${qs ? `?${qs}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();
  return Array.isArray(data) ? data.map(normalizeVehicle) : [];
};

/**
 * GET /api/vehicles/:id
 * Fetches a single vehicle by ID (always from TMS API)
 */
export const fetchVehicleById = async (id: string): Promise<Vehicle | null> => {
  const response = await fetch(`${API_BASE_URL}vehicles/${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();
  return normalizeVehicle(data);
};

/**
 * GET /api/vehicles/:id/maintenance
 * Fetches maintenance data for a specific vehicle (always from TMS API)
 */
export const fetchVehicleMaintenance = async (id: string): Promise<{
  history: Vehicle['maintenanceHistory'];
  tasks: Vehicle['maintenanceTasks'];
}> => {
  const response = await fetch(`${API_BASE_URL}vehicles/${encodeURIComponent(id)}/maintenance`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

/**
 * GET /api/vehicles/:id/routes
 * Fetches route history for a specific vehicle (always from TMS API)
 */
export const fetchVehicleRoutes = async (id: string): Promise<Array<{
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  distance: number;
  status: 'active' | 'completed';
}>> => {
  const response = await fetch(`${API_BASE_URL}vehicles/${encodeURIComponent(id)}/routes`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();
  return (Array.isArray(data) ? data : []).map((r: Record<string, unknown>) => ({
    ...r,
    startDate: typeof r.startDate === 'string' ? new Date(r.startDate) : r.startDate,
    endDate: typeof r.endDate === 'string' ? new Date(r.endDate) : r.endDate,
  }));
};

/**
 * PUT /api/vehicles/:id
 * Updates vehicle information (always via TMS API)
 */
export const updateVehicle = async (id: string, updates: Partial<Vehicle>): Promise<Vehicle> => {
  const response = await fetch(`${API_BASE_URL}vehicles/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();
  return normalizeVehicle(data);
};

/**
 * PUT /api/vehicles/:id/status
 * Updates vehicle status (always via TMS API)
 */
export const updateVehicleStatus = async (id: string, status: Vehicle['status']): Promise<Vehicle> => {
  const response = await fetch(`${API_BASE_URL}vehicles/${encodeURIComponent(id)}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();
  return normalizeVehicle(data);
};
