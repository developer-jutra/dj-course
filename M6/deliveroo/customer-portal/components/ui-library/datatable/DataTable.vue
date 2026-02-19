<template>
  <div>
    <!-- Header Section -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ title }}
        </h2>
        <p v-if="description" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ description }}
        </p>
      </div>
      <div v-if="headerActions && headerActions.length > 0" class="flex space-x-3">
        <button
          v-for="action in headerActions"
          :key="action.label"
          @click="action.handler"
          :class="[
            'btn',
            action.variant === 'primary' ? 'btn-primary' : action.variant === 'secondary' ? 'btn-secondary' : 'btn-outline'
          ]"
        >
          <component v-if="action.icon" :is="action.icon" class="w-5 h-5 mr-2" />
          {{ action.label }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card p-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p class="text-gray-500 dark:text-gray-400">{{ loadingText || 'Loading...' }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-8 text-center">
      <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
        <ExclamationTriangleIcon class="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {{ errorTitle || 'Error Loading Data' }}
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        {{ errorMessage || 'There was a problem loading the data.' }}
      </p>
      <button 
        v-if="onRetry"
        @click="onRetry" 
        class="btn-primary"
      >
        Try Again
      </button>
    </div>

    <!-- Data Table -->
    <div v-else-if="data && data.length > 0" class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ column.label }}
              </th>
              <th
                v-if="hasRowActions"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="(item, index) in data"
              :key="getRowKey(item, index)"
              class="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td
                v-for="column in columns"
                :key="column.key"
                class="px-6 py-4 whitespace-nowrap"
              >
                <slot
                  :name="`cell-${column.key}`"
                  :item="item"
                  :column="column"
                  :value="getColumnValue(item, column.key)"
                >
                  <!-- Default cell rendering - just display the value -->
                  <div class="text-sm text-gray-900 dark:text-white">
                    {{ getColumnValue(item, column.key) }}
                  </div>
                </slot>
              </td>
              <td
                v-if="hasRowActions"
                class="px-6 py-4 whitespace-nowrap text-sm font-medium"
              >
                <div class="flex space-x-3">
                  <button
                    v-for="action in getRowActions(item)"
                    :key="action.label"
                    type="button"
                    @click.stop.prevent="handleRowAction(action, item)"
                    :class="[
                      'flex items-center',
                      action.class || 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                    ]"
                  >
                    <component v-if="action.icon" :is="action.icon" class="w-5 h-5 mr-1" />
                    <span>{{ action.label }}</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <Pagination
        v-if="showPagination && pagination"
        :pagination="pagination"
        @previousPage="onPreviousPage"
        @nextPage="onNextPage"
        @goToPage="onGoToPage"
      />
      
    </div>

    <!-- Empty State -->
    <div v-else class="card p-8 text-center">
      <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        <component v-if="emptyIcon" :is="emptyIcon" class="h-8 w-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {{ emptyTitle || 'No Data Found' }}
      </h3>
      <p class="text-gray-500 dark:text-gray-400">
        {{ emptyMessage || 'No data available to display.' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import Pagination from '~/components/ui-library/pagination/Pagination.vue'

interface Column {
  key: string
  label: string
  subKey?: string // For accessing nested properties
}

interface HeaderAction {
  label: string
  handler: () => void | Promise<void>
  icon?: any
  variant?: 'primary' | 'secondary' | 'outline'
}

interface RowAction {
  label: string
  handler: (item: any) => void | Promise<void>
  icon?: any
  class?: string
  condition?: (item: any) => boolean
}

interface Pagination {
  currentPage: number
  totalPages: number
  total: number
  startIndex: number
  endIndex: number
  visiblePages: number[]
}

interface Props {
  title: string
  description?: string
  data?: any[]
  columns: Column[]
  loading?: boolean
  error?: boolean
  loadingText?: string
  errorTitle?: string
  errorMessage?: string
  headerActions?: HeaderAction[]
  rowActions?: RowAction[]
  pagination?: Pagination
  showPagination?: boolean
  emptyTitle?: string
  emptyMessage?: string
  emptyIcon?: any
  rowKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  loading: false,
  error: false,
  showPagination: true,
  rowKey: 'id'
})

const emit = defineEmits<{
  retry: []
  previousPage: []
  nextPage: []
  goToPage: [page: number]
}>()

// Computed properties
const hasRowActions = computed(() => {
  return props.rowActions && props.rowActions.length > 0
})

// Methods
const getRowKey = (item: any, index: number) => {
  return item[props.rowKey] || index
}

const getColumnValue = (item: any, key: string) => {
  return key.split('.').reduce((obj, prop) => obj?.[prop], item)
}

const getRowActions = (item: any) => {
  if (!props.rowActions) return []
  return props.rowActions.filter(action => {
    return !action.condition || action.condition(item)
  })
}

const handleRowAction = async (action: RowAction, item: any) => {
  console.log('handleRowAction called:', { action: action.label, item })
  try {
    if (action.handler) {
      console.log('Calling handler for:', action.label)
      await action.handler(item)
      console.log('Handler completed for:', action.label)
    } else {
      console.warn('No handler found for action:', action.label)
    }
  } catch (error) {
    console.error('Error executing row action:', error)
  }
}

// Event handlers
const onRetry = () => {
  emit('retry')
}

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
