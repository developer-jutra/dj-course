<template>
  <TrackingPage />
</template>

<script setup lang="ts">
import TrackingPage from '~/features/tracking/TrackingPage.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>