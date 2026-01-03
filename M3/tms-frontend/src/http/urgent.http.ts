import { UrgentItem, AvailableEmployee } from './urgent.model';
import { mockUrgentItems, mockAvailableEmployees } from './urgent.mocks';
import { API_BASE_URL } from './http.config';
import { getAuthHeaders } from '../auth/session.token';
import { delay, MOCK_MODE } from './mock-utils';

/**
 * HTTP GET <api>/urgent-items
 */
export async function getUrgentItems(): Promise<UrgentItem[]> {
  if (MOCK_MODE) {
    await delay(400);
    return mockUrgentItems;
  }
  const response = await fetch(`${API_BASE_URL}/urgent-items`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

/**
 * HTTP GET <api>/available-employees
 */
export async function getAvailableEmployees(): Promise<AvailableEmployee[]> {
  if (MOCK_MODE) {
    await delay(200);
    return mockAvailableEmployees;
  }
  const response = await fetch(`${API_BASE_URL}/available-employees`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

/**
 * HTTP POST <api>/urgent-items/{itemId}/reassign
 */
export async function reassignUrgentItemToEmployee(itemId: number, employeeId: string): Promise<void> {
  if (MOCK_MODE) {
    await delay(1200);
    return;
  }

  const payload = {
    employeeId,
  }

  const response = await fetch(`${API_BASE_URL}/urgent-items/${itemId}/reassign`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}
