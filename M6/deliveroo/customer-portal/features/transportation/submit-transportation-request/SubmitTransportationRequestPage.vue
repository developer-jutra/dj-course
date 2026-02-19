<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        New Transportation Request
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Create a new road transportation request across Europe
      </p>
    </div>

    <!-- Form Progress Timeline -->
    <div class="mb-8">
      <ShipmentTimeline 
        :shipment-data="timelineData" 
        @status-change="handleStepChange"
        :disabled-steps="disabledSteps"
      />
    </div>

    <!-- Step Content -->
    <div class="card p-6 mb-8">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {{ store.stepTitle }}
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {{ store.stepDescription }}
      </p>

      <!-- Step 1: Service Type -->
      <div v-if="store.currentStep === 1">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label
            v-for="service in serviceTypes"
            :key="service.value"
            :class="[
              'relative flex cursor-pointer rounded-lg border p-4 focus:outline-none',
              store.form.serviceType === service.value
                ? 'border-primary-600 ring-2 ring-primary-600 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
              validationErrors['serviceType'] && !store.form.serviceType ? 'border-red-500' : ''
            ]"
          >
            <input
              v-model="store.form.serviceType"
              type="radio"
              :value="service.value"
              class="sr-only"
              required
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
        <div v-if="validationErrors['serviceType']" class="text-red-500 text-sm mt-2">
          {{ validationErrors['serviceType'] }}
        </div>
      </div>

      <!-- Step 2: Pickup Information -->
      <div v-if="store.currentStep === 2">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Pickup Address *
            </label>
            <input
              v-model="store.form.pickupLocation.address.street"
              type="text"
              required
              :class="['input', validationErrors['pickupLocation.address.street'] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '']"
              placeholder="Enter pickup address"
            />
            <div v-if="validationErrors['pickupLocation.address.street']" class="text-red-500 text-sm mt-1">
              {{ validationErrors['pickupLocation.address.street'] }}
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              City *
            </label>
            <input
              v-model="store.form.pickupLocation.address.city"
              type="text"
              required
              :class="['input', validationErrors['pickupLocation.address.city'] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '']"
              placeholder="Enter city"
            />
            <div v-if="validationErrors['pickupLocation.address.city']" class="text-red-500 text-sm mt-1">
              {{ validationErrors['pickupLocation.address.city'] }}
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Country *
            </label>
            <select
              v-model="store.form.pickupLocation.address.country"
              required
              :class="['input', validationErrors['pickupLocation.address.country'] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '']"
            >
              <option value="">Select country</option>
              <option value="Poland">Poland</option>
              <option value="Germany">Germany</option>
              <option value="Czech Republic">Czech Republic</option>
              <option value="Slovakia">Slovakia</option>
              <option value="Hungary">Hungary</option>
              <option value="Austria">Austria</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Belgium">Belgium</option>
              <option value="France">France</option>
            </select>
            <div v-if="validationErrors['pickupLocation.address.country']" class="text-red-500 text-sm mt-1">
              {{ validationErrors['pickupLocation.address.country'] }}
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contact Person *
            </label>
            <input
              v-model="store.form.pickupLocation.contactPerson"
              type="text"
              required
              :class="['input', validationErrors['pickupLocation.contactPerson'] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '']"
              placeholder="Contact person name"
            />
            <div v-if="validationErrors['pickupLocation.contactPerson']" class="text-red-500 text-sm mt-1">
              {{ validationErrors['pickupLocation.contactPerson'] }}
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contact Phone *
            </label>
            <input
              v-model="store.form.pickupLocation.contactPhone"
              type="tel"
              required
              :class="['input', validationErrors['pickupLocation.contactPhone'] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '']"
              placeholder="Phone number"
            />
            <div v-if="validationErrors['pickupLocation.contactPhone']" class="text-red-500 text-sm mt-1">
              {{ validationErrors['pickupLocation.contactPhone'] }}
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Preferred Pickup Date *
            </label>
            <input
              v-model="store.form.requestedPickupDate"
              type="date"
              required
              :class="['input', validationErrors['requestedPickupDate'] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '']"
            />
            <div v-if="validationErrors['requestedPickupDate']" class="text-red-500 text-sm mt-1">
              {{ validationErrors['requestedPickupDate'] }}
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Loading Type
            </label>
            <select
              v-model="store.form.pickupLocation.loadingType"
              class="input"
            >
              <option value="DOCK">Dock Loading</option>
              <option value="GROUND">Ground Level</option>
              <option value="CRANE">Crane Required</option>
              <option value="FORKLIFT">Forklift Available</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Step 3: Delivery Information -->
      <div v-if="store.currentStep === 3">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Delivery Address *
            </label>
            <input
              v-model="store.form.deliveryLocation.address.street"
              type="text"
              required
              :class="['input', validationErrors['deliveryLocation.address.street'] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '']"
              placeholder="Enter delivery address"
            />
            <div v-if="validationErrors['deliveryLocation.address.street']" class="text-red-500 text-sm mt-1">
              {{ validationErrors['deliveryLocation.address.street'] }}
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              City *
            </label>
            <input
              v-model="store.form.deliveryLocation.address.city"
              type="text"
              required
              :class="['input', validationErrors['deliveryLocation.address.city'] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '']"
              placeholder="Enter city"
            />
            <div v-if="validationErrors['deliveryLocation.address.city']" class="text-red-500 text-sm mt-1">
              {{ validationErrors['deliveryLocation.address.city'] }}
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Country *
            </label>
            <select
              v-model="store.form.deliveryLocation.address.country"
              required
              :class="['input', validationErrors['deliveryLocation.address.country'] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '']"
            >
              <option value="">Select country</option>
              <option value="Poland">Poland</option>
              <option value="Germany">Germany</option>
              <option value="Czech Republic">Czech Republic</option>
              <option value="Slovakia">Slovakia</option>
              <option value="Hungary">Hungary</option>
              <option value="Austria">Austria</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Belgium">Belgium</option>
              <option value="France">France</option>
            </select>
            <div v-if="validationErrors['deliveryLocation.address.country']" class="text-red-500 text-sm mt-1">
              {{ validationErrors['deliveryLocation.address.country'] }}
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contact Person *
            </label>
            <input
              v-model="store.form.deliveryLocation.contactPerson"
              type="text"
              required
              :class="['input', validationErrors['deliveryLocation.contactPerson'] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '']"
              placeholder="Contact person name"
            />
            <div v-if="validationErrors['deliveryLocation.contactPerson']" class="text-red-500 text-sm mt-1">
              {{ validationErrors['deliveryLocation.contactPerson'] }}
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contact Phone *
            </label>
            <input
              v-model="store.form.deliveryLocation.contactPhone"
              type="tel"
              required
              :class="['input', validationErrors['deliveryLocation.contactPhone'] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '']"
              placeholder="Phone number"
            />
            <div v-if="validationErrors['deliveryLocation.contactPhone']" class="text-red-500 text-sm mt-1">
              {{ validationErrors['deliveryLocation.contactPhone'] }}
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Preferred Delivery Date
            </label>
            <input
              v-model="store.form.requestedDeliveryDate"
              type="date"
              class="input"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Unloading Type
            </label>
            <select
              v-model="store.form.deliveryLocation.loadingType"
              class="input"
            >
              <option value="DOCK">Dock Unloading</option>
              <option value="GROUND">Ground Level</option>
              <option value="CRANE">Crane Required</option>
              <option value="FORKLIFT">Forklift Available</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Step 4: Cargo Information -->
      <div v-if="store.currentStep === 4">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Cargo Description *
            </label>
            <textarea
              v-model="store.form.cargo.description"
              rows="3"
              required
              :class="['input', validationErrors['cargo.description'] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '']"
              placeholder="Describe the cargo to be transported"
            ></textarea>
            <div v-if="validationErrors['cargo.description']" class="text-red-500 text-sm mt-1">
              {{ validationErrors['cargo.description'] }}
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Cargo Type
            </label>
            <select
              v-model="store.form.cargo.cargoType"
              class="input"
            >
              <option value="GENERAL_CARGO">General Cargo</option>
              <option value="PERISHABLE">Perishable</option>
              <option value="HAZARDOUS">Hazardous</option>
              <option value="OVERSIZED">Oversized</option>
              <option value="VALUABLE">Valuable</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Weight (kg) *
            </label>
            <input
              v-model.number="store.form.cargo.weight"
              type="number"
              min="0"
              required
              :class="['input', validationErrors['cargo.weight'] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '']"
              placeholder="Enter weight in kg"
            />
            <div v-if="validationErrors['cargo.weight']" class="text-red-500 text-sm mt-1">
              {{ validationErrors['cargo.weight'] }}
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Packaging Type
            </label>
            <select
              v-model="store.form.cargo.packaging"
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
              v-model.number="store.form.cargo.quantity"
              type="number"
              min="1"
              class="input"
              placeholder="Number of units"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Estimated Value (EUR)
            </label>
            <input
              v-model.number="store.form.cargo.value"
              type="number"
              min="0"
              class="input"
              placeholder="Enter estimated value"
            />
          </div>
        </div>
        
        <div class="mt-6 space-y-4">
          <div class="flex items-center space-x-6">
            <label class="flex items-center">
              <input
                v-model="store.form.cargo.fragile"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Fragile</span>
            </label>
            
            <label class="flex items-center">
              <input
                v-model="store.form.cargo.stackable"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Stackable</span>
            </label>
            
            <label class="flex items-center">
              <input
                v-model="store.form.requiresInsurance"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Requires Insurance</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Step 5: Special Instructions -->
      <div v-if="store.currentStep === 5">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Special Instructions
          </label>
          <textarea
            v-model="store.form.specialInstructions"
            rows="4"
            class="input"
            placeholder="Any special handling requirements, delivery instructions, or additional information..."
          ></textarea>
        </div>
        
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Priority
          </label>
          <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <label
              v-for="priority in priorities"
              :key="priority.value"
              :class="[
                'relative flex cursor-pointer rounded-lg border p-4 focus:outline-none',
                store.form.priority === priority.value
                  ? 'border-primary-600 ring-2 ring-primary-600 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              ]"
            >
              <input
                v-model="store.form.priority"
                type="radio"
                :value="priority.value"
                class="sr-only"
              />
              <div class="flex items-center">
                <div class="text-sm">
                  <div class="font-medium text-gray-900 dark:text-white">
                    {{ priority.name }}
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>
        
        <div class="mt-6">
          <label class="flex items-center">
            <input
              v-model="store.form.requiresCustomsClearance"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Requires Customs Clearance</span>
          </label>
        </div>
      </div>

      <!-- Step 6: Review & Submit -->
      <div v-if="store.currentStep === 6">
        <div class="space-y-6">
          <!-- Service Type -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Service Type</h3>
              <button 
                @click="store.goToStep(1)" 
                class="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Edit
              </button>
            </div>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {{ getServiceTypeName(store.form.serviceType) }}
            </p>
          </div>
          
          <!-- Pickup Information -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Pickup Information</h3>
              <button 
                @click="store.goToStep(2)" 
                class="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Edit
              </button>
            </div>
            <div class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <p>{{ store.form.pickupLocation.address.street }}</p>
              <p>{{ store.form.pickupLocation.address.city }}, {{ store.form.pickupLocation.address.country }}</p>
              <p class="mt-2">Contact: {{ store.form.pickupLocation.contactPerson }}</p>
              <p>Phone: {{ store.form.pickupLocation.contactPhone }}</p>
              <p class="mt-2">Pickup Date: {{ formatDate(store.form.requestedPickupDate) }}</p>
            </div>
          </div>
          
          <!-- Delivery Information -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Delivery Information</h3>
              <button 
                @click="store.goToStep(3)" 
                class="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Edit
              </button>
            </div>
            <div class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <p>{{ store.form.deliveryLocation.address.street }}</p>
              <p>{{ store.form.deliveryLocation.address.city }}, {{ store.form.deliveryLocation.address.country }}</p>
              <p class="mt-2">Contact: {{ store.form.deliveryLocation.contactPerson }}</p>
              <p>Phone: {{ store.form.deliveryLocation.contactPhone }}</p>
              <p v-if="store.form.requestedDeliveryDate" class="mt-2">
                Delivery Date: {{ formatDate(store.form.requestedDeliveryDate) }}
              </p>
            </div>
          </div>
          
          <!-- Cargo Information -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Cargo Information</h3>
              <button 
                @click="store.goToStep(4)" 
                class="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Edit
              </button>
            </div>
            <div class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <p>{{ store.form.cargo.description }}</p>
              <p class="mt-2">Weight: {{ store.form.cargo.weight }} kg</p>
              <p>Type: {{ formatCargoType(store.form.cargo.cargoType) }}</p>
              <p>Packaging: {{ formatPackaging(store.form.cargo.packaging) }}</p>
              <p>Quantity: {{ store.form.cargo.quantity }} {{ store.form.cargo.unitType }}</p>
              <div class="mt-2 flex space-x-4">
                <span v-if="store.form.cargo.fragile" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  Fragile
                </span>
                <span v-if="store.form.requiresInsurance" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Insured
                </span>
              </div>
            </div>
          </div>
          
          <!-- Special Instructions -->
          <div>
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Special Instructions</h3>
              <button 
                @click="store.goToStep(5)" 
                class="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Edit
              </button>
            </div>
            <div class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <p v-if="store.form.specialInstructions">{{ store.form.specialInstructions }}</p>
              <p v-else>No special instructions provided.</p>
              <p class="mt-2">Priority: {{ formatPriority(store.form.priority) }}</p>
              <p v-if="store.form.requiresCustomsClearance" class="mt-2">
                Requires customs clearance
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex justify-between">
      <button
        v-if="!store.isFirstStep"
        @click="store.prevStep"
        class="btn-outline"
      >
        Back
      </button>
      <div v-else></div>
      
      <div>
        <button
          v-if="!store.isLastStep"
          @click="handleNextStep"
          :disabled="!store.isStepValid"
          :class="[
            'btn-primary',
            !store.isStepValid ? 'opacity-50 cursor-not-allowed' : ''
          ]"
        >
          Next
        </button>
        
        <button
          v-else
          @click="handleSubmit"
          :disabled="store.loading"
          class="btn-primary"
        >
          <span v-if="!store.loading">Submit Request</span>
          <span v-else class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </span>
        </button>
      </div>
    </div>

    <!-- Success Modal -->
    <SuccessModal
      :show="store.success"
      title="Transportation Request Submitted Successfully!"
      message="Your transportation request has been received and is being processed by our logistics team."
      :reference-number="store.requestNumber"
      :next-steps="[
        'Our team will review your request within 2 business hours',
        'You will receive a detailed quote via email within 4 hours',
        'Once approved, we will schedule pickup and provide tracking information',
        'You can track your shipment progress in real-time through the dashboard'
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
import { ref, computed, onMounted } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { useTransportationRequestStore } from './submit-transportation-request-store'
import ShipmentTimeline from '~/features/transportation/shipment-details/ShipmentTimeline.vue'
import SuccessModal from '~/components/ui-library/modals/SuccessModal.vue'
import type { ShipmentTimelineData } from '~/features/transportation/shipment-details/shipment-timeline.model'

// Initialize store and query client
const store = useTransportationRequestStore()
const queryClient = useQueryClient()

// Service types
const serviceTypes = [
  {
    value: 'FULL_TRUCKLOAD',
    name: 'Full Truckload (FTL)',
    description: 'Dedicated truck for your cargo'
  },
  {
    value: 'LESS_THAN_TRUCKLOAD',
    name: 'Less Than Truckload (LTL)',
    description: 'Shared truck space'
  },
  {
    value: 'EXPRESS_DELIVERY',
    name: 'Express Delivery',
    description: 'Priority fast delivery'
  },
  {
    value: 'OVERSIZED_CARGO',
    name: 'Oversized Cargo',
    description: 'Special handling for large items'
  },
  {
    value: 'HAZARDOUS_MATERIALS',
    name: 'Hazardous Materials',
    description: 'ADR compliant transport'
  }
]

// Priority options
const priorities = [
  { value: 'LOW', name: 'Low' },
  { value: 'NORMAL', name: 'Normal' },
  { value: 'HIGH', name: 'High' },
  { value: 'URGENT', name: 'Urgent' }
]

// Timeline data for the ShipmentTimeline component
const timelineData = computed<ShipmentTimelineData>(() => {
  return {
    id: 'new-request',
    trackingId: 'new-request',
    currentStatusIndex: store.currentStep - 1,
    statuses: [
      {
        id: 'service-type',
        name: 'Service Type',
        timestamp: '',
        icon: 'truck',
        completed: store.currentStep > 1
      },
      {
        id: 'pickup-info',
        name: 'Pickup',
        timestamp: '',
        icon: 'package',
        completed: store.currentStep > 2
      },
      {
        id: 'delivery-info',
        name: 'Delivery',
        timestamp: '',
        icon: 'truck',
        completed: store.currentStep > 3
      },
      {
        id: 'cargo-info',
        name: 'Cargo',
        timestamp: '',
        icon: 'box',
        completed: store.currentStep > 4
      },
      {
        id: 'special-instructions',
        name: 'Instructions',
        timestamp: '',
        icon: 'package',
        completed: store.currentStep > 5
      },
      {
        id: 'review',
        name: 'Review',
        timestamp: '',
        icon: 'check',
        completed: store.currentStep > 6
      }
    ]
  }
})

// Computed property to determine which steps should be disabled in the timeline
const disabledSteps = computed(() => {
  const disabled = []
  for (let i = 1; i <= store.totalSteps; i++) {
    if (!store.canAccessStep(i)) {
      // Convert from 1-based to 0-based index for the timeline component
      disabled.push(i - 1)
    }
  }
  return disabled
})

// Computed property to get validation errors
const validationErrors = computed(() => {
  return store.validationErrors
})

// Methods
const handleStepChange = (stepIndex: number) => {
  // Convert from 0-based to 1-based index for the store
  const step = stepIndex + 1
  if (store.canAccessStep(step)) {
    store.goToStep(step)
  }
}

const handleNextStep = () => {
  if (store.validateCurrentStep()) {
    store.nextStep()
  } else {
    // Force validation to show errors
    forceValidation.value = true
  }
}

const handleSubmit = async () => {
  console.warn('🎯 handleSubmit called in component')
  console.log('Form data:', store.form)
  
  await store.submitRequest()
  
  console.log('After submitRequest - success:', store.success, 'requestNumber:', store.requestNumber)
  
  // Invalidate and refetch transportation requests query to refresh the listing
  if (store.success) {
    console.warn('🔄 Invalidating query cache...')
    // Invalidate all transportation requests queries (with any filters)
    await queryClient.invalidateQueries({ 
      queryKey: ['transportationRequests'],
      exact: false // Invalidate all queries that start with this key
    })
    // Force refetch to ensure the new data is loaded immediately
    await queryClient.refetchQueries({ 
      queryKey: ['transportationRequests'],
      exact: false
    })
    console.warn('✅ Query cache invalidated and refetched')
  } else {
    console.warn('❌ Submission was not successful, not invalidating cache')
  }
}

const navigateToRequest = () => {
  store.resetForm()
  // Redirect to Transportation Requests tab
  navigateTo('/dashboard/requests/transportation')
}

const closeSuccessModal = () => {
  store.resetForm()
  // Redirect to Transportation Requests tab
  navigateTo('/dashboard/requests/transportation')
}

const downloadPDF = async () => {
  // Only run on client side
  if (process.server) return
  
  try {
    // Dynamically import PDF generator only on client side
    const { generateTransportationRequestPDF } = await import('~/lib/pdf/transportationRequestPdfGenerator')
    
    await generateTransportationRequestPDF(store.form, {
      requestNumber: store.requestNumber,
      createdAt: new Date()
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Error generating PDF. Please try again.')
  }
}

// Helper methods for formatting
const formatDate = (dateString: string) => {
  if (!dateString) return 'Not specified'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getServiceTypeName = (type: string) => {
  const service = serviceTypes.find(s => s.value === type)
  return service ? service.name : type
}

const formatCargoType = (type: string) => {
  return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const formatPackaging = (packaging: string) => {
  return packaging.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const formatPriority = (priority: string) => {
  return priority.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

// State for forcing validation display
const forceValidation = ref(false)

// Initialize the store on component mount
onMounted(() => {
  // Reset the form when component is mounted
  store.resetForm()
})
</script>