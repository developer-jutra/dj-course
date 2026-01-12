<template>
  <div class="card p-6 mb-6">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Status
        </label>
        <select v-model="localFilters.status" class="input">
          <option value="">All Statuses</option>
          <option 
            v-for="status in TRANSPORTATION_REQUEST_STATUSES" 
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
        <select v-model="localFilters.serviceType" class="input">
          <option value="">All Types</option>
          <option 
            v-for="serviceType in TRANSPORTATION_SERVICE_TYPES" 
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
          v-model="localFilters.dateFrom"
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
import { 
  type TransportationRequestFilters,
  TRANSPORTATION_REQUEST_STATUSES,
  TRANSPORTATION_SERVICE_TYPES
} from './transportation-requests-filter'

interface Props {
  filters?: TransportationRequestFilters
}

const props = withDefaults(defineProps<Props>(), {
  filters: () => ({
    status: '',
    serviceType: '',
    dateFrom: ''
  })
})

const emit = defineEmits<{
  'update:filters': [filters: TransportationRequestFilters]
  'clear-filters': []
}>()

// Local reactive copy of filters
const localFilters = reactive<TransportationRequestFilters>({
  status: props.filters.status,
  serviceType: props.filters.serviceType,
  dateFrom: props.filters.dateFrom
})

// Watch for external filter changes and update local state
watch(() => props.filters, (newFilters) => {
  localFilters.status = newFilters.status
  localFilters.serviceType = newFilters.serviceType
  localFilters.dateFrom = newFilters.dateFrom
}, { deep: true })

// Watch local filters and emit changes
watch(localFilters, (newFilters) => {
  emit('update:filters', { ...newFilters })
}, { deep: true })

const clearFilters = () => {
  localFilters.status = ''
  localFilters.serviceType = ''
  localFilters.dateFrom = ''
  emit('clear-filters')
}
</script>
