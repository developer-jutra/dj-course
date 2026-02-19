<template>
  <div class="space-y-6">
    <!-- Filters -->
    <WarehousingRequestsFilters 
      :filters="filters"
      @update:filters="onFiltersUpdate"
    />

    <!-- Warehousing Requests Table -->
    <WarehousingRequestsTable 
      :filters="filters"
    />
  </div>
</template>

<script setup lang="ts">
import WarehousingRequestsFilters from './WarehousingRequestsFilters.vue'
import WarehousingRequestsTable from './WarehousingRequestsTable.vue'
import type { WarehousingRequestsFilters as WarehousingRequestsFiltersType } from './warehousing-requests.model'

// Reactive filters state
const filters = reactive<WarehousingRequestsFiltersType>({
  status: '',
  priority: '',
  storageType: '',
  securityLevel: '',
  dateFrom: '',
  dateTo: ''
})

// Handle filter updates
const onFiltersUpdate = (newFilters: WarehousingRequestsFiltersType) => {
  Object.assign(filters, newFilters)
}
</script> 