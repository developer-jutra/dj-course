<template>
  <ClientOnly>
    <button
      @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
      class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 dark:bg-gray-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      role="switch"
      :aria-checked="colorMode.value === 'dark'"
    >
      <span class="sr-only">Toggle dark mode</span>
      <span
        :class="[
          colorMode.value === 'dark' ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
        ]"
      >
        <span
          :class="[
            colorMode.value === 'dark' ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in',
            'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
          ]"
          aria-hidden="true"
        >
          <SunIcon class="h-3 w-3 text-gray-400" />
        </span>
        <span
          :class="[
            colorMode.value === 'dark' ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out',
            'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
          ]"
          aria-hidden="true"
        >
          <MoonIcon class="h-3 w-3 text-primary-600" />
        </span>
      </span>
    </button>
    <template #fallback>
      <!-- Fallback placeholder with neutral state -->
      <div class="h-6 w-11 rounded-full bg-gray-200 dark:bg-gray-600 border-2 border-transparent"></div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'

const colorMode = useColorMode()
</script>