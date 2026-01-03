import { Notification } from './notifications.model';
import { mockNotifications } from './notifications.mocks';
import { API_BASE_URL } from './http.config';
import { getAuthHeaders } from '../auth/session.token';
import { delay, MOCK_MODE } from './mock-utils';

export async function getNotifications(): Promise<Notification[]> {
  if (MOCK_MODE) {
    await delay(300, 500);
    return mockNotifications;
  }
  const response = await fetch(`${API_BASE_URL}/notifications`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
