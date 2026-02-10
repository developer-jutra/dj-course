<template>
  <StorageDetailsPage />
</template>

<script setup lang="ts">
import StorageDetailsPage from "~/features/warehousing/storage-details/StorageDetailsPage.vue"

definePageMeta({ layout: "dashboard", middleware: "auth" })
</script>
