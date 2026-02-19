<template>
  <DashboardPage />
</template>

<script setup lang="ts">
import DashboardPage from '~/features/dashboard/DashboardPage.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>