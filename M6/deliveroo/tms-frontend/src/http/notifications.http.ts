import { Notification } from './notifications.model';
import { API_BASE_URL } from './http.config';
import { getAuthHeaders } from '../auth/session.token';

/**
 * Notifications API - always uses TMS API (no MOCK_MODE)
 */
export async function getNotifications(): Promise<Notification[]> {
  const response = await fetch(`${API_BASE_URL}notifications`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
