<template>
  <div>

    <!-- Filters -->
    <TransportationRequestsFilters
      :filters="filters"
      @update:filters="updateFilters"
      @clear-filters="clearFilters"
    />

    <!-- Data Table -->
    <TransportationRequestsDataTable :filters="filters" />
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import TransportationRequestsFilters from './TransportationRequestsFilters.vue'
import TransportationRequestsDataTable from './TransportationRequestsDataTable.vue'
import { type TransportationRequestFilters } from './transportation-requests-filter'

// Filter state management
const filters = reactive<TransportationRequestFilters>({
  status: '',
  serviceType: '',
  dateFrom: ''
})

// Handle filter updates from the filters component
const updateFilters = (newFilters: TransportationRequestFilters) => {
  filters.status = newFilters.status
  filters.serviceType = newFilters.serviceType
  filters.dateFrom = newFilters.dateFrom
}

// Handle clear filters event
const clearFilters = () => {
  filters.status = ''
  filters.serviceType = ''
  filters.dateFrom = ''
}
</script>
