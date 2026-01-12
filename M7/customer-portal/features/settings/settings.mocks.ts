import type { CompanyInfo, ContactInfo, NotificationPreferences } from './settings.model'

export const mockCompanyInfo: CompanyInfo = {
  name: 'Example Logistics Ltd.',
  registrationNumber: 'PL1234567890',
  vatNumber: 'PL1234567890',
  industryType: 'Manufacturing',
  address: {
    street: 'ul. Logistyczna 123',
    city: 'Warsaw',
    postalCode: '00-001',
    country: 'Poland'
  }
}

export const mockContactInfo: ContactInfo = {
  primaryEmail: 'contact@example.com',
  primaryPhone: '+48123456789',
  website: 'https://example.com',
  emergencyContact: {
    name: 'Emergency Contact',
    phone: '+48987654321',
    email: 'emergency@example.com',
    relationship: 'Manager'
  }
}

export const mockNotificationPreferences: NotificationPreferences = {
  emailNotifications: true,
  smsNotifications: false,
  marketingCommunications: true
}

export const industryTypeOptions = [
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Automotive', label: 'Automotive' },
  { value: 'Food & Beverage', label: 'Food & Beverage' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Other', label: 'Other' }
]

export const countryOptions = [
  { value: 'Poland', label: 'Poland' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Czech Republic', label: 'Czech Republic' },
  { value: 'Slovakia', label: 'Slovakia' },
  { value: 'Hungary', label: 'Hungary' }
] 