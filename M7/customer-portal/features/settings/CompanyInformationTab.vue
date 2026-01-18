<template>
  <div class="card p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white">
      Company Information
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
            Company Name *
          </label>
          <input
            v-model="form.name"
            type="text"
            :class="[
              'input',
              errors.name && touched.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
            ]"
            required
          />
          <p v-if="errors.name && touched.name" class="mt-1 text-sm text-red-500">
            {{ errors.name }}
          </p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Registration Number *
          </label>
          <input
            v-model="form.registrationNumber"
            type="text"
            :class="[
              'input',
              errors.registrationNumber && touched.registrationNumber ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
            ]"
            required
          />
          <p v-if="errors.registrationNumber && touched.registrationNumber" class="mt-1 text-sm text-red-500">
            {{ errors.registrationNumber }}
          </p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            VAT Number
          </label>
          <input
            v-model="form.vatNumber"
            type="text"
            class="input" 
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Industry Type
          </label>
          <select
            v-model="form.industryType"
            class="input"
            @change="touched.industryType = true"
          >
            <option
              v-for="option in industryTypeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
      
      <div>
        <h3 class="text-md font-medium text-gray-900 dark:text-white mb-4">
          Company Address
        </h3>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Street Address *
            </label>
            <input
              v-model="form.address.street" 
              :class="[
                'input',
                errors['address.street'] && touched['address.street'] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
              ]"
              type="text"
              required
            />
            <p v-if="errors['address.street'] && touched['address.street']" class="mt-1 text-sm text-red-500">
              {{ errors['address.street'] }}
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              City *
            </label>
            <input
              v-model="form.address.city"
              type="text"
              :class="[
                'input',
                errors['address.city'] && touched['address.city'] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
              ]"
              required
            />
            <p v-if="errors['address.city'] && touched['address.city']" class="mt-1 text-sm text-red-500">
              {{ errors['address.city'] }}
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Postal Code *
            </label>
            <input
              v-model="form.address.postalCode"
              type="text"
              :class="[
                'input',
                errors['address.postalCode'] && touched['address.postalCode'] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
              ]"
              required
            />
            <p v-if="errors['address.postalCode'] && touched['address.postalCode']" class="mt-1 text-sm text-red-500">
              {{ errors['address.postalCode'] }}
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Country *
            </label>
            <select
              v-model="form.address.country"
              required
              :class="[
                'input',
                errors['address.country'] && touched['address.country'] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
              ]"
              @change="touched['address.country'] = true"
            >
              <option
                v-for="option in countryOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <p v-if="errors['address.country'] && touched['address.country']" class="mt-1 text-sm text-red-500">
              {{ errors['address.country'] }}
            </p>
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
          <span v-else>Save Company Information</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import type { CompanyInfo } from './settings.model'
import { updateCompanyInfo } from './settings-api'
import { industryTypeOptions, countryOptions } from './settings.mocks' 

interface Props {
  companyInfo: CompanyInfo
}

interface Emits {
  (e: 'update', data: CompanyInfo): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Form state
const form = reactive<CompanyInfo>({
  name: props.companyInfo.name,
  registrationNumber: props.companyInfo.registrationNumber,
  vatNumber: props.companyInfo.vatNumber,
  industryType: props.companyInfo.industryType,
  address: {
    street: props.companyInfo.address.street,
    city: props.companyInfo.address.city,
    postalCode: props.companyInfo.address.postalCode,
    country: props.companyInfo.address.country
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
    if (typeof form[key as keyof CompanyInfo] === 'object') {
      Object.keys(form[key as keyof CompanyInfo]).forEach(nestedKey => {
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
    if (typeof newForm[key as keyof CompanyInfo] === 'object') {
      Object.keys(newForm[key as keyof CompanyInfo]).forEach(nestedKey => {
        if (JSON.stringify(newForm[key as keyof CompanyInfo][nestedKey]) !== 
            JSON.stringify(oldForm[key as keyof CompanyInfo][nestedKey])) {
          touched[`${key}.${nestedKey}`] = true
        }
      })
    } else if (newForm[key as keyof CompanyInfo] !== oldForm[key as keyof CompanyInfo]) {
      touched[key] = true
    }
  })
}, { deep: true })

// Validate form
const validateForm = (): boolean => {
  errors.name = !form.name ? 'Company name is required' : ''
  errors.registrationNumber = !form.registrationNumber ? 'Registration number is required' : ''
  errors['address.street'] = !form.address.street ? 'Street address is required' : ''
  errors['address.city'] = !form.address.city ? 'City is required' : ''
  errors['address.postalCode'] = !form.address.postalCode ? 'Postal code is required' : ''
  errors['address.country'] = !form.address.country ? 'Country is required' : ''
  
  // Mark all fields as touched to show errors
  Object.keys(errors).forEach(key => {
    touched[key] = true
  })
  
  // Return true if no errors
  return !Object.values(errors).some(error => error)
}

const handleSubmit = async () => {
  // Validate form
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  updateStatus.value = null
  
  try {
    // Call API to update company info
    const updatedData = await updateCompanyInfo(form)
    
    // Emit update event with updated data
    emit('update', updatedData)
    
    // Show success message
    updateStatus.value = 'success'
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      updateStatus.value = null
    }, 3000)
  } catch (error) {
    console.error('Failed to update company information:', error)
    updateStatus.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}
</script> 