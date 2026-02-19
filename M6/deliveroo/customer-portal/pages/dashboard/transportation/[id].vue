<template>
  <ShipmentDetailsPage />
</template>

<script setup lang="ts">
import ShipmentDetailsPage from '~/features/transportation/shipment-details/ShipmentDetailsPage.vue'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })
</script> 