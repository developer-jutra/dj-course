<script setup lang="ts">
interface Option {
  id: string
  label: string
  value: string
  disabled?: boolean
}

interface Props {
  options: Option[]
  modelValue?: string
  title?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectOption = (value: string) => {
  emit('update:modelValue', value)
}

// Generate unique IDs for accessibility and radio group name
const radioGroupName = `radio-group-${Math.random().toString(36).substr(2, 9)}`
const generateId = (optionId: string) => `radio-list-${optionId}-${Math.random().toString(36).substr(2, 9)}`
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
          'bg-blue-50 border-blue-200': modelValue === option.value,
          'opacity-50 cursor-not-allowed': option.disabled
        }"
      >
        <div class="relative">
          <input
            :id="generateId(option.id)"
            type="radio"
            :name="radioGroupName"
            :value="option.value"
            :checked="modelValue === option.value"
            @change="selectOption(option.value)"
            :disabled="option.disabled"
            class="sr-only"
          />
          <div
            @click="!option.disabled && selectOption(option.value)"
            class="w-5 h-5 rounded-full border-2 cursor-pointer transition-all duration-200 flex items-center justify-center"
            :class="{
              'border-blue-500': modelValue === option.value && !option.disabled,
              'border-gray-300': modelValue !== option.value && !option.disabled,
              'border-gray-200 cursor-not-allowed': option.disabled,
              'hover:border-blue-400': !option.disabled && modelValue !== option.value,
              'hover:border-blue-600': !option.disabled && modelValue === option.value
            }"
          >
            <div
              v-show="modelValue === option.value"
              class="w-2.5 h-2.5 rounded-full transition-all duration-200"
              :class="{
                'bg-blue-500': !option.disabled,
                'bg-gray-400': option.disabled
              }"
            />
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