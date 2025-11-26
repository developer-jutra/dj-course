import { Shipment as LogisticsShipment } from '../model/shipments/logistics.types';
import { sampleShipments } from '../model/shipments/shipments.mocks';
import { API_BASE_URL } from './http.config';
import { getAuthHeaders } from '../auth/session.token';
import { delay, MOCK_MODE } from './mock.http';

// A temporary type that reflects the flattened structure expected by the UI
// This should be replaced by a proper data transformation layer
export type UIShipment = {
    id: string;
    driver: string;
    status: string;
    origin: string;
    destination: string;
    eta: string;
    elapsedTime?: string;
    distanceCovered?: string;
    totalDistance?: string;
    delay?: boolean;
    estimatedDelay?: string | null;
};


export async function getShipments(filters?: { driver?: string; status?: string; location?: string }): Promise<UIShipment[]> {
  try {
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
  } catch (error) {
    if (MOCK_MODE) {
      await delay(300, 500);
      
      const mockShipments: UIShipment[] = sampleShipments.map(s => ({
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
      let filteredShipments = [...mockShipments];
      
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
    throw error;
  }
}

export async function getShipmentDetails(id: string): Promise<UIShipment | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/shipments/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    if (MOCK_MODE) {
      await delay(300, 500);

      const shipment = sampleShipments.find(s => s.id === id);
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
    throw error;
  }
}