<template>
  <div>
    <StorageListingFilters :filters="filters" @update:filters="updateFilters" />
    <StorageListingTable :filters="filters" />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import StorageListingFilters from './StorageListingFilters.vue'
import StorageListingTable from './StorageListingTable.vue'

const filters = reactive({ status: '', cargoType: '' })

const updateFilters = (newFilters: { status: string; cargoType: string }) => {
  filters.status = newFilters.status
  filters.cargoType = newFilters.cargoType
}
</script>
