<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Option {
  id: string
  label: string
  value: string
}

interface Props {
  options: Option[]
  placeholder?: string
  modelValue?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search for an option...'
})

const emit = defineEmits<Emits>()

const isOpen = ref(false)
const searchQuery = ref('')
const componentRef = ref<HTMLElement>()
const inputRef = ref<HTMLInputElement>()
const highlightedIndex = ref(-1)

const selectedOption = ref<Option | null>(
  props.options.find(option => option.value === props.modelValue) || null
)

const filteredOptions = computed(() => {
  return props.options.filter(option => 
    option.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const selectOption = (option: Option) => {
  selectedOption.value = option
  searchQuery.value = option.label
  emit('update:modelValue', option.value)
  isOpen.value = false
  highlightedIndex.value = -1
}

const clearSelection = () => {
  selectedOption.value = null
  searchQuery.value = ''
  emit('update:modelValue', '')
  inputRef.value?.focus()
}

const handleInput = () => {
  isOpen.value = true
  highlightedIndex.value = -1
  if (selectedOption.value && searchQuery.value !== selectedOption.value.label) {
    selectedOption.value = null
    emit('update:modelValue', '')
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = Math.min(highlightedIndex.value + 1, filteredOptions.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (highlightedIndex.value >= 0) {
        selectOption(filteredOptions.value[highlightedIndex.value])
      }
      break
    case 'Escape':
      isOpen.value = false
      highlightedIndex.value = -1
      break
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (componentRef.value && !componentRef.value.contains(event.target as Node)) {
    isOpen.value = false
    highlightedIndex.value = -1
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  if (selectedOption.value) {
    searchQuery.value = selectedOption.value.label
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="relative w-full max-w-xs" ref="componentRef">
    <div class="relative">
      <input
        ref="inputRef"
        v-model="searchQuery"
        @input="handleInput"
        @focus="isOpen = true"
        @keydown="handleKeydown"
        :placeholder="placeholder"
        class="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
      />
      <button
        v-if="selectedOption"
        @click="clearSelection"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-150"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-show="isOpen && filteredOptions.length > 0"
        class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-auto"
      >
        <ul class="py-1">
          <li
            v-for="(option, index) in filteredOptions"
            :key="option.id"
            @click="selectOption(option)"
            class="px-4 py-2 text-gray-900 cursor-pointer transition-colors duration-150"
            :class="{
              'bg-blue-100 text-blue-900': selectedOption?.id === option.id,
              'bg-blue-50 text-blue-900': highlightedIndex === index,
              'hover:bg-gray-50': highlightedIndex !== index && selectedOption?.id !== option.id
            }"
          >
            {{ option.label }}
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>