<template>
  <div>
    <div class="text-center mb-6">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
        Create Company Account
      </h2>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Already have an account?
        <NuxtLink to="/login" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
          Sign in here
        </NuxtLink>
      </p>
    </div>

    <form @submit.prevent="handleRegister" class="space-y-6">
      <!-- Company Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Company Information</h3>
        
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label for="companyName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Company Name *
            </label>
            <input
              id="companyName"
              v-model="form.companyName"
              type="text"
              required
              class="input"
              placeholder="Enter company name"
            />
          </div>
          
          <div>
            <label for="registrationNumber" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Registration Number *
            </label>
            <input
              id="registrationNumber"
              v-model="form.registrationNumber"
              type="text"
              required
              class="input"
              placeholder="Enter registration number"
            />
          </div>
        </div>
        
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label for="vatNumber" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              VAT Number
            </label>
            <input
              id="vatNumber"
              v-model="form.vatNumber"
              type="text"
              class="input"
              placeholder="Enter VAT number"
            />
          </div>
          
          <div>
            <label for="industryType" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Industry Type *
            </label>
            <select
              id="industryType"
              v-model="form.industryType"
              required
              class="input"
            >
              <option value="">Select industry</option>
              <option
                v-for="industry in industryOptions"
                :key="industry.value"
                :value="industry.value"
              >
                {{ industry.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Primary Contact</h3>
        
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              First Name *
            </label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              required
              class="input"
              placeholder="Enter first name"
            />
          </div>
          
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Name *
            </label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              required
              class="input"
              placeholder="Enter last name"
            />
          </div>
        </div>
        
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address *
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input"
              placeholder="Enter email address"
            />
          </div>
          
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number *
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              required
              class="input"
              placeholder="Enter phone number"
            />
          </div>
        </div>
      </div>

      <!-- Address Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Company Address</h3>
        
        <div>
          <label for="street" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Street Address *
          </label>
          <input
            id="street"
            v-model="form.address.street"
            type="text"
            required
            class="input"
            placeholder="Enter street address"
          />
        </div>
        
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label for="city" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              City *
            </label>
            <input
              id="city"
              v-model="form.address.city"
              type="text"
              required
              class="input"
              placeholder="Enter city"
            />
          </div>
          
          <div>
            <label for="postalCode" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Postal Code *
            </label>
            <input
              id="postalCode"
              v-model="form.address.postalCode"
              type="text"
              required
              class="input"
              placeholder="Enter postal code"
            />
          </div>
          
          <div>
            <label for="country" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Country *
            </label>
            <select
              id="country"
              v-model="form.address.country"
              required
              class="input"
            >
              <option value="">Select country</option>
              <option
                v-for="country in countryOptions"
                :key="country.value"
                :value="country.value"
              >
                {{ country.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Account Security -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Account Security</h3>
        
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password *
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="input"
              placeholder="Enter password"
            />
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password *
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              class="input"
              placeholder="Confirm password"
            />
          </div>
        </div>
      </div>

      <!-- Terms and Conditions -->
      <div class="flex items-center">
        <input
          id="terms"
          v-model="form.acceptTerms"
          type="checkbox"
          required
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label for="terms" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
          I agree to the
          <NuxtLink to="/terms-of-service" class="text-primary-600 hover:text-primary-500 dark:text-primary-400">
            Terms of Service
          </NuxtLink>
          and
          <NuxtLink to="/privacy-policy" class="text-primary-600 hover:text-primary-500 dark:text-primary-400">
            Privacy Policy
          </NuxtLink>
        </label>
      </div>

      <div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="!loading">Create Account</span>
          <span v-else class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Account...
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { register } from './register-api'
import { countryOptions, industryOptions } from './register.mocks'
import type { RegisterFormData } from './register.model'

interface Emits {
  (e: 'success', data: { user: any; company: any }): void
  (e: 'error', error: string): void
}

const emit = defineEmits<Emits>()

const loading = ref(false)

const form = reactive<RegisterFormData>({
  companyName: '',
  registrationNumber: '',
  vatNumber: '',
  industryType: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: {
    street: '',
    city: '',
    postalCode: '',
    country: ''
  },
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    emit('error', 'Passwords do not match')
    return
  }

  loading.value = true
  
  try {
    const result = await register(form)
    emit('success', result)
  } catch (error) {
    emit('error', error instanceof Error ? error.message : 'Registration failed')
    console.error('Registration failed:', error)
  } finally {
    loading.value = false
  }
}
</script>
