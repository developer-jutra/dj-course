/**
 * Utility functions for API simulation
 */

/**
 * Simulates network delay with random timeout between 500ms and 1000ms
 * @returns Promise that resolves after random delay
 */
export const simulateNetworkDelay = (): Promise<void> => {
  const delay = Math.random() * 500 + 500; // 500-1000ms
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Generic API response wrapper
 * @param data - The data to return
 * @returns Promise that resolves with data after simulated delay
 */
export const createApiResponse = async <T>(data: T): Promise<T> => {
  await simulateNetworkDelay();
  return data;
};

/**
 * Simulates API error with random chance
 * @param errorRate - Probability of error (0-1)
 * @param errorMessage - Error message to throw
 */
export const simulateApiError = (errorRate: number = 0.05, errorMessage: string = 'Network error') => {
  if (Math.random() < errorRate) {
    throw new Error(errorMessage);
  }
};