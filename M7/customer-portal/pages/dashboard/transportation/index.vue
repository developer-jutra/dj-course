<template>
  <ShipmentListing />
</template>

<script setup lang="ts">
import ShipmentListing from "~/features/transportation/shipment-listing/ShipmentListingPage.vue";

definePageMeta({ layout: "dashboard", middleware: "auth" })
</script>
