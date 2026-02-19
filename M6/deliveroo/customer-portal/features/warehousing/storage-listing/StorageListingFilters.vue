<template>
  <div class="card p-6 mb-6">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
        <select v-model="localFilters.status" class="input">
          <option v-for="opt in STORAGE_STATUS_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cargo Type</label>
        <select v-model="localFilters.cargoType" class="input">
          <option v-for="opt in CARGO_TYPE_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { STORAGE_STATUS_OPTIONS, CARGO_TYPE_OPTIONS } from './storage-listing.model'

interface Filters {
  status: string
  cargoType: string
}

const props = defineProps<{ filters: Filters }>()
const emit = defineEmits<{
  (e: 'update:filters', filters: Filters): void
}>()

const localFilters = reactive<Filters>({ ...props.filters })

watch(
  () => props.filters,
  (newFilters) => Object.assign(localFilters, newFilters),
  { deep: true }
)

watch(
  () => localFilters,
  (newFilters) => emit('update:filters', { ...newFilters }),
  { deep: true }
)
</script> 