<template>
  <div class="card p-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
      Export Reports
    </h3>
    <div class="flex flex-wrap gap-4">
      <button 
        @click="handleExportReport('pdf')"
        class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
      >
        Export as PDF
      </button>
      <button 
        @click="handleExportReport('excel')"
        class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
      >
        Export as Excel
      </button>
      <button
        @click="handleExportReport('csv')"
        class="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 btn-outline"
      >
        <DocumentArrowDownIcon class="w-5 h-5 mr-2" />
        <span>Export CSV</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DocumentArrowDownIcon } from '@heroicons/vue/24/outline'
import { exportReport } from './dashboard-api'

const handleExportReport = async (format: string) => {
  try {
    await exportReport(format)
  } catch (error) {
    console.error(`Failed to export report as ${format}:`, error)
  }
}
</script> 