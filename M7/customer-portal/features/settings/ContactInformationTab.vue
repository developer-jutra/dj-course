<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white">
      Contact Information
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
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Primary Email *
          </label>
          <input
            v-model="form.primaryEmail"
            type="email"
            :class="[
              'input',
              errors.primaryEmail && touched.primaryEmail ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
            ]"
            required
          />
          <p v-if="errors.primaryEmail && touched.primaryEmail" class="mt-1 text-sm text-red-500">
            {{ errors.primaryEmail }}
          </p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Primary Phone *
          </label>
          <input
            v-model="form.primaryPhone"
            type="tel"
            :class="[
              'input',
              errors.primaryPhone && touched.primaryPhone ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
            ]"
            required
          />
          <p v-if="errors.primaryPhone && touched.primaryPhone" class="mt-1 text-sm text-red-500">
            {{ errors.primaryPhone }}
          </p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Website
          </label>
          <input
            v-model="form.website"
            type="url"
            :class="[
              'input',
              errors.website && touched.website ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
            ]"
            placeholder="https://example.com"
          />
          <p v-if="errors.website && touched.website" class="mt-1 text-sm text-red-500">
            {{ errors.website }}
          </p>
        </div>
      </div>
      
      <div>
        <h3 class="text-md font-medium text-gray-900 dark:text-white mb-4">
          Emergency Contact
        </h3>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contact Name *
            </label>
            <input
              v-model="form.emergencyContact.name"
              type="text"
              :class="[
                'input',
                errors['emergencyContact.name'] && touched['emergencyContact.name'] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
              ]"
              required
            />
            <p v-if="errors['emergencyContact.name'] && touched['emergencyContact.name']" class="mt-1 text-sm text-red-500">
              {{ errors['emergencyContact.name'] }}
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contact Phone *
            </label>
            <input
              v-model="form.emergencyContact.phone"
              type="tel"
              :class="[
                'input',
                errors['emergencyContact.phone'] && touched['emergencyContact.phone'] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
              ]"
              required
            />
            <p v-if="errors['emergencyContact.phone'] && touched['emergencyContact.phone']" class="mt-1 text-sm text-red-500">
              {{ errors['emergencyContact.phone'] }}
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contact Email
            </label>
            <input
              v-model="form.emergencyContact.email"
              type="email"
              :class="[
                'input',
                errors['emergencyContact.email'] && touched['emergencyContact.email'] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
              ]"
            />
            <p v-if="errors['emergencyContact.email'] && touched['emergencyContact.email']" class="mt-1 text-sm text-red-500">
              {{ errors['emergencyContact.email'] }}
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Relationship
            </label>
            <input
              v-model="form.emergencyContact.relationship"
              type="text"
              class="input"
              placeholder="e.g., Manager, Director"
            />
          </div>
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
          <span v-else>Save Contact Information</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import type { ContactInfo } from './settings.model'
import { updateContactInfo } from './settings-api'

interface Props {
  contactInfo: ContactInfo
}

interface Emits {
  (e: 'update', data: ContactInfo): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Form state
const form = reactive<ContactInfo>({
  primaryEmail: props.contactInfo.primaryEmail,
  primaryPhone: props.contactInfo.primaryPhone,
  website: props.contactInfo.website,
  emergencyContact: {
    name: props.contactInfo.emergencyContact.name,
    phone: props.contactInfo.emergencyContact.phone,
    email: props.contactInfo.emergencyContact.email,
    relationship: props.contactInfo.emergencyContact.relationship
  }
})

// Validation state
const errors = reactive<Record<string, string>>({})
const touched = reactive<Record<string, boolean>>({})
const isSubmitting = ref(false)
const updateStatus = ref<'success' | 'error' | null>(null)

// Initialize touched state for all form fields
onMounted(() => {
  // Initialize touched state as false for all fields
  Object.keys(form).forEach(key => {
    if (typeof form[key as keyof ContactInfo] === 'object') {
      Object.keys(form[key as keyof ContactInfo]).forEach(nestedKey => {
        touched[`${key}.${nestedKey}`] = false
      })
    } else {
      touched[key] = false
    }
  })
})

// Watch for input changes to mark fields as touched
watch(form, (newForm, oldForm) => {
  // Mark fields as touched when they change
  Object.keys(newForm).forEach(key => {
    if (typeof newForm[key as keyof ContactInfo] === 'object') {
      Object.keys(newForm[key as keyof ContactInfo]).forEach(nestedKey => {
        if (JSON.stringify(newForm[key as keyof ContactInfo][nestedKey]) !== 
            JSON.stringify(oldForm[key as keyof ContactInfo][nestedKey])) {
          touched[`${key}.${nestedKey}`] = true
        }
      })
    } else if (newForm[key as keyof ContactInfo] !== oldForm[key as keyof ContactInfo]) {
      touched[key] = true
    }
  })
}, { deep: true })

// Validate form
const validateForm = (): boolean => {
  // Reset errors
  Object.keys(errors).forEach(key => delete errors[key])
  
  // Validate required fields
  if (!form.primaryEmail) {
    errors.primaryEmail = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.primaryEmail)) {
    errors.primaryEmail = 'Please enter a valid email address'
  }
  
  if (!form.primaryPhone) {
    errors.primaryPhone = 'Phone number is required'
  }
  
  if (form.website && !/^https?:\/\/.*/.test(form.website)) {
    errors.website = 'Please enter a valid URL (starting with http:// or https://)'
  }
  
  if (!form.emergencyContact.name) {
    errors['emergencyContact.name'] = 'Emergency contact name is required'
  }
  
  if (!form.emergencyContact.phone) {
    errors['emergencyContact.phone'] = 'Emergency contact phone is required'
  }
  
  if (form.emergencyContact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emergencyContact.email)) {
    errors['emergencyContact.email'] = 'Please enter a valid email address'
  }
  
  // Mark all fields as touched to show errors
  Object.keys(errors).forEach(key => {
    touched[key] = true
  })
  
  // Return true if no errors
  return Object.keys(errors).length === 0
}

const handleSubmit = async () => {
  // Validate form
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  updateStatus.value = null
  
  try {
    // Call API to update contact info
    const updatedData = await updateContactInfo(form)
    
    // Emit update event with updated data
    emit('update', updatedData)
    
    // Show success message
    updateStatus.value = 'success'
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      updateStatus.value = null
    }, 3000)
  } catch (error) {
    console.error('Failed to update contact information:', error)
    updateStatus.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}
</script> 