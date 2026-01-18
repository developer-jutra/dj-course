<template>
  <div class="card p-6 mb-6">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Status
        </label>
        <select v-model="localFilters.status" class="input">
          <option 
            v-for="status in WAREHOUSING_STATUS_OPTIONS" 
            :key="status.value" 
            :value="status.value"
          >
            {{ status.label }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Priority
        </label>
        <select v-model="localFilters.priority" class="input">
          <option 
            v-for="priority in WAREHOUSING_PRIORITY_OPTIONS" 
            :key="priority.value" 
            :value="priority.value"
          >
            {{ priority.label }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Storage Type
        </label>
        <select v-model="localFilters.storageType" class="input">
          <option 
            v-for="storageType in WAREHOUSING_STORAGE_TYPE_OPTIONS" 
            :key="storageType.value" 
            :value="storageType.value"
          >
            {{ storageType.label }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Security Level
        </label>
        <select v-model="localFilters.securityLevel" class="input">
          <option 
            v-for="securityLevel in WAREHOUSING_SECURITY_LEVEL_OPTIONS" 
            :key="securityLevel.value" 
            :value="securityLevel.value"
          >
            {{ securityLevel.label }}
          </option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Date From
        </label>
        <input
          v-model="localFilters.dateFrom"
          type="date"
          class="input"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Date To
        </label>
        <input
          v-model="localFilters.dateTo"
          type="date"
          class="input"
        />
      </div>
    </div>

    <div class="mt-4 flex justify-end">
      <button
        @click="clearFilters"
        class="btn-outline"
      >
        Clear Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { WAREHOUSING_STATUS_OPTIONS, WAREHOUSING_PRIORITY_OPTIONS, WAREHOUSING_STORAGE_TYPE_OPTIONS, WAREHOUSING_SECURITY_LEVEL_OPTIONS } from './warehousing-requests.model'
import type { WarehousingRequestsFilters } from './warehousing-requests.model'

interface Props {
  filters: WarehousingRequestsFilters
}

interface Emits {
  (e: 'update:filters', filters: WarehousingRequestsFilters): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localFilters = reactive<WarehousingRequestsFilters>({ ...props.filters })

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  Object.assign(localFilters, newFilters)
}, { deep: true })

// Automatically emit filter updates on change
watch(localFilters, (newFilters) => {
  emit('update:filters', { ...newFilters })
}, { deep: true })

// Clear filters
const clearFilters = () => {
  localFilters.status = ''
  localFilters.priority = ''
  localFilters.storageType = ''
  localFilters.securityLevel = ''
  localFilters.dateFrom = ''
  localFilters.dateTo = ''
  // update emitted automatically by watcher
}
</script> 