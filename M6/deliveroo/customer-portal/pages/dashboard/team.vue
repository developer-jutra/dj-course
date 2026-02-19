<template>
  <TeamPage />
</template>

<script setup lang="ts">
import TeamPage from '~/features/team/TeamPage.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>