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
  modelValue?: string[]
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search and select options...',
  modelValue: () => []
})

const emit = defineEmits<Emits>()

const isOpen = ref(false)
const searchQuery = ref('')
const componentRef = ref<HTMLElement>()
const inputRef = ref<HTMLInputElement>()

const selectedOptions = ref<Option[]>(
  props.options.filter(option => props.modelValue.includes(option.value))
)

const filteredOptions = computed(() => {
  return props.options.filter(option => 
    option.label.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
    !selectedOptions.value.find(selected => selected.id === option.id)
  )
})

const addOption = (option: Option) => {
  selectedOptions.value.push(option)
  emit('update:modelValue', selectedOptions.value.map(opt => opt.value))
  searchQuery.value = ''
  inputRef.value?.focus()
}

const removeOption = (optionId: string) => {
  selectedOptions.value = selectedOptions.value.filter(option => option.id !== optionId)
  emit('update:modelValue', selectedOptions.value.map(opt => opt.value))
}

const focusInput = () => {
  isOpen.value = true
  inputRef.value?.focus()
}

const handleClickOutside = (event: MouseEvent) => {
  if (componentRef.value && !componentRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="relative w-full max-w-md" ref="componentRef">
    <div
      @click="focusInput"
      class="min-h-[48px] bg-white border border-gray-300 rounded-lg px-3 py-2 cursor-text hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-20 transition-colors duration-200"
    >
      <div class="flex flex-wrap gap-2 items-center">
        <span
          v-for="option in selectedOptions"
          :key="option.id"
          class="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors duration-150"
        >
          {{ option.label }}
          <button
            @click.stop="removeOption(option.id)"
            class="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-300 transition-colors duration-150"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
        <input
          ref="inputRef"
          v-model="searchQuery"
          @focus="isOpen = true"
          :placeholder="selectedOptions.length === 0 ? placeholder : ''"
          class="flex-1 min-w-[100px] outline-none bg-transparent text-gray-900 placeholder-gray-400"
        />
      </div>
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
            v-for="option in filteredOptions"
            :key="option.id"
            @click="addOption(option)"
            class="px-4 py-2 text-gray-900 cursor-pointer hover:bg-blue-50 hover:text-blue-900 transition-colors duration-150"
          >
            {{ option.label }}
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>