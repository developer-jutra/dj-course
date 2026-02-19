<template>
  <div class="container mx-auto py-8 prose dark:prose-invert" v-html="htmlContent"></div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import content from '~/assets/markdown/terms-of-service.md?raw'

const htmlContent = marked.parse(content)

definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
:deep(h1) {
  font-size: 2.25rem;
}
:deep(h2) {
  font-size: 1.875rem;
}
:deep(h3) {
  font-size: 1.5rem;
}
:deep(h4) {
  font-size: 1.25rem;
}
:deep(h5) {
  font-size: 1.125rem;
}
:deep(h6) {
  font-size: 1rem;
}

:deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

:deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
}

:deep(ul) {
  margin-left: 1.5rem;
  list-style-type: disc;
  margin-bottom: 1rem;
}

:deep(ol) {
  margin-left: 1.5rem;
  list-style-type: decimal;
  margin-bottom: 1rem;
}

:deep(a) {
  color: #2563eb;
  text-decoration: underline;
}
</style> 