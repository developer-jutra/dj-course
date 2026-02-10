<script setup lang="ts">
// Redirect to transportation tab by default
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

// Redirect to transportation tab
navigateTo('/dashboard/requests/transportation')
</script>