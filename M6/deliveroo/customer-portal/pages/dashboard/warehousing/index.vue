<template>
  <StorageListingPage />
</template>

<script setup lang="ts">
import StorageListingPage from "~/features/warehousing/storage-listing/StorageListingPage.vue";

definePageMeta({ layout: "dashboard", middleware: "auth" })
</script>
