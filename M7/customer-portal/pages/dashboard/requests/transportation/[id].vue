<template>
  <TransportationRequestDetailsPage />
</template>

<script setup lang="ts">
import TransportationRequestDetailsPage from '~/features/transportation/transportation-request-details/TransportationRequestDetailsPage.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script> 