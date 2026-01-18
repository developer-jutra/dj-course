<template>
  <div v-if="pagination" class="bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
    <div class="flex-1 flex justify-between sm:hidden">
      <button
        @click="onPreviousPage"
        :disabled="pagination.currentPage === 1"
        class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
      >
        Previous
      </button>
      <button
        @click="onNextPage"
        :disabled="pagination.currentPage === pagination.totalPages"
        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
      >
        Next
      </button>
    </div>
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700 dark:text-gray-300">
          Showing
          <span class="font-medium">{{ pagination.startIndex + 1 }}</span>
          to
          <span class="font-medium">{{ Math.min(pagination.endIndex, pagination.total) }}</span>
          of
          <span class="font-medium">{{ pagination.total }}</span>
          results
        </p>
      </div>
      <div>
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            @click="onPreviousPage"
            :disabled="pagination.currentPage === 1"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <ChevronLeftIcon class="h-5 w-5" />
          </button>
          
          <button
            v-for="page in pagination.visiblePages"
            :key="page"
            @click="onGoToPage(page)"
            :class="[
              'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
              page === pagination.currentPage
                ? 'z-10 bg-success-50 border-success-500 text-success-600 dark:bg-success-900 dark:text-success-200'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            ]"
          >
            {{ page }}
          </button>
          
          <button
            @click="onNextPage"
            :disabled="pagination.currentPage === pagination.totalPages"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <ChevronRightIcon class="h-5 w-5" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

interface Pagination {
  currentPage: number
  totalPages: number
  total: number
  startIndex: number
  endIndex: number
  visiblePages: number[]
}

const props = defineProps<{
  pagination: Pagination
}>()

const emit = defineEmits<{
  (e: 'previousPage'): void
  (e: 'nextPage'): void
  (e: 'goToPage', page: number): void
}>()

const onPreviousPage = () => {
  emit('previousPage')
}

const onNextPage = () => {
  emit('nextPage')
}

const onGoToPage = (page: number) => {
  emit('goToPage', page)
}
</script>
