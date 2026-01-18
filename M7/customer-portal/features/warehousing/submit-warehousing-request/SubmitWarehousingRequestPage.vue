<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        New Warehousing Request
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Create a new storage and warehousing request
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Storage Requirements -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Storage Requirements
        </h3>
        
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Storage Type *
            </label>
            <select
              v-model="form.storageType"
              required
              class="input"
            >
              <option value="">Select storage type</option>
              <option value="AMBIENT">Ambient (15-25°C)</option>
              <option value="PERISHABLE">Perishable (2-8°C)</option>
              <option value="FROZEN">Frozen (-18°C)</option>
              <option value="DRY">Dry (15-25°C)</option>
              <option value="HAZARDOUS">Hazardous Materials</option>
              <option value="SECURE">High Security</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Security Level
            </label>
            <select
              v-model="form.securityLevel"
              class="input"
            >
              <option value="STANDARD">Standard</option>
              <option value="HIGH">High Security</option>
              <option value="MAXIMUM">Maximum Security</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Estimated Volume (m³) *
            </label>
            <input
              v-model.number="form.estimatedVolume"
              type="number"
              min="0"
              step="0.1"
              required
              class="input"
              placeholder="Enter volume in cubic meters"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Estimated Weight (kg) *
            </label>
            <input
              v-model.number="form.estimatedWeight"
              type="number"
              min="0"
              required
              class="input"
              placeholder="Enter weight in kg"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Storage Duration *
            </label>
            <div class="flex space-x-2">
              <input
                v-model.number="form.estimatedStorageDuration.value"
                type="number"
                min="1"
                required
                class="input flex-1"
                placeholder="Duration"
              />
              <select
                v-model="form.estimatedStorageDuration.unit"
                required
                class="input w-32"
              >
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Planned Start Date *
            </label>
            <input
              v-model="form.plannedStartDate"
              type="date"
              required
              class="input"
            />
          </div>
        </div>
        
        <div class="mt-6 space-y-4">
          <div class="flex items-center space-x-6">
            <label class="flex items-center">
              <input
                v-model="form.requiresTemperatureControl"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Requires Temperature Control</span>
            </label>
            
            <label class="flex items-center">
              <input
                v-model="form.requiresHumidityControl"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Requires Humidity Control</span>
            </label>
            
            <label class="flex items-center">
              <input
                v-model="form.requiresSpecialHandling"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Requires Special Handling</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Cargo Information -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Cargo Information
        </h3>
        
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Cargo Description *
            </label>
            <textarea
              v-model="form.cargo.description"
              rows="3"
              required
              class="input"
              placeholder="Describe the items to be stored"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Cargo Type
            </label>
            <select
              v-model="form.cargo.cargoType"
              class="input"
            >
              <option value="GENERAL_CARGO">General Cargo</option>
              <option value="PERISHABLE">Perishable</option>
              <option value="HAZARDOUS">Hazardous</option>
              <option value="VALUABLE">Valuable</option>
              <option value="BULK_DRY">Bulk Dry</option>
              <option value="BULK_LIQUID">Bulk Liquid</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Packaging Type
            </label>
            <select
              v-model="form.cargo.packaging"
              class="input"
            >
              <option value="PALLETS">Pallets</option>
              <option value="BOXES">Boxes</option>
              <option value="CRATES">Crates</option>
              <option value="BULK">Bulk</option>
              <option value="CONTAINERS">Containers</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Quantity
            </label>
            <input
              v-model.number="form.cargo.quantity"
              type="number"
              min="1"
              class="input"
              placeholder="Number of units"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Unit Type
            </label>
            <input
              v-model="form.cargo.unitType"
              type="text"
              class="input"
              placeholder="e.g., pallets, boxes, pieces"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Estimated Value (EUR)
            </label>
            <input
              v-model.number="form.cargo.value"
              type="number"
              min="0"
              class="input"
              placeholder="Enter estimated value"
            />
          </div>
        </div>
      </div>

      <!-- Handling Services -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Handling Services
        </h3>
        
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <label
            v-for="service in handlingServices"
            :key="service.value"
            class="flex items-center"
          >
            <input
              v-model="form.handlingServices"
              type="checkbox"
              :value="service.value"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ service.name }}</span>
          </label>
        </div>
      </div>

      <!-- Value-Added Services -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Value-Added Services
        </h3>
        
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <label
            v-for="service in valueAddedServices"
            :key="service.value"
            class="flex items-center"
          >
            <input
              v-model="form.valueAddedServices"
              type="checkbox"
              :value="service.value"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ service.name }}</span>
          </label>
        </div>
      </div>

      <!-- Special Instructions -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Special Instructions
        </h3>
        <textarea
          v-model="form.specialInstructions"
          rows="4"
          class="input"
          placeholder="Any special storage requirements, handling instructions, or additional information..."
        ></textarea>
      </div>

      <!-- Submit Buttons -->
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="saveDraft"
          class="btn-outline"
        >
          Save as Draft
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="btn-primary"
        >
          <span v-if="!loading">Submit Request</span>
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

    <!-- Success Modal -->
    <SuccessModal
      :show="showSuccessModal"
      title="Warehousing Request Submitted Successfully!"
      message="Your warehousing request has been received and our storage specialists are reviewing your requirements."
      :reference-number="generatedRequestNumber"
      :next-steps="[
        'Our warehousing team will assess space availability within 1 business hour',
        'You will receive a detailed storage quote and terms within 3 hours',
        'Upon approval, we will coordinate cargo receipt and storage setup',
        'You can monitor your inventory status through the dashboard'
      ]"
      :show-contact="true"
      :primary-action="{
        label: 'View Request',
        action: () => navigateToRequest()
      }"
      :secondary-action="{
        label: 'Download PDF',
        action: () => downloadPDF()
      }"
      close-label="Create Another Request"
      @close="closeSuccessModal"
    />
  </div>
</template>

<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'
import SuccessModal from '~/components/ui-library/modals/SuccessModal.vue'
import { submitWarehousingRequest } from './submit-warehousing-request-api'

const loading = ref(false)
const showSuccessModal = ref(false)
const generatedRequestNumber = ref('')
const queryClient = useQueryClient()

const handlingServices = [
  { value: 'LOADING', name: 'Loading' },
  { value: 'UNLOADING', name: 'Unloading' },
  { value: 'SORTING', name: 'Sorting' },
  { value: 'PICKING', name: 'Picking' },
  { value: 'PACKING', name: 'Packing' }
]

const valueAddedServices = [
  { value: 'LABELING', name: 'Labeling' },
  { value: 'REPACKAGING', name: 'Repackaging' },
  { value: 'QUALITY_CONTROL', name: 'Quality Control' },
  { value: 'CROSS_DOCKING', name: 'Cross Docking' },
  { value: 'KITTING', name: 'Kitting' }
]

const form = reactive({
  storageType: '',
  estimatedVolume: 0,
  estimatedWeight: 0,
  estimatedStorageDuration: {
    value: 1,
    unit: 'months'
  },
  plannedStartDate: '',
  plannedEndDate: '',
  handlingServices: [] as string[],
  valueAddedServices: [] as string[],
  securityLevel: 'STANDARD',
  requiresTemperatureControl: false,
  requiresHumidityControl: false,
  requiresSpecialHandling: false,
  specialInstructions: '',
  billingType: 'MONTHLY',
  cargo: {
    description: '',
    cargoType: 'GENERAL_CARGO',
    packaging: 'PALLETS',
    quantity: 1,
    unitType: 'pallets',
    value: 0,
    currency: 'EUR'
  },
  priority: 'NORMAL'
})

const handleSubmit = async () => {
  loading.value = true
  
  try {
    const response = await submitWarehousingRequest(form)
    generatedRequestNumber.value = response.requestNumber
    showSuccessModal.value = true
    
    // Invalidate and refetch warehousing requests query to refresh the listing
    await queryClient.invalidateQueries({ 
      queryKey: ['warehousingRequests'],
      exact: false
    })
    await queryClient.refetchQueries({ 
      queryKey: ['warehousingRequests'],
      exact: false
    })
  } catch (error) {
    console.error('Request submission failed:', error)
  } finally {
    loading.value = false
  }
}

const saveDraft = async () => {
  // Save as draft logic
  console.log('Saving as draft...')
}

const navigateToRequest = () => {
  // Reset form and redirect to Warehousing Requests tab
  closeSuccessModal()
  navigateTo('/dashboard/requests/warehousing')
}

const downloadPDF = async () => {
  // Only run on client side
  if (process.server) return
  
  try {
    // Dynamically import PDF generator only on client side
    const { generateWarehousingRequestPDF } = await import('~/lib/pdf/warehousingRequestPdfGenerator')
    
    // Ensure form data is properly formatted
    const formData = {
      storageType: form.storageType || '',
      securityLevel: form.securityLevel || 'STANDARD',
      estimatedVolume: form.estimatedVolume || 0,
      estimatedWeight: form.estimatedWeight || 0,
      estimatedStorageDuration: form.estimatedStorageDuration || { value: 1, unit: 'months' },
      plannedStartDate: form.plannedStartDate || new Date().toISOString(),
      plannedEndDate: form.plannedEndDate || undefined,
      handlingServices: form.handlingServices || [],
      valueAddedServices: form.valueAddedServices || [],
      requiresTemperatureControl: form.requiresTemperatureControl || false,
      requiresHumidityControl: form.requiresHumidityControl || false,
      requiresSpecialHandling: form.requiresSpecialHandling || false,
      specialInstructions: form.specialInstructions || undefined,
      billingType: form.billingType || 'MONTHLY',
      cargo: {
        description: form.cargo?.description || '',
        cargoType: form.cargo?.cargoType || 'GENERAL_CARGO',
        packaging: form.cargo?.packaging || 'PALLETS',
        quantity: form.cargo?.quantity || 0,
        unitType: form.cargo?.unitType || '',
        value: form.cargo?.value || 0,
        currency: form.cargo?.currency || 'EUR'
      },
      priority: form.priority || 'NORMAL'
    }
    
    await generateWarehousingRequestPDF(formData, {
      requestNumber: generatedRequestNumber.value,
      createdAt: new Date()
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    console.error('Error details:', error instanceof Error ? error.message : error)
    alert(`Error generating PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  // Reset form for new request
  form.storageType = ''
  form.estimatedVolume = 0
  form.estimatedWeight = 0
  form.estimatedStorageDuration = { value: 1, unit: 'months' }
  form.plannedStartDate = ''
  form.plannedEndDate = ''
  form.handlingServices = []
  form.valueAddedServices = []
  form.securityLevel = 'STANDARD'
  form.requiresTemperatureControl = false
  form.requiresHumidityControl = false
  form.requiresSpecialHandling = false
  form.specialInstructions = ''
  form.cargo = {
    description: '',
    cargoType: 'GENERAL_CARGO',
    packaging: 'PALLETS',
    quantity: 1,
    unitType: 'pallets',
    value: 0,
    currency: 'EUR'
  }
  // Redirect to Warehousing Requests tab after closing modal
  navigateTo('/dashboard/requests/warehousing')
}
</script>