import { Payment } from './payments.model';
import { mockPayments } from './payments.mocks';
import { API_BASE_URL } from './http.config';
import { getAuthHeaders } from '../auth/session.token';
import { delay, MOCK_MODE } from './mock-utils';

/**
 * HTTP GET <api>/payments
 */
export async function getPayments(): Promise<Payment[]> {
  if (MOCK_MODE) {
    await delay(300, 500);
    return mockPayments;
  }
  const response = await fetch(`${API_BASE_URL}/payments`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

/**
 * HTTP GET <api>/payments/:id
 */
export async function getPaymentDetails(id: string): Promise<Payment> {
  if (MOCK_MODE) {
    await delay(300, 500);
    return mockPayments.find(payment => payment.id === id);
  }
  const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}