<template>
  <div>
    <!-- Header Section -->
    <div class="mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Shipments
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Monitor and manage your active shipments across Europe
        </p>
      </div>
    </div>

    <!-- Filters -->
    <ShipmentFilters />

    <!-- Data Table -->
    <ShipmentDataTable />
  </div>
</template>

<script setup lang="ts">
import ShipmentFilters from './ShipmentFilters.vue'
import ShipmentDataTable from './ShipmentDataTable.vue'
import { useShipmentsListingStore } from './shipments-listing.store'
import { provide } from 'vue'

const store = useShipmentsListingStore()
provide('shipmentsListing', store)
</script>