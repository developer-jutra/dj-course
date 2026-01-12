export interface CompanyInfo {
  name: string
  registrationNumber: string
  vatNumber: string
  industryType: string
  address: {
    street: string
    city: string
    postalCode: string
    country: string
  }
}

export interface ContactInfo {
  primaryEmail: string
  primaryPhone: string
  website: string
  emergencyContact: {
    name: string
    phone: string
    email: string
    relationship: string
  }
}

export interface NotificationPreferences {
  emailNotifications: boolean
  smsNotifications: boolean
  marketingCommunications: boolean
}

export interface PasswordChangeData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}



export interface Settings {
  companyInfo: CompanyInfo
  contactInfo: ContactInfo
  notificationPreferences: NotificationPreferences
} 