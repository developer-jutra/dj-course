import { Order } from './orders.model';
import { mockOrders } from './orders.mocks';
import { API_BASE_URL } from './http.config';
import { getAuthHeaders } from '../auth/session.token';
import { delay, MOCK_MODE } from './mock.http';

/**
 * HTTP GET <api>/orders
 */
export async function getOrders(): Promise<Order[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
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
      return mockOrders;
    }
  }
}

/**
 * HTTP GET <api>/orders/:id
 */
export async function getOrderDetails(id: string): Promise<Order> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
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
      return mockOrders.find(order => order.id === Number(id));
    }
  }
}