<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white">
      Notification Preferences
      </h2>
      <div v-if="updateStatus" class="text-sm">
        <span v-if="updateStatus === 'success'" class="text-green-600 dark:text-green-400">
          <CheckIcon class="inline-block w-4 h-4 mr-1" />
          Saved successfully
        </span>
        <span v-else-if="updateStatus === 'error'" class="text-red-600 dark:text-red-400">
          <XMarkIcon class="inline-block w-4 h-4 mr-1" />
          Error saving changes
        </span>
      </div>
    </div>
    
    <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-900 dark:text-white">
              Email Notifications
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Receive updates about your shipments and requests
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="form.emailNotifications"
              type="checkbox"
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-success-300 dark:peer-focus:ring-success-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-success-600"></div>
          </label>
        </div>
        
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-900 dark:text-white">
              SMS Notifications
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Receive critical updates via SMS
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="form.smsNotifications"
              type="checkbox"
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-success-300 dark:peer-focus:ring-success-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-success-600"></div>
          </label>
        </div>
        
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-900 dark:text-white">
              Marketing Communications
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Receive newsletters and promotional offers
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="form.marketingCommunications"
              type="checkbox"
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-success-300 dark:peer-focus:ring-success-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-success-600"></div>
          </label>
        </div>
      </div>
      
      <div class="flex justify-end">
        <button
          type="submit"
          :class="['btn-primary', isSubmitting ? 'opacity-75 cursor-wait' : '']"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
          <span v-else>Save Preferences</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import type { NotificationPreferences } from './settings.model'
import { updateNotificationPreferences } from './settings-api'

interface Props {
  notificationPreferences: NotificationPreferences
}

interface Emits {
  (e: 'update', data: NotificationPreferences): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Form state
const form = reactive<NotificationPreferences>({
  emailNotifications: props.notificationPreferences.emailNotifications,
  smsNotifications: props.notificationPreferences.smsNotifications,
  marketingCommunications: props.notificationPreferences.marketingCommunications
})

// Submission state
const isSubmitting = ref(false)
const updateStatus = ref<'success' | 'error' | null>(null)

const handleSubmit = async () => {
  isSubmitting.value = true
  updateStatus.value = null
  
  try {
    // Call API to update notification preferences
    const updatedData = await updateNotificationPreferences(form)
    
    // Emit update event with updated data
    emit('update', updatedData)
    
    // Show success message
    updateStatus.value = 'success'
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      updateStatus.value = null
    }, 3000)
  } catch (error) {
    console.error('Failed to update notification preferences:', error)
    updateStatus.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}
</script> 