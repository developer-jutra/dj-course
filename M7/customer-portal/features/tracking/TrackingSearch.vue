<template>
  <div class="card p-6 mb-8">
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <label for="trackingNumber" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tracking Number
        </label>
        <input
          id="trackingNumber"
          v-model="searchTrackingNumber"
          type="text"
          class="input"
          placeholder="Enter tracking number (e.g., TRK123456789)"
          @keyup.enter="handleSearch"
        />
      </div>
      <div class="flex items-end">
        <button
          @click="handleSearch"
          :disabled="!searchTrackingNumber || !searchTrackingNumber.trim() || loading"
          class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MapIcon class="w-5 h-5 mr-2" />
          <span v-if="loading">Tracking...</span>
          <span v-else>Track</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MapIcon } from '@heroicons/vue/24/outline'

interface Props {
  loading?: boolean
  initialTrackingNumber?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  initialTrackingNumber: ''
})

const emit = defineEmits<{
  search: [trackingNumber: string]
}>()

const searchTrackingNumber = ref(props.initialTrackingNumber)

// Watch for changes to initial tracking number
watch(() => props.initialTrackingNumber, (newValue) => {
  searchTrackingNumber.value = newValue
})

const handleSearch = () => {
  if (searchTrackingNumber.value && searchTrackingNumber.value.trim()) {
    emit('search', searchTrackingNumber.value.trim())
  }
}
</script>
