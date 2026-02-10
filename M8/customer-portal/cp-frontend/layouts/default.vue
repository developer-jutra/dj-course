<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <AppHeaderGuest />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
// Explicit imports to ensure components are resolved
import AppHeaderGuest from '~/components/layout/AppHeaderGuest.vue'
import AppFooter from '~/components/layout/AppFooter.vue'
</script>