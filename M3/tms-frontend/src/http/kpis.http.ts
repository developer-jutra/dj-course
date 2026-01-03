import { getAuthHeaders } from "@/auth/session.token";
import { API_BASE_URL } from "./http.config";
import { KPIs, KPIWidget } from "./kpis.model";
import { delay, MOCK_MODE } from "./mock-utils";
import { mockKPIs, mockKPIWidgets } from "./kpis.mocks";

/**
 * HTTP GET <api>/kpis
 */
export async function getKPIs(): Promise<KPIs> {
  if (MOCK_MODE){
    await delay(300, 500);
    return mockKPIs;
  }

  const response = await fetch(`${API_BASE_URL}/kpis`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * HTTP GET <api>/kpi-widgets
 */
export async function getKPIWidgets(): Promise<KPIWidget[]> {
  if (MOCK_MODE){
    await delay(300, 500);
    return mockKPIWidgets;
  }
  
  const response = await fetch(`${API_BASE_URL}/kpi-widgets`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}
