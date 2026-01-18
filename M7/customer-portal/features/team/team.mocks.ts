import type { User } from '~/features/auth/signin/signin.model'
import type { AvailablePermission } from './team.model'

export const mockTeamMembers: User[] = [
  {
    id: '1',
    email: 'admin@company.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+48123456789',
    role: 'COMPANY_ADMIN' as any,
    companyId: '1',
    permissions: ['CREATE_REQUEST', 'VIEW_REQUEST', 'EDIT_REQUEST', 'MANAGE_TEAM', 'VIEW_BILLING', 'MANAGE_BILLING'] as any,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    email: 'employee@company.com',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+48987654321',
    role: 'EMPLOYEE' as any,
    companyId: '1',
    permissions: ['CREATE_REQUEST', 'VIEW_REQUEST', 'EDIT_REQUEST'] as any,
    isActive: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '3',
    email: 'viewer@company.com',
    firstName: 'Bob',
    lastName: 'Johnson',
    phone: '+48555666777',
    role: 'VIEWER' as any,
    companyId: '1',
    permissions: ['VIEW_REQUEST'] as any,
    isActive: false,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12')
  }
]

export const mockAvailablePermissions: AvailablePermission[] = [
  { value: 'CREATE_REQUEST', name: 'Create Requests' },
  { value: 'VIEW_REQUEST', name: 'View Requests' },
  { value: 'EDIT_REQUEST', name: 'Edit Requests' },
  { value: 'VIEW_BILLING', name: 'View Billing' },
  { value: 'MANAGE_BILLING', name: 'Manage Billing' }
]

export const roleOptions = [
  { value: 'EMPLOYEE', label: 'Employee' },
  { value: 'VIEWER', label: 'Viewer' }
]

export const roleColorMap = {
  'COMPANY_ADMIN': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'EMPLOYEE': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'VIEWER': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
} 