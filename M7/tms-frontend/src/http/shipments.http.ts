import { Shipment } from '../model/shipments';
import {
  getMockShipments,
  getMockShipmentDetails,
  mockCreateShipment,
  mockUpdateShipment,
  mockUpdateShipmentStatus,
} from '../model/shipments/shipments.mocks';
import { API_BASE_URL } from './http.config';
import { getAuthHeaders } from '../auth/session.token';
import { delay, MOCK_MODE } from './mock-utils';
import { simulateApiError } from './http-utils';
import { UIShipment } from '../model/shipments/ui.types';
import { TrackingEvent } from '../model/shipments/tracking-event.model';
import { mockTrackingEvents } from '../model/shipments/tracking-event.mocks';

export async function getShipments(
  filters?: {
    driver?: string;
    status?: string;
    location?: string;
    priority?: Shipment['priority'];
    customer?: string;
    search?: string;
  },
): Promise<Shipment[]> {
  if (MOCK_MODE) {
    simulateApiError(0.02, 'Failed to fetch shipments');
    await delay(300, 500);
    return getMockShipments(filters);
  }
  // Build query string from filters
  const queryParams = new URLSearchParams();
  if (filters?.driver) queryParams.append('driver', filters.driver);
  if (filters?.status) queryParams.append('status', filters.status);
  if (filters?.location) queryParams.append('location', filters.location);

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/shipments${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function getShipmentDetails(id: string): Promise<UIShipment | undefined> {
  if (MOCK_MODE) {
    await delay(300, 500);
    return getMockShipmentDetails(id);
  }
  const response = await fetch(`${API_BASE_URL}/shipments/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function getShipmentTrackingEvents(shipmentId: string): Promise<TrackingEvent[]> {
  if (MOCK_MODE) {
    await delay(200, 400);
    // In a real app, you'd filter events for the given shipmentId
    return mockTrackingEvents;
  }

  const response = await fetch(`${API_BASE_URL}/shipments/${shipmentId}/tracking-events`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * PUT /api/shipments/:id
 * Updates shipment information
 */
export const updateShipment = async (id: string, updates: Partial<Shipment>): Promise<Shipment> => {
  if (MOCK_MODE) {
    simulateApiError(0.03, 'Failed to update shipment');
    await delay(300, 500);
    return mockUpdateShipment(id, updates);
  }

  const response = await fetch(`${API_BASE_URL}/shipments/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * PUT /api/shipments/:id/status
 * Updates shipment status
 */
export const updateShipmentStatus = async (id: string, status: Shipment['route']['status']): Promise<Shipment> => {
  if (MOCK_MODE) {
    simulateApiError(0.03, 'Failed to update shipment status');
    await delay(300, 500);
    return mockUpdateShipmentStatus(id, status);
  }

  const response = await fetch(`${API_BASE_URL}/shipments/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * POST /api/shipments
 * Creates a new shipment
 */
export const createShipment = async (shipmentData: Partial<Shipment>): Promise<Shipment> => {
  if (MOCK_MODE) {
    simulateApiError(0.03, 'Failed to create shipment');
    await delay(300, 500);
    return mockCreateShipment(shipmentData);
  }

  const response = await fetch(`${API_BASE_URL}/shipments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(shipmentData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
