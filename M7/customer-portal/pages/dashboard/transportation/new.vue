<template>
  <SubmitTransportationRequestPage />
</template>

<script setup lang="ts">
import SubmitTransportationRequestPage from '~/features/transportation/submit-transportation-request/SubmitTransportationRequestPage.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script> 