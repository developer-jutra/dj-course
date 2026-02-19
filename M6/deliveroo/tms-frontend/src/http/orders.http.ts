import { Order, OrderEvent } from './orders.model';
import { mockOrders, mockOrderEvents } from './orders.mocks';
import { API_BASE_URL } from './http.config';
import { getAuthHeaders } from '../auth/session.token';
import { delay, MOCK_MODE } from './mock-utils';

/**
 * HTTP GET <api>/orders
 */
export async function getOrders(): Promise<Order[]> {
  if (MOCK_MODE) {
    await delay(300, 500);
    return mockOrders;
  }
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

/**
 * HTTP GET <api>/orders/:id
 */
export async function getOrderDetails(id: string): Promise<Order> {
  if (MOCK_MODE) {
    await delay(300, 500);
    return mockOrders.find(order => order.id === Number(id));
  }
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

/**
 * HTTP GET <api>/orders/:id/events
 */
export async function getOrderEvents(orderId: string): Promise<OrderEvent[]> {
  if (MOCK_MODE) {
    await delay(200, 400);
    // In a real app, you'd filter events for the given orderId
    return mockOrderEvents;
  }

  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/events`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}