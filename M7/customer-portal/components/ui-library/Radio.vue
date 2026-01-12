<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string
  value: string
  label?: string
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<Emits>()

const isSelected = computed(() => props.modelValue === props.value)

const selectRadio = () => {
  if (!props.disabled) {
    emit('update:modelValue', props.value)
  }
}

// Generate unique ID for accessibility
const radioId = `radio-${Math.random().toString(36).substr(2, 9)}`
</script>

<template>
  <div class="flex items-center">
    <div class="relative">
      <input
        :id="radioId"
        type="radio"
        :value="value"
        :checked="isSelected"
        @change="selectRadio"
        :disabled="disabled"
        class="sr-only"
      />
      <div
        @click="selectRadio"
        class="w-5 h-5 rounded-full border-2 cursor-pointer transition-all duration-200 flex items-center justify-center"
        :class="{
          'border-blue-500': isSelected && !disabled,
          'border-gray-300': !isSelected && !disabled,
          'border-gray-200 cursor-not-allowed': disabled,
          'hover:border-blue-400': !disabled && !isSelected,
          'hover:border-blue-600': !disabled && isSelected
        }"
      >
        <div
          v-show="isSelected"
          class="w-2.5 h-2.5 rounded-full transition-all duration-200"
          :class="{
            'bg-blue-500': !disabled,
            'bg-gray-400': disabled
          }"
        />
      </div>
    </div>
    <label
      v-if="label"
      :for="radioId"
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