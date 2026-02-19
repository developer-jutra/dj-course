<script setup lang="ts">
import { computed } from 'vue'

interface Option {
  id: string
  label: string
  value: string
  disabled?: boolean
}

interface Props {
  options: Option[]
  modelValue?: string[]
  title?: string
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => []
})

const emit = defineEmits<Emits>()

const selectedValues = computed({
  get: () => props.modelValue,
  set: (value: string[]) => emit('update:modelValue', value)
})

// Generate unique IDs for accessibility
const generateId = (optionId: string) => `checkbox-list-${optionId}-${Math.random().toString(36).substr(2, 9)}`
</script>

<template>
  <div class="space-y-3">
    <h3 v-if="title" class="text-sm font-medium text-gray-900 mb-3">{{ title }}</h3>
    <div class="space-y-2">
      <div
        v-for="option in options"
        :key="option.id"
        class="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-150"
        :class="{
          'bg-blue-50 border-blue-200': selectedValues.includes(option.value),
          'opacity-50 cursor-not-allowed': option.disabled
        }"
      >
        <div class="relative">
          <input
            :id="generateId(option.id)"
            type="checkbox"
            v-model="selectedValues"
            :value="option.value"
            :disabled="option.disabled"
            class="sr-only"
          />
          <div
            class="w-5 h-5 rounded border-2 cursor-pointer transition-all duration-200 flex items-center justify-center"
            :class="{
              'border-blue-500 bg-blue-500': selectedValues.includes(option.value) && !option.disabled,
              'border-gray-300 bg-white': !selectedValues.includes(option.value) && !option.disabled,
              'border-gray-200 bg-gray-100 cursor-not-allowed': option.disabled,
              'hover:border-blue-400': !option.disabled && !selectedValues.includes(option.value),
              'hover:bg-blue-600': !option.disabled && selectedValues.includes(option.value)
            }"
          >
            <svg
              v-show="selectedValues.includes(option.value)"
              class="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <label
          :for="generateId(option.id)"
          class="ml-3 text-sm font-medium cursor-pointer select-none flex-1"
          :class="{
            'text-gray-900': !option.disabled,
            'text-gray-400 cursor-not-allowed': option.disabled
          }"
        >
          {{ option.label }}
        </label>
      </div>
    </div>
  </div>
</template>