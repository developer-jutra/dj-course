import type { LoginCredentials, AuthResponse } from './signin.model'
import { mockSignInUser, mockSignInCompany } from './signin.mocks'

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock authentication logic
  if (credentials.email && credentials.password) {
    return {
      user: mockSignInUser,
      company: mockSignInCompany
    }
  }
  
  throw new Error('Invalid credentials')
} 