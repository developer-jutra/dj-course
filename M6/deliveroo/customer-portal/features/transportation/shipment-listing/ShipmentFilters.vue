<template>
  <div class="card p-6 mb-6">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Status
        </label>
        <select v-model="store.filters.status" class="input">
          <option value="">All Statuses</option>
          <option 
            v-for="status in SHIPMENT_STATUSES" 
            :key="status.value" 
            :value="status.value"
          >
            {{ status.label }}
          </option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Service Type
        </label>
        <select v-model="store.filters.serviceType" class="input">
          <option value="">All Types</option>
          <option 
            v-for="serviceType in SHIPMENT_SERVICE_TYPES" 
            :key="serviceType.value" 
            :value="serviceType.value"
          >
            {{ serviceType.label }}
          </option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Date Range
        </label>
        <input
          v-model="store.filters.dateFrom"
          type="date"
          class="input"
          placeholder="From date"
        />
      </div>
      
      <div class="flex items-end">
        <button
          @click="clearFilters"
          class="btn-outline w-full"
        >
          Clear Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SHIPMENT_STATUSES, SHIPMENT_SERVICE_TYPES } from './shipment-filters'
import { inject } from 'vue'
import type { useShipmentsListingStore } from './shipments-listing.store'

const store = inject<ReturnType<typeof useShipmentsListingStore>>('shipmentsListing')!

const clearFilters = () => {
  store.clearFilters()
}
</script> 