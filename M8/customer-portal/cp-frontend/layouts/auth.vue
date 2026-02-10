<template>
  <div class="relative min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <VideoBackground />
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white/70 dark:bg-gray-900/80 backdrop-blur-sm py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10">
        <div class="mb-2 text-center">
            <NuxtLink to="/" class="inline-block">
              <AppLogo size="h-30" />
            </NuxtLink>
        </div>
        <slot />
      </div>
    </div>
    
    <div class="mt-8 text-center">
      <ThemeToggle />
    </div>
  </div>
</template>

<script setup lang="ts">
// Explicit imports for components
import VideoBackground from '~/components/layout/VideoBackground.vue'
import AppLogo from '~/components/layout/AppLogo.vue'
import ThemeToggle from '~/components/ui-library/ThemeToggle.vue'
</script>