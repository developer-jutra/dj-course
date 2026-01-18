<template>
  <BillingPage />
</template>

<script setup lang="ts">
import { BillingPage } from '~/features/billing'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>