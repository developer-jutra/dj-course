<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: boolean
  label?: string
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false
})

const emit = defineEmits<Emits>()

const isChecked = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const toggleCheckbox = () => {
  if (!props.disabled) {
    isChecked.value = !isChecked.value
  }
}

// Generate unique ID for accessibility
const checkboxId = `checkbox-${Math.random().toString(36).substr(2, 9)}`
</script>

<template>
  <div class="flex items-center">
    <div class="relative">
      <input
        :id="checkboxId"
        type="checkbox"
        v-model="isChecked"
        :disabled="disabled"
        class="sr-only"
      />
      <div
        @click="toggleCheckbox"
        class="w-5 h-5 rounded border-2 cursor-pointer transition-all duration-200 flex items-center justify-center"
        :class="{
          'border-blue-500 bg-blue-500': isChecked && !disabled,
          'border-gray-300 bg-white': !isChecked && !disabled,
          'border-gray-200 bg-gray-100 cursor-not-allowed': disabled,
          'hover:border-blue-400': !disabled && !isChecked,
          'hover:bg-blue-600': !disabled && isChecked
        }"
      >
        <svg
          v-show="isChecked"
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
      v-if="label"
      :for="checkboxId"
      class="ml-3 text-sm font-medium cursor-pointer select-none"
      :class="{
        'text-gray-900': !disabled,
        'text-gray-400 cursor-not-allowed': disabled
      }"
    >
      {{ label }}
    </label>
  </div>
</template>
