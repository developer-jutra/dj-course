import { atom, getDefaultStore } from 'jotai';

// Artificial session token for authentication
export const sessionTokenAtom = atom<string | null>('mock-session-token-12345');

// Self-contained function to get authorization headers with current token
export const getAuthHeaders = (): HeadersInit => {
  const store = getDefaultStore();
  const token = store.get(sessionTokenAtom);
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};