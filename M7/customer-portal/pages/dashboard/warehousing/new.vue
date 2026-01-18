<template>
  <SubmitWarehousingRequestPage />
</template>

<script setup lang="ts">
import SubmitWarehousingRequestPage from '~/features/warehousing/submit-warehousing-request/SubmitWarehousingRequestPage.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script> 