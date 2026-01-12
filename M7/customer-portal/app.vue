<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <VueQueryDevtools :initial-is-open="false" />
    </ClientOnly>
  </div>
</template>
<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
</script>
