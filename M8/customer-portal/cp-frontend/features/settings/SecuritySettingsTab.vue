<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white">
      Security Settings
      </h2>
      <div v-if="updateStatus" class="text-sm">
        <span v-if="updateStatus === 'success'" class="text-green-600 dark:text-green-400">
          <CheckIcon class="inline-block w-4 h-4 mr-1" />
          {{ updateMessage }}
        </span>
        <span v-else-if="updateStatus === 'error'" class="text-red-600 dark:text-red-400">
          <XMarkIcon class="inline-block w-4 h-4 mr-1" />
          {{ updateMessage }}
        </span>
      </div>
    </div>
    
    <div class="space-y-6">
      <div>
        <h3 class="text-md font-medium text-gray-900 dark:text-white mb-4">
          Change Password
        </h3>
        <form @submit.prevent="handlePasswordChange" class="space-y-4" novalidate>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Current Password
            </label>
            <input
              v-model="passwordForm.currentPassword"
              type="password"
              :class="[
                'input',
                passwordErrors.currentPassword && passwordTouched.currentPassword ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
              ]"
              required
            />
            <p v-if="passwordErrors.currentPassword && passwordTouched.currentPassword" class="mt-1 text-sm text-red-500">
              {{ passwordErrors.currentPassword }}
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              New Password
            </label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              :class="[
                'input',
                passwordErrors.newPassword && passwordTouched.newPassword ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
              ]"
              required
            />
            <p v-if="passwordErrors.newPassword && passwordTouched.newPassword" class="mt-1 text-sm text-red-500">
              {{ passwordErrors.newPassword }}
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm New Password
            </label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              :class="[
                'input',
                passwordErrors.confirmPassword && passwordTouched.confirmPassword ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
              ]"
              required
            />
            <p v-if="passwordErrors.confirmPassword && passwordTouched.confirmPassword" class="mt-1 text-sm text-red-500">
              {{ passwordErrors.confirmPassword }}
            </p>
          </div>
          
          <div class="flex justify-end">
            <button
              type="submit"
              :class="['btn-primary', isChangingPassword ? 'opacity-75 cursor-wait' : '']"
              :disabled="isChangingPassword"
            >
              <span v-if="isChangingPassword">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Changing...
              </span>
              <span v-else>Change Password</span>
            </button>
          </div>
        </form>
      </div>
      
      <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 class="text-md font-medium text-gray-900 dark:text-white mb-4">
          Two-Factor Authentication
        </h3>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Add an extra layer of security to your account
            </p>
          </div>
          <button 
            @click="handleEnable2FA" 
            :class="['btn-outline', isEnabling2FA ? 'opacity-75 cursor-wait' : '']"
            :disabled="isEnabling2FA"
          >
            <span v-if="isEnabling2FA">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700 dark:text-gray-300 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enabling...
            </span>
            <span v-else>Enable 2FA</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import type { PasswordChangeData } from './settings.model'
import { changePassword, enable2FA } from './settings-api'

interface Emits {
  (e: 'passwordChange', data: PasswordChangeData): void
  (e: 'enable2FA'): void
}

const emit = defineEmits<Emits>()

// Password form state
const passwordForm = reactive<PasswordChangeData>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Validation state
const passwordErrors = reactive<Record<string, string>>({})
const passwordTouched = reactive({
  currentPassword: false,
  newPassword: false,
  confirmPassword: false
})

// Submission state
const isChangingPassword = ref(false)
const isEnabling2FA = ref(false)
const updateStatus = ref<'success' | 'error' | null>(null)
const updateMessage = ref('')

// Watch for input changes to mark fields as touched
watch(passwordForm, (newForm, oldForm) => {
  Object.keys(newForm).forEach(key => {
    if (newForm[key as keyof PasswordChangeData] !== oldForm[key as keyof PasswordChangeData]) {
      passwordTouched[key as keyof typeof passwordTouched] = true
    }
  })
}, { deep: true })

// Validate password form
const validatePasswordForm = (): boolean => {
  // Reset errors
  Object.keys(passwordErrors).forEach(key => delete passwordErrors[key])
  
  // Validate required fields
  if (!passwordForm.currentPassword) {
    passwordErrors.currentPassword = 'Current password is required'
  }
  
  if (!passwordForm.newPassword) {
    passwordErrors.newPassword = 'New password is required'
  } else if (passwordForm.newPassword.length < 8) {
    passwordErrors.newPassword = 'Password must be at least 8 characters'
  }
  
  if (!passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = 'Please confirm your new password'
  } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = 'Passwords do not match'
  }
  
  // Mark all fields as touched to show errors
  Object.keys(passwordErrors).forEach(key => {
    passwordTouched[key as keyof typeof passwordTouched] = true
  })
  
  // Return true if no errors
  return Object.keys(passwordErrors).length === 0
}

const handlePasswordChange = async () => {
  // Validate form
  if (!validatePasswordForm()) {
    return
  }
  
  isChangingPassword.value = true
  updateStatus.value = null
  
  try {
    // Call API to change password
    await changePassword(passwordForm)
    
    // Emit event
    emit('passwordChange', passwordForm)
    
    // Reset form after successful submission
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    
    // Reset touched state
    passwordTouched.currentPassword = false
    passwordTouched.newPassword = false
    passwordTouched.confirmPassword = false
    
    // Show success message
    updateStatus.value = 'success'
    updateMessage.value = 'Password changed successfully'
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      updateStatus.value = null
    }, 3000)
  } catch (error) {
    console.error('Failed to change password:', error)
    updateStatus.value = 'error'
    updateMessage.value = error instanceof Error ? error.message : 'Failed to change password'
  } finally {
    isChangingPassword.value = false
  }
}

const handleEnable2FA = async () => {
  isEnabling2FA.value = true
  updateStatus.value = null
  
  try {
    // Call API to enable 2FA
    await enable2FA()
    
    // Emit event
    emit('enable2FA')
    
    // Show success message
    updateStatus.value = 'success'
    updateMessage.value = '2FA enabled successfully'
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      updateStatus.value = null
    }, 3000)
  } catch (error) {
    console.error('Failed to enable 2FA:', error)
    updateStatus.value = 'error'
    updateMessage.value = 'Failed to enable 2FA'
  } finally {
    isEnabling2FA.value = false
  }
}
</script> 