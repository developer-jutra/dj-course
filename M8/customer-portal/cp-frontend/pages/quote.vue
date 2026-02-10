<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Request a Quote
        </h1>
        <p class="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Get a personalized quote for your logistics needs
        </p>
      </div>

      <div class="card p-8">
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- Service Type Selection -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Service Type *
            </h3>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label
                v-for="service in serviceTypes"
                :key="service.value"
                :class="[
                  'relative flex cursor-pointer rounded-lg border p-4 focus:outline-none',
                  form.serviceType === service.value
                    ? 'border-primary-600 ring-2 ring-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                ]"
              >
                <input
                  v-model="form.serviceType"
                  type="radio"
                  :value="service.value"
                  class="sr-only"
                />
                <div class="flex items-center">
                  <div class="text-sm">
                    <div class="font-medium text-gray-900 dark:text-white">
                      {{ service.name }}
                    </div>
                    <div class="text-gray-500 dark:text-gray-400">
                      {{ service.description }}
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <!-- Company Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Company Information
            </h3>
            
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
                <label for="industryType" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Industry Type
                </label>
                <select
                  id="industryType"
                  v-model="form.industryType"
                  class="input"
                >
                  <option value="">Select industry</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="retail">Retail</option>
                  <option value="automotive">Automotive</option>
                  <option value="food">Food & Beverage</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Contact Information
            </h3>
            
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="contactName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact Name *
                </label>
                <input
                  id="contactName"
                  v-model="form.contactName"
                  type="text"
                  required
                  class="input"
                  placeholder="Enter contact name"
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
          </div>

          <!-- Shipment Details -->
          <div v-if="form.serviceType === 'transportation'" class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Shipment Details
            </h3>
            
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="pickupLocation" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Pickup Location *
                </label>
                <input
                  id="pickupLocation"
                  v-model="form.pickupLocation"
                  type="text"
                  required
                  class="input"
                  placeholder="Enter pickup city/address"
                />
              </div>
              
              <div>
                <label for="deliveryLocation" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Delivery Location *
                </label>
                <input
                  id="deliveryLocation"
                  v-model="form.deliveryLocation"
                  type="text"
                  required
                  class="input"
                  placeholder="Enter delivery city/address"
                />
              </div>
            </div>
            
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="weight" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Weight (kg)
                </label>
                <input
                  id="weight"
                  v-model="form.weight"
                  type="number"
                  min="0"
                  class="input"
                  placeholder="Enter weight in kg"
                />
              </div>
              
              <div>
                <label for="pickupDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preferred Pickup Date
                </label>
                <input
                  id="pickupDate"
                  v-model="form.pickupDate"
                  type="date"
                  class="input"
                />
              </div>
            </div>
          </div>

          <!-- Warehousing Details -->
          <div v-if="form.serviceType === 'warehousing'" class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Storage Requirements
            </h3>
            
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="storageType" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Storage Type
                </label>
                <select
                  id="storageType"
                  v-model="form.storageType"
                  class="input"
                >
                  <option value="">Select storage type</option>
                  <option value="ambient">Ambient</option>
                  <option value="perishable">Perishable</option>
                  <option value="frozen">Frozen</option>
                  <option value="dry">Dry</option>
                  <option value="hazardous">Hazardous</option>
                  <option value="secure">Secure</option>
                </select>
              </div>
              
              <div>
                <label for="volume" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Estimated Volume (m³)
                </label>
                <input
                  id="volume"
                  v-model="form.volume"
                  type="number"
                  min="0"
                  class="input"
                  placeholder="Enter volume in m³"
                />
              </div>
            </div>
            
            <div>
              <label for="storageDuration" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Storage Duration
              </label>
              <select
                id="storageDuration"
                v-model="form.storageDuration"
                class="input"
              >
                <option value="">Select duration</option>
                <option value="1-7 days">1-7 days</option>
                <option value="1-4 weeks">1-4 weeks</option>
                <option value="1-6 months">1-6 months</option>
                <option value="6+ months">6+ months</option>
              </select>
            </div>
          </div>

          <!-- Additional Information -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Additional Information
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="4"
              class="input"
              placeholder="Please provide any additional details about your requirements..."
            ></textarea>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="loading"
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="!loading">Submit Quote Request</span>
              <span v-else class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Success Modal -->
    <SuccessModal
      :show="showSuccessModal"
      title="Quote Request Submitted Successfully!"
      message="Thank you for your interest in our logistics services. We have received your quote request and our team will review it promptly."
      :reference-number="generatedQuoteNumber"
      :next-steps="[
        'Our logistics specialists will review your requirements within 2 business hours',
        'We will contact you via phone or email to discuss your specific needs',
        'You will receive a detailed quote within 4 business hours',
        'Our team will help you optimize your logistics solution for best value'
      ]"
      :show-contact="true"
      :primary-action="{
        label: 'Create Account',
        action: () => navigateTo('/register')
      }"
      close-label="Submit Another Quote"
      @close="closeSuccessModal"
    />
  </div>
</template>

<script setup lang="ts">
const loading = ref(false)
const showSuccessModal = ref(false)
const generatedQuoteNumber = ref('')

const serviceTypes = [
  {
    value: 'transportation',
    name: 'Road Transportation',
    description: 'Freight delivery across Europe'
  },
  {
    value: 'warehousing',
    name: 'Warehousing',
    description: 'Storage and distribution services'
  }
]

const form = reactive({
  serviceType: '',
  companyName: '',
  industryType: '',
  contactName: '',
  phone: '',
  email: '',
  pickupLocation: '',
  deliveryLocation: '',
  weight: '',
  pickupDate: '',
  storageType: '',
  volume: '',
  storageDuration: '',
  description: ''
})

const handleSubmit = async () => {
  loading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate quote number
    generatedQuoteNumber.value = `QR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
    
    // Show success modal
    showSuccessModal.value = true
  } catch (error) {
    console.error('Quote submission failed:', error)
  } finally {
    loading.value = false
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  // Reset form for new quote
  Object.keys(form).forEach(key => {
    form[key] = ''
  })
}

definePageMeta({
  layout: 'default'
})
</script>