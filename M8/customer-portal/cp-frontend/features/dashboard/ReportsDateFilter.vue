<template>
  <div class="card p-6 mb-8">
    <div class="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
      <div class="w-full sm:w-auto">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          From Date
        </label>
        <input
          :value="dateRange.from"
          @input="updateFromDate"
          type="date"
          class="input"
        />
      </div>
      <div class="w-full sm:w-auto">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          To Date
        </label>
        <input
          :value="dateRange.to"
          @input="updateToDate"
          type="date"
          class="input"
        />
      </div>
      <div class="w-full sm:w-auto flex items-end">
        <button 
          @click="handleGenerateReports"
          :disabled="isLoading"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <span v-if="isLoading">Generating...</span>
          <span v-else>Generate Reports</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { generateReports } from './dashboard-api'

interface Props {
  dateRange: {
    from: string
    to: string
  }
  isLoading: boolean
}

interface Emits {
  (e: 'update:dateRange', value: { from: string; to: string }): void
  (e: 'update:isLoading', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const updateFromDate = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:dateRange', { ...props.dateRange, from: target.value })
}

const updateToDate = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:dateRange', { ...props.dateRange, to: target.value })
}

const handleGenerateReports = async () => {
  emit('update:isLoading', true)
  try {
    await generateReports(props.dateRange)
    console.log('Reports generated successfully')
  } catch (error) {
    console.error('Failed to generate reports:', error)
  } finally {
    emit('update:isLoading', false)
  }
}
</script> 