<template>
  <WarehousingRequestsDetailsPage />
</template>

<script setup lang="ts">
import WarehousingRequestsDetailsPage from '~/features/warehousing/warehousing-request-details/WarehousingRequestsDetailsPage.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script> 