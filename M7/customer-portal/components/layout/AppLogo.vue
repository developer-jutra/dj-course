<template>
  <img src="/deliveroo-logo.png" alt="Deliveroo Logo" :class="sizeClass" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'h-10'
  }
})

const sizeClass = computed(() => {
  return `${props.size} w-auto`
})
</script>