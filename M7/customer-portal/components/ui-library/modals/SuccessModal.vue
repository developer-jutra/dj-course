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
      <div class="flex items-center justify-center pt-6 pb-4">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900">
          <CheckCircleIcon class="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
      </div>
      
      <!-- Content -->
      <div class="px-6 pb-6">
        <div class="text-center">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ title }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {{ message }}
          </p>
          
          <!-- Reference Number -->
          <div v-if="referenceNumber" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
            <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Reference Number
            </p>
            <p class="text-lg font-mono font-semibold text-gray-900 dark:text-white">
              {{ referenceNumber }}
            </p>
          </div>
          
          <!-- Next Steps -->
          <div v-if="nextSteps.length > 0" class="text-left bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
            <h4 class="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
              What happens next?
            </h4>
            <ul class="space-y-2">
              <li
                v-for="(step, index) in nextSteps"
                :key="index"
                class="flex items-start text-sm text-blue-800 dark:text-blue-300"
              >
                <span class="flex-shrink-0 w-5 h-5 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400 mr-3 mt-0.5">
                  {{ index + 1 }}
                </span>
                {{ step }}
              </li>
            </ul>
          </div>
          
          <!-- Contact Information -->
          <div v-if="showContact" class="text-left bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Need immediate assistance?
            </h4>
            <div class="space-y-2">
              <a
                href="tel:+48123456789"
                class="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <PhoneIcon class="w-4 h-4 mr-2" />
                +48 123 456 789
              </a>
              <a
                href="mailto:contact@deliveroo.pl"
                class="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <EnvelopeIcon class="w-4 h-4 mr-2" />
                contact@deliveroo.pl
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="px-6 pb-6 flex flex-col gap-3">
        <div v-if="primaryAction || secondaryAction" class="flex flex-col sm:flex-row gap-3">
          <button
            v-if="primaryAction"
            @click="handlePrimaryAction"
            class="flex-1 btn-primary"
          >
            {{ primaryAction.label }}
          </button>
          <button
            v-if="secondaryAction"
            @click="handleSecondaryAction"
            class="flex-1 btn-outline"
          >
            {{ secondaryAction.label }}
          </button>
        </div>
        <button
          @click="closeModal"
          class="w-full btn-outline"
        >
          {{ closeLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/vue/24/outline'

interface PrimaryAction {
  label: string
  action: () => void
}

interface SecondaryAction {
  label: string
  action: () => void
}

interface Props {
  show: boolean
  title: string
  message: string
  referenceNumber?: string
  nextSteps?: string[]
  showContact?: boolean
  primaryAction?: PrimaryAction
  secondaryAction?: SecondaryAction
  closeLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  nextSteps: () => [],
  showContact: false,
  closeLabel: 'Close'
})

const emit = defineEmits<{
  close: []
}>()

const closeModal = () => {
  emit('close')
}

const handlePrimaryAction = () => {
  if (props.primaryAction) {
    props.primaryAction.action()
  }
}

const handleSecondaryAction = () => {
  if (props.secondaryAction) {
    props.secondaryAction.action()
  }
}
</script>