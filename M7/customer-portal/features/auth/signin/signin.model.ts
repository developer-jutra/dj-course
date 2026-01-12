export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: UserRole
  companyId: string
  permissions: Permission[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  ADMIN = 'ADMIN',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  VIEWER = 'VIEWER'
}

export enum Permission {
  CREATE_REQUEST = 'CREATE_REQUEST',
  VIEW_REQUEST = 'VIEW_REQUEST',
  EDIT_REQUEST = 'EDIT_REQUEST',
  DELETE_REQUEST = 'DELETE_REQUEST',
  MANAGE_TEAM = 'MANAGE_TEAM',
  VIEW_BILLING = 'VIEW_BILLING',
  MANAGE_BILLING = 'MANAGE_BILLING'
}

export interface Company {
  id: string
  name: string
  registrationNumber: string
  vatNumber: string
  address: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  contactInfo: {
    primaryEmail: string
    primaryPhone: string
    emergencyContact: {
      name: string
      phone: string
      email: string
      relationship: string
    }
  }
  billingAddress: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  creditLimit: number
  creditUsed: number
  industryType: string
  employees: string[]
  paymentTerms: string
  isActive: boolean
  createdAt: Date
}

export interface AuthResponse {
  user: User
  company: Company
} 