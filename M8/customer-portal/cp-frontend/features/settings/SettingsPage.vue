<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Settings
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Manage your account and company settings
      </p>
    </div>

    <!-- Tab Navigation -->
    <Tabs :tabs="tabs" default-tab="company" @tab-change="handleTabChange">
      <template #company>
        <CompanyInformationTab
          :company-info="companyInfo"
          @update="handleCompanyInfoUpdate"
        />
      </template>

      <template #contact>
        <ContactInformationTab
          :contact-info="contactInfo"
          @update="handleContactInfoUpdate"
        />
      </template>

      <template #notifications>
        <NotificationPreferencesTab
          :notification-preferences="notificationPreferences"
          @update="handleNotificationPreferencesUpdate"
        />
      </template>

      <template #security>
        <SecuritySettingsTab
          @change-password="handlePasswordChange"
          @enable-2fa="handle2FAEnable"
        />
      </template>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import {
  BuildingOfficeIcon,
  PhoneIcon,
  BellIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'
import Tabs from '~/components/ui-library/tabs/Tabs.vue'
import type { Tab } from '~/components/ui-library/tabs/Tabs.vue'
import CompanyInformationTab from './CompanyInformationTab.vue'
import ContactInformationTab from './ContactInformationTab.vue'
import NotificationPreferencesTab from './NotificationPreferencesTab.vue'
import SecuritySettingsTab from './SecuritySettingsTab.vue'
import { 
  getCompanyInfo, 
  updateCompanyInfo, 
  getContactInfo, 
  updateContactInfo, 
  getNotificationPreferences, 
  updateNotificationPreferences, 
  changePassword, 
  enable2FA 
} from './settings-api'
import type { CompanyInfo, ContactInfo, NotificationPreferences, PasswordChangeData } from './settings.model'
import { mockCompanyInfo, mockContactInfo, mockNotificationPreferences } from './settings.mocks'

const tabs: Tab[] = [
  { id: 'company', name: 'Company Information', icon: BuildingOfficeIcon },
  { id: 'contact', name: 'Contact Information', icon: PhoneIcon },
  { id: 'notifications', name: 'Notifications', icon: BellIcon },
  { id: 'security', name: 'Security', icon: ShieldCheckIcon }
]

// Reactive state for each tab
const companyInfo = ref<CompanyInfo>({ ...mockCompanyInfo })
const contactInfo = ref<ContactInfo>({ ...mockContactInfo })
const notificationPreferences = ref<NotificationPreferences>({ ...mockNotificationPreferences })

// Event handlers
const handleTabChange = (tabId: string) => {
  // Update the active tab
  activeTab.value = tabId
}

const handleCompanyInfoUpdate = async (data: CompanyInfo) => {
  // Update local state with the updated data
  companyInfo.value = data
}

const handleContactInfoUpdate = async (data: ContactInfo) => {
  // Update local state with the updated data
  contactInfo.value = data
}

const handleNotificationPreferencesUpdate = async (data: NotificationPreferences) => {
  // Update local state with the updated data
  notificationPreferences.value = data
}

const handlePasswordChange = async (data: PasswordChangeData) => {
  // Password change is handled in the SecuritySettingsTab component
  console.log('Password changed successfully')
}

const handle2FAEnable = async () => {
  // 2FA enabling is handled in the SecuritySettingsTab component
  console.log('2FA enabled successfully')
}

// Initialize data on component mount
onMounted(async () => {
  try {
    const results = await Promise.all([
      getCompanyInfo(),
      getContactInfo(),
      getNotificationPreferences()
    ])
    
    companyInfo.value = results[0]
    contactInfo.value = results[1]
    notificationPreferences.value = results[2]
  } catch (error) {
    console.error('Failed to load settings data:', error)
  }
})
</script>
