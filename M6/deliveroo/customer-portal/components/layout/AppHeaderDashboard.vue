<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex-shrink-0">
          <NuxtLink to="/dashboard">
            <AppLogo />
          </NuxtLink>
        </div>
        <div class="hidden md:block">
          <ThemeToggle />
          
          <NuxtLink
            to="/dashboard"
            class="inline-block bg-success-600 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-success-700 transition-colors"
          >
            Dashboard
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// Simplified dashboard header - no navigation items or scroll functionality needed
</script> 