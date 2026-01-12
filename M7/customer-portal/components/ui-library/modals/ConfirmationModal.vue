<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center"
    @click="closeModal"
  >
    <div
      class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          {{ title }}
        </h3>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
        >
          <span class="sr-only">Close</span>
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>
      
      <!-- Content -->
      <div class="p-6">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ message }}
        </div>
      </div>
      
      <!-- Actions -->
      <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3 rounded-b-lg">
        <button
          @click="closeModal"
          class="btn-outline"
        >
          {{ cancelText }}
        </button>
        <button
          @click="confirm"
          :class="[
            'btn',
            confirmButtonStyle === 'danger' 
              ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500' 
              : 'btn-primary'
          ]"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
  show: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmButtonStyle?: 'primary' | 'danger'
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  confirmButtonStyle: 'primary'
})

const emit = defineEmits<{
  close: []
  confirm: []
}>()

const closeModal = () => {
  emit('close')
}

const confirm = () => {
  emit('confirm')
  closeModal()
}
</script>