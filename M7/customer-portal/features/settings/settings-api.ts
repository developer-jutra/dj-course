import type { CompanyInfo, ContactInfo, NotificationPreferences, PasswordChangeData } from './settings.model'
import { mockCompanyInfo, mockContactInfo, mockNotificationPreferences } from './settings.mocks'

// Get company information
export async function getCompanyInfo(): Promise<CompanyInfo> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockCompanyInfo
}

// Update company information
export async function updateCompanyInfo(data: CompanyInfo): Promise<CompanyInfo> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Validate required fields
  if (!data.name) {
    throw new Error('Company name is required')
  }
  if (!data.registrationNumber) {
    throw new Error('Registration number is required')
  }
  if (!data.address.street) {
    throw new Error('Street address is required')
  }
  if (!data.address.city) {
    throw new Error('City is required')
  }
  if (!data.address.postalCode) {
    throw new Error('Postal code is required')
  }
  if (!data.address.country) {
    throw new Error('Country is required')
  }
  
  console.log('Company information updated:', data)
  return data
}

// Get contact information
export async function getContactInfo(): Promise<ContactInfo> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockContactInfo
}

// Update contact information
export async function updateContactInfo(data: ContactInfo): Promise<ContactInfo> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Validate required fields
  if (!data.primaryEmail) {
    throw new Error('Primary email is required')
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.primaryEmail)) {
    throw new Error('Please enter a valid email address')
  }
  if (!data.primaryPhone) {
    throw new Error('Primary phone is required')
  }
  if (data.website && !/^https?:\/\/.*/.test(data.website)) {
    throw new Error('Please enter a valid URL (starting with http:// or https://)')
  }
  if (!data.emergencyContact.name) {
    throw new Error('Emergency contact name is required')
  }
  if (!data.emergencyContact.phone) {
    throw new Error('Emergency contact phone is required')
  }
  if (data.emergencyContact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emergencyContact.email)) {
    throw new Error('Please enter a valid email address for emergency contact')
  }
  
  console.log('Contact information updated:', data)
  return data
}

// Get notification preferences
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockNotificationPreferences
}

// Update notification preferences
export async function updateNotificationPreferences(data: NotificationPreferences): Promise<NotificationPreferences> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('Notification preferences updated:', data)
  return data
}

// Change password
export async function changePassword(data: PasswordChangeData): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Validate required fields
  if (!data.currentPassword) {
    throw new Error('Current password is required')
  }
  if (!data.newPassword) {
    throw new Error('New password is required')
  }
  if (data.newPassword.length < 8) {
    throw new Error('Password must be at least 8 characters')
  }
  if (data.newPassword !== data.confirmPassword) {
    throw new Error('New passwords do not match')
  }
  
  // Simulate password validation
  if (data.currentPassword === 'wrongpassword') {
    throw new Error('Current password is incorrect')
  }
  
  console.log('Password changed successfully')
}

// Enable 2FA
export async function enable2FA(): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('2FA enabled successfully')
}