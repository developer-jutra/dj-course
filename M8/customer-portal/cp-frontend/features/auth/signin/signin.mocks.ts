import type { User, Company } from './signin.model'

export const mockSignInUser: User = {
  id: '1',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+48123456789',
  role: 'COMPANY_ADMIN' as any,
  companyId: '1',
  permissions: ['CREATE_REQUEST', 'VIEW_REQUEST', 'EDIT_REQUEST', 'MANAGE_TEAM'] as any,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
}

export const mockSignInCompany: Company = {
  id: '1',
  name: 'Example Logistics Ltd.',
  registrationNumber: 'PL1234567890',
  vatNumber: 'PL1234567890',
  address: {
    street: 'ul. Logistyczna 123',
    city: 'Warsaw',
    postalCode: '00-001',
    country: 'Poland'
  },
  contactInfo: {
    primaryEmail: 'contact@example.com',
    primaryPhone: '+48123456789',
    emergencyContact: {
      name: 'Emergency Contact',
      phone: '+48987654321',
      email: 'emergency@example.com',
      relationship: 'Manager'
    }
  },
  billingAddress: {
    street: 'ul. Logistyczna 123',
    city: 'Warsaw',
    postalCode: '00-001',
    country: 'Poland'
  },
  creditLimit: 50000,
  creditUsed: 15000,
  industryType: 'Manufacturing',
  employees: [],
  paymentTerms: '30 days',
  isActive: true,
  createdAt: new Date()
} 