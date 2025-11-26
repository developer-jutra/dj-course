import { getAuthHeaders } from "@/auth/session.token";
import { API_BASE_URL } from "./http.config";
import { KPIs } from "./kpis.model";
import { delay, MOCK_MODE } from "./mock.http";
import { mockKPIs } from "./kpis.mocks";

/**
 * HTTP GET <api>/kpis
 */
export async function getKPIs(): Promise<KPIs> {
  try {
    const response = await fetch(`${API_BASE_URL}/kpis`, {
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
      return mockKPIs;
    }
  }
}
