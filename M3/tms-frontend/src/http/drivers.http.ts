import { Driver } from '../model/drivers/driver.types';
import { sampleDrivers } from '../model/drivers/drivers.mocks';
import { API_BASE_URL } from './http.config';
import { getAuthHeaders } from '../auth/session.token';
import { delay, MOCK_MODE } from './mock.http';
import { getShipments } from './shipments.http';
import { UIShipment } from './shipments.http';

/**
 * HTTP GET <api>/drivers
 */
export async function getDrivers(): Promise<Driver[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/drivers`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    if (MOCK_MODE){
      await delay(300, 500);
      return sampleDrivers;
    }
    throw error;
  }
}

/**
 * HTTP GET <api>/drivers/:id
 */
export async function getDriverDetails(id: string): Promise<Driver> {
  try {
    const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    if (MOCK_MODE){
      await delay(300, 500);
      const driver = sampleDrivers.find(driver => driver.id === id);
      if (!driver) {
        throw new Error(`Driver with id ${id} not found`);
      }
      return driver;
    }
    throw error;
  }
}

/**
 * HTTP POST <api>/drivers/:id/shipments
 */
export async function getDriverShipments(id: Driver['id']): Promise<UIShipment[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/drivers/${id}/shipments`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    if (MOCK_MODE){
      await delay(300, 500);

      const driver = sampleDrivers.find(d => d.id === id);
      if (!driver) return [];
      return getShipments({ driver: driver.name });
    }
    throw error;
  }
}