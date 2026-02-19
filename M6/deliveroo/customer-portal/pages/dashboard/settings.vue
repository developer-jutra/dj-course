<template>
  <SettingsPage />
</template>

<script setup lang="ts">
import SettingsPage from '~/features/settings/SettingsPage.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>