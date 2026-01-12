<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <DashboardMenu v-model:open="sidebarOpen" v-model:collapsed="sidebarCollapsed" />
    
    <div :class="[
      'transition-all duration-300 ease-in-out',
      sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-60'
    ]">
      <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <button type="button" class="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden" @click="sidebarOpen = true">
          <span class="sr-only">Open sidebar</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
        
        <!-- Collapse button for desktop -->
        <button 
          type="button" 
          class="hidden lg:flex -m-2.5 p-2.5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" 
          @click="sidebarCollapsed = !sidebarCollapsed"
        >
          <span class="sr-only">{{ sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar' }}</span>
          <ChevronLeftIcon 
            :class="[
              'h-5 w-5 transition-transform duration-300 ease-in-out',
              sidebarCollapsed ? 'rotate-180' : ''
            ]" 
          />
        </button>
        
        <div class="h-6 w-px bg-gray-200 dark:bg-gray-700 lg:hidden" aria-hidden="true" />
        
        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end">
          <div class="flex items-center gap-x-4 lg:gap-x-6">
            <!-- Theme Toggle -->
            <ThemeToggle />
            
            <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-gray-700" aria-hidden="true" />
            
            <DashboardHeader />
          </div>
        </div>
      </div>
      
      <main class="py-10">
        <div class="px-4 sm:px-6 lg:px-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardMenu from '~/components/layout/DashboardMenu.vue'
import DashboardHeader from '~/components/layout/DashboardHeader.vue'
import ThemeToggle from '~/components/ui-library/ThemeToggle.vue'
import { Bars3Icon, ChevronLeftIcon } from '@heroicons/vue/24/outline'

const sidebarOpen = ref(false)
const sidebarCollapsed = ref(false)
const authStore = useAuthStore()

onMounted(() => {
  // Load sidebar state from localStorage
  const savedCollapsed = localStorage.getItem('sidebar_collapsed')
  if (savedCollapsed !== null) {
    sidebarCollapsed.value = savedCollapsed === 'true'
  }
})

// Save sidebar state to localStorage when it changes
watch(sidebarCollapsed, (newValue) => {
  if (process.client) {
    localStorage.setItem('sidebar_collapsed', newValue.toString())
  }
})
</script>