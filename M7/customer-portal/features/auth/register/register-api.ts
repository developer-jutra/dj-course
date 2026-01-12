import type { RegisterFormData, AuthResponse } from './register.model'
import { mockRegisterUser, mockRegisterCompany } from './register.mocks'

export async function register(data: RegisterFormData): Promise<AuthResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Mock registration logic
  return {
    user: {
      ...mockRegisterUser,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone
    },
    company: {
      ...mockRegisterCompany,
      name: data.companyName,
      registrationNumber: data.registrationNumber,
      vatNumber: data.vatNumber,
      address: data.address,
      industryType: data.industryType
    }
  }
} 