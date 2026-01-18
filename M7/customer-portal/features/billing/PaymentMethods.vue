<template>
  <div class="card">
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white">
        Payment Methods
      </h2>
      <button @click="addPaymentMethod" class="btn-primary">
        <PlusIcon class="w-5 h-5 mr-2" />
        Add Payment Method
      </button>
    </div>
    
    <div class="p-6">
      <div class="space-y-4">
        <div
          v-for="method in paymentMethods"
          :key="method.id"
          class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CreditCardIcon class="h-8 w-8 text-gray-400" />
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ method.type }} ending in {{ method.last4 }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                Expires {{ method.expiryMonth }}/{{ method.expiryYear }}
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span
              v-if="method.isDefault"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            >
              Default
            </span>
            <button
              v-if="!method.isDefault"
              @click="setDefaultPaymentMethod(method)"
              class="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <StarIcon class="w-5 h-5 mr-1" />
              <span>Set as Default</span>
            </button>
            <button
              @click="removePaymentMethod(method)"
              class="flex items-center text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            >
              <TrashIcon class="w-5 h-5 mr-1" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CreditCardIcon,
  PlusIcon,
  TrashIcon,
  StarIcon
} from '@heroicons/vue/24/outline'
import type { PaymentMethod } from './billing.model'

defineProps<{
  paymentMethods: PaymentMethod[]
}>()

const emit = defineEmits<{
  setDefaultPaymentMethod: [method: PaymentMethod]
  removePaymentMethod: [method: PaymentMethod]
  addPaymentMethod: []
}>()

const setDefaultPaymentMethod = (method: PaymentMethod) => {
  emit('setDefaultPaymentMethod', method)
}

const removePaymentMethod = (method: PaymentMethod) => {
  emit('removePaymentMethod', method)
}

const addPaymentMethod = () => {
  emit('addPaymentMethod')
}
</script> 