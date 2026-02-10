<template>
  <!-- Render child routes (like [id].vue) if they exist, otherwise render the listing -->
  <NuxtPage v-if="hasIdParam" />
  <ServiceRequestsPage v-else />
</template>

<script setup lang="ts">
import ServiceRequestsPage from '~/features/service-requests/ServiceRequestsPage.vue'

const route = useRoute()
const hasIdParam = computed(() => !!route.params.id)

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>
